import {Component, Entity, HorizonEvent, Player, World} from "@early_access_api/v1";

export const HighScoreUpdateEvent = new HorizonEvent<{player: Player}>("highScoreUpdate")

export type PointsManagerOptions = {
    winPoints: number,
    losePoints: number,
    maxWin: number,
    maxLose: number,
    streakThreshold: number,
    streakMultiplier: number,
}

export const PointsManagerDefaults: PointsManagerOptions = {
    winPoints: 1,
    losePoints: 1,
    maxWin: 100,
    maxLose: 0,
    streakThreshold: 3,
    streakMultiplier: 2,
}

export class PointsManager {
    private readonly winPoints: number
    private readonly losePoints: number
    private readonly maxWin: number
    private readonly maxLose: number
    private readonly streakThreshold: number
    private readonly streakMultiplier: number

    private points = 0;
    private streakLength = 0;
    private pointFactor = 1;

    constructor(private readonly player: Player,
                private readonly game: Component,
                private readonly highScorePpv: string,
                private readonly leaderboard: string,
                options: Partial<PointsManagerOptions> = {}) {
        const opts = {...PointsManagerDefaults, ...options};
        this.winPoints = opts.winPoints;
        this.losePoints = opts.losePoints;
        this.maxWin = opts.maxWin;
        this.maxLose = opts.maxLose;
        this.streakThreshold = opts.streakThreshold;
        this.streakMultiplier = opts.streakMultiplier;
    }

    win() {
        this.points += this.winPoints * this.pointFactor;
        if (this.points > this.maxWin) {
            this.points = this.maxWin;
        }
        // XXX does streak start _after_ reaching the threshold, or when reaching threshold? Choosing after.
        this.streakLength++;
        if (this.streakLength >= this.streakThreshold) {
            this.pointFactor = this.streakMultiplier;
        }
        this.recordScore();
        return this.points;
    }

    lose() {
        this.points -= this.losePoints;
        if (this.points < this.maxLose) {
            this.points = this.maxLose;
        }
        this.streakLength = 0;
        this.pointFactor = 1;
        this.recordScore();
        return this.points;
    }

    reset(resetHighScore: boolean) {
        this.points = 0;
        this.streakLength = 0;
        this.pointFactor = 1;
        this.recordScore(resetHighScore);
        return this.points;
    }

    private recordScore(resetHighScore: boolean = false) {
        const highScore = this.game.world.persistentStorage.getPlayerVariable(this.player, this.highScorePpv);
        if (resetHighScore || this.points > highScore) {
            this.game.world.persistentStorage.setPlayerVariable(this.player, this.highScorePpv, this.points);
            this.game.sendBroadcastEvent(HighScoreUpdateEvent, {player: this.player});
        }
        this.game.world.leaderboards.setScoreForPlayer(this.leaderboard, this.player, this.points, resetHighScore);
    }
}
