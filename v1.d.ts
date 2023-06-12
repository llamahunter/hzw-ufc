declare module '@early_access_api/v1' { /**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */
export declare enum PropTypes {
    Number = "number",
    String = "string",
    Boolean = "boolean",
    Vec3 = "Vec3",
    Color = "Color",
    Entity = "Entity",
    Quaternion = "Quaternion",
    Player = "Player",
    Asset = "Asset",
    NumberArray = "Array<number>",
    StringArray = "Array<string>",
    BooleanArray = "Array<boolean>",
    Vec3Array = "Array<Vec3>",
    ColorArray = "Array<Color>",
    EntityArray = "Array<Entity>",
    QuaternionArray = "Array<Quaternion>",
    PlayerArray = "Array<Player>",
    AssetArray = "Array<Asset>"
}
export declare enum Space {
    World = 0,
    Local = 1
}
/**
 * Assert a value is true
 * @param condition - value that expected to be true
 */
export declare function assert(condition: boolean): void;
export interface ReadableHorizonProperty<T> {
    get(): T;
}
export interface WritableHorizonProperty<T, U = never> {
    set(value: T, ...values: [U?]): void;
}
export declare class HorizonProperty<T> implements ReadableHorizonProperty<T>, WritableHorizonProperty<T> {
    getter: () => T;
    setter: (value: T) => void;
    constructor(getter: () => T, setter: (value: T) => void);
    /**
     * Gets the current value of the property. Calls are cached per frame.
     *
     * @remarks
     * Mutating this state snapshot will not change the underlying value - `set` must be called to do this
     *
     * @returns current value of the property
     */
    get(): T;
    /**
     * Sets the property value. This is not guaranteed to be synchronous (happen on the same frame it was called)
     * @param value - property value to be set
     */
    set(value: T): void;
}
declare class HorizonSetProperty<T> implements Iterable<T>, ReadableHorizonProperty<T[]>, WritableHorizonProperty<T[]> {
    constructor(getter: () => T[], setter: (value: T[]) => void);
    [Symbol.iterator](): Iterator<T>;
    get(): T[];
    set(value: T[]): void;
    contains(value: T): boolean;
}
/**
 * Events
 */
declare type LocalEventData = {
    [key: string]: any;
};
export declare class HorizonEvent<TPayload extends LocalEventData> {
    name: string;
    uniqueName: string;
    constructor(name: string);
}
declare type ConstrainedPropTypes<T extends BuiltInVariableType[]> = {
    [key in keyof T]: StringifiedBuiltInVariable<T[key]>;
};
export declare class CodeBlockEvent<T extends BuiltInVariableType[]> {
    name: string;
    expectedTypes: ConstrainedPropTypes<T> | [];
    constructor(name: string, expectedTypes: ConstrainedPropTypes<T> | []);
}
/**
 * Event subscription that is returned from subscribing to an event
 */
export interface EventSubscription {
    disconnect: () => void;
}
/**
 * The Comparable interface defines a set of methods for comparing values of the same type,
 * including {@link Comparable.equals | equals()} and {@link Comparable.equalsApprox | equalsApprox()} methods.
 *
 * @typeParam T - The type of objects this object can be compared to
 */
export interface Comparable<T> {
    equals(val: T): boolean;
    equalsApprox(val: T, epsilon?: number): boolean;
}
/**
 * 3D Vector
 */
export declare class Vec3 implements Comparable<Vec3> {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    /**
     * Clone this vector's value into a mutable Vec3
     * @returns a mutable Vec3 with our same x,y,z values
     */
    clone(): Vec3;
    /**
     * Compares the equality of a vector to the given vector
     * @param vec - vector to compare
     */
    equals(vec: Vec3): boolean;
    /**
     * Compares the approximate equality of a vector to the given vector
     * @param vec - vector to compare
     * @param epsilon - maxium difference in value to be considered equal
     */
    equalsApprox(vec: Vec3, epsilon?: number): boolean;
    /**
     * Magnitude of a vector
     */
    magnitude(): number;
    /**
     * Squared magnitude of a vector
     */
    magnitudeSquared(): number;
    /**
     * Dot product of vector with target vector
     * @param vec -
     */
    dot(vec: Vec3): number;
    /**
     * Distance between from vector to given vector
     * @param vec - vector to compute distance between
     */
    distance(vec: Vec3): number;
    /**
     * Squared distance between from vector to given vector
     * @param vec - vector to compute squared distance between
     */
    distanceSquared(vec: Vec3): number;
    toString(): string;
    copy(vec: Vec3): this;
    /**
     * Returns a new vector which is the result of adding vec to the current vector
     * @param vec - vector to add
     */
    add(vec: Vec3): Vec3;
    /**
     * Returns a new vector which is the result of subtracting vec from the current vector
     * @param vec - vector to subtract
     */
    sub(vec: Vec3): Vec3;
    /**
     * Returns a new vector which is the result of multiplying the current vector by scalar
     * @param scalar - scalar to multiply
     */
    mul(scalar: number): Vec3;
    /**
     * Returns a new vector which is the result of multiplying the one vector's components by another's components
     * (a.x*b.x, a.y*b.y, a.z*b.z)
     * @param vec - vec to multiply
     */
    componentMul(vec: Vec3): Vec3;
    /**
     * Returns a new vector which is the result of dividing the current vector by scalar
     * @param scalar - scalar to divide
     */
    div(scalar: number): Vec3;
    /**
     * Returns a new vector which is the result of dividing the one vector's components by another's components
     * (a.x/b.x, a.y/b.y, a.z/b.z)
     * @param vec - vec to divide
     */
    componentDiv(vec: Vec3): Vec3;
    /**
     * Returns a new vector which is the result of normalizing the current vector
     */
    normalize(): Vec3;
    /**
     * Returns a new vector which is the result of crossing the current vector
     */
    cross(vec: Vec3): Vec3;
    /**
     * Returns a new vector which is the result of reflecting the current vector on the given normal
     * @param normal - The normal of the reflecting surface. This is assumed to be normalized.
     */
    reflect(normal: Vec3): Vec3;
    /**
     * Adds a vector, modifying the original vector in place
     * @param vec - vector to add
     */
    addInPlace(vec: Vec3): this;
    /**
     * Subtracts a vector, modifying the original vector in place
     * @param vec - vector to subtract
     */
    subInPlace(vec: Vec3): this;
    /**
     * Scalar multiplication, modifying the original vector in place
     * @param scalar - value to scale the vector by
     */
    mulInPlace(scalar: number): this;
    /**
     * Vector x vector multiplication, modifying the original vector in place
     * @param vec - vector to multiply the vector by
     */
    componentMulInPlace(vec: Vec3): this;
    /**
     * Scalar division, modifying the original vector in place
     * @param scalar - value to scale the vector by
     */
    divInPlace(scalar: number): this;
    /**
     * Vector/vector division, modifying the original vector in place
     * @param vec - vector to divide the vector by
     */
    componentDivInPlace(vec: Vec3): this;
    /**
     * Normalizes the vector in palce
     */
    normalizeInPlace(): this;
    /**
     * Computes the cross product with a target vector, modifying the original vector in place
     * @param vec - Vector to cross
     */
    crossInPlace(vec: Vec3): this;
    /**
     * Computes the reflection vector given a normal, modifying the original vector in place
     * @param normal - The normal of the reflecting surface. This is assumed to be normalized.
     */
    reflectInPlace(normal: Vec3): this;
    static get zero(): Vec3;
    static get one(): Vec3;
    static get forward(): Vec3;
    static get up(): Vec3;
    static get left(): Vec3;
    static get right(): Vec3;
    static get backward(): Vec3;
    static get down(): Vec3;
    /**
     * Compares the if two vectors are equal
     * @param vecA - vector to compare
     * @param vecB - vector to compare
     */
    static equals(vecA: Vec3, vecB: Vec3): boolean;
    /**
     * Compares the approximate equality of a vector to another vector
     * @param vecA - vector to compare
     * @param vecB - vector to compare
     * @param epsilon - maxium difference in value to be considered equal
     */
    static equalsApprox(vecA: Vec3, vecB: Vec3, epsilon?: number): boolean;
    /**
     * Adds vectors, returning a new vector
     * @param vecA - vector to add
     * @param vecB - vector to add
     * @param outVec - vector in which this operation takes place. If not supplied, a new vector will be created and returned.
     */
    static add(vecA: Vec3, vecB: Vec3, outVec?: Vec3): Vec3;
    /**
     * Subtracts a vector from another, returning a new vector
     * @param vecA - vector to substract from
     * @param vecB - vector to subtract
     * @param outVec - vector in which this operation takes place. If not supplied, a new vector will be created and returned.
     */
    static sub(vecA: Vec3, vecB: Vec3, outVec?: Vec3): Vec3;
    /**
     * Scalar multiplication on a vector, returning a new vector
     * @param vec - vector to scale
     * @param scalar - value to scale the vector by
     * @param outVec - vector in which this operation takes place. If not supplied, a new vector will be created and returned.
     */
    static mul(vec: Vec3, scalar: number, outVec?: Vec3): Vec3;
    /**
     * Scalar division on a vector, returning a new vector
     * @param vec - vector to scale
     * @param scalar - value to scale the vector by
     * @param outVec - vector in which this operation takes place. If not supplied, a new vector will be created and returned.
     */
    static div(vec: Vec3, scalar: number, outVec?: Vec3): Vec3;
    /**
     * Normalizes a vector, returning a new vector
     * @param vec - vector to normalize
     * @param outVec - vector in which this operation takes place. If not supplied, a new vector will be created and returned.
     * @returns normalied Vec3
     */
    static normalize(vec: Vec3, outVec?: Vec3): Vec3;
    /**
     * Computes the cross product of two vectors, returning a new vector
     * @param vecA - Left side vector of the cross product
     * @param vecB - Right side vector of the cross product
     * @param outVec - vector in which this operation takes place. If not supplied, a new vector will be created and returned.
     * @returns cross product
     */
    static cross(vecA: Vec3, vecB: Vec3, outVec?: Vec3): Vec3;
    /**
     * Lerp (linear interpolation) between two vectors
     * @param vecA - vec3 to lerp
     * @param vecB - vec3 to lerp
     * @param amount - defines the gradient to use for interpolation (clamped 0 to 1)
     * @param outVec - vector in which this operation takes place. If not supplied, a new vector will be created and returned.
     * @returns interpolated Vec3
     */
    static lerp(vecA: Vec3, vecB: Vec3, amount: number, outVec?: Vec3): Vec3;
}
/**
 * Color in RGB space
 */
export declare class Color implements Comparable<Color> {
    r: number;
    g: number;
    b: number;
    /**
     * @param r - The red component of the RGB color as a float from 0 to 1.
     * @param g - The green component of the RGB color as a float from 0 to 1.
     * @param b - The blue component of the RGB color as a float from 0 to 1.
     */
    constructor(r: number, g: number, b: number);
    toString(): string;
    /**
     * Clone this color's value into a mutable Color
     * @returns a mutable Color with our same r,g,b values
     */
    clone(): Color;
    /**
     * Converts RGB color to HSV
     */
    toHSV(): Vec3;
    /**
     * Converts RGB color to Vec3
     */
    toVec3(): Vec3;
    /**
     * Compares the value of a color to the target color and returns a boolean
     * @param color - color to compare
     */
    equals(color: Color): boolean;
    /**
     * Compares the approximate equality of a color to the given color
     * @param color - color to compare
     * @param epsilon - maxium difference in value to be considered equal
     */
    equalsApprox(color: Color, epsilon?: number): boolean;
    copy(color: Color): this;
    /**
     * Returns a new color which is the result of adding color to the current color
     * @param color - color to add
     */
    add(color: Color): Color;
    /**
     * Adds a color, modifying the original color in place
     * @param color - color to add
     */
    addInPlace(color: Color): this;
    /**
     * Returns a new color which is the result of subtracting color from the current color
     * @param color - color to subtract
     */
    sub(color: Color): Color;
    /**
     * Subtracts a color, modifying the original color in place
     * @param color - color to subtract
     */
    subInPlace(color: Color): this;
    /**
     * Returns a new color which is the result of multiplying scalar on each component of the current color
     * @param scalar - scalar to multiply
     */
    mul(scalar: number): Color;
    /**
     * Scalar multiplication, modifying the original color in place
     * @param scalar - value to scale the color by
     */
    mulInPlace(scalar: number): this;
    /**
     * Returns a new color which is the result of multiplying each component of the current color with the input color's component
     * @param color - color to multiply
     */
    componentMul(color: Color): Color;
    /**
     * component multiplication, modifying the original color in place
     * @param color - color to multiply by
     */
    componentMulInPlace(color: Color): this;
    /**
     * Returns a new color which is the result of dividing scalar on each component of the current color
     * @param scalar - scalar to divide
     */
    div(scalar: number): Color;
    /**
     * Scalar division, modifying the original color in place
     * @param scalar - value to scale the color by
     */
    divInPlace(scalar: number): this;
    static get red(): Color;
    static get green(): Color;
    static get blue(): Color;
    static get white(): Color;
    static get black(): Color;
    /**
     * Compares the if two colors are equal
     * @param colorA - color to compare
     * @param colorB - color to compare
     */
    static equals(colorA: Color, colorB: Color): boolean;
    /**
     * Compares the approximate equality of a color to another color
     * @param colorA - color to compare
     * @param colorB - color to compare
     * @param epsilon - maxium difference in value to be considered equal
     */
    static equalsApprox(colorA: Color, colorB: Color, epsilon?: number): boolean;
    /**
     * Adds two colors, returning a new color
     * @param colorA - color to add
     * @param colorB - color to add
     * @param outColor - color in which this operation takes place. If not supplied, a new vector will be created and returned.
     */
    static add(colorA: Color, colorB: Color, outColor?: Color): Color;
    /**
     * Subtracts a color from the another color, returning a new color
     * @param colorA - color to subtract from
     * @param colorB - color to subtract
     * @param outColor - color in which this operation takes place. If not supplied, a new vector will be created and returned.
     */
    static sub(colorA: Color, colorB: Color, outColor?: Color): Color;
    /**
     * Scalar multiplication on a color, returning a new color
     * @param color - to scale
     * @param scalar - value to scale the color by
     * @param outColor - color in which this operation takes place. If not supplied, a new vector will be created and returned.
     */
    static mul(color: Color, scalar: number, outColor?: Color): Color;
    /**
     * Scalar division on a color, returning a new color
     * @param color - to scale
     * @param scalar - value to scale the color by
     * @param outColor - color in which this operation takes place. If not supplied, a new vector will be created and returned.
     */
    static div(color: Color, scalar: number, outColor?: Color): Color;
    /**
     * Create a new color from an HSV value.
     * @param hsv - The HSV color value to convert to RGB
     */
    static fromHSV(hsv: Vec3): Color;
}
export declare enum EulerOrder {
    XYZ = "XYZ",
    YXZ = "YXZ",
    ZXY = "ZXY",
    ZYX = "ZYX",
    YZX = "YZX",
    XZY = "XZY"
}
/**
 * Clamps a value between a min and max
 * @param value - value to clamp
 * @param min - minimum
 * @param max - maxium
 * @returns clamped value
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * Converts radians to degrees
 * @param radians - value in radians
 * @returns value in degrees
 */
export declare function radiansToDegrees(radians: number): number;
/**
 * Converts degrees to radians
 * @param degrees - value in degrees
 * @returns value in radians
 */
export declare function degreesToRadians(degrees: number): number;
/**
 * Quaternion
 */
export declare class Quaternion implements Comparable<Quaternion> {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x: number, y: number, z: number, w: number);
    toString(): string;
    clone(): Quaternion;
    /**
     * Converts the quaternion to an Euler angle in degrees
     * @param order - the order of the resulting Vec3 defaults to XYZ
     * @returns Vec3 representing Euler angle (in degrees)
     */
    toEuler: (order?: EulerOrder) => Vec3;
    /**
     * Compares the if a quaternion is equal to the given quaternion
     * @param quat - quaternion to compare
     */
    equals(quat: Quaternion): boolean;
    /**
     * Compares the approximate equality of a quaternion to the given quaternion
     * @param quat - quaternion to compare
     * @param epsilon - maxium difference in value to be considered equal
     */
    equalsApprox(quat: Quaternion, epsilon?: number): boolean;
    /**
     * Returns the axis of the rotation represented by this quaternion
     */
    axis(): Vec3;
    /**
     * Returns the angle of rotation represented by this quaternion, in radians
     * @returns angle in radians
     */
    angle(): number;
    copy(quat: Quaternion): this;
    /**
     * Returns a new quaternion which is the result of inverting the current quaternion
     */
    inverse(): Quaternion;
    /**
     * Compute the inverse, modifying the original Quaternion in place.
     */
    inverseInPlace(): this;
    /**
     * Returns a new quaternion which is the result of normalizing vec to the current quaternion
     */
    normalize(): Quaternion;
    /**
     * Normalize the quaternion in place
     */
    normalizeInPlace(): this;
    /**
     * Returns a new quaternion which is the result of conjugating the current quaternion
     */
    conjugate(): Quaternion;
    /**
     * Conjugate the quaternion in place
     */
    conjugateInPlace(): this;
    /**
     * Returns a new quaternion which is the result of multiplying quat by the current quaternion
     * @param quat -
     */
    mul(quat: Quaternion): Quaternion;
    /**
     * Multiply by another quaternion, modifying the original quaternion in place
     * @param quat -
     */
    mulInPlace(quat: Quaternion): this;
    static get zero(): Quaternion;
    static get one(): Quaternion;
    static get i(): Quaternion;
    static get j(): Quaternion;
    static get k(): Quaternion;
    /**
     * Compares the if two quaternions are equal
     * @param quatA - quaternion to compare
     * @param quatB - quaternion to compare
     */
    static equals(quatA: Quaternion, quatB: Quaternion): boolean;
    /**
     * Compares the approximate equality of a quaternion to another quaternion
     * @param quatA - quaternion to compare
     * @param quatB - quaternion to compare
     * @param epsilon - maxium difference in value to be considered equal
     */
    static equalsApprox(quatA: Quaternion, quatB: Quaternion, epsilon?: number): boolean;
    /**
     * Creates a quaternion from Euler angle in degrees
     * @param euler - Euler angle as a Vec3 in degrees
     * @param order - order that the euler angle is in (defaults to XYZ)
     */
    static fromEuler(euler: Vec3, order?: EulerOrder): Quaternion;
    /**
     * Creates a quaternion using the forward and up vectors
     * @param forward - forward direction of rotation (must be orthogonal to up)
     * @param up - up direction of rotation - defaults to Vec3.up (must be orthogonal to forward)
     * @param outQuat - quaternion in which this operation takes place. If not supplied, a new quaternion will be created and returned.
     * @returns Quaternion looking towards the given vectors
     */
    static lookRotation(forward: Vec3, up?: Vec3, outQuat?: Quaternion): Quaternion;
    /**
     * Slerp (spherical linear interpolation) between two quaternions
     * @param left - quaternion to slerp
     * @param right - quaternion to slerp
     * @param amount - defines the gradient to use for interpolation (clamped 0 to 1)
     * @param outQuat - quaternion in which this operation takes place. If not supplied, a new quaternion will be created and returned.
     * @returns interpolated Quaternion
     */
    static slerp(left: Quaternion, right: Quaternion, amount: number, outQuat?: Quaternion): Quaternion;
    /**
     * Multiplies two quaternions, returning a new quaternion
     * @param quatA - quaternion to multiply
     * @param quatB - quaternion to multiply
     * @param outQuat - quaternion in which this operation takes place. If not supplied, a new quaternion will be created and returned.
     * @returns a new quaternion
     */
    static mul(quatA: Quaternion, quatB: Quaternion, outQuat?: Quaternion): Quaternion;
    /**
     * Rotate the given vector by this quaternion, returning a new vector
     * @param quat - quaternion to multiply
     * @param vec - vector to multiply
     * @returns a new Vec3
     */
    static mulVec3: (quat: Quaternion, vec: Vec3) => Vec3;
    /**
     * Conjugate a quaternion, returning a new quaternion
     * @param quat - quaternion to conjugate
     * @param outQuat - quaternion in which this operation takes place. If not supplied, a new quaternion will be created and returned.
     * @returns a new quaternion
     */
    static conjugate(quat: Quaternion, outQuat?: Quaternion): Quaternion;
    /**
     * Compute the inverse of a quaternion, returning a new quaternion
     * @returns a new quaternion
     */
    static inverse(quat: Quaternion): Quaternion;
    /**
     * Normalize a quaternion, returning a new quaternion
     * @param outQuat - quaternion in which this operation takes place. If not supplied, a new quaternion will be created and returned.
     * @returns a normalized quaternion
     */
    static normalize(quat: Quaternion, outQuat?: Quaternion): Quaternion;
    /**
     * Creates a new quaternion from a vector (w is 0)
     * @param vec -
     * @returns a Quaternion
     */
    static fromVec3(vec: Vec3): Quaternion;
    /**
     * Creates a quaternion from axis angle
     * @param axis -
     * @param angle - in radians
     */
    static fromAxisAngle: (axis: Vec3, angle: number) => Quaternion;
}
export declare class Entity {
    readonly id: number;
    constructor(id: number);
    toString(): string;
    position: HorizonProperty<Vec3>;
    scale: HorizonProperty<Vec3>;
    rotation: HorizonProperty<Quaternion>;
    color: HorizonProperty<Color>;
    forward: ReadableHorizonProperty<Vec3>;
    up: ReadableHorizonProperty<Vec3>;
    visible: HorizonProperty<boolean>;
    collidable: HorizonProperty<boolean>;
    simulated: HorizonProperty<boolean>;
    interactionMode: HorizonProperty<EntityInteractionMode>;
    owner: HorizonProperty<Player>;
    /**
     * Tags can be used to annotate Entities with user-defined labels to identify and match objects.
     *
     * Note: Currently, the data model only supports one tag. When setting a collection of tags, only
     * the first element in the provided collection will be saved. Getting or checking existence of tags
     * will also operate on a collection with a single tag in them, if set.
     */
    tags: HorizonSetProperty<string>;
    exists(): boolean;
    /**
     * Cast an Entity as its more specific subclass (eg TextDisplay)
     * @param entityClass - subclass to cast Entity into
     */
    as<T extends Entity>(entityClass: IEntity<T>): T;
    setVisibleToPlayers(players: Array<Player>): void;
    /**
     * Sets an entity to be visible by all players.
     *
     * @example
     * cubeEntity.setVisibleToAllPlayers();
     */
    setVisibleToAllPlayers(): void;
    /**
     * Checks whether or not the entity is visible to a particular player.
     * @param player - The player for which the entity may or may not be visible.
     * @returns True if the entity is visible, false otherwise.
     *
     * @example
     * var isVisible = cubeEntity.isVisibleTo(player);
     */
    isVisibleToPlayer(player: Player): boolean;
    /**
     * Rotates an entity to look at a point
     * @param target - Target for the entity to look at
     * @param up - up direction of rotation - defaults to Vec3.up
     */
    lookAt(target: Vec3, up?: Vec3): void;
}
interface IEntity<T extends Entity> {
    new (id: number): T;
}
export declare class SpawnPointGizmo extends Entity {
    toString(): string;
    teleportPlayer(player: Player): void;
}
export declare class TextGizmo extends Entity {
    toString(): string;
    /**
     * The content to display in the text label
     */
    text: HorizonProperty<string>;
}
export declare class TriggerGizmo extends Entity {
    toString(): string;
    /**
     * Whether the Trigger is actively testing for overlaps
     */
    enabled: WritableHorizonProperty<boolean>;
}
export declare class ParticleGizmo extends Entity {
    toString(): string;
    /**
     * Plays particle effect
     */
    play(): void;
    /**
     * Stops particle effect
     */
    stop(): void;
}
export declare class TrailGizmo extends Entity {
    toString(): string;
    /**
     * Plays trail effect
     */
    play(): void;
    /**
     * Stops trail effect
     */
    stop(): void;
}
/**
 * AudioOptions control how audio is interacted with:
 * fade - Time (s) it takes for the sound to fade in or out.
 * players - Optional. Include this if the sound should only play for certain players.
 */
export declare type AudioOptions = {
    fade: number;
    players?: Array<Player>;
};
export declare class AudioGizmo extends Entity {
    toString(): string;
    /**
     * The audio volume 0-1
     */
    volume: WritableHorizonProperty<number, AudioOptions>;
    /**
     * The audio pitch in semitones (-12 to 12)
     */
    pitch: WritableHorizonProperty<number>;
    /**
     * Plays an AudioGizmo.
     *
     * @param audioOptions - Optional. Controls how the audio is played.
     * fade - Time (s) it takes for the sound to fade in or out.
     * players - Optional array of players. Include this if the sound should only affect certain players.
     *
     * @example
     * ```
     * const soundGizmo = this.props.sfx.as(hz.AudioGizmo);
     * const audioOptions: AudioOptions = {fade: 1, players: [player1, player2]};
     * soundGizmo.play(audioOptions);
     * ```
     */
    play(audioOptions?: AudioOptions): void;
    /**
     * Pauses an AudioGizmo.
     *
     * @param audioOptions - Optional. Controls how the audio is paused.
     * fade - Time (s) it takes for the sound to fade in or out.
     * players - Optional array of players. Include this if the sound should only affect certain players.
     *
     * @example
     * ```
     * const soundGizmo = this.props.sfx.as(hz.AudioGizmo);
     * const audioOptions: AudioOptions = {fade: 1, players: [player1, player2]};
     * soundGizmo.pause(audioOptions);
     * ```
     */
    pause(audioOptions?: AudioOptions): void;
    /**
     * Stops an AudioGizmo.
     *
     * @param audioOptions - Optional. Controls how the audio is played.
     * fade - Time (s) it takes for the sound to fade in or out.
     * players - Optional array of players. Include this if the sound should only affect certain players.
     *
     * @example
     * ```
     * const soundGizmo = this.props.sfx.as(hz.AudioGizmo);
     * const audioOptions: AudioOptions = {fade: 1, players: [player1, player2]};
     * soundGizmo.stop(audioOptions);
     * ```
     */
    stop(audioOptions?: AudioOptions): void;
}
export declare class ProjectileLauncherGizmo extends Entity {
    toString(): string;
    projectileGravity: WritableHorizonProperty<number>;
    launchProjectile(speed?: number): void;
}
export declare class AchievementsGizmo extends Entity {
    toString(): string;
    displayAchievements(achievementScriptIDs: Array<string>): void;
}
export declare enum MonetizationTimeOption {
    Seconds = "SECONDS",
    Hours = "HOURS",
    Days = "DAYS"
}
export declare class IWPSellerGizmo extends Entity {
    toString(): string;
    playerOwnsItem(player: Player, item: string): boolean;
    playerHasConsumedItem(player: Player, item: string): boolean;
    quantityPlayerOwns(player: Player, item: string): number;
    timeSincePlayerConsumedItem(player: Player, item: string, timeOption: MonetizationTimeOption): number;
    consumeItemForPlayer(player: Player, item: string): void;
}
export declare enum LayerType {
    Player = 0,
    Objects = 1,
    Both = 2
}
export interface RaycastHit {
    hit: boolean;
    didHitPlayer: boolean;
    didHitEntity: boolean;
    didHitStatic: boolean;
    distance?: number;
    hitPoint?: Vec3;
    normal?: Vec3;
    playerHit?: Player;
    entityHit?: Entity;
    colliderHit?: string;
}
export declare class RaycastGizmo extends Entity {
    toString(): string;
    /**
     * Raycast from a raycast gizmo
     * @param origin - from where to start the raycast
     * @param direction - to send the raycast
     * @param options - options to configure raycast
     * * layerType- Player, Objects, Both
     * * maxDistance - to send the raycast
     * @returns information about the raycast hit
     */
    raycast(origin: Vec3, direction: Vec3, options?: {
        layerType?: LayerType;
        maxDistance?: number;
    }): RaycastHit;
}
export declare class DynamicLightGizmo extends Entity {
    toString(): string;
    enabled: WritableHorizonProperty<boolean>;
    /**
     * Set the light intensity from 0-10
     */
    intensity: WritableHorizonProperty<number>;
    /**
     * Set the light falloff distance from 0-100
     */
    falloffDistance: WritableHorizonProperty<number>;
    /**
     * Set the light spread from 0-180
     */
    spread: WritableHorizonProperty<number>;
}
export declare enum PhysicsForceMode {
    Force = "Force",
    Impulse = "Impulse",
    VelocityChange = "VelocityChange"
}
/**
 * SpringOptions control the springs physics:
 * stiffness - The stiffness of the spring controls the amount of force applied on the object.
 * damping - The damping ratio of the string reduces oscillations
 * axisIndependent - Ensures the object's motion is parallel to the push direction.
 */
export declare type SpringOptions = {
    stiffness: number;
    damping: number;
    axisIndependent: boolean;
};
export declare const DefaultSpringOptions: {
    stiffness: number;
    damping: number;
    axisIndependent: boolean;
};
export declare class PhysicalEntity extends Entity {
    toString(): string;
    gravityEnabled: WritableHorizonProperty<boolean>;
    locked: HorizonProperty<boolean>;
    velocity: ReadableHorizonProperty<Vec3>;
    angularVelocity: ReadableHorizonProperty<Vec3>;
    applyForce(vector: Vec3, mode: PhysicsForceMode): void;
    applyLocalForce(vector: Vec3, mode: PhysicsForceMode): void;
    applyForceAtPosition(vector: Vec3, position: Vec3, mode: PhysicsForceMode): void;
    applyTorque(vector: Vec3): void;
    applyLocalTorque(vector: Vec3): void;
    zeroVelocity(): void;
    /**
     * Pushes a physical entity toward a target position as if it's attached to a spring.
     * This should be called every frame and requires the physical entity's motion type to be interactive.
     *
     * @param position - The target position, or 'origin' of the spring
     * @param options - Additional optional arguments to control the spring's behavior
     * stiffness - The stiffness of the spring controls the amount of force applied on the object.
     * damping - The damping ratio of the string reduces oscillations
     * axisIndependent - Ensures the object's motion is parallel to the push direction.
     *
     * @example
     * ```
     * var physEnt = this.props.obj1.as(hz.PhysicalEntity);
     * this.connectBroadcastEvent(hz.World.onUpdate, (data: { deltaTime: number }) => {
     *  physEnt.springPushTowardPosition(this.props.obj2.position.get(), {stiffness: 5, damping: 0.2});
     * })
     * ```
     */
    springPushTowardPosition(position: Vec3, options?: Partial<SpringOptions>): void;
    /**
     * Spins a physical entity toward a target rotation as if it's attached to a spring.
     * This should be called every frame and requires the physical entity's motion type to be interactive.
     *
     * @param rotation - The target quaternion rotation
     * @param options - Additional optional arguments to control the spring's behavior
     * stiffness - The stiffness of the spring controls the amount of force applied on the object.
     * damping - The damping ratio of the string reduces oscillations
     * axisIndependent - Ensures the object's spinning motion is parallel to the push direction.
     *
     * @example
     * ```
     * var physEnt = this.props.obj1.as(hz.PhysicalEntity);
     * this.connectBroadcastEvent(hz.World.onUpdate, (data: { deltaTime: number }) => {
     *  physEnt.springSpinTowardRotation(this.props.obj2.rotation.get(), {stiffness: 10, damping: 0.5, axisIndependent: false});
     * })
     * ```
     */
    springSpinTowardRotation(rotation: Quaternion, options?: Partial<SpringOptions>): void;
}
export declare class GrabbableEntity extends Entity {
    toString(): string;
    forceHold(player: Player, hand: Handedness, allowRelease: boolean): void;
    forceRelease(): void;
    setWhoCanGrab(players: Array<Player>): void;
}
export declare enum AttachablePlayerAnchor {
    Head = "Head",
    Torso = "Torso"
}
export declare class AttachableEntity extends Entity {
    toString(): string;
    attachToPlayer(player: Player, anchor: AttachablePlayerAnchor): void;
    detach(): void;
}
export declare class AnimatedEntity extends Entity {
    toString(): string;
    play(): void;
    pause(): void;
    stop(): void;
}
export declare enum PlayerBodyPartType {
    Head = "Head",
    Foot = "Foot",
    Torso = "Torso",
    LeftHand = "LeftHand",
    RightHand = "RightHand"
}
export declare enum Handedness {
    Left = "Left",
    Right = "Right"
}
export declare enum HapticStrength {
    VeryLight = "VeryLight",
    Light = "Light",
    Medium = "Medium",
    Strong = "Strong"
}
export declare enum HapticSharpness {
    Sharp = "Sharp",
    Coarse = "Coarse",
    Soft = "Soft"
}
export declare enum EntityInteractionMode {
    Grabbable = "Grabbable",
    Physics = "Physics",
    Both = "Both"
}
declare class PlayerBodyPart {
    protected readonly player: Player;
    protected readonly type: PlayerBodyPartType;
    constructor(player: Player, type: PlayerBodyPartType);
    position: ReadableHorizonProperty<Vec3>;
    /**
     * Position relative to the player torso.
     */
    localPosition: ReadableHorizonProperty<Vec3>;
    rotation: ReadableHorizonProperty<Quaternion>;
    /**
     * Rotation relative to the player torso.
     */
    localRotation: ReadableHorizonProperty<Quaternion>;
    forward: ReadableHorizonProperty<Vec3>;
    up: ReadableHorizonProperty<Vec3>;
    /**
     * Alias for position and localPosition property getters.
     * @param space - whether to get world or local position
     * @returns
     */
    getPosition(space: Space): Vec3;
    /**
     * Alias for rotation and localRotation property getters.
     * @param space - whether to get world or local rotation
     * @returns
     */
    getRotation(space: Space): Quaternion;
}
export declare class PlayerHand extends PlayerBodyPart {
    protected readonly handedness: Handedness;
    constructor(player: Player, handedness: Handedness);
    /**
     * Plays haptics on the specified hand
     * @param duration - Duration in MS
     * @param strength - Strength of haptics to play
     * @param sharpness - Sharpness of the haptics
     */
    playHaptics(duration: number, strength: HapticStrength, sharpness: HapticSharpness): void;
}
export declare const VoipSettingValues: {
    readonly Default: "Default";
    readonly Global: "Global";
    readonly Nearby: "Nearby";
    readonly Extended: "Extended";
    readonly Whisper: "Whisper";
    readonly Mute: "Mute";
};
/**
 * VOIP settings affect the player's in-game voice chat settings and include the following:
 * 'Default' - "Your voice setting has been set back to the world default."
 * 'Global' - "Everyone in this world can now hear you."
 * 'Nearby' - "Only people nearby can hear you."
 * 'Extended' - "Your voice now travels farther in this world."
 * 'Whisper' - "Only people next to you can hear you."
 * 'Mute' - "Voices are turned off."
 */
export declare type VoipSetting = keyof typeof VoipSettingValues;
export declare enum PlayerDeviceType {
    VR = "VR",
    Mobile = "Mobile",
    Desktop = "Desktop"
}
export declare class Player {
    readonly id: number;
    constructor(id: number);
    toString(): string;
    head: PlayerBodyPart;
    torso: PlayerBodyPart;
    foot: PlayerBodyPart;
    leftHand: PlayerHand;
    rightHand: PlayerHand;
    position: HorizonProperty<Vec3>;
    rotation: ReadableHorizonProperty<Quaternion>;
    forward: ReadableHorizonProperty<Vec3>;
    up: ReadableHorizonProperty<Vec3>;
    name: ReadableHorizonProperty<string>;
    /**
     * Each player is assigned an index when they join the game in the range [0, \{Max Players - 1\}]. The index can be used to identify each player with world.getPlayerFromIndex() and can be a useful tool for keeping track of players.
     */
    index: ReadableHorizonProperty<number>;
    velocity: HorizonProperty<Vec3>;
    gravity: HorizonProperty<number>;
    locomotionSpeed: WritableHorizonProperty<number>;
    /**
     * Get the type of device the player is using.
     * Handling a 'default' case in a switch statement is recommended as new types may be added in the future
     */
    deviceType: ReadableHorizonProperty<PlayerDeviceType>;
    /**
     * Checks whether a player is in build mode or not. Useful for debugging.
     */
    isInBuildMode: ReadableHorizonProperty<boolean>;
    applyForce(force: Vec3): void;
    /**
     * Sets the enabled collision layers for physical hands
     * @param collideWithDynamicObjects - Enables physical hands colliding with dynamic objects
     * @param collideWithStaticObjects - Enables physical hands colliding with static objects
     */
    configurePhysicalHands(collideWithDynamicObjects: boolean, collideWithStaticObjects: boolean): void;
    /**
     * Sets the VOIP setting for the player
     * @param setting - VOIP settings includes the following:
     * 'Default' - "Your voice setting has been set back to the world default."
     * 'Global' - "Everyone in this world can now hear you."
     * 'Nearby' - "Only people nearby can hear you."
     * 'Extended' - "Your voice now travels farther in this world."
     * 'Whisper' - "Only people next to you can hear you."
     * 'Mute' - "Voices are turned off."
     */
    setVoipSetting(setting: VoipSetting): void;
    /**
     * Checks whether or not a player has an achievement
     * @param achievementScriptID - The scriptID of the achievement. This can be accessed/set on the Achievements page in the VR creator UI.
     * @returns True if the player has the achievement, false otherwise.
     *
     * @example
     * var WonAGameAchievementScriptID = "wonAGame"
     * var hasAchievement = player.hasCompletedAchievement(WonAGameAchievementScriptID)
     */
    hasCompletedAchievement(achievementScriptID: string): boolean;
    /**
     * Sets an achievement to complete/incomplete for the player
     * @param achievementScriptID - The scriptID of the achievement. This can be accessed/set on the Achievements page in the VR creator UI.
     * @param complete - Whether or not the achievement is completed
     *
     * @example
     * var WonAGameAchievementScriptID = "wonAGame"
     * player.setAchievementComplete(WonAGameAchievementScriptID, true)
     */
    setAchievementComplete(achievementScriptID: string, complete: boolean): void;
}
export declare class Asset {
    readonly id: number;
    constructor(id: number);
    toString(): string;
}
declare enum WorldUpdateType {
    Update = "Update",
    PrePhysicsUpdate = "PrePhysicsUpdate"
}
export declare type PopupOptions = {
    position: Vec3;
    fontSize: number;
    fontColor: Color;
    backgroundColor: Color;
    playSound: boolean;
    showTimer: boolean;
};
export declare const DefaultPopupOptions: {
    position: Vec3;
    fontSize: number;
    fontColor: Color;
    backgroundColor: Color;
    playSound: boolean;
    showTimer: boolean;
};
interface IWorld {
    reset(): void;
}
export declare class World implements IWorld {
    /**
     * Event broadcasted on every frame
     * deltaTime is the time since the last update in seconds
     */
    static readonly onUpdate: HorizonEvent<{
        deltaTime: number;
    }>;
    /**
     * Event broadcasted on every frame before physics
     * deltaTime is the time since the last update in seconds
     */
    static readonly onPrePhysicsUpdate: HorizonEvent<{
        deltaTime: number;
    }>;
    toString(): string;
    reset(): void;
    /**
     * Get the server player
     * @returns Server player
     */
    getServerPlayer(): Player;
    getLocalPlayer(): Player;
    /**
     * Get the player corresponding to some playerIndex
     * @param playerIndex - The index of the player. Retrievable with player.index.get()
     * @returns The player corresponding to that index, or null if no player exists at that index.
     */
    getPlayerFromIndex(playerIndex: number): Player | null;
    /**
     * Gets all players currently in the world, not including the server player.
     * @returns An array of players in the world.
     */
    getPlayers(): Player[];
    /**
     * Spawns an asset async
     * @param asset - the asset to spawn
     * @param position - position to spawn the asset at
     * @param rotation - rotation of spawned asset.  If invalid, will be sanitized to Quaternion.one (no rotation)
     * @param scale - scale of spawned asset
     * @returns promise resolving to all of the root entities within the asset
     */
    spawnAsset(asset: Asset, position: Vec3, rotation?: Quaternion, scale?: Vec3): Promise<Entity[]>;
    /**
     * Removes a previously spawned asset from the world
     * @param entity - previously spawned entity
     * @param fullDelete - if true, entity must be the root object, and will cause all subobjects to also be deleted
     * @returns promise that resolves when the entity has been deleted
     */
    deleteAsset(entity: Entity, fullDelete?: boolean): Promise<undefined>;
    /**
     * Called on every frame
     * @param updateType - type of update
     * @param deltaTime - time since last frame in seconds
     */
    update(updateType: WorldUpdateType, deltaTime: number): undefined;
    leaderboards: {
        /**
         * Sets leaderboard score for a player
         * @param leaderboardName - Name of the leader board
         * @param player - player to update the score for
         * @param score -
         * @param override - overrides previous score if set to true
         */
        setScoreForPlayer(leaderboardName: string, player: Player, score: number, override: boolean): void;
    };
    persistentStorage: {
        /**
         * Gets a persistent player variable
         * @param player -
         * @param key - Variable key
         */
        getPlayerVariable(player: Player, key: string): number;
        /**
         * Sets a persistent player variable
         * @param player -
         * @param key - Variable key
         * @param value - Variable value
         */
        setPlayerVariable(player: Player, key: string, value: number): void;
    };
    ui: {
        /**
         * Shows a popup modal to all players
         * @param text - the text to display in the popup
         * @param displayTime - the amount of time (in seconds) to display the popup
         * @param options - configuration for popup UI (eg color, position, showTimer)
         */
        showPopupForEveryone(text: string, displayTime: number, options?: Partial<PopupOptions>): void;
        /**
         * Shows a popup modal to the given player
         * @param player - player to display the popup to
         * @param text - the text to display in the popup
         * @param displayTime - the amount of time (in seconds) to display the popup
         * @param options - configuration for popup UI (eg color, position, showTimer)
         */
        showPopupForPlayer(player: Player, text: string, displayTime: number, options?: Partial<PopupOptions>): void;
    };
}
declare type BuiltInVariableTypeArray = Array<number> | Array<string> | Array<boolean> | Array<Vec3> | Array<Color> | Array<Entity> | Array<Quaternion> | Array<Player> | Array<Asset>;
export declare type BuiltInVariableType = number | string | boolean | Vec3 | Color | Entity | Quaternion | Player | Asset | BuiltInVariableTypeArray;
declare type StringifiedBuiltInVariable<T extends BuiltInVariableType> = T extends number ? 'number' : T extends string ? 'string' : T extends boolean ? 'boolean' : T extends Vec3 ? 'Vec3' : T extends Color ? 'Color' : T extends Entity ? 'Entity' : T extends Quaternion ? 'Quaternion' : T extends Player ? 'Player' : T extends Asset ? 'Asset' : T extends Array<number> ? 'Array<number>' : T extends Array<string> ? 'Array<string>' : T extends Array<boolean> ? 'Array<boolean>' : T extends Array<Vec3> ? 'Array<Vec3>' : T extends Array<Color> ? 'Array<Color>' : T extends Array<Entity> ? 'Array<Entity>' : T extends Array<Quaternion> ? 'Array<Quaternion>' : T extends Array<Player> ? 'Array<Player>' : T extends Array<Asset> ? 'Array<Asset>' : never;
/**
 * Props used to initialize a Component
 * This is the script variable data that is sent from the UI
 */
export declare type ComponentProps = {
    [key: string]: BuiltInVariableType;
};
/**
 * State transferred to the new owner on ownership change
 * Implement the receiveOwnership and transferOwnership methods
 */
export declare type SerializableState = {
    [key: string]: SerializableState;
} | SerializableState[] | number | boolean | string | null;
/**
 * Structure of expected properties that are used to initialize a Component
 * This is use to provide inputs on instances in the UI
 */
export declare type PropsDefinition<T extends ComponentProps> = {
    [key in keyof T]: {
        type: StringifiedBuiltInVariable<T[key]>;
        default?: T[key];
    };
};
declare type IComponent<TProps extends ComponentProps> = {
    new (): Component<TProps>;
    propsDefinition: PropsDefinition<TProps>;
};
/**
 * Built in CodeBlock events
 */
export declare const CodeBlockEvents: {
    OnPlayerEnterTrigger: CodeBlockEvent<[enteredBy: Player]>;
    OnPlayerExitTrigger: CodeBlockEvent<[exitedBy: Player]>;
    OnEntityEnterTrigger: CodeBlockEvent<[enteredBy: Entity]>;
    OnEntityExitTrigger: CodeBlockEvent<[enteredBy: Entity]>;
    OnPlayerCollision: CodeBlockEvent<[collidedWith: Player, collisionAt: Vec3, normal: Vec3, relativeVelocity: Vec3, localColliderName: string, OtherColliderName: string]>;
    OnEntityCollision: CodeBlockEvent<[collidedWith: Entity, collisionAt: Vec3, normal: Vec3, relativeVelocity: Vec3, localColliderName: string, OtherColliderName: string]>;
    OnPlayerEnterWorld: CodeBlockEvent<[player: Player]>;
    OnPlayerExitWorld: CodeBlockEvent<[player: Player]>;
    OnGrabStart: CodeBlockEvent<[isRightHand: boolean, player: Player]>;
    OnGrabEnd: CodeBlockEvent<[player: Player]>;
    OnMultiGrabStart: CodeBlockEvent<[player: Player]>;
    OnMultiGrabEnd: CodeBlockEvent<[player: Player]>;
    OnIndexTriggerDown: CodeBlockEvent<[player: Player]>;
    OnIndexTriggerUp: CodeBlockEvent<[player: Player]>;
    OnButton1Down: CodeBlockEvent<[player: Player]>;
    OnButton1Up: CodeBlockEvent<[player: Player]>;
    OnButton2Down: CodeBlockEvent<[player: Player]>;
    OnButton2Up: CodeBlockEvent<[player: Player]>;
    OnAttachStart: CodeBlockEvent<[player: Player]>;
    OnAttachEnd: CodeBlockEvent<[player: Player]>;
    OnProjectileLaunched: CodeBlockEvent<[]>;
    OnProjectileHitPlayer: CodeBlockEvent<[playerHit: Player, position: Vec3, normal: Vec3, headshot: boolean]>;
    OnProjectileHitObject: CodeBlockEvent<[objectHit: Entity, position: Vec3, normal: Vec3]>;
    OnProjectileHitWorld: CodeBlockEvent<[position: Vec3, normal: Vec3]>;
    OnAchievementComplete: CodeBlockEvent<[player: Player, scriptId: string]>;
    OnItemPurchaseSucceeded: CodeBlockEvent<[player: Player, item: string]>;
    OnItemPurchaseFailed: CodeBlockEvent<[player: Player, item: string]>;
    OnPlayerConsumeSucceeded: CodeBlockEvent<[player: Player, item: string]>;
    OnPlayerConsumeFailed: CodeBlockEvent<[player: Player, item: string]>;
    OnPlayerSpawnedItem: CodeBlockEvent<[player: Player, item: Entity]>;
    OnAssetSpawned: CodeBlockEvent<[entity: Entity, asset: Asset]>;
    OnAssetDespawned: CodeBlockEvent<[entity: Entity, asset: Asset]>;
    OnAssetSpawnFailed: CodeBlockEvent<[asset: Asset]>;
    OnAudioCompleted: CodeBlockEvent<[]>;
};
declare type TimerHandler = (...args: unknown[]) => void;
/**
 * Base component class
 */
export declare abstract class Component<TProps extends ComponentProps = ComponentProps, TSerializableState extends SerializableState = SerializableState> {
    readonly entityId: number;
    readonly props: TProps;
    /**
     * The entity the component is attached to
     */
    readonly entity: Entity;
    /**
     * The Horizon world
     */
    readonly world: World;
    /**
     * Called when the component is started
     */
    abstract start(): void;
    /**
     * Called when the component is cleaned up.
     *
     * Subscriptions registered via `connectCodeBlockEvent`, `connectBroadcastEvent` and
     * `connectEntityEvent` as well as timers registered via the `async` APIs will be
     * cleaned up automatically.
     */
    dispose(): void;
    /**
     * Sends an event using the existing/legacy event system. These events are networked automatically.
     * The event will be sent and handled asynchronously
     * @param targetEntity - target to send the event to
     * @param event - CodeBlockEvent
     * @param args - data to send the event
     */
    sendCodeBlockEvent<TPayload extends BuiltInVariableType[]>(targetEntity: Entity, event: CodeBlockEvent<TPayload>, ...args: TPayload): void;
    /**
     * Called when receiving the specified CodeBlock event from the given target
     * @param targetEntity - the target to listen to
     * @param event - CodeBlockEvent
     * @param callback - called when the event is received with any data as arguments
     */
    connectCodeBlockEvent<TEventArgs extends BuiltInVariableType[], TCallbackArgs extends TEventArgs>(targetEntity: Entity, event: CodeBlockEvent<TEventArgs>, callback: (...payload: TCallbackArgs) => void): EventSubscription;
    /**
     * Sends an event locally to a specific entity - NOT networked
     * The event will be sent immediately; this function does not return until delivery has completed
     * @param targetEntity - target to send the event to
     * @param event - HorizonEvent
     * @param args - data to send the event
     */
    sendEntityEvent<TPayload extends LocalEventData, TData extends TPayload>(targetEntity: Entity, event: HorizonEvent<TPayload>, data: TData): void;
    /**
     * Called when receiving the specified local event from the given target
     * @param targetEntity - the target to listen to
     * @param event - HorizonEvent
     * @param callback - called when the event is received with any data as arguments
     */
    connectEntityEvent<TPayload extends LocalEventData>(targetEntity: Entity, event: HorizonEvent<TPayload>, callback: (payload: TPayload) => void): EventSubscription;
    /**
     * Sends an event locally to all listeners - NOT networked
     * The event will be sent immediately; this function does not return until delivery has completed
     * @param event - HorizonEvent
     * @param args - data to send the event
     */
    sendBroadcastEvent<TPayload extends LocalEventData, TData extends TPayload>(event: HorizonEvent<TPayload>, data: TData): void;
    /**
     * Called when receiving the specified local event
     * @param event - HorizonEvent
     * @param callback - called when the event is received with any data as arguments
     */
    connectBroadcastEvent<TPayload extends LocalEventData>(event: HorizonEvent<TPayload>, callback: (payload: TPayload) => void): EventSubscription;
    /**
     * When the script's ownership is being transferred to a new owner,
     * the new owner can receive some serializable state from the prior owner.
     *
     * @example
     * ```
     * type Props = {initialAmmo: number};
     * type State = {ammo: number};
     * class WeaponWithAmmo extends Component<Props, State> {
     *   static propsDefinition: PropsDefinition<Props> = {
     *     initialAmmo: {type: PropTypes.Number, default: 20},
     *   };
     *   private ammo: number = 0;
     *   start() {
     *     this.ammo = this.props.initialAmmo;
     *   }
     *   receiveOwnership(state: State | null, fromPlayer: Player, toPlayer: Player) {
     *     this.ammo = state?.ammo ?? this.ammo;
     *   }
     *   transferOwnership(fromPlayer: Player, toPlayer: Player): State {
     *     return {ammo: this.ammo};
     *   }
     * }
     * ```
     *
     * @param serializableState - serializable state from prior owner, or null if that state was not valid
     * @param oldOwner - the prior owner
     * @param newOwner - the current owner
     */
    receiveOwnership(serializableState: TSerializableState | null, oldOwner: Player, newOwner: Player): void;
    /**
     * When the script's ownership is being transferred to a new owner,
     * it has the opportunity to condense its state into a serializable
     * format that will be passed to the next owner.
     *
     * @example
     * ```
     * type Props = {initialAmmo: number};
     * type State = {ammo: number};
     * class WeaponWithAmmo extends Component<Props, State> {
     *   static propsDefinition: PropsDefinition<Props> = {
     *     initialAmmo: {type: PropTypes.Number, default: 20},
     *   };
     *   private ammo: number = 0;
     *   start() {
     *     this.ammo = this.props.initialAmmo;
     *   }
     *   receiveOwnership(state: State | null, fromPlayer: Player, toPlayer: Player) {
     *     this.ammo = state?.ammo ?? this.ammo;
     *   }
     *   transferOwnership(fromPlayer: Player, toPlayer: Player): State {
     *     return {ammo: this.ammo};
     *   }
     * }
     * ```
     *
     * @param oldOwner - the prior owner
     * @param newOwner - the current owner
     * @returns serializable state to transfer to new owner
     */
    transferOwnership(oldOwner: Player, newOwner: Player): TSerializableState;
    /**
     * Async helpers. Scoped to the component for automatic cleanup on dispose
     */
    async: {
        /**
         * Sets a timer which executes a function or specified piece of code once the timer expires.
         * @param callback - A function to be compiled and executed after the timer expires.
         * @param timeout - The time, in milliseconds that the timer should wait before the specified function or code is executed.
         * If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle.
         * @param args - Additional arguments which are passed through to the function specified by callback.
         * @returns The returned timeoutID is a positive integer value which identifies the timer created by the call to setTimeout().
         * This value can be passed to clearTimeout() to cancel the timeout. It is guaranteed that a timeoutID value will never be reused
         * by a subsequent call to setTimeout() or setInterval() on the same object (a window or a worker)
         */
        setTimeout: (callback: TimerHandler, timeout?: number, ...args: unknown[]) => number;
        /**
         * Cancels a timeout previously established by calling setTimeout().
         * If the parameter provided does not identify a previously established action, this method does nothing.
         * @param id - The identifier of the timeout you want to cancel. This ID was returned by the corresponding call to setTimeout().
         */
        clearTimeout: (id: number) => void;
        /**
         * Repeatedly calls a function or executes a code snippet, with a fixed time delay between each call.
         * @param callback - A function to be compiled and executed every timeout milliseconds.
         * The first execution happens after delay milliseconds.
         * @param timeout - (optional) The time, in milliseconds (thousandths of a second), the timer should delay
         * in between executions of the specified function or code. Defaults to 0 if not specified.
         * @param arguments - (optional) Additional arguments which are passed through to the function specified by callback.
         * @returns The returned intervalID is a numeric, non-zero value which identifies the timer created by the call to setInterval();
         * this value can be passed to clearInterval() to cancel the interval.
         */
        setInterval: (callback: TimerHandler, timeout?: number, ...args: unknown[]) => number;
        /**
         * Cancels a timed, repeating action which was previously established by a call to setInterval().
         * If the parameter provided does not identify a previously established action, this method does nothing.
         * @param id - The identifier of the repeated action you want to cancel. This ID was returned by the corresponding call to setInterval().
         */
        clearInterval: (id: number) => void;
    };
    /**
     * Registers a component definition such that it can be attached to an object in the UI
     * @param componentClass - The Typescript class of the component
     * @param componentName - Name of component as you want it to show in the UI
     */
    static register<TProps extends ComponentProps, T extends IComponent<TProps>>(componentClass: T, componentName?: string): void;
    /**
     * Defines a structure of properties that this component takes as input (should mirror props)
     * This will show up in the UI as available properties
     */
    static propsDefinition: PropsDefinition<ComponentProps>;
}
export {};
 }
