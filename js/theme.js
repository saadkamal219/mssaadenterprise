/*!
 * মেসার্স সাদ এন্টারপ্রাইজ — থিম সুইচার
 * ------------------------------------------------------------------
 * কাজ: ভিজিটর/আপনি "মূল থিম", "এনার্জি" বা "ম্যাঙ্গা" বেছে নিতে পারবেন।
 *  - পছন্দ localStorage-এ জমা থাকে, তাই সব পেজে একই থিম চলে।
 *  - শেয়ারযোগ্য লিংক: যেকোনো পেজের শেষে ?theme=manga বা ?theme=energy যোগ করুন।
 *  - "মূল থিম" = আপনার বর্তমান css/style.css, কিছুই বদলায়নি।
 *  - এনার্জি/ম্যাঙ্গা = css/themes/ ফোল্ডারের CSS; হোম পেজের বাড়তি সাজ
 *    (মার্কি, ব্যাজ, কাচের কার্ড, পরিসংখ্যান) এই স্ক্রিপ্টই যোগ করে।
 *  - এই স্ক্রিপ্ট <head>-এর ভেতরে, স্টাইলশিটের লিংকের পরে বসাতে হবে।
 */
(function () {
  "use strict";

  var KEY = "msse-theme";
  var VER = "1"; // থিম CSS বদলালে এই সংখ্যা বাড়ান, যাতে ব্রাউজার নতুন ফাইল নেয়
  var THEMES = [
    { id: "default", name: "মূল থিম", sub: "আপনার বর্তমান ডিজাইন" },
    { id: "energy", name: "এনার্জি", sub: "লাল ও লাইম, প্রাণবন্ত" },
    { id: "manga", name: "ম্যাঙ্গা", sub: "কমিক বইয়ের ঢং" }
  ];

  var html = document.documentElement;
  var me = document.currentScript;
  var rm = window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches;

  function valid(id) {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return true;
    return false;
  }

  /* ---------- কোন থিম চালু হবে ---------- */
  function readTheme() {
    var id = "default";
    try {
      var u = new URL(location.href), q = u.searchParams.get("theme");
      if (q && valid(q)) {
        id = q;
        try { localStorage.setItem(KEY, q); } catch (e) {}
        u.searchParams.delete("theme");
        history.replaceState(null, "", u.pathname + u.search + u.hash);
        return id;
      }
    } catch (e) {}
    try {
      var s = localStorage.getItem(KEY);
      if (s && valid(s)) id = s;
    } catch (e) {}
    return id;
  }

  var theme = readTheme();
  html.setAttribute("data-theme", theme);

  /* ---------- থিমের CSS ফাইলের ঠিকানা ---------- */
  var base = "";
  if (me && me.src) base = me.src.replace(/js\/theme\.js(\?.*)?$/, "");
  function themeHref(id) { return base + "css/themes/" + id + ".css?v=" + VER; }

  /* ---------- ডিফল্ট স্টাইলশিট খোঁজা ---------- */
  function defaultSheets() {
    var out = [], ls = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < ls.length; i++) {
      var h = ls[i].getAttribute("href") || "";
      if (/(^|\/)(style|responsive)\.css(\?|$)/.test(h) && h.indexOf("/themes/") < 0) out.push(ls[i]);
    }
    return out;
  }

  function killDefaults() {
    defaultSheets().forEach(function (s) { s.disabled = true; });
  }

  if (theme !== "default") {
    var sheets = defaultSheets();
    var last = sheets.length ? sheets[sheets.length - 1] : null;

    // CSS লোড না হওয়া পর্যন্ত পেজ লুকিয়ে রাখি, যাতে মূল থিমের ঝলক না দেখা যায়
    html.style.visibility = "hidden";
    var shown = false;
    var show = function () { if (!shown) { shown = true; html.style.visibility = ""; } };
    setTimeout(show, 3000);

    var L = document.createElement("link");
    L.rel = "stylesheet";
    L.id = "tm-css";
    L.href = themeHref(theme);
    L.onload = function () { killDefaults(); show(); };
    L.onerror = function () { // থিম ফাইল না পেলে সাইট যেন ভেঙে না যায়
      html.setAttribute("data-theme", "default");
      show();
    };
    if (last && last.parentNode) last.parentNode.insertBefore(L, last.nextSibling);
    else document.head.appendChild(L);

    // বাংলা ফন্ট যদি পেজে না থাকে
    if (!document.querySelector('link[href*="Hind+Siliguri"]')) {
      var f = document.createElement("link");
      f.rel = "stylesheet";
      f.href = "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap";
      document.head.appendChild(f);
    }
    if (theme === "manga") {
      var jp = document.createElement("link");
      jp.rel = "stylesheet";
      jp.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@900&display=swap";
      document.head.appendChild(jp);
    }
  }

  /* ---------- থিম বদলানো ---------- */
  function setTheme(id) {
    if (!valid(id) || id === theme) return;
    try {
      localStorage.setItem(KEY, id);
      location.reload();
    } catch (e) {
      // localStorage বন্ধ থাকলে লিংকের প্যারামিটার দিয়ে চালাই
      var u = new URL(location.href);
      u.searchParams.set("theme", id);
      location.href = u.toString();
    }
  }

  /* ---------- DOM তৈরি হলে বাকি কাজ ---------- */
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  var bn = function (n) {
    return String(n).replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯"[d]; });
  };

  /* ===== সুইচার বোতাম ও প্যানেল ===== */
  var SWATCH = {
    "default": "background:linear-gradient(135deg,#f3f4f6 0 50%,#6b7280 50% 100%)",
    energy: "background:linear-gradient(90deg,#F42902 0 34%,#C8FF00 34% 67%,#111 67% 100%)",
    manga: "background:radial-gradient(#111 1.3px,transparent 1.8px) 0 0/6px 6px,#fff"
  };

  var CSS =
    "#tm-root,#tm-root *{box-sizing:border-box}" +
    "#tm-root{position:fixed;right:16px;bottom:78px;z-index:90;font:600 15px/1.4 'Hind Siliguri','Noto Sans Bengali',system-ui,sans-serif;color:#111;text-align:left}" +
    "#tm-btn{display:flex;align-items:center;gap:8px;margin:0;padding:8px 16px 8px 12px;border:2px solid #111;border-radius:99px;background:#fff;color:#111;font:inherit;cursor:pointer;box-shadow:3px 3px 0 #111;transition:transform .15s,box-shadow .15s}" +
    "#tm-btn:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 #111}" +
    "#tm-btn svg{width:20px;height:20px;flex:none}" +
    "#tm-root :focus-visible{outline:3px solid #2563eb;outline-offset:2px}" +
    "#tm-panel{position:absolute;right:0;bottom:calc(100% + 10px);width:min(310px,calc(100vw - 32px));margin:0;padding:12px;background:#fff;border:2px solid #111;border-radius:18px;box-shadow:5px 5px 0 #111;animation:tmin .18s ease-out}" +
    "#tm-panel[hidden]{display:none}" +
    "@keyframes tmin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}" +
    "#tm-root .tm-h{margin:0 4px 8px;font-size:14px;font-weight:600;color:#444}" +
    "#tm-root .tm-opt{display:flex;align-items:center;gap:12px;width:100%;margin:0 0 6px;padding:8px 10px;border:2px solid transparent;border-radius:12px;background:#f4f4f5;color:#111;font:inherit;text-align:left;cursor:pointer}" +
    "#tm-root .tm-opt:last-child{margin-bottom:0}" +
    "#tm-root .tm-opt:hover{background:#e8e8ec}" +
    "#tm-root .tm-opt[aria-pressed=true]{background:#fff;border-color:#111}" +
    "#tm-root .tm-sw{flex:none;width:44px;height:44px;border:2px solid #111;border-radius:12px}" +
    "#tm-root .tm-t{flex:1;min-width:0}" +
    "#tm-root .tm-t b{display:block;font-size:16px;font-weight:700}" +
    "#tm-root .tm-t small{display:block;font-size:13px;font-weight:500;color:#555}" +
    "#tm-root .tm-ck{flex:none;display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#111;color:#fff;font-size:13px;opacity:0}" +
    "#tm-root .tm-opt[aria-pressed=true] .tm-ck{opacity:1}" +
    "@media(prefers-reduced-motion:reduce){#tm-btn,#tm-panel{transition:none;animation:none}}" +
    "@media print{#tm-root{display:none}}";

  function buildSwitcher() {
    if (document.getElementById("tm-root")) return;
    var st = document.createElement("style");
    st.id = "tm-style";
    st.textContent = CSS;
    document.head.appendChild(st);

    var root = document.createElement("div");
    root.id = "tm-root";
    var opts = THEMES.map(function (t) {
      return '<button type="button" class="tm-opt" data-id="' + t.id + '" aria-pressed="' + (t.id === theme) + '">' +
        '<span class="tm-sw" style="' + SWATCH[t.id] + '"></span>' +
        '<span class="tm-t"><b>' + t.name + "</b><small>" + t.sub + "</small></span>" +
        '<span class="tm-ck" aria-hidden="true">✓</span></button>';
    }).join("");
    root.innerHTML =
      '<button type="button" id="tm-btn" aria-haspopup="true" aria-expanded="false" aria-controls="tm-panel" aria-label="থিম পরিবর্তন করুন">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-3.9-4-7.2-9-7.2z"/>' +
      '<circle cx="7.5" cy="11" r="1" fill="currentColor"/><circle cx="10.5" cy="7" r="1" fill="currentColor"/><circle cx="15" cy="7.5" r="1" fill="currentColor"/></svg>' +
      "<span>থিম</span></button>" +
      '<div id="tm-panel" role="group" aria-label="ওয়েবসাইটের থিম বেছে নিন" hidden>' +
      '<p class="tm-h">ওয়েবসাইটের থিম বেছে নিন</p>' + opts + "</div>";
    document.body.appendChild(root);

    var btn = root.querySelector("#tm-btn"), panel = root.querySelector("#tm-panel");
    function open(o) {
      panel.hidden = !o;
      btn.setAttribute("aria-expanded", o);
    }
    btn.addEventListener("click", function () { open(panel.hidden); });
    panel.addEventListener("click", function (e) {
      var b = e.target.closest(".tm-opt");
      if (!b) return;
      if (b.dataset.id === theme) open(false);
      else setTheme(b.dataset.id);
    });
    document.addEventListener("click", function (e) {
      if (!panel.hidden && !root.contains(e.target)) open(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) { open(false); btn.focus(); }
    });
  }

  /* ===== এনার্জি ও ম্যাঙ্গা: সাধারণ সাজ ===== */
  function commonExtras() {
    // স্ক্রল-প্রোগ্রেস বার
    var pb = document.createElement("div");
    pb.className = "pgbar";
    pb.setAttribute("aria-hidden", "true");
    document.body.insertBefore(pb, document.body.firstChild);
    addEventListener("scroll", function () {
      pb.style.transform = "scaleX(" + scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) + ")";
    }, { passive: true });
  }

  /* ===== হোম পেজের বাড়তি উপাদান (শুধু এনার্জি/ম্যাঙ্গায়) ===== */
  var SCR = '<svg class="scr" viewBox="0 0 130 60" aria-hidden="true"><path d="M6 8c30 40 78 46 112 20M100 12l20 17-26 10" fill="none" stroke="#C8FF00" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var BADGE = '<a class="badge" href="contact.html#form" aria-label="বিনামূল্যে পরামর্শ নিন"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="cp" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs><text><textPath href="#cp" textLength="268" lengthAdjust="spacing">বিনামূল্যে পরামর্শ নিন ✦ বিনামূল্যে পরামর্শ নিন ✦ </textPath></text></svg></a>';
  var MQ_TXT = "স্থাপত্য নকশা ✦ প্রকৌশল ✦ নির্মাণসামগ্রী ✦ ভবন নির্মাণ ✦ ইন্টেরিয়র ✦ চাবি হস্তান্তর ✦ ";
  var COPY = {
    energy: {
      kick: "নতুন প্রজন্মের নির্মাণ উদ্যোগ · নরসিংদী",
      g1: "১২ ধাপ", g2: "এক ঠিকানায়", secCls: "sec"
    },
    manga: {
      kick: "অধ্যায় ১ · নতুন প্রজন্মের নির্মাণযাত্রা",
      g1: "১২ ধাপ!", g2: "এক ঠিকানা!", secCls: "sec mf"
    }
  };

  function wrapMark(h1) {
    if (!h1 || h1.querySelector("mark")) return;
    var T = "স্বপ্নের বাড়ি", w = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      var i = n.nodeValue.indexOf(T);
      if (i < 0) continue;
      var r = n.splitText(i);
      r.splitText(T.length);
      var m = document.createElement("mark");
      r.parentNode.replaceChild(m, r);
      m.appendChild(r);
      return;
    }
  }

  function homeExtras() {
    var c = COPY[theme], hero = document.querySelector(".hero");
    if (!hero || document.querySelector(".mq")) return;

    var h1 = hero.querySelector("h1");
    var t = hero.querySelector(".hero-t") || (h1 && h1.parentNode);
    var fig = hero.querySelector(".hero-i") || hero.querySelector("figure");

    if (t && !hero.querySelector(".kick")) {
      t.classList.add("hero-t");
      var k = document.createElement("span");
      k.className = "kick";
      k.textContent = c.kick;
      t.insertBefore(k, t.firstChild);
    }
    wrapMark(h1);
    if (h1 && !hero.querySelector(".scr")) h1.insertAdjacentHTML("afterend", SCR);

    if (fig && !fig.querySelector(".gl")) {
      fig.classList.add("hero-i");
      fig.insertAdjacentHTML("beforeend",
        '<div class="gl g1"><b>' + c.g1 + "</b><span>জমি থেকে চাবি হস্তান্তর</span></div>" +
        '<div class="gl g2"><b>' + c.g2 + "</b><span>নকশা, নির্মাণ, ইন্টেরিয়র</span></div>");
    }
    (hero.querySelector(".wrap") || hero).insertAdjacentHTML("beforeend", BADGE);

    // মার্কি স্ট্রিপ + পরিসংখ্যান সেকশন
    var mq = '<div class="mq" aria-hidden="true"><div>' + new Array(5).join(MQ_TXT) + "</div></div>";
    var stats =
      '<section class="' + c.secCls + '"><div class="wrap">' +
      '<h2 class="mfh">নির্মাণ হবে <span class="chip c1">পরিকল্পিত</span> <span class="chip c2">স্বচ্ছ</span> আর <span class="chip c3">একসঙ্গে।</span></h2>' +
      '<p class="mfp">তরুণ উদ্যমে নরসিংদী থেকে নির্মাণ খাতকে আরও গুছানো ও আধুনিক করার পথে আমরা।</p>' +
      '<div class="stats">' +
      '<div class="stat rv"><b data-n="12">১২</b><span>ধাপে জমি থেকে চাবি হস্তান্তর</span></div>' +
      '<div class="stat rv"><b data-n="8">৮</b><span>সেবা বিভাগ, এক প্রতিষ্ঠানে</span></div>' +
      '<div class="stat rv"><b data-n="1">১</b><span>ঠিকানা, সব দায়িত্ব</span></div>' +
      "</div></div></section>";
    hero.insertAdjacentHTML("afterend", mq + stats);

    // এই নতুন উপাদানগুলোর জন্য রিভিল ও কাউন্ট-আপ অ্যানিমেশন
    var els = document.querySelectorAll(".stats .stat");
    var counts = document.querySelectorAll(".stats [data-n]");
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(els, function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); }
      });
    }, { threshold: 0.1 });
    Array.prototype.forEach.call(els, function (e, i) {
      e.style.transitionDelay = i * 70 + "ms";
      e.addEventListener("transitionend", function () { e.style.transitionDelay = ""; }, { once: true });
      io.observe(e);
    });
    if (rm) return;
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (!x.isIntersecting) return;
        co.unobserve(x.target);
        var el = x.target, to = +el.dataset.n, s = null;
        (function step(ts) {
          s = s || ts;
          var p = Math.min((ts - s) / 1100, 1);
          el.textContent = bn(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(counts, function (e) { co.observe(e); });
  }

  /* ===== ম্যাঙ্গা: অধ্যায় চিহ্ন ও ক্লিক SFX ===== */
  function mangaExtras() {
    var chn = { index: 1, about: 2, services: 3, "complete-construction": 4, materials: 5, projects: 6, interior: 7, contact: 8 };
    var pg = location.pathname.split("/").pop().replace(".html", "") || "index";
    var h1 = document.querySelector(".ph h1");
    if (h1 && chn[pg] && !document.querySelector(".chap")) {
      var s = document.createElement("span");
      s.className = "chap";
      s.textContent = "অধ্যায় " + bn(chn[pg]);
      h1.parentNode.insertBefore(s, h1);
    }
    if (rm) return;
    var sfw = ["ঠাস!", "ধুম!", "ঝট!", "ডিং!", "পপ!"];
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".btn,.card,.fb,.steps li,.chip,.why li")) return;
      var s = document.createElement("span");
      s.className = "sfx";
      s.textContent = sfw[Math.random() * sfw.length | 0];
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      s.style.setProperty("--r", (Math.random() * 30 - 15) + "deg");
      document.body.appendChild(s);
      setTimeout(function () { s.remove(); }, 700);
    });
  }

  ready(function () {
    if (theme !== "default") killDefaults();
    buildSwitcher();
    if (theme === "default") return;
    commonExtras();
    homeExtras();
    if (theme === "manga") mangaExtras();
  });
})();
