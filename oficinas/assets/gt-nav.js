/* Encabezado de globaltni.com/es (receta truly-inbound, reglas R4, R5, R16, R18): mismo comportamiento que su main.js.
   Menú de celular (Menú/Cerrar), desplegables con aria-expanded + hidden, cierre al tocar fuera o con Escape,
   búsqueda en <dialog> con la lupa .gt-buscar y resultados «título + categoría →/↗». */
(() => {
  const menuButton = document.querySelector('.site-header .menu-toggle');
  const navigation = document.querySelector('#navigation');
  if (!menuButton || !navigation) return;
  const menuIconPath = menuButton.querySelector('svg path');
  const closedIconD = 'M 3 7h 18M 3 17h 18', openIconD = 'M 6 6L 18 18M 18 6L 6 18';
  const triggers = [...document.querySelectorAll('.site-header .nav-trigger')];
  const dialog = document.querySelector('.search-dialog');
  const closePanels = (except = null) => triggers.forEach(trigger => {
    if (trigger === except) return;
    trigger.setAttribute('aria-expanded', 'false');
    document.getElementById(trigger.getAttribute('aria-controls')).hidden = true;
  });
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    document.documentElement.classList.remove('a-menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('span').textContent = 'Menú';
    if (menuIconPath) menuIconPath.setAttribute('d', closedIconD);
    closePanels();
  };
  const toggleMenu = () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('a-menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('span').textContent = open ? 'Cerrar' : 'Menú';
    if (menuIconPath) menuIconPath.setAttribute('d', open ? openIconD : closedIconD);
    if (!open) closePanels();
  };
  const toggleTrigger = trigger => {
    const open = trigger.getAttribute('aria-expanded') !== 'true';
    closePanels(trigger);
    trigger.setAttribute('aria-expanded', String(open));
    document.getElementById(trigger.getAttribute('aria-controls')).hidden = !open;
  };
  // el preview.js del molde también escucha .menu-toggle y .nav-trigger: este encabezado los atiende primero (fase de captura) y corta ahí
  document.addEventListener('click', event => {
    const target = event.target.closest('.site-header .menu-toggle, .site-header .nav-trigger');
    if (!target) return;
    event.stopPropagation();
    if (target.classList.contains('menu-toggle')) toggleMenu(); else toggleTrigger(target);
  }, true);
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) {
      if (navigation.classList.contains('is-open') && !event.target.closest('.search-dialog')) closeMenu();
      else closePanels();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Tab' && navigation.classList.contains('is-open') && !(dialog && dialog.open)) {
      const controls = [...document.querySelector('.site-header').querySelectorAll('a[href],button,select')].filter(el => el.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus({preventScroll: true}); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus({preventScroll: true}); }
    }
    if (event.key !== 'Escape') return;
    if (dialog && dialog.open) { event.preventDefault(); dialog.close(); return; }
    if (navigation.classList.contains('is-open')) { closeMenu(); menuButton.focus({preventScroll: true}); return; }
    const openTrigger = triggers.find(trigger => trigger.getAttribute('aria-expanded') === 'true');
    if (openTrigger) { closePanels(); openTrigger.focus(); }
  });
  matchMedia('(min-width: 960px)').addEventListener('change', closeMenu);
  // franja al bajar (experience.js de globaltni): fondo translúcido y sombra pasados 18 px
  const header = document.querySelector('.site-header');
  let headerFrame = 0;
  const reflectScroll = () => { headerFrame = 0; header.classList.toggle('is-scrolled', scrollY > 18); };
  addEventListener('scroll', () => { if (!headerFrame) headerFrame = requestAnimationFrame(reflectScroll); }, {passive: true});
  reflectScroll();

  // búsqueda
  const lupa = document.querySelector('.site-header .gt-buscar');
  const datos = document.getElementById('gt-indice');
  if (!dialog || !lupa || !datos) return;
  const searchIndex = JSON.parse(datos.textContent);
  const searchInput = dialog.querySelector('#site-search');
  const results = dialog.querySelector('.search-results');
  const count = dialog.querySelector('.search-count');
  const normalize = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const renderResults = () => {
    const query = normalize(searchInput.value.trim());
    const terms = query.split(/\s+/).filter(Boolean);
    const score = item => {
      const title = normalize(item[0]), category = normalize(item[3]);
      const haystack = normalize(item[0] + ' ' + item[1] + ' ' + item[3]);
      if (!terms.every(term => haystack.includes(term))) return -1;
      if (!query) return 0;
      return title === query ? 100 : title.startsWith(query) ? 80 : title.includes(query) ? 60 : category.includes(query) ? 40 : 10;
    };
    const matched = searchIndex.map((item, index) => ({item, index, rank: score(item)}))
      .filter(row => row.rank >= 0).sort((a, b) => b.rank - a.rank || a.index - b.index).map(row => row.item);
    results.replaceChildren();
    matched.forEach(([title, , url, category]) => {
      const li = document.createElement('li'), anchor = document.createElement('a');
      const label = document.createElement('span'), type = document.createElement('small');
      label.textContent = title;
      type.textContent = category + (/^https?:/.test(url) ? ' ↗' : ' →');
      anchor.href = url;
      if (/^https?:/.test(url)) { anchor.target = '_blank'; anchor.rel = 'noopener'; }
      anchor.append(label, type);
      anchor.addEventListener('click', () => dialog.close());
      li.append(anchor);
      results.append(li);
    });
    count.textContent = matched.length ? `${matched.length} páginas y accesos encontrados` : 'No encontramos coincidencias. Pruebe con un servicio, una plaga u «oficina».';
  };
  lupa.addEventListener('click', () => { closePanels(); renderResults(); dialog.showModal(); searchInput.focus(); });
  dialog.querySelector('.search-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  searchInput.addEventListener('input', renderResults);
  searchInput.addEventListener('keydown', event => {
    const links = [...results.querySelectorAll('a')];
    if (!links.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); (event.key === 'ArrowDown' ? links[0] : links[links.length - 1]).focus(); }
    else if (event.key === 'Enter') { event.preventDefault(); links[0].click(); }
  });
  results.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    const links = [...results.querySelectorAll('a')];
    const index = links.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    const next = index + (event.key === 'ArrowDown' ? 1 : -1);
    if (next < 0 || next >= links.length) searchInput.focus(); else links[next].focus();
  });
  dialog.addEventListener('close', () => lupa.focus());
})();

// Pie de globaltni (R11, R16): acordeones nativos en celular y tableta (≤959 px), mapa completo abierto en computadora.
(() => {
  const compact = matchMedia('(max-width: 959px)');
  const groups = [...document.querySelectorAll('.footer-grid > details')];
  if (!groups.length) return;
  const sync = () => groups.forEach(group => {
    group.open = !compact.matches;
    group.querySelector('summary').tabIndex = compact.matches ? 0 : -1;
  });
  groups.forEach(group => group.querySelector('summary').addEventListener('click', event => {
    if (!compact.matches) event.preventDefault();
  }));
  compact.addEventListener('change', sync);
  sync();
})();
