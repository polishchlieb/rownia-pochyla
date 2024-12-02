// mnożnik wysokości (pozycji na równi), które bloczek osiągnie po odbiciu
export const calculateDistanceMultiplier = ({ friction, angle, energy }) =>
  (energy * Math.sin(angle) - friction * Math.cos(angle)) / (Math.sin(angle) + friction * Math.cos(angle));

// wysokość, jaką osiągnie bloczek puszczony z prędkością początkową z początku równi
export const calculateInitialHeight = ({ friction, angle, gravity, initialVelocity }) =>
  initialVelocity ** 2 / (2 * gravity * Math.sin(angle) + 2 * friction * gravity * Math.cos(angle));

// czy bloczek wyleci poza rownie przy danej predkosci poczatkowej
export const willFlyOff = ({ friction, angle, gravity, blockSize, length, initialVelocity }) =>
  calculateInitialHeight({ friction, angle, gravity, initialVelocity }) + blockSize > length;

// prędkość bloczka po odbiciu
export const calculateBounceVelocity = ({ gravity, friction, angle, energy }, length) =>
  Math.sqrt(2 * energy * gravity * length * Math.sin(angle) - 2 * friction * gravity * length * Math.cos(angle));

// przyspieszenie bloczka w dół równi
export const calculateAccelerationDown = ({ gravity, friction, angle }) =>
  -(gravity * Math.sin(angle) - friction * gravity * Math.cos(angle));

// przyspieszenie bloczka w górę równi
export const calculateAccelerationUp = ({ gravity, friction, angle }) =>
  -(gravity * Math.sin(angle) + friction * gravity * Math.cos(angle));

// czy bloczek zacznie się zsuwać
export const willMove = ({ gravity, friction, angle }) =>
  gravity * Math.sin(angle) > friction * gravity * Math.cos(angle);

export const calculateMaxAcceleration = calculateAccelerationUp;

// ruch jednostajnie przyspieszony
export default class Motion {
  constructor(acceleration, initialPosition, initialVelocity, settings) {
    this.start = Date.now();
    this.acceleration = acceleration;
    this.initialPosition = initialPosition;
    this.initialVelocity = initialVelocity;
    this.settings = settings;
  }

  calculateVelocity(time) {
    const { timeSpeed } = this.settings;
    const timeElapsed = (time - this.start) / 1000 * timeSpeed;
    return (this.initialVelocity + this.acceleration * timeElapsed);
  }

  calculateDistance(time) {
    const { timeSpeed } = this.settings;
    const timeElapsed = (time - this.start) / 1000 * timeSpeed;
    return (this.initialPosition + this.initialVelocity * timeElapsed + this.acceleration / 2 * timeElapsed ** 2);
  }

  shift(by) {
    this.start += by;
  }
}