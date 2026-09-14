/* ============================================================
   Живые формы

   Две готовых 3D-формы (WebP с альфой) летят сквозь страницу
   одним непрерывным движением: секции - это путевые точки,
   между ними поза интерполируется.

   Формы не крутятся - их переосвещают. Из яркости самого рендера
   оператором Собеля выводится псевдонормаль поверхности: у чёрного
   глянца светлое пятно = грань, повёрнутая к свету, поэтому градиент
   яркости повторяет кривизну. По этой нормали считается новый блик,
   который едет от прокрутки и от курсора. Статичная картинка
   начинает выглядеть как мокрый металл, поворачивающийся к свету.
   ============================================================ */

(function () {
  'use strict';

  var SOURCES = {
    knot: 'assets/hero-organic-v2.webp',
    ribbon: 'assets/hero-organic-v3.webp'
  };

  /* Поза: x/y - центр в долях вьюпорта, s - высота формы в долях
     высоты экрана, rot - градусы, o - непрозрачность, lod - размытие
     через мип-уровень, glow - сила студийной подсветки под формой.

     Композиционное правило: форма никогда не в центре и никогда
     не целиком в кадре. Её режет край экрана, видно 35-60%, и она
     лежит по диагонали, противоположной текстовому блоку. */
  var POSES = {
    top: {
      ribbon: { x: 0.99, y: 0.13, s: 0.98, rot: -16, o: 0.95, lod: 0.2, glow: 0.80, hue: 0.00 },
      knot: { x: 0.08, y: 1.45, s: 0.85, rot: 6, o: 0.00, lod: 1.8, glow: 0.00, hue: 0.10 }
    },
    profile: {
      ribbon: { x: 1.28, y: -0.16, s: 0.95, rot: -24, o: 0.30, lod: 1.5, glow: 0.20, hue: 0.06 },
      knot: { x: -0.08, y: 0.60, s: 1.05, rot: 8, o: 0.80, lod: 0.5, glow: 0.70, hue: 0.12 }
    },
    contours: {
      ribbon: { x: 1.32, y: 0.70, s: 0.90, rot: -34, o: 0.12, lod: 2.2, glow: 0.10, hue: 0.18 },
      knot: { x: -0.20, y: 1.06, s: 1.15, rot: 20, o: 0.50, lod: 1.0, glow: 0.45, hue: 0.20 }
    },
    graphics: {
      ribbon: { x: 0.22, y: 0.94, s: 1.30, rot: 168, o: 0.55, lod: 2.0, glow: 0.50, hue: 0.30 },
      knot: { x: -0.32, y: 0.28, s: 0.95, rot: 30, o: 0.15, lod: 2.6, glow: 0.12, hue: 0.28 }
    },
    thesis: {
      ribbon: { x: 1.10, y: 0.46, s: 1.55, rot: 246, o: 0.26, lod: 1.3, glow: 0.22, hue: 0.40 },
      knot: { x: -0.40, y: 0.10, s: 0.80, rot: 44, o: 0.05, lod: 3.0, glow: 0.05, hue: 0.36 }
    },
    projects: {
      ribbon: { x: 1.34, y: 0.92, s: 1.00, rot: 20, o: 0.10, lod: 2.4, glow: 0.08, hue: 0.50 },
      knot: { x: 0.90, y: 0.04, s: 0.58, rot: -14, o: 0.70, lod: 0.0, glow: 0.50, hue: 0.46 }
    },
    path: {
      ribbon: { x: 0.50, y: 0.80, s: 0.72, rot: 2, o: 0.45, lod: 1.0, glow: 0.40, hue: 0.58 },
      knot: { x: 1.16, y: 0.14, s: 0.62, rot: -30, o: 0.20, lod: 1.8, glow: 0.15, hue: 0.54 }
    },
    contact: {
      ribbon: { x: 0.62, y: 0.80, s: 1.12, rot: -6, o: 0.88, lod: 0.1, glow: 1.00, hue: 0.68 },
      knot: { x: 0.26, y: 0.92, s: 0.95, rot: -20, o: 0.60, lod: 0.4, glow: 0.85, hue: 0.72 }
    }
  };

  var ORDER = ['top', 'profile', 'contours', 'graphics', 'thesis', 'projects', 'path', 'contact'];
  var FIELDS = ['x', 'y', 's', 'rot', 'o', 'lod', 'glow', 'hue'];

  var VERT = [
    '#version 300 es',
    'in vec2 aPos;',
    'uniform vec2 uRes, uCenter, uHalf;',
    'uniform float uRot, uFlip;',
    'out vec2 vUv;',
    'void main(){',
    '  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);',
    '  vec2 q = vec2(aPos.x * uFlip, -aPos.y) * uHalf;',
    '  float c = cos(uRot), s = sin(uRot);',
    '  q = vec2(q.x * c - q.y * s, q.x * s + q.y * c);',
    '  vec2 px = uCenter + q;',
    '  gl_Position = vec4(px.x / uRes.x * 2.0 - 1.0, 1.0 - px.y / uRes.y * 2.0, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAG = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 vUv;',
    'out vec4 outColor;',
    'uniform sampler2D uTex;',
    'uniform vec2 uTexel, uLight;',
    'uniform vec3 uMask;',
    'uniform float uLod, uOpacity, uTime, uWarp, uHue, uRelief, uSpec, uRim, uAmbient, uGlow, uMode, uSpread;',

    // Тонкоплёночная интерференция: разные множители на канал дают
    // спектральные полосы, а не один общий сдвиг оттенка.
    'vec3 film(float p){',
    '  const float TAU = 6.28318;',
    '  return vec3(0.5 + 0.5 * cos(TAU * (p * 1.00)),',
    '              0.5 + 0.5 * cos(TAU * (p * 1.19) + 1.05),',
    '              0.5 + 0.5 * cos(TAU * (p * 1.41) + 2.10));',
    '}',

    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'vec2 hash2(vec2 p){',
    '  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);',
    '}',

    'vec4 samp(vec2 uv){ return textureLod(uTex, uv, uLod); }',
    'float lum(vec2 uv){ vec4 c = samp(uv); return dot(c.rgb, vec3(0.299, 0.587, 0.114)); }',

    'void main(){',
    // Режим 0: мягкая тень под формой. Пока фоном был чёрный, здесь
    // лежало пятно света - иначе тёмный хром не читался. С живой
    // фольгой фон сам светлый, и форме нужно обратное: затемнение,
    // которое отделяет её от материала того же семейства.
    // Цвет нулевой, работает только альфа: dst * (1 - a).
    '  if (uMode < 0.5) {',
    '    float d = length(vUv - 0.5) * 2.0;',
    '    float a = pow(max(1.0 - d, 0.0), 2.4);',
    '    outColor = vec4(0.0, 0.0, 0.0, a * uGlow);',
    '    return;',
    '  }',

    // Режим 2: свита формы. Частицы живут не по всему кадру, а в полосе
    // вокруг силуэта: размытая альфа формы задаёт, где им быть, поэтому
    // рой повторяет очертания и летит вместе с ней.
    '  if (uMode > 1.5) {',
    '    vec2 fp = (vUv - 0.5) * uSpread + 0.5;',
    /* Размытый силуэт задаёт, где рою быть: полоса берётся по малым
       значениям альфы, то есть вокруг формы, а не на ней. Мип высокий,
       чтобы ореол выходил за очертания. У кадров формы по краям есть
       прозрачный запас, в нём рой и летает. */
    '    float sil = textureLod(uTex, fp, 5.0).a;',
    /* Полоса широкая: рой должен читаться и вплотную к форме, и заметно
       в стороне от неё, иначе его просто не видно на пёстрой фольге. */
    '    float band = smoothstep(0.004, 0.09, sil) * (1.0 - smoothstep(0.55, 0.99, sil));',

    /* Два гашения по краям - от них и были прямоугольники.
       Первое: за пределами кадра формы выборка идёт по CLAMP_TO_EDGE
       и размазывает краевые тексели в прямые полосы. Второе: ореол
       частицы, попавшей к границе квада, обрезался ровным краем. */
    '    vec2 fe = min(fp, 1.0 - fp);',
    '    band *= smoothstep(0.0, 0.035, min(fe.x, fe.y));',
    '    vec2 qe = min(vUv, 1.0 - vUv);',
    '    band *= smoothstep(0.0, 0.075, min(qe.x, qe.y));',
    '    if (band < 0.015) discard;',
    '    vec3 acc = vec3(0.0);',
    '    float aSum = 0.0;',
    /* два слоя роя: крупный ближе, мелкий дальше и быстрее */
    /* Соседние ячейки обязательны: ореол частицы шире своей ячейки,
       и если считать только ту, в которой оказался пиксель, свечение
       обрезается прямо по её границе - отсюда и были квадраты. */
    '    for (int L = 0; L < 2; L++) {',
    '      float sc = L == 0 ? 20.0 : 34.0;',
    '      float sp = L == 0 ? 1.0 : 1.7;',
    '      vec2 g = vUv * sc + vec2(uTime * 0.055 * sp, -uTime * 0.032 * sp) + float(L) * 7.3;',
    '      vec2 id = floor(g), f = fract(g) - 0.5;',
    '      for (int oy = -1; oy <= 1; oy++) {',
    '        for (int ox = -1; ox <= 1; ox++) {',
    '          vec2 nb = vec2(float(ox), float(oy));',
    '          vec2 nid = id + nb;',
    '          float h = hash(nid + float(L) * 3.1);',
    '          if (h < 0.74) continue;',
    '          vec2 off = (hash2(nid + float(L) * 5.7) - 0.5) * 0.72;',
    '          float rad = (L == 0 ? 0.30 : 0.20) * (0.45 + fract(h * 13.0));',
    '          float d = length(f - (nb + off));',
    '          float core = pow(smoothstep(rad, 0.0, d), 1.8);',
    '          float halo = smoothstep(rad * 2.6, 0.0, d) * 0.34;',
    '          float tw = 0.55 + 0.45 * sin(uTime * 1.6 + h * 41.0);',
    '          vec3 tint = film(h * 1.7 + uHue + uTime * 0.02);',
    '          float amt = (core + halo) * tw * (L == 0 ? 1.0 : 0.62);',
    '          acc += tint * amt;',
    '          aSum += amt;',
    '        }',
    '      }',
    '    }',
    /* Светятся ощутимо: множитель подбирался под яркую фольгу. */
    '    float k = band * uOpacity * uGlow * 2.6;',
    '    float A2 = clamp(aSum * k, 0.0, 1.0);',
    '    outColor = vec4(acc * k, A2);',
    '    return;',
    '  }',

    '  vec2 uv = vUv;',
    '  uv += vec2(sin(uv.y * 8.5 + uTime * 0.55), cos(uv.x * 7.2 - uTime * 0.43)) * uWarp;',
    '  vec4 src = samp(uv);',
    '  float a = src.a;',
    '  if (a < 0.004) discard;',
    '  vec3 base = src.rgb / max(a, 0.004);',

    // Псевдонормаль из собственной яркости рендера.
    '  vec2 e = uTexel * (1.0 + uLod * 1.8);',
    '  float lx = lum(uv + vec2(e.x, 0.0)) - lum(uv - vec2(e.x, 0.0));',
    '  float ly = lum(uv + vec2(0.0, e.y)) - lum(uv - vec2(0.0, e.y));',
    '  vec3 n = normalize(vec3(-lx * uRelief, -ly * uRelief, 1.0));',

    '  vec3 L = normalize(vec3(uLight, 0.9));',
    '  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));',
    '  float spec = pow(max(dot(n, H), 0.0), 38.0);',
    '  float wide = pow(max(dot(n, L), 0.0), 3.0);',
    '  float fres = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.0);',

    '  vec3 irid = film(fres * 1.25 + lum(uv) * 0.85 + uHue);',
    '  vec3 col = base * uAmbient;',
    '  col += irid * fres * uRim;',
    '  col += irid * wide * uRim * 0.35;',
    '  col += vec3(1.0, 0.96, 1.0) * spec * uSpec;',

    '  float o = uOpacity;',
    // Передний слой показывает только одну дугу - ту, что проходит
    // перед плечом на портрете.
    '  if (uMask.z > 0.0) {',
    '    o *= 1.0 - smoothstep(uMask.z * 0.45, uMask.z, length((vUv - uMask.xy) * vec2(1.5, 1.0)));',
    '  }',
    '  float A = a * o;',
    '  outColor = vec4(col * A, A);',
    '}'
  ].join('\n');

  function compile(gl, type, src, check) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (check && !gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn('forms: shader', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  function Renderer(canvas, opts) {
    var gl = canvas.getContext('webgl2', {
      alpha: true, antialias: false, depth: false,
      premultipliedAlpha: true, powerPreference: 'high-performance',
      // только для отладки: иначе кадр не снять, вкладка в фоне не рисует
      preserveDrawingBuffer: /[?&]debug/.test(location.search)
    });
    if (!gl) return null;

    /* Сборка шейдера в фоне - см. holo.js: синхронный запрос статуса
       останавливал страницу на всё время компиляции. Программа
       доводится до рабочего состояния в linkReady, когда готова. */
    var par = gl.getExtension('KHR_parallel_shader_compile');
    var vs = compile(gl, gl.VERTEX_SHADER, VERT, !par);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG, !par);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    if (!par && !gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('forms: link', gl.getProgramInfoLog(prog));
      return null;
    }

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    // Текстуры грузятся с premultiply, поэтому по цвету множитель ONE:
    // так по краю альфы не появляется светлой каймы.
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    return {
      gl: gl, canvas: canvas, U: null, opts: opts || {}, tex: {}, w: 0, h: 0,
      prog: prog, fs: fs, par: par, ready: false, dead: false
    };
  }

  var UNIFORMS = ['uRes', 'uCenter', 'uHalf', 'uRot', 'uFlip', 'uTex', 'uTexel', 'uLight',
    'uMask', 'uLod', 'uOpacity', 'uTime', 'uWarp', 'uHue', 'uRelief',
    'uSpec', 'uRim', 'uAmbient', 'uGlow', 'uMode', 'uSpread'];

  function linkReady(r) {
    if (r.ready) return true;
    if (r.dead) return false;
    var gl = r.gl;
    if (r.par && !gl.getProgramParameter(r.prog, r.par.COMPLETION_STATUS_KHR)) return false;
    if (!gl.getProgramParameter(r.prog, gl.LINK_STATUS)) {
      console.warn('forms: link', gl.getShaderInfoLog(r.fs) || gl.getProgramInfoLog(r.prog));
      r.dead = true;
      return false;
    }
    gl.useProgram(r.prog);
    var U = {};
    UNIFORMS.forEach(function (n) { U[n] = gl.getUniformLocation(r.prog, n); });
    gl.uniform1i(U.uTex, 0);
    r.U = U;
    r.ready = true;
    if (r.w) gl.uniform2f(U.uRes, r.w, r.h);   // размер мог прийти раньше программы
    return true;
  }

  function loadTexture(r, key, img) {
    var gl = r.gl;
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    r.tex[key] = { id: t, w: img.naturalWidth, h: img.naturalHeight };
  }

  function resize(r) {
    // Ширину меряем каждый кадр: на старте вкладка может быть свёрнута,
    // и снятое один раз значение оболгало бы устройство.
    /* Плотность холста форм понижена: самый дорогой проход здесь -
       рой частиц, а он считается на каждый пиксель. Формы мягкие,
       без резких краёв, разницы на глаз нет. */
    var dpr = Math.min(window.devicePixelRatio || 1,
      window.innerWidth >= 900 ? 1.35 : 1.15);
    var cw = Math.round(window.innerWidth * dpr);
    var ch = Math.round(window.innerHeight * dpr);
    if (cw === r.w && ch === r.h) return;
    r.w = cw; r.h = ch;
    r.canvas.width = cw;
    r.canvas.height = ch;
    r.gl.viewport(0, 0, cw, ch);
    if (r.ready) r.gl.uniform2f(r.U.uRes, cw, ch);
  }

  function draw(r, key, pose, env) {
    var t = r.tex[key];
    if (!t || pose.o <= 0.004) return;
    var gl = r.gl, U = r.U;
    var halfH = pose.s * r.h * 0.5;
    var halfW = halfH * (t.w / t.h);

    gl.bindTexture(gl.TEXTURE_2D, t.id);
    gl.uniform2f(U.uCenter, pose.x * r.w, pose.y * r.h);
    gl.uniform1f(U.uRot, pose.rot * Math.PI / 180);
    gl.uniform1f(U.uFlip, 1);
    gl.uniform1f(U.uHue, pose.hue);
    gl.uniform1f(U.uTime, env.time);

    // Тень кладётся шире формы и рисуется первой.
    if (pose.glow > 0.004 && !r.opts.mask) {
      gl.uniform1f(U.uMode, 0);
      gl.uniform1f(U.uGlow, Math.min(pose.glow * 0.62, 0.72));
      gl.uniform2f(U.uHalf, halfW * 1.55, halfH * 1.55);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    gl.uniform1f(U.uMode, 1);
    gl.uniform2f(U.uHalf, halfW, halfH);
    gl.uniform2f(U.uTexel, 1 / t.w, 1 / t.h);
    gl.uniform1f(U.uLod, pose.lod);
    gl.uniform1f(U.uOpacity, pose.o);
    gl.uniform2f(U.uLight, env.lx, env.ly);
    gl.uniform1f(U.uWarp, env.warp);
    gl.uniform1f(U.uRelief, 9.0);
    gl.uniform1f(U.uSpec, 1.35);
    gl.uniform1f(U.uRim, 0.85);
    gl.uniform1f(U.uAmbient, 1.15);
    var m = r.opts.mask;
    gl.uniform3f(U.uMask, m ? m[0] : 0, m ? m[1] : 0, m ? m[2] : 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Свита: рисуется поверх формы и выходит за её края.
    if (!r.opts.mask && pose.o > 0.08) {
      var K = 1.28;
      gl.uniform1f(U.uMode, 2);
      gl.uniform1f(U.uSpread, K);
      gl.uniform1f(U.uGlow, 1.0);
      gl.uniform2f(U.uHalf, halfW * K, halfH * K);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  /* Значения каждого поля по всем восьми точкам — считаются один раз. */
  var TRACK = { knot: {}, ribbon: {} };
  ['knot', 'ribbon'].forEach(function (form) {
    FIELDS.forEach(function (f) {
      TRACK[form][f] = ORDER.map(function (id) {
        var v = POSES[id][form][f];
        return v === undefined ? 0 : v;
      });
    });
  });

  /* Разумные пределы: сплайн умеет вылетать за крайние значения. */
  var LIMIT = { o: [0, 1], lod: [0, 6], s: [0.05, 3], glow: [0, 1.2] };

  /* Кардинальный сплайн по неравномерным узлам.

     Раньше поза шла отрезками со smoothstep: на каждой путевой точке
     скорость падала в ноль и снова разгонялась — отсюда и рваность,
     «то стоят, то скачут». Здесь касательная в узле считается через
     соседние узлы с поправкой на расстояние между ними, поэтому
     скорость непрерывна на всём пути и не зависит от того, что секции
     разной высоты. */
  function spline(v, k, i, focus) {
    var n = v.length - 1;
    var i0 = i > 0 ? i - 1 : 0;
    var i1 = i;
    var i2 = i < n ? i + 1 : n;
    var i3 = i2 < n ? i2 + 1 : n;
    var t1 = k[i1], t2 = k[i2], h = t2 - t1;
    if (!(h > 0)) return v[i1];
    var s = Math.min(1, Math.max(0, (focus - t1) / h));
    var d0 = k[i2] - k[i0], d1 = k[i3] - k[i1];
    var m1 = d0 > 0 ? (v[i2] - v[i0]) / d0 : 0;
    var m2 = d1 > 0 ? (v[i3] - v[i1]) / d1 : 0;
    var s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * v[i1]
      + (s3 - 2 * s2 + s) * h * m1
      + (-2 * s3 + 3 * s2) * v[i2]
      + (s3 - s2) * h * m2;
  }

  function boot() {
    var back = document.getElementById('forms');
    if (!back) return;

    // Статика лежит рядом со страницей, Next отдаёт её от корня.
    var base = back.getAttribute('data-base') || '';

    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var main = Renderer(back, {});
    if (!main) return;

    var frontCanvas = document.getElementById('forms-front');
    if (frontCanvas) frontCanvas.hidden = true;

    var renderers = [main];
    var front = null, frontTried = false;
    var heroEl = document.getElementById('top');
    var poseA = {}, poseB = {}, poseF = {};
    var images = {};
    var marks = [];
    var loaded = 0, started = false;
    var px = 0, py = 0, tx = 0, ty = 0;
    var lens = window.__formPose = {
      knot: { x: 0, y: 0, s: 0, rot: 0, o: 0 },
      ribbon: { x: 0, y: 0, s: 0, rot: 0, o: 0 }
    };

    /* Дуга ленты, проходящая перед портретом: те же экранные
       координаты, что у фона, поэтому стык незаметен. Слой поднимается
       лениво - на узком экране и при reduce-motion он не нужен. */
    function ensureFront() {
      if (front || frontTried || !frontCanvas) return;
      if (still || window.innerWidth < 900) return;
      if ((navigator.hardwareConcurrency || 8) <= 4) { frontTried = true; return; }
      frontTried = true;
      front = Renderer(frontCanvas, { mask: [0.30, 0.72, 0.28] });
      if (!front) return;
      Object.keys(images).forEach(function (k) { loadTexture(front, k, images[k]); });
      frontCanvas.hidden = false;
      renderers.push(front);
    }

    function measure() {
      marks = ORDER.map(function (id) {
        var el = document.getElementById(id);
        if (!el) return null;
        var r = el.getBoundingClientRect();
        return r.top + window.scrollY + r.height * 0.5;
      });
    }

    function fill(form, out, i, focus) {
      for (var k = 0; k < FIELDS.length; k++) {
        var f = FIELDS[k];
        var v = spline(TRACK[form][f], marks, i, focus);
        var lim = LIMIT[f];
        out[f] = lim ? Math.min(lim[1], Math.max(lim[0], v)) : v;
      }
    }

    function poseAt(focus) {
      var last = ORDER.length - 1;
      var i = 0;
      while (i < last && marks[i + 1] !== null && focus > marks[i + 1]) i++;
      fill('knot', poseA, i, focus);
      fill('ribbon', poseB, i, focus);
      var m0 = marks[0], m1 = marks[last];
      return (m1 > m0) ? Math.min(1, Math.max(0, (focus - m0) / (m1 - m0))) : 0;
    }

    function start() {
      if (started) return;
      started = true;
      document.documentElement.classList.add('forms-on');
      measure();
      window.addEventListener('resize', function () {
        measure();
        renderers.forEach(resize);
      }, { passive: true });
      // Схема этапов и фильтр проектов меняют высоту страницы.
      if (window.ResizeObserver) {
        new ResizeObserver(measure).observe(document.body);
      }
      requestAnimationFrame(frame);
    }

    function frame(now) {
      requestAnimationFrame(frame);
      ensureFront();
      renderers.forEach(resize);

      var time = still ? 0 : now * 0.001;
      px += (tx - px) * 0.06;
      py += (ty - py) * 0.06;

      var prog = poseAt(window.scrollY + window.innerHeight * 0.5);

      // Свет едет от прокрутки и подхватывает курсор.
      var ang = -0.85 + prog * Math.PI * 1.35 + px * 0.55;
      var env = {
        time: time,
        lx: Math.cos(ang) * 0.85,
        ly: Math.sin(ang) * 0.85 - py * 0.25,
        warp: still ? 0 : 0.0022
      };

      // Дыхание масштаба и лёгкий доворот - только вне reduce-motion.
      if (!still) {
        var br = Math.sin(time * 0.31) * 0.018;
        poseA.s *= 1 + br;
        poseB.s *= 1 - br;
        poseA.rot += Math.sin(time * 0.24) * 1.8;
        poseB.rot += Math.cos(time * 0.19) * 1.6;
      }

      /* Формы сообщают фону свою позу целиком. Фон берёт по ней альфу
         формы и гнёт материал по её градиенту, то есть вдоль всего
         силуэта, а не вокруг одной точки. y переводим в систему фона:
         здесь он считается от верха, там - от низа. */
      lens.knot.x = poseA.x; lens.knot.y = 1 - poseA.y;
      lens.knot.s = poseA.s; lens.knot.rot = poseA.rot * Math.PI / 180;
      lens.knot.o = poseA.o;
      lens.ribbon.x = poseB.x; lens.ribbon.y = 1 - poseB.y;
      lens.ribbon.s = poseB.s; lens.ribbon.rot = poseB.rot * Math.PI / 180;
      lens.ribbon.o = poseB.o;

      var gl = main.gl;
      if (linkReady(main)) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        draw(main, 'knot', poseA, env);
        draw(main, 'ribbon', poseB, env);
      }

      if (front && linkReady(front)) {
        var fg = front.gl;
        fg.clear(fg.COLOR_BUFFER_BIT);
        var vis = 0;
        if (heroEl) {
          var r = heroEl.getBoundingClientRect();
          vis = Math.max(0, Math.min(1, (r.bottom - 40) / Math.max(r.height, 1)));
        }
        if (vis > 0.01) {
          for (var k = 0; k < FIELDS.length; k++) poseF[FIELDS[k]] = poseB[FIELDS[k]];
          poseF.o = poseB.o * vis;
          draw(front, 'ribbon', poseF, env);
        }
      }
    }

    // Ручной прогон кадра для отладки: вкладка в фоне замораживает rAF,
    // и без этого сцену не проверить.
    if (/[?&]debug/.test(location.search)) {
      window.__forms = {
        main: main, step: frame, poses: POSES, order: ORDER,
        measure: measure, front: function () { return front; },
        live: function () { return { knot: poseA, ribbon: poseB, marks: marks }; }
      };
    }

    Object.keys(SOURCES).forEach(function (key) {
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () {
        images[key] = img;
        renderers.forEach(function (r) { loadTexture(r, key, img); });
        if (++loaded === 2) start();
      };
      img.onerror = function () { if (++loaded === 2) start(); };
      img.src = base + SOURCES[key];
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
