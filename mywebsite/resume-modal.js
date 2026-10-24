// The resume box: clicking the backpack opens it over the page; the form inside is handled by contact.js.
(function () {
  var bag = document.querySelector('.mat-item.bag');
  var modal = document.getElementById('resume-modal');
  if (!bag || !modal) return;
  var closeBtn = modal.querySelector('.modal-close');
  var email = document.getElementById('resume-email');

  function open() {
    modal.hidden = false;
    document.documentElement.classList.add('modal-open');
    email.focus();
  }

  function close() {
    modal.hidden = true;
    document.documentElement.classList.remove('modal-open');
    bag.focus({ preventScroll: true });
  }

  // on a touch screen the first tap only shows the note (tips.js stops it); the second one opens the box
  bag.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    e.preventDefault();
    open();
  });

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
})();
