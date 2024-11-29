import { simulation } from './index.js';

export const settings = {
  displayVectors: true,
  angle: 30 / 180 * Math.PI, // 30 deg
  length: 6,
  blockSize: 0.5,
  energy: 1,
  friction: 0.5,
  timeSpeed: 1,
  scale: 150,
  gravity: 9.81,
  initialVelocity: 0
};

const inputs = {
  displayVectors: document.querySelector('#display-vectors'),
  angle: document.querySelector('#angle'),
  height: document.querySelector('#height'),
  size: document.querySelector('#size'),
  energy: document.querySelector('#energy'),
  friction: document.querySelector('#friction'),
  timeSpeed: document.querySelector('#time-speed'),
  scale: document.querySelector('#scale'),
  gravity: document.querySelector('#gravity'),
  initialVelocity: document.querySelector('#initial-velocity')
};

export function isDataValid() {
  const angle = parseFloat(inputs.angle.value);
  if (isNaN(angle) || angle < 0 || angle > 90)
    return false;

  const height = parseFloat(inputs.height.value);
  if (isNaN(height) || height < 0)
    return false;

  const size = parseFloat(inputs.size.value);
  if (isNaN(size) || size < 0)
    return false;

  const energy = parseFloat(inputs.energy.value);
  if (isNaN(energy) || energy < 0 || energy > 100)
    return false;

  const friction = parseFloat(inputs.friction.value);
  if (isNaN(friction) || friction < 0)
    return false;

  const timeSpeed = parseFloat(inputs.timeSpeed.value);
  if (isNaN(timeSpeed) || timeSpeed < 0)
    return false;

  const scale = parseFloat(inputs.scale.value);
  if (isNaN(scale) || scale < 0)
    return false;

  const gravity = parseFloat(inputs.gravity.value);
  if (isNaN(gravity))
    return false;

  const initialVelocity = parseFloat(inputs.initialVelocity.value);
  if (isNaN(initialVelocity) || initialVelocity < 0)
    return false;

  return true;
}

export function adjustScale({ width, height }) {
  const xScale = width / (2 * settings.length * Math.cos(settings.angle)) * 0.7;
  const yScale = height / (2 * settings.length * Math.sin(settings.angle)) * 1.2;
  settings.scale = Math.min(xScale, yScale);
  inputs.scale.value = Math.floor(settings.scale * 100) / 100;
}

export function setupSettingsListeners(canvas) {
  inputs.displayVectors.onchange = event =>
    settings.displayVectors = event.target.checked;
  
  inputs.angle.oninput = event => {
    const angleDeg = parseFloat(event.target.value);
    settings.angle = angleDeg / 180 * Math.PI;
  
    const height = parseInt(inputs.height.value);
    settings.length = height / Math.sin(settings.angle);

    adjustScale(canvas);

    simulation.reset();
  }
  
  inputs.height.oninput = event => {
    const value = parseFloat(event.target.value);
    settings.length = value / Math.sin(settings.angle);

    adjustScale(canvas);

    simulation.reset();
  }
  
  inputs.friction.oninput = event => {
    const value = parseFloat(event.target.value);
    settings.friction = value;
    simulation.reset();
  }
  
  inputs.size.oninput = event => {
    const value = parseFloat(event.target.value);
    settings.blockSize = value;
    simulation.reset();
  }
  
  inputs.energy.oninput = event => {
    const value = parseFloat(event.target.value);
    settings.energy = value / 100;
    simulation.reset();
  }
  
  inputs.timeSpeed.oninput = event => {
    settings.timeSpeed = parseFloat(event.target.value);
    simulation.reset();
  }
  
  inputs.gravity.oninput = event => {
    settings.gravity = parseFloat(event.target.value);
    simulation.reset();
  }
  
  inputs.scale.oninput = event => {
    settings.scale = parseFloat(event.target.value);
    simulation.reset();
  }

  inputs.initialVelocity.oninput = event => {
    settings.initialVelocity = parseFloat(event.target.value);
    simulation.reset();
  }
}