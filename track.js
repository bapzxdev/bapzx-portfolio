(function () {
  var API = "https://bapzx-bot-tibia.onrender.com/api/track";
  var LAST_KEY = "bapzx_last_send";
  var THROTTLE_MS = 3000;

  function pageName() {
    var path = window.location.pathname.split("/").pop();
    return path || "index.html";
  }

  function record() {
    try { localStorage.setItem(LAST_KEY, String(Date.now())); } catch (e) {}
  }

  function send() {
    try {
      if (typeof navigator.sendBeacon !== "function") {
        return;
      }
      var last = 0;
      try { last = Number(localStorage.getItem(LAST_KEY) || 0); } catch (e) {}
      if (Date.now() - last < THROTTLE_MS) {
        return;
      }
      record();
      var payload = new Blob(
        [JSON.stringify({
          pagina: pageName(),
          referer: document.referrer,
          altura: String(window.innerHeight)
        })],
        { type: "application/json" }
      );
      navigator.sendBeacon(API, payload);
    } catch (e) {}
  }

  function boot() {
    if (document.visibilityState === "prerender") {
      document.addEventListener("visibilitychange", function handler() {
        document.removeEventListener("visibilitychange", handler);
        send();
      });
      return;
    }
    window.setTimeout(send, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();