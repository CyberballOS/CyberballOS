export const LeaveTrigger = {
  Turn: 1,
  Time: 2,
  Ignored: 4,
  OtherLeaver: 8,
  TimeIgnored: 16
} as const;

export type LeaveTrigger = typeof LeaveTrigger[keyof typeof LeaveTrigger];

export type PlayerSettingsModel = {
  name: string;
  tint?: string;
  portrait?: string;
  portraitBuff?: string;
  leaveTrigger?: number;

  leaveTurn?: number;
  leaveTurnVariance?: number;

  leaveTime?: number;
  leaveTimeVariance?: number;

  leaveIgnored?: number;
  leaveIgnoredVariance?: number;

  leaveTimeIgnored?: number;
  leaveTimeIgnoredVariance?: number;

  leaveOtherLeaver?: number;
};

export type CpuSettingsModel = PlayerSettingsModel & {
  targetPreference: number[];

  throwDelay: number;
  throwDelayVariance: number;

  catchDelay: number;
  catchDelayVariance: number;

  leaveTurnChance?: number;
  leaveTimeChance?: number;
  leaveIgnoredChance?: number;
  leaveTimeIgnoredChance?: number;
  leaveOtherLeaverChance?: number;
};

export type SettingsModel = {
  player: PlayerSettingsModel;
  computerPlayers: CpuSettingsModel[];

  throwCount: number;
  timeLimit: number;
  displayTimeLimit: boolean;
  timeLimitText: string;
  ballSpeed: number;

  baseUrl: string;
  ballSprite: string;

  useSchedule: boolean;
  scheduleHonorsThrowCount: boolean;
  schedule: number[];
  scheduleText: Record<string, string>;

  selectedGameOverCondition: string;

  ballTint?: string;
  displayBallSettings: boolean;

  portraitHeight: number;
  portraitPadding: number;

  useCorsProxy: boolean;

  gameOverText: string;
  gameOverOpacity: number;
  defaultPortraits: string[];

  displayPlayerCustomizations: boolean;
  displayPlayerLeaveTriggers: boolean;

  get hasPortraits(): boolean;
};

export type Settings = SettingsModel;
export type CpuSettings = CpuSettingsModel;

export const defaultSettings = (): SettingsModel => ({
  player: {
    name: "Player 1",
    tint: "#ffffff",
    portraitBuff: "",
    leaveTrigger: 0,
    leaveTurn: 10,
    leaveTurnVariance: 0,
    leaveTime: 40000,
    leaveTimeVariance: 0,
    leaveIgnored: 4,
    leaveIgnoredVariance: 0,
    leaveTimeIgnored: 15000,
    leaveTimeIgnoredVariance: 0,
    leaveOtherLeaver: 1
  },

  computerPlayers: [
    {
      name: "Player 2",
      tint: "#ffffff",
      portraitBuff: "",
      targetPreference: [50, 0, 50],
      throwDelay: 4000,
      throwDelayVariance: 1000,
      catchDelay: 500,
      catchDelayVariance: 200
    },
    {
      name: "Player 3",
      tint: "#ffffff",
      portraitBuff: "",
      targetPreference: [50, 50, 0],
      throwDelay: 4000,
      throwDelayVariance: 1000,
      catchDelay: 500,
      catchDelayVariance: 200
    }
  ],

  throwCount: 30,
  timeLimit: 120000,
  displayTimeLimit: false,
  timeLimitText: "Time Limit:",
  ballSpeed: 500,

  baseUrl: 'assets',
  ballSprite: 'ball.png',

  useSchedule: false,
  scheduleHonorsThrowCount: false,
  schedule: [1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0],
  scheduleText: {},

  selectedGameOverCondition: "throwCount",

  ballTint: "#ffffff",
  displayBallSettings: false,

  portraitHeight: 75,
  portraitPadding: 10,

  useCorsProxy: true,

  gameOverText: "Game Over",
  gameOverOpacity: 0.5,

  displayPlayerCustomizations: false,
  displayPlayerLeaveTriggers: false,

  defaultPortraits: [
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_FD4MuyE9xvXsw4N",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_9WAB10zvcNpYCay",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_9N8Q6TidKIbmmCG",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_50COcfLIQHBGGRo",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_cNkphviD8lW6Aui",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_eaO3Q2E2zIHGilU",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_cCulSSpb7ydhO8S",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_0Gtm9MRNwNePo90",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_eA0WUiP4s6xfelg",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_5mSCyUoqClgL5fo",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_elhZ8gV4ra10TIy",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_dcKcMkN46o0bxeC",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_7WhGUn4IfqKl7qm",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_0qayRbawfVh3SfA",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_b2FWU72a1pAPBfU",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_4TujTNJGvEa9jfM",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_80UFyMIwRPvlhbw",
    "https://osunewarkcotc.pdx1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_9yrharkWwnbCR7g"
  ],

  get hasPortraits(): boolean {
    return this.computerPlayers.some(cpu => cpu.portraitBuff) || !!this.player.portraitBuff;
  }
});