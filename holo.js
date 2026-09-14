/* ============================================================
   Голографическая фольга — фоновый слой страницы.

   Два прохода. Первый рисует материал в текстуру: поле высоты из
   гребневого шума поверх доменного искажения — abs() от знакового шума
   даёт острые складки, из которых и состоит мятая фольга, а искажение
   заставляет эти складки течь. Из градиента высоты берётся нормаль,
   по ней считается глянцевое освещение двумя источниками.

   Радуга не подкраска, а тонкоплёночная интерференция: толщина плёнки
   зависит от высоты складки и от угла обзора, а разные множители на
   канал дают спектральные полосы вместо общего сдвига оттенка. Второй
   слой плёнки с другой частотой добавляет микроструктуру, из-за
   которой фольга переливается, а не просто окрашена.

   Второй проход накладывает на материал неоднородное размытие, линзу
   и сферу под курсором. Материал считается в буфере 0.62 от экрана:
   он всё равно глянцевый и проходит через размытие, разрешение там
   не нужно, а вычислений вдвое меньше.
   ============================================================ */

(function () {
  'use strict';

  /* Значения подобраны на стенде и утверждены. */
  var P = {
    exp: 1.02, blur: 0.76, spd: 1.28,
    flow: 1.28, relief: 1.42, spec: 0.96, irid: 1.23, film: 1.03,
    cur: 1.01, size: 0.051, hue: 0.73, sat: 0.88,
    amp: 1.33, cplx: 0.59, morph: 1.00,
    lens: 0.140, rim: 1.04, rimw: 0.18, core: 0.36, disp: 0.058
  };

  var VERT = [
    '#version 300 es',
    'const vec2 P[3] = vec2[3](vec2(-1.,-1.), vec2(3.,-1.), vec2(-1.,3.));',
    'void main(){ gl_Position = vec4(P[gl_VertexID], 0., 1.); }'
  ].join('\n');

  var NOISE = [
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float noise(vec2 p){',
    '  vec2 i = floor(p), f = fract(p);',
    '  vec2 u = f*f*(3.0-2.0*f);',
    '  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);',
    '}',
    'float fbm(vec2 p){',
    '  float s = 0.0, a = 0.5;',
    '  for (int i = 0; i < 5; i++){ s += a*noise(p); p *= 2.03; a *= 0.5; }',
    '  return s;',
    '}'
  ].join('\n');

  var FRAG_FOIL = [
    '#version 300 es',
    'precision highp float;',
    'out vec4 outColor;',
    'uniform vec2 uRes, uPar;',
    'uniform float uTime, uScroll, uRelief, uIrid, uFilm, uSpec, uFlow;',
    NOISE,

    'float fbm3(vec2 p){',
    '  float s = 0.0, a = 0.5;',
    '  for (int i = 0; i < 3; i++){ s += a*noise(p); p *= 2.07; a *= 0.5; }',
    '  return s;',
    '}',

    'vec3 film(float p){',
    '  const float TAU = 6.28318;',
    '  return vec3(0.5 + 0.5*cos(TAU*(p*1.00)),',
    '              0.5 + 0.5*cos(TAU*(p*1.19) + 1.05),',
    '              0.5 + 0.5*cos(TAU*(p*1.41) + 2.10));',
    '}',

    'vec2 flow(vec2 p, float t){',
    '  vec2 w1 = vec2(fbm3(p*1.25 + vec2(0.0, t*0.045)),',
    '                 fbm3(p*1.25 + vec2(4.7, -t*0.037)));',
    '  vec2 w2 = vec2(fbm3(p*2.60 + w1*1.7 + vec2(t*0.028, 0.0)),',
    '                 fbm3(p*2.60 + w1*1.7 + vec2(9.1, -t*0.021)));',
    '  return p + (w1 - 0.5)*1.30*uFlow + (w2 - 0.5)*0.58*uFlow;',
    '}',

    'float crease(vec2 q){',
    '  float h = 0.0, a = 0.58, f = 1.0;',
    '  for (int i = 0; i < 4; i++){',
    '    float n = noise(q*f*2.05 + float(i)*7.3);',
    '    h += a * (1.0 - abs(n*2.0 - 1.0));',
    '    f *= 2.15; a *= 0.54;',
    '  }',
    '  return h;',
    '}',

    'void main(){',
    '  vec2 uv = gl_FragCoord.xy / uRes;',
    '  float asp = uRes.x / uRes.y;',
    '  vec2 p = (uv - 0.5) * vec2(asp, 1.0) + uPar*0.16;',
    '  p.y += uScroll * 0.22;',
    '  float t = uTime;',

    '  vec2 q = flow(p, t);',
    '  float e = 2.2 / uRes.y;',
    '  float h0 = crease(q);',
    '  float hx = crease(q + vec2(e, 0.0));',
    '  float hy = crease(q + vec2(0.0, e));',
    '  vec3 n = normalize(vec3((h0 - hx)/e, (h0 - hy)/e, 1.0/(uRelief*0.11)));',

    '  vec3 V = vec3(0.0, 0.0, 1.0);',
    '  vec3 L1 = normalize(vec3(-0.42, 0.60, 0.68));',
    '  vec3 L2 = normalize(vec3(0.68, -0.34, 0.55));',
    '  vec3 H1 = normalize(L1 + V), H2 = normalize(L2 + V);',
    '  float s1 = pow(max(dot(n, H1), 0.0), 110.0);',
    '  float s2 = pow(max(dot(n, H2), 0.0), 26.0);',
    '  float fres = pow(1.0 - clamp(n.z, 0.0, 1.0), 1.9);',

    '  float thick = h0*3.1*uFilm + fres*3.4 + t*0.010;',
    '  vec3 irid = mix(film(thick), film(thick*2.7 + 0.35), 0.34);',

    '  vec3 col = vec3(0.026, 0.028, 0.040);',
    '  col += vec3(0.90, 0.92, 1.00) * s1 * 1.20 * uSpec;',
    '  col += vec3(0.58, 0.64, 0.84) * s2 * 0.30 * uSpec;',
    '  col += irid * fres * 1.15 * uIrid;',
    '  col += irid * s2 * 0.55 * uIrid;',

    /* Провалы между складками уходят в чёрное: без этого фольга
       выглядит плоским молоком, а не металлом. */
    '  col *= mix(0.16, 1.0, smoothstep(0.06, 0.66, h0*0.62 + fres*0.80));',

    '  outColor = vec4(max(col, 0.0), 1.0);',
    '}'
  ].join('\n');

  var FRAG_MAIN = [
    '#version 300 es',
    'precision highp float;',
    'out vec4 outColor;',
    'uniform sampler2D uSrc;',
    'uniform vec2 uRes, uCur;',
    'uniform float uTime, uExp, uBlur, uCurAmt, uScroll;',
    'uniform float uHue, uSat, uSize, uAmp, uSpd, uCplx;',
    'uniform float uLens, uRim, uRimW, uCore, uDisp;',
    'uniform sampler2D uTexA, uTexB;',
    'uniform vec4 uFA, uFB;',      // x, y (снизу), высота в долях экрана, поворот
    'uniform vec2 uFAsp, uFOp;',   // пропорции кадров и непрозрачности
    NOISE,

    /* Экранная точка -> uv формы. Обратная той же позе, по которой
       слой форм рисует свой прямоугольник: поворот, масштаб, центр. */
    'vec2 formUV(vec2 d, float rot, float sc, float texAsp){',
    '  vec2 f = vec2(d.x, -d.y);',
    '  float c = cos(-rot), s = sin(-rot);',
    '  vec2 ab = vec2(f.x*c - f.y*s, f.x*s + f.y*c);',
    '  return vec2(ab.x / (sc*texAsp) + 0.5, ab.y / sc + 0.5);',
    '}',

    'float formA(sampler2D tx, vec4 F, float texAsp, float op, vec2 ac, float asp){',
    '  if (F.z <= 0.0001 || op <= 0.02) return 0.0;',
    '  vec2 uv = formUV(ac - vec2(F.x*asp, F.y), F.w, F.z, texAsp);',
    '  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;',
    /* мип-уровень 3: нужен плавный контур, а не пиксельная кромка */
    '  return textureLod(tx, uv, 3.0).a * op;',
    '}',

    /* Материал гнётся по градиенту альфы, поэтому искажение идёт вдоль
       всего силуэта формы, а не вокруг её центра. Пробы берутся в
       экранных координатах - так не нужно пересчитывать градиент
       обратно через поворот и масштаб. */
    'vec2 formBend(vec2 ac, float asp, inout float acc){',
    '  const float E = 0.014;',
    '  float a0 = formA(uTexA, uFA, uFAsp.x, uFOp.x, ac, asp)',
    '           + formA(uTexB, uFB, uFAsp.y, uFOp.y, ac, asp);',
    '  float ax = formA(uTexA, uFA, uFAsp.x, uFOp.x, ac + vec2(E, 0.0), asp)',
    '           + formA(uTexB, uFB, uFAsp.y, uFOp.y, ac + vec2(E, 0.0), asp);',
    '  float ay = formA(uTexA, uFA, uFAsp.x, uFOp.x, ac + vec2(0.0, E), asp)',
    '           + formA(uTexB, uFB, uFAsp.y, uFOp.y, ac + vec2(0.0, E), asp);',
    '  acc += min(a0, 1.0);',
    /* градиент направлен внутрь формы; выборку смещаем туда же */
    '  return -vec2(ax - a0, ay - a0) / E;',
    '}',

    'vec3 hue2rgb(float h){',
    '  vec3 k = abs(fract(h + vec3(0.0, 0.6666667, 0.3333333)) * 6.0 - 3.0);',
    '  return clamp(k - 1.0, 0.0, 1.0);',
    '}',

    'void main(){',
    '  vec2 uv = gl_FragCoord.xy / uRes;',
    '  float asp = uRes.x / uRes.y;',
    '  vec2 ac = vec2(uv.x*asp, uv.y);',
    '  vec2 cc = vec2(uCur.x*asp, uCur.y);',
    '  vec2 rel = ac - cc;',
    '  float r = length(rel) + 1e-5;',
    '  float ang = atan(rel.y, rel.x);',

    /* Сфера: радиус гуляет по углу четырьмя гармониками, сложность
       подключает старшие по очереди — от овала до рваной кляксы. */
    '  float T = uTime * uSpd;',
    '  float c1 = smoothstep(0.00, 0.40, uCplx);',
    '  float c2 = smoothstep(0.30, 0.72, uCplx);',
    '  float c3 = smoothstep(0.62, 1.00, uCplx);',
    '  float wob = sin(ang*2.0 + T*0.85) * 0.20',
    '            + sin(ang*3.0 - T*0.62 + 1.3) * 0.13 * c1',
    '            + sin(ang*5.0 + T*1.15 + 2.4) * 0.075 * c2',
    '            + sin(ang*7.0 - T*0.90 + 0.6) * 0.040 * c3;',
    '  float R = uSize * (1.0 + wob*uAmp) * (0.94 + 0.06*sin(T*0.5));',
    '  float inside = smoothstep(R, R*0.80, r);',
    '  float ring = smoothstep(R*(1.0 + uRimW), R, r) * smoothstep(R*(1.0 - uRimW*1.1), R*0.998, r);',

    /* Линза: спад как у гравитационной, свет тянет к центру сферы. */
    '  vec2 dirA = rel / r;',
    '  float bend = (R*R) / (r*r + R*R*0.30) * uCurAmt;',
    '  vec2 disp = vec2(dirA.x/asp, dirA.y) * bend * uLens;',

    '  float fbend = 0.0;',
    '  disp += formBend(ac, asp, fbend) * 0.0042;',

    '  float field = fbm(uv*2.3 + vec2(uTime*0.020, -uTime*0.014 + uScroll*0.30));',
    '  float lod = clamp((field*3.9 - 0.55) * uBlur - bend*2.2 - fbend*1.5, 0.0, 6.0) * 0.38;',

    '  float dsp = bend * uDisp;',
    '  vec2 o = vec2(dirA.x/asp, dirA.y);',
    '  vec3 col = vec3(',
    '    textureLod(uSrc, uv - disp - o*dsp*1.00, lod).r,',
    '    textureLod(uSrc, uv - disp - o*dsp*0.55, lod).g,',
    '    textureLod(uSrc, uv - disp - o*dsp*0.15, lod).b);',
    '  col *= uExp;',

    '  vec3 bc = mix(vec3(1.0), hue2rgb(uHue), uSat);',
    '  col = mix(col, col*(1.0 - uCore) + bc*0.085, inside*uCurAmt);',
    '  col += bc * ring * uRim * uCurAmt;',
    '  col += bc * exp(-max(r - R, 0.0)*7.5) * uRim * 0.10 * uCurAmt;',

    '  float vig = smoothstep(1.32, 0.28, length((uv - 0.5) * vec2(asp*0.86, 1.0)) * 1.55);',
    '  col *= mix(0.30, 1.0, vig);',

    /* Дизеринг: в тёмных градиентах восьми бит мало, иначе полосы. */
    '  float dth = hash(gl_FragCoord.xy + fract(uTime)*61.0) + hash(gl_FragCoord.yx - fract(uTime)*23.0) - 1.0;',
    '  col += dth * (1.7/255.0);',

    '  outColor = vec4(max(col, 0.0), 1.0);',
    '}'
  ].join('\n');

  var ZERO = { x: 0, y: 0, s: 0, rot: 0, o: 0 };

  function boot() {
    var canvas = document.getElementById('holo');
    if (!canvas) return;

    var gl = canvas.getContext('webgl2', {
      alpha: false, antialias: false, depth: false, powerPreference: 'high-performance',
      // только для отладки: иначе кадр не снять, вкладка в фоне не рисует
      preserveDrawingBuffer: /[?&]debug/.test(location.search)
    });
    if (!gl) return;                       // без WebGL2 остаётся градиентная подложка

    /* Шейдеры собираются в фоне. Раньше сразу после сборки шёл запрос
       статуса, и он останавливал страницу до конца компиляции: на
       холодном старте это сотни миллисекунд, и открывающая анимация
       заставки дёргалась. Теперь слой ждёт готовности программы и
       начинает рисовать, когда она собрана. Без расширения всё
       остаётся как было - синхронно. */
    var par = gl.getExtension('KHR_parallel_shader_compile');

    function build(fragSrc, names) {
      var v = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(v, VERT); gl.compileShader(v);
      var f = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(f, fragSrc); gl.compileShader(f);
      var p = gl.createProgram();
      gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
      return { p: p, f: f, names: names, u: null };
    }

    function finish(prog) {
      if (!gl.getProgramParameter(prog.p, gl.LINK_STATUS)) {
        console.warn('holo:', gl.getShaderInfoLog(prog.f) || gl.getProgramInfoLog(prog.p));
        return false;
      }
      var u = {};
      prog.names.forEach(function (n) { u[n] = gl.getUniformLocation(prog.p, n); });
      prog.u = u;
      return true;
    }

    var foil = build(FRAG_FOIL, ['uRes', 'uPar', 'uTime', 'uScroll', 'uRelief', 'uIrid', 'uFilm', 'uSpec', 'uFlow']);
    var main = build(FRAG_MAIN, ['uSrc', 'uRes', 'uCur', 'uTime', 'uExp', 'uBlur', 'uCurAmt', 'uScroll',
      'uHue', 'uSat', 'uSize', 'uAmp', 'uSpd', 'uCplx', 'uLens', 'uRim', 'uRimW', 'uCore', 'uDisp',
      'uTexA', 'uTexB', 'uFA', 'uFB', 'uFAsp', 'uFOp']);

    /* 'wait' - ещё компилируется, 'fail' - не собралось, 'ok' - можно рисовать */
    var linked = false;
    function link() {
      if (par && !(gl.getProgramParameter(foil.p, par.COMPLETION_STATUS_KHR) &&
                   gl.getProgramParameter(main.p, par.COMPLETION_STATUS_KHR))) return 'wait';
      if (!finish(foil) || !finish(main)) return 'fail';
      gl.useProgram(main.p);
      gl.uniform1i(main.u.uSrc, 0);
      gl.uniform1i(main.u.uTexA, 1);
      gl.uniform1i(main.u.uTexB, 2);
      document.documentElement.classList.add('holo-on');
      linked = true;
      return 'ok';
    }

    gl.bindVertexArray(gl.createVertexArray());

    var tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var fbo = gl.createFramebuffer(), fw = 0, fh = 0;

    /* Те же файлы, что у слоя форм: браузер отдаст их из кэша. */
    var base = canvas.getAttribute('data-base') || '';
    var FORM_SRC = ['assets/hero-organic-v2.webp', 'assets/hero-organic-v3.webp'];
    var formTex = [null, null];
    var formAsp = [1, 1.5];

    FORM_SRC.forEach(function (src, i) {
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () {
        var t = gl.createTexture();
        gl.activeTexture(gl.TEXTURE1 + i);
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        formTex[i] = t;
        formAsp[i] = img.naturalWidth / img.naturalHeight;
      };
      img.src = base + src;
    });

    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var cur = [0.5, 0.55], curT = [0.5, 0.55];
    var prevT = 0, clock = 0, mipTick = false;

    if (fine && !still) {
      window.addEventListener('pointermove', function (e) {
        curT[0] = e.clientX / window.innerWidth;
        curT[1] = 1 - e.clientY / window.innerHeight;
      }, { passive: true });
    }

    /* Фон — мягкая картинка без резких краёв, высокая плотность
       пикселей ему не нужна: экономим здесь, а не на материале. */
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.15);
      var w = Math.round(window.innerWidth * dpr);
      var h = Math.round(window.innerHeight * dpr);
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w; canvas.height = h;
      fw = Math.round(w * 0.62); fh = Math.round(h * 0.62);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fw, fh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    function frame(now) {
      if (!linked) {
        var st = link();
        if (st === 'fail') return;              // остаётся градиентная подложка
        if (st === 'wait') { requestAnimationFrame(frame); return; }
      }
      requestAnimationFrame(frame);
      resize();

      var dt = prevT ? Math.min((now - prevT) / 1000, 0.05) : 0.016;
      prevT = now;
      if (!still) clock += dt * P.spd;
      var t = clock;

      /* Курсор: постоянная времени 40 мс, независимо от частоты кадров. */
      var k = 1 - Math.exp(-dt / 0.040);
      cur[0] += (curT[0] - cur[0]) * k;
      cur[1] += (curT[1] - cur[1]) * k;

      var doc = document.documentElement;
      var scroll = window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight);

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, fw, fh);
      gl.useProgram(foil.p);
      gl.uniform2f(foil.u.uRes, fw, fh);
      gl.uniform2f(foil.u.uPar, (cur[0] - 0.5) * 0.6, (cur[1] - 0.5) * 0.6);
      gl.uniform1f(foil.u.uTime, t);
      gl.uniform1f(foil.u.uScroll, scroll);
      gl.uniform1f(foil.u.uRelief, P.relief);
      gl.uniform1f(foil.u.uIrid, P.irid);
      gl.uniform1f(foil.u.uFilm, P.film);
      gl.uniform1f(foil.u.uSpec, P.spec);
      gl.uniform1f(foil.u.uFlow, P.flow);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      /* Мип-цепочка нужна для неоднородного размытия, но материал
         меняется медленно - пересобираем её через кадр. Отставание
         размытых уровней на один кадр увидеть нельзя. */
      mipTick = !mipTick;
      if (mipTick) gl.generateMipmap(gl.TEXTURE_2D);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(main.p);
      var u = main.u;
      gl.uniform2f(u.uRes, canvas.width, canvas.height);
      gl.uniform2f(u.uCur, cur[0], cur[1]);
      gl.uniform1f(u.uTime, t);
      gl.uniform1f(u.uExp, P.exp);
      gl.uniform1f(u.uBlur, P.blur);
      gl.uniform1f(u.uCurAmt, fine && !still ? P.cur : 0);
      gl.uniform1f(u.uScroll, scroll);
      gl.uniform1f(u.uHue, P.hue);
      gl.uniform1f(u.uSat, P.sat);
      gl.uniform1f(u.uSize, P.size);
      gl.uniform1f(u.uAmp, P.amp);
      gl.uniform1f(u.uSpd, P.morph);
      gl.uniform1f(u.uCplx, P.cplx);
      gl.uniform1f(u.uLens, P.lens);
      gl.uniform1f(u.uRim, P.rim);
      gl.uniform1f(u.uRimW, P.rimw);
      gl.uniform1f(u.uCore, P.core);
      gl.uniform1f(u.uDisp, P.disp);

      /* Слой форм публикует позу; без него формы просто нулевые. */
      var fp = window.__formPose;
      var k = (fp && fp.knot) || ZERO;
      var rb = (fp && fp.ribbon) || ZERO;
      gl.uniform4f(u.uFA, k.x, k.y, formTex[0] ? k.s : 0, k.rot);
      gl.uniform4f(u.uFB, rb.x, rb.y, formTex[1] ? rb.s : 0, rb.rot);
      gl.uniform2f(u.uFAsp, formAsp[0], formAsp[1]);
      gl.uniform2f(u.uFOp, k.o, rb.o);
      if (formTex[0]) { gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, formTex[0]); }
      if (formTex[1]) { gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, formTex[1]); }
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    requestAnimationFrame(frame);

    if (/[?&]debug/.test(location.search)) {
      window.__holo = { step: frame, params: P, gl: gl, canvas: canvas };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
