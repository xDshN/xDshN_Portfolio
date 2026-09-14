/* ============================================================
   Движение страницы: вступление и инерционная прокрутка.

   Прокрутка перехватывается только на десктопе с мышью — на тач-экранах
   родная инерция пальца лучше любой имитации.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ------------------------------------------------- вступление

     Сценарий:

       0.14  из центра прочерчивается линия во всю ширину
       0.62  линия расходится на две, между ними открывается полоса
       0.86  проявляется полоса: таймкод, надпись, tally
       0.70  «Эфир через» набирается по буквам
       1.45  загорается tally
       1.55  обратный отсчёт 00:03:00 -> 00:00:00
       4.55  проезжает стингер и вскрывает страницу
       ~5.0  под прикрытием тела снимается чёрный лист
       ~5.2  герой начинает каскад, плашка ещё уезжает

     Стингер собран из четырёх слоёв: лезвие впереди, светлая
     перламутровая плашка, два тонких хвоста с отставанием. Плашка
     светлая намеренно - тёмная на тёмном фоне не читалась вовсе, и
     проезд выглядел одной тонкой линией. По ходу она меняет наклон,
     как хлыст, а в момент прохода лезвия экран коротко вспыхивает.

     Момент снятия чёрного листа задан кадрами анимации, а не таймером:
     таймер под нагрузкой опаздывает, и склейка вылезала из-под плашки.
     ----------------------------------------------------------- */

  (function intro() {
    var veil = document.getElementById("intro");
    if (!veil) return;

    function ready() {
      document.documentElement.classList.add("is-ready");
      window.dispatchEvent(new Event("glass:intro"));
    }

    if (reduceMotion.matches || typeof Element.prototype.animate !== "function") {
      veil.remove();
      document.documentElement.classList.add("is-open");
      ready();
      return;
    }

    var sheet = veil.querySelector(".intro-sheet");
    var ruleTop = veil.querySelector(".intro-rule-top");
    var ruleBot = veil.querySelector(".intro-rule-bottom");
    var band = veil.querySelector(".intro-band");
    var word = veil.querySelector(".intro-word");
    var tcEl = veil.querySelector(".intro-clock");
    var tally = veil.querySelector(".intro-tally");
    var flash = veil.querySelector(".intro-flash");
    var body = veil.querySelector(".st-body");
    var blade = veil.querySelector(".st-blade");
    var tailA = veil.querySelector(".st-tail-a");
    var tailB = veil.querySelector(".st-tail-b");
    if (!sheet || !ruleTop || !band || !body) { veil.remove(); ready(); return; }

    var SOFT = "cubic-bezier(0.16, 1, 0.3, 1)";
    var SWEEP = "cubic-bezier(0.55, 0, 0.25, 1)";

    /* Порядок: полоса раскрывается, надпись набирается по буквам, и
       только когда она почти набрана, появляется таймкод; следом лампа,
       и лишь потом пошёл отсчёт. Момент появления таймкода считаем от
       длины надписи - поменяется текст, порядок не сломается. */
    var WORD_AT = 700;
    var LETTER_MS = 38;
    var LETTERS = word ? word.textContent.replace(/\s+/g, "").length : 0;
    var CLOCK_IN = WORD_AT + LETTERS * LETTER_MS + 260;
    var CLOCK_AT = CLOCK_IN + 760;
    var CLOCK_MS = 3000;
    var HOLD = 180;            // без паузы ноли на таймкоде закрывает тем же кадром
    var STING_AT = CLOCK_AT + CLOCK_MS + HOLD;
    var DUR = 1560;
    var COVER = 0.24;          // доля проезда, когда тело дошло до левого края
    var CUT = 0.18;            // доля проезда, когда снимается чёрный лист
    var OPEN = 0.40;           // доля проезда, когда хвост входит в кадр

    /* Ключи для разбора заставки: ?sting открывает сразу проезд, не
       дожидаясь отсчёта, ?slow=N растягивает всё в N раз. На боевой
       странице оба множителя единичные и ничего не меняют - они нужны,
       чтобы переход можно было рассмотреть покадрово. */
    var qs = new URLSearchParams(location.search);
    var SLOW = Math.min(8, Math.max(1, parseFloat(qs.get("slow")) || 1));
    var FROM = qs.has("sting") ? STING_AT - 300 : 0;
    function at(ms) { return Math.max(0, ms - FROM) * SLOW; }

    /* Страховка. Содержимое страницы скрыто до сигнала сценария, и
       любая ошибка внутри заставки оставила бы пустой экран навсегда.
       Этот таймер срабатывает заведомо позже штатного финала и просто
       открывает страницу, если её ещё не открыли. */
    setTimeout(function () {
      if (!document.documentElement.classList.contains("is-ready")) ready();
      document.documentElement.classList.add("is-open");
      if (veil.parentNode) veil.remove();
    }, 9000 * SLOW);

    function run(el, frames, dur, delay, ease) {
      return el.animate(frames, {
        duration: dur * SLOW, delay: at(delay), easing: ease || SOFT, fill: "both"
      });
    }

    /* Наклон постоянный, меняется только сдвиг. Переменный наклон
       выглядел эффектнее, но браузер интерполирует такие трансформации
       через разложение матрицы - сдвиг переставал быть линейным, и в
       момент смены слева оставалась незакрытая полоса. Предсказуемость
       перекрытия здесь важнее эффекта. */
    /* Срез тем сильнее уносит края плашки, чем выше экран по
       отношению к ширине. Угол подбираем так, чтобы этот занос не
       превышал полутора десятков процентов ширины: иначе на телефоне
       плашка перестаёт закрывать кадр в момент смены. */
    var SKEW = -Math.min(13, Math.atan(0.28 * innerWidth / innerHeight) * 180 / Math.PI);
    veil.style.setProperty("--st-skew", SKEW + "deg");
    var SHEAR = Math.abs(Math.tan(SKEW * Math.PI / 180)) * innerHeight / 2 / innerWidth * 100;

    /* Ключевые кадры плашки - от геометрии, а не на глаз.
         k0  глухая часть достаёт до правого края, хвост ещё за кадром
         k1  тело перекрыло левый край: кадр закрыт целиком
         k2  хвост входит в кадр, начинается вскрытие
         k3  хвост ушёл за правый край: кадр чистый
       Границу плотности и ширину плашки держим здесь же: они заданы
       градиентом в стилях, и расходиться им нельзя. */
    var PLATE = 340;           // ширина плашки, vw - должна совпадать с css
    var OPAQUE = 0.34 * PLATE; // где хвост добирает до полной плотности

    var K = [0, 0, 0, 0];
    K[1] = -(OPAQUE + SHEAR + 8);
    K[0] = Math.max(K[1] - 120, -(PLATE - 100 - SHEAR - 5));
    K[2] = SHEAR;
    K[3] = 100 + SHEAR + 12;

    /* Ключевые кадры проезда заданы не на глаз, а по геометрии плашки:
       к доле COVER её тело перекрывает левый край экрана, а глухая
       часть ещё достаёт до правого - кадр закрыт целиком; к доле OPEN
       в кадр входит прозрачный хвост и начинается вскрытие. Оставшиеся
       шестьдесят процентов времени хвост идёт по экрану - именно этот
       участок зритель и читает как переход, поэтому он самый длинный. */
    function sweep(el, k, dur, delay) {
      return run(el, [
        { transform: "skewX(" + SKEW + "deg) translateX(" + k[0] + "vw)", offset: 0, easing: "cubic-bezier(0.6, 0, 0.9, 0.5)" },
        { transform: "skewX(" + SKEW + "deg) translateX(" + k[1] + "vw)", offset: COVER, easing: "linear" },
        { transform: "skewX(" + SKEW + "deg) translateX(" + k[2] + "vw)", offset: OPEN, easing: "cubic-bezier(0.35, 0.32, 0.6, 1)" },
        { transform: "skewX(" + SKEW + "deg) translateX(" + k[3] + "vw)", offset: 1 }
      ], dur, delay, "linear");
    }

    /* 1-2. линия прочерчивается и расходится */
    [ruleTop, ruleBot].forEach(function (r) {
      run(r, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], 640, 140);
    });
    run(ruleTop, [{ translate: "0 0" }, { translate: "0 -54px" }], 680, 620);
    run(ruleBot, [{ translate: "0 0" }, { translate: "0 54px" }], 680, 620);

    /* 3. полоса раскрывается из линий. Кромки обрезки идут ровно за
       линиями: та же задержка, длительность и кривая, что у их
       расхождения, и тот же сдвиг 54px от центра. Поэтому таймкод не
       появляется сам по себе, а открывается между расходящимися
       линиями, как шторка. */
    run(band, [
      { opacity: 1, clipPath: "inset(50% -80px 50% -80px)" },
      { opacity: 1, clipPath: "inset(calc(50% - 54px) -80px calc(50% - 54px) -80px)" }
    ], 680, 620);
    if (tcEl) {
      run(tcEl, [
        { transform: "scaleY(0.2)", filter: "blur(6px)", opacity: 0 },
        { transform: "none", filter: "blur(0px)", opacity: 1 }
      ], 700, CLOCK_IN);
    }

    /* 4. буквы */
    if (word) try {
      var text = word.textContent;
      word.textContent = "";
      var step = 0;
      text.split(/(\s+)/).forEach(function (chunk) {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) { word.appendChild(document.createTextNode(chunk)); return; }
        var holder = document.createElement("span");
        holder.style.display = "inline-block";
        holder.style.whiteSpace = "pre";
        chunk.split("").forEach(function (ch) {
          var g = document.createElement("span");
          g.style.display = "inline-block";
          g.textContent = ch;
          holder.appendChild(g);
          run(g, [
            { opacity: 0, transform: "translateY(0.45em)" },
            { opacity: 1, transform: "none" }
          ], 520, WORD_AT + step * LETTER_MS);
          step++;
        });
        word.appendChild(holder);
      });
      /* Разбор мог не дойти до конца - тогда слово просто остаётся
         целым, но видимым. Пустой полосы быть не должно. */
      if (!word.childNodes.length) word.textContent = text;
    } catch (e) {
      word.textContent = "Эфир\u00a0через";
    }

    /* 5. tally */
    if (tally) {
      run(tally, [{ transform: "scale(0)" }, { transform: "scale(1)" }], 420, CLOCK_IN + 520,
        "cubic-bezier(0.2, 1.6, 0.35, 1)");
      tally.animate([
        { boxShadow: "0 0 0 0 rgba(255, 77, 77, 0.5)" },
        { boxShadow: "0 0 0 9px rgba(255, 77, 77, 0)" }
      ], { duration: 1400 * SLOW, delay: at(CLOCK_IN + 780), iterations: Infinity, easing: "ease-out" });
    }

    /* 6. обратный отсчёт. Считается по кадрам от общего времени
       документа: setInterval под нагрузкой опаздывает, и цифры
       заметно отставали от картинки. */
    if (tcEl) {
      var t0 = performance.now() + at(CLOCK_AT);
      var last = "";
      (function frame() {
        var left = CLOCK_MS - (performance.now() - t0) / SLOW;
        if (left < 0) left = 0;
        if (left > CLOCK_MS) left = CLOCK_MS;   // до старта отсчёта
        var txt =
          String(Math.floor(left / 60000)).padStart(2, "0") + ":" +
          String(Math.floor(left / 1000) % 60).padStart(2, "0") + ":" +
          String(Math.floor((left % 1000) / 40)).padStart(2, "0");
        if (txt !== last) { tcEl.textContent = txt; last = txt; }
        if (left > 0) requestAnimationFrame(frame);
      })();
    }

    /* 7. стингер. Лезвие идёт светом впереди белой кромки, хвосты
       отстают и проходят уже по вскрытой странице. Все четыре слоя
       считаны от одних и тех же кадров, чтобы не разъезжаться. */
    function offs(d, end) {
      return [K[0] + d, K[1] + d, K[2] + d, end === undefined ? K[3] + d : end];
    }

    sweep(body, K, DUR, STING_AT);
    if (blade) sweep(blade, offs(214), DUR, STING_AT - 40);
    if (tailA) sweep(tailA, offs(-26, K[3] + 32), DUR, STING_AT + 130);
    if (tailB) sweep(tailB, offs(-54, K[3] + 32), DUR, STING_AT + 230);

    /* короткая вспышка в момент прохода лезвия */
    if (flash) {
      run(flash, [
        { opacity: 0, offset: 0 },
        { opacity: 0.42, offset: 0.35 },
        { opacity: 0, offset: 1 }
      ], 420, STING_AT + 110, "ease-out");
    }

    /* Исчезновение - только вперёд по времени. С fill "both" эта
       анимация в фазе ожидания держала opacity: 1 и перебивала
       появление: полоса с таймкодом стояла на экране с первого кадра,
       ещё до того, как разошлись линии. */
    [ruleTop, ruleBot, band].forEach(function (el) {
      el.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 200 * SLOW, delay: at(STING_AT + 40), easing: SOFT, fill: "forwards"
      });
    });

    /* 8. чёрный лист снимается ровно в ту долю проезда, когда экран
       закрыт плашкой целиком, и с запасом до того, как тело подойдёт к
       краю: один пропущенный кадр не должен обнажить полосу. Момент
       задан кадром анимации, а не таймером - таймер под нагрузкой
       опаздывает, и склейка вылезала из-под плашки. */
    run(sheet, [
      { opacity: 1, offset: 0 },
      { opacity: 1, offset: CUT },
      { opacity: 0, offset: CUT + 0.001 },
      { opacity: 0, offset: 1 }
    ], DUR, STING_AT, "linear");

    /* Герой стартует там же. Дальше он собирается на глазах: сначала
       сквозь прозрачный хвост стингера, потом в чистом кадре. Собирать
       его заранее нельзя - тогда анимация старта не нужна вовсе, её
       просто никто не увидит. */
    setTimeout(ready, at(STING_AT + DUR * CUT));
    setTimeout(function () {
      veil.remove();
      document.documentElement.classList.add("is-open");
    }, at(STING_AT + DUR + 400));

    /* Сценарий идёт по своим часам и не ждёт загрузки. */
  })();

  /* --------------------------------------- инерционная прокрутка */

  (function smoothScroll() {
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reduceMotion.matches || window.innerWidth < 1000) return;

    var target = window.scrollY;
    var currentY = target;
    var raf = 0;
    var running = false;

    function maxScroll() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    function clamp(v) { return Math.min(maxScroll(), Math.max(0, v)); }

    function loop() {
      var diff = target - currentY;
      if (Math.abs(diff) < 0.4) {
        currentY = target;
        window.scrollTo(0, currentY);
        running = false;
        return;
      }
      currentY += diff * 0.11;
      window.scrollTo(0, currentY);
      raf = requestAnimationFrame(loop);
    }

    function kick() {
      if (!running) { running = true; raf = requestAnimationFrame(loop); }
    }

    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey) return;                       // масштабирование не трогаем
      if (e.target.closest("[data-native-scroll]")) return;
      e.preventDefault();
      target = clamp(target + e.deltaY);
      kick();
    }, { passive: false });

    // любой другой способ прокрутки должен переопределять цель,
    // иначе страница дёрнется обратно к старому значению
    function sync() {
      if (!running) { target = window.scrollY; currentY = target; }
    }
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", function () { target = clamp(target); });

    // якоря ведём той же инерцией
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href").slice(1);
      if (!id) return;
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.scrollY - 76;
      target = clamp(top);
      kick();
      history.replaceState(null, "", "#" + id);
    });

    // клавиатура: даём нативное поведение и подхватываем результат
    window.addEventListener("keydown", function (e) {
      if (["PageDown","PageUp","Home","End"," ","ArrowDown","ArrowUp"].indexOf(e.key) === -1) return;
      running = false;
      cancelAnimationFrame(raf);
      requestAnimationFrame(function () { target = window.scrollY; currentY = target; });
    });
  })();
})();
