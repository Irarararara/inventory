// Phones hide the scroll bar on the About, Writing and Art cards, so on touch screens this draws a thin one over the card's right edge.
(function () {
  if (!window.matchMedia('(hover: none)').matches) return;

  var card = document.querySelector('.panel-fixed .about-card');
  if (!card) return;

  var track = document.createElement('div');
  var thumb = document.createElement('div');
  track.className = 'touch-scroll-track';
  thumb.className = 'touch-scroll-thumb';
  track.appendChild(thumb);
  document.body.appendChild(track);

  function update() {
    var over = card.scrollHeight - card.clientHeight;
    if (over <= 1) { track.style.display = 'none'; return; }

    var rect = card.getBoundingClientRect();
    var border = parseFloat(getComputedStyle(card).borderRightWidth) || 0;
    var h = card.clientHeight;
    var thumbH = Math.max(36, h * card.clientHeight / card.scrollHeight);

    track.style.display = 'block';
    track.style.top = (rect.top + card.clientTop) + 'px';
    track.style.left = (rect.right - border - track.offsetWidth) + 'px';
    track.style.height = h + 'px';
    thumb.style.height = thumbH + 'px';
    thumb.style.transform = 'translateY(' + (card.scrollTop / over) * (h - thumbH) + 'px)';
  }

  card.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
})();
