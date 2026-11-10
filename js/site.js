/* site.js — 月の占い 画面の処理(2026-11-10 作り直し)
 * 計算は全部ブラウザ内(astro.js)。入力は送信しない。保存はユーザーが選んだ時だけこの端末の localStorage に。
 * 解析演出(CT.steps)の各行は実際の計算1つずつに対応させる(待たせるための待ち時間は入れない)。
 */
(function () {
  "use strict";
  var A = window.Astro, S = window.SIGNS, K = window.SIGN_KEYS, N = window.NUMS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var STORE = "tsuki_me_v1";
  function load() { try { return JSON.parse(localStorage.getItem(STORE) || "null"); } catch (e) { return null; } }
  function save(v) { try { v ? localStorage.setItem(STORE, JSON.stringify(v)) : localStorage.removeItem(STORE); } catch (e) {} }
  function track(name, p) { try { window.gtag && gtag("event", name, p || {}); } catch (e) {} }
  function sj(i) { return S[K[i]].ja; }

  /* ---------- 月の形(実際の月齢から描く) ---------- */
  function moonSvg(e, size) {
    var r = 40, c = 50, R = Math.PI / 180, lit = (1 - Math.cos(e * R)) / 2, wax = e < 180;
    var rx = (r * Math.abs(Math.cos(e * R))).toFixed(2);
    var sw2 = wax ? (lit > 0.5 ? 1 : 0) : (lit > 0.5 ? 0 : 1);
    var d = "M" + c + " " + (c - r) + " A" + r + " " + r + " 0 0 " + (wax ? 1 : 0) + " " + c + " " + (c + r) + " A" + rx + " " + r + " 0 0 " + sw2 + " " + c + " " + (c - r) + "Z";
    return '<svg class="tk-moon" width="' + (size || 96) + '" height="' + (size || 96) + '" viewBox="0 0 100 100" role="img" aria-label="月の形(輝いている割合' + Math.round(lit * 100) + '%)">' +
      '<circle cx="50" cy="50" r="40" class="tk-moon__dark"/>' + (lit > 0.005 ? '<path d="' + d + '" class="tk-moon__lit"/>' : "") + "</svg>";
  }
  function phaseName(age) {
    if (age < 1.5) return "新月"; if (age < 6.4) return "三日月のころ"; if (age < 8.9) return "上弦の月";
    if (age < 13.8) return "十三夜のころ"; if (age < 15.8) return "満月"; if (age < 21.1) return "寝待月のころ";
    if (age < 23.6) return "下弦の月"; if (age < 28.0) return "有明の月"; return "新月前";
  }

  /* ---------- 星座どうしの距離(0〜6)と意味 ---------- */
  function dist(a, b) { var d = Math.abs(a - b) % 12; return d > 6 ? 12 - d : d; }
  var NEW_TIP = [
    "あなたの月星座での新月。年に1回めぐってくる、自分のための願いや目標を決める日です",
    "隣の星座での新月。大きく始めるより、部屋や体調など身の回りを整えると流れに乗れます",
    "相性のよい星座での新月。人から声がかかりやすい時期。誘いに1つ乗ってみると広がります",
    "あなたの月とぶつかる角度の新月。予定が揺れやすいので、新しく始めるより準備に回すと楽です",
    "同じ元素の星座での新月。この時期に始めたことは無理なく続きやすい流れです",
    "少しずれた星座での新月。やり方を1つ変えてみると、うまくいかなかったことが動きます",
    "あなたの月の正反対での新月。人との関係を始める、見直す区切りに向いています"
  ];
  var FULL_TIP = [
    "あなたの月星座での満月。気持ちが高ぶりやすい日です。大事な返事は一晩おいてから",
    "隣の星座での満月。使っていない物や習慣を手放すのに向いています",
    "相性のよい星座での満月。感謝やお礼を伝えると、いつもより届きやすい日です",
    "あなたの月とぶつかる角度の満月。感情がぶつかりやすいので、言い方を一段やわらかく",
    "同じ元素の星座での満月。続けてきたことの手応えが見えやすい日です",
    "少しずれた星座での満月。無理をしてきたことに気づきやすい日。予定を1つ減らしましょう",
    "あなたの月の正反対での満月。相手との関係の答えが見えやすい日です"
  ];
  var PAIR = [
    ["同じ月星座", "感じ方がそっくりで、説明しなくても気持ちが通じます。弱点も同じなので、2人同時に落ち込むと共倒れしやすい点に注意。どちらかが元気な方が支える役を決めておくと安定します。"],
    ["隣り合う月星座", "気持ちの動き方がまるで違うため、最初は噛み合わないと感じやすい組み合わせ。そのぶん自分にない物を持っていて、慣れると互いの欠けた部分を補えます。"],
    ["心地よい月星座(60°)", "一緒にいて気楽で、会話が自然に弾む関係。大きな衝突は少なめですが、なあなあになりやすいので、大事なことは言葉にして確かめ合いましょう。"],
    ["ぶつかりやすい月星座(90°)", "感情のスイッチが入る場所が違い、ささいなことで言い合いになりがち。ただし刺激が強いぶん惹かれ合う力も強く、互いの扱い方を覚えると深い関係になります。"],
    ["同じ元素の月星座(120°)", "安心の感じ方が似ていて、自然体でいられる組み合わせ。居心地がよすぎて変化を避けがちなので、新しいことを2人で試すと関係が長持ちします。"],
    ["理解に時間がかかる月星座(150°)", "悪気はないのに、相手の反応が読めないことが多い組み合わせ。察してもらうのを期待せず「こうしてほしい」と具体的に伝えると、驚くほどうまく回ります。"],
    ["正反対の月星座(180°)", "鏡のような関係。自分にない感じ方に強く惹かれる一方、正面からぶつかると引けなくなります。勝ち負けにせず、交互に譲るルールを作るとうまくいきます。"]
  ];
  var PYEAR = { 1: "始まりの年。新しいことを1つ始めると、この先9年の流れの起点になります", 2: "待つと協力の年。急がず、人と組むことで物事が進みます", 3: "表現と楽しみの年。好きなことを外に出すほど運が開きます", 4: "土台を固める年。地道な積み上げがあとで効いてきます", 5: "変化の年。引っ越し・転職・新しい出会いなど動きが出やすい時期です", 6: "家族と責任の年。身近な人との関係を整えると安定します", 7: "内省と学びの年。1人の時間で考えを深めると次の答えが見えます", 8: "成果とお金の年。これまでの努力が形になりやすい時期です", 9: "締めくくりの年。区切りをつけ、次の始まりに備える1年です" };

  function reduce(n) { while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = String(n).split("").reduce(function (a, b) { return a + +b; }, 0); return n; }
  function lifePath(y, m, d) { return reduce(String(y) + String(m) + String(d) === "" ? 0 : (String(y) + String(m).padStart(2, "0") + String(d).padStart(2, "0")).split("").reduce(function (a, b) { return a + +b; }, 0)); }
  function personalYear(m, d, year) { var n = (String(m) + String(d) + String(year)).split("").reduce(function (a, b) { return a + +b; }, 0); while (n > 9) n = String(n).split("").reduce(function (a, b) { return a + +b; }, 0); return n; }

  function parseDate(v) { var p = (v || "").split("-").map(Number); return p.length === 3 && p[0] > 1900 && p[0] < 2100 ? { y: p[0], m: p[1], d: p[2] } : null; }
  function parseTime(v) { if (!v) return null; var p = v.split(":").map(Number); return p.length >= 2 && !isNaN(p[0]) ? { h: p[0], mi: p[1] } : null; }

  /* 生まれた時の月星座。時刻不明でその日に星座が変わる場合は2候補と切替時刻を返す */
  function natal(dt, tm) {
    var day = A.dayMoon(dt.y, dt.m, dt.d);
    if (tm) { var at = A.jst(dt.y, dt.m, dt.d, tm.h, tm.mi); return { sign: A.signOf(A.moonLon(at)), at: at, day: day, sure: true }; }
    var noon = A.jst(dt.y, dt.m, dt.d, 12, 0);
    return { sign: A.signOf(A.moonLon(noon)), at: noon, day: day, sure: !day.change };
  }
  function boundaryHtml(n) {
    if (!n.day.change) return '<p class="tk-sure"><span class="ct-pill ct-pill--ok">確定</span> この日は1日中、月が' + sj(n.day.start) + 'にありました。生まれた時刻に関係なく結果は同じです。</p>';
    var t = A.fmtJst(n.day.change).split(" ")[1];
    if (n.sure && n.tmGiven) return '<p class="tk-sure"><span class="ct-pill ct-pill--ok">時刻で確定</span> この日は' + t + 'に月が' + sj(n.day.start) + 'から' + sj(n.day.end) + 'へ移りました。入力した時刻で' + sj(n.sign) + 'になります。</p>';
    return '<div class="ct-callout tk-border"><b>この日は月の星座が切り替わった日です</b>' + t + 'より前に生まれた方は<strong>' + sj(n.day.start) + '</strong>、' + t + '以降の方は<strong>' + sj(n.day.end) + '</strong>です。母子手帳の「出生の時刻」で確かめると確定できます。下は仮に正午で出した結果です。<div class="ct-row tk-switch"><button type="button" class="ct-btn ct-btn--ghost" data-pick="' + n.day.start + '">' + sj(n.day.start) + 'で見る</button><button type="button" class="ct-btn ct-btn--ghost" data-pick="' + n.day.end + '">' + sj(n.day.end) + 'で見る</button></div></div>';
  }

  /* これからの月の予定(あなたの月星座との関係つき) */
  function scheduleHtml(sign, now) {
    now = now || new Date();
    var nm = A.nextPhase(now, 0), fm = A.nextPhase(now, 180), back = A.nextIngress(now, sign);
    var rows = [];
    [[nm, "新月", NEW_TIP], [fm, "満月", FULL_TIP]].sort(function (a, b) { return a[0] - b[0]; }).forEach(function (r) {
      var s = A.signOf(A.moonLon(r[0])), d = dist(sign, s);
      rows.push('<li><div class="tk-when ct-num">' + A.fmtJst(r[0]) + '</div><div><b>' + r[1] + '(' + sj(s) + ')</b><p>' + r[2][d] + '</p></div></li>');
    });
    var cur = A.signOf(A.moonLon(now));
    var backTxt = cur === sign ? "今まさに月があなたの月星座" + sj(sign) + "にあります。気持ちが満たされやすく、自分らしく動ける2日半です" :
      "月があなたの月星座" + sj(sign) + "に戻ってきます(約27日ごと)。気持ちが落ち着き、休むのにも始めるのにも向く2日半です";
    if (back) rows.push('<li><div class="tk-when ct-num">' + (cur === sign ? "いま" : A.fmtJst(back)) + '</div><div><b>月があなたの星座に</b><p>' + backTxt + '</p></div></li>');
    return '<ol class="tk-sched">' + rows.join("") + '</ol>';
  }

  /* 今日の月(トップ・各ページ上部) */
  function today(el) {
    if (!el) return;
    var now = new Date(), e = A.elong(now), age = A.moonAge(now), s = A.signOf(A.moonLon(now));
    var nextSign = A.nextIngress(now, (s + 1) % 12), me = load();
    var html = '<div class="tk-today">' + moonSvg(e, 88) + '<div><p class="ct-eyebrow">いまの月(日本時間 ' + A.fmtJst(now).split(" ")[1] + ' 時点)</p>' +
      '<p class="tk-today__main">' + sj(s) + 'の' + phaseName(age) + '</p><p class="ct-caption">月齢 <span class="ct-num">' + age.toFixed(1) + '</span> ・ ' +
      (nextSign ? A.fmtJst(nextSign) + 'に' + sj((s + 1) % 12) + 'へ' : "") + '</p></div></div>';
    if (me && me.sign != null) {
      html += '<div class="tk-mine"><p><b>あなたの月星座 ' + sj(me.sign) + '</b> から見た、これからの月</p>' + scheduleHtml(me.sign, now) +
        '<p class="ct-caption">この端末に保存した生年月日から計算しています。<button type="button" class="tk-link" data-forget>保存を消す</button></p></div>';
    }
    el.innerHTML = html;
    var f = el.querySelector("[data-forget]");
    if (f) f.addEventListener("click", function () { save(null); today(el); });
  }

  function share(text) {
    var url = location.origin + location.pathname;
    if (navigator.share) { navigator.share({ text: text, url: url }).catch(function () {}); }
    else window.open("https://x.com/intent/post?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url), "_blank", "noopener");
    track("share", { page: location.pathname });
  }

  function runSteps(list, fns) {
    list.hidden = false;
    list.querySelectorAll("li").forEach(function (li) { li.classList.remove("is-active", "is-done"); });
    return window.CT && CT.steps ? CT.steps(list, fns) : Promise.resolve(fns.map(function (f, i, a) { return f([]); }));
  }
  function showResult(box) {
    box.hidden = false;
    box.querySelectorAll("[data-count]").forEach(function (el) { if (window.CT) CT.countUp(el, +el.dataset.count, { digits: +(el.dataset.digits || 0) }); });
    box.focus({ preventScroll: true });
    box.scrollIntoView({ behavior: window.CT && CT.reduced ? "auto" : "smooth", block: "start" });
  }

  /* ---------- 月星座ページ ---------- */
  function art(i, small) { return '<img class="tk-art" src="img/signs/' + K[i] + (small ? '-s' : '') + '.webp" width="' + (small ? 160 : 480) + '" height="' + (small ? 160 : 480) + '" alt="月' + esc(S[K[i]].ja) + 'の水彩イラスト" decoding="async">'; }
  function signBlock(i) {
    var s = S[K[i]];
    return '<div class="ct-stack" style="--ct-gap:20px"><figure class="tk-signart">' + art(i) + '</figure><section><h3 class="ct-h3">月' + esc(s.ja) + 'の本質</h3><p>' + esc(s.description) + '</p></section>' +
      '<section><h3 class="ct-h3">恋愛と気持ちの動き方</h3><p>' + esc(s.love) + '</p></section>' +
      '<section><h3 class="ct-h3">落ち込んだ時に効くもの</h3><p>' + esc(s.comfort) + '</p></section>' +
      '<section><h3 class="ct-h3">心がざわつくきっかけ</h3><p>' + esc(s.trigger) + '</p></section>' +
      '<section><h3 class="ct-h3">あなたが必要としているもの</h3><p>' + esc(s.need) + '</p></section>' +
      '<p class="ct-caption">元素: ' + s.element + ' ・ 支配星: ' + s.ruler + ' ・ 守護石: ' + esc(s.stone) + '</p></div>';
  }
  function tsukiPage() {
    var form = $("#moon-form"); if (!form) return;
    var unk = $("#moon-unknown"), time = $("#moon-time");
    unk.addEventListener("change", function () { time.disabled = unk.checked; if (unk.checked) time.value = ""; });
    var me = load(); if (me && me.d) { $("#moon-date").value = me.d; if (me.t) time.value = me.t; $("#moon-save").checked = true; }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var dt = parseDate($("#moon-date").value), tm = unk.checked ? null : parseTime(time.value);
      var fld = $("#moon-date").closest(".ct-field");
      if (!dt) { fld.classList.add("is-error"); $("#moon-date").focus(); return; }
      fld.classList.remove("is-error");
      var box = $("#moon-result"); box.hidden = true;
      var n, age, sched;
      runSteps($("#moon-steps"), [
        function () { n = natal(dt, tm); n.tmGiven = !!tm; },
        function () { /* dayMoon は natal 内で計算済み。ここでは切替の有無を確定 */ return n.day.change; },
        function () { age = A.moonAge(n.at); },
        function () { sched = scheduleHtml(n.sign); }
      ]).then(function () {
        var e = A.elong(n.at);
        box.innerHTML = '<div class="ct-panel ct-panel--raised ct-stack" style="--ct-gap:20px">' +
          '<div class="tk-hero">' + moonSvg(e, 112) + '<div><p class="ct-eyebrow">あなたの月星座</p><p class="tk-big" id="moon-sign">' + sj(n.sign) + '</p>' +
          '<p class="ct-caption">生まれた時の月は' + phaseName(age) + '(月齢 <span class="ct-num" data-count="' + age.toFixed(1) + '" data-digits="1">' + age.toFixed(1) + '</span>)</p></div></div>' +
          boundaryHtml(n) + '<div id="moon-body">' + signBlock(n.sign) + '</div>' +
          '<section><h3 class="ct-h3">これからの月の予定</h3><div id="moon-sched">' + sched + '</div></section>' +
          '<div class="ct-row"><button type="button" class="ct-btn ct-btn--primary" id="moon-share">結果をシェア</button><a class="ct-btn ct-btn--ghost" href="aisho.html">相手との相性を見る</a></div></div>';
        if ($("#moon-save").checked) save({ d: $("#moon-date").value, t: tm ? time.value : "", sign: n.sign }); else save(null);
        box.querySelectorAll("[data-pick]").forEach(function (b) {
          b.addEventListener("click", function () { var i = +b.dataset.pick; $("#moon-sign").textContent = sj(i); $("#moon-body").innerHTML = signBlock(i); $("#moon-sched").innerHTML = scheduleHtml(i); var m = load(); if (m) { m.sign = i; save(m); } });
        });
        $("#moon-share").addEventListener("click", function () { share("私の月星座は" + $("#moon-sign").textContent + "でした。生年月日と時刻から天文計算で出す月の占い"); });
        track("tool_run", { tool: "tsuki", border: n.day.change ? 1 : 0, time_given: tm ? 1 : 0 });
        showResult(box);
      });
    });
  }

  /* ---------- 相性ページ ---------- */
  function aishoPage() {
    var form = $("#aisho-form"); if (!form) return;
    var me = load(); if (me && me.d) $("#a-date").value = me.d;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var a = parseDate($("#a-date").value), b = parseDate($("#b-date").value), ok = true;
      [["#a-date", a], ["#b-date", b]].forEach(function (p) { var f = $(p[0]).closest(".ct-field"); f.classList.toggle("is-error", !p[1]); if (!p[1]) ok = false; });
      if (!ok) return;
      var ta = parseTime($("#a-time").value), tb = parseTime($("#b-time").value);
      var na, nb, la, lb, box = $("#aisho-result"); box.hidden = true;
      runSteps($("#aisho-steps"), [
        function () { na = natal(a, ta); },
        function () { nb = natal(b, tb); },
        function () { la = lifePath(a.y, a.m, a.d); lb = lifePath(b.y, b.m, b.d); }
      ]).then(function () {
        var d = dist(na.sign, nb.sign), P = PAIR[d], A1 = S[K[na.sign]], B1 = S[K[nb.sign]];
        var warn = (!na.sure || !nb.sure) ? '<p class="ct-callout"><b>月星座が1日の途中で変わる日が含まれています</b>' +
          (!na.sure ? 'あなたの誕生日は' + A.fmtJst(na.day.change).split(" ")[1] + 'に' + sj(na.day.start) + '→' + sj(na.day.end) + '。' : "") +
          (!nb.sure ? 'お相手の誕生日は' + A.fmtJst(nb.day.change).split(" ")[1] + 'に' + sj(nb.day.start) + '→' + sj(nb.day.end) + '。' : "") +
          '出生時刻を入れると確定します(下は正午で計算)。</p>' : "";
        var numTxt = la === lb ? "同じ数どうし。大事にしている物が近く、判断の基準が揃いやすい2人です。" :
          (N[la].name + "の" + la + "と、" + N[lb].name + "の" + lb + "。" + (Math.abs(la % 9 - lb % 9) <= 2 ? "進む速さが近く、一緒に決めごとをしやすい組み合わせです。" : "得意なことが重ならないので、役割を分けるほど強くなる組み合わせです。"));
        box.innerHTML = '<div class="ct-panel ct-panel--raised ct-stack" style="--ct-gap:20px">' +
          '<div class="tk-pair"><div>' + art(na.sign) + '<p class="ct-caption">あなた</p><p class="tk-mid">月' + sj(na.sign) + '</p><p class="ct-caption">数秘 <span class="ct-num">' + la + '</span></p></div>' +
          '<div class="tk-pair__mid" aria-hidden="true"><svg width="40" height="24" viewBox="0 0 40 24"><path d="M2 12h36M28 4l8 8-8 8M12 4 4 12l8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
          '<div>' + art(nb.sign) + '<p class="ct-caption">お相手</p><p class="tk-mid">月' + sj(nb.sign) + '</p><p class="ct-caption">数秘 <span class="ct-num">' + lb + '</span></p></div></div>' + warn +
          '<section><p class="ct-eyebrow">2人の月の関係</p><h3 class="ct-h3">' + P[0] + '</h3><p>' + P[1] + '</p></section>' +
          '<section><h3 class="ct-h3">お相手が落ち込んだ時は</h3><p>' + esc(B1.comfort) + '。</p><p class="ct-caption">避けたいこと: ' + esc(B1.trigger) + '</p></section>' +
          '<section><h3 class="ct-h3">あなたが落ち込んだ時に、お相手に頼むと効くこと</h3><p>' + esc(A1.comfort) + '。</p><p class="ct-caption">あなたがざわつきやすいこと: ' + esc(A1.trigger) + '</p></section>' +
          '<section><h3 class="ct-h3">数秘術で見た2人</h3><p>' + numTxt + '</p></section>' +
          '<section><h3 class="ct-h3">2人で覚えておきたい次の満月</h3>' + (function () { var fm = A.nextPhase(new Date(), 180), s = A.signOf(A.moonLon(fm)); return '<p><span class="ct-num">' + A.fmtJst(fm) + '</span> ' + sj(s) + 'の満月。あなたには「' + FULL_TIP[dist(na.sign, s)] + '」、お相手には「' + FULL_TIP[dist(nb.sign, s)] + '」という日です。</p>'; })() + '</section>' +
          '<div class="ct-row"><button type="button" class="ct-btn ct-btn--primary" id="aisho-share">結果をシェア</button></div></div>';
        $("#aisho-share").addEventListener("click", function () { share("月" + sj(na.sign) + "と月" + sj(nb.sign) + "は「" + P[0] + "」でした"); });
        track("tool_run", { tool: "aisho", rel: d });
        showResult(box);
      });
    });
  }

  /* ---------- 数秘術ページ ---------- */
  function suuhiPage() {
    var form = $("#suuhi-form"); if (!form) return;
    var me = load(); if (me && me.d) $("#s-date").value = me.d;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var dt = parseDate($("#s-date").value), f = $("#s-date").closest(".ct-field");
      f.classList.toggle("is-error", !dt); if (!dt) return;
      var digits = (String(dt.y) + String(dt.m).padStart(2, "0") + String(dt.d).padStart(2, "0")).split("");
      var sum = digits.reduce(function (a, b) { return a + +b; }, 0), lp = reduce(sum);
      var now = new Date(new Date().getTime() + 9 * 3600000), cy = now.getUTCFullYear(), py = personalYear(dt.m, dt.d, cy), pyn = personalYear(dt.m, dt.d, cy + 1);
      var v = N[lp], box = $("#suuhi-result");
      var chain = sum; var path = [sum]; while (chain > 9 && chain !== 11 && chain !== 22 && chain !== 33) { chain = String(chain).split("").reduce(function (a, b) { return a + +b; }, 0); path.push(chain); }
      box.innerHTML = '<div class="ct-panel ct-panel--raised ct-stack" style="--ct-gap:20px">' +
        '<div class="tk-hero"><div class="tk-num" aria-hidden="true"><span class="ct-num" data-count="' + lp + '">' + lp + '</span></div><div><p class="ct-eyebrow">ライフパスナンバー</p><p class="tk-big">' + lp + ' ' + esc(v.name) + '</p><p class="ct-caption">' + esc(v.keyword) + '</p></div></div>' +
        '<p class="ct-caption">計算: ' + digits.join("+") + ' = ' + path.join(" → ") + (lp > 9 ? '(マスターナンバーなのでこれ以上足しません)' : "") + '</p>' +
        '<section><h3 class="ct-h3">本質</h3><p>' + esc(v.description) + '</p></section><section><h3 class="ct-h3">恋愛</h3><p>' + esc(v.love) + '</p></section>' +
        '<section><h3 class="ct-h3">仕事</h3><p>' + esc(v.work) + '</p></section><section><h3 class="ct-h3">気をつけたいこと</h3><p>' + esc(v.caution) + '</p></section>' +
        '<section class="ct-callout"><b>' + cy + '年のあなたは「個人年 ' + py + '」</b>' + PYEAR[py] + '。<br><span class="ct-caption">' + (cy + 1) + '年は個人年 ' + pyn + ': ' + PYEAR[pyn] + '</span></section>' +
        '<div class="ct-row"><button type="button" class="ct-btn ct-btn--primary" id="suuhi-share">結果をシェア</button><a class="ct-btn ct-btn--ghost" href="tsuki.html">月星座も見る</a></div></div>';
      $("#suuhi-share").addEventListener("click", function () { share("私のライフパスナンバーは" + lp + "(" + v.name + ")でした"); });
      track("tool_run", { tool: "suuhi" });
      showResult(box);
    });
  }

  function init() { today($("#today-moon")); tsukiPage(); aishoPage(); suuhiPage(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.TK = { natal: natal, lifePath: lifePath, personalYear: personalYear, dist: dist, moonSvg: moonSvg };
})();
