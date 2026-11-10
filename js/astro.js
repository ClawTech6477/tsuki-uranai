/* astro.js — 月と太陽の黄経を天文計算で出す(ブラウザ内で完結・送信なし)
 * 出典: J. Meeus『Astronomical Algorithms』2nd ed. 第47章(月: 主要34項+加算3項, 誤差おおむね0.05°以内)
 *       第25章(太陽: 低精度式, 誤差0.01°程度)。黄経は回帰黄道(西洋占星術の12星座)。
 * 月は1時間に約0.5°動くので、星座の境目の時刻は数分の精度で出る。
 */
(function (g) {
  "use strict";
  var R = Math.PI / 180;
  function n360(x) { x %= 360; return x < 0 ? x + 360 : x; }
  // [D, M, M', F, 係数(1e-6度)]
  var TL = [
    [0,0,1,0,6288774],[2,0,-1,0,1274027],[2,0,0,0,658314],[0,0,2,0,213618],[0,1,0,0,-185116],
    [0,0,0,2,-114332],[2,0,-2,0,58793],[2,-1,-1,0,57066],[2,0,1,0,53322],[2,-1,0,0,45758],
    [0,1,-1,0,-40923],[1,0,0,0,-34720],[0,1,1,0,-30383],[2,0,0,-2,15327],[0,0,1,2,-12528],
    [0,0,1,-2,10980],[4,0,-1,0,10675],[0,0,3,0,10034],[4,0,-2,0,8548],[2,1,-1,0,-7888],
    [2,1,0,0,-6766],[1,0,-1,0,-5163],[1,1,0,0,4987],[2,-1,1,0,4036],[2,0,2,0,3994],
    [4,0,0,0,3861],[2,0,-3,0,3665],[0,1,-2,0,-2689],[2,0,-1,2,-2602],[2,-1,-2,0,2390],
    [1,0,1,0,-2348],[2,-2,0,0,2236],[0,1,2,0,-2120],[0,2,0,0,-2069]
  ];
  function jdOf(date) { return date.getTime() / 86400000 + 2440587.5 + 69 / 86400; } // UT→TT(ΔT≈69秒)
  function T(date) { return (jdOf(date) - 2451545.0) / 36525; }

  function moonLon(date) {
    var t = T(date), t2 = t * t, t3 = t2 * t, t4 = t3 * t;
    var Lp = 218.3164477 + 481267.88123421 * t - 0.0015786 * t2 + t3 / 538841 - t4 / 65194000;
    var D = 297.8501921 + 445267.1114034 * t - 0.0018819 * t2 + t3 / 545868 - t4 / 113065000;
    var M = 357.5291092 + 35999.0502909 * t - 0.0001536 * t2 + t3 / 24490000;
    var Mp = 134.9633964 + 477198.8675055 * t + 0.0087414 * t2 + t3 / 69699 - t4 / 14712000;
    var F = 93.2720950 + 483202.0175233 * t - 0.0036539 * t2 - t3 / 3526000 + t4 / 863310000;
    var A1 = 119.75 + 131.849 * t, E = 1 - 0.002516 * t - 0.0000074 * t2;
    var s = 0;
    for (var i = 0; i < TL.length; i++) {
      var r = TL[i], c = r[4], am = Math.abs(r[1]);
      if (am === 1) c *= E; else if (am === 2) c *= E * E;
      s += c * Math.sin((r[0] * D + r[1] * M + r[2] * Mp + r[3] * F) * R);
    }
    s += 3958 * Math.sin(A1 * R) + 1962 * Math.sin((Lp - F) * R) + 318 * Math.sin((53.09 + 479264.290 * t) * R);
    return n360(Lp + s / 1e6);
  }

  function sunLon(date) {
    var t = T(date);
    var L0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
    var M = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
    var C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(M * R)
          + (0.019993 - 0.000101 * t) * Math.sin(2 * M * R) + 0.000289 * Math.sin(3 * M * R);
    return n360(L0 + C - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * t) * R));
  }

  function elong(date) { return n360(moonLon(date) - sunLon(date)); } // 0=新月, 180=満月
  function signOf(lon) { return Math.floor(n360(lon) / 30); }
  function add(date, h) { return new Date(date.getTime() + h * 3600000); }

  // f(date) が a→b の間で条件 pass を初めて満たす時刻を二分法で(1分精度)
  function bisect(a, b, pass) {
    for (var i = 0; i < 30 && b - a > 60000; i++) {
      var m = new Date((a.getTime() + b.getTime()) / 2);
      if (pass(m)) b = m; else a = m;
    }
    return new Date(b);
  }

  // 次の新月(target=0)/満月(180)。from から先を6時間刻みで探す
  function nextPhase(from, target) {
    var off = function (d) { return n360(elong(d) - target + 180) - 180; }; // -180..180, 通過時に負→正
    var a = from, prev = off(a);
    for (var h = 6; h <= 24 * 32; h += 6) {
      var b = add(from, h), cur = off(b);
      if (prev < 0 && cur >= 0) return bisect(a, b, function (d) { return off(d) >= 0; });
      a = b; prev = cur;
    }
    return null;
  }
  function prevNewMoon(from) {
    var off = function (d) { return n360(elong(d) + 180) - 180; };
    var b = from, cur = off(b);
    for (var h = 6; h <= 24 * 32; h += 6) {
      var a = add(from, -h), p = off(a);
      if (p < 0 && cur >= 0) return bisect(a, b, function (d) { return off(d) >= 0; });
      b = a; cur = p;
    }
    return null;
  }
  // 月が星座 sign に入る次の時刻
  function nextIngress(from, sign) {
    var a = from, inA = signOf(moonLon(a)) === sign;
    for (var h = 2; h <= 24 * 30; h += 2) {
      var b = add(from, h), inB = signOf(moonLon(b)) === sign;
      if (!inA && inB) return bisect(a, b, function (d) { return signOf(moonLon(d)) === sign; });
      a = b; inA = inB;
    }
    return null;
  }
  // 日本時間の y/m/d hh:mm を Date に
  function jst(y, m, d, hh, mm) { return new Date(Date.UTC(y, m - 1, d, (hh || 0) - 9, mm || 0)); }
  // その日(日本時間)の0:00〜24:00で月が星座をまたぐか。またぐなら切替時刻
  function dayMoon(y, m, d) {
    var s = jst(y, m, d, 0, 0), e = jst(y, m, d, 24, 0);
    var a = signOf(moonLon(s)), b = signOf(moonLon(e));
    if (a === b) return { start: a, end: b, change: null };
    var at = bisect(s, e, function (t) { return signOf(moonLon(t)) !== a; });
    return { start: a, end: b, change: at };
  }
  function moonAge(date) { var nm = prevNewMoon(date); return nm ? (date - nm) / 86400000 : null; }
  function fmtJst(date, withYear) {
    var j = new Date(date.getTime() + 9 * 3600000);
    var w = "日月火水木金土"[j.getUTCDay()];
    return (withYear ? j.getUTCFullYear() + "年" : "") + (j.getUTCMonth() + 1) + "月" + j.getUTCDate() + "日(" + w + ") " +
      String(j.getUTCHours()).padStart(2, "0") + ":" + String(j.getUTCMinutes()).padStart(2, "0");
  }
  g.Astro = { moonLon: moonLon, sunLon: sunLon, elong: elong, signOf: signOf, nextPhase: nextPhase,
    prevNewMoon: prevNewMoon, nextIngress: nextIngress, jst: jst, dayMoon: dayMoon, moonAge: moonAge, fmtJst: fmtJst };
})(typeof window !== "undefined" ? window : globalThis);
