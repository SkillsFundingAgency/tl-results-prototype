function parseCookie(e) {
    var t = JSON.parse(e);
    return "object" != typeof t && (t = JSON.parse(t)), t;
}
!(function (e) {
    var u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        l = function (e) {
            e = e.replace(/\x0d\x0a/g, "\n");
            for (var t = "", n = 0; n < e.length; n++) {
                var i = e.charCodeAt(n);
                i < 128
                    ? (t += String.fromCharCode(i))
                    : (127 < i && i < 2048 ? (t += String.fromCharCode((i >> 6) | 192)) : ((t += String.fromCharCode((i >> 12) | 224)), (t += String.fromCharCode(((i >> 6) & 63) | 128))), (t += String.fromCharCode((63 & i) | 128)));
            }
            return t;
        },
        d = function (e) {
            for (var t = "", n = 0, i = (c1 = c2 = 0); n < e.length; )
                (i = e.charCodeAt(n)) < 128
                    ? ((t += String.fromCharCode(i)), n++)
                    : 191 < i && i < 224
                    ? ((c2 = e.charCodeAt(n + 1)), (t += String.fromCharCode(((31 & i) << 6) | (63 & c2))), (n += 2))
                    : ((c2 = e.charCodeAt(n + 1)), (c3 = e.charCodeAt(n + 2)), (t += String.fromCharCode(((15 & i) << 12) | ((63 & c2) << 6) | (63 & c3))), (n += 3));
            return t;
        };
    e.extend({
        base64Encode: function (e) {
            var t,
                n,
                i,
                a,
                o,
                r,
                s,
                c = "",
                d = 0;
            for (e = l(e); d < e.length; )
                (a = (t = e.charCodeAt(d++)) >> 2),
                    (o = ((3 & t) << 4) | ((n = e.charCodeAt(d++)) >> 4)),
                    (r = ((15 & n) << 2) | ((i = e.charCodeAt(d++)) >> 6)),
                    (s = 63 & i),
                    isNaN(n) ? (r = s = 64) : isNaN(i) && (s = 64),
                    (c = c + u.charAt(a) + u.charAt(o) + u.charAt(r) + u.charAt(s));
            return c;
        },
        base64Decode: function (e) {
            var t,
                n,
                i,
                a,
                o,
                r,
                s = "",
                c = 0;
            for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); c < e.length; )
                (t = (u.indexOf(e.charAt(c++)) << 2) | ((a = u.indexOf(e.charAt(c++))) >> 4)),
                    (n = ((15 & a) << 4) | ((o = u.indexOf(e.charAt(c++))) >> 2)),
                    (i = ((3 & o) << 6) | (r = u.indexOf(e.charAt(c++)))),
                    (s += String.fromCharCode(t)),
                    64 != o && (s += String.fromCharCode(n)),
                    64 != r && (s += String.fromCharCode(i));
            return (s = d(s));
        },
    });
})(jQuery),
    Function.prototype.bind ||
        (Function.prototype.bind = function (e) {
            if ("function" != typeof this) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            var t = Array.prototype.slice.call(arguments, 1),
                n = this,
                i = function () {},
                a = function () {
                    return n.apply(this instanceof i && e ? this : e, t.concat(Array.prototype.slice.call(arguments)));
                };
            return (i.prototype = this.prototype), (a.prototype = new i()), a;
        }),
    (function () {
        "use strict";
        window.GOVUK = window.GOVUK || {};
        var a = { essential: !0, settings: !1, usage: !1, campaigns: !1 },
            o = {
                cookies_policy: "essential",
                seen_cookie_message: "essential",
                cookie_preferences_set: "essential",
                cookies_preferences_set: "essential",
                "_email-alert-frontend_session": "essential",
                licensing_session: "essential",
                govuk_contact_referrer: "essential",
                multivariatetest_cohort_coronavirus_extremely_vulnerable_rate_limit: "essential",
                dgu_beta_banner_dismissed: "settings",
                global_bar_seen: "settings",
                govuk_browser_upgrade_dismisssed: "settings",
                govuk_not_first_visit: "settings",
                analytics_next_page_call: "usage",
                _ga: "usage",
                _gid: "usage",
                _gat: "usage",
                "JS-Detection": "usage",
                TLSversion: "usage",
            };
        (window.GOVUK.cookie = function (e, t, n) {
            return void 0 !== t ? (!1 === t || null === t ? window.GOVUK.setCookie(e, "", { days: -1 }) : (void 0 === n && (n = { days: 30 }), window.GOVUK.setCookie(e, t, n))) : window.GOVUK.getCookie(e);
        }),
            (window.GOVUK.setDefaultConsentCookie = function () {
                window.GOVUK.setConsentCookie(a);
            }),
            (window.GOVUK.approveAllCookieTypes = function () {
                var e = { essential: !0, settings: !0, usage: !0, campaigns: !0 };
                window.GOVUK.setCookie("cookies_policy", JSON.stringify(e), { days: 365 });
            }),
            (window.GOVUK.getConsentCookie = function () {
                var e,
                    t = window.GOVUK.cookie("cookies_policy");
                if (!t) return null;
                try {
                    e = JSON.parse(t);
                } catch (n) {
                    return null;
                }
                return "object" != typeof e && null !== e && (e = JSON.parse(e)), e;
            }),
            (window.GOVUK.setConsentCookie = function (e) {
                var t = window.GOVUK.getConsentCookie();
                for (var n in (t || (t = JSON.parse(JSON.stringify(a))), e)) if (((t[n] = e[n]), !e[n])) for (var i in o) o[i] === n && window.GOVUK.deleteCookie(i);
                window.GOVUK.setCookie("cookies_policy", JSON.stringify(t), { days: 365 });
            }),
            (window.GOVUK.checkConsentCookieCategory = function (e, t) {
                var n = window.GOVUK.getConsentCookie();
                if (!n && o[e]) return !0;
                n = window.GOVUK.getConsentCookie();
                try {
                    return n[t];
                } catch (i) {
                    return console.error(i), !1;
                }
            }),
            (window.GOVUK.checkConsentCookie = function (e, t) {
                if ("cookies_policy" === e || null === t || !1 === t) return !0;
                if (e.match("^govuk_surveySeen") || e.match("^govuk_taken")) return window.GOVUK.checkConsentCookieCategory(e, "settings");
                if (o[e]) {
                    var n = o[e];
                    return window.GOVUK.checkConsentCookieCategory(e, n);
                }
                return !1;
            }),
            (window.GOVUK.setCookie = function (e, t, n) {
                if (window.GOVUK.checkConsentCookie(e, t)) {
                    void 0 === n && (n = {});
                    var i = e + "=" + t + "; path=/";
                    if (n.days) {
                        var a = new Date();
                        a.setTime(a.getTime() + 24 * n.days * 60 * 60 * 1e3), (i = i + "; expires=" + a.toGMTString());
                    }
                    "https:" === document.location.protocol && (i += "; Secure"), (document.cookie = i);
                }
            }),
            (window.GOVUK.getCookie = function (e) {
                for (var t = e + "=", n = document.cookie.split(";"), i = 0, a = n.length; i < a; i++) {
                    for (var o = n[i]; " " === o.charAt(0); ) o = o.substring(1, o.length);
                    if (0 === o.indexOf(t)) return decodeURIComponent(o.substring(t.length));
                }
                return null;
            }),
            (window.GOVUK.getCookieCategory = function (e) {
                return o[e];
            }),
            (window.GOVUK.deleteCookie = function (e) {
                window.GOVUK.cookie(e, null), window.GOVUK.cookie(e) && ((document.cookie = e + "=;expires=" + new Date() + ";"), (document.cookie = e + "=;expires=" + new Date() + ";domain=" + window.location.hostname + ";path=/"));
            }),
            (window.GOVUK.deleteUnconsentedCookies = function () {
                var e = window.GOVUK.getConsentCookie();
                for (var t in e) if (!e[t]) for (var n in o) o[n] === t && window.GOVUK.deleteCookie(n);
            });
    })(window),
    (function (e) {
        "use strict";
        function t() {
            return 0 < $('meta[name="govuk:static-analytics:strip-dates"]').length;
        }
        function n() {
            return 0 < $('meta[name="govuk:static-analytics:strip-postcodes"]').length;
        }
        var i = e.GOVUK || {},
            a = /[^\s=/?&]+(?:@|%40)[^\s=/?&]+/g,
            o = /[A-PR-UWYZ][A-HJ-Z]?[0-9][0-9A-HJKMNPR-Y]?(?:[\s+]|%20)*[0-9][ABD-HJLNPQ-Z]{2}/gi,
            r = /\d{4}(-?)\d{2}(-?)\d{2}/g,
            s = function () {
                (this.stripDatePII = t()), (this.stripPostcodePII = n());
            };
        (s.prototype.stripPII = function (e) {
            return "string" == typeof e
                ? this.stripPIIFromString(e)
                : "[object Array]" === Object.prototype.toString.call(e) || "[object Arguments]" === Object.prototype.toString.call(e)
                ? this.stripPIIFromArray(e)
                : "object" == typeof e
                ? this.stripPIIFromObject(e)
                : e;
        }),
            (s.prototype.stripPIIFromString = function (e) {
                var t = e.replace(a, "[email]");
                return !0 === this.stripDatePII && (t = t.replace(r, "[date]")), !0 === this.stripPostcodePII && (t = t.replace(o, "[postcode]")), t;
            }),
            (s.prototype.stripPIIFromObject = function (e) {
                if (e) {
                    if (e instanceof i.Analytics.PIISafe) return e.value;
                    for (var t in e) {
                        var n = e[t];
                        e[t] = this.stripPII(n);
                    }
                    return e;
                }
            }),
            (s.prototype.stripPIIFromArray = function (e) {
                for (var t = 0, n = e.length; t < n; t++) {
                    var i = e[t];
                    e[t] = this.stripPII(i);
                }
                return e;
            }),
            (i.pii = s),
            (e.GOVUK = i);
    })(window),
    (function (s) {
        "use strict";
        function c() {
            "function" == typeof s.ga && s.ga.apply(s, arguments);
        }
        var d,
            r = s.jQuery,
            u = s.GOVUK || {},
            e = function (e, t) {
                function n() {
                    c("create", e, t);
                }
                function i() {
                    c("set", "anonymizeIp", !0);
                }
                function a() {
                    c("set", "allowAdFeatures", !1);
                }
                function o() {
                    c("set", "title", d.stripPII(document.title));
                }
                function r() {
                    c("set", "location", d.stripPII(window.location.href));
                }
                (d = new u.pii()), "string" == typeof t && (t = { cookieDomain: t }), n(), i(), a(), o(), r();
            };
        (e.load = function () {
            var e, t, n, i, a, o, r;
            (e = s),
                (t = document),
                (n = "script"),
                (i = "https://www.google-analytics.com/analytics.js"),
                (a = "ga"),
                (e.GoogleAnalyticsObject = a),
                (e[a] =
                    e[a] ||
                    function () {
                        (e[a].q = e[a].q || []).push(arguments);
                    }),
                (e[a].l = 1 * new Date()),
                (o = t.createElement(n)),
                (r = t.getElementsByTagName(n)[0]),
                (o.async = 1),
                (o.src = i),
                r.parentNode.insertBefore(o, r);
        }),
            (e.prototype.trackPageview = function (e, t, n) {
                var i,
                    a = "";
                "string" == typeof e && (i = { page: e }),
                    "string" == typeof t && ((i = i || {}).title = t),
                    "object" == typeof n && ((i = r.extend(i || {}, n)), "string" == typeof n.trackerName && ((a = n.trackerName + "."), delete n.trackerName)),
                    r.isEmptyObject(i) ? c(a + "send", "pageview") : c(a + "send", "pageview", i);
            }),
            (e.prototype.trackEvent = function (e, t, n) {
                var i,
                    a = "",
                    o = { hitType: "event", eventCategory: e, eventAction: t };
                "string" == typeof (n = n || {}).label && ((o.eventLabel = n.label), delete n.label),
                    (n.value || 0 === n.value) && ("number" != typeof (i = parseInt(n.value, 10)) || isNaN(i) || (n.eventValue = i), delete n.value),
                    "string" == typeof n.trackerName && ((a = n.trackerName + "."), delete n.trackerName),
                    n.nonInteraction && (n.nonInteraction = 1),
                    "object" == typeof n && r.extend(o, n),
                    c(a + "send", o);
            }),
            (e.prototype.trackSocial = function (e, t, n, i) {
                var a = { hitType: "social", socialNetwork: e, socialAction: t, socialTarget: n };
                r.extend(a, i), c("send", a);
            }),
            (e.prototype.addLinkedTrackerDomain = function (e, t, n, i) {
                c("create", e, "auto", { name: t }),
                    c(t + ".require", "linker"),
                    c(t + ".linker:autoLink", n),
                    c(t + ".set", "anonymizeIp", !0),
                    c(t + ".set", "allowAdFeatures", !1),
                    c(t + ".set", "title", d.stripPII(document.title)),
                    c(t + ".set", "location", d.stripPII(window.location.href)),
                    (void 0 !== i && !0 !== i) || c(t + ".send", "pageview");
            }),
            (e.prototype.setDimension = function (e, t) {
                c("set", "dimension" + e, String(t));
            }),
            (u.GoogleAnalyticsUniversalTracker = e),
            (s.GOVUK = u);
    })(window),
    (function (n) {
        "use strict";
        var i = n.GOVUK || {},
            e = function (e) {
                if (((this.pii = new i.pii()), (this.trackers = []), "undefined" != typeof e.universalId)) {
                    var t = e.universalId;
                    delete e.universalId, this.trackers.push(new i.GoogleAnalyticsUniversalTracker(t, e));
                }
            },
            t = function (e) {
                this.value = e;
            };
        (e.PIISafe = t),
            (e.prototype.sendToTrackers = function (e, t) {
                for (var n = 0, i = this.trackers.length; n < i; n++) {
                    var a = this.trackers[n],
                        o = a[e];
                    "function" == typeof o && o.apply(a, t);
                }
            }),
            (e.load = function () {
                i.GoogleAnalyticsUniversalTracker.load();
            }),
            (e.prototype.defaultPathForTrackPageview = function (e) {
                return this.pii.stripPIIFromString(e.href.substring(e.origin.length).split("#")[0]);
            }),
            (e.prototype.trackPageview = function () {
                (arguments[0] = arguments[0] || this.defaultPathForTrackPageview(window.location)), 0 === arguments.length && (arguments.length = 1), this.sendToTrackers("trackPageview", this.pii.stripPII(arguments));
            }),
            (e.prototype.trackEvent = function () {
                this.sendToTrackers("trackEvent", this.pii.stripPII(arguments));
            }),
            (e.prototype.trackShare = function (e, t) {
                this.sendToTrackers("trackSocial", this.pii.stripPII([e, "share", n.location.pathname, t]));
            }),
            (e.prototype.setDimension = function () {
                this.sendToTrackers("setDimension", this.pii.stripPII(arguments));
            }),
            (e.prototype.addLinkedTrackerDomain = function () {
                this.sendToTrackers("addLinkedTrackerDomain", arguments);
            }),
            (i.Analytics = e),
            (n.GOVUK = i);
    })(window),
    (function (i) {
        "use strict";
        var a = i.GOVUK || {};
        (a.analyticsPlugins = a.analyticsPlugins || {}),
            (a.analyticsPlugins.printIntent = function () {
                var t = function () {
                    a.analytics.trackEvent("Print Intent", document.location.pathname), a.analytics.trackPageview("/print" + document.location.pathname);
                };
                if (i.matchMedia) {
                    var e = i.matchMedia("print"),
                        n = 0;
                    e.addListener(function (e) {
                        e.matches ||
                            0 !== n ||
                            (t(),
                            n++,
                            setTimeout(function () {
                                n = 0;
                            }, 3e3));
                    });
                }
                i.onafterprint && (i.onafterprint = t);
            }),
            (i.GOVUK = a);
    })(window),
    (function (a) {
        "use strict";
        var o = a.GOVUK || {};
        (o.analyticsPlugins = o.analyticsPlugins || {}),
            (o.analyticsPlugins.error = function (e) {
                function i(e) {
                    return !e || !t || !!t.test(e);
                }
                var t = (e = e || {}).filenameMustMatch,
                    n = function (e) {
                        var t = e.filename,
                            n = t + ": " + e.lineno;
                        i(t) && o.analytics.trackEvent("JavaScript Error", e.message, { label: n, value: 1, nonInteraction: !0 });
                    };
                a.addEventListener ? a.addEventListener("error", n, !1) : a.attachEvent ? a.attachEvent("onerror", n) : (a.onerror = n);
            }),
            (a.GOVUK = o);
    })(window),
    (function (e) {
        "use strict";
        var r = e.jQuery,
            s = e.GOVUK || {};
        (s.analyticsPlugins = s.analyticsPlugins || {}),
            (s.analyticsPlugins.mailtoLinkTracker = function () {
                function e(e) {
                    var t = o(e),
                        n = { transport: "beacon" },
                        i = t.attr("href"),
                        a = r.trim(t.text());
                    a && (n.label = a), s.analytics.trackEvent("Mailto Link Clicked", i, n);
                }
                function o(e) {
                    var t = r(e.target);
                    return t.is("a") || (t = t.parents("a")), t;
                }
                var t = 'a[href^="mailto:"]';
                r("body").on("click", t, e);
            }),
            (e.GOVUK = s);
    })(window),
    (function (e) {
        "use strict";
        var c = e.jQuery,
            d = e.GOVUK || {};
        (d.analyticsPlugins = d.analyticsPlugins || {}),
            (d.analyticsPlugins.externalLinkTracker = function (e) {
                function t(e) {
                    var t = r(e),
                        n = { transport: "beacon" },
                        i = t.attr("href"),
                        a = c.trim(t.text());
                    if ((a && (n.label = a), s !== undefined)) {
                        var o = i;
                        d.analytics.setDimension(s, o);
                    }
                    d.analytics.trackEvent("External Link Clicked", i, n);
                }
                function r(e) {
                    var t = c(e.target);
                    return t.is("a") || (t = t.parents("a")), t;
                }
                var s = (e = e || {}).externalLinkUploadCustomDimension,
                    n = 'a[href^="http"]:not(a[href*="' + d.analyticsPlugins.externalLinkTracker.getHostname() + '"])';
                c("body").on("click", n, t);
            }),
            (d.analyticsPlugins.externalLinkTracker.getHostname = function () {
                return e.location.hostname;
            }),
            (e.GOVUK = d);
    })(window),
    (function (e) {
        "use strict";
        var r = e.jQuery,
            s = e.GOVUK || {};
        (s.analyticsPlugins = s.analyticsPlugins || {}),
            (s.analyticsPlugins.downloadLinkTracker = function (e) {
                function t(e) {
                    var t = o(e),
                        n = t.attr("href"),
                        i = { transport: "beacon" },
                        a = r.trim(t.text());
                    a && (i.label = a), s.analytics.trackEvent("Download Link Clicked", n, i);
                }
                function o(e) {
                    var t = r(e.target);
                    return t.is("a") || (t = t.parents("a")), t;
                }
                var n = (e = e || {}).selector;
                n && r("body").on("click", n, t);
            }),
            (e.GOVUK = s);
    })(window),
    (function () {
        "use strict";
        function e() {
            return $('meta[name="govuk:rendering-application"]').attr("content");
        }
        function t() {
            return $('meta[name="govuk:format"]').attr("content");
        }
        function n() {
            return $('meta[name="govuk:navigation-page-type"]').attr("content");
        }
        function i() {
            return "collections" == e() && "taxon" == t() && "grid" == n();
        }
        function a() {
            return "collections" == e() && "taxon" == t() && "accordion" == n();
        }
        function o() {
            return "collections" == e() && "taxon" == t() && "leaf" == n();
        }
        function r() {
            return "collections" == e() && "mainstream_browse_page" == t();
        }
        function s() {
            return "collections" == e() && "topic" == t();
        }
        function c() {
            return "whitehall" == e() && "placeholder_policy_area" == t();
        }
        function d() {
            return "government-frontend" == e() && "document_collection" == t();
        }
        function u() {
            return "finder-frontend" == e() && "finder" == t();
        }
        function l() {
            return "whitehall" == e() && "finder" == t();
        }
        window.GOVUK = window.GOVUK || {};
        var g = function () {};
        (g.getNumberOfSections = function () {
            switch (!0) {
                case i():
                    return 1 + $(".parent-topic-contents").length;
                case a():
                    return $('[data-track-count="accordionSection"]').length;
                case d():
                    return $(".document-collection .group-title").length;
                case r():
                    return $("#subsection ul:visible").length || $("#section ul").length;
                case s():
                    return $(".topics-page nav.index-list").length;
                case c():
                    return $(".topic section h1.label").length;
                case u():
                case l():
                case o():
                    return 1;
                default:
                    var e = $('[data-track-count="sidebarRelatedItemSection"]').length,
                        t = $('[data-track-count="sidebarTaxonSection"]').length;
                    return e || t;
            }
        }),
            (g.getNumberOfLinks = function () {
                switch (!0) {
                    case i():
                        return $('a[data-track-category="navGridLinkClicked"]').length + $('a[data-track-category="navGridLeafLinkClicked"]').length;
                    case a():
                        return $('a[data-track-category="navAccordionLinkClicked"]').length;
                    case o():
                        return $('a[data-track-category="navLeafLinkClicked"]').length;
                    case d():
                        return $(".document-collection .group-document-list li a").length;
                    case r():
                        return $("#subsection ul a:visible").length || $("#section ul a").length;
                    case s():
                        return $(".topics-page .index-list ul a").length || $(".topics-page .topics ul a").length;
                    case c():
                        return $("section.document-block a").length + $("section .collection-list h2 a").length;
                    case l():
                        return $(".document-list .document-row h3 a").length;
                    case u():
                        return $(".finder-frontend-content li.document a").length;
                    default:
                        return $('a[data-track-category="relatedLinkClicked"]').length;
                }
            }),
            (GOVUK.PageContent = g);
    })(),
    (function () {
        "use strict";
        function e() {
            var e = { dimension15: window.httpStatusCode || 200, dimension16: GOVUK.cookie("TLSversion") || "unknown", dimension95: GOVUK.analytics.gaClientId };
            return window.devicePixelRatio && (e.dimension11 = window.devicePixelRatio), e;
        }
        function t() {
            var n = {
                    section: { dimension: 1 },
                    format: { dimension: 2 },
                    themes: { dimension: 3, defaultValue: "other" },
                    "content-id": { dimension: 4, defaultValue: "00000000-0000-0000-0000-000000000000" },
                    "search-result-count": { dimension: 5 },
                    "publishing-government": { dimension: 6 },
                    "political-status": { dimension: 7 },
                    "analytics:organisations": { dimension: 9 },
                    "analytics:world-locations": { dimension: 10 },
                    withdrawn: { dimension: 12, defaultValue: "not withdrawn" },
                    "schema-name": { dimension: 17 },
                    "rendering-application": { dimension: 20 },
                    "search-autocomplete-status": { dimension: 21 },
                    "navigation-legacy": { dimension: 30, defaultValue: "none" },
                    "navigation-page-type": { dimension: 32, defaultValue: "none" },
                    "taxon-slug": { dimension: 56, defaultValue: "other" },
                    "taxon-id": { dimension: 57, defaultValue: "other" },
                    "taxon-slugs": { dimension: 58, defaultValue: "other" },
                    "taxon-ids": { dimension: 59, defaultValue: "other" },
                    "content-has-history": { dimension: 39, defaultValue: "false" },
                    "publishing-application": { dimension: 89 },
                    stepnavs: { dimension: 96 },
                    "relevant-result-shown": { dimension: 83 },
                    "spelling-suggestion": { dimension: 81 },
                },
                e = $('meta[name^="govuk:"]'),
                i = {},
                a = {};
            return (
                e.each(function () {
                    var e = $(this),
                        t = e.attr("name").split("govuk:")[1];
                    n[t] && (a[t] = e.attr("content"));
                }),
                $.each(n, function (e, t) {
                    var n = a[e] || t.defaultValue;
                    void 0 !== n && (i["dimension" + t.dimension] = n);
                }),
                i
            );
        }
        function i() {
            return {
                dimension26: GOVUK.PageContent.getNumberOfSections(),
                dimension27: GOVUK.PageContent.getNumberOfLinks(),
                dimension23: $('main[id="content"]').attr("lang") || "unknown",
                dimension38: $('[data-module="global-bar"]').is(":visible") && "Global Banner viewed",
            };
        }
        function a() {
            var e = $('meta[name^="govuk:ab-test"]'),
                i = {};
            return (
                e.each(function () {
                    var e = $(this),
                        t = parseInt(e.data("analytics-dimension")),
                        n = e.attr("content");
                    t && (i["dimension" + t] = n);
                }),
                i
            );
        }
        window.GOVUK = window.GOVUK || {};
        var n = function () {};
        (n.getAndExtendDefaultTrackingOptions = function (e) {
            var t = this.customDimensions();
            return $.extend(t, e);
        }),
            (n.customDimensions = function () {
                var n = $.extend({}, e(), t(), i(), a());
                return $.each(n, function (e, t) {
                    n[e] = new GOVUK.Analytics.PIISafe(String(t));
                });
            }),
            (GOVUK.CustomDimensions = n);
    })(),
    (function () {
        "use strict";
        function i() {
            try {
                var e = n.prototype.getCookie("analytics_next_page_call");
                return n.prototype.setCookie("analytics_next_page_call", null), e || {};
            } catch (t) {
                return {};
            }
        }
        window.GOVUK = window.GOVUK || {};
        var n = function (e) {
            var t = window.GOVUK.getConsentCookie();
            (t && !t.usage) || (this.analytics = new GOVUK.Analytics(e));
            var n = i();
            ga(
                function (e) {
                    (this.gaClientId = e.get("clientId")),
                        $(window).trigger("gaClientSet"),
                        GOVUK.Ecommerce.start(),
                        this.trackPageview(null, null, n),
                        GOVUK.analyticsPlugins.error({ filenameMustMatch: /gov\.uk/ }),
                        GOVUK.analyticsPlugins.printIntent(),
                        GOVUK.analyticsPlugins.mailtoLinkTracker(),
                        GOVUK.analyticsPlugins.externalLinkTracker({ externalLinkUploadCustomDimension: 36 }),
                        GOVUK.analyticsPlugins.downloadLinkTracker({ selector: 'a[href*="/government/uploads"], a[href*="assets.publishing.service.gov.uk"]' });
                }.bind(this)
            );
        };
        (n.load = function () {
            GOVUK.Analytics.load();
        }),
            (n.prototype.trackPageview = function (e, t, n) {
                var i = !this.getCookie("seen_cookie_message"),
                    a = { dimension100: i ? i.toString() : "false" };
                $.extend(n, a);
                var o = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions(n);
                this.analytics.trackPageview(e, t, o);
            }),
            (n.prototype.trackEvent = function (e, t, n) {
                var i = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions(n);
                this.analytics.trackEvent(e, t, i);
            }),
            (n.prototype.setDimension = function (e, t, n, i) {
                void 0 !== t && this.analytics.setDimension(e, t, n, i);
            }),
            (n.prototype.trackShare = function (e) {
                var t = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions();
                this.analytics.trackShare(e, t);
            }),
            (n.prototype.addLinkedTrackerDomain = function (e, t, n, i) {
                this.analytics.addLinkedTrackerDomain(e, t, n, i);
            }),
            (n.prototype.setOptionsForNextPageview = function (e) {
                if ("object" == typeof e) {
                    var t = i();
                    this.getCookie("seen_cookie_message");
                    $.extend(t, e), this.setCookie("analytics_next_page_call", t);
                }
            }),
            (n.prototype.setCookie = function (e, t) {
                GOVUK.cookie && (t ? GOVUK.cookie(e, JSON.stringify(JSON.stringify(t))) : GOVUK.cookie(e, null));
            }),
            (n.prototype.getCookie = function (e) {
                if (GOVUK.cookie)
                    try {
                        return JSON.parse(JSON.parse(GOVUK.cookie(e)));
                    } catch (t) {
                        return null;
                    }
            }),
            (n.prototype.stripPII = function (e) {
                return this.analytics.pii.stripPII(e);
            }),
            (GOVUK.StaticAnalytics = n);
    })(),
    (function () {
        "use strict";
        window.GOVUK = window.GOVUK || {};
        var n = "Site search results",
            i = "Results",
            t = function () {
                function d(e, t, n, i, a, o, r) {
                    var s = { position: n, list: i, dimension71: o };
                    return a !== undefined && (s.dimension94 = a), e !== undefined && (s.id = e), t !== undefined && (s.name = t), r !== undefined && (s.variant = r), s;
                }
                function g(e, t, n, i, a, o, r) {
                    if (e || t) {
                        var s = d(e, t, n, a, o, i, r);
                        ga("ec:addImpression", s);
                    }
                }
                function f(e, t, n, i, a, o, r, s, c) {
                    e.click(function () {
                        if (t || n) {
                            var e = d(t, n, i, o, r, a, s);
                            ga("ec:addProduct", e);
                        }
                        ga("ec:setAction", "click", { list: o }), GOVUK.analytics.trackEvent("UX", "click", GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions({ label: c }));
                    });
                }
                this.init = function (e) {
                    var s = GOVUK.analytics.stripPII(e.attr("data-search-query")).substring(0, 100).toLowerCase(),
                        t = e.find("[data-ecommerce-row]"),
                        c = parseInt(e.data("ecommerce-start-index"), 10),
                        d = e.data("list-title") || n,
                        u = e.data("ecommerce-variant"),
                        l = e.data("track-click-label") || i;
                    t.each(function (e, t) {
                        var n = $(t),
                            i = n.data("ecommerce-subheading") || undefined,
                            a = n.attr("data-ecommerce-content-id"),
                            o = n.attr("data-ecommerce-path"),
                            r = n.attr("data-ecommerce-index");
                        g(a, o, (e = r ? parseInt(r, 10) - 1 : e) + c, s, d, i, u), f(n, a, o, e + c, s, d, i, u, l);
                    });
                };
            };
        (t.ecLoaded = !1),
            (t.start = function (e) {
                window.ga &&
                    0 < (e = e || $("[data-analytics-ecommerce]")).length &&
                    (t.ecLoaded || (ga("require", "ec"), (t.ecLoaded = !0)),
                    e.each(function () {
                        new t().init($(this));
                    }));
            }),
            (GOVUK.Ecommerce = t);
    })();
var analyticsInit = function () {
    "use strict";
    var e = window.GOVUK.getConsentCookie(),
        t = { addLinkedTrackerDomain: function () {}, setDimension: function () {}, setOptionsForNextPageView: function () {}, trackEvent: function () {}, trackPageview: function () {}, trackShare: function () {} };
    if (((window["ga-disable-UA-26179049-1"] = !0), e && e.usage)) {
        (window["ga-disable-UA-26179049-1"] = !1), GOVUK.StaticAnalytics.load();
        var n = "www.gov.uk" == document.domain ? ".www.gov.uk" : document.domain,
            i = "UA-26179049-1",
            a = "UA-145652997-1",
            o = new GOVUK.StaticAnalytics({ universalId: i, cookieDomain: n, allowLinker: !0 });
        GOVUK.analytics = o;
        var r = [
            "access.service.gov.uk",
            "access.tax.service.gov.uk",
            "accounts.manage-apprenticeships.service.gov.uk",
            "add-driving-licence-check-code.service.gov.uk",
            "analyse-school-performance.service.gov.uk",
            "appeal-tax-tribunal.service.gov.uk",
            "apply-basic-criminal-record-check.service.gov.uk",
            "apply-blue-badge.service.gov.uk",
            "apply-company-tachograph-card.service.gov.uk",
            "apply-for-bankruptcy.service.gov.uk",
            "apply-for-debt-relief-order.service.gov.uk",
            "apply-for-environmental-permit.service.gov.uk",
            "apply-for-eu-settled-status.homeoffice.gov.uk",
            "apply-for-innovation-funding.service.gov.uk",
            "apply-licence.ozone-depleting-substances.service.gov.uk",
            "apply-quota.fluorinated-gas.service.gov.uk",
            "apply-quota.ozone-depleting-substances.service.gov.uk",
            "beta.companieshouse.gov.uk",
            "biometric-residence-permit.service.gov.uk",
            "businessreadinessfund.beis.gov.uk",
            "catchreturn.service.gov.uk",
            "checklegalaid.service.gov.uk",
            "check-mot.service.gov.uk",
            "check-payment-practices.service.gov.uk",
            "check-vehicle-recalls.service.gov.uk",
            "civil-service-careers.gov.uk",
            "civilservicejobs.service.gov.uk",
            "claim.redundancy-payments.service.gov.uk",
            "claim-power-of-attorney-refund.service.gov.uk",
            "compare-school-performance.service.gov.uk",
            "complete-deputy-report.service.gov.uk",
            "contractsfinder.service.gov.uk",
            "coronavirus.data.gov.uk",
            "courttribunalfinder.service.gov.uk",
            "create-energy-label.service.gov.uk",
            "cymraeg.registertovote.service.gov.uk",
            "dartford-crossing-charge.service.gov.uk",
            "design-system.service.gov.uk",
            "devtracker.dfid.gov.uk",
            "digitalmarketplace.service.gov.uk",
            "eforms.homeoffice.gov.uk",
            "electronic-visa-waiver.service.gov.uk",
            "employmenttribunals.service.gov.uk",
            "eu-settled-status-enquiries.service.gov.uk",
            "faster-uk-entry.service.gov.uk",
            "finance.manage-apprenticeships.service.gov.uk",
            "findapprenticeship.service.gov.uk",
            "flood-map-for-planning.service.gov.uk",
            "flood-warning-information.service.gov.uk",
            "gender-pay-gap.service.gov.uk",
            "get-fishing-licence.service.gov.uk",
            "get-information-schools.service.gov.uk",
            "gro.gov.uk",
            "helpwithcourtfees.service.gov.uk",
            "help-with-prison-visits.service.gov.uk",
            "import-products-animals-food-feed.service.gov.uk",
            "lastingpowerofattorney.service.gov.uk",
            "live.email-dvla.service.gov.uk",
            "live.dvla-web-chat.service.gov.uk",
            "loststolenpassport.service.gov.uk",
            "makeaplea.service.gov.uk",
            "managefleetvehicles.service.gov.uk",
            "manage-apprenticeships.service.gov.uk",
            "manage-fish-exports.service.gov.uk",
            "manage-quota.fluorinated-gas.service.gov.uk",
            "manage-water-abstraction-impoundment-licence.service.gov.uk",
            "match.redundancy-payments.service.gov.uk",
            "mot-testing.service.gov.uk",
            "nominate-uk-honour.service.gov.uk",
            "notice.redundancy-payments.service.gov.uk",
            "passport.service.gov.uk",
            "paydvlafine.service.gov.uk",
            "payments.service.gov.uk",
            "publish-payment-practices.service.gov.uk",
            "queens-awards-enterprise.service.gov.uk",
            "recruit.manage-apprenticeships.service.gov.uk",
            "register.fluorinated-gas.service.gov.uk",
            "register-trailer.service.gov.uk",
            "register.ozone-depleting-substances.service.gov.uk",
            "registertovote.service.gov.uk",
            "register-vehicle.service.gov.uk",
            "registers.service.gov.uk",
            "reminders.mot-testing.service.gov.uk",
            "renewable-heat-calculator.service.gov.uk",
            "reply-jury-summons.service.gov.uk",
            "report-director-conduct.service.gov.uk",
            "report.fluorinated-gas.service.gov.uk",
            "report.ozone-depleting-substances.service.gov.uk",
            "right-to-rent.homeoffice.gov.uk",
            "right-to-work.service.gov.uk",
            "ruralpayments.service.gov.uk",
            "schools-financial-benchmarking.service.gov.uk",
            "secured.studentfinanceni.co.uk",
            "secured.studentfinancewales.co.uk",
            "selfservice.payments.service.gov.uk",
            "send-money-to-prisoner.service.gov.uk",
            "signin.service.gov.uk",
            "sorn.service.gov.uk",
            "staff.helpwithcourtfees.service.gov.uk",
            "student-finance.service.gov.uk",
            "tax.service.gov.uk",
            "teacherservices.education.gov.uk",
            "teaching-vacancies.service.gov.uk",
            "to-visit-or-stay-in-the-uk.homeoffice.gov.uk",
            "trade-tariff.service.gov.uk",
            "tribunal-response.employmenttribunals.service.gov.uk",
            "ukri.org",
            "update-student-loan-employment-details.service.gov.uk",
            "vehicle-operator-licensing.service.gov.uk",
            "vehicleenquiry.service.gov.uk",
            "viewdrivingrecord.service.gov.uk",
            "view-and-prove-your-rights.homeoffice.gov.uk",
            "view-immigration-status.service.gov.uk",
            "visa-address-update.service.gov.uk",
            "visas-immigration.service.gov.uk",
            "your-defra-account.defra.gov.uk",
        ];
        GOVUK.analytics.addLinkedTrackerDomain(a, "govuk", r);
    } else GOVUK.analytics = t;
};
(window.GOVUK.analyticsInit = analyticsInit),
    (function () {
        "use strict";
        function o(e) {
            (this.config = this.getConfigForCurrentPath(e)),
                (this.SCROLL_TIMEOUT_DELAY = 10),
                this.config ? ((this.enabled = !0), (this.trackedNodes = this.buildNodes(this.config)), $(window).scroll($.proxy(this.onScroll, this)), this.trackVisibleNodes()) : (this.enabled = !1);
        }
        window.GOVUK = window.GOVUK || {};
        var e = {
            "/transition": [
                ["Percent", 20],
                ["Percent", 40],
                ["Percent", 60],
                ["Percent", 80],
                ["Percent", 100],
            ],
            "/government/publications/coronavirus-outbreak-faqs-what-you-can-and-cant-do/coronavirus-outbreak-faqs-what-you-can-and-cant-do": [
                ["Percent", 20],
                ["Percent", 40],
                ["Percent", 60],
                ["Percent", 80],
                ["Percent", 100],
            ],
            "/government/publications/coronavirus-covid-19-online-education-resources/coronavirus-covid-19-list-of-online-education-resources-for-home-education": [
                ["Percent", 20],
                ["Percent", 40],
                ["Percent", 60],
                ["Percent", 80],
                ["Percent", 100],
            ],
            "/guidance/coronavirus-covid-19-information-for-the-public": [
                ["Percent", 20],
                ["Percent", 40],
                ["Percent", 60],
                ["Percent", 80],
                ["Percent", 100],
            ],
            "/guidance/saving-for-retirement-if-youre-aged-16-to-50": [
                ["Heading", "Keep track of your State Pension"],
                ["Heading", "Consider ways to improve your State Pension"],
                ["Heading", "Personal and stakeholder pensions"],
            ],
            "/guidance/planning-for-retirement-if-youre-aged-50-or-over": [
                ["Heading", "Find out your State Pension age"],
                ["Heading", "Consider ways to improve your State Pension"],
                ["Heading", "Workplace, personal and stakeholder pensions"],
                ["Heading", "Personal and stakeholder pensions"],
            ],
            "/guidance/retirement-planning-for-current-pensioners": [
                ["Heading", "If you reached State Pension age before 6 April 2016"],
                ["Heading", "Other ways to increase your income in retirement"],
                ["Heading", "Further support in retirement"],
                ["Heading", "Winter Fuel Payments"],
            ],
            "/government/collections/disability-confident-campaign": [
                ["Heading", "Become a Disability Confident employer"],
                ["Heading", "Aims and objectives"],
                ["Heading", "Inclusive communication"],
            ],
            "/government/publications/the-essential-trustee-what-you-need-to-know-cc3/the-essential-trustee-what-you-need-to-know-what-you-need-to-do": [
                ["Heading", "1. About this guidance"],
                ["Heading", "2. Trustees\u2019 duties at a glance"],
                ["Heading", "3. Who can be a trustee and how trustees are appointed"],
                ["Heading", "4. Ensure your charity is carrying out its purposes for the public benefit"],
                ["Heading", "5. Comply with your charity\u2019s governing document and the law"],
                ["Heading", "6. Act in your charity\u2019s best interests"],
                ["Heading", "7. Manage your charity\u2019s resources responsibly"],
                ["Heading", "8. Act with reasonable care and skill"],
                ["Heading", "9. Ensure your charity is accountable"],
                ["Heading", "10. Reduce the risk of liability"],
                ["Heading", "11. Your charity\u2019s legal structure and what it means"],
                ["Heading", "12. Charity officers - the chair and treasurer"],
                ["Heading", "13. Technical terms used in this guidance"],
            ],
            "/guidance/universal-credit-how-it-helps-you-into-work": [
                ["Heading", "Support from your work coach"],
                ["Heading", "Help available for parents"],
                ["Heading", "When you can claim Universal Credit"],
                ["Heading", "More detailed advice"],
            ],
            "/openingupwork": [
                ["Heading", "How Universal Credit makes work pay"],
                ["Heading", "When you can claim Universal Credit"],
                ["Heading", "Help and advice"],
            ],
            "/government/publications/spring-budget-2017-documents/spring-budget-2017": [
                ["Heading", "1. Executive summary"],
                ["Heading", "2. Economic context and public finances"],
                ["Heading", "3. Policy decisions"],
                ["Heading", "4. Tax"],
                ["Heading", "5. Productivity"],
                ["Heading", "6. Public services and markets"],
                ["Heading", "7. Annex A: Financing"],
                ["Heading", "8. Annex B: Office for Budget Responsibility's Economic and fiscal outlook"],
            ],
            "/guidance/living-in-the-eu-prepare-for-brexit": [["Heading", "Travelling in the EU"]],
            "/guidance/driving-in-the-eu-after-brexit-driving-licence-exchange": [["Heading", "Belgium"]],
            "/settled-status-eu-citizens-families": [["Heading", "When you can apply"]],
            "/guidance/returning-to-the-uk": [["Heading", "Ending your time living abroad"]],
            "/council-housing": [["Heading", "Choice-based lettings"]],
            "/guidance/foreign-travel-insurance": [["Heading", "What your travel insurance policy should cover"]],
            "/guidance/passport-rules-for-travel-to-europe-after-brexit": [["Heading", "List of countries affected"]],
            "/visit-europe-brexit": [["Heading", "Travel"]],
            "/guidance/uk-nationals-in-the-eu-benefits-and-pensions-in-a-no-deal-scenario": [["Heading", "Pensions and benefits paid by an EEA state or Switzerland"]],
            "/guidance/uk-students-in-the-eu-continuing-your-studies": [["Heading", "Check whether you\u2019ll get financial help"]],
            "/government/publications/cross-border-maintenance-cases-after-brexit-guidance-for-public/cross-border-maintenance-cases-after-brexit": [["Heading", "2. New cases after Brexit"]],
            "/guidance/social-security-contributions-for-uk-and-eu-workers-if-the-uk-leaves-the-eu-with-no-deal": [
                ["Heading", "UK employers"],
                ["Heading", "UK employees and self-employed"],
            ],
            "/guidance/student-finance-arrangements-in-a-no-deal-scenario": [["Heading", "Other overseas study placements"]],
            "/guidance/advice-for-british-nationals-travelling-and-living-in-europe": [["Heading", "Travelling to the UK"]],
            "/guidance/living-in-france": [["Heading", "Passports and travel"]],
            "/family-permit": [["Heading", "EEA family permit"]],
            "/guidance/european-temporary-leave-to-remain-in-the-uk": [["Heading", "Applying for European temporary leave to remain"]],
            "/guidance/visiting-the-uk-after-brexit": [["Heading", "If the UK leaves the EU without a deal"]],
            "/guidance/healthcare-for-eu-and-efta-citizens-visiting-the-uk": [["Heading", "Travel insurance"]],
            "/guidance/qualified-teacher-status-qts": [["Heading", "Teachers recognised in the EEA or Switzerland"]],
            "/guidance/driving-in-the-eu-after-brexit": [["Heading", "GB stickers and number plates"]],
            "/visit-europe-brexit#travel": [["Heading", "Compensation if your travel is disrupted"]],
            "/apply-for-a-uk-residence-card": [["Heading", "Fees"]],
            "/guidance/studying-in-the-european-union-after-brexit": [["Heading", "Applying for Erasmus+"]],
            "/settled-status-eu-citizens-families/not-EU-EEA-Swiss-citizen": [["Heading", "If you\u2019re a family member of an EU, EEA or Swiss citizen"]],
            "/guidance/get-your-eea-qualification-recognised-in-the-uk-after-brexit": [["Heading", "Professionals already working in the UK"]],
            "/guidance/visiting-the-uk-after-brexit#if-your-vehicle-is-not-insured-in-the-uk": [["Heading", "If your vehicle is not insured in the UK"]],
            "/guidance/uk-residents-visiting-the-eueea-and-switzerland-healthcare": [["Heading", "European Health Insurance Cards (EHIC)"]],
            "/guidance/pet-travel-to-europe-after-brexit": [["Heading", "Pet travel if there\u2019s a no-deal Brexit"]],
            "/guidance/driving-in-the-eu-after-brexit-international-driving-permits": [["Heading", "Check which type of IDP you need"]],
            "/guidance/driving-in-the-eu-after-brexit#insurance-for-your-vehicle-caravan-or-trailer": [["Heading", "Trailer registration"]],
            "/driving-abroad": [["Heading", "Check your insurance if you\u2019re taking your own vehicle"]],
            "/get-a-passport-urgently": [["Heading", "Ways to apply"]],
            "/guidance/mobile-roaming-after-eu-exit": [["Heading", "If you live in Northern Ireland"]],
            "/government/publications/mobile-roaming-after-eu-exit/mobile-roaming-if-theres-no-brexit-deal": [["Heading", "1.2 If there\u2019s no deal"]],
            "/driving-abroad/international-driving-permit": [["Heading", "Check which IDP you need"]],
            "/vehicle-insurance/driving-abroad": [["Heading", "Driving in other countries"]],
            "/guidance/driving-in-the-eu-after-brexit#gb-stickers-and-number-plates": [["Heading", "GB stickers and number plates"]],
            "/guidance/importing-and-exporting-plants-and-plant-products-if-theres-no-withdrawal-deal": [["Heading", "Movement of wood packaging material"]],
            "/guidance/egg-marketing-standards-if-theres-a-no-deal-brexit": [["Heading", "Customs checks"]],
            "/guidance/hatching-eggs-and-chicks-marketing-standards-when-the-uk-leaves-the-eu": [["Heading", "Customs checks"]],
            "/guidance/poultry-meat-marketing-standards-when-the-uk-leaves-the-eu": [["Heading", "Marketing standards checks"]],
            "/guidance/plant-variety-rights-and-marketing-plant-reproductive-material-if-the-uk-leaves-the-eu-without-a-deal": [["Heading", "Rules for applying for plant variety rights if there\u2019s a no deal Brexit"]],
            "/guidance/exporting-animals-animal-products-fish-and-fishery-products-if-the-uk-leaves-the-eu-with-no-deal": [["Heading", "Exports to non-EU countries (third countries) from the UK"]],
            "/guidance/the-farming-sector-and-preparing-for-eu-exit": [["Heading", "Farm and rural payments: Basic Payment Scheme and Rural Development Programme for England"]],
            "/guidance/protecting-food-and-drink-names-if-theres-no-brexit-deal": [["Heading", "New product applications"]],
            "/guidance/trading-and-labelling-organic-food-if-theres-no-brexit-deal": [["Heading", "Exporting organic food to the EU"]],
            "/guidance/hops-and-hops-products-marketing-standards-if-the-uk-leaves-the-eu-without-a-deal": [["Heading", "How to apply for an EU Attestation of Equivalence"]],
            "/guidance/guidance-for-suppliers-of-cattle-sheep-and-goat-ear-tags": [["Heading", "Tagging information for livestock keepers"]],
            "/government/publications/meeting-climate-change-requirements-if-theres-no-brexit-deal/meeting-climate-change-requirements-if-theres-no-brexit-deal": [["Heading", "Summary of actions"]],
            "/guidance/food-labelling-changes-after-brexit": [["Heading", "Goods sold in the UK"]],
            "/guidance/export-horses-and-ponies-special-rules": [["Heading", "Moving equines to the EU in a no-deal Brexit"]],
            "/guidance/trading-and-moving-endangered-species-protected-by-cites-if-theres-no-withdrawal-deal": [["Heading", "Trading with the EU"]],
            "/guidance/wine-trade-regulations": [["Heading", "Rules for transporting wine into the UK"]],
            "/guidance/the-food-and-drink-sector-and-preparing-for-eu-exit": [["Heading", "Importing and exporting"]],
            "/guidance/exporting-and-importing-fish-if-theres-no-brexit-deal": [["Heading", "Send fish to an EU border control post"]],
            "/guidance/the-fisheries-sector-and-preparing-for-eu-exit": [["Heading", "Licensing arrangements"]],
            "/guidance/import-fish-after-a-no-deal-brexit": [["Heading", "Direct landings into the UK"]],
            "/guidance/the-chemicals-sector-and-preparing-for-eu-exit": [["Heading", "Energy and climate"]],
            "/government/publications/trading-electricity-if-theres-no-brexit-deal/trading-electricity-if-theres-no-brexit-deal": [["Heading", "Summary of actions"]],
            "/guidance/how-to-move-goods-between-or-through-common-transit-countries-including-the-eu": [["Heading", "Start moving your goods"]],
            "/guidance/ecmt-international-road-haulage-permits": [["Heading", "Apply for permits"]],
            "/guidance/transporting-goods-between-the-uk-and-eu-in-a-no-deal-brexit-guidance-for-hauliers": [["Heading", "Cross-border responsibilities when moving goods"]],
            "/guidance/carry-out-international-road-haulage-after-brexit": [["Heading", "Vehicle and trailer insurance"]],
            "/guidance/prepare-to-drive-in-the-eu-after-brexit-lorry-and-goods-vehicle-drivers": [["Heading", "Driver CPC for lorry drivers"]],
            "/guidance/run-international-bus-or-coach-services-after-brexit": [["Heading", "Run regular international services"]],
            "/guidance/vehicle-type-approval-if-theres-no-brexit-deal": [["Heading", "Existing vehicle and component type-approvals"]],
            "/guidance/hauliers-and-commercial-drivers-you-will-need-new-documents-to-transport-goods-into-the-eu-after-brexit": [["Heading", "Driver documents"]],
            "/guidance/how-to-move-goods-through-roro-locations-in-a-no-deal-brexit-eu-to-uk-and-uk-to-eu": [["Heading", "EU to UK: pre-journey from EU to the UK"]],
            "/guidance/the-retail-sector-and-preparing-for-eu-exit": [["Heading", "Importing and exporting"]],
            "/guidance/the-consumer-goods-sector-and-preparing-for-eu-exit": [["Heading", "Importing and exporting"]],
            "/guidance/textile-labelling-after-brexit": [["Heading", "Labelling requirements"]],
            "/guidance/footwear-labelling-after-brexit": [["Heading", "Labelling requirements"]],
            "/government/publications/banking-insurance-and-other-financial-services-if-theres-no-brexit-deal/banking-insurance-and-other-financial-services-if-theres-no-brexit-deal-information-for-financial-services-institutions": [
                ["Heading", "3. Action taken by the UK"],
            ],
            "/government/publications/eu-lawyers-in-the-uk-after-a-no-deal-brexit/eu-lawyers-in-the-uk-after-a-no-deal-brexit": [["Heading", "Lawyers with EU, Norway, Iceland or Liechtenstein qualifications and professional titles"]],
            "/government/publications/further-guidance-note-on-the-regulation-of-medicines-medical-devices-and-clinical-trials-if-theres-no-brexit-deal/further-guidance-note-on-the-regulation-of-medicines-medical-devices-and-clinical-trials-if-theres-no-brexit-deal": [
                ["Heading", "1.4 Orphan medicines"],
            ],
            "/guidance/accounting-if-theres-no-brexit-deal": [["Heading", "UK public companies with an EEA listing"]],
            "/guidance/broadcasting-and-video-on-demand-if-theres-no-brexit-deal": [["Heading", "Get local legal advice about your video on-demand services"]],
            "/guidance/changes-to-copyright-law-after-brexit": [["Heading", "Artist\u2019s resale right"]],
            "/guidance/changes-to-eu-and-international-designs-and-trade-mark-protection-after-brexit": [["Heading", "Registered design"]],
            "/guidance/check-temporary-rates-of-customs-duty-on-imports-after-eu-exit": [["Heading", "Tariff-rate quotas (TRQ)"]],
            "/guidance/construction-products-regulation-if-there-is-no-brexit-deal": [["Heading", "UK manufacturers exporting to the EU"]],
            "/guidance/european-and-domestic-funding-after-brexit": [["Heading", "What you need to do"]],
            "/guidance/exhaustion-of-ip-rights-and-parallel-trade-after-brexit": [["Heading", "Actions for IP rights holders"]],
            "/guidance/exporting-nuclear-related-items-after-brexit": [["Heading", "Exporting dual-use items"]],
            "/guidance/guidance-on-substantial-amendments-to-a-clinical-trial-if-the-uk-leaves-the-eu-with-no-deal": [["Heading", "Investigational medicinal product (IMP) certification and importation"]],
            "/guidance/importing-and-exporting-waste-if-theres-no-brexit-deal": [["Heading", "Rules after the UK leaves the EU"]],
            "/guidance/merger-review-and-anti-competitive-activity-after-brexit": [["Heading", "Mergers"]],
            "/guidance/nis-regulations-what-uk-digital-service-providers-operating-in-the-eu-should-do-after-brexit": [["Heading", "How RDSPs are regulated in the UK"]],
            "/guidance/placing-manufactured-goods-on-the-eu-internal-market-if-theres-no-deal": [["Heading", "Appointing an authorised representative or responsible person in the EU"]],
            "/guidance/prepare-to-import-relevant-nuclear-materials-from-the-eu-after-brexit-licensing-requirements": [["Heading", "More information"]],
            "/guidance/prepare-to-use-the-ukca-mark-after-brexit": [["Heading", "Check whether you will need to use the new UKCA marking"]],
            "/guidance/prepare-to-work-and-operate-in-the-european-aviation-sector-after-brexit": [["Heading", "Requirements for aviation businesses operating in Europe after the UK leaves the EU"]],
            "/guidance/public-sector-procurement-after-a-no-deal-brexit": [["Heading", "What will change for contracting authorities and entities"]],
            "/guidance/satellites-and-space-programmes-after-brexit": [["Heading", "Copernicus"]],
            "/guidance/shipping-radioactive-waste-and-spent-fuel-after-brexit": [["Heading", "After Brexit"]],
            "/guidance/trading-timber-imports-and-exports-if-theres-no-brexit-deal": [["Heading", "Importing timber for the UK market"]],
            "/guidance/what-you-need-to-move-goods-between-or-through-common-transit-countries-including-the-eu": [["Heading", "Getting a guarantee"]],
            "/taking-goods-out-uk-temporarily/get-an-ata-carnet": [["Heading", "Using an ATA Carnet"]],
            "/wood-packaging-import-export": [["Heading", "Export solid wood packaging"]],
            "/government/publications/vat-for-businesses-if-theres-no-brexit-deal/vat-for-businesses-if-theres-no-brexit-deal": [["Heading", "UK businesses importing goods from the EU"]],
        };
        (o.prototype.getConfigForCurrentPath = function (e) {
            for (var t in e) if (this.normalisePath(window.location.pathname) == this.normalisePath(t)) return e[t];
        }),
            (o.prototype.buildNodes = function (e) {
                for (var t, n, i = [], a = 0; a < e.length; a++) (t = o[e[a][0] + "Node"]), (n = e[a][1]), i.push(new t(n));
                return i;
            }),
            (o.prototype.normalisePath = function (e) {
                return e.split("/").join("");
            }),
            (o.prototype.onScroll = function () {
                clearTimeout(this.scrollTimeout), (this.scrollTimeout = setTimeout($.proxy(this.trackVisibleNodes, this), this.SCROLL_TIMEOUT_DELAY));
            }),
            (o.prototype.trackVisibleNodes = function () {
                for (var e = 0; e < this.trackedNodes.length; e++)
                    if (this.trackedNodes[e].isVisible() && !this.trackedNodes[e].alreadySeen) {
                        this.trackedNodes[e].alreadySeen = !0;
                        var t = this.trackedNodes[e].eventData.action,
                            n = this.trackedNodes[e].eventData.label;
                        GOVUK.analytics.trackEvent("ScrollTo", t, { label: n, nonInteraction: !0 });
                    }
            }),
            (o.PercentNode = function (e) {
                (this.percentage = e), (this.eventData = { action: "Percent", label: String(e) });
            }),
            (o.PercentNode.prototype.isVisible = function () {
                return this.currentScrollPercent() >= this.percentage;
            }),
            (o.PercentNode.prototype.currentScrollPercent = function () {
                var e = $(document),
                    t = $(window);
                return (t.scrollTop() / (e.height() - t.height())) * 100;
            }),
            (o.HeadingNode = function (e) {
                function t(e) {
                    for (var t = $("h1, h2, h3, h4, h5, h6"), n = 0; n < t.length; n++) if ($.trim(t.eq(n).text()).replace(/\s/g, " ") == e) return t.eq(n);
                }
                (this.$element = t(e)), (this.eventData = { action: "Heading", label: e });
            }),
            (o.HeadingNode.prototype.isVisible = function () {
                return !!this.$element && this.elementIsVisible(this.$element);
            }),
            (o.HeadingNode.prototype.elementIsVisible = function (e) {
                var t = $(window),
                    n = e.offset().top;
                return n > t.scrollTop() && n < t.scrollTop() + t.height();
            }),
            $().ready(function () {
                window.GOVUK.scrollTracker = new o(e);
            }),
            (window.GOVUK.ScrollTracker = o);
    })(),
    window.GOVUK.analyticsInit(),
    (function (e) {
        "use strict";
        var u = e.jQuery,
            l = e.GOVUK || {};
        (l.Modules = l.Modules || {}),
            (l.modules = {
                find: function (e) {
                    var t,
                        n = "[data-module]";
                    return (t = (e = e || u("body")).find(n)), e.is(n) && (t = t.add(e)), t;
                },
                start: function (e) {
                    function t(e) {
                        return i(n(e));
                    }
                    function n(e) {
                        return e.replace(/-([a-z])/g, function (e) {
                            return e.charAt(1).toUpperCase();
                        });
                    }
                    function i(e) {
                        return e.charAt(0).toUpperCase() + e.slice(1);
                    }
                    for (var a = this.find(e), o = 0, r = a.length; o < r; o++) {
                        var s = u(a[o]),
                            c = t(s.data("module")),
                            d = s.data("module-started");
                        "function" != typeof l.Modules[c] || d || (new l.Modules[c]().start(s), s.data("module-started", !0));
                    }
                },
            }),
            (e.GOVUK = l);
    })(window),
    (function () {
        "use strict";
        window.GOVUK.Modules.GlobalBar = function () {
            this.start = function (e) {
                function t() {
                    o($(this).attr("href"));
                }
                function n(e) {
                    var t = parseCookie(GOVUK.getCookie(r)),
                        n = d;
                    t && (n = t.version);
                    var i = JSON.stringify({ count: 999, version: n });
                    GOVUK.setCookie(r, i, { days: 84 }),
                        $(".global-bar-additional").removeClass("global-bar-additional--show"),
                        $(".global-bar__dismiss").removeClass("global-bar__dismiss--show"),
                        o("Manually dismissed"),
                        e.preventDefault();
                }
                function i(e) {
                    e += 1;
                    var t = JSON.stringify({ count: e, version: d });
                    GOVUK.setCookie(r, t, { days: 84 }), 2 == e && o("Automatically dismissed");
                }
                function a() {
                    var e = GOVUK.getCookie(r),
                        t = parseInt(parseCookie(e).count, 10);
                    return isNaN(t) && (t = 0), t;
                }
                function o(e) {
                    GOVUK.analytics && "function" == typeof GOVUK.analytics.trackEvent && GOVUK.analytics.trackEvent("Global bar", e, { nonInteraction: 1 });
                }
                var r = "global_bar_seen",
                    s = e.data("global-bar-permanent"),
                    c = GOVUK.getCookieCategory(r);
                if (GOVUK.getConsentCookie()[c]) {
                    (null !== GOVUK.getCookie(r) && parseCookie(GOVUK.getCookie(r)).count !== undefined) || GOVUK.setCookie("global_bar_seen", JSON.stringify({ count: 0, version: 0 }), { days: 84 });
                    var d = parseCookie(GOVUK.getCookie(r)).version,
                        u = a();
                }
                e.on("click", ".dismiss", n), e.on("click", ".js-call-to-action", t), e.is(":visible") && (s || i(u));
            };
        };
    })(),
    (function (e, t) {
        "use strict";
        var b = (0, t.$)(t);
        e.StickyElementContainer = function () {
            var y = this;
            (y._getWindowDimensions = function e() {
                return { height: b.height(), width: b.width() };
            }),
                (y._getWindowPositions = function t() {
                    return { scrollTop: b.scrollTop() };
                }),
                (y.start = function w(t) {
                    function e() {
                        b.resize(n), b.scroll(i), setInterval(a, m), setInterval(o, m), a(), o(), p.addClass("govuk-sticky-element--enabled");
                    }
                    function n() {
                        v = !0;
                    }
                    function i() {
                        h = !0;
                    }
                    function a() {
                        if (v) {
                            h = !(v = !1);
                            var e = y._getWindowDimensions();
                            (g = t.offset().top), (f = t.offset().top + t.height() - e.height);
                        }
                    }
                    function o() {
                        h && ((h = !1), (k = y._getWindowPositions().scrollTop), r(), s());
                    }
                    function r() {
                        g < k ? u() : l();
                    }
                    function s() {
                        f < k ? d() : c();
                    }
                    function c() {
                        p.addClass("govuk-sticky-element--stuck-to-window");
                    }
                    function d() {
                        p.removeClass("govuk-sticky-element--stuck-to-window");
                    }
                    function u() {
                        p.removeClass("govuk-sticky-element--hidden");
                    }
                    function l() {
                        p.addClass("govuk-sticky-element--hidden");
                    }
                    var g,
                        f,
                        p = t.find("[data-sticky-element]"),
                        v = !0,
                        h = !0,
                        m = 50,
                        k = 1;
                    e();
                });
        };
    })(window.GOVUK.Modules, window),
    (function () {
        "use strict";
        window.GOVUK.Modules.Toggle = function () {
            this.start = function (n) {
                function e() {
                    var e = $(this);
                    e.attr("role", "button"), e.attr("aria-controls", e.data("controls")), e.attr("aria-expanded", e.data("expanded"));
                    var t = i(e);
                    t.attr("aria-live", "polite"), t.attr("role", "region"), e.data("$targets", t);
                }
                function t(e) {
                    var t = $(e.target),
                        n = "true" === t.attr("aria-expanded"),
                        i = t.data("$targets");
                    n ? (t.attr("aria-expanded", !1), i.addClass("js-hidden")) : (t.attr("aria-expanded", !0), i.removeClass("js-hidden"));
                    var a = t.data("toggled-text");
                    "string" == typeof a && (t.data("toggled-text", t.text()), t.text(a)), e.preventDefault();
                }
                function i(e) {
                    var t = "#" + e.attr("aria-controls").split(" ").join(", #");
                    return n.find(t);
                }
                var a = "[data-controls][data-expanded]";
                n.on("click", a, t), n.find(a).each(e);
            };
        };
    })(),
    (window.GOVUK.Modules = window.GOVUK.Modules || {}),
    (function () {
        "use strict";
        window.GOVUK.Modules.TrackClick = function () {
            this.start = function (e) {
                function t(e) {
                    var t = $(e.target),
                        n = { transport: "beacon" };
                    t.is(u) || (t = t.parents(u));
                    var i = t.attr("data-track-category"),
                        a = t.attr("data-track-action"),
                        o = t.attr("data-track-label"),
                        r = t.attr("data-track-value"),
                        s = t.attr("data-track-dimension"),
                        c = t.attr("data-track-dimension-index"),
                        d = t.attr("data-track-options");
                    o && (n.label = o), r && (n.value = r), s && c && (n["dimension" + c] = s), d && $.extend(n, JSON.parse(d)), GOVUK.analytics && GOVUK.analytics.trackEvent && GOVUK.analytics.trackEvent(i, a, n);
                }
                var u = "[data-track-category][data-track-action]";
                e.is(u) ? e.on("click", t) : e.on("click", u, t);
            };
        };
    })(),
    (window.GOVUK.Modules = window.GOVUK.Modules || {}),
    (function (o) {
        "use strict";
        var i = window.$;
        (o.crossDomainLinkedTrackers = []),
            (o.CrossDomainTracking = function () {
                function n(e) {
                    var t = e.attr("data-tracking-name"),
                        n = e.attr("data-tracking-code"),
                        i = "true" === e.attr("data-tracking-track-event");
                    if ("undefined" !== GOVUK.analytics) {
                        if (-1 === o.crossDomainLinkedTrackers.indexOf(t)) {
                            var a = e.prop("hostname");
                            GOVUK.analytics.addLinkedTrackerDomain(n, t, a), o.crossDomainLinkedTrackers.push(t);
                        }
                        i &&
                            e.click({ text: e.text(), name: t }, function (e) {
                                GOVUK.analytics.trackEvent("External Link Clicked", e.data.text, { trackerName: e.data.name });
                            });
                    }
                }
                this.start = function (e) {
                    var t = "[href][data-tracking-code][data-tracking-name]";
                    e.is(t)
                        ? n(e)
                        : e.find(t).each(function () {
                              n(i(this));
                          });
                };
            });
    })(window.GOVUK.Modules),
    $(document).ready(function () {
        GOVUK.modules.start();
    }),
    $(document).ready(function () {
        $(".print-link a").attr("target", "_blank");
        var e = $(".js-search-focus");
        if (
            (e.each(function (e, t) {
                "" !== $(t).val() && $(t).addClass("focus");
            }),
            e.on("focus", function (e) {
                $(e.target).addClass("focus");
            }),
            e.on("blur", function (e) {
                "" === $(e.target).val() && $(e.target).removeClass("focus");
            }),
            window.GOVUK)
        ) {
            var t = "label.selectable input[type='radio'], label.selectable input[type='checkbox']";
            new GOVUK.SelectionButtons(t), GOVUK.shimLinksWithButtonRole && GOVUK.shimLinksWithButtonRole.init();
        }
    }),
    (function (e) {
        "use strict";
        var a = e.jQuery,
            t = e.GOVUK || {},
            n = function (e, t) {
                (this.selectedClass = "selected"),
                    (this.focusedClass = "focused"),
                    (this.radioClass = "selection-button-radio"),
                    (this.checkboxClass = "selection-button-checkbox"),
                    t !== undefined &&
                        a.each(
                            t,
                            function (e, t) {
                                this[e] = t;
                            }.bind(this)
                        ),
                    "string" == typeof e ? ((this.selector = e), this.setInitialState(a(this.selector))) : e !== undefined && ((this.$elms = e), this.setInitialState(this.$elms)),
                    this.addEvents();
            };
        (n.prototype.addEvents = function () {
            "undefined" != typeof this.$elms ? this.addElementLevelEvents() : this.addDocumentLevelEvents();
        }),
            (n.prototype.setInitialState = function (e) {
                e.each(
                    function (e, t) {
                        var n = a(t),
                            i = "radio" === n.attr("type") ? this.radioClass : this.checkboxClass;
                        n.parent("label").addClass(i), n.is(":checked") && this.markSelected(n);
                    }.bind(this)
                );
            }),
            (n.prototype.markFocused = function (e, t) {
                "focused" === t ? e.parent("label").addClass(this.focusedClass) : e.parent("label").removeClass(this.focusedClass);
            }),
            (n.prototype.markSelected = function (e) {
                var t;
                "radio" === e.attr("type")
                    ? ((t = e.attr("name")),
                      a(e[0].form)
                          .find('input[name="' + t + '"]')
                          .parent("label")
                          .removeClass(this.selectedClass),
                      e.parent("label").addClass(this.selectedClass))
                    : e.is(":checked")
                    ? e.parent("label").addClass(this.selectedClass)
                    : e.parent("label").removeClass(this.selectedClass);
            }),
            (n.prototype.addElementLevelEvents = function () {
                (this.clickHandler = this.getClickHandler()), (this.focusHandler = this.getFocusHandler({ level: "element" })), this.$elms.on("click", this.clickHandler).on("focus blur", this.focusHandler);
            }),
            (n.prototype.addDocumentLevelEvents = function () {
                (this.clickHandler = this.getClickHandler()), (this.focusHandler = this.getFocusHandler({ level: "document" })), a(document).on("click", this.selector, this.clickHandler).on("focus blur", this.selector, this.focusHandler);
            }),
            (n.prototype.getClickHandler = function () {
                return function (e) {
                    this.markSelected(a(e.target));
                }.bind(this);
            }),
            (n.prototype.getFocusHandler = function (e) {
                var n = "document" === e.level ? "focusin" : "focus";
                return function (e) {
                    var t = e.type === n ? "focused" : "blurred";
                    this.markFocused(a(e.target), t);
                }.bind(this);
            }),
            (n.prototype.destroy = function () {
                "undefined" != typeof this.selector
                    ? a(document).off("click", this.selector, this.clickHandler).off("focus blur", this.selector, this.focusHandler)
                    : this.$elms.off("click", this.clickHandler).off("focus blur", this.focusHandler);
            }),
            (t.SelectionButtons = n),
            (e.GOVUK = t);
    })(window),
    (function (e) {
        "use strict";
        var t = e.jQuery,
            n = e.GOVUK || {};
        (n.shimLinksWithButtonRole = {
            init: function i() {
                t(document).on("keydown", '[role="button"]', function (e) {
                    32 === e.which && (e.preventDefault(), e.target.click());
                });
            },
        }),
            (e.GOVUK = n);
    })(window);
