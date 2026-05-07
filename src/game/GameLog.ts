import { type SettingsModel } from '../types/Settings';
import CyberballGameController from "./CyberballGameController";

interface GameLog {
    type: string, 
    thrower?: number, 
    reciever?: number, 
    wait?: number, 
    leaver?: number, 
    reason?: string, 
    time?: number
}

/**
 * NOTE!!!
 * Whenever providing a thrower or reciever ID, please give the value
 * that the game controller uses (user is -1, first cpu is 0, etc...).
 * Reformatting into the numbers used on the Qualtrics side is handled
 * by the logger! (User -1 => Player 1, CPU 0 => Player 2, etc...)
 * @param controller 
*/
export function addGameLogging(controller: CyberballGameController, settings: SettingsModel) {
    let numPlayers = settings.computerPlayers.length + 1;
    let gameLog: Array<GameLog> = [];
    let timeAtCatch = 0;
    let humanLeaveReason = "";
    let humanMayLeaveTime = 0;

    controller.catchBallCallbacks.addCallback("grab time at catch", () => {
        timeAtCatch = controller.reportTimeSinceStart();
    })

    controller.throwBallCallbacks.addCallback("log throw", (throwerID, recieverID) => {
        console.log("logging throw", throwerID, recieverID, gameLog.length);
        gameLog.push({ "type": "throw", "thrower": throwerID + 2, "reciever": recieverID + 2, "wait": controller.reportTimeSinceStart() - timeAtCatch });
    });

    controller.CPULeaveCallbacks.addCallback("log leave", (cpuID, reason) => {
        gameLog.push({ "type": "CPU leave", "leaver": cpuID + 2, "reason": reason, "time": controller.reportTimeSinceStart() });
    });

    controller.humanPlayerMayLeaveCallbacks.addCallback("log player may leave", reason => {
        gameLog.push({ "type": "player may leave", "reason": reason, "time": controller.reportTimeSinceStart() });

        humanLeaveReason = reason;
        humanMayLeaveTime = controller.reportTimeSinceStart();
    });

    controller.gameEndCallbacks.addCallback("log and post game end", reason => {
        console.log("game ending, log length:", gameLog.length, "throwCount:", controller.model.throwCount);
        gameLog.push({ "type": "game end", "reason": reason, "time": controller.reportTimeSinceStart() });

        processAndReportGameLog(
            controller.model.throwCount, 
            controller.reportTimeSinceStart(),
            numPlayers,
            gameLog,
            humanLeaveReason,
            humanMayLeaveTime
        );
    });
}

function processAndReportGameLog(
    throwCount: number,
    totalTime: number, 
    numPlayers: number,
    gameLog: Array<GameLog>,
    humanLeaveReason: string,
    humanMayLeaveTime: number
) {
    let throwStats: Array<Array<number>> = Array(numPlayers).fill([]).map(() => Array(numPlayers).fill(0));

    for (let entry of gameLog) {
        if (entry.type === "throw" && entry.thrower !== undefined && entry.reciever !== undefined) {
            throwStats[entry.thrower - 1][entry.reciever - 1]++;
        }
    }

    let msg = {
        "game_log": gameLog,
        "throws_formatted": throwStats,
        "player_throws_list": buildListOfPlayerThrows(throwStats, numPlayers),
        "total_throws": throwCount,
        "player_may_leave_reason": humanLeaveReason,
        "player_may_leave_time": humanMayLeaveTime,
        "total_time": totalTime
    };
    console.log(msg)
    //note: shouldn't have to - if debugging and need to see data from postMessage(), use
    // `window.addEventListener('message', (post_msg) => console.log(post_msg.data))` in browser console
    // (post_msg.data should 100% match the console.log above - resulting in two back to back identical messages)
    window.parent.postMessage(msg, '*');
}

function buildListOfPlayerThrows(throwStats: Array<Array<number>>, numPlayers: number) {
    let msg: Record<string, number> = {};

    let loopCount = Math.min(numPlayers, 4)
    for (let i = 0; i < loopCount; i++) {
        for (let j = 0; j < loopCount; j++) {
            if (i != j)
                msg['Player_' + (i + 1) + '_to_Player_' + (j + 1)] = throwStats[i][j];
        }
    }

    return msg;
}