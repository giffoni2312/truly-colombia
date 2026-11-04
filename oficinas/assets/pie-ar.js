// Pie en acordeón en celular (receta truly-inbound, Anexo I): las columnas de enlaces arrancan cerradas a 760 px o menos
// y abiertas en computadora. El título de cada columna abre y cierra la suya. «Hablemos» (los datos de contacto) siempre abierta.
(function () {
  var mq = window.matchMedia('(max-width: 760px)');
  var navs = Array.prototype.slice.call(document.querySelectorAll('.local-footer .footer-columns > nav'));
  navs.forEach(function (nav, i) {
    var h = nav.querySelector('h2');
    if (!h) return;
    var lista = document.createElement('div');
    lista.className = 'pie-lista';
    lista.id = 'pie-lista-' + i;
    Array.prototype.slice.call(nav.children).forEach(function (c) { if (c !== h) lista.appendChild(c); });
    nav.appendChild(lista);
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'pie-boton';
    b.setAttribute('aria-controls', lista.id);
    b.textContent = h.textContent;
    h.textContent = '';
    h.appendChild(b);
    b.addEventListener('click', function () { poner(nav, b.getAttribute('aria-expanded') !== 'true'); });
  });
  function poner(nav, abierto) {
    var b = nav.querySelector('.pie-boton');
    if (!b) return;
    b.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    nav.classList.toggle('pie-cerrado', !abierto);
  }
  function aplicar() { navs.forEach(function (nav) { poner(nav, !mq.matches); }); }
  aplicar();
  if (mq.addEventListener) mq.addEventListener('change', aplicar); else if (mq.addListener) mq.addListener(aplicar);
})();
