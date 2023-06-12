
export type Hand = "left" | "right"
export type Punch = "jab" | "hook" | "uppercut"
export type Target = "head" | "body"

export type StrikeType = {
    hand: Hand,
    punch: Punch,
    target: Target,
}

export type StrikeSequence = StrikeType[]

const Strike = {
    leftJabHead: {hand: "left", punch: "jab", target: "head"},
    leftJabBody: {hand: "left", punch: "jab", target: "body"},
    leftHookHead: {hand: "left", punch: "hook", target: "head"},
    leftHookBody: {hand: "left", punch: "hook", target: "body"},
    leftUppercutHead: {hand: "left", punch: "uppercut", target: "head"},
    leftUppercutBody: {hand: "left", punch: "uppercut", target: "body"},
    rightJabHead: {hand: "right", punch: "jab", target: "head"},
    rightJabBody: {hand: "right", punch: "jab", target: "body"},
    rightHookHead: {hand: "right", punch: "hook", target: "head"},
    rightHookBody: {hand: "right", punch: "hook", target: "body"},
    rightUppercutHead: {hand: "right", punch: "uppercut", target: "head"},
    rightUppercutBody: {hand: "right", punch: "uppercut", target: "body"},
} as const

type StrikeSequences = {
    easy: StrikeSequence[],
    medium: StrikeSequence[],
    hard: StrikeSequence[],
}

const strikeSequences: StrikeSequences = {
    easy: [
        [
            Strike.leftJabHead,
        ],
        [
            Strike.leftHookBody,
        ],
        [
            Strike.leftUppercutBody,
        ],
        [
            Strike.rightHookHead,
        ],
        [
            Strike.rightUppercutHead,
        ],
        [
            Strike.rightJabBody,
        ],
    ],
    medium: [
        [
            Strike.rightHookBody,
            Strike.leftJabHead,
        ],
        [
            Strike.leftUppercutBody,
            Strike.rightJabHead,
        ],
        [
            Strike.leftHookHead,
            Strike.rightHookHead
        ],
        [
            Strike.leftJabBody,
            Strike.rightUppercutHead,
        ],
        [
            Strike.leftJabBody,
            Strike.rightJabBody
        ],
        [
            Strike.leftHookBody,
            Strike.rightUppercutHead,
        ]
    ],
    hard: [
        [
            Strike.rightUppercutBody,
            Strike.leftJabHead,
            Strike.rightHookBody,
        ],
        [
            Strike.leftUppercutBody,
            Strike.rightJabHead,
            Strike.leftHookBody,
        ],
        [
            Strike.rightJabHead,
            Strike.leftJabHead,
            Strike.rightHookBody,
        ],
        [
            Strike.leftUppercutHead,
            Strike.rightJabBody,
            Strike.leftHookHead,
        ],
        [
            Strike.rightUppercutHead,
            Strike.leftJabBody,
            Strike.rightHookHead,
        ]
    ],
}

export function strikeName(strike: StrikeType, isRightHanded: boolean): string {
    let handPunch:string = `${strike.hand} ${strike.punch}`
    if (strike.punch === "jab") {
        if ((strike.hand === "right" && isRightHanded)
            || strike.hand === "left" && !isRightHanded) {
            handPunch = "cross"
        } else {
            handPunch = "jab"
        }
    }

    return `${handPunch} ${strike.target}`
}

export class StrikeGenerator {
    private sequences: StrikeSequence[] = []

    private remainingEasySequences = strikeSequences.easy
    private remainingMediumSequences = strikeSequences.medium
    private remainingHardSequences = strikeSequences.hard

    constructor(private readonly numEasy: number, private readonly numMedium: number) {
    }

    getNextSequence(index: number): StrikeSequence {
        while (index >= this.sequences.length) {
            if (this.sequences.length < this.numEasy) {
                const pickIndex = Math.floor(Math.random() * this.remainingEasySequences.length)
                this.sequences.push(this.remainingEasySequences.splice(pickIndex, 1)[0])
                if (this.remainingEasySequences.length === 0) {
                    // refill easy sequences
                    this.remainingEasySequences = strikeSequences.easy
                }
            } else if (this.sequences.length < this.numEasy + this.numMedium) {
                const pickIndex = Math.floor(Math.random() * this.remainingMediumSequences.length)
                this.sequences.push(this.remainingMediumSequences.splice(pickIndex, 1)[0])
                if (this.remainingMediumSequences.length === 0) {
                    // refill medium sequences
                    this.remainingMediumSequences = strikeSequences.medium
                }
            } else {
                const pickIndex = Math.floor(Math.random() * this.remainingHardSequences.length)
                this.sequences.push(this.remainingHardSequences.splice(pickIndex, 1)[0])
                if (this.remainingHardSequences.length === 0) {
                    // refill hard sequences
                    this.remainingHardSequences = strikeSequences.hard
                }
            }
        }
        return this.sequences[index]
    }
}
