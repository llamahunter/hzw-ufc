import {Player, World} from "@early_access_api/v1";

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
    private static readonly POINTS_PPV = "points";
    private static readonly LEADERBOARD = "scores";

    private readonly winPoints: number
    private readonly losePoints: number
    private readonly maxWin: number
    private readonly maxLose: number
    private readonly streakThreshold: number
    private readonly streakMultiplier: number

    // XXX possibly could cache points here rather than fetching from PPV each time?
    // private points = 0;
    private streakLength = 0;
    private pointFactor = 1;

    constructor(private readonly player: Player, private readonly world: World, options: Partial<PointsManagerOptions> = {}) {
        const opts = {...PointsManagerDefaults, ...options};
        this.winPoints = opts.winPoints;
        this.losePoints = opts.losePoints;
        this.maxWin = opts.maxWin;
        this.maxLose = opts.maxLose;
        this.streakThreshold = opts.streakThreshold;
        this.streakMultiplier = opts.streakMultiplier;
    }

    win() {
        let points = this.world.persistentStorage.getPlayerVariable(this.player, PointsManager.POINTS_PPV);
        points += this.winPoints * this.pointFactor;
        if (points > this.maxWin) {
            points = this.maxWin;
        }
        // XXX does streak start _after_ reaching the threshold, or when reaching threshold? Choosing after.
        this.streakLength++;
        if (this.streakLength >= this.streakThreshold) {
            this.pointFactor = this.streakMultiplier;
        }
        this.recordScore(points);
        return points
    }

    lose() {
        let points = this.world.persistentStorage.getPlayerVariable(this.player, PointsManager.POINTS_PPV);
        points -= this.losePoints;
        if (points < this.maxLose) {
            points = this.maxLose;
        }
        this.streakLength = 0;
        this.pointFactor = 1;
        this.recordScore(points);
        return points;
    }

    reset() {
        this.streakLength = 0;
        this.pointFactor = 1;
        this.recordScore(0);
        return 0;
    }

    private recordScore(points: number) {
        this.world.persistentStorage.setPlayerVariable(this.player, PointsManager.POINTS_PPV, points);
        this.world.leaderboards.setScoreForPlayer(PointsManager.LEADERBOARD, this.player, points, true)
    }
}
