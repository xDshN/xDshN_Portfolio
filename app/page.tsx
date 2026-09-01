"use client";

import { useEffect, useState, type CSSProperties } from "react";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

function assetPath(path: string) {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}

const focusAreas = [
  {
    number: "01",
    title: "Прямой эфир",
    text: "Собираю проект в vMix: источники, сцены, переходы, запись, стрим и резервные сценарии.",
    meta: "vMix · Zoom · Facecast",
    accent: "live",
    images: ["/assets/focus/live-studio.webp", "/assets/focus/live-control.webp"],
  },
  {
    number: "02",
    title: "Эфирная графика",
    text: "Проектирую титры в GT Title Designer и связываю их с данными, триггерами и логикой события.",
    meta: "GT · Data Source · Google Sheets",
    accent: "graphics",
    images: ["/assets/focus/graphics-stage.webp", "/assets/focus/graphics-editor.webp"],
  },
  {
    number: "03",
    title: "Звук",
    text: "Настраиваю тракт, маршрутизацию и микс для зала и трансляции. Работаю на Behringer X32.",
    meta: "X32 · Dante Level 2",
    accent: "sound",
    images: ["/assets/focus/sound-console.webp", "/assets/focus/sound-workstation.webp"],
  },
  {
    number: "04",
    title: "Автоматизация",
    text: "Убираю лишние ручные действия: Companion, shortcuts, MIDI, скрипты и собственные утилиты.",
    meta: "Companion · Python · MIDI",
    accent: "automation",
    images: ["/assets/focus/automation-companion.webp"],
  },
];

const graphicsCases = [
  {
    title: "Студент года",
    label: "Data-driven package",
    video: "/assets/graphics/student-of-the-year.mp4",
    poster: "/assets/graphics/student-of-the-year-poster.webp",
    duration: "01:37",
    description: "Графический пакет конкурсной программы: сольные номинации, пьедестал, финалисты и оперативное обновление участников из Google Sheets.",
    tags: ["GT Title Designer", "Google Sheets", "vMix"],
  },
  {
    title: "Мисс и мистер",
    label: "Show identity",
    video: "/assets/graphics/miss-and-mister.mp4",
    poster: "/assets/graphics/miss-and-mister-poster.webp",
    duration: "01:31",
    description: "Титры участников и партнёров, экранная айдентика шоу и логика переключения данных без ручной правки каждого кадра.",
    tags: ["Design", "Data Source", "Triggers"],
  },
  {
    title: "КВН",
    label: "Live results",
    video: "/assets/graphics/kvn.mp4",
    poster: "/assets/graphics/kvn-poster.webp",
    duration: "01:23",
    description: "Автоматизированная выдача победителей и мест: таблица управляет составом команд, фотографиями и итоговой композицией на экране.",
    tags: ["Results", "Sheets", "GT Titles"],
  },
  {
    title: "Интерактивная сетка",
    label: "State visualization",
    video: "/assets/graphics/final-graphic.mp4",
    poster: "/assets/graphics/final-graphic-poster.webp",
    duration: "01:15",
    description: "Система из шестнадцати статусов с визуальным подтверждением изменений — данные и графика обновляются синхронно во время события.",
    tags: ["16 states", "Automation", "Live data"],
  },
];

const projectCards = [
  {
    title: "Winline × Medium Quality",
    type: "Коммерческая трансляция",
    image: "/assets/winline-control.webp",
    accent: "lime",
    note: "Рабочее место режиссёра трансляции",
  },
  {
    title: "BetBoom",
    type: "Выездной эфир",
    image: "/assets/betboom-control.webp",
    accent: "blue",
    note: "Контроль источников и программы",
  },
  {
    title: "Форум ETM",
    type: "Гибридное мероприятие",
    image: "/assets/forum-etm.webp",
    accent: "red",
    note: "Трансляция и мультимедийный экран",
  },
  {
    title: "Московский экономический форум",
    type: "Техническое сопровождение",
    image: "/assets/mef-stage.webp",
    accent: "lime",
    note: "Сцена, видео и презентационный контур",
  },
  {
    title: "Epic Growth",
    type: "Мультимедийная площадка",
    image: "/assets/epic-stage.webp",
    accent: "blue",
    note: "Экранный контент и эфирная среда",
  },
  {
    title: "Студент года",
    type: "Эфирная графика",
    image: "/assets/projects/student-of-the-year-graphic.webp",
    accent: "red",
    note: "Титры, результаты и экранная композиция",
  },
  {
    title: "Majestic",
    type: "Студийная трансляция",
    image: "/assets/projects/majestic-control-room.webp",
    accent: "blue",
    note: "Многокамерный эфир и технический контур студии",
  },
];

type ThesisStageId = "overview" | "sheets" | "vmix" | "midi" | "audio" | "presentation";

type ThesisFigure = {
  number: string;
  src: string;
  title: string;
  text: string;
};

const thesisFigures: ThesisFigure[] = [
  {
    number: "01",
    src: "/assets/diploma/figure-01.webp",
    title: "Рабочий проект vMix",
    text: "Центральная рабочая среда: видео, захват экрана, титры, таймеры и заранее подготовленные входы собраны в одном проекте.",
  },
  {
    number: "02",
    src: "/assets/diploma/figure-02.webp",
    title: "Панель Bitfocus Companion",
    text: "Сценарные действия сведены в понятные кнопки и макрокоманды, чтобы оператор не искал нужную функцию во время мероприятия.",
  },
  {
    number: "03",
    src: "/assets/diploma/figure-03.webp",
    title: "Привязка Data Source",
    text: "Табличные значения подключаются к полям титра: изменённые данные попадают в графику без повторного редактирования шаблона.",
  },
  {
    number: "04",
    src: "/assets/diploma/figure-04.webp",
    title: "Лист grid",
    text: "Рабочая страница оператора с выпадающими списками. Институт, этап и нужный вариант титра меняются одним выбором без опечаток.",
  },
  {
    number: "05",
    src: "/assets/diploma/figure-05.webp",
    title: "Лист vMix",
    text: "Столбцы названы так же, как поля в GT-титрах. Здесь формируются тексты и готовые пути к изображениям для автоматической подстановки.",
  },
  {
    number: "06",
    src: "/assets/diploma/figure-06.webp",
    title: "Лист lib",
    text: "Справочник хранит базовые директории проекта. Если папка с материалами переезжает, достаточно изменить один путь.",
  },
  {
    number: "07",
    src: "/assets/diploma/figure-07.webp",
    title: "Подключение таблицы",
    text: "Google Sheets добавляется в менеджер Data Sources; первая строка используется как набор имён столбцов.",
  },
  {
    number: "08",
    src: "/assets/diploma/figure-08.webp",
    title: "Автопривязка полей",
    text: "Режим Column: Auto и команда Apply to all Fields связывают поля титра со столбцами таблицы за одно действие.",
  },
  {
    number: "09",
    src: "/assets/diploma/figure-09.webp",
    title: "Набор источников",
    text: "Видео, изображения, Desktop Capture, презентации и титры добавляются в проект заранее под конкретный сценарий мероприятия.",
  },
  {
    number: "10",
    src: "/assets/diploma/figure-10.webp",
    title: "Кадрирование и позиционирование",
    text: "Zoom, Pan и Crop приводят разнородные материалы к единой экранной композиции ещё до выхода на площадку.",
  },
  {
    number: "11",
    src: "/assets/diploma/figure-11.webp",
    title: "События и функции",
    text: "Для каждого источника выбирается событие и ответное действие: переход, включение слоя, управление звуком или запуск команды.",
  },
  {
    number: "12",
    src: "/assets/diploma/figure-12.webp",
    title: "Triggers Manager",
    text: "Сводная проверка правил помогает увидеть всю событийную логику и не пропустить настройку отдельного ролика.",
  },
  {
    number: "13",
    src: "/assets/diploma/figure-13.webp",
    title: "Горячие клавиши",
    text: "Shortcuts используют ту же библиотеку команд, что и триггеры: ручное и автоматическое управление остаются единообразными.",
  },
  {
    number: "14",
    src: "/assets/diploma/figure-14.webp",
    title: "Собранный проект мероприятия",
    text: "Подготовленные медиа, презентации, титры и служебные элементы доступны оператору без импровизации и поиска файлов в эфире.",
  },
  {
    number: "15",
    src: "/assets/diploma/figure-15.webp",
    title: "Таймер воспроизведения",
    text: "Служебный титр одновременно показывает прошедшее и оставшееся время, помогая заранее подготовить следующий элемент программы.",
  },
  {
    number: "16",
    src: "/assets/diploma/figure-16.webp",
    title: "Скрипт таймера",
    text: "VB.NET-скрипт опрашивает API.XML vMix, вычисляет остаток и меняет цвет индикатора с зелёного на оранжевый и красный.",
  },
  {
    number: "17",
    src: "/assets/diploma/figure-17.webp",
    title: "MIDI-команда на X32",
    text: "Кнопке секции ASSIGN назначается уникальное Note-сообщение, которое по USB поступает на рабочую станцию.",
  },
  {
    number: "18",
    src: "/assets/diploma/figure-18.webp",
    title: "Физическая панель управления",
    text: "Подписанные кнопки FTB, Prev, Next и AIMP превращают звуковой пульт в быстрый аппаратный интерфейс всей системы.",
  },
  {
    number: "19",
    src: "/assets/diploma/figure-19.webp",
    title: "Connections в Companion",
    text: "Companion одновременно подключён к vMix, X32 и виртуальным MIDI-портам, поэтому остаётся единым центром маршрутизации команд.",
  },
  {
    number: "20",
    src: "/assets/diploma/figure-20.webp",
    title: "MIDI-триггер",
    text: "Полученное Note On сопоставляется с виртуальным нажатием конкретной кнопки Companion и запускает предсказуемое действие.",
  },
  {
    number: "21",
    src: "/assets/diploma/figure-21.webp",
    title: "Команда vMix",
    text: "На виртуальную кнопку назначается действие видеомикшера — например, плавный переход Fade длительностью 700 мс.",
  },
  {
    number: "22",
    src: "/assets/diploma/figure-22.webp",
    title: "Web Buttons",
    text: "Та же сетка доступна с телефона или планшета в локальной сети — полезно при проверке экрана вдали от рабочего места.",
  },
  {
    number: "23",
    src: "/assets/diploma/figure-23.webp",
    title: "Команда для AIMP",
    text: "Companion отправляет MIDI CC в отдельный виртуальный порт Pause, Next или Prev вместо прямого управления плеером.",
  },
  {
    number: "24",
    src: "/assets/diploma/figure-24.webp",
    title: "Маршрут управления AIMP",
    text: "loopMIDI передаёт событие в Xor Midi Control, а тот преобразует его в команду Play/Pause, Next или Previous для AIMP.",
  },
];

const thesisStages: Array<{
  id: ThesisStageId;
  index: string;
  short: string;
  eyebrow: string;
  title: string;
  description: string;
  steps: string[];
  figureNumbers: number[];
}> = [
  {
    id: "overview",
    index: "01",
    short: "Архитектура",
    eyebrow: "Теория — в одном экране",
    title: "Один оператор. Несколько подсистем. Единый контур.",
    description: "Проблема исходной схемы — постоянное переключение между видео, звуком, титрами, музыкой и презентациями. Решение не заменяет оператора, а собирает повторяющиеся действия и данные в предсказуемую систему.",
    steps: [
      "vMix становится центральной точкой формирования изображения и экранного контента.",
      "Companion принимает аппаратные события и запускает подготовленные макрокоманды.",
      "Таблицы отделяют изменяемые данные от дизайна титров и обновляют их централизованно.",
    ],
    figureNumbers: [1, 2, 3],
  },
  {
    id: "sheets",
    index: "02",
    short: "Google Sheets",
    eyebrow: "Контур данных",
    title: "Три листа вместо ручного редактирования каждого титра.",
    description: "Таблица разделена на grid, vMix и lib. Оператор выбирает значения, формулы собирают данные и пути к изображениям, а vMix связывает столбцы с одноимёнными полями GT-шаблона.",
    steps: [
      "grid — рабочий интерфейс с выпадающими списками для оперативных изменений.",
      "vMix — итоговые значения и имена столбцов, совпадающие с полями .gtzip.",
      "lib — единое хранение базовых путей к графике и другим материалам.",
    ],
    figureNumbers: [4, 5, 6, 7, 8],
  },
  {
    id: "vmix",
    index: "03",
    short: "vMix",
    eyebrow: "Сборка события",
    title: "Источники заранее подготовлены, а поведение закреплено правилами.",
    description: "Проект создаётся под сценарий мероприятия: материалы нормализуются по кадру, для роликов задаются автоматические уходы и звук, а таймер помогает оператору контролировать темп программы.",
    steps: [
      "Inputs собирают видео, изображения, презентации, титры и служебные элементы.",
      "Triggers автоматически включают звук, снимают overlay и выполняют плавные уходы.",
      "VB.NET-таймер получает состояние через API.XML и обновляет титр каждые 100 мс.",
    ],
    figureNumbers: [9, 10, 11, 12, 13, 14, 15, 16],
  },
  {
    id: "midi",
    index: "04",
    short: "X32 + Companion",
    eyebrow: "Контур управления",
    title: "Физическая кнопка превращается в проверенную эфирную команду.",
    description: "Назначаемые кнопки Behringer X32 отправляют MIDI-сообщения. Companion распознаёт их, виртуально нажимает нужную кнопку и запускает действие vMix — без поиска окон мышью.",
    steps: [
      "X32 формирует уникальное MIDI Note-сообщение и отправляет его по USB.",
      "Trigger в Companion сопоставляет событие с конкретной виртуальной кнопкой.",
      "Одна логика доступна с X32, из интерфейса Companion и через Web Buttons.",
    ],
    figureNumbers: [17, 18, 19, 20, 21, 22],
  },
  {
    id: "audio",
    index: "05",
    short: "AIMP",
    eyebrow: "Музыкальный контур",
    title: "Companion управляет плеером через виртуальный MIDI-маршрут.",
    description: "Для AIMP создан отдельный маршрут: команда Companion попадает в loopMIDI, преобразуется программой Xor Midi Control и только после этого управляет воспроизведением.",
    steps: [
      "Для Pause, Next и Prev создаются отдельные виртуальные MIDI-порты.",
      "Companion отправляет в выбранный порт сообщение Control Change.",
      "Xor Midi Control переводит MIDI-событие в медиакоманду AIMP.",
    ],
    figureNumbers: [23, 24],
  },
  {
    id: "presentation",
    index: "06",
    short: "AutoHotkey",
    eyebrow: "Презентации и PDF",
    title: "Кликер работает, даже когда у оператора активно окно vMix.",
    description: "AutoHotkey перехватывает команды листания, находит PowerPoint или Adobe Acrobat, возвращает нужному окну фокус и только затем отправляет нажатие. Докладчик листает материал независимо от действий оператора.",
    steps: [
      "Презентация открывается на втором мониторе, а vMix получает её через Desktop Capture или NDI.",
      "Скрипт сначала ищет окно демонстрации PowerPoint, затем — Adobe Acrobat.",
      "Оператор продолжает работать в vMix, не контролируя активное окно вручную.",
    ],
    figureNumbers: [],
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M10.5 5.5 15 10l-4.5 4.5" />
    </svg>
  );
}

function TechIcon({ name }: { name: "vmix" | "gt" | "sound" | "sheets" | "companion" | "dante" }) {
  if (name === "sound") {
    return (
      <svg className="tech-icon tech-icon-sound" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M12 7v34M24 7v34M36 7v34" />
        <rect x="8" y="13" width="8" height="10" rx="2" />
        <rect x="20" y="28" width="8" height="10" rx="2" />
        <rect x="32" y="17" width="8" height="10" rx="2" />
      </svg>
    );
  }

  const brandIcons = {
    vmix: "/assets/brands/vmix.png",
    gt: "/assets/brands/gt-designer.png",
    sheets: "/assets/brands/google-sheets.png",
    companion: "/assets/brands/companion.png",
    dante: "/assets/brands/dante-mark.png",
  } as const;

  return <img className={`tech-icon tech-icon-${name}`} src={assetPath(brandIcons[name])} alt="" aria-hidden="true" />;
}

function HeroWave() {
  const lines = Array.from({ length: 25 }, (_, index) => index);

  return (
    <svg className="hero-wave" viewBox="0 0 820 760" aria-hidden="true">
      <defs>
        <linearGradient id="heroWaveGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#55c8ff" />
          <stop offset="0.45" stopColor="#6657ff" />
          <stop offset="1" stopColor="#d44dff" />
        </linearGradient>
        <filter id="heroWaveGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g fill="none" stroke="url(#heroWaveGradient)" filter="url(#heroWaveGlow)">
        {lines.map((line) => (
          <path
            key={line}
            d="M-70 78 C105 -70 225 280 405 118 S690 18 900 232"
            transform={`translate(0 ${line * 23})`}
          />
        ))}
      </g>
    </svg>
  );
}

function ThesisSystemMap({
  active,
  onSelect,
}: {
  active: ThesisStageId;
  onSelect: (stage: ThesisStageId) => void;
}) {
  const nodeClass = (stage: ThesisStageId, className: string) =>
    `map-node ${className}${active === stage ? " active" : ""}`;

  return (
    <div className="thesis-map-wrap">
      <div className="thesis-map-toolbar">
        <span><i /> Интерактивная схема системы</span>
        <p>6 этапов · 24 иллюстрации. Нажмите на узел — ниже откроется соответствующий этап.</p>
      </div>
      <div className="thesis-system-map" aria-label="Интерактивная архитектура дипломного проекта">
        <svg className="system-connectors" viewBox="0 0 1200 520" aria-hidden="true">
          <defs>
            <linearGradient id="systemLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#4ea7ff" />
              <stop offset="0.52" stopColor="#8a67ff" />
              <stop offset="1" stopColor="#e052ff" />
            </linearGradient>
          </defs>
          <g className="connector-lines">
            <path id="flow-overview" d="M310 108 C390 108 405 210 470 235" />
            <path id="flow-sheets" d="M300 382 C390 382 400 294 470 270" />
            <path id="flow-control" d="M850 102 C790 102 765 190 735 230" />
            <path id="flow-audio" d="M988 140 C988 210 995 282 995 350" />
            <path id="flow-presentation" d="M620 400 C620 360 620 335 620 314" />
            <path id="flow-output" d="M735 260 C805 260 845 260 900 260" />
          </g>
          <g className="diagram-signals">
            {[
              ["#flow-overview", "4s"],
              ["#flow-sheets", "3.4s"],
              ["#flow-control", "3.7s"],
              ["#flow-audio", "4.2s"],
              ["#flow-presentation", "3.2s"],
              ["#flow-output", "2.8s"],
            ].map(([path, duration]) => (
              <circle key={path} r="4">
                <animateMotion dur={duration} repeatCount="indefinite">
                  <mpath href={path} />
                </animateMotion>
              </circle>
            ))}
          </g>
        </svg>

        <button className={nodeClass("overview", "node-overview")} onClick={() => onSelect("overview")} aria-pressed={active === "overview"}>
          <b>01</b><small>Общая логика</small><strong>Архитектура</strong><span>Единый контур системы</span>
        </button>
        <button className={nodeClass("sheets", "node-sheets")} onClick={() => onSelect("sheets")} aria-pressed={active === "sheets"}>
          <b>02</b><small>Контур данных</small><strong>Google Sheets</strong><span>grid · vMix · lib</span>
        </button>
        <button className={nodeClass("vmix", "node-vmix")} onClick={() => onSelect("vmix")} aria-pressed={active === "vmix"}>
          <b>03</b><small>Центр системы</small><strong>vMix</strong><span>Видео · титры · API</span>
        </button>
        <button className={nodeClass("midi", "node-midi")} onClick={() => onSelect("midi")} aria-pressed={active === "midi"}>
          <b>04</b><small>Аппаратное управление</small><strong>X32 + Companion</strong><span>MIDI · triggers · buttons</span>
        </button>
        <button className={nodeClass("audio", "node-audio")} onClick={() => onSelect("audio")} aria-pressed={active === "audio"}>
          <b>05</b><small>Музыкальный контур</small><strong>AIMP</strong><span>loopMIDI · Xor</span>
        </button>
        <button className={nodeClass("presentation", "node-presentation")} onClick={() => onSelect("presentation")} aria-pressed={active === "presentation"}>
          <b>06</b><small>Презентации и PDF</small><strong>AutoHotkey</strong><span>Фокус окна · Left / Right</span>
        </button>
        <div className="map-output" aria-hidden="true"><small>Результат</small><strong>Экран + эфир</strong><span>PROGRAM OUT</span></div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeThesis, setActiveThesis] = useState<ThesisStageId>("overview");
  const [activeGraphic, setActiveGraphic] = useState(0);
  const [lightbox, setLightbox] = useState<ThesisFigure | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeStage = thesisStages.find((stage) => stage.id === activeThesis) ?? thesisStages[0];
  const activeFigures = activeStage.figureNumbers.map((number) => thesisFigures[number - 1]);
  const currentGraphic = graphicsCases[activeGraphic];

  useEffect(() => {
    if (!lightbox && !menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(null);
        setMenuOpen(false);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [lightbox, menuOpen]);

  return (
    <main
      style={{
        "--hero-organic-url": `url("${assetPath("/assets/hero-organic-v3.webp")}")`,
      } as CSSProperties}
    >
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Андрей Варнавский — наверх" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">AV</span>
          <span className="brand-copy">
            Андрей Варнавский
            <small>Live systems & multimedia</small>
          </span>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#graphics"><span>01</span>Графика</a>
          <a href="#thesis"><span>02</span>Дипломный проект</a>
          <a href="#projects"><span>03</span>Проекты</a>
        </nav>
        <a className="availability" href="#contact" onClick={() => setMenuOpen(false)}>
          <span /> На связи
        </a>
        <button
          className={`mobile-menu-toggle${menuOpen ? " active" : ""}`}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i><span /><span /></i>
          <b>{menuOpen ? "Закрыть" : "Меню"}</b>
        </button>
      </header>

      <aside className={`mobile-nav${menuOpen ? " open" : ""}`} id="mobile-navigation" aria-hidden={!menuOpen}>
        <div className="mobile-nav-inner shell">
          <p className="kicker"><span>Navigation</span> / live system</p>
          <nav aria-label="Мобильная навигация">
            <a href="#graphics" onClick={() => setMenuOpen(false)}><span>01</span><strong>Графика</strong><i>↗</i></a>
            <a href="#thesis" onClick={() => setMenuOpen(false)}><span>02</span><strong>Дипломный проект</strong><i>↗</i></a>
            <a href="#projects" onClick={() => setMenuOpen(false)}><span>03</span><strong>Проекты</strong><i>↗</i></a>
            <a href="#profile" onClick={() => setMenuOpen(false)}><span>04</span><strong>Профиль</strong><i>↗</i></a>
          </nav>
          <a className="mobile-nav-contact" href="#contact" onClick={() => setMenuOpen(false)}><span /> Обсудить проект <b>→</b></a>
        </div>
      </aside>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="kicker"><span>Broadcast engineer</span> / Multimedia systems</p>
          <h1>
            Андрей<br />
            <span>Варнавский</span>
          </h1>
          <p className="hero-lead">
            Инженер прямого эфира и мультимедийных систем. Проектирую и веду
            технический контур мероприятий: видео, звук, графика, коммутация и автоматизация.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#graphics">
              Смотреть графику <ArrowIcon />
            </a>
            <a className="button button-ghost" href="https://t.me/xDshNNN" target="_blank" rel="noreferrer">
              Написать в Telegram
            </a>
          </div>
          <dl className="hero-stats">
            <div><dt>4</dt><dd>года в индустрии</dd></div>
            <div><dt>30+</dt><dd>проектов</dd></div>
            <div className="hero-level"><dt>Level 2</dt><dd>Audinate Dante</dd></div>
          </dl>
        </div>

        <div className="hero-visual" aria-label="Абстрактная визуализация мультимедийной системы">
          <div className="hero-fluid hero-fluid-a" aria-hidden="true" />
          <div className="hero-fluid hero-fluid-b" aria-hidden="true" />
          <div className="hero-aura" aria-hidden="true" />
          <HeroWave />
          <div className="hero-dots" aria-hidden="true" />
          <img
            className="hero-sculpture"
            src={assetPath("/assets/hero-organic-v3.webp")}
            alt="Глянцевая абстрактная форма в сине-фиолетовом свечении"
            fetchPriority="high"
          />
          <div className="hero-light-sweep" aria-hidden="true" />
          <div className="hero-chip hero-chip-live"><span /> Signal online</div>
          <div className="hero-chip hero-chip-data">Data / connected</div>
          <div className="hero-coordinate">X 04.12 / Y 18.06</div>
        </div>
      </section>

      <div className="ticker" aria-label="Ключевые технологии">
        <div className="ticker-item"><TechIcon name="vmix" /><span>vMix</span></div>
        <div className="ticker-item"><TechIcon name="gt" /><span>Live graphics</span></div>
        <div className="ticker-item"><TechIcon name="sound" /><span>Sound</span></div>
        <div className="ticker-item"><TechIcon name="sheets" /><span>Data-driven titles</span></div>
        <div className="ticker-item"><TechIcon name="companion" /><span>Bitfocus Companion</span></div>
        <div className="ticker-item"><TechIcon name="dante" /><span>Dante</span></div>
      </div>

      <section className="profile section shell" id="profile">
        <div className="section-label"><span>01</span> Профиль</div>
        <div className="profile-layout">
          <div className="profile-copy">
            <p className="eyebrow">Не отдельная кнопка. Вся система.</p>
            <h2>Держу в фокусе весь технический контур события.</h2>
            <p>
              От первой коммутации до последнего титра в эфире. Понимаю, как
              взаимодействуют звук, видео, презентации, графика и оператор — и
              проектирую рабочую среду так, чтобы она оставалась управляемой в
              реальном времени.
            </p>
            <div className="profile-signals" aria-label="Основные направления">
              <span>VIDEO</span><i />
              <span>SOUND</span><i />
              <span>GRAPHICS</span><i />
              <span>AUTOMATION</span>
            </div>
          </div>
          <figure className="profile-portrait">
            <div className="portrait-grid" aria-hidden="true" />
            <div className="portrait-orbit portrait-orbit-a" aria-hidden="true" />
            <div className="portrait-orbit portrait-orbit-b" aria-hidden="true" />
            <span className="portrait-code portrait-code-top">AV / PROFILE 01</span>
            <span className="portrait-code portrait-code-bottom">SYSTEMS ONLINE</span>
            <img className="profile-cutout" src={assetPath("/assets/profile/andrey-main-cutout.webp")} alt="Андрей Варнавский" loading="lazy" />
            <figcaption><span /> Broadcast engineer · Moscow</figcaption>
          </figure>
        </div>
      </section>

      <section className="capabilities section shell" id="capabilities" aria-label="Компетенции">
        <div className="section-heading capability-heading">
          <div className="section-label"><span>02</span> Компетенции</div>
          <div>
            <p className="eyebrow">Один проект — четыре связанных контура</p>
            <h2>От сигнала на площадке до команды в эфире.</h2>
          </div>
        </div>
        <div className="capability-grid">
          {focusAreas.map((item) => (
            <article className={`capability-card capability-${item.accent}`} key={item.number}>
              <div className="capability-media">
                <img className="capability-primary" src={assetPath(item.images[0])} alt={`${item.title}: рабочий процесс`} loading="lazy" />
                {item.images[1] && <img className="capability-secondary" src={assetPath(item.images[1])} alt={`${item.title}: дополнительный ракурс`} loading="lazy" />}
                <span className="capability-number">{item.number}</span>
              </div>
              <div className="capability-copy">
                <p>{item.meta}</p>
                <h3>{item.title}</h3>
                <span>{item.text}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="graphics section shell" id="graphics">
        <div className="section-heading">
          <div className="section-label"><span>03</span> Эфирная графика</div>
          <div>
            <p className="eyebrow">Титр — это интерфейс эфира</p>
            <h2>Графика, которую лучше увидеть в движении.</h2>
          </div>
        </div>

        <div className="graphics-studio">
          <div className="graphics-player">
            <div className="graphics-player-top">
              <span><i /> Full case playback</span>
              <b>{String(activeGraphic + 1).padStart(2, "0")} / {String(graphicsCases.length).padStart(2, "0")}</b>
            </div>
            <video
              key={currentGraphic.video}
              src={assetPath(currentGraphic.video)}
              poster={assetPath(currentGraphic.poster)}
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              aria-label={`Видеодемонстрация проекта ${currentGraphic.title}`}
            />
            <div className="graphics-player-bottom"><span>DATA SOURCE / GT / VMIX</span><b>{currentGraphic.duration}</b></div>
          </div>

          <div className="graphics-control-panel">
            <div className="graphics-tabs" role="tablist" aria-label="Кейсы эфирной графики">
              {graphicsCases.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  aria-selected={activeGraphic === index}
                  className={activeGraphic === index ? "active" : ""}
                  onClick={() => setActiveGraphic(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><small>{item.label}</small><strong>{item.title}</strong></div>
                  <i>↗</i>
                </button>
              ))}
            </div>
            <article className="graphics-case-copy" aria-live="polite">
              <p className="case-index">Выбранный кейс / {String(activeGraphic + 1).padStart(2, "0")}</p>
              <h3>{currentGraphic.title}</h3>
              <p>{currentGraphic.description}</p>
              <div className="graphics-tags">{currentGraphic.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>
          </div>
        </div>
      </section>

      <section className="thesis section" id="thesis">
        <div className="shell">
          <div className="section-heading thesis-heading">
            <div className="section-label"><span>04</span> Дипломный проект</div>
            <div>
              <p className="eyebrow">Выпускная квалификационная работа</p>
              <h2>Автоматизация управления мультимедийным контентом.</h2>
            </div>
          </div>
          <div className="thesis-intro-grid">
            <p className="thesis-title">
              «Использование информационных технологий для автоматизации управления
              мультимедийным контентом на базе актового зала РГУ им. А. Н. Косыгина»
            </p>
            <div className="thesis-problem">
              <span>Задача</span>
              <p>Сократить ручные операции и сделать сопровождение мероприятия устойчивее, когда один оператор одновременно управляет видео, графикой, музыкой, презентациями и звуком.</p>
            </div>
          </div>

          <ThesisSystemMap active={activeThesis} onSelect={setActiveThesis} />

          <div className="thesis-workbench">
            <div className="thesis-stage-tabs" role="tablist" aria-label="Этапы реализации дипломного проекта">
              {thesisStages.map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={activeThesis === stage.id}
                  className={activeThesis === stage.id ? "active" : ""}
                  onClick={() => setActiveThesis(stage.id)}
                >
                  <span>{stage.index}</span>
                  <strong>{stage.short}</strong>
                  <i>↗</i>
                </button>
              ))}
            </div>

            <article className="thesis-stage" role="tabpanel" aria-live="polite">
              <div className="thesis-stage-copy">
                <p className="case-index">{activeStage.index} / {activeStage.eyebrow}</p>
                <h3>{activeStage.title}</h3>
                <p className="thesis-stage-lead">{activeStage.description}</p>
                <ol>
                  {activeStage.steps.map((step, index) => (
                    <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>
                  ))}
                </ol>
                <div className="thesis-stage-result">
                  <span>Практический эффект</span>
                  <strong>Меньше ручных переключений. Быстрее реакция. Ниже риск ошибки.</strong>
                </div>
              </div>

              <div className="thesis-stage-media">
                {activeFigures.length > 0 ? (
                  <>
                    <div className="thesis-media-heading">
                      <span>{activeFigures.length} {activeFigures.length === 1 ? "иллюстрация" : activeFigures.length < 5 ? "иллюстрации" : "иллюстраций"}</span>
                      <p>Нажмите на изображение, чтобы рассмотреть интерфейс и подпись.</p>
                    </div>
                    <div className="thesis-figure-grid">
                      {activeFigures.map((figure) => (
                        <button className="thesis-figure" type="button" key={figure.number} onClick={() => setLightbox(figure)}>
                          <span className="figure-image"><img src={assetPath(figure.src)} alt={figure.title} loading="lazy" /></span>
                          <span className="figure-caption"><b>{figure.number}</b><strong>{figure.title}</strong><i>Открыть ↗</i></span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="presentation-module">
                    <div className="presentation-flow" aria-label="Логика управления презентацией">
                      <span><small>01</small><strong>Кликер</strong></span>
                      <i>→</i>
                      <span className="active"><small>02</small><strong>AutoHotkey</strong></span>
                      <i>→</i>
                      <span><small>03</small><strong>PowerPoint / Acrobat</strong></span>
                    </div>
                    <pre><code>{`Left:: SendKey("{Left}")
Right:: SendKey("{Right}")

SendKey(key) {
  if WinExist("Демонстрация PowerPoint") {
    WinActivate("Демонстрация PowerPoint")
    Send(key)
  } else if WinExist("Adobe Acrobat") {
    WinActivate("Adobe Acrobat")
    Send(key)
  }
}`}</code></pre>
                    <p><span /> Команда всегда попадает в окно показа, даже если оператор в этот момент работает в vMix.</p>
                  </div>
                )}
              </div>
            </article>
          </div>

        </div>
      </section>

      {lightbox && (
        <div className="figure-lightbox" role="dialog" aria-modal="true" aria-label={lightbox.title} onClick={() => setLightbox(null)}>
          <button className="lightbox-close" type="button" onClick={() => setLightbox(null)} aria-label="Закрыть изображение">Закрыть ×</button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={assetPath(lightbox.src)} alt={lightbox.title} />
            <figcaption><span>{lightbox.number}</span><div><strong>{lightbox.title}</strong><p>{lightbox.text}</p></div></figcaption>
          </figure>
        </div>
      )}

      <section className="projects section shell" id="projects">
        <div className="section-heading">
          <div className="section-label"><span>05</span> Выбранные проекты</div>
          <div>
            <p className="eyebrow">Реальные площадки</p>
            <h2>От режиссёрского стола до большого экрана.</h2>
          </div>
        </div>
        <div className="project-grid">
          {projectCards.map((project, index) => (
            <article className={`project-card project-${project.accent}`} key={project.title}>
              <figure><img src={assetPath(project.image)} alt={`${project.title}: ${project.note}`} /></figure>
              <div className="project-info">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><p>{project.type}</p><h3>{project.title}</h3><small>{project.note}</small></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="path section shell" id="path">
        <div className="section-heading path-heading">
          <div className="section-label"><span>06</span> Путь</div>
          <div>
            <p className="eyebrow">Короткая хронология</p>
            <h2>Через практику — к системному подходу.</h2>
          </div>
        </div>
        <div className="timeline">
          <article><time>2022</time><span /><div><h3>Информационные технологии в медиаиндустрии</h3><p>Начало профессионального пути и работа с мультимедийными технологиями.</p></div></article>
          <article><time>2023</time><span /><div><h3>Звук и мультимедийный экран</h3><p>Практика на мероприятиях: от подготовки тракта до управления контентом в реальном времени.</p></div></article>
          <article><time>2024–25</time><span /><div><h3>Коммерческие и выездные проекты</h3><p>Офлайн-, онлайн- и гибридные форматы, трансляции и техническое сопровождение площадок.</p></div></article>
          <article><time>2026</time><span /><div><h3>Диплом: автоматизация зала</h3><p>Сведение накопленного опыта в единую архитектуру управления мультимедийным контентом.</p></div></article>
        </div>
      </section>

      <footer className="contact" id="contact">
        <div className="shell contact-inner">
          <div className="contact-card">
            <p className="kicker"><span>Ready</span> / to connect</p>
            <h2><span>Обсудим</span><em>ваш проект?</em></h2>
            <p>Могу подключиться к трансляции, мультимедийному проекту или задаче по автоматизации.</p>
            <div className="contact-links">
              <a href="https://t.me/xDshNNN" target="_blank" rel="noreferrer">Telegram <ArrowIcon /></a>
              <a href="https://vk.com/xdshnnn" target="_blank" rel="noreferrer">ВКонтакте <ArrowIcon /></a>
            </div>
          </div>
          <div className="footer-line"><span>© {new Date().getFullYear()} Андрей Варнавский</span><a href="#top">Наверх ↑</a></div>
        </div>
      </footer>
    </main>
  );
}
