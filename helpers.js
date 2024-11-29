export const drawArrow = (ctx, x, y, length, color = 'black', label) => {
  const transform = ctx.getTransform();

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + length, y);
  ctx.stroke();
  ctx.strokeStyle = 'black';

  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.translate(x + length, y);
  ctx.scale(Math.sign(length), Math.sign(length));
  ctx.moveTo(10, 0);
  ctx.lineTo(0, -10);
  ctx.lineTo(0, 10);

  ctx.closePath();

  ctx.fill();

  ctx.scale(Math.sign(length), Math.sign(length));
  if (label) {
    ctx.font = '20px Arial';
    ctx.fillText(label, 20, 10);
  }

  ctx.fillStyle = 'black';

  ctx.setTransform(transform);
}

export const drawDottedLine = (ctx, x1, y1, x2, y2) => {
  const angle = Math.atan((y2 - y1) / (x2 - x1));
  const length = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

  const transform = ctx.getTransform();

  ctx.translate(x1, y1);
  ctx.rotate(-angle);
  for (let i = 1; i < length / 10; ++i) {
    ctx.beginPath();
    ctx.moveTo(-i * 10, 0);
    ctx.lineTo(-i * 10 + 7, 0);
    ctx.stroke();
  }

  ctx.setTransform(transform);
}