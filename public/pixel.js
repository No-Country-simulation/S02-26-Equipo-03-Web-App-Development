/**
 * Analytics Pixel Client Script
 *
 * Este archivo lo pega el usuario de la plataforma en su sitio web.
 * Es como un "SDK de JavaScript" — similar a Google Analytics gtag.js o
 * el Meta Pixel (fbq).
 *

 *
 * USO:
 * El cliente pega esto en el <head> de su web:
 *
 *   <script>
 *     (function(w,d,s,u,k){
 *       w['_aq']=w['_aq']||[];
 *       w['_ak']=k;
 *       w['_au']=u;
 *       var f=d.getElementsByTagName(s)[0],
 *           j=d.createElement(s);
 *       j.async=true;
 *       j.src=u+'/pixel.js';
 *       f.parentNode.insertBefore(j,f);
 *     })(window,document,'script','https://TU_DOMINIO.com','API_KEY_DEL_PROYECTO');
 *   </script>
 *
 * Después puede trackear eventos:
 *   window._aq.push(['track', 'purchase', { price: 99.99, product: 'T-Shirt' }]);
 */

(function () {
  "use strict";

  // ========== Configuración ==========
  const ENDPOINT = window._au || "";
  const API_KEY = window._ak || "";
  const TRACK_URL = ENDPOINT + "/api/v1/track";
  const QUEUE = window._aq || [];

  // ========== Generadores de IDs ==========

  /**
   * Genera un ID único para el visitante (persiste en localStorage).
   * Equivale a una cookie de sesión, pero sin cookies (GDPR-friendly).
   */
  function getVisitorId() {
    var key = "_a_vid";
    var id = null;
    try {
      id = localStorage.getItem(key);
    } catch (e) {
      // localStorage no disponible (modo privado en Safari, etc.)
    }
    if (!id) {
      id = generateId();
      try {
        localStorage.setItem(key, id);
      } catch (e) {
        // silenciar
      }
    }
    return id;
  }

  /**
   * Genera un ID de sesión (persiste en sessionStorage — muere al cerrar pestaña).
   */
  function getSessionId() {
    var key = "_a_sid";
    var id = null;
    try {
      id = sessionStorage.getItem(key);
    } catch (e) {
      // sessionStorage no disponible
    }
    if (!id) {
      id = generateId();
      try {
        sessionStorage.setItem(key, id);
      } catch (e) {
        // silenciar
      }
    }
    return id;
  }

  /**
   * Genera un ID aleatorio (pseudoUUID sin dependencias).
   */
  function generateId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  // ========== Captura de UTM ==========

  /**
   * Extrae parámetros UTM de la URL actual.
   */
  function getUtmParams() {
    var params = {};
    var search = window.location.search;
    if (!search) return undefined;

    var utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ];
    var urlParams;

    try {
      urlParams = new URLSearchParams(search);
    } catch (e) {
      return undefined;
    }

    var hasUtm = false;
    for (var i = 0; i < utmKeys.length; i++) {
      var val = urlParams.get(utmKeys[i]);
      if (val) {
        // Quitar el prefijo "utm_" → queda "source", "medium", etc.
        params[utmKeys[i].replace("utm_", "")] = val;
        hasUtm = true;
      }
    }

    return hasUtm ? params : undefined;
  }

  // ========== Envío de Eventos ==========

  /**
   * Envía un evento al backend vía POST fetch().
   * Si fetch falla, usa fallback con <img> tag (GET).
   */
  function sendEvent(eventType, data) {
    var payload = {
      eventType: eventType,
      data: data || {},
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      url: window.location.href,
      referrer: document.referrer || undefined,
      timestamp: Date.now(),
      utm: getUtmParams(),
    };

    // Intentar enviar con fetch (POST)
    if (typeof fetch === "function") {
      try {
        fetch(TRACK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
          body: JSON.stringify(payload),
          // keepalive permite que el request se complete aunque el usuario navegue fuera
          keepalive: true,
          // No necesitamos la respuesta
          mode: "cors",
        }).catch(function () {
          // Fetch falló — usar fallback img
          sendViaImage(payload);
        });
      } catch (e) {
        sendViaImage(payload);
      }
    } else {
      // fetch no disponible (IE11) — usar img directamente
      sendViaImage(payload);
    }
  }

  /**
   * Fallback: envía datos codificados en base64 como query param de un <img>.
   * El backend responde un GIF 1x1 transparente.
   */
  function sendViaImage(payload) {
    try {
      var encoded = btoa(JSON.stringify(payload));
      var img = new Image(1, 1);
      img.src =
        TRACK_URL + "?d=" + encodeURIComponent(encoded) + "&k=" + encodeURIComponent(API_KEY);
    } catch (e) {
      // No hay nada más que hacer
    }
  }

  // ========== API Pública ==========

  /**
   * Procesa un comando de la cola.
   *   window._aq.push(['track', 'page_view', { page: '/pricing' }])
   *   window._aq.push(['track', 'purchase', { price: 99 }])
   */
  function processCommand(args) {
    if (!Array.isArray(args) || args.length < 2) return;

    var command = args[0];
    if (command === "track") {
      var eventType = args[1];
      var data = args[2] || {};
      sendEvent(eventType, data);
    }
  }

  // Procesar eventos que se encolaron ANTES de que cargara este script
  for (var i = 0; i < QUEUE.length; i++) {
    processCommand(QUEUE[i]);
  }

  // Remplazar el array por un objeto con push() que procesa en tiempo real
  window._aq = {
    push: function (args) {
      processCommand(args);
    },
  };

  // ========== Auto-track: page_view ==========
  // Automáticamente trackear la primera visita a la página
  sendEvent("page_view", {
    title: document.title,
    path: window.location.pathname,
  });
})();
