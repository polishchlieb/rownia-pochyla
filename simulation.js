import { Block } from './block.js';
import Graph from './graph.js';
import Modal from './modal.js';
import {
  calculateBounceVelocity, calculateInitialHeight, calculateMaxAcceleration
} from './motion.js';
import Plane from './plane.js';
import {
  adjustScale, isDataValid, setupSettingsListeners
} from './settings.js';

export default class Simulation {
  constructor(canvas, settings) {
    this.canvas = document.querySelector('#main');
    this.ctx = this.canvas.getContext('2d');

    setupSettingsListeners(this.canvas);

    this.modal = new Modal();

    this.activeGraph = null;

    this.modal.canvas.onmousemove = event => {
      const canvasPos = this.modal.canvas.getBoundingClientRect();

      this.x = event.clientX - canvasPos.x;
      this.y = event.clientY - canvasPos.y;
    }

    this.positionGraphCanvas = document.querySelector('#position-graph');
    this.positionGraphCtx = this.positionGraphCanvas.getContext('2d');
    this.positionGraphCanvas.onclick = () => {
      this.modal.show();
      this.activeGraph = this.positionGraphCtx;
    }

    this.velocityGraphCanvas = document.querySelector('#velocity-graph');
    this.velocityGraphCtx = this.velocityGraphCanvas.getContext('2d');
    this.velocityGraphCanvas.onclick = () => {
      this.modal.show();
      this.activeGraph = this.velocityGraphCtx;
    }

    this.accelerationGraphCanvas = document.querySelector('#acceleration-graph');
    this.accelerationGraphCtx = this.accelerationGraphCanvas.getContext('2d');
    this.accelerationGraphCanvas.onclick = () => {
      this.modal.show();
      this.activeGraph = this.accelerationGraphCtx;
    }

    this.settings = settings;

    this.running = false;

    this.reset();
  }

  init() {
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight - 150;
      adjustScale(this.canvas);
    }

    resize();
    window.onresize = resize;

    this.reset();
    this.loop();
  }

  run() {
    this.block.running = true;
    this.startTime = Date.now();
  }

  displayError(value) {
    const error = document.querySelector('.error');
    error.style.display = 'block';
    error.innerHTML = value;
  }

  hideError() {
    const error = document.querySelector('.error');
    error.style.display = 'none';
    error.innerHTML = '';
  }

  pause() {
    if (!this.block.running)
      return;

    this.block.running = false;
    this.paused = true;
  }

  continue() {
    const pauseTime = Date.now() - this.endTime
    this.block.motion.shift(pauseTime);
    this.paused = false;
    this.block.running = true;
    this.startTime += pauseTime;
  }

  reset() {
    this.paused = false;

    if (!isDataValid()) {
      this.displayError('Wprowadzono nieprawidłowe dane');
      return;
    }

    this.hideError();

    const { length, scale, initialVelocity } = this.settings;
    const maxPos = initialVelocity === 0
      ? length * scale + 40
      : calculateInitialHeight(this.settings) * scale + 40;

    const positionMarker = Math.floor(length * 100) / 100;
    this.positionGraph = new Graph([40, 400], {
      maxPos,
      maxNeg: 0,
      negY: 10,
      xLabel: 't',
      yLabel: 'x',
      scale,
      yMarkers: [
        [maxPos - 40, `${positionMarker}`]
      ]
    });

    const maxVel = Math.max(
      calculateBounceVelocity(this.settings, length),
      initialVelocity
    );
    const velocityMarker = Math.floor(maxVel * 100) / 100;
    this.velocityGraph = new Graph([40, 260], {
      maxPos: maxVel * scale + 40,
      maxNeg: maxVel * scale + 40,
      posY: 200,
      negY: 200,
      xLabel: 't',
      yLabel: 'v',
      scale,
      yMarkers: [
        [maxVel * scale, `${velocityMarker}`],
        [-maxVel * scale, `-${velocityMarker}`]
      ]
    });

    const maxAcc = Math.abs(calculateMaxAcceleration(this.settings));
    const accMarker = Math.floor(maxAcc * 100) / 100;
    this.accelerationGraph = new Graph([40, 120], {
      negY: 300,
      posY: 40,
      maxPos: 0,
      maxNeg: maxAcc * scale + 40,
      scale,
      yMarkers: [
        [-maxAcc * scale, `-${accMarker}`]
      ]
    });

    this.plane = new Plane(this.settings);

    this.block = new Block(this.settings);
    if (!this.block.willMove())
      this.displayError('Bloczek nie zacznie się zsuwać.');
    if (this.block.willFlyOff())
      this.displayError('Bloczek wyleci poza równię');
  }

  loop() {
    const now = Date.now();

    if (!this.block)
      return;
    if (this.block.running) {
      this.endTime = now;
      const elapsed = this.endTime - this.startTime;

      if (this.block.velocityDiscontinuous)
        this.velocityGraph.willBeDiscontinuous();
      if (this.block.accelerationDiscontinuous)
        this.accelerationGraph.willBeDiscontinuous();

      this.positionGraph.addNextPoint(elapsed, this.block.position);
      this.velocityGraph.addNextPoint(elapsed, this.block.velocity);
      this.accelerationGraph.addNextPoint(elapsed, this.block.motion.acceleration);

      this.block.updateMotion(now);
    }

    this.draw();

    window.requestAnimationFrame(this.loop.bind(this));
  }

  draw() {
    this.modal.ctx.clearRect(0, 0, this.modal.canvas.width, this.modal.canvas.height);
  
    this.positionGraphCtx.clearRect(
      0, 0, this.positionGraphCanvas.width, this.positionGraphCanvas.height
    );
    this.positionGraphCtx.scale(0.4, 0.4);
    this.positionGraph.draw(this.positionGraphCtx, [40, 340]);
    this.positionGraphCtx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.activeGraph === this.positionGraphCtx) {
      this.positionGraph.draw(this.modal.ctx);
      this.positionGraph.setMousePosition(this.x);
    }

    this.velocityGraphCtx.clearRect(
      0, 0, this.velocityGraphCanvas.width, this.velocityGraphCanvas.height
    );
    this.velocityGraphCtx.scale(0.3, 0.3);
    this.velocityGraph.draw(this.velocityGraphCtx, [40, 250]);
    if (this.activeGraph === this.velocityGraphCtx) {
      this.velocityGraph.draw(this.modal.ctx);
      this.velocityGraph.setMousePosition(this.x);
    }
    this.velocityGraphCtx.setTransform(1, 0, 0, 1, 0, 0);

    this.accelerationGraphCtx.clearRect(
      0, 0, this.accelerationGraphCanvas.width, this.accelerationGraphCanvas.height
    );
    this.accelerationGraphCtx.scale(0.4, 0.4);
    this.accelerationGraph.draw(this.accelerationGraphCtx, [40, 80]);
    if (this.activeGraph === this.accelerationGraphCtx) {
      this.accelerationGraph.draw(this.modal.ctx);
      this.accelerationGraph.setMousePosition(this.x);
    }
    this.accelerationGraphCtx.setTransform(1, 0, 0, 1, 0, 0);
  
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = '20px Arial';
    this.ctx.fillText('Odbicia: ' + this.block.bounces, 30, 40);

    if (this.block.running || this.block.position === 0 || this.paused)
      this.ctx.fillText('Czas: ' + (this.endTime - this.startTime) / 1000 + 's', 30, 70);
  
    this.plane.draw(this.ctx);
    this.block.draw(this.ctx);
  }
}