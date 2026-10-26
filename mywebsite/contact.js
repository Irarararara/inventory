// The "Send a message" form on the scroll, and the "send me your resume" form on the resume page. Messages go to the owner's inbox through Web3Forms, a free service
// that emails each submission. To switch it on: get a free access key at https://web3forms.com (type the inbox
// address, the key arrives by email) and paste it between the quotes below.
(function () {
  var ACCESS_KEY = '7940bab4-07ea-45ec-9ded-5b8688312172';

  var ENDPOINT = 'https://api.web3forms.com/submit';

  function send(fields, button, say, onDone, failText) {
    button.disabled = true;
    fields.access_key = ACCESS_KEY;
    fields.botcheck = '';
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(fields)
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.success) onDone();
        else say(failText, 'bad');
      })
      .catch(function () { say(failText, 'bad'); })
      .then(function () { button.disabled = false; });
  }

  // The message form on the pigeon page
  var form = document.getElementById('msg-form');
  if (form) {
    var status = document.getElementById('msg-status');
    var button = form.querySelector('.msg-send');
    var say = function (text, kind) {
      status.textContent = text;
      status.className = 'msg-status' + (kind ? ' ' + kind : '');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var message = form.elements.message.value.trim();
      var email = form.elements.email.value.trim();

      if (!message) { say('Please write a message first.', 'bad'); form.elements.message.focus(); return; }
      if (!email || !form.elements.email.checkValidity()) { say('Please add an email so I can reply.', 'bad'); form.elements.email.focus(); return; }
      if (form.elements.botcheck.checked) return; // a bot filled the hidden box

      if (!ACCESS_KEY) { say("The pigeon isn't ready to fly yet. Sending isn't switched on.", 'bad'); return; }

      say('The pigeon is on its way...', '');
      send({
        subject: "New message from Ira's Inventory",
        from_name: "Ira's Inventory website",
        email: email,
        message: message
      }, button, say, function () {
        form.reset();
        say('Sent! The pigeon is flying it over. Thank you!', 'good');
      }, 'Hmm, the pigeon got lost. Please try again.');
    });
  }

  // The resume request form: the visitor's email lands in the owner's inbox, and she sends the resume back
  var rform = document.getElementById('resume-form');
  if (rform) {
    var rstatus = document.getElementById('resume-status');
    var rbutton = rform.querySelector('.msg-send');
    var rsay = function (text, kind) {
      rstatus.textContent = text;
      rstatus.className = 'msg-status' + (kind ? ' ' + kind : '');
    };

    rform.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = rform.elements.email.value.trim();

      if (!email || !rform.elements.email.checkValidity()) { rsay('Please add your email so I know where to send it.', 'bad'); rform.elements.email.focus(); return; }
      if (rform.elements.botcheck.checked) return;

      if (!ACCESS_KEY) { rsay("Sending isn't switched on yet. Please check back soon!", 'bad'); return; }

      rsay('Sending your request...', '');
      send({
        subject: "Resume request from Ira's Inventory",
        from_name: "Ira's Inventory website",
        email: email,
        message: 'Please send me your resume: ' + email
      }, rbutton, rsay, function () {
        rform.reset();
        rsay("Got it! I'll email you my resume soon. Thank you!", 'good');
      }, 'Hmm, that did not go through. Please try again.');
    });
  }
})();
