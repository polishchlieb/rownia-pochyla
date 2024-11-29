export default class Plane {
  constructor(settings, canvas) {
    this.settings = settings;
    this.canvas = canvas;
  }

  draw(ctx) {
    const transform = ctx.getTransform();
    
    const { length, angle, scale } = this.settings;
  
    const height = scale * length * Math.sin(angle);
    const xLength = scale * length * Math.cos(angle);

    const [x, y] = [100, 100];

    ctx.translate(x, y);

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(xLength, 0);
    ctx.lineTo(xLength, height);
    ctx.closePath();
    ctx.fillStyle = 'pink';
    ctx.fill();
    ctx.fillStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(-scale / 2 * Math.sin(angle), height - scale / 2 * Math.cos(angle));
    ctx.stroke();

    ctx.setTransform(transform);
  }
}