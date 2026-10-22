(() => {
  'use strict';
  const bookElement = document.getElementById('dossier');
  const position = document.getElementById('book-position');
  const stage = document.querySelector('.book-stage');
  const previous = document.getElementById('previous');
  const next = document.getElementById('next');
  const nextLabel = document.getElementById('next-label');
  const pageName = document.getElementById('page-name');
  const status = document.getElementById('reader-status');
  const pages = Array.from(bookElement.querySelectorAll('.page'));
  const dots = Array.from(document.querySelectorAll('.page-dots i'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reader;
  let turning = false;
  let resizeTimer;
  let lastStageWidth = 0;

  function measure() {
    const width = stage.clientWidth;
    const portrait = true;
    const pageWidth = Math.min(480, width);
    const pageHeight = pageWidth * 840 / 480;
    document.documentElement.style.setProperty('--page-w', `${pageWidth}px`);
    document.documentElement.style.setProperty('--page-h', `${pageHeight}px`);
    position.style.width = `${pageWidth}px`;
    lastStageWidth = width;
    return {portrait, pageWidth, pageHeight};
  }

  function update() {
    const current = reader.getCurrentPageIndex();
    const portrait = reader.getOrientation() === 'portrait';
    const first = current === 0;
    const last = current === pages.length - 1;
    position.classList.toggle('is-front', first && !portrait);
    position.classList.toggle('is-back', last && !portrait);
    previous.disabled = first || turning;
    next.disabled = last || turning;
    nextLabel.textContent = first ? 'ABRIR' : 'PRÓXIMA';
    next.setAttribute('aria-label', first ? 'Abrir dossiê' : 'Próxima página');
    let label = 'CAPA';
    if (last) label = 'ADENDO RESERVADO';
    else if (!first) label = portrait ? `FOLHA ${String(current).padStart(2, '0')} / 08` : `FOLHAS ${String(current).padStart(2, '0')}—${String(Math.min(current + 1, 8)).padStart(2, '0')} / 08`;
    pageName.textContent = label;
    dots.forEach((dot, index) => dot.classList.toggle('active', index === current || (!portrait && !first && !last && index === current + 1)));
    pages.forEach((page,index) => {
      const visible = index === current || (!portrait && !first && !last && index === current + 1);
      page.setAttribute('aria-hidden', String(!visible));
      page.inert = !visible;
    });
    status.textContent = first ? 'Capa do dossiê. Use Abrir para começar.' : last ? 'Adendo reservado. Fim do dossiê.' : `${label}. ${pages[current].dataset.title}.`;
    bookElement.dataset.currentPage = String(current);
    bookElement.dataset.orientation = portrait ? 'portrait' : 'landscape';
  }

  function advance(direction) {
    if (turning) return;
    const current = reader.getCurrentPageIndex();
    if ((direction > 0 && current >= pages.length - 1) || (direction < 0 && current <= 0)) return;
    if (reducedMotion.matches) {
      direction > 0 ? reader.turnToNextPage() : reader.turnToPrevPage();
    } else {
      direction > 0 ? reader.flipNext('bottom') : reader.flipPrev('bottom');
    }
    update();
  }

  try {
    const {pageWidth,pageHeight} = measure();
    if (!window.St || !window.St.PageFlip) throw new Error('Page flip unavailable');
    reader = new St.PageFlip(bookElement, {
      width: pageWidth, height: pageHeight,
      size: 'stretch', minWidth: 260, maxWidth: 480, minHeight: 455, maxHeight: 840,
      showCover: false, usePortrait: true, autoSize: true, drawShadow: true,
      flippingTime: 1250, maxShadowOpacity: 0.48, mobileScrollSupport: false,
      swipeDistance: 45, clickEventForward: true, useMouseEvents: true,
      disableFlipByClick: false, showPageCorners: true, startZIndex: 1
    });
    reader.on('init', update);
    reader.on('flip', update);
    reader.on('changeOrientation', () => requestAnimationFrame(update));
    reader.on('changeState', event => {
      turning = event.data === 'flipping';
      update();
    });
    reader.loadFromHTML(pages);
    previous.addEventListener('click', () => advance(-1));
    next.addEventListener('click', () => advance(1));
    document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', event => {
      event.stopPropagation();
      advance(1);
    }));
    document.getElementById('close-file').addEventListener('click', event => {
      event.stopPropagation();
      reader.turnToPage(0);
      turning = false;
      update();
    });
    document.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select')) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); advance(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); advance(-1); }
      if (event.key === 'Home') { event.preventDefault(); reader.turnToPage(0); update(); }
      if (event.key === 'End') { event.preventDefault(); reader.turnToPage(pages.length - 1); update(); }
    });
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (Math.abs(stage.clientWidth - lastStageWidth) < 2) return;
        if (turning) {
          resizeTimer = setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
          return;
        }
        measure(); reader.update(); update();
      }, 150);
    });
    document.documentElement.classList.add('reader-ready');
  } catch (error) {
    document.documentElement.classList.add('no-flip');
    pages.forEach(page => { page.inert = false; page.removeAttribute('aria-hidden'); });
    console.error(error);
  }
})();
