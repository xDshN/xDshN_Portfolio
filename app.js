/* ============================================================
   Андрей Варнавский - интерактив статичной версии.
   Без зависимостей. Всё уважает prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* --------------------------------------------------------- данные */

  var graphicsCases = [
    {
      title: "Студент года",
      label: "Data-driven package",
      video: "assets/graphics/student-of-the-year.mp4",
      poster: "assets/graphics/student-of-the-year-poster.webp",
      duration: "01:37",
      description:
        "Графический пакет конкурсной программы: сольные номинации, пьедестал, финалисты и оперативное обновление участников из Google Sheets прямо во время эфира.",
      tags: ["GT Title Designer", "Google Sheets", "vMix"],
    },
    {
      title: "Мисс и мистер",
      label: "Show identity",
      video: "assets/graphics/miss-and-mister.mp4",
      poster: "assets/graphics/miss-and-mister-poster.webp",
      duration: "01:31",
      description:
        "Титры участников и партнёров, экранная айдентика шоу и логика переключения данных без ручной правки каждого кадра.",
      tags: ["Design", "Data Source", "Triggers"],
    },
    {
      title: "КВН",
      label: "Live results",
      video: "assets/graphics/kvn.mp4",
      poster: "assets/graphics/kvn-poster.webp",
      duration: "01:23",
      description:
        "Автоматизированная выдача победителей и мест: таблица управляет составом команд, фотографиями и итоговой композицией на экране.",
      tags: ["Results", "Sheets", "GT Titles"],
    },
    {
      title: "Интерактивная сетка",
      label: "State visualization",
      video: "assets/graphics/final-graphic.mp4",
      poster: "assets/graphics/final-graphic-poster.webp",
      duration: "01:15",
      description:
        "Система из шестнадцати статусов с визуальным подтверждением изменений - данные и графика обновляются синхронно во время события.",
      tags: ["16 states", "Automation", "Live data"],
    },
  ];

  var figures = [
    ["01", "Общая архитектура системы", "Единый контур управления мультимедийным содержимым актового зала."],
    ["02", "Рабочий проект vMix", "Сцены, источники и выходы, собранные под сценарий мероприятия."],
    ["03", "Схема сигнальных связей", "Как видео, звук и данные расходятся между подсистемами."],
    ["04", "Структура таблицы данных", "Google Sheets как источник изменяемых данных для титров."],
    ["05", "Привязка Data Source", "Связь колонок таблицы с полями титровального шаблона."],
    ["06", "Библиотека шаблонов", "Готовые графические заготовки под типовые сценарии."],
    ["07", "Сетка участников", "Автоматическая раскладка участников по данным из таблицы."],
    ["08", "Центральный проект vMix", "vMix как точка сборки изображения и экранного содержимого."],
    ["09", "Управление выходами", "Разделение программы для зала и для трансляции."],
    ["10", "Работа с API", "Внешние команды к vMix по HTTP-интерфейсу."],
    ["11", "Панель Companion", "Кнопки, страницы и назначенные макрокоманды."],
    ["12", "Связка X32 и Companion", "Аппаратные события пульта запускают подготовленные действия."],
    ["13", "MIDI-триггеры", "Настройка соответствия нот и команд системы."],
    ["14", "Маршрутизация пульта", "Матрица источников и шин Behringer X32."],
    ["15", "Раскладка кнопок", "Логика расположения команд под руку оператора."],
    ["16", "Музыкальный контур", "AIMP и подготовленные плейлисты мероприятия."],
    ["17", "Виртуальный MIDI-порт", "loopMIDI как мост между приложениями."],
    ["18", "Управление воспроизведением", "Запуск и остановка музыки без переключения окна."],
    ["19", "Сценарий AutoHotkey", "Скрипт удержания фокуса окна презентации."],
    ["20", "Листание презентации", "Left и Right приходят в нужное приложение независимо от фокуса."],
    ["21", "Работа с PDF", "Тот же контур управления для документов вместо слайдов."],
    ["22", "Проверка контура", "Прогон сценария до начала мероприятия."],
    ["23", "Программный выход", "Итоговая картинка на экран зала и в трансляцию."],
    ["24", "Система в работе", "Мероприятие, которое ведёт один оператор."],
  ].map(function (row, i) {
    return {
      number: row[0],
      title: row[1],
      text: row[2],
      src: "assets/diploma/figure-" + String(i + 1).padStart(2, "0") + ".webp",
    };
  });

  var stages = [
    {
      num: "01", node: "Архитектура", nodeSub: "Единый контур", cls: "node-overview", wire: "overview", id: "overview",
      title: "Один оператор. Несколько подсистем. Единый контур.",
      intro: "Проблема исходной схемы - постоянное переключение между видео, звуком, титрами, музыкой и презентациями. Решение не заменяет оператора, а собирает повторяющиеся действия и данные в предсказуемую систему.",
      points: [
        "vMix становится центральной точкой формирования изображения и экранного содержимого.",
        "Companion принимает аппаратные события и запускает подготовленные макрокоманды.",
        "Таблицы отделяют изменяемые данные от дизайна титров и обновляют их централизованно.",
      ],
      effect: "Меньше ручных переключений. Быстрее реакция. Ниже риск ошибки.",
      figures: [1, 2, 3],
    },
    {
      num: "02", node: "Google Sheets", nodeSub: "Контур данных", cls: "node-sheets", wire: "sheets", id: "sheets",
      title: "Данные живут отдельно от дизайна",
      intro: "Состав участников, результаты и подписи меняются в таблице. Титр забирает их сам - правка одного значения не требует открывать графический редактор посреди мероприятия.",
      points: [
        "Колонки таблицы напрямую соответствуют полям титровального шаблона.",
        "Библиотека заготовок покрывает типовые сценарии: номинации, результаты, представление гостя.",
        "Сетка участников раскладывается автоматически по количеству строк.",
      ],
      effect: "Правка данных занимает секунды и не трогает оформление.",
      figures: [4, 5, 6, 7],
    },
    {
      num: "03", node: "vMix", nodeSub: "Центр системы", cls: "node-vmix", wire: "vmix", id: "vmix",
      title: "vMix как точка сборки картинки",
      intro: "Видео, титры и экранное содержимое сходятся в одном проекте. Программа для зала и программа для трансляции формируются раздельно, но управляются из одного места.",
      points: [
        "Сцены и источники подготовлены под конкретный сценарий события.",
        "Выходы разведены: экран зала и трансляция получают разную картинку.",
        "HTTP-интерфейс принимает внешние команды от Companion и скриптов.",
      ],
      effect: "Одна точка управления вместо переключения между окнами.",
      figures: [8, 9, 10],
    },
    {
      num: "04", node: "X32 + Companion", nodeSub: "Аппаратное управление", cls: "node-midi", wire: "midi", id: "midi",
      title: "Физическая кнопка вместо поиска мышью",
      intro: "Оператор нажимает кнопку на панели, а не ищет нужный элемент в интерфейсе. Companion переводит аппаратное событие в подготовленную последовательность действий.",
      points: [
        "Страницы и кнопки Companion разложены под логику мероприятия.",
        "События пульта X32 запускают команды системы напрямую.",
        "MIDI-ноты сопоставлены конкретным действиям в контуре.",
      ],
      effect: "Реакция на событие занимает одно нажатие.",
      figures: [11, 12, 13, 14, 15],
    },
    {
      num: "05", node: "AIMP", nodeSub: "Музыкальный контур", cls: "node-audio", wire: "audio", id: "audio",
      title: "Музыка управляется, не отвлекая",
      intro: "Плейлист мероприятия готовится заранее, а запуск и остановка приходят по MIDI - без переключения на окно плеера в момент, когда идёт эфир.",
      points: [
        "Плейлисты собраны по блокам сценария.",
        "loopMIDI работает мостом между пультом и приложением.",
        "Воспроизведение управляется, пока фокус остаётся на основной задаче.",
      ],
      effect: "Звуковое сопровождение перестаёт требовать отдельного внимания.",
      figures: [16, 17, 18],
    },
    {
      num: "06", node: "AutoHotkey", nodeSub: "Презентации и PDF", cls: "node-present", wire: "present", id: "present",
      title: "Слайды листаются независимо от фокуса окна",
      intro: "Скрипт удерживает нужное окно активным и доставляет команды листания туда, куда надо, - даже когда оператор работает в другом приложении.",
      points: [
        "Сценарий AutoHotkey следит за фокусом окна презентации.",
        "Left и Right приходят в целевое приложение независимо от текущего окна.",
        "Тот же контур работает и для PDF, а не только для слайдов.",
      ],
      effect: "Презентация перестаёт быть отдельной ручной задачей.",
      figures: [19, 20, 21, 22],
    },
  ];

  /* ------------------------------------------------- мобильное меню */

  var toggle = document.getElementById("menu-toggle");
  var mobileNav = document.getElementById("mobile-navigation");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    mobileNav.classList.toggle("open", open);
  }

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false);
  });

  /* ----------------------------------------- клавиатура для вкладок */

  /**
   * Roving tabindex по WAI-ARIA APG: в таб-порядке только активная вкладка,
   * остальные достаются стрелками, Home и End.
   */
  function wireTabs(container, onSelect) {
    var tabs = Array.prototype.slice.call(container.querySelectorAll('[role="tab"]'));

    function activate(index, moveFocus) {
      var next = (index + tabs.length) % tabs.length;
      tabs.forEach(function (tab, i) {
        tab.setAttribute("aria-selected", String(i === next));
        tab.tabIndex = i === next ? 0 : -1;
      });
      if (moveFocus) tabs[next].focus();
      onSelect(next);
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        softUpdate(function () {
          activate(index, false);
        });
      });
      tab.addEventListener("keydown", function (event) {
        var map = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (map[event.key]) {
          event.preventDefault();
          activate(index + map[event.key], true);
        } else if (event.key === "Home") {
          event.preventDefault();
          activate(0, true);
        } else if (event.key === "End") {
          event.preventDefault();
          activate(tabs.length - 1, true);
        }
      });
    });

    activate(0, false);
  }

  /** Мягкая смена состояния там, где браузер это умеет. */
  function softUpdate(update) {
    if (
      typeof document.startViewTransition === "function" &&
      !reduceMotion.matches &&
      // на скрытой вкладке переход не покажут, а применение состояния отложат
      document.visibilityState === "visible"
    ) {
      var transition = document.startViewTransition(update);
      // Быстрое переключение прерывает предыдущий переход - это штатно.
      // Отказом отвечают все три промиса, и без catch каждый всплывает
      // необработанной ошибкой в консоли.
      if (transition) {
        var hush = function () {};
        if (transition.finished) transition.finished.catch(hush);
        if (transition.ready) transition.ready.catch(hush);
        if (transition.updateCallbackDone) transition.updateCallbackDone.catch(hush);
      }
    } else {
      update();
    }
  }

  /* --------------------------------------------- кейсы эфирной графики */

  var caseTabsBox = document.getElementById("case-tabs");
  var casePanel = document.getElementById("case-panel");
  var video = document.getElementById("case-video");
  var startBtn = document.getElementById("case-start");
  var startMeta = document.getElementById("case-start-meta");

  graphicsCases.forEach(function (item, index) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "case-tab";
    btn.setAttribute("role", "tab");
    btn.id = "case-tab-" + index;
    btn.setAttribute("aria-controls", "case-panel");
    btn.innerHTML =
      '<span class="case-tab-num">' + String(index + 1).padStart(2, "0") + "</span>" +
      '<span class="case-tab-body"><small>' + item.label + "</small><strong>" + item.title + "</strong></span>" +
      '<span class="case-tab-state"></span>';
    caseTabsBox.appendChild(btn);
  });

  function renderCase(index) {
    var item = graphicsCases[index];

    document.getElementById("case-index").textContent =
      "Выбранный кейс " + String(index + 1).padStart(2, "0");
    document.getElementById("case-title").textContent = item.title;
    document.getElementById("case-text").textContent = item.description;
    document.getElementById("case-duration").textContent = item.duration;
    startMeta.textContent = item.title + " · " + item.duration;

    var tagBox = document.getElementById("case-tags");
    tagBox.innerHTML = "";
    item.tags.forEach(function (tag) {
      var el = document.createElement("span");
      el.textContent = tag;
      tagBox.appendChild(el);
    });

    // смена кейса возвращает плеер к постеру: видео снова не весит ничего
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.poster = item.poster;
    video.controls = false;
    video.tabIndex = -1;
    video.setAttribute("aria-label", "Видеодемонстрация проекта «" + item.title + "»");
    startBtn.hidden = false;

    caseTabsBox.querySelectorAll(".case-tab").forEach(function (tab, i) {
      tab.querySelector(".case-tab-state").textContent = i === index ? "PGM" : "PVW";
    });
    casePanel.setAttribute("aria-labelledby", "case-tab-" + index);
  }

  startBtn.addEventListener("click", function () {
    var item = graphicsCases[currentCase];
    video.src = item.video;
    video.controls = true;
    video.tabIndex = 0;
    startBtn.hidden = true;
    video.focus({ preventScroll: true });
    var attempt = video.play();
    if (attempt && attempt.catch) attempt.catch(function () {});
  });

  var currentCase = 0;
  wireTabs(caseTabsBox, function (index) {
    currentCase = index;
    renderCase(index);
  });

  /* ------------------------------------------------- этапы диплома */

  var stageTabsBox = document.getElementById("stage-tabs");
  var stagePanel = document.getElementById("stage-panel");
  var mapOut = stageTabsBox.querySelector(".tract-out");

  stages.forEach(function (stage, index) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tract-node " + stage.cls;
    btn.setAttribute("role", "tab");
    btn.id = "stage-tab-" + index;
    btn.setAttribute("aria-controls", "stage-panel");
    btn.innerHTML =
      '<span class="tract-node-num">' + stage.num + "</span>" +
      "<small>" + stage.nodeSub + "</small>" +
      "<strong>" + stage.node + "</strong>" +
      '<i class="led" aria-hidden="true"></i>';
    stageTabsBox.insertBefore(btn, mapOut);
  });

  var dialog = document.getElementById("figure-dialog");
  var dialogImg = document.getElementById("figure-img");

  function openFigure(figure) {
    dialogImg.src = figure.src;
    dialogImg.alt = figure.title;
    document.getElementById("figure-num").textContent = figure.number;
    document.getElementById("figure-title").textContent = figure.title;
    document.getElementById("figure-text").textContent = figure.text;
    // showModal даёт ловушку фокуса, Escape и возврат фокуса без ручного кода
    if (typeof dialog.showModal === "function") dialog.showModal();
  }

  document.getElementById("figure-close").addEventListener("click", function () {
    dialog.close();
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

  // Русское склонение по числу: 1 иллюстрация, 3 иллюстрации, 5 иллюстраций.
  function plural(n, one, few, many) {
    var d = n % 10, dd = n % 100;
    if (d === 1 && dd !== 11) return one;
    if (d >= 2 && d <= 4 && (dd < 10 || dd >= 20)) return few;
    return many;
  }

  function renderStage(index) {
    var stage = stages[index];

    document.getElementById("stage-label").textContent = "Этап " + stage.num + " · " + stage.node;
    document.getElementById("stage-title").textContent = stage.title;
    document.getElementById("stage-intro").textContent = stage.intro;
    document.getElementById("stage-effect").textContent = stage.effect;

    var pointsBox = document.getElementById("stage-points");
    pointsBox.innerHTML = "";
    stage.points.forEach(function (point, i) {
      var wrap = document.createElement("div");
      wrap.className = "stage-point";
      wrap.innerHTML = "<b>" + String(i + 1).padStart(2, "0") + "</b><p></p>";
      wrap.querySelector("p").textContent = point;
      pointsBox.appendChild(wrap);
    });

    var countBox = document.getElementById("stage-shots-count");
    if (countBox) {
      var n = stage.figures.length;
      countBox.textContent = n + " " + plural(n, "иллюстрация", "иллюстрации", "иллюстраций");
    }

    var figuresBox = document.getElementById("stage-figures");
    figuresBox.innerHTML = "";
    stage.figures.forEach(function (n) {
      var figure = figures[n - 1];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "figure-btn";
      btn.innerHTML =
        '<img src="' + figure.src + '" alt="" width="1200" height="675" loading="lazy" decoding="async">' +
        '<span class="figure-cap"><b></b><small>Открыть ↗</small></span>';
      btn.querySelector("img").alt = figure.title;
      btn.querySelector("b").textContent = figure.title;
      btn.addEventListener("click", function () {
        openFigure(figure);
      });
      figuresBox.appendChild(btn);
    });

    stagePanel.setAttribute("aria-labelledby", "stage-tab-" + index);

    // поток по тракту: выбранная связь горит, соседние приглушаются
    var tract = document.getElementById("tract");
    if (tract) {
      tract.setAttribute("data-active", stage.id);
      // ветка выбранного узла выходит вперёд, остальные уходят в тень
      tract.querySelectorAll("[data-flow]").forEach(function (el) {
        var name = el.getAttribute("data-flow");
        el.classList.toggle("is-active", name === stage.wire);
        el.classList.toggle("is-dim", name !== stage.wire);
      });
    }
  }

  // Быстрый переключатель: те же этапы, но рядом с панелью.
  // Схема остаётся основным tablist, здесь - вспомогательная навигация.
  var switchBox = document.getElementById("stage-switch");
  var chips = [];
  if (switchBox) {
    stages.forEach(function (stage, index) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "stage-chip";
      chip.setAttribute("aria-current", index === 0 ? "true" : "false");
      chip.innerHTML = "<b>" + stage.num + "</b>" + stage.node;
      chip.addEventListener("click", function () {
        softUpdate(function () { selectStage(index, true); });
      });
      switchBox.insertBefore(chip, document.getElementById("stage-steps"));
      chips.push(chip);
    });
  }

  // единая точка выбора этапа: синхронизирует схему, чипы и панель
  function selectStage(index, fromChip) {
    var tabs = stageTabsBox.querySelectorAll('[role="tab"]');
    tabs.forEach(function (t, i) {
      t.setAttribute("aria-selected", String(i === index));
      t.tabIndex = i === index ? 0 : -1;
    });
    chips.forEach(function (c, i) { c.setAttribute("aria-current", String(i === index)); });
    renderStage(index);
    if (fromChip) {
      // фокус остаётся на чипе - прокрутка никуда не прыгает
      document.getElementById("stage-panel").setAttribute("aria-labelledby", "stage-tab-" + index);
    }
  }

  wireTabs(stageTabsBox, function (index) {
    chips.forEach(function (c, i) { c.setAttribute("aria-current", String(i === index)); });
    renderStage(index);
  });

  /* ------------------------------------- появление секций (фолбэк) */

  if (!CSS.supports("animation-timeline: view()") && !reduceMotion.matches) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.animate(
            [
              { opacity: 0, transform: "translateY(28px)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 520, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" },
          );
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      revealObserver.observe(el);
    });
  }





  /* ------------------------------------ активный раздел в меню */

  (function scrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".topbar nav a"));
    if (!links.length) return;

    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) map[id] = { link: a, section: section };
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        if (!map[id]) return;
        map[id].visible = entry.intersectionRatio;
      });

      // подсвечиваем раздел, которого сейчас видно больше всего
      var best = null;
      Object.keys(map).forEach(function (id) {
        if (!best || (map[id].visible || 0) > (map[best].visible || 0)) best = id;
      });
      links.forEach(function (a) {
        a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + best));
      });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-80px 0px -40% 0px" });

    Object.keys(map).forEach(function (id) { io.observe(map[id].section); });
  })();

  /* --------------------------------------- наклон под курсором */

  (function tilt() {
    if (reduceMotion.matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    /* Только компетенции. У карточек проектов наклон перезапускал переход
       transform на каждом движении мыши и дёргал сетку. */
    document.querySelectorAll(".contour").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        if (e.pointerType === "touch") return;
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--tilt-y", (px * 5).toFixed(2) + "deg");
        card.style.setProperty("--tilt-x", (-py * 5).toFixed(2) + "deg");
      }, { passive: true });

      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  })();

  /* ------------------------------------------ фильтр проектов */

  (function projectFilter() {
    var box = document.getElementById("project-filter");
    var grid = document.getElementById("multiview");
    if (!box || !grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".project-card"));
    var archive = grid.querySelector(".archive-tile");

    // Категории заданы на карточках: по типу из подписи получалось
    // семь групп по одному проекту, и фильтр не имел смысла.
    var types = [];
    cards.forEach(function (c) {
      var t = c.dataset.group;
      if (t && types.indexOf(t) === -1) types.push(t);
    });

    function makeChip(label, value, count) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "filter-chip";
      b.setAttribute("aria-pressed", String(value === "all"));
      b.dataset.value = value;
      b.innerHTML = label + "<b>" + count + "</b>";
      box.appendChild(b);
      return b;
    }

    var chipsF = [makeChip("Все", "all", cards.length)];
    types.forEach(function (t) {
      var n = cards.filter(function (c) { return c.dataset.group === t; }).length;
      chipsF.push(makeChip(t, t, n));
    });

    box.addEventListener("click", function (e) {
      var chip = e.target.closest(".filter-chip");
      if (!chip) return;
      var value = chip.dataset.value;

      softUpdate(function () {
        chipsF.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        cards.forEach(function (c) {
          c.hidden = value !== "all" && c.dataset.group !== value;
        });
        // плитка архива уместна только в полном списке
        if (archive) archive.hidden = value !== "all";
      });
    });
  })();

  /* ------------------------------------- подсветка под курсором */

  (function spotlight() {
    if (reduceMotion.matches) return;
    var sel = ".card, .contour, .project-card, .stage-point, .archive-tile, .case-copy, .stage-panel";

    document.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var el = e.target.closest ? e.target.closest(sel) : null;
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty("--sx", (e.clientX - r.left) + "px");
      el.style.setProperty("--sy", (e.clientY - r.top) + "px");
    }, { passive: true });
  })();

  /* ------------------------------------------ клавиши-этапы */

  (function shortcuts() {
    var thesis = document.getElementById("thesis");

    // Доля площади здесь не годится: раздел выше нескольких экранов,
    // и порог по площади не достигается никогда. Считаем простое пересечение.
    function inView() {
      if (!thesis) return false;
      var r = thesis.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    }

    function go(delta) {
      var current = chips.findIndex(function (c) { return c.getAttribute("aria-current") === "true"; });
      if (current < 0) current = 0;
      var next = (current + delta + stages.length) % stages.length;
      softUpdate(function () { selectStage(next, false); });
    }

    var prev = document.getElementById("stage-prev");
    var next = document.getElementById("stage-next");
    if (prev) prev.addEventListener("click", function () { go(-1); });
    if (next) next.addEventListener("click", function () { go(1); });

    document.addEventListener("keydown", function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;

      // цифры работают с любого места страницы
      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= stages.length) {
        e.preventDefault();
        softUpdate(function () { selectStage(n - 1, false); });
        return;
      }

      // стрелки перехватываем, только пока раздел диплома на экране,
      // и не тогда, когда фокус уже внутри схемы - там свой roving tabindex
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (!inView()) return;
      if (stageTabsBox.contains(document.activeElement)) return;

      e.preventDefault();
      go(e.key === "ArrowRight" ? 1 : -1);
    });
  })();

  /* ------------------------------------------ приборные детали */

  // Таймкод аппаратной: часы:минуты:секунды:кадры при 25 fps.
  (function timecode() {
    var el = document.getElementById("timecode");
    if (!el) return;
    var timer = 0;

    function pad(n) { return String(n).padStart(2, "0"); }

    function tick() {
      var d = new Date();
      var frames = Math.floor(d.getMilliseconds() / 40); // 1000 / 25
      el.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" +
                       pad(d.getSeconds()) + ":" + pad(frames);
    }

    function start() { if (!timer) { tick(); timer = setInterval(tick, 40); } }
    function stop() { clearInterval(timer); timer = 0; }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
    start();
  })();

  // Счётчики: цифра набегает, когда карточка появилась на экране.
  (function counters() {
    var nodes = document.querySelectorAll("[data-count]");
    if (!nodes.length) return;

    if (reduceMotion.matches) return;   // при отключённом движении цифра сразу конечная

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);

        var to = parseInt(el.getAttribute("data-count"), 10);
        var from = parseInt(el.getAttribute("data-from") || "0", 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1100, t0 = performance.now();

        (function step(now) {
          var p = Math.min(1, (now - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(from + (to - from) * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.5 });

    nodes.forEach(function (n) { io.observe(n); });
  })();

  /* Магнитные кнопки.

     Притяжение считается от курсора в любой точке экрана, а не только
     когда он уже над кнопкой: радиус захвата шире самой кнопки, и сила
     нарастает по мере приближения. Раньше смещение включалось на кромке
     и потому прыгало сразу на максимум, а на выходе так же мгновенно
     падало в ноль - отсюда и рваность.

     Смещение доводится покадрово, а центр кнопки берётся без учёта уже
     наложенного сдвига, иначе кнопка гонится за собственным движением. */
  (function magnetic() {
    if (reduceMotion.matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var items = [].map.call(document.querySelectorAll(".btn"), function (el) {
      return { el: el, r: null, tx: 0, ty: 0, x: 0, y: 0 };
    });
    if (!items.length) return;

    var raf = 0, stale = true;

    function invalidate() { stale = true; }
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });

    function aim(e) {
      if (stale) {
        for (var j = 0; j < items.length; j++) items[j].r = items[j].el.getBoundingClientRect();
        stale = false;
      }
      for (var i = 0; i < items.length; i++) {
        var it = items[i], r = it.r;
        if (!r || !r.width || r.bottom < -120 || r.top > window.innerHeight + 120) {
          it.tx = it.ty = 0;
          continue;
        }
        var dx = e.clientX - (r.left + r.width / 2 - it.x);
        var dy = e.clientY - (r.top + r.height / 2 - it.y);
        var reach = Math.max(r.width, r.height) * 0.9 + 48;
        var k = 1 - Math.min(Math.sqrt(dx * dx + dy * dy) / reach, 1);
        k *= k;                                  // мягкий вход в зону
        it.tx = dx * 0.22 * k;
        it.ty = dy * 0.28 * k;
      }
      if (!raf) raf = requestAnimationFrame(loop);
    }

    function loop() {
      var moving = false;
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        it.x += (it.tx - it.x) * 0.18;
        it.y += (it.ty - it.y) * 0.18;
        if (Math.abs(it.tx - it.x) > 0.05 || Math.abs(it.ty - it.y) > 0.05) moving = true;
        else { it.x = it.tx; it.y = it.ty; }
        it.el.style.setProperty("--mx", it.x.toFixed(2) + "px");
        it.el.style.setProperty("--my", it.y.toFixed(2) + "px");
      }
      raf = moving ? requestAnimationFrame(loop) : 0;
    }

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      aim(e);
    }, { passive: true });
  })();



  /* ------------------------------------------- каскад появления

     Секция выходит по элементам, и у каждого свой характер движения:
     заголовок набирается по буквам, картинки разворачиваются, текст
     влетает с краю, мелочь выщёлкивается.

     Секция делится на узлы. Узел - это то, что появляется целиком:
     шапка блока, отдельная карточка. У каждого свой триггер, поэтому
     в высоких секциях нижние карточки не отыгрывают заранее, пока их
     ещё не видно.

     Анимации создаются при загрузке и стоят на паузе на нулевом кадре:
     элемент держит начальное состояние самой анимацией, а не стилями.
     Поэтому нет ни вспышки на входе, ни зависимости от пересчёта
     классов. Запуск идёт покадрово - событие прокрутки может не прийти,
     кадр приходит всегда.
     ------------------------------------------------------------- */
  var SOFT = "cubic-bezier(0.16, 1, 0.3, 1)";

  var KIND = {
    fade: {
      dur: 1500, ease: SOFT,
      frames: [{ opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)" }]
    },
    flyLeft: {
      dur: 1650, ease: SOFT,
      frames: [{ opacity: 0, transform: "translateX(-64px)" }, { opacity: 1, transform: "none" }]
    },
    flyRight: {
      dur: 1650, ease: SOFT,
      frames: [{ opacity: 0, transform: "translateX(64px)" }, { opacity: 1, transform: "none" }]
    },
    rise: {
      dur: 1700, ease: SOFT,
      frames: [{ opacity: 0, transform: "translateY(54px)" }, { opacity: 1, transform: "none" }]
    },
    expand: {
      dur: 2000, ease: SOFT,
      frames: [
        { opacity: 0, transform: "scale(0.84)", clipPath: "inset(16% 14% 16% 14% round 20px)" },
        { opacity: 1, transform: "none", clipPath: "inset(0% 0% 0% 0% round 20px)" }
      ]
    },
    pop: {
      dur: 1000, ease: "cubic-bezier(0.2, 1.6, 0.35, 1)",
      frames: [{ opacity: 0, transform: "scale(0.45)" }, { opacity: 1, transform: "scale(1)" }]
    },
    /* полоса-акцент прочерчивается сверху вниз */
    bar: {
      dur: 1100, ease: SOFT, origin: "top",
      frames: [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }]
    },
    /* строка раскрывается слева направо, как титр */
    wipe: {
      dur: 1300, ease: SOFT,
      frames: [
        { opacity: 0, clipPath: "inset(0 100% 0 0)" },
        { opacity: 1, clipPath: "inset(0 0% 0 0)" }
      ]
    },
    letter: {
      dur: 780, ease: SOFT,
      frames: [{ opacity: 0, transform: "translateY(0.5em)" }, { opacity: 1, transform: "none" }]
    },
    /* линия схемы прочерчивается: пунктир длиной во всю линию
       сдвигается в ноль, и путь будто рисуется от начала к концу */
    draw: { dur: 1700, ease: SOFT }
  };

  var STEP = 200;       // мс между соседними элементами узла
  var LETTER = 42;      // мс между буквами заголовка

  var CASCADE = {
    /* Герой выходит сразу после заставки: шторки ещё доезжают, а он уже
       начинает собираться. Поэтому каскад ждёт is-ready. */
    top: [
      {
        root: ".hero-inner", step: 130, rows: [
          /* Портрет первым и без задержки: он держит кадр, и именно он
             должен встретить зрителя, когда стингер вскрывает страницу. */
          [".hero-badge", "wipe"],
          [".hero-visual", "expand"],
          ["h1", "type"],
          [".hero-lead", "fade"],
          [".hero-actions .btn", "pop"],
          [".hero-chip", "pop"],
          [".hero-socials a", "pop"],
          [".stat-card", "rise"]
        ]
      }
    ],
    profile: [
      {
        root: null, rows: [
          [".section-head h2", "type"],
          [".section-head .lead", "fade"],
          [".profile-visual", "expand"],
          [".profile-copy > p:nth-of-type(1)", "flyLeft"],
          [".profile-copy > p:nth-of-type(2)", "flyLeft"],
          [".profile-fact", "flyRight"],
          [".profile-signals span", "pop"]
        ]
      }
    ],
    contours: [
      {
        root: ".section-head", rows: [
          [".section-index", "wipe"],
          ["h2", "type"],
          [".lead", "fade"]
        ]
      },
      {
        root: ".contour", each: true, step: 170, rows: [
          [".contour-accent", "bar"],
          [".contour-media, .level-meter", "expand"],
          [".contour-num", "pop"],
          ["h3", "flyLeft"],
          [".contour-meta", "wipe"],
          ["p:not(.contour-meta)", "rise"]
        ]
      }
    ],
    graphics: [
      {
        root: ".section-head", rows: [
          ["h2", "type"],
          [".lead", "fade"]
        ]
      },
      {
        root: ".studio-player", rows: [
          [".case-player", "expand"],
          [".case-player-bar", "wipe"]
        ]
      },
      /* Вкладки кейсов строит скрипт выше по файлу, к этому моменту
         они уже в разметке. А вот теги внутри панели пересобираются
         при каждом переключении кейса, поэтому анимируется их ряд
         целиком, а не отдельные метки. */
      {
        root: ".case-tabs", step: 150, rows: [
          [".case-tab", "flyLeft"]
        ]
      },
      {
        root: ".case-copy", rows: [
          ["#case-index", "wipe"],
          ["#case-title", "flyRight"],
          ["#case-text", "rise"],
          [".tag-row", "fade"]
        ]
      }
    ],
    /* Панель этапа перестраивается скриптом при каждом переключении:
       тезисы и кадры создаются заново. Поэтому анимируются их
       контейнеры целиком - иначе анимации отвалились бы после первого
       же клика по этапу. Чипы навигации и узлы схемы строятся один
       раз, их можно брать поштучно. */
    thesis: [
      {
        root: ".section-head", rows: [
          ["h2", "type"]
        ]
      },
      {
        root: ".thesis-quote", rows: [
          ["&", "wipe"]
        ]
      },
      {
        root: ".tract-toolbar", rows: [
          ["span", "wipe"],
          ["p", "fade"]
        ]
      },
      {
        root: ".tract", step: 130, rows: [
          [".connector-lines path", "draw"],
          [".tract-node", "pop"],
          [".tract-out", "rise"]
        ]
      },
      {
        root: ".stage-nav", step: 140, rows: [
          [".stage-switch-label", "wipe"],
          [".stage-chip", "flyLeft"]
        ]
      },
      {
        root: ".stage-body", rows: [
          ["#stage-label", "wipe"],
          ["h3", "flyRight"],
          ["#stage-intro", "fade"],
          [".stage-points", "rise"],
          [".stage-effect", "pop"]
        ]
      },
      {
        root: ".stage-shots", rows: [
          [".stage-shots-head", "wipe"],
          [".figure-grid", "expand"]
        ]
      }
    ],
    projects: [
      {
        root: ".section-head", rows: [
          [".section-index", "wipe"],
          ["h2", "type"],
          [".lead", "fade"]
        ]
      },
      {
        root: ".project-filter", step: 120, rows: [
          ["button", "pop"]
        ]
      },
      /* Каждая карточка - свой узел: сетка длинная, и нижние ряды
         не должны отыгрывать, пока их не видно. */
      {
        root: ".project-card", each: true, step: 130, rows: [
          ["figure", "expand"],
          [".project-src", "pop"],
          [".project-info > span", "pop"],
          [".project-info p", "wipe"],
          [".project-info h3", "flyLeft"],
          [".project-info small", "fade"]
        ]
      },
      {
        root: ".archive-tile", each: true, step: 140, rows: [
          ["&", "rise"]
        ]
      }
    ],
    path: [
      {
        root: ".section-head", rows: [
          ["h2", "type"]
        ]
      },
      {
        root: ".tl-item", each: true, step: 150, rows: [
          [".tl-dot", "pop"],
          [".tl-year", "wipe"],
          ["h3", "flyLeft"],
          ["p:not(.tl-year)", "rise"]
        ]
      }
    ],
    contact: [
      {
        root: ".contact-card > div:first-child", step: 180, rows: [
          [".label", "wipe"],
          ["h2", "type"],
          ["p", "fade"],
          [".contact-actions .btn", "pop"]
        ]
      },
      {
        root: ".contact-list", step: 150, rows: [
          [".contact-row", "flyRight"]
        ]
      }
    ]
  };

  (function cascade() {
    var sections = [].slice.call(document.querySelectorAll("[data-cascade]"));
    if (!sections.length || typeof Element.prototype.animate !== "function") return;
    if (reduceMotion.matches) return;

    /* Заголовок разбирается на слова, слова - на буквы. Слово остаётся
       единым inline-block, поэтому перенос строк не ломается.

       Разбираем не textContent, а каждый текстовый узел по отдельности:
       раньше содержимое заголовка стиралось целиком, и вместе с ним
       пропадали <br> и <em>. Заголовок героя схлопывался в одну строку,
       а градиент на второй строке терялся. */
    function toLetters(el) {
      if (el.__letters) return el.__letters;

      var texts = [];
      (function walk(node) {
        for (var n = node.firstChild; n; n = n.nextSibling) {
          if (n.nodeType === 3) texts.push(n);
          else if (n.nodeType === 1) walk(n);
        }
      })(el);

      var out = [];
      texts.forEach(function (node) {
        var text = node.nodeValue;
        if (!text || !text.trim()) return;   // отступы разметки не трогаем
        var frag = document.createDocumentFragment();
        text.split(/([ \t\n\r\f]+)/).forEach(function (chunk) {
          if (!chunk) return;
          if (/^[ \t\n\r\f]+$/.test(chunk)) { frag.appendChild(document.createTextNode(chunk)); return; }
          var word = document.createElement("span");
          word.style.display = "inline-block";
          word.style.whiteSpace = "pre";
          chunk.split("").forEach(function (ch) {
            var g = document.createElement("span");
            g.style.display = "inline-block";
            g.textContent = ch;
            word.appendChild(g);
            out.push(g);
          });
          frag.appendChild(word);
        });
        node.parentNode.replaceChild(frag, node);
      });

      el.__letters = out;
      return out;
    }

    function build(scope, rows, step) {
      var anims = [];
      var delay = 0;
      rows.forEach(function (row) {
        var kind = row[1];
        // "&" - сам узел, а не что-то внутри него
        var targets = row[0] === "&"
          ? [scope]
          : [].slice.call(scope.querySelectorAll(row[0]));
        targets.forEach(function (el) {
          if (kind === "draw") {
            var len = 0;
            try { len = el.getTotalLength(); } catch (e) { len = 0; }
            if (!len) return;
            el.style.strokeDasharray = String(len);
            anims.push(el.animate(
              [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
              { duration: KIND.draw.dur, delay: delay, easing: KIND.draw.ease, fill: "both" }
            ));
            delay += step;
            return;
          }
          if (kind === "type") {
            var letters = toLetters(el);
            letters.forEach(function (g, i) {
              anims.push(g.animate(KIND.letter.frames, {
                duration: KIND.letter.dur, delay: delay + i * LETTER,
                easing: KIND.letter.ease, fill: "both"
              }));
            });
            delay += letters.length * LETTER + 200;
            return;
          }
          var k = KIND[kind] || KIND.fade;
          if (k.origin) el.style.transformOrigin = k.origin;
          anims.push(el.animate(k.frames, {
            duration: k.dur, delay: delay, easing: k.ease, fill: "both"
          }));
          delay += step;
        });
      });
      return anims;
    }

    var units = [];
    sections.forEach(function (sec) {
      var plan = CASCADE[sec.id];
      if (!plan) return;
      plan.forEach(function (part) {
        var step = part.step || STEP;
        var roots = part.root ? [].slice.call(sec.querySelectorAll(part.root)) : [sec];
        if (part.root && !part.each) roots = roots.slice(0, 1);
        roots.forEach(function (root) {
          var anims = build(root, part.rows, step);
          if (anims.length) units.push({ el: root, anims: anims, playing: false });
        });
      });
    });
    if (!units.length) return;

    units.forEach(function (u) {
      u.anims.forEach(function (a) { a.pause(); a.currentTime = 0; });
    });
    document.documentElement.classList.add("cascade-on");

    function play(u) {
      if (u.playing) return;
      u.playing = true;
      u.anims.forEach(function (a) { a.play(); });
    }

    function rewind(u) {
      if (!u.playing) return;
      u.playing = false;
      u.anims.forEach(function (a) { a.pause(); a.currentTime = 0; });
    }

    /* Проверка по геометрии: IntersectionObserver в этом проекте уже
       подводил на секциях выше экрана. Чтение прямоугольника за кадр
       стоит копейки. */
    /* Облака размывают фон, и это дорого: подложка живая, значит
       пересчёт идёт каждый кадр. Держим включённым только то облако,
       чья секция рядом с экраном, - вместо семи разом. */
    var clouds = [].slice.call(document.querySelectorAll(".has-cloud"));

    function update() {
      /* Пока играет заставка, каскад не начинается: иначе герой успел бы
         собраться за шторкой и открылся бы уже готовым. */
      if (!document.documentElement.classList.contains("is-ready")) return;

      var vh = window.innerHeight;
      for (var i = 0; i < units.length; i++) {
        var r = units[i].el.getBoundingClientRect();
        if (r.top < vh * 0.85 && r.bottom > vh * 0.10) play(units[i]);
        else if (r.top > vh || r.bottom < 0) rewind(units[i]);
      }
      for (var j = 0; j < clouds.length; j++) {
        var c = clouds[j].getBoundingClientRect();
        var near = c.top < vh * 1.25 && c.bottom > -vh * 0.25;
        clouds[j].classList.toggle("cloud-live", near);
      }
    }

    function loop() { update(); requestAnimationFrame(loop); }
    requestAnimationFrame(loop);
    window.addEventListener("scroll", update, { passive: true });
    update();

    window.__cascade = { units: units, update: update };
  })();

  /* ------------------------------------------- иконки уходят к форме

     Логотипы из бегущей строки отрываются от неё и уходят на орбиту
     вокруг формы, а при обратной прокрутке возвращаются на место.

     Всё считается как чистая функция от позиции прокрутки: нет ни
     одного состояния, которое могло бы рассинхронизироваться, поэтому
     движение назад разбирается само собой. Единственное, что
     запоминается, - положения иконок в момент отрыва; они снимаются
     заново каждый раз, когда прогресс возвращается в ноль.

     Работа идёт на клонах: сама строка остаётся нетронутой и просто
     гаснет, поэтому ни разметка, ни её собственная анимация не ломаются.
     ------------------------------------------------------------- */
  (function iconsToForm() {
    if (reduceMotion.matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var ticker = document.querySelector(".ticker");
    var group = ticker && ticker.querySelector(".ticker-group");
    if (!group) return;

    var sources = [].slice.call(group.querySelectorAll(".ticker-item img"));
    if (!sources.length) return;

    var layer = document.createElement("div");
    layer.className = "icon-orbit";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    var items = sources.map(function (img, i) {
      var el = document.createElement("img");
      el.src = img.currentSrc || img.src;
      el.alt = "";
      el.decoding = "async";
      layer.appendChild(el);
      return {
        el: el, src: img,
        xDoc: 0, yDoc: 0, size: 22,
        phase: (i / sources.length) * Math.PI * 2,
        wob: 0.78 + ((i * 37) % 45) / 100
      };
    });

    /* На орбите иконки должны читаться, а не быть точками: в строке
       они 22 px, здесь вырастают примерно до 42: заметно, но не лезет
       на первый план. */
    var SIZE_UP = 1.9;

    var captured = false;
    var active = false;

    function capture() {
      for (var i = 0; i < items.length; i++) {
        var r = items[i].src.getBoundingClientRect();
        if (!r.width) return false;
        items[i].xDoc = r.left + r.width / 2;
        items[i].yDoc = r.top + r.height / 2 + window.scrollY;
        items[i].size = r.width;
      }
      return true;
    }

    /* Отрыв начинается, пока строка ещё на виду - иначе не видно,
       откуда иконки взялись, - и завершается через экран прокрутки. */
    function progress() {
      var r = ticker.getBoundingClientRect();
      var start = window.innerHeight * 0.42;
      var span = window.innerHeight * 0.90;
      return Math.min(1, Math.max(0, (start - r.top) / span));
    }

    function frame(now) {
      requestAnimationFrame(frame);
      var p = progress();

      if (p <= 0.001) {
        if (active) {
          layer.style.opacity = "0";
          layer.style.visibility = "hidden";
          ticker.classList.remove("is-lifted");
          for (var j = 0; j < items.length; j++) items[j].src.style.opacity = "";
          active = false;
          captured = false;
        }
        return;
      }

      if (!captured) { captured = capture(); if (!captured) return; }
      if (!active) {
        layer.style.visibility = "visible";
        ticker.classList.add("is-lifted");
        active = true;
      }
      layer.style.opacity = "1";

      var pose = window.__formPose && window.__formPose.ribbon;
      var t = now * 0.001;
      var cx = pose && pose.o > 0.05 ? pose.x * window.innerWidth : window.innerWidth * 0.78;
      var cy = pose && pose.o > 0.05 ? (1 - pose.y) * window.innerHeight : window.innerHeight * 0.5;
      var R = (pose && pose.s ? pose.s : 0.9) * window.innerHeight * 0.42;

      for (var i = 0; i < items.length; i++) {
        var it = items[i];

        /* Разброс отрыва: иконки уходят одна за другой, а не разом.
           Так видно само движение, а не мгновенную смену состояния. */
        var lag = (i / items.length) * 0.34;
        var pi = Math.min(1, Math.max(0, (p - lag) / (1 - 0.34)));
        var e = pi * pi * (3 - 2 * pi);

        var x0 = it.xDoc;
        var y0 = it.yDoc - window.scrollY;
        var a = it.phase + t * 0.16;
        var x1 = cx + Math.cos(a) * R * it.wob;
        var y1 = cy + Math.sin(a) * R * 0.72 * it.wob;

        /* Дуга вместо прямой: на подъёме иконку сносит вбок, поэтому
           путь читается как полёт, а не как перескок. */
        var arc = Math.sin(pi * Math.PI) * R * 0.28 * (i % 2 ? 1 : -1);
        var x = x0 + (x1 - x0) * e + arc;
        var y = y0 + (y1 - y0) * e - Math.sin(pi * Math.PI) * 60;

        var sc = 1 + (SIZE_UP - 1) * e;
        it.el.style.transform =
          "translate3d(" + (x - it.size / 2).toFixed(1) + "px," +
          (y - it.size / 2).toFixed(1) + "px,0) scale(" + sc.toFixed(3) + ")";
        it.el.style.width = it.size + "px";
        it.el.style.opacity = (0.45 + 0.35 * e).toFixed(2);

        /* Гаснет ровно тот логотип, чей клон уже в пути: в строке
           остаётся дырка, и уход читается сам собой. */
        it.src.style.opacity = String(Math.max(0, 1 - pi * 3.2).toFixed(2));
      }
    }

    requestAnimationFrame(frame);
  })();

  /* ------------------------------------------- параллакс героя */

  (function heroParallax() {
    var hero = document.querySelector(".hero");   // hero-parallax
    if (!hero || reduceMotion.matches) return;
    var tx = 0, ty = 0, x = 0, y = 0, raf = 0, active = false;

    function loop() {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      hero.style.setProperty("--px", x.toFixed(4));
      hero.style.setProperty("--py", y.toFixed(4));
      if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) raf = requestAnimationFrame(loop);
      else { raf = 0; }
    }

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch" || !active) return;
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });

    // считаем только пока герой на экране
    new IntersectionObserver(function (entries) {
      active = entries[0] ? entries[0].isIntersecting : false;
      if (!active) { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); }
    }).observe(hero);
  })();

  /* ------------------------------------------- индикатор уровня */

  document.querySelectorAll("[data-meter]").forEach(function (canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var channels = parseInt(canvas.getAttribute("data-meter"), 10) || 8;
    var SEGMENTS = 22;
    var width = 0, height = 0, raf = 0, running = false, visible = true, tick = 0;

    var strips = [];
    for (var i = 0; i < channels; i++) {
      strips.push({
        level: 0.3 + Math.random() * 0.3,
        peak: 0,
        peakHold: 0,
        base: 0.34 + Math.random() * 0.34,
        speed: 0.6 + Math.random() * 0.9,
        offset: Math.random() * Math.PI * 2,
        lead: i === 1 || i === Math.floor(channels / 2),
      });
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function segColor(index, lit) {
      if (!lit) return "rgba(255,255,255,0.05)";
      var ratio = index / (SEGMENTS - 1);
      if (ratio > 0.9) return "rgba(255,86,86,.95)";
      if (ratio > 0.74) return "rgba(255,196,74,.92)";
      return "rgba(64,224,168,.88)";
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      var gap = 4;
      var stripW = (width - gap * (channels - 1)) / channels;
      var segGap = 2;
      var segH = (height - segGap * (SEGMENTS - 1)) / SEGMENTS;

      strips.forEach(function (strip, c) {
        var x = c * (stripW + gap);
        var litCount = Math.round(strip.level * SEGMENTS);
        var peakIndex = Math.round(strip.peak * SEGMENTS);

        for (var s = 0; s < SEGMENTS; s++) {
          var y = height - (s + 1) * segH - s * segGap;
          ctx.fillStyle = segColor(s, s < litCount);
          ctx.fillRect(x, y, stripW, segH);
        }

        if (peakIndex > 0 && peakIndex <= SEGMENTS) {
          var py = height - peakIndex * segH - (peakIndex - 1) * segGap;
          ctx.fillStyle = peakIndex / SEGMENTS > 0.9 ? "rgba(255,120,120,1)" : "rgba(255,255,255,.85)";
          ctx.fillRect(x, py, stripW, 2);
        }
      });
    }

    function syncSize() {
      var rect = canvas.getBoundingClientRect();
      var w = Math.max(1, Math.round(rect.width));
      var h = Math.max(1, Math.round(rect.height));
      if (w !== width || h !== height) resize();
    }

    function step() {
      if (!running) return;
      syncSize();
      tick += 0.016;
      strips.forEach(function (strip) {
        var wobble =
          Math.sin(tick * strip.speed + strip.offset) * 0.16 +
          Math.sin(tick * strip.speed * 2.7 + strip.offset * 1.7) * 0.09;
        var target = strip.base + wobble;
        if (strip.lead && Math.sin(tick * 0.42 + strip.offset) > 0.86) target += 0.28;
        target = Math.min(0.99, Math.max(0.06, target));
        // быстрая атака, медленный спад - как на реальном метре
        strip.level += (target - strip.level) * (target > strip.level ? 0.35 : 0.06);

        if (strip.level > strip.peak) {
          strip.peak = strip.level;
          strip.peakHold = 48;
        } else if (strip.peakHold > 0) {
          strip.peakHold -= 1;
        } else {
          strip.peak = Math.max(strip.level, strip.peak - 0.006);
        }
      });
      draw();
      raf = requestAnimationFrame(step);
    }

    function start() {
      if (running || reduceMotion.matches) return;
      running = true;
      raf = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function staticFrame() {
      strips.forEach(function (strip) {
        strip.level = strip.base;
        strip.peak = Math.min(0.95, strip.base + 0.12);
      });
      draw();
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (visible) start();
    });

    new IntersectionObserver(function (entries) {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible && !document.hidden) start();
      else stop();
    }, { rootMargin: "80px" }).observe(canvas);

    new ResizeObserver(function () {
      resize();
      if (!running) draw();
    }).observe(canvas);

    resize();
    if (reduceMotion.matches) staticFrame();
    else draw();
  });
  /* ----------------------------------------------- облака под текстом

     Облако ставится под заголовком секции и под её блоками - карточками,
     плеером, схемой, сеткой проектов. Под непрозрачной карточкой его не
     видно, зато вокруг и в зазорах фон уходит в мягкую тень и не спорит
     с содержимым.

     Слой облаков висит на уровне body, координаты - страничные, из
     offsetTop/offsetLeft: они не зависят от трансформаций, а каскад
     как раз двигает содержимое блоков, и замер по прямоугольнику ловил
     бы промежуточный кадр. Блоки одной секции, стоящие вплотную, делят
     одно облако, иначе на стыке затемнение удваивается.
     ------------------------------------------------------------------ */
  (function clouds() {
    var sections = [].slice.call(document.querySelectorAll(".has-cloud"));
    if (!sections.length) return;

    var TARGETS = [
      ".section-head", ".thesis-quote", ".project-filter", ".timeline", ".stage-body",
      ".profile-grid", ".contours", ".studio", ".tract-toolbar", ".tract", ".keyhint",
      ".stage-panel", ".multiview", ".contact-card"
    ].join(", ");
    var MERGE = 120;

    var layer = document.createElement("div");
    layer.className = "cloud-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    var io = "IntersectionObserver" in window
      ? new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { e.target.classList.toggle("is-live", e.isIntersecting); });
        }, { rootMargin: "35% 0px" })
      : null;

    var pool = [];
    function cloud(i) {
      if (!pool[i]) {
        var el = document.createElement("div");
        el.className = "cloud";
        layer.appendChild(el);
        if (io) io.observe(el); else el.classList.add("is-live");
        pool[i] = el;
      }
      return pool[i];
    }

    function box(el) {
      var x = 0, y = 0, n = el;
      while (n) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      return { left: x, top: y, right: x + el.offsetWidth, bottom: y + el.offsetHeight };
    }

    function place() {
      var vw = window.innerWidth;
      var px = Math.round(Math.max(64, Math.min(170, vw * 0.09)));
      var py = Math.round(Math.max(52, Math.min(120, vw * 0.06)));
      var used = 0;

      sections.forEach(function (sec) {
        var boxes = [].slice.call(sec.querySelectorAll(TARGETS))
          .filter(function (t) { return t.offsetParent !== null && t.offsetWidth && t.offsetHeight; })
          .map(box)
          .sort(function (a, b) { return a.top - b.top; });

        var groups = [];
        boxes.forEach(function (r) {
          var g = groups[groups.length - 1];
          if (g && r.top - g.bottom < MERGE) {
            g.left = Math.min(g.left, r.left);
            g.right = Math.max(g.right, r.right);
            g.bottom = Math.max(g.bottom, r.bottom);
          } else {
            groups.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
          }
        });

        groups.forEach(function (g) {
          var el = cloud(used++);
          el.hidden = false;
          el.style.left = (g.left - px) + "px";
          el.style.top = (g.top - py) + "px";
          el.style.width = (g.right - g.left + px * 2) + "px";
          el.style.height = (g.bottom - g.top + py * 2) + "px";
          el.style.setProperty("--px", px + "px");
          el.style.setProperty("--py", py + "px");
        });
      });

      for (var i = used; i < pool.length; i++) pool[i].hidden = true;
    }

    var queued = false;
    function schedule() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; place(); });
    }

    place();
    window.addEventListener("resize", schedule, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    /* Высота секций меняется: подгружаются картинки, переключаются
       этапы диплома, content-visibility подменяет размер-заглушку на
       настоящий. Всё это сдвигает блоки ниже по странице. */
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(schedule);
      ro.observe(document.body);
      sections.forEach(function (s) {
        ro.observe(s);
        // текст этапа меняет высоту при переключении, секция - не всегда
        [].forEach.call(s.querySelectorAll(TARGETS), function (t) { ro.observe(t); });
      });
    }
  })();
})();
