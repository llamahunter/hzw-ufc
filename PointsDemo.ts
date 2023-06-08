import {
    CodeBlockEvents,
    Component,
    Entity, GrabbableEntity, PhysicalEntity,
    Player,
    PropsDefinition,
    PropTypes, TextGizmo
} from "@early_access_api/v1";
import {PointsManager, PointsManagerOptions} from "./PointsManager";

type PointsDemoProps = {
    winButton: Entity,
    loseButton: Entity,
    resetButton: Entity,
    resetHighScoreButton: Entity,
    playerTxt: Entity,
    scoreTxt: Entity,
    ppv: string,
    leaderboard: string,
}

class PointsDemo extends Component<PointsDemoProps> {
    static propsDefinition:PropsDefinition<PointsDemoProps> = {
        winButton: {type: PropTypes.Entity},
        loseButton: {type: PropTypes.Entity},
        resetButton: {type: PropTypes.Entity},
        resetHighScoreButton: {type: PropTypes.Entity},
        playerTxt: {type: PropTypes.Entity},
        scoreTxt: {type: PropTypes.Entity},
        ppv: {type: PropTypes.String},
        leaderboard: {type: PropTypes.String},
    }

    private static demoManagerOptions: Partial<PointsManagerOptions> = {
        winPoints: 2,
        losePoints: 1,
        streakThreshold: 5,
        streakMultiplier: 3,
    }

    private playerPointsManagers = new Map<Player, PointsManager>();

    start() {
        this.props.winButton.as(PhysicalEntity).locked.set(true);
        this.props.loseButton.as(PhysicalEntity).locked.set(true);
        this.props.resetButton.as(PhysicalEntity).locked.set(true);
        this.props.resetHighScoreButton.as(PhysicalEntity).locked.set(true);
        this.connectCodeBlockEvent(this.props.winButton, CodeBlockEvents.OnGrabStart, this.win.bind(this));
        this.connectCodeBlockEvent(this.props.loseButton, CodeBlockEvents.OnGrabStart, this.lose.bind(this));
        this.connectCodeBlockEvent(this.props.resetButton, CodeBlockEvents.OnGrabStart, this.reset.bind(this));
        this.connectCodeBlockEvent(this.props.resetHighScoreButton, CodeBlockEvents.OnGrabStart, this.resetHighScore.bind(this));
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, this.playerExit.bind(this));
    }

    win(isRightHand: boolean, player: Player) {
        this.props.winButton.as(GrabbableEntity).forceRelease();
        const pointsManager = this.getPlayerPointsManager(player);
        this.displayScore(player, pointsManager.win());
    }

    lose(isRightHand: boolean, player: Player) {
        this.props.loseButton.as(GrabbableEntity).forceRelease();
        const pointsManager = this.getPlayerPointsManager(player);
        this.displayScore(player, pointsManager.lose());
    }

    reset(isRightHand: boolean, player: Player) {
        this.props.resetButton.as(GrabbableEntity).forceRelease();
        const pointsManager = this.getPlayerPointsManager(player);
        this.displayScore(player, pointsManager.reset(false));

    }

    resetHighScore(isRightHand: boolean, player: Player) {
        this.props.resetButton.as(GrabbableEntity).forceRelease();
        const pointsManager = this.getPlayerPointsManager(player);
        this.displayScore(player, pointsManager.reset(true));
    }

    playerExit(player: Player) {
        this.playerPointsManagers.delete(player);
    }

    private getPlayerPointsManager(player: Player) {
        let pointsManager = this.playerPointsManagers.get(player);
        if (!pointsManager) {
            pointsManager = new PointsManager(
                player, this,
                this.props.ppv, this.props.leaderboard,
                PointsDemo.demoManagerOptions);
            this.playerPointsManagers.set(player, pointsManager);
        }
        return pointsManager;
    }

    private displayScore(player: Player, score: number) {
        this.props.playerTxt.as(TextGizmo).text.set(player.name.get());
        this.props.scoreTxt.as(TextGizmo).text.set(score.toString());
    }
}

Component.register(PointsDemo);
