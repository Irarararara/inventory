// Keeps each note on screen, and on touch screens makes the first tap open the note and the second follow the link.
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.mat-item, .pigeon-link'));
  var noHover = window.matchMedia('(hover: none)');
  var MARGIN = 8;
  var open = null;

  // slide the note sideways to stay inside the screen (the tail keeps pointing at the item),
  // and drop it below the item when there is no room above
  function place(item) {
    var tip = item.querySelector('.tip');
    if (!tip) return;
    item.classList.remove('tip-below');
    item.style.setProperty('--sx', '0px');
    var r = tip.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var sx = 0;
    if (r.left < MARGIN) sx = MARGIN - r.left;
    else if (r.right > vw - MARGIN) sx = vw - MARGIN - r.right;
    item.style.setProperty('--sx', sx + 'px');
    if (r.top < MARGIN) {
      var ir = item.getBoundingClientRect();
      var vh = document.documentElement.clientHeight;
      if (vh - ir.bottom > ir.top) item.classList.add('tip-below');   // whichever side has more room
    }
  }

  function close() {
    if (open) open.classList.remove('is-open');
    open = null;
  }

  // only one note at a time: reaching for another item puts away any note left open by a tap or a click
  function closeOthers(item) {
    items.forEach(function (other) {
      if (other === item) return;
      other.classList.remove('is-open');
      if (other.contains(document.activeElement)) document.activeElement.blur();
    });
    if (open && open !== item) open = null;
  }

  items.forEach(function (item) {
    item.addEventListener('mouseenter', function () { closeOthers(item); place(item); });
    item.addEventListener('focusin', function () { closeOthers(item); place(item); });
    item.addEventListener('click', function (e) {
      if (!noHover.matches) return;
      if (e.target.closest && e.target.closest('.tip a')) return;   // the album link inside a note
      if (open !== item) {
        e.preventDefault();
        close();
        place(item);
        item.classList.add('is-open');
        open = item;
      } else if (item.tagName !== 'A') {
        close();
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (open && !open.contains(e.target)) close();
  });

  window.addEventListener('resize', close);
})();

// Album slideshow in the headphones note: the arrows (or a swipe) slide between the covers, and a title that is too
// long for its slide is shrunk a little so it always stays on one line.
(function () {
  var box = document.querySelector('[data-slides]');
  if (!box) return;
  var track = box.querySelector('.album-track');
  var slides = Array.prototype.slice.call(track.children);
  var current = 0;

  var dots = document.createElement('span');
  dots.className = 'album-dots';
  dots.setAttribute('aria-hidden', 'true');
  slides.forEach(function () { dots.appendChild(document.createElement('i')); });
  box.appendChild(dots);

  function show(i) {
    current = (i + slides.length) % slides.length;   // after the last album it loops back to the first, and the other way round
    track.style.setProperty('--i', current);
    slides.forEach(function (s, n) {
      s.tabIndex = n === current ? 0 : -1;
      s.setAttribute('aria-hidden', n === current ? 'false' : 'true');
      dots.children[n].className = n === current ? 'on' : '';
    });
  }

  function step(by, e) {
    e.preventDefault();
    e.stopPropagation();
    show(current + by);
  }
  box.querySelector('.album-prev').addEventListener('click', function (e) { step(-1, e); });
  box.querySelector('.album-next').addEventListener('click', function (e) { step(1, e); });

  // swipe left or right on the cover
  var startX = null;
  track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 30) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  function fitTitles() {
    slides.forEach(function (a) {
      var label = a.querySelector('span');
      var size = 12;
      label.style.fontSize = '';
      while (label.scrollWidth > a.clientWidth - 4 && size > 8) {
        size -= 0.5;
        label.style.fontSize = size + 'px';
      }
    });
  }
  fitTitles();
  window.addEventListener('load', fitTitles);
  window.addEventListener('resize', fitTitles);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitles);

  show(0);
})();
