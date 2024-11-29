import { settings } from './settings.js';
import Simulation from './simulation.js';

const canvas = document.querySelector('canvas#main');

export const simulation = new Simulation(canvas, settings);
simulation.init();

const play = document.querySelector('#play');
play.onclick = () => {
  if (simulation.paused) {
    simulation.continue();
  } else {
    simulation.reset();
    simulation.run();
  }
}

const stop = document.querySelector('#stop');
stop.onclick = () => {
  simulation.pause();
}