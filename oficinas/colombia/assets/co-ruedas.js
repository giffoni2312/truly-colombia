// Colombia hero: makes the car's wheels turn.
// The car is its own layer (co-portada-carro-recorte.png, same 1920 x 1072 frame as the street photo).
// Each rim is cut out of that layer with an elliptical mask and rotated in "circle space"
// (squeezed to a circle, rotated, stretched back), so the spokes turn with the wheel's perspective.
// With "reduce motion" turned on, nothing is drawn and the car stays still.
(function () {
  const car = document.querySelector('#inicio .co-carro img');
  if (!car || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Rims measured on the 1920 x 1072 frame: center and radii in image pixels.
  const WHEELS = [
    { cx: 918, cy: 800, rx: 40, ry: 78 },  // front
    { cx: 642, cy: 765, rx: 28, ry: 64 },  // rear
  ];
  const TURNS_PER_SECOND = 0.9;

  const canvas = document.createElement('canvas');
  canvas.className = 'co-ruedas';
  canvas.setAttribute('aria-hidden', 'true');
  car.parentElement.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Maps image pixels to canvas pixels the same way object-fit: cover does.
  function layout() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const iw = car.naturalWidth, ih = car.naturalHeight;
    const s = Math.max(w / iw, h / ih);
    const [px, py] = getComputedStyle(car).objectPosition.split(' ').map(v => parseFloat(v) / 100);
    return { dpr, s, ox: (w - iw * s) * (isNaN(px) ? 0.5 : px), oy: (h - ih * s) * (isNaN(py) ? 0.5 : py) };
  }

  let map = null;
  function frame(t) {
    if (!map) map = layout();
    const { dpr, s, ox, oy } = map;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const angle = (t / 1000) * TURNS_PER_SECOND * Math.PI * 2;
    for (const wl of WHEELS) {
      ctx.save();
      ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox, dpr * oy); // image pixels -> canvas pixels
      ctx.beginPath(); ctx.ellipse(wl.cx, wl.cy, wl.rx, wl.ry, 0, 0, Math.PI * 2); ctx.clip();
      ctx.translate(wl.cx, wl.cy);
      ctx.scale(wl.rx / wl.ry, 1);   // back to the wheel's oval
      ctx.rotate(angle);             // turn as a circle
      ctx.scale(wl.ry / wl.rx, 1);   // squeeze the oval into a circle
      ctx.translate(-wl.cx, -wl.cy);
      ctx.drawImage(car, 0, 0);
      ctx.restore();
    }
    requestAnimationFrame(frame);
  }

  const start = () => requestAnimationFrame(frame);
  if (car.complete && car.naturalWidth) start(); else car.addEventListener('load', start, { once: true });
  addEventListener('resize', () => { map = null; });
})();
