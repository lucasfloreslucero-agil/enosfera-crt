/* Efectos del kit "Señal CRT": barras de señal en el hero, encabezado con blur,
   revelado palabra por palabra, isotipo que se dibuja con el scroll, revelado al entrar
   en pantalla y email para copiar. Sin librerías. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v) { return Math.min(1, Math.max(0, v)); };

  /* ---------- Hero: barras de señal con ondulación y ruido ---------- */
  var canvas = $('.hero-canvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    var W = canvas.width, H = canvas.height;
    // Barras con la paleta de Enosfera: Piedra, Torrontés, Tinta clara, Jarilla, Arcilla clara, Arcilla, Tinta.
    var bars = ['#E2DBCD', '#E9DA8C', '#A9C1E6', '#9CC48D', '#E9A98F', '#D0633F', '#33598F'];
    var running = false, raf = 0;

    var frame = function (t) {
      ctx.fillStyle = '#0B1524';
      ctx.fillRect(0, 0, W, H);
      var bw = W / bars.length;
      for (var y = 0; y < H; y += 2) {
        var wobble = Math.sin(y * 0.05 + t * 0.002) * 6 + (Math.random() < 0.02 ? (Math.random() - 0.5) * 30 : 0);
        for (var i = 0; i < bars.length; i++) {
          ctx.fillStyle = bars[i];
          ctx.fillRect(i * bw + wobble, y, bw + 1, 2);
        }
      }
      var img = ctx.getImageData(0, 0, W, H), d = img.data;
      for (var k = 0; k < d.length; k += 4) {
        var n = (Math.random() - 0.5) * 60;
        d[k] += n; d[k + 1] += n; d[k + 2] += n;
      }
      ctx.putImageData(img, 0, 0);
      if (running) raf = requestAnimationFrame(frame);
    };

    if (reduce || !('IntersectionObserver' in window)) {
      frame(0);
    } else {
      // Solo anima mientras el hero se ve.
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        if (visible && !running) { running = true; raf = requestAnimationFrame(frame); }
        else if (!visible && running) { running = false; cancelAnimationFrame(raf); }
      }).observe(canvas);
    }
  }

  /* ---------- Encabezado con blur al bajar ---------- */
  var header = $('.site-header');
  var updateHeader = function () { if (header) header.classList.toggle('scrolled', window.scrollY > 40); };

  /* ---------- Revelado palabra por palabra ---------- */
  var wordBlocks = $$('.reveal-words').map(function (el) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
            var s = document.createElement('span');
            s.className = 'w';
            s.textContent = w;
            frag.appendChild(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) {
          walk(n);
        }
      });
    };
    walk(el);
    return { el: el, words: $$('.w', el) };
  });
  var updateWords = function () {
    if (reduce) return;
    var vh = window.innerHeight;
    wordBlocks.forEach(function (b) {
      var r = b.el.getBoundingClientRect();
      var p = clamp((vh * 0.85 - r.top) / (vh * 0.5 + r.height * 0.5));
      var lit = p * b.words.length;
      b.words.forEach(function (w, i) {
        var k = clamp(lit - i);
        w.style.opacity = 0.12 + 0.88 * k;
        w.style.transform = 'translateY(' + (8 * (1 - k)) + 'px)';
      });
    });
  };

  /* ---------- Preventas: isotipo que se dibuja con el scroll ---------- */
  var pin = $('.pin');
  var updatePin = function () {};
  if (pin) {
    var draw = $('.draw', pin);
    var len = draw.getTotalLength();
    draw.style.strokeDasharray = len;
    draw.style.strokeDashoffset = len;
    var loop = $('.loop', pin);
    var steps = $$('.step', pin);
    var nodes = $$('.node', pin);
    var progress = $$('.pin-progress li', pin);
    var N = steps.length;
    updatePin = function () {
      var r = pin.getBoundingClientRect();
      var p = clamp(-r.top / (r.height - window.innerHeight));
      draw.style.strokeDashoffset = len * (1 - p);
      loop.style.setProperty('--seg', clamp(p * N - (N - 1)));
      var idx = Math.min(N - 1, Math.floor(p * N));
      steps.forEach(function (s, i) {
        s.classList.toggle('is-active', i === idx);
        s.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
      });
      nodes.forEach(function (n) { n.classList.toggle('on', p * N > +n.getAttribute('data-step') + 0.5); });
      progress.forEach(function (b, i) {
        b.style.setProperty('--fill', clamp(p * N - i));
        b.classList.toggle('current', i === idx);
      });
    };
  }

  /* ---------- Un solo manejador de scroll ---------- */
  var ticking = false;
  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateHeader(); updateWords(); updatePin();
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateHeader(); updateWords(); updatePin();

  /* ---------- Revelado al entrar en pantalla ---------- */
  var revealed = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Email para copiar ---------- */
  $$('[data-copy]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (!navigator.clipboard) return; // sin portapapeles, el link abre el mail
      e.preventDefault();
      var text = a.textContent;
      navigator.clipboard.writeText(a.getAttribute('data-copy')).then(function () {
        a.textContent = 'Copiado';
        setTimeout(function () { a.textContent = text; }, 1400);
      }, function () { window.location.href = a.href; });
    });
  });
})();
