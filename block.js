import { drawArrow } from './helpers.js';
import Motion, {
  calculateAccelerationDown,
  calculateAccelerationUp,
  calculateBounceVelocity,
  calculateDistanceMultiplier,
  calculateInitialHeight,
  willFlyOff,
  willMove
} from './motion.js';

const Direction = Object.freeze({
  down: 0,
  up: 1
});

export class Block {
  running = false;

  constructor(settings) {
    this.settings = settings;
    this.reset();
  }

  reset() {
    this.velocityDiscontinuous = false;
    this.accelerationDiscontinuous = false;

    const { length, blockSize, scale } = this.settings;

    this.running = false;

    this.bounces = 0;

    if (this.settings.initialVelocity === 0) {
      let acceleration = calculateAccelerationDown(this.settings) * scale;
      if (acceleration > 0) // bloczek nie zacznie się zsuwać
        acceleration = 0;
      this.position = scale * (length - blockSize);
      this.motion = new Motion(acceleration, this.position, 0, this.settings);
      this.velocity = 0;
      this.bounceHeight = this.position;
      this.direction = Direction.down;
    } else {
      let acceleration = calculateAccelerationUp(this.settings) * scale;
      this.position = 0;
      this.motion = new Motion(acceleration, this.position, this.settings.initialVelocity * scale, this.settings);
      this.velocity = this.settings.initialVelocity * scale;
      this.bounceHeight = calculateInitialHeight(this.settings) * scale;
      this.direction = Direction.up;
    }    
  }

  updateMotion(time) {
    this.velocity = this.motion.calculateVelocity(time);
    this.position = this.motion.calculateDistance(time);
    
    this.accelerationDiscontinuous = false;
    this.velocityDiscontinuous = false;

    if (this.shouldChangeDirection()) {
      this.accelerationDiscontinuous = true;
      this.slideDown();
    }

    if (this.hitWall()) {
      this.accelerationDiscontinuous = true;
      this.velocityDiscontinuous = true;
      this.bounce();
    }
    
    if (this.motion.acceleration > 0) {
      this.velocity = 0;
      this.motion = new Motion(0, this.position, 0, this.settings);
      return;
    }
  }

  shouldChangeDirection() {
    return this.velocity < 0 && this.direction === Direction.up;
  }

  hitWall() {
    return this.position <= 0 && this.velocity <= 1 / this.settings.scale;
  }

  willMove() {
    return willMove(this.settings);
  }

  willFlyOff() {
    return willFlyOff(this.settings);
  }

  slideDown() {
    this.position = this.bounceHeight;
    const { scale } = this.settings;

    const acceleration = calculateAccelerationDown(this.settings) * scale;

    // bloczek nie zacznie się zsuwać
    if (acceleration > 0) {
      this.motion = new Motion(0, this.position, 0, this.settings);
      this.running = false;
      return;
    }

    this.motion = new Motion(acceleration, this.position, 0, this.settings);
    this.velocity = 0;
    this.direction = Direction.down;
  }

  bounce() {
    const { scale } = this.settings;

    if (this.bounceHeight < 1) {
      this.running = false;
      this.motion = new Motion(0, 0, 0, this.settings);
      this.velocity = 0;
      this.position = 0;
      return;
    }

    this.bounces++;

    const acceleration = calculateAccelerationUp(this.settings) * scale;

    // these return NaN if the block doesn't move, need to || 0
    const velocity = calculateBounceVelocity(this.settings, this.bounceHeight / scale) * scale || 0;
    this.bounceHeight *= calculateDistanceMultiplier(this.settings) || 0;

    this.motion = new Motion(acceleration, 0, velocity, this.settings);
    this.position = 0;
    this.velocity = velocity;

    this.direction = Direction.up;
  }

  draw(ctx) {
    const transform = ctx.getTransform();

    const { length, angle, displayVectors, blockSize, scale } = this.settings;
    const height = scale * length * Math.sin(angle);

    ctx.translate(100, 100);
    ctx.translate(0, height);
    ctx.rotate(-angle);

    ctx.fillRect(this.position, 0, blockSize * scale, -blockSize * scale);

    if (displayVectors) {
      const vectorX = this.position + blockSize * scale / 2;
      const vectorY = -blockSize / 2 * scale;
      drawArrow(ctx, vectorX, vectorY, this.velocity, 'red', 'v');
      drawArrow(ctx, vectorX, vectorY + 5, this.motion.acceleration, 'blue', 'a');
    }

    ctx.setTransform(transform);
  }
}