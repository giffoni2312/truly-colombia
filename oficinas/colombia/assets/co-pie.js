// Footer accordion like globaltni.com/es: on the phone the link columns start closed and open on tap; on computers
// they stay open. Also on the phone the assistant button hides while scrolling down and comes back when scrolling up.
(function () {
  var movil = matchMedia('(max-width:760px)');
  var cols = document.querySelectorAll('.pie-col');
  function ajustar() { cols.forEach(function (d) { d.open = !movil.matches; }); }
  ajustar();
  if (movil.addEventListener) movil.addEventListener('change', ajustar);
  cols.forEach(function (d) {
    d.querySelector('summary').addEventListener('click', function (ev) { if (!movil.matches) ev.preventDefault(); });
  });
  var ultimo = window.scrollY, quieto;
  window.addEventListener('scroll', function () {
    if (!movil.matches) return;
    var y = window.scrollY, abajo = y > ultimo + 4, arriba = y < ultimo - 4;
    if (abajo && y > 200) document.body.classList.add('tia-oculto');
    if (arriba) document.body.classList.remove('tia-oculto');
    ultimo = y; clearTimeout(quieto);
    quieto = setTimeout(function () { document.body.classList.remove('tia-oculto'); }, 900);
  }, { passive: true });
})();
