/* ── Truly AI · chat DISABLED in this local copy ─────────────────────────────
   The real widget (saved as chat.original.js) talks to the live Truly AI hub.
   This copy is a local practice site: nothing is sent anywhere. Clicking any chat
   button only shows a notice. Restore by copying chat.original.js back to chat.js. */
(function () {
  const NOTICE = 'El chat de Truly AI está desactivado en este borrador. En el sitio oficial lo atiende el asistente.';
  // chat.css hides the widget until the page has the 'js' class (the real chat.js adds it); show the button, disabled.
  document.documentElement.classList.add('js');
  function show() {
    let box = document.getElementById('chat-disabled-notice');
    if (!box) {
      box = document.createElement('div');
      box.id = 'chat-disabled-notice';
      box.setAttribute('role', 'status');
      box.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;max-width:420px;margin-left:auto;z-index:9999;' +
        'background:#1f2a44;color:#fff;padding:14px 16px;border-radius:10px;border:2px solid #f5c400;' +
        'font:15px/1.4 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25)';
      document.body.appendChild(box);
    }
    box.textContent = NOTICE;
    clearTimeout(show.timer);
    show.timer = setTimeout(() => box.remove(), 5000);
  }
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-abrir-chat], .sop-boton, [data-chat-prompt], [data-chat] button, [data-chat] form');
    if (!target) return;
    e.preventDefault();
    show();
  }, true);
  document.addEventListener('submit', (e) => {
    if (e.target.closest('[data-chat]')) { e.preventDefault(); show(); }
  }, true);
  window.trulyIA = { montar: () => () => {} };
})();
