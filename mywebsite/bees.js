// Little bees: pressing a flower sends a few of them buzzing up and away, and they disappear.
(function () {
  var BEE = "<svg class=\"bee\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 13 11\" shape-rendering=\"crispEdges\"><g class=\"f1\"><path fill=\"#33283a\" d=\"M3 1h1v1h-1zM4 0h1v1h-1zM6 1h1v1h-1zM5 0h1v1h-1zM2 2h1v1h-1zM3 3h1v1h-1zM7 2h1v1h-1zM7 3h1v1h-1zM2 4h1v1h-1zM8 4h1v1h-1zM2 6h1v1h-1zM8 6h1v1h-1zM3 7h1v1h-1zM4 7h1v1h-1zM5 7h1v1h-1zM6 7h1v1h-1zM7 7h1v1h-1zM9 6h1v1h-1zM9 4h1v1h-1zM11 5h1v1h-1zM10 6h1v1h-1zM10 4h1v1h-1zM0 5h1v1h-1zM1 6h1v1h-1zM1 4h1v1h-1z\"/><path fill=\"#eaf7ff\" d=\"M4 1h1v1h-1zM5 1h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM4 3h1v1h-1zM5 3h1v1h-1zM6 3h1v1h-1z\"/><path fill=\"#f6c542\" d=\"M3 4h1v1h-1zM5 4h1v1h-1zM7 4h1v1h-1zM2 5h1v1h-1zM3 5h1v1h-1zM5 5h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM3 6h1v1h-1zM5 6h1v1h-1zM7 6h1v1h-1z\"/><path fill=\"#3b2c2c\" d=\"M4 4h1v1h-1zM6 4h1v1h-1zM4 5h1v1h-1zM6 5h1v1h-1zM4 6h1v1h-1zM6 6h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM1 5h1v1h-1z\"/></g><g class=\"f2\"><path fill=\"#33283a\" d=\"M3 7h1v1h-1zM6 7h1v1h-1zM2 8h1v1h-1zM3 9h1v1h-1zM7 8h1v1h-1zM4 10h1v1h-1zM5 10h1v1h-1zM7 9h1v1h-1zM6 10h1v1h-1zM2 4h1v1h-1zM3 3h1v1h-1zM4 3h1v1h-1zM5 3h1v1h-1zM6 3h1v1h-1zM8 4h1v1h-1zM7 3h1v1h-1zM2 6h1v1h-1zM8 6h1v1h-1zM7 7h1v1h-1zM9 6h1v1h-1zM9 4h1v1h-1zM11 5h1v1h-1zM10 6h1v1h-1zM10 4h1v1h-1zM0 5h1v1h-1zM1 6h1v1h-1zM1 4h1v1h-1z\"/><path fill=\"#eaf7ff\" d=\"M4 7h1v1h-1zM5 7h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM4 9h1v1h-1zM5 9h1v1h-1zM6 9h1v1h-1z\"/><path fill=\"#f6c542\" d=\"M3 4h1v1h-1zM5 4h1v1h-1zM7 4h1v1h-1zM2 5h1v1h-1zM3 5h1v1h-1zM5 5h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM3 6h1v1h-1zM5 6h1v1h-1zM7 6h1v1h-1z\"/><path fill=\"#3b2c2c\" d=\"M4 4h1v1h-1zM6 4h1v1h-1zM4 5h1v1h-1zM6 5h1v1h-1zM4 6h1v1h-1zM6 6h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM1 5h1v1h-1z\"/></g></svg>";
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var picnic = document.querySelector('.picnic');
  var flying = 0;
  var MAX_BEES = 14;

  function pixelSize() {
    // one drawn pixel on screen, so the bees match the rest of the pixel art
    return picnic ? Math.max(2, picnic.getBoundingClientRect().width / 310) : 4;
  }

  function release(flower) {
    var box = flower.getBoundingClientRect();
    var x = box.left + box.width / 2;
    var y = box.top + box.height / 2;
    var count = 2 + Math.floor(Math.random() * 2); // two or three bees
    for (var i = 0; i < count && flying < MAX_BEES; i++) launch(x, y, i);
  }

  function launch(x, y, index) {
    var p = pixelSize();
    var holder = document.createElement('div');
    holder.className = 'bee-flight';
    holder.setAttribute('aria-hidden', 'true');
    holder.innerHTML = BEE;
    var bee = holder.firstElementChild;
    bee.style.width = 13 * p + 'px';
    bee.style.height = 'auto';

    var dir = Math.random() < 0.5 ? -1 : 1;
    if (dir < 0) bee.style.transform = 'scaleX(-1)'; // the bee faces the way it flies
    var dx = dir * (140 + Math.random() * 260);
    var dy = -(150 + Math.random() * 230);
    var wobble = 10 + Math.random() * 14;
    var duration = 1900 + Math.random() * 1200;

    holder.style.left = x - 6.5 * p + 'px';
    holder.style.top = y - 5.5 * p + 'px';
    document.body.appendChild(holder);
    flying++;

    var frames;
    if (reduceMotion) {
      frames = [{ opacity: 1 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }];
      duration = 900;
    } else {
      frames = [
        { transform: 'translate(0px, 0px) scale(1)', opacity: 1, offset: 0 },
        { transform: 'translate(' + dx * 0.15 + 'px,' + (dy * 0.2 - wobble) + 'px) scale(1)', opacity: 1, offset: 0.15 },
        { transform: 'translate(' + dx * 0.4 + 'px,' + (dy * 0.4 + wobble) + 'px) scale(0.95)', opacity: 1, offset: 0.4 },
        { transform: 'translate(' + dx * 0.65 + 'px,' + (dy * 0.65 - wobble) + 'px) scale(0.8)', opacity: 0.9, offset: 0.65 },
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(0.5)', opacity: 0, offset: 1 }
      ];
    }
    var run = holder.animate(frames, { duration: duration, delay: index * 120, easing: 'ease-in', fill: 'both' });
    run.onfinish = function () {
      holder.remove();
      flying--;
    };
  }

  document.addEventListener('click', function (e) {
    var flower = e.target.closest && e.target.closest('.flower');
    if (flower) release(flower);
  });
})();
