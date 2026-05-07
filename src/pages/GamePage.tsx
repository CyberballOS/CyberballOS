import React, { useEffect, useRef } from 'react';
import Phaser, { Scale } from 'phaser';
import { useSearchParams } from 'react-router-dom';
import { CyberballScene } from '../scenes/cyberball';
import CyberballGameController from '../game/CyberballGameController';
import addCpuTargeting from '../game/CpuTargeting';
import CyberballGameModel from '../game/CyberballGameModel';
import addAllLeaveTriggers from '../game/LeaveTriggers';
import addGameOverTriggers from '../game/GameOverTriggers';
import { addGameLogging } from '../game/GameLog';
import { defaultSettings } from '../types/Settings';

const GamePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const settingsParam = searchParams.get('settings');
    const playerName = searchParams.get('playerName');
    const gameRef = useRef<Phaser.Game | null>(null);
    const gameWidth = 900;

    useEffect(() => { 
        console.log("useEffect running", Date.now());
        let newSettings = defaultSettings();
        if (settingsParam) {
            const parsed = JSON.parse(atob(settingsParam));
            console.log('parsed settings:', parsed);
            newSettings = {
                ...defaultSettings(),
                ...parsed,
                get hasPortraits(): boolean {
                    return this.computerPlayers.some(cpu => cpu.portraitBuff) || !!this.player.portraitBuff;
                }
            };
        }
        if (playerName) {
            newSettings.player.name = playerName;
        }

        let gameHeight = 460;
        if (newSettings.hasPortraits) {
            gameHeight += newSettings.portraitHeight * 2 + newSettings.portraitPadding * 4;
        }

        const controller = new CyberballGameController(
            CyberballGameModel.humanPlayerId,
            newSettings.computerPlayers.length
        );
        addGameLogging(controller, newSettings);
        addCpuTargeting(controller, newSettings);
        addAllLeaveTriggers(controller, newSettings);
        addGameOverTriggers(controller, newSettings);

        const scene = new CyberballScene(newSettings, controller);
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: gameWidth,
            height: gameHeight,
            backgroundColor: '#fff',
            scale: {
                mode: Scale.ScaleModes.FIT,
                parent: 'phaser-container',
                width: gameWidth,
                height: gameHeight
            },
            scene,
            physics: { default: 'arcade' },
            dom: { createContainer: true },
            parent: 'phaser-container'
        };

        gameRef.current?.destroy(true);
        gameRef.current = new Phaser.Game(config);

        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, [settingsParam, playerName]);

    return (
        <div
            id="phaser-container"
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'fixed',
                top: 0,
                left: 0,
            }}
        />
    );
};

export default GamePage;