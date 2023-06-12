import {
    AudioGizmo, CodeBlockEvent,
    CodeBlockEvents,
    Component,
    Entity,
    HorizonEvent,
    Player,
    PropsDefinition,
    PropTypes,
    TextGizmo
} from "@early_access_api/v1";
import {StrikeGenerator, strikeName, StrikeSequence} from "./StrikeSequences";

export const Events = {
    resetGame: new HorizonEvent<{}>("resetGame"),
    playerReady: new HorizonEvent<{playerNum: number, isReady: boolean}>("playerReady"),
    startGameCountdown: new HorizonEvent<{seconds: number}>("startGameCountdown"),
    stopGameCountdown: new HorizonEvent<{}>("stopGameCountdown"),
    getPlayerHandedness: new HorizonEvent<{player: Player}>("getPlayerHandedness"),
    hideButton: new HorizonEvent<{}>("hideButton"),
    playerHandedness: new HorizonEvent<{isRightHanded: boolean}>("playerHandedness"),
    startGame: new HorizonEvent<{strikeGenerator?: StrikeGenerator}>("startGame"),
    nextSequence: new HorizonEvent<{}>("nextSequence"),
    sequenceDone: new HorizonEvent<{playerNum: number}>("sequenceDone"),
    playerLost: new HorizonEvent<{playerNum: number}>("playerLost"),
    startTimer: new HorizonEvent<{msec: number, wholeSeconds: boolean}>("startTimer"),
    stopTimer: new HorizonEvent<{}>("stopTimer"),
    timerDone: new HorizonEvent<{}>("timerDone"),

    detectorStrikeType: new CodeBlockEvent<[hand: string, punch: string, target: string]>("detectorStrikeType", [PropTypes.String, PropTypes.String, PropTypes.String]),
    detectorClearPeer: new HorizonEvent("detectorClearPeer"),
    detectorClearStrike: new CodeBlockEvent<[]>("detectorClearStrike", []),
    detectorHit: new CodeBlockEvent<[isHit: boolean]>("detectorHit", [PropTypes.Boolean]),
}

type StrikeGameProps = {
    player0Controller: Entity,
    player1Controller: Entity,
    statusTxt: Entity,
    roundSfx: Entity,
    numEasy: number,
    numMedium: number,
}

class StrikeGame extends Component<StrikeGameProps> {
    static propsDefinition:PropsDefinition<StrikeGameProps> = {
        player0Controller: {type: PropTypes.Entity},
        player1Controller: {type: PropTypes.Entity},
        statusTxt: {type: PropTypes.Entity},
        roundSfx: {type: PropTypes.Entity},
        numEasy: {type: PropTypes.Number, default: 5},
        numMedium: {type: PropTypes.Number, default: 5},
    }

    static readonly START_COUNTDOWN_SECS = 10

    countdownTimeout = -1
    inGame = false
    playerActive = [false, false]
    playerPunching = [false, false]

    start() {
        this.connectBroadcastEvent(Events.resetGame, this.resetGame.bind(this))
        this.connectEntityEvent(this.entity, Events.playerReady, this.playerStatus.bind(this))
        this.connectEntityEvent(this.entity, Events.playerReady, this.playerStatus.bind(this))
        this.connectEntityEvent(this.entity, Events.sequenceDone, this.sequenceDone.bind(this))
        this.connectEntityEvent(this.entity, Events.playerLost, this.playerLost.bind(this))
        this.async.setTimeout(() => this.sendBroadcastEvent(Events.resetGame, {}), 1000)
    }

    private resetGame() {
        this.inGame = false
        this.setStatus("Waiting for players")
    }

    playerStatus(data: {playerNum: number, isReady: boolean}) {
        if (!this.inGame) {
            const prevReadyPlayers = this.playerActive[0] || this.playerActive[1]
            this.playerActive[data.playerNum] = data.isReady
            const nowReadyPlayers = this.playerActive[0] || this.playerActive[1]
            console.log("prevReadyPlayers", prevReadyPlayers, "nowReadyPlayers", nowReadyPlayers)
            if (!this.inGame) {
                if (prevReadyPlayers !== nowReadyPlayers) {
                    if (nowReadyPlayers) {
                        this.countdownTimeout = this.async.setTimeout(this.countdownDone.bind(this), StrikeGame.START_COUNTDOWN_SECS * 1000 + 100)
                        this.sendEntityEvent(this.props.player0Controller, Events.startGameCountdown,
                            {seconds: StrikeGame.START_COUNTDOWN_SECS})
                        this.sendEntityEvent(this.props.player1Controller, Events.startGameCountdown,
                            {seconds: StrikeGame.START_COUNTDOWN_SECS})
                    } else {
                        this.async.clearTimeout(this.countdownTimeout)
                        this.countdownTimeout = -1
                        this.sendEntityEvent(this.props.player0Controller, Events.stopGameCountdown, {})
                        this.sendEntityEvent(this.props.player1Controller, Events.stopGameCountdown, {})
                    }
                }
            } else {
                if (!nowReadyPlayers) {
                    this.sendBroadcastEvent(Events.resetGame, {})
                }
            }
        }
    }

    private countdownDone() {
        this.countdownTimeout = -1
        this.inGame = true
        const strikeGenerator = new StrikeGenerator(this.props.numEasy, this.props.numMedium)
        this.sendEntityEvent(this.props.player0Controller, Events.startGame, {strikeGenerator: this.playerActive[0] ? strikeGenerator : undefined})
        this.sendEntityEvent(this.props.player1Controller, Events.startGame, {strikeGenerator: this.playerActive[1] ? strikeGenerator : undefined})
        this.sendNextSequence()
    }

    sendNextSequence() {
        if (this.inGame) {
            this.setStatus("Next Sequence")
            this.playerPunching = this.playerActive.slice()
            if (this.playerActive[0]) {
                this.sendEntityEvent(this.props.player0Controller, Events.nextSequence, {})
            }
            if (this.playerActive[1]) {
                this.sendEntityEvent(this.props.player1Controller, Events.nextSequence, {})
            }
        }
    }

    sequenceDone(data: {playerNum: number}) {
        this.playerPunching[data.playerNum] = false
        if (!this.playerPunching[0] && !this.playerPunching[1]) {
            this.setStatus("Round Over!")
            this.props.roundSfx.as(AudioGizmo).play()
            this.async.setTimeout(() => {
                this.sendNextSequence()
            }, 3000)
        }
    }

    playerLost(data: {playerNum: number}) {
        this.playerActive[data.playerNum] = false
        const playersActive = this.playerActive[0] || this.playerActive[1]
        if (!playersActive) {
            // game is over
            this.setStatus("Game Over!")
            this.async.setTimeout(() => {
                this.sendBroadcastEvent(Events.resetGame, {})
            }, 5000)
        }
    }

    private setStatus(status: string) {
        this.props.statusTxt.as(TextGizmo).text.set(status)
    }
}

Component.register(StrikeGame)

type PlayerControllerProps = {
    game: Entity,
    playerTrigger: Entity,
    timer: Entity,
    headDetector: Entity,
    bodyDetector: Entity,
    strikeTxt: Entity,
    leftButton: Entity,
    rightButton: Entity,
    timerDoneSfx: Entity,
    hitSfx: Entity,
    buzzerSfx: Entity,
    playerNum: number,
    startTimeoutSecs: number,
    timeoutReductionFactor: number,
    minimumTimeoutSecs: number,
}

class PlayerController extends Component<PlayerControllerProps> {
    static propsDefinition:PropsDefinition<PlayerControllerProps> = {
        game: {type: PropTypes.Entity},
        playerTrigger: {type: PropTypes.Entity},
        timer: {type: PropTypes.Entity},
        headDetector: {type: PropTypes.Entity},
        bodyDetector: {type: PropTypes.Entity},
        strikeTxt: {type: PropTypes.Entity},
        leftButton: {type: PropTypes.Entity},
        rightButton: {type: PropTypes.Entity},
        timerDoneSfx: {type: PropTypes.Entity},
        hitSfx: {type: PropTypes.Entity},
        buzzerSfx: {type: PropTypes.Entity},
        playerNum: {type: PropTypes.Number},
        startTimeoutSecs: {type: PropTypes.Number, default: 10},
        timeoutReductionFactor: {type: PropTypes.Number, default: 0.9},
        minimumTimeoutSecs: {type: PropTypes.Number, default: 1},
    }

    private player?: Player
    private isRightHanded = false
    private inGame = false
    private strikeGenerator?: StrikeGenerator
    private strikeCount = 0
    private points = 0
    private currentTimeoutMsec = 0
    private currentSequence?: StrikeSequence

    start() {
        this.connectBroadcastEvent(Events.resetGame, this.resetGame.bind(this))
        this.connectCodeBlockEvent(this.props.playerTrigger, CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnter.bind(this));
        this.connectCodeBlockEvent(this.props.playerTrigger, CodeBlockEvents.OnPlayerExitTrigger, this.onPlayerExit.bind(this));
        this.connectEntityEvent(this.entity, Events.startGameCountdown, this.onStartGameCountdown.bind(this))
        this.connectEntityEvent(this.entity, Events.stopGameCountdown, this.onStopGameCountdown.bind(this))
        this.connectEntityEvent(this.entity, Events.playerHandedness, this.onPlayerHandedness.bind(this))
        this.connectEntityEvent(this.entity, Events.nextSequence, this.nextSequence.bind(this))
        this.connectEntityEvent(this.entity, Events.timerDone, this.onTimerDone.bind(this))
        this.connectEntityEvent(this.entity, Events.startGame, this.onStartGame.bind(this))
        this.connectCodeBlockEvent(this.entity, Events.detectorHit, this.onDetectorHit.bind(this))
        this.props.strikeTxt.as(TextGizmo).text.set("")
    }

    private resetGame() {
        this.player = undefined
        this.isRightHanded = false
        this.inGame = false
        this.strikeGenerator = undefined
        this.strikeCount = 0
        this.points = 0
        this.currentTimeoutMsec = 0
        this.currentSequence = undefined
        this.props.strikeTxt.as(TextGizmo).text.set("")
        this.showHandednessButtons(false)
    }

    onPlayerEnter(player: Player) {
        if (this.player === undefined && !this.inGame) {
            this.player = player
            this.isRightHanded = true
            this.props.headDetector.owner.set(player)
            this.props.bodyDetector.owner.set(player)
            this.sendEntityEvent(this.props.game, Events.playerReady, {playerNum: this.props.playerNum, isReady: true})
            this.showHandednessButtons(true)
        } else {
            this.world.ui.showPopupForPlayer(player, "Game in progress", 2)
        }
    }

    onPlayerExit(player: Player) {
        if (this.player === player) {
            this.player = undefined
            this.props.headDetector.owner.set(this.world.getServerPlayer())
            this.props.bodyDetector.owner.set(this.world.getServerPlayer())
            if (!this.inGame) {
                this.showHandednessButtons(false)
                this.sendEntityEvent(this.props.game, Events.playerReady, {playerNum: this.props.playerNum, isReady: false})
            } else {
                this.playerLost()
            }
        }
    }

    onStartGameCountdown(data: {seconds: number}) {
        console.log("onStartGameCountdown")
        this.showHandednessButtons(true)
        this.sendEntityEvent(this.props.timer, Events.startTimer, {msec: data.seconds * 1000, wholeSeconds: true})
    }

    onStopGameCountdown(data: {}) {
        console.log("onStopGameCountdown")
        this.showHandednessButtons(false)
        this.sendEntityEvent(this.props.timer, Events.stopTimer, {})
    }

    showHandednessButtons(shown: boolean) {
        if (shown && this.player) {
            this.sendEntityEvent(this.props.leftButton, Events.getPlayerHandedness, {player: this.player})
            this.sendEntityEvent(this.props.rightButton, Events.getPlayerHandedness, {player: this.player})
        } else {
            this.sendEntityEvent(this.props.leftButton, Events.hideButton, {})
            this.sendEntityEvent(this.props.rightButton, Events.hideButton, {})
        }
    }

    onPlayerHandedness(data: {isRightHanded: boolean}) {
        this.showHandednessButtons(false)
        this.isRightHanded = data.isRightHanded
    }

    onTimerDone(data: {}) {
        console.log("onTimerDone")
        if (this.inGame) {
            // in game, so player lost
            console.log("timer expired in game")
            this.playerLost()
        } else {
            // in countdown
            console.log("timer expired in countdown")
            this.showHandednessButtons(false)
            this.props.timerDoneSfx.as(AudioGizmo).play()
        }
    }

    onStartGame(data: {strikeGenerator?: StrikeGenerator}) {
        console.log("onStartGame")
        this.strikeGenerator = data.strikeGenerator
        this.inGame = true
        this.points = 0
        this.strikeCount = 0
        this.currentTimeoutMsec = this.props.startTimeoutSecs * 1000
    }

    playerLost() {
        this.sendCodeBlockEvent(this.props.headDetector, Events.detectorClearStrike)
        this.sendCodeBlockEvent(this.props.bodyDetector, Events.detectorClearStrike)
        if (this.strikeGenerator) {
            this.strikeGenerator = undefined
            this.props.strikeTxt.as(TextGizmo).text.set("You Lost!")
            this.props.buzzerSfx.as(AudioGizmo).play()
            this.async.setTimeout(() => {
                this.props.strikeTxt.as(TextGizmo).text.set("")
            }, 5000)
            this.sendEntityEvent(this.props.timer, Events.stopTimer, {})
            this.sendEntityEvent(this.props.game, Events.playerLost, {playerNum: this.props.playerNum})
        }
    }

    private nextSequence() {
        if (this.strikeGenerator) {
            this.currentSequence = this.strikeGenerator.getNextSequence(this.strikeCount++)
            console.log("nextSequence", this.currentSequence)
            this.sendEntityEvent(this.props.timer, Events.startTimer, {msec: this.currentTimeoutMsec, wholeSeconds: false})
            this.currentTimeoutMsec = Math.floor(Math.max(this.props.minimumTimeoutSecs * 1000, this.currentTimeoutMsec * this.props.timeoutReductionFactor))
            this.displayNextStrike()
        } else {
            console.log("player already lost")
        }
    }

    private displayNextStrike() {
        const currentStrike = this.currentSequence?.shift()
        if (currentStrike) {
            console.log("nextStrike", currentStrike)
            // there's another strike in this sequence
            this.props.strikeTxt.as(TextGizmo).text.set(strikeName(currentStrike, this.isRightHanded))
            this.sendCodeBlockEvent(this.props.headDetector, Events.detectorStrikeType, currentStrike.hand, currentStrike.punch, currentStrike.target)
            this.sendCodeBlockEvent(this.props.bodyDetector, Events.detectorStrikeType, currentStrike.hand, currentStrike.punch, currentStrike.target)
        } else {
            // no more strikes in this sequence
            this.props.strikeTxt.as(TextGizmo).text.set("")
            this.sendEntityEvent(this.props.timer, Events.stopTimer, {})
            this.sendEntityEvent(this.props.game, Events.sequenceDone, {playerNum: this.props.playerNum})
        }
    }

    private onDetectorHit(isHit: boolean) {
        this.sendCodeBlockEvent(this.props.headDetector, Events.detectorClearStrike)
        this.sendCodeBlockEvent(this.props.bodyDetector, Events.detectorClearStrike)
        if (isHit) {
            console.log("strikeHit")
            // wait a small amount for hand to clear before next strike
            this.async.setTimeout(() => {
                this.displayNextStrike()
            }, 250)
        } else {
            console.log("strikeMiss")
            this.playerLost()
        }
    }
}

Component.register(PlayerController)

type CountdownTimerProps = {
    clockTxt: Entity,
    tickSfx: Entity,
    playerController: Entity,
}

class CountdownTimer extends Component<CountdownTimerProps> {
    static propsDefinition:PropsDefinition<CountdownTimerProps> = {
        clockTxt: {type: PropTypes.Entity},
        tickSfx: {type: PropTypes.Entity},
        playerController: {type: PropTypes.Entity},
    }

    private timeRemainingMsec = 0
    private tickInterval = -1
    private wholeSeconds = false

    start() {
        this.connectEntityEvent(this.entity, Events.startTimer, this.startTimer.bind(this));
        this.connectEntityEvent(this.entity, Events.stopTimer, this.stopTimer.bind(this));
        this.stopTimer()
    }

    startTimer(data: {msec: number, wholeSeconds: boolean}) {
        this.timeRemainingMsec = data.msec
        this.wholeSeconds = data.wholeSeconds
        this.async.clearInterval(this.tickInterval)
        this.tickInterval = this.async.setInterval(this.onTick.bind(this), 100);
    }

    stopTimer() {
        this.async.clearInterval(this.tickInterval)
        this.props.clockTxt.as(TextGizmo).text.set("")
    }

    private onTick() {
        this.timeRemainingMsec -= 100
        this.props.clockTxt.as(TextGizmo).text.set((this.timeRemainingMsec / 1000).toFixed(this.wholeSeconds ? 0 : 1))
        if (this.timeRemainingMsec % 1000 === 0) {
            this.props.tickSfx.as(AudioGizmo).play()
        }
        if (this.timeRemainingMsec <= 0) {
            this.async.clearInterval(this.tickInterval)
            this.async.setTimeout(() => {
                this.props.clockTxt.as(TextGizmo).text.set("")
            }, 1000)
            this.sendEntityEvent(this.props.playerController, Events.timerDone, {})
        }
    }
}

Component.register(CountdownTimer)

type HandednessButtonProps = {
    playerController: Entity,
    isRightHand: boolean
}

class HandednessButton extends Component<HandednessButtonProps> {
    static propsDefinition:PropsDefinition<HandednessButtonProps> = {
        playerController: {type: PropTypes.Entity},
        isRightHand: {type: PropTypes.Boolean, default: false},
    }

    player?: Player

    start() {
        this.connectEntityEvent(this.entity, Events.getPlayerHandedness, this.onGetPlayerHandedness.bind(this));
        this.connectEntityEvent(this.entity, Events.hideButton, this.onHideButton.bind(this));
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerCollision, this.onPlayerCollision.bind(this));
    }

    onGetPlayerHandedness(data: {player: Player}) {
        this.player = data.player
        this.entity.visible.set(true)
        this.entity.collidable.set(true)
    }

    onHideButton(data: {}) {
        this.entity.visible.set(false)
        this.entity.collidable.set(false)
    }

    onPlayerCollision(player: Player) {
        if (this.player === player) {
            this.sendEntityEvent(this.props.playerController, Events.playerHandedness, {isRightHanded: this.props.isRightHand})
        }
    }
}

Component.register(HandednessButton)
