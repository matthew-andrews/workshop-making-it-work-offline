(function() {
  "use strict";

  var checkTimer = null, ac = window.applicationCache, status = null, hasChecked = false, loopMax = 60;

  function checkNow() {
    if (ac.status === ac.CHECKING || ac.status === ac.DOWNLOADING || ac.status === ac.UPDATEREADY) {
      hasChecked = true;
    }
    if (ac.status !== status) {
      status = ac.status;
      trigger(status, hasChecked);
    }
    if (loopMax--) {
      checkIn(1000);
    } else {
      trigger(-1, hasChecked);
    }
  }

  function checkIn(ms) {
    if (checkTimer) clearTimeout(checkTimer);
    checkTimer = setTimeout(checkNow, ms);
  }
  function trigger(evt, hasChecked) {
    if (parent && parent.window) {
      parent.window.postMessage({
        type: 'appcache:event',
        args: [evt, hasChecked]
      }, '*');
    }
  }

  ac.addEventListener('updateready', checkNow);
  ac.addEventListener('cached', checkNow);
  ac.addEventListener('checking', checkNow);
  ac.addEventListener('downloading', checkNow);
  ac.addEventListener('error', checkNow);
  ac.addEventListener('noupdate', checkNow);
  ac.addEventListener('obsolete', checkNow);
  ac.addEventListener('progress', checkNow);

  checkIn(250);
}());
