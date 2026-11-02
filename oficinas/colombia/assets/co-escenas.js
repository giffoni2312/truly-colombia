// Colombia hero film in two scenes, like Venezuela's escenas.js and globaltni.com/es: the car in Medellín plays once
// in full, the shared world video fades in over it (0.8 s), runs 10 s and fades out leaving the car from the start.
// The loop jump is never seen. Unlike escenas.js it does not stop with "reduce motion": the owner wants the hero
// moving for every visitor (his own Windows has animations off). Both videos are created here, after preview.js,
// so preview.js neither pauses them nor puts them in a loop.
(function () {
  var film = document.querySelector('#inicio .film');
  if (!film) return;
  var FUNDIDO = 0.8, MUNDO = 10, CARRO_FIN = 10; // new car (31-oct): 10 s Gemini/Veo take from Pablo's base, quieto 3 %, flujo OK, 4K upscaled

  function video(src, z) {
    var v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.setAttribute('aria-hidden', 'true');
    v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity ' + FUNDIDO + 's linear;z-index:' + z;
    if (src) { v.preload = 'auto'; v.src = src; } else { v.preload = 'none'; }
    film.appendChild(v); return v;
  }
  // 4K (Real-ESRGAN in Colab, receta c4k, 1-nov-2026) for screens that can show it; HD for phones and small screens.
  var grande = (window.innerWidth || 0) * (window.devicePixelRatio || 1) > 1920;
  // Phone (receta: <id>-movil.mp4, vertical): until the vertical video exists the phone keeps the vertical still
  // (colombia-movil.webp); a horizontal video would cut the car in a tall screen.
  var MOVIL = '/truly-colombia/oficinas/colombia/assets/colombia-movil.mp4?v=3';
  if ((window.innerWidth || 0) <= 760 && !MOVIL) return;
  var carro = video((window.innerWidth || 0) <= 760 ? MOVIL : grande ? '/truly-colombia/oficinas/colombia/assets/colombia-desktop-4k.mp4?v=7' : '/truly-colombia/oficinas/colombia/assets/colombia-desktop.mp4?v=18', 1);
  var mundo = video('', 2);
  var enMundo = false, cambiando = false;
  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function cargar() { if (!mundo.getAttribute('src')) { mundo.src = (window.innerWidth || 0) <= 760 ? '/truly-colombia/oficinas/colombia/assets/co-mundo-movil.mp4?v=1' : grande ? '/truly-colombia/oficinas/colombia/assets/co-mundo-desktop-4k.mp4?v=1' : '/truly-colombia/oficinas/assets/mundo-desktop.mp4'; mundo.load(); } }
  function aMundo() {
    if (enMundo || cambiando) return; cambiando = true; cargar();
    mundo.currentTime = 0; play(mundo); mundo.style.opacity = '1';
    setTimeout(function () { carro.pause(); enMundo = true; cambiando = false; }, FUNDIDO * 1000);
  }
  function aCarro() {
    if (!enMundo || cambiando) return; cambiando = true;
    carro.currentTime = 0; play(carro); mundo.style.opacity = '0';
    setTimeout(function () { mundo.pause(); enMundo = false; cambiando = false; }, FUNDIDO * 1000);
  }
  carro.addEventListener('playing', function () { carro.style.opacity = '1'; }, { once: true });
  carro.addEventListener('timeupdate', function () {
    var fin = Math.min(CARRO_FIN, carro.duration || CARRO_FIN);
    if (!enMundo && carro.currentTime >= fin - FUNDIDO) aMundo();
  });
  carro.addEventListener('ended', aMundo);
  mundo.addEventListener('timeupdate', function () {
    var fin = Math.min(MUNDO, mundo.duration || MUNDO);
    if (enMundo && mundo.currentTime >= fin - FUNDIDO) aCarro();
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { carro.pause(); mundo.pause(); } else { play(enMundo ? mundo : carro); }
  });
  play(carro);
  setTimeout(cargar, 4000);
})();
