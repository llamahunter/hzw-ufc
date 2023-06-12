import {
    CodeBlockEvents,
    Component,
    Entity,
    Player,
    PropsDefinition,
    PropTypes, Quaternion,
    Vec3,
    World
} from "@early_access_api/v1";
import {Events} from "./StrikeGame";
import {Hand, Punch, StrikeType, Target} from "./StrikeSequences";

type StrikeDetectorProps = {
    detectorPeer: Entity,
    centerTrigger: Entity,
    leftTrigger: Entity,
    rightTrigger: Entity,
    bottomTrigger: Entity,
    jabRing: Entity,
    hookRing: Entity,
    uppercutRing: Entity,
    target: string,
    playerController: Entity,
    minimumHitSpeed: number,
    maximumTriggerDistance: number,
}

class StrikeDetector extends Component<StrikeDetectorProps> {
    static propsDefinition: PropsDefinition<StrikeDetectorProps> = {
        detectorPeer: {type: PropTypes.Entity},
        centerTrigger: {type: PropTypes.Entity},
        leftTrigger: {type: PropTypes.Entity},
        rightTrigger: {type: PropTypes.Entity},
        bottomTrigger: {type: PropTypes.Entity},
        jabRing: {type: PropTypes.Entity},
        hookRing: {type: PropTypes.Entity},
        uppercutRing: {type: PropTypes.Entity},
        target: {type: PropTypes.String, default: 'head'},
        playerController: {type: PropTypes.Entity},
        minimumHitSpeed: {type: PropTypes.Number, default: 0},
        maximumTriggerDistance: {type: PropTypes.Number, default: 0.2},
    }

    private strikeType?: StrikeType
    private leftHandPrevPosition = Vec3.zero
    private rightHandPrevPosition = Vec3.zero
    private leftHandVelocity = Vec3.zero
    private rightHandVelocity = Vec3.zero

    start() {
        this.connectCodeBlockEvent(this.entity, Events.detectorStrikeType, this.detectorStrikeType.bind(this))
        this.connectCodeBlockEvent(this.entity, Events.detectorClearStrike, () => this.strikeType = undefined)
        this.connectEntityEvent(this.entity, Events.detectorClearPeer, () => this.strikeType = undefined)
        this.connectBroadcastEvent(World.onUpdate, this.onUpdate.bind(this))
        console.log("player", this.world.getLocalPlayer().name.get())
        this.props.centerTrigger.owner.set(this.world.getLocalPlayer())
        this.props.leftTrigger.owner.set(this.world.getLocalPlayer())
        this.props.rightTrigger.owner.set(this.world.getLocalPlayer())
        this.props.bottomTrigger.owner.set(this.world.getLocalPlayer())
        // wait a second for ownership transfer to complete before wiring listeners
        this.async.setTimeout(() => {
            this.connectCodeBlockEvent(this.props.centerTrigger, CodeBlockEvents.OnPlayerEnterTrigger,
                () => this.onTriggerEnter(this.props.centerTrigger))
            this.connectCodeBlockEvent(this.props.leftTrigger, CodeBlockEvents.OnPlayerEnterTrigger,
                () => this.onTriggerEnter(this.props.leftTrigger))
            this.connectCodeBlockEvent(this.props.rightTrigger, CodeBlockEvents.OnPlayerEnterTrigger,
                () => this.onTriggerEnter(this.props.rightTrigger))
            this.connectCodeBlockEvent(this.props.bottomTrigger, CodeBlockEvents.OnPlayerEnterTrigger,
                () => this.onTriggerEnter(this.props.bottomTrigger))
        }, 1000)
    }

    detectorStrikeType(hand: Hand, punch: Punch, target: Target) {
        const strikeType = {hand, punch, target}
        console.log("detectorStrikeType", strikeType)
        this.strikeType = strikeType
    }

    onUpdate(data: { deltaTime: number }) {
        const player = this.world.getLocalPlayer()
        if (player !== this.world.getServerPlayer()) {
            const {leftHand, rightHand} = player
            const leftHandPosition = leftHand.position.get()
            const rightHandPosition = rightHand.position.get()
            this.leftHandVelocity = leftHandPosition.subInPlace(this.leftHandPrevPosition)
            this.rightHandVelocity = rightHandPosition.subInPlace(this.rightHandPrevPosition)
            this.leftHandPrevPosition = leftHandPosition
            this.rightHandPrevPosition = rightHandPosition
        }
    }

    onTriggerEnter(trigger: Entity) {
        console.log("onTriggerEnter", trigger)
        const player = this.world.getLocalPlayer()
        console.log("trigger player", player.name.get())
        console.log("strike type", this.strikeType)
        this.sendEntityEvent(this.props.detectorPeer, Events.detectorClearPeer, {})
        if (player !== this.world.getServerPlayer() && this.strikeType) {
            const strikeType = this.strikeType
            this.strikeType = undefined // prevent subsequent detections
            const {leftHand, rightHand} = player
            let targetRing: Entity
            switch (trigger) {
                case this.props.centerTrigger:
                    console.log("center trigger")
                    targetRing = this.props.jabRing
                    break
                case this.props.leftTrigger:
                case this.props.rightTrigger:
                    console.log("side trigger")
                    targetRing = this.props.hookRing
                    break;
                case this.props.bottomTrigger:
                    console.log("bottom trigger")
                    targetRing = this.props.uppercutRing
                    break;
                default:
                    console.error("Unknown trigger")
                    return
            }
            targetRing.visible.set(true)
            this.async.setTimeout(() => targetRing.visible.set(false), 1000)
            if (strikeType.target === this.props.target) {
                let targetTrigger: Entity
                switch (strikeType.punch) {
                    case 'jab':
                        targetTrigger = this.props.centerTrigger
                        break
                    case 'hook':
                        targetTrigger = strikeType.hand === 'left' ? this.props.leftTrigger : this.props.rightTrigger
                        break
                    case 'uppercut':
                        targetTrigger = this.props.bottomTrigger
                        break
                }
                if (trigger === targetTrigger) {
                    console.log('detector correct trigger')
                    // hit the correct trigger
                    // check correct hand (by distance)
                    const handPosition = strikeType.hand === 'left' ? leftHand.position.get() : rightHand.position.get()
                    if (handPosition.distance(trigger.position.get()) <= this.props.maximumTriggerDistance) {
                        /* XXXX direction/speed detection not working?
                        const handVelocity = this.strikeType.hand === 'left' ? this.leftHandVelocity : this.rightHandVelocity
                        // make sure hand is moving in right direction and fast enough
                        const speed = targetTrigger.forward.get().dot(handVelocity)
                        if (speed >= this.props.minimumHitSpeed) {
                        */
                            console.log("detected hit")
                            this.sendCodeBlockEvent(this.props.playerController, Events.detectorHit, true)
                            return
                        /*} else {
                            console.log(`detector wrong velocity, speed: ${speed}, hand: ${handVelocity}, target: ${targetTrigger.forward.get()}`)
                        }*/
                    } else {
                        console.log("detector hand too far from trigger")
                    }
                } else {
                    console.log('detector wrong trigger')
                }
            }
            // this is a miss (hit wrong body part, or wrong trigger, or wrong direction, or not fast enough
            console.log("detected miss")
            this.sendCodeBlockEvent(this.props.playerController, Events.detectorHit, false)
        } else {
            console.log("not detecting now")
            // not detecting strikes right now
        }
    }
}

Component.register(StrikeDetector)
