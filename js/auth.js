// GCare sign in / create account pop-up (index.html). Front-end only for now.
// Uses a native <dialog> like #alertModal, so Esc, focus trapping and the backdrop come built in.
// Backend hooks are marked TODO.
(function () {
  'use strict';

  var dlg = document.getElementById('authModal');
  if (!dlg || typeof dlg.showModal !== 'function') return; // old browser: header links fall back to signin.html / signup.html

  var title = document.getElementById('authTitle');
  var sub = document.getElementById('authSub');
  var tabs = dlg.querySelector('.auth-tabs');
  var loginForm = document.getElementById('loginForm');
  var signupForm = document.getElementById('signupForm');
  var switchLine = document.getElementById('authSwitch');

  var COPY = {
    login: {
      title: 'Welcome Back',
      sub: 'Sign in to continue to your GCare Account',
      switchHtml: 'Don\u2019t have an account? <a href="#" class="auth-link" data-auth-tab="signup">Create an account</a>'
    },
    signup: {
      title: 'Create your GCare Account',
      sub: 'Join our community for a safer and more prepared tomorrow.',
      switchHtml: 'Already have an account? <a href="#" class="auth-link" data-auth-tab="login">Log in</a>'
    }
  };

  function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function clearErrors() {
    dlg.querySelectorAll('.auth-error').forEach(function (e) {
      e.textContent = '';
      e.classList.remove('is-ok');
    });
    dlg.querySelectorAll('.auth-field').forEach(function (f) { f.classList.remove('is-invalid'); });
  }

  function setTab(name) {
    var isLogin = name === 'login';
    tabs.dataset.active = name;
    tabs.querySelectorAll('button').forEach(function (b) {
      var on = b.dataset.authTab === name;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    loginForm.hidden = !isLogin;
    signupForm.hidden = isLogin;
    title.textContent = COPY[name].title;
    sub.textContent = COPY[name].sub;
    switchLine.innerHTML = COPY[name].switchHtml;
    clearErrors();
  }

  function open(tab) {
    setTab(tab || 'login');
    if (!dlg.open) dlg.showModal();
    var form = tab === 'signup' ? signupForm : loginForm;
    var first = form.querySelector('input');
    if (first) first.focus();
  }

  function close() { if (dlg.open) dlg.close(); }

  // Reset everything when the dialog closes (X, Esc, backdrop or Close)
  dlg.addEventListener('close', function () {
    loginForm.reset();
    signupForm.reset();
    dlg.querySelectorAll('input[data-pass-on]').forEach(function (i) { i.type = 'password'; });
    dlg.querySelectorAll('.auth-eye').forEach(function (b) { b.classList.remove('is-on'); });
    clearErrors();
  });

  // Backdrop click closes (but not when a text selection drag ends outside the card)
  var downOnBackdrop = false;
  dlg.addEventListener('mousedown', function (e) { downOnBackdrop = (e.target === dlg); });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg && downOnBackdrop) close();
  });

  // Header buttons / any element with data-auth-open
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-auth-open]');
    if (opener) {
      e.preventDefault();
      open(opener.dataset.authOpen);
      return;
    }
    if (!dlg.contains(e.target)) return;

    var tabBtn = e.target.closest('[data-auth-tab]');
    if (tabBtn) { e.preventDefault(); setTab(tabBtn.dataset.authTab); return; }

    if (e.target.closest('[data-auth-close]')) { close(); return; }

    var eye = e.target.closest('[data-toggle-pass]');
    if (eye) {
      var input = document.getElementById(eye.dataset.togglePass);
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      if (show) input.setAttribute('data-pass-on', ''); else input.removeAttribute('data-pass-on');
      eye.classList.toggle('is-on', show);
      eye.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    }
  });

  function fail(form, errId, msg, input) {
    var el = document.getElementById(errId);
    el.classList.remove('is-ok');
    el.textContent = msg;
    form.querySelectorAll('.auth-field').forEach(function (f) { f.classList.remove('is-invalid'); });
    if (input) {
      input.closest('.auth-field').classList.add('is-invalid');
      input.focus();
    }
  }

  function succeed(errId, msg) {
    var el = document.getElementById(errId);
    el.classList.add('is-ok');
    el.textContent = msg;
  }

  // ----- Log in -----
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('loginEmail');
    var pass = document.getElementById('loginPass');

    if (!emailOk(email.value.trim())) return fail(loginForm, 'loginError', 'Enter a valid email address.', email);
    if (!pass.value) return fail(loginForm, 'loginError', 'Enter your password.', pass);

    // TODO: replace with the real sign-in call once the auth provider is chosen
    console.log('Log in:', { email: email.value.trim(), remember: document.getElementById('rememberMe').checked });
    succeed('loginError', 'Logged in (demo: no backend yet).');
  });

  // ----- Sign up -----
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('signName');
    var email = document.getElementById('signEmail');
    var pass = document.getElementById('signPass');
    var conf = document.getElementById('signConfirm');
    var terms = document.getElementById('signTerms');
    var id = 'signupError';

    if (name.value.trim().length < 2) return fail(signupForm, id, 'Enter your full name.', name);
    if (!emailOk(email.value.trim())) return fail(signupForm, id, 'Enter a valid email address.', email);
    if (pass.value.length < 8) return fail(signupForm, id, 'Use at least 8 characters for your password.', pass);
    if (pass.value !== conf.value) return fail(signupForm, id, 'Passwords do not match.', conf);
    if (!terms.checked) return fail(signupForm, id, 'Agree to the Terms of Use and Privacy Policy to continue.');

    // TODO: replace with the real sign-up call
    console.log('Sign up:', { name: name.value.trim(), email: email.value.trim() });
    succeed(id, 'Account created (demo: no backend yet).');
  });

  // ----- Google + forgot password (placeholders) -----
  document.getElementById('googleBtn').addEventListener('click', function () {
    // TODO: Google Identity Services / Firebase signInWithPopup
    console.log('Continue with Google clicked');
  });
  document.getElementById('forgotLink').addEventListener('click', function (e) {
    e.preventDefault(); // TODO: forgot-password flow
  });

  // ----- Terms / Privacy pop-up -----
  // The text is read from terms.html / privacy.html (the .legal-article part), so there is
  // only one copy to edit. If the page can't be fetched (e.g. opened as a file://), it opens in a new tab instead.
  var legal = document.getElementById('legalModal');
  var legalTitle = document.getElementById('legalTitle');
  var legalDate = document.getElementById('legalDate');
  var legalBody = document.getElementById('legalBody');
  var legalCache = {};
  var LEGAL_PAGES = { terms: 'terms.html', privacy: 'privacy.html' };

  function renderLegal(d) {
    legalTitle.textContent = d.title;
    legalDate.textContent = d.date;
    legalBody.innerHTML = d.html;
    legalBody.scrollTop = 0;
    if (!legal.open) legal.showModal();
  }

  function showLegal(key) {
    if (legalCache[key]) return renderLegal(legalCache[key]);
    fetch(LEGAL_PAGES[key])
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var art = doc.querySelector('.legal-article');
        if (!art) throw new Error('no content');
        art.querySelectorAll('.legal-next').forEach(function (n) { n.remove(); });
        var h1 = doc.querySelector('.legal-hero h1');
        var date = doc.querySelector('.legal-date');
        legalCache[key] = {
          title: h1 ? h1.textContent : 'GCare',
          date: date ? date.textContent : '',
          html: art.innerHTML
        };
        renderLegal(legalCache[key]);
      })
      .catch(function () { window.open(LEGAL_PAGES[key], '_blank', 'noopener'); });
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-legal]');
    if (trigger) { e.preventDefault(); showLegal(trigger.dataset.legal); return; }

    if (!legal.open || !legal.contains(e.target)) return;
    if (e.target.closest('[data-legal-close]')) { legal.close(); return; }

    // Links inside the text: Terms <-> Privacy swap in place, anything else opens in a new tab
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href === 'terms.html') { e.preventDefault(); showLegal('terms'); }
    else if (href === 'privacy.html') { e.preventDefault(); showLegal('privacy'); }
    else if (href.charAt(0) !== '#') { a.target = '_blank'; a.rel = 'noopener'; }
  });

  var legalDown = false;
  legal.addEventListener('mousedown', function (e) { legalDown = (e.target === legal); });
  legal.addEventListener('click', function (e) { if (e.target === legal && legalDown) legal.close(); });

  // Optional deep links: index.html#signin / index.html#signup
  if (location.hash === '#signup') open('signup');
  else if (location.hash === '#signin' || location.hash === '#login') open('login');
})();