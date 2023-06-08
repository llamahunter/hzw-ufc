import {Component, Player, PropsDefinition, PropTypes} from "@early_access_api/v1";
import {HighScoreUpdateEvent} from "./PointsManager";

type GlobalPointsProps = {
    game1PointsPpv: string,
    game2PointsPpv: string,
    game3PointsPpv: string,
}

class GlobalPoints extends Component<GlobalPointsProps> {
    static propsDefinition:PropsDefinition<GlobalPointsProps> = {
        game1PointsPpv: {type: PropTypes.String},
        game2PointsPpv: {type: PropTypes.String},
        game3PointsPpv: {type: PropTypes.String},
    }

    static readonly GLOBAL_HIGH_SCORE_PPV = "overallScores";

    readonly gamePointsPpvs: string[] = []

    start() {
        this.connectBroadcastEvent(HighScoreUpdateEvent, this.onHighScoreUpdate.bind(this));
        const {game1PointsPpv, game2PointsPpv, game3PointsPpv} = this.props
        if (game1PointsPpv) {
            this.gamePointsPpvs.push(this.props.game1PointsPpv);
        }
        if (game2PointsPpv) {
            this.gamePointsPpvs.push(this.props.game2PointsPpv);
        }
        if (game3PointsPpv) {
            this.gamePointsPpvs.push(this.props.game3PointsPpv);
        }
    }

    onHighScoreUpdate(data: {player: Player}) {
        const {player} = data;
        const totalHighScore = this.gamePointsPpvs.reduce((total, ppv) => {
            return total + this.world.persistentStorage.getPlayerVariable(player, ppv);
        }, 0);
        this.world.leaderboards.setScoreForPlayer(GlobalPoints.GLOBAL_HIGH_SCORE_PPV, player, totalHighScore, true);
    }
}

Component.register(GlobalPoints)
