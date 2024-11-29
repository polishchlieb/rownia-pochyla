export default class Modal {
  constructor() {
    this.overlay = document.querySelector('#modal-overlay');

    this.modal = document.querySelector('#modal');
    this.modal.onclick = this.hide.bind(this);

    this.canvas = document.querySelector('canvas#graph');
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.ctx = this.canvas.getContext('2d');
  }

  show() {
    this.overlay.style.display = 'flex';
    this.modal.style.display = 'flex';
  }

  hide() {
    this.overlay.style.display = 'none';
    this.modal.style.display = 'none';
  }
}