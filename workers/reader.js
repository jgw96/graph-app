!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports.ImmersiveReader = t())
    : (e.ImmersiveReader = t());
})(window, function () {
  return (function (e) {
    var t = {};
    function r(n) {
      if (t[n]) return t[n].exports;
      var o = (t[n] = { i: n, l: !1, exports: {} });
      return e[n].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
    }
    return (
      (r.m = e),
      (r.c = t),
      (r.d = function (e, t, n) {
        r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
      }),
      (r.r = function (e) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      }),
      (r.t = function (e, t) {
        if ((1 & t && (e = r(e)), 8 & t)) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (
          (r.r(n),
          Object.defineProperty(n, "default", { enumerable: !0, value: e }),
          2 & t && "string" != typeof e)
        )
          for (var o in e)
            r.d(
              n,
              o,
              function (t) {
                return e[t];
              }.bind(null, o)
            );
        return n;
      }),
      (r.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return r.d(t, "a", t), t;
      }),
      (r.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (r.p = ""),
      r((r.s = 1))
    );
  })([
    function (e, t, r) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.CookiePolicy = void 0),
        (function (e) {
          (e[(e.Disable = 0)] = "Disable"), (e[(e.Enable = 1)] = "Enable");
        })(t.CookiePolicy || (t.CookiePolicy = {}));
    },
    function (e, t, r) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.CookiePolicy = t.launchAsync = t.close = t.renderButtons = void 0);
      var n = r(2);
      Object.defineProperty(t, "renderButtons", {
        enumerable: !0,
        get: function () {
          return n.renderButtons;
        },
      });
      var o = r(3);
      Object.defineProperty(t, "close", {
        enumerable: !0,
        get: function () {
          return o.close;
        },
      }),
        Object.defineProperty(t, "launchAsync", {
          enumerable: !0,
          get: function () {
            return o.launchAsync;
          },
        });
      var i = r(0);
      Object.defineProperty(t, "CookiePolicy", {
        enumerable: !0,
        get: function () {
          return i.CookiePolicy;
        },
      }),
        "undefined" != typeof window &&
          window.addEventListener("load", function () {
            var e, t;
            window.hasOwnProperty("Promise") ||
              ((e =
                "https://contentstorage.onenote.office.net/onenoteltir/permanent-static-resources/promise-polyfill.min.js"),
              ((t = document.createElement("script")).src = e),
              document.head.appendChild(t)),
              n.renderButtons();
          });
    },
    function (e, t, r) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.renderButtons = void 0);
      var n = {
        af: "Indompelende leser",
        am: "á‰ áˆ…á‹«á‹ áˆµáˆœá‰µ áˆáŒ£áˆª á‹•á‹­á‰³ áŠ áŠ•á‰£á‰¢",
        ar: "Ø§Ù„Ù‚Ø§Ø±Ø¦ Ø§Ù„Ø´Ø§Ù…Ù„",
        as: "à¦‡à¦®à¦¾à§°à¦šà¦¿à¦­ à§°à¦¿à¦¡à¦¾à§°",
        az: "Ä°mmersiv Oxuyucu",
        be: "Ð†Ð¼ÐµÑ€ÑÑ–ÑžÐ½Ñ‹ Ñ‡Ñ‹Ñ‚Ð°Ð»ÑŒÐ½Ñ–Ðº",
        bg: "ÐšÐ¾Ð½Ñ†ÐµÐ½Ñ‚Ñ€Ð¸Ñ€Ð°Ð½ Ñ‡ÐµÑ‚ÐµÑ†",
        bn: "à¦®à¦¨à§‹à¦—à§à¦°à¦¾à¦¹à§€ à¦ªà¦¾à¦ à¦•",
        "bn-bd": "à¦‡à¦®à¦¾à¦°à§à¦¸à¦¿à¦­ à¦ªà¦¾à¦ à¦•",
        bs: "Koncentrirani Äitalac",
        ca: "Lector immersiu",
        cs: "AsistivnÃ­ ÄteÄka",
        "cy-gb": "Darllenydd Ymdrwythol",
        da: "Forenklet lÃ¦ser",
        de: "Plastischer Reader",
        el: "Î ÏÎ¿Î·Î³Î¼Î­Î½Î¿ Ï€ÏÏŒÎ³ÏÎ±Î¼Î¼Î± Î±Î½Î¬Î³Î½Ï‰ÏƒÎ·Ï‚",
        en: "Immersive Reader",
        es: "Lector inmersivo",
        et: "SÃ¼valuger",
        eu: "Irakurgailu murgiltzailea",
        fa: "Ø®ÙˆØ§Ù†Ù†Ø¯Ù‡ Ù‡Ù…Ù‡â€ŒØ¬Ø§Ù†Ø¨Ù‡",
        fi: "SyventÃ¤vÃ¤ lukuohjelma",
        fil: "Immersive Reader",
        fr: "Lecteur immersif",
        "ga-ie": "LÃ©itheoir tumthach",
        gd: "An leughadair Ã¹r-nÃ²sach",
        gl: "Lector avanzado",
        gu: "àª‡àª®àª°à«àª¸àª¿àªµ àª°à«€àª¡àª°",
        ha: "Mai karatu Mai barbazawa",
        he: "×ª×¦×•×’×ª ×§×¨×™××” ×ž×•×“×¨× ×™×ª",
        hi: "à¤‡à¤®à¤°à¥à¤¸à¤¿à¤µ à¤°à¥€à¤¡à¤°",
        hr: "Stopljeni ÄitaÄ",
        hu: "Modern olvasÃ³",
        hy: "Ô½Õ¸Ö€Õ¡Õ½Õ¸Ö‚Õ¦Õ¾Õ¡Õ® Õ¨Õ¶Õ©Õ¥Ö€ÖÕ«Õ¹",
        id: "Pembaca Imersif",
        ig: "á»Œgá»¥á»¥ Kenzipá»¥tara",
        is: "AÃ°gengilegt lestrarumhverfi",
        it: "Strumento di lettura immersiva",
        ja: "ã‚¤ãƒžãƒ¼ã‚·ãƒ– ãƒªãƒ¼ãƒ€ãƒ¼",
        ka: "áƒ˜áƒ›áƒ”áƒ áƒ¡áƒ˜áƒ£áƒšáƒ˜ áƒ¬áƒáƒ›áƒ™áƒ˜áƒ—áƒ®áƒ•áƒ”áƒšáƒ˜",
        kk: "Ð˜Ð¼Ð¼ÐµÑ€ÑÐ¸Ð²Ñ‚Ñ– Ð¾Ò›Ñƒ Ò›Ò±Ñ€Ð°Ð»Ñ‹",
        km: "áž€áž˜áŸ’áž˜ážœáž·áž’áž¸áž¢áž¶áž“áž–ážŽáŸŒážšáŸ†áž›áŸáž…áž“áŸ…áž›áž¾áž¢áŸáž€áŸ’ážšáž„áŸ‹",
        kn: "à²‡à²®à³à²®à²°à³à²¸à²¿à²µà³ à²“à²¦à³à²—",
        ko: "ëª°ìž…í˜• ë¦¬ë”",
        kok: "à¤¤à¤‚à¤¦à¥à¤°à¥€ à¤²à¤¾à¤—à¤¿à¤²à¥à¤²à¥‹ à¤µà¤¾à¤šà¤•",
        "ku-arab": "Ø®ÙˆÛŽÙ†Û•Ø±ÛŒ Ù¾Ú•",
        ky: "ÐšÑƒÑ€Ñ‡Ð°Ð³Ð°Ð½ ÐžÐºÑƒÐ³ÑƒÑ‡",
        lb: "Immersive Reader",
        lo: "àº•àº»àº§àº­à»ˆàº²àº™àº­àº´àº¡à»€àº¡àºµàºªàºµàºš",
        lt: "Ä®traukianti skaitytuvÄ—",
        lv: "TÄ«rskata lasÄ«tÄjs",
        mi: "PÅ«pÄnui Rumaki",
        mk: "Ð¡ÐµÐ¾Ð¿Ñ„Ð°Ñ‚ÐµÐ½ Ñ‡Ð¸Ñ‚Ð°Ñ‡",
        ml: "à´‡à´®àµà´®àµ‡à´´àµâ€Œà´¸àµ€à´µàµ à´±àµ€à´¡àµ¼",
        mn: "Ð˜Ð´ÑÐ²Ñ…Ñ‚ÑÐ¹ ÑƒÐ½ÑˆÐ¸Ð³Ñ‡",
        mr: "à¤‡à¤®à¤°à¥à¤¸à¤¿à¤µà¥à¤¹ à¤µà¤¾à¤šà¤•",
        ms: "Pembaca Imersif",
        mt: "Qarrej Immersiv",
        ne: "à¤‡à¤®à¥‡à¤°à¥à¤¸à¤¿à¤­ à¤°à¤¿à¤¡à¤°",
        nl: "Insluitende lezer",
        "nn-no": "Engasjerande lesar",
        no: "Engasjerende leser",
        nso: "Go Bala ka Mongwalo o Mokoto",
        or: "à¬‡à¬®à¬°à¬¸à¬¿à¬­à­ à¬°à¬¿à¬¡à¬°à­",
        pa: "à¨‡à¨®à¨°à¨¸à¨¿à¨µ à¨°à©€à¨¡à¨°",
        "pa-arab": "Ú¯Ú¾ÛŒØ±Ù† Ø¢Ù„Ø§ Ù…Ø·Ø§Ù„Ø¹Û Ú©Ø§Ø±",
        pl: "Czytnik immersyjny",
        prs: "Ø®ÙˆØ§Ù†Ù†Ø¯Ù‡ Ù†Ù…Ø§ÛŒØ´",
        pt: "Leitura AvanÃ§ada",
        quc: "Nim ucholajil sik'inel uwach",
        quz: "Wankisqa Ã‘awiq",
        ro: "Immersive Reader",
        ru: "Ð˜Ð¼Ð¼ÐµÑ€ÑÐ¸Ð²Ð½Ð¾Ðµ ÑÑ€ÐµÐ´ÑÑ‚Ð²Ð¾ Ñ‡Ñ‚ÐµÐ½Ð¸Ñ",
        rw: "Insakazasoma",
        sd: "Ø§Ù…Ø±Ø³Ùˆ Ø±ÙŠÚŠØ±",
        si: "à¶œà·’à¶½à·™à¶± à·ƒà·”à·…à·” à¶šà·’à¶ºà·€à¶±à¶º",
        sk: "ImerznÃ¡ ÄÃ­taÄka",
        sl: "Potopni bralnik",
        sq: "Lexuesi kredhÃ«s",
        "sr-cyrl-ba": "ÐšÐ¾Ð½Ñ†ÐµÐ½Ñ‚Ñ€Ð¸ÑÐ°Ð½Ð¸ Ñ‡Ð¸Ñ‚Ð°Ð»Ð°Ñ†",
        "sr-cyrl-rs": "ÐšÐ¾Ð½Ñ†ÐµÐ½Ñ‚Ñ€Ð¸ÑÐ°Ð½Ð¸ Ñ‡Ð¸Ñ‚Ð°Ð»Ð°Ñ†",
        "sr-latn-rs": "Koncentrisani Äitalac",
        sv: "Avancerad lÃ¤sare",
        sw: "Kisomaji cha Kuzamisha",
        ta: "à®…à®±à¯à®ªà¯à®¤à®®à®¾à®© à®°à¯€à®Ÿà®°à¯",
        te: "à°®à°‚à°¤à±à°°à°®à±à°—à±à°§à±à°²à°¨à± à°šà±‡à°¸à±‡ à°ªà° à°¨ à°¸à°¾à°§à°¨à°‚",
        "tg-cyrl-tj": "Ð¥Ð¾Ð½Ð°Ð½Ð´Ð°Ð¸ Ñ„Ð°Ñ€Ð¾Ð³Ð¸Ñ€",
        th: "à¹‚à¸›à¸£à¹à¸à¸£à¸¡à¸Šà¹ˆà¸§à¸¢à¸­à¹ˆà¸²à¸™",
        ti: "áŠ£áŠ•á‰£á‰¢ áˆ•áˆ‰á‹ áˆµáˆá‹’á‰µ áˆáŒ£áˆª",
        tk: "GiÅˆiÅŸleÃ½in okaÃ½jy",
        tn: "Sebadi sa Imesife",
        tr: "Tam Ekran Okuyucu",
        tt: "Ð§Ð¾Ð»Ð³Ð°Ð¿ Ð°Ð»ÑƒÑ‡Ñ‹ ÑƒÐºÑƒ Ñ‡Ð°Ñ€Ð°ÑÑ‹",
        "ug-cn": "Ú†Û†ÙƒÙ…Û• Ø¦ÙˆÙ‚Û‡ØºÛ‡Ú†",
        uk: "Ð—Ð°Ð½ÑƒÑ€ÐµÐ½Ð½Ñ Ð² Ñ‚ÐµÐºÑÑ‚",
        ur: "Ø§Ù…Ø±Ø³ÛŒÙˆ Ù…Ø·Ø§Ù„Ø¹Û Ú©Ø§Ø±",
        uz: "Immersiv mutolaa vositasi",
        vi: "TrÃ¬nh Ä‘á»c ChÃ¢n thá»±c",
        wo: "JÃ ngukaay bu Rafet",
        xh: "Isifundi Esikhulu",
        yo: "ÃŒwÃ² AlÃ¡mÃ¹tÃ¡n",
        zh: "æ²‰æµ¸å¼é˜…è¯»å™¨",
        "zh-hant": "æ²ˆæµ¸å¼é–±è®€ç¨‹å¼",
        zu: "Isifundi Sokuzizwisa",
      };
      function o(e) {
        var t = document.createElement("img");
        t.src =
          "https://contentstorage.onenote.office.net/onenoteltir/permanent-static-resources/immersive-reader-icon.svg";
        var r = e.getAttribute("data-icon-px-size") || "20";
        (t.style.height = t.style.width = r + "px"),
          (t.style.verticalAlign = "middle"),
          (t.style.marginTop = "-2px");
        var n = e.getAttribute("data-locale") || "en";
        (t.alt = s(n)), e.appendChild(t);
      }
      function i(e) {
        var t = document.createElement("span");
        (t.style.marginLeft = "8px"), e.appendChild(t);
      }
      function a(e) {
        var t = document.createElement("span"),
          r = e.getAttribute("data-locale") || "en";
        (t.textContent = s(r)), e.appendChild(t);
      }
      function s(e) {
        return (
          (e = e.toLowerCase()),
          n[e]
            ? n[e]
            : "zh-hk" === e || "zh-mo" === e || "zh-tw" === e
            ? n["zh-hant"]
            : ((e = e.substring(0, e.lastIndexOf("-"))),
              n[e]
                ? n[e]
                : ((e = e.substring(0, e.lastIndexOf("-"))),
                  n[e] ? n[e] : n.en))
        );
      }
      t.renderButtons = function (e) {
        var t = document.createElement("style");
        (t.innerHTML =
          ".immersive-reader-button{cursor:pointer;display:inline-block;padding:5px;} .immersive-reader-button:hover{background:rgba(0,0,0,.05);border-radius:2px"),
          document.head.appendChild(t);
        var r = [].slice.call(
          document.getElementsByClassName("immersive-reader-button")
        );
        e && e.elements && (r = e.elements);
        for (var n = 0, d = r; n < d.length; n++) {
          var u = d[n];
          u.setAttribute("role", "button");
          var l = u.getAttribute("data-locale") || "en";
          switch (
            (u.setAttribute("aria-label", s(l)),
            u.getAttribute("data-button-style") || "icon")
          ) {
            case "icon":
              o(u);
              break;
            case "text":
              a(u);
              break;
            case "iconAndText":
              o(u), i(u), a(u);
          }
        }
      };
    },
    function (e, t, r) {
      "use strict";
      var n =
        (this && this.__assign) ||
        function () {
          return (n =
            Object.assign ||
            function (e) {
              for (var t, r = 1, n = arguments.length; r < n; r++)
                for (var o in (t = arguments[r]))
                  Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
              return e;
            }).apply(this, arguments);
        };
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.isValidSubdomain = t.close = t.launchAsync = void 0);
      var o = r(0),
        i = r(4),
        a = {};
      (a[i.ErrorCode.TokenExpired] = "The access token supplied is expired."),
        (a[i.ErrorCode.Throttled] = "You have exceeded your quota."),
        (a[i.ErrorCode.ServerError] =
          "An error occurred when calling the server to process the text."),
        (a[i.ErrorCode.InvalidSubdomain] =
          "The subdomain supplied is invalid.");
      var s = !1;
      function d(e) {
        if (!e) return !1;
        return new RegExp(
          "^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])$"
        ).test(e);
      }
      (t.launchAsync = function (e, t, r, u) {
        return s
          ? Promise.reject("Immersive Reader is already launching")
          : new Promise(function (l, c) {
              if (e)
                if (r)
                  if (r.chunks)
                    if (r.chunks.length)
                      if (d(t) || (u && u.customDomain)) {
                        s = !0;
                        var m = Date.now();
                        ((u = n(
                          {
                            uiZIndex: 1e3,
                            timeout: 15e3,
                            useWebview: !1,
                            allowFullscreen: !0,
                            hideExitButton: !1,
                            cookiePolicy: o.CookiePolicy.Disable,
                          },
                          u
                        )).uiZIndex &&
                          "number" == typeof u.uiZIndex) ||
                          (u.uiZIndex = 1e3);
                        var f = null,
                          p = document.createElement("div"),
                          v = u.useWebview
                            ? document.createElement("webview")
                            : document.createElement("iframe");
                        v.allow = "autoplay";
                        var h = document.createElement("style");
                        h.innerHTML = "body{height:100%;overflow:hidden;}";
                        var b = function () {
                            f && (window.clearTimeout(f), (f = null));
                          },
                          g = function () {
                            document.body.contains(p) &&
                              document.body.removeChild(p),
                              window.removeEventListener("message", k),
                              b(),
                              h.parentNode && h.parentNode.removeChild(h);
                          },
                          y = function () {
                            if ((g(), u.onExit))
                              try {
                                u.onExit();
                              } catch (e) {}
                          };
                        g();
                        var k = function (n) {
                          if (n && n.data && "string" == typeof n.data)
                            if ("ImmersiveReader-ReadyForContent" === n.data) {
                              b();
                              var o = {
                                cogSvcsAccessToken: e,
                                cogSvcsSubdomain: t,
                                request: r,
                                launchToPostMessageSentDurationInMs:
                                  Date.now() - m,
                                disableFirstRun: u.disableFirstRun,
                                readAloudOptions: u.readAloudOptions,
                                translationOptions: u.translationOptions,
                                displayOptions: u.displayOptions,
                                sendPreferences: !!u.onPreferencesChanged,
                                preferences: u.preferences,
                              };
                              v.contentWindow.postMessage(
                                JSON.stringify({
                                  messageType: "Content",
                                  messageValue: o,
                                }),
                                "*"
                              );
                            } else if ("ImmersiveReader-Exit" === n.data) y();
                            else if (
                              n.data.startsWith(
                                "ImmersiveReader-LaunchResponse:"
                              )
                            ) {
                              var d = null,
                                f = null,
                                h = null;
                              try {
                                h = JSON.parse(
                                  n.data.substring(
                                    "ImmersiveReader-LaunchResponse:".length
                                  )
                                );
                              } catch (e) {}
                              h && h.success
                                ? (d = {
                                    container: p,
                                    sessionId: h.sessionId,
                                    charactersProcessed: h.meteredContentSize,
                                  })
                                : (f =
                                    h && !h.success
                                      ? {
                                          code: h.errorCode,
                                          message: a[h.errorCode],
                                          sessionId: h.sessionId,
                                        }
                                      : {
                                          code: i.ErrorCode.ServerError,
                                          message: a[i.ErrorCode.ServerError],
                                        }),
                                (s = !1),
                                d ? (b(), l(d)) : f && (y(), c(f));
                            } else if (
                              n.data.startsWith(
                                "ImmersiveReader-Preferences:"
                              ) &&
                              u.onPreferencesChanged &&
                              "function" == typeof u.onPreferencesChanged
                            )
                              try {
                                u.onPreferencesChanged(
                                  n.data.substring(
                                    "ImmersiveReader-Preferences:".length
                                  )
                                );
                              } catch (e) {}
                        };
                        window.addEventListener("message", k),
                          (f = window.setTimeout(function () {
                            g(),
                              (s = !1),
                              c({
                                code: i.ErrorCode.Timeout,
                                message:
                                  "Page failed to load after timeout (" +
                                  u.timeout +
                                  " ms)",
                              });
                          }, u.timeout)),
                          u.allowFullscreen &&
                            v.setAttribute("allowfullscreen", ""),
                          (v.style.cssText =
                            "position: static; width: 100vw; height: 100vh; left: 0; top: 0; border-width: 0"),
                          u.useWebview &&
                            v.addEventListener("loadstop", function () {
                              v.contentWindow.postMessage(
                                JSON.stringify({ messageType: "WebviewHost" }),
                                "*"
                              );
                            });
                        var w =
                          (u.customDomain
                            ? u.customDomain
                            : "https://" +
                              t +
                              ".cognitiveservices.azure.com/immersivereader/webapp/v1.0/") +
                          "reader?exitCallback=ImmersiveReader-Exit&sdkPlatform=js&sdkVersion=1.1.0";
                        (w +=
                          "&cookiePolicy=" +
                          (u.cookiePolicy === o.CookiePolicy.Enable
                            ? "enable"
                            : "disable")),
                          u.hideExitButton && (w += "&hideExitButton=true"),
                          u.uiLang && (w += "&omkt=" + u.uiLang),
                          (v.src = w),
                          (p.style.cssText =
                            "position: fixed; width: 100vw; height: 100vh; left: 0; top: 0; border-width: 0; -webkit-perspective: 1px; z-index: " +
                            u.uiZIndex +
                            "; background: white; overflow: hidden"),
                          p.appendChild(v),
                          document.body.appendChild(p),
                          document.head.appendChild(h);
                      } else
                        c({
                          code: i.ErrorCode.InvalidSubdomain,
                          message: a[i.ErrorCode.InvalidSubdomain],
                        });
                    else
                      c({
                        code: i.ErrorCode.BadArgument,
                        message: "Chunks must not be empty",
                      });
                  else
                    c({
                      code: i.ErrorCode.BadArgument,
                      message: "Chunks must not be null",
                    });
                else
                  c({
                    code: i.ErrorCode.BadArgument,
                    message: "Content must not be null",
                  });
              else
                c({
                  code: i.ErrorCode.BadArgument,
                  message: "Token must not be null",
                });
            });
      }),
        (t.close = function () {
          window.postMessage("ImmersiveReader-Exit", "*");
        }),
        (t.isValidSubdomain = d);
    },
    function (e, t, r) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.ErrorCode = void 0),
        (function (e) {
          (e.BadArgument = "BadArgument"),
            (e.Timeout = "Timeout"),
            (e.TokenExpired = "TokenExpired"),
            (e.Throttled = "Throttled"),
            (e.ServerError = "ServerError"),
            (e.InvalidSubdomain = "InvalidSubdomain");
        })(t.ErrorCode || (t.ErrorCode = {}));
    },
  ]);
});
