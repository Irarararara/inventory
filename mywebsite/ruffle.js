// Makes the leaves on the main page's branches ruffle when someone clicks (or taps) a branch.
// branches.js supplies the branch drawings with every leaf as its own piece; this puts them on the
// page and shakes the leaves, starting with the ones closest to the click and rippling outward.
(function () {
  if (!window.BRANCH_SVGS) return; // without the drawings, the plain branch pictures just stay as they are

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.branch-art[data-branch]').forEach(function (slot) {
    var markup = window.BRANCH_SVGS[slot.getAttribute('data-branch')];
    if (!markup) return;

    slot.innerHTML = markup;
    var svg = slot.firstElementChild;
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');

    svg.querySelectorAll('.leaf').forEach(function (leaf) {
      var amp = 8 + Math.random() * 8; // how far this leaf swings, in degrees
      leaf.style.setProperty('--amp', (Math.random() < 0.5 ? -amp : amp).toFixed(1));
      leaf.addEventListener('animationend', function () {
        leaf.classList.remove('ruffling');
      });
    });

    // Only clicks that land on the drawn branch count, not the empty space around it.
    svg.addEventListener('pointerdown', function (e) {
      if (e.target !== svg) ruffle(svg, e);
    });
  });

  function ruffle(svg, e) {
    if (reduceMotion) return;

    // Where was the click, in the branch drawing's own coordinates?
    var point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    var at = point.matrixTransform(svg.getScreenCTM().inverse());

    var leaves = svg.querySelectorAll('.leaf');
    leaves.forEach(function (leaf) {
      var distance = Math.hypot(leaf.getAttribute('data-cx') - at.x, leaf.getAttribute('data-cy') - at.y);
      leaf.style.setProperty('--delay', Math.min(distance * 14, 600) + 'ms');
      leaf.classList.remove('ruffling');
    });

    void svg.getBoundingClientRect(); // lets the browser restart the animation if it was already running
    leaves.forEach(function (leaf) {
      leaf.classList.add('ruffling');
    });
  }
})();
