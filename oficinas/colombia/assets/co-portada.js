// Colombia hero: the car driving through Medellín (video made with Google Flow from the hero photo).
// The video is created here, after the site's preview.js has run, so preview.js does not pause it:
// the owner wants the hero moving for every visitor, even with "reduce motion" on.
// The whole 8 s take is used (measured with flujo.py: the road flows the same way in every stretch); at the end it fades
// to the still photo underneath (same picture as frame 0), jumps back to the start and fades in again.
(function () {
  const film = document.querySelector('#inicio .film');
  if (!film) return;
  const LIMIT = 7.8, FADE = 0.35;

  const v = document.createElement('video');
  v.muted = true; v.playsInline = true; v.preload = 'auto';
  v.setAttribute('aria-hidden', 'true');
  v.className = 'co-portada-video';
  v.src = '/truly-colombia/oficinas/colombia/assets/co-portada-medellin-v2.mp4';
  film.appendChild(v);

  const play = () => { if (!document.hidden) v.play().catch(() => {}); };
  v.addEventListener('playing', () => v.classList.add('lista'), { once: true });
  v.addEventListener('timeupdate', () => {
    if (v.currentTime >= LIMIT - FADE) v.classList.add('cambio');
    if (v.currentTime >= LIMIT) { v.currentTime = 0; v.classList.remove('cambio'); }
  });
  v.addEventListener('ended', () => { v.currentTime = 0; v.classList.remove('cambio'); play(); });
  document.addEventListener('visibilitychange', () => (document.hidden ? v.pause() : play()));
  play();
})();
