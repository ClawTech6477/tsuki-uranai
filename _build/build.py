#!/usr/bin/env python3
"""月の占い 静的ページ生成(2026-11-10)。共通の頭/足をここで1か所にし、各ページの本文だけ書く。
実行: ~/.openclaw/venv/bin/python3 ~/tsuki-uranai/_build/build.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://tsuki.clawtechjp.com/"
TODAY = "2026-11-10"
NAV = [("index.html", "ホーム"), ("tsuki.html", "月星座"), ("aisho.html", "相性"), ("suuhi.html", "数秘術")]
MOON_ICON = ('<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
             'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>')


def page(fname, title, desc, h1, lead, body, *, scripts=True, ld_extra=None, crumb=None, og_title=None):
    url = BASE + ("" if fname == "index.html" else fname)
    ld = [{"@context": "https://schema.org", "@type": "WebPage", "name": og_title or title, "url": url,
           "description": desc, "dateModified": TODAY, "inLanguage": "ja",
           "publisher": {"@type": "Organization", "name": "ClawTech", "url": "https://clawtechjp.com/"},
           "isPartOf": {"@type": "WebSite", "name": "月の占い", "url": BASE}}]
    if ld_extra:
        ld += ld_extra
    cur = ' aria-current="page"'
    nav = "".join(f'<a href="{h}"{cur if h == fname else ""}>{t}</a>' for h, t in NAV)
    crumb_html = (f'<nav class="ct-crumb" aria-label="パンくず"><a href="index.html">ホーム</a> › {crumb}</nav>' if crumb else "")
    js = ('<script defer src="https://clawtechjp.com/ui/ct-motion.js"></script>'
          '<script defer src="js/data.js"></script><script defer src="js/astro.js"></script><script defer src="js/site.js"></script>') if scripts else ""
    html = f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{BASE}{fname}">
<meta property="og:title" content="{og_title or title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="{'website' if fname == 'index.html' else 'article'}">
<meta property="og:url" content="{BASE}{fname}">
<meta property="og:site_name" content="月の占い">
<meta name="twitter:card" content="summary">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22%3E%3Cpath d=%22M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z%22 fill=%22%23e0a020%22/%3E%3C/svg%3E">
<link rel="stylesheet" href="https://clawtechjp.com/ui/ct-ui.css">
<link rel="stylesheet" href="css/tsuki.css">
<script type="application/ld+json">{json.dumps(ld if len(ld) > 1 else ld[0], ensure_ascii=False)}</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-RZ1TP2K3N0"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-RZ1TP2K3N0');</script>
</head>
<body>
<a class="ct-skip" href="#main">本文へ移動</a>
<header class="ct-header tk-header"><div class="ct-container ct-header__in"><a class="tk-brand" href="index.html">{MOON_ICON}月の占い</a><nav class="tk-nav" aria-label="メイン">{nav}</nav></div></header>
<main id="main" class="ct-container">
{crumb_html}
<section class="ct-section" style="padding-top:var(--ct-s-5)">
<h1 class="ct-h1">{h1}</h1>
<p class="ct-lead">{lead}</p>
</section>
{body}
</main>
<footer class="ct-container tk-foot">
<nav aria-label="フッター">{''.join(f'<a href="{h}">{t}</a>' for h, t in NAV)}<a href="about.html">サイトについて</a><a href="privacy.html">プライバシーポリシー</a></nav>
<p class="ct-note">月の位置は J. Meeus『Astronomical Algorithms』の計算式で、あなたのブラウザの中で計算しています(誤差はおおむね数分)。入力した生年月日はどこにも送信しません。診断の読み物は娯楽としてお楽しみください。</p>
<p>運営: <a href="https://clawtechjp.com/" rel="noopener">ClawTech(クロウテック)</a> ・ 最終更新 {TODAY}</p>
</footer>
{js}
</body>
</html>
"""
    (ROOT / fname).write_text(html, encoding="utf-8")


def faq_ld(items):
    return {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items]}


def faq_html(items, h="よくある質問"):
    return (f'<section class="ct-section tk-faq"><h2 class="ct-h2">{h}</h2>' +
            "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in items) + "</section>")


def date_field(id_, label, hint=""):
    return (f'<div class="ct-field"><label class="ct-label" for="{id_}">{label}</label>'
            f'<input class="ct-input" type="date" id="{id_}" required min="1920-01-01" max="2026-12-31" autocomplete="bday">'
            + (f'<p class="ct-hint">{hint}</p>' if hint else "") + '<p class="ct-hint ct-field__err" role="alert">生年月日を選んでください</p></div>')


def time_field(id_, label):
    return (f'<div class="ct-field"><label class="ct-label" for="{id_}">{label}<span class="ct-caption">(任意)</span></label>'
            f'<input class="ct-input" type="time" id="{id_}"></div>')


SIGN_SHORT = [("牡羊座", "気持ちがすぐ行動に出るタイプ。思い立ったら動くことで心が晴れます。"),
              ("牡牛座", "安定した気持ちと五感の喜び。慣れた場所と心地よい物で落ち着きます。"),
              ("双子座", "話すこと・知ることで心が満たされるタイプ。気分転換が上手です。"),
              ("蟹座", "感受性が豊かで、家族や身内を大切にします。安心できる居場所が要です。"),
              ("獅子座", "気持ちを表に出して認められると輝くタイプ。褒め言葉が力になります。"),
              ("乙女座", "気持ちを整理して落ち着くタイプ。段取りと清潔な環境で安心します。"),
              ("天秤座", "調和と美しさを求めます。人との関係がなめらかだと心が安定します。"),
              ("蠍座", "深く一途な感情の持ち主。信じた相手とは長く強く結びつきます。"),
              ("射手座", "自由と前向きさで心が回るタイプ。縛られると息苦しさを感じます。"),
              ("山羊座", "感情を抑えて目標に向かうタイプ。やり遂げた実感が心の支えです。"),
              ("水瓶座", "気持ちを頭で整理するタイプ。自分らしさを認めてもらうと安心します。"),
              ("魚座", "共感力が高く、人の気持ちを自分のことのように感じ取ります。")]

STEPS_MOON = ('<ol class="ct-steps" id="moon-steps" hidden aria-live="polite">'
              '<li>生まれた瞬間の月の位置を計算</li><li>その日に月が星座をまたいだか確認</li>'
              '<li>生まれた日の月齢を計算</li><li>これからの新月・満月を計算</li></ol>')

# ---------------- 月星座 ----------------
tsuki_faq = [
    ("生まれた時刻がわからないとどうなりますか?", "月は約2日半ごとに星座を移ります。誕生日に月が星座をまたいでいなければ、時刻がなくても結果は確定します。またいでいる日は、切り替わった時刻と2つの候補を表示します。母子手帳の「出生の時刻」で確かめられます。"),
    ("ほかのサイトと結果が違うのはなぜですか?", "生年月日だけでおおまかに割り出すサイトでは、星座の境目の日に結果がずれることがあります。当サイトは月の軌道を天文計算で求め、切り替わりの時刻まで表示しています。"),
    ("海外で生まれた場合は?", "時刻は日本時間として計算しています。海外生まれの方は、出生時刻を日本時間に直して入力してください。"),
]
tsuki_body = f"""
<section class="ct-panel ct-panel--raised ct-stack" style="--ct-gap:20px">
<form id="moon-form" class="ct-stack" style="--ct-gap:16px" novalidate>
{date_field("moon-date", "生年月日")}
{time_field("moon-time", "生まれた時刻")}
<label class="tk-check"><input type="checkbox" id="moon-unknown">時刻はわからない</label>
<label class="tk-check"><input type="checkbox" id="moon-save">この端末に生年月日を覚えておく(トップページで毎日の月の予定が出ます)</label>
<button type="submit" class="ct-btn ct-btn--primary ct-btn--block">月星座を調べる</button>
</form>
{STEPS_MOON}
</section>
<div id="moon-result" class="tk-result ct-section" tabindex="-1" hidden aria-live="polite"></div>
<section class="ct-section"><h2 class="ct-h2">月星座とは</h2>
<div class="ct-body"><p>月星座は、あなたが生まれた瞬間に月があった星座のことです。誕生日で決まる「星座占い」の星座(太陽星座)が人から見える性格を表すのに対し、月星座は気持ちの動き方・安心するもの・とっさの反応といった内側の自分を表すとされます。</p>
<p>月は約27日で12星座をひと回りするため、同じ年の同じ月に生まれても数日違えば月星座は変わります。日によっては1日の途中で星座が切り替わるので、当サイトでは切り替わりの時刻まで計算して表示します。</p></div></section>
<section class="ct-section"><h2 class="ct-h2">月星座12星座一覧</h2><ul class="tk-signs">
{''.join(f'<li><b>月{n}</b><p>{t}</p></li>' for n, t in SIGN_SHORT)}
</ul></section>
{faq_html(tsuki_faq)}
<nav class="ct-related" aria-label="関連ページ"><ul><li><a href="aisho.html">2人の月星座で相性を見る</a></li><li><a href="suuhi.html">数秘術でライフパスナンバーを見る</a></li></ul></nav>
"""
page("tsuki.html", "月星座診断【無料】生年月日で感情・本能・恋愛パターンを鑑定｜月の占い",
     "生年月日(と生まれた時刻)から、月が何座にあったかを天文計算で割り出します。星座が切り替わる日は時刻まで表示。月星座ごとの気持ちの動き方・恋愛・落ち込んだ時に効くこと、これからの新月・満月の過ごし方もわかります。",
     "月星座診断", "生まれた瞬間に月が何座にあったかを、天文計算で割り出します。星座が切り替わる日は時刻まで表示します。",
     tsuki_body, ld_extra=[faq_ld(tsuki_faq)], crumb="月星座診断", og_title="月星座診断【無料】感情・本能・恋愛パターンを鑑定｜月の占い")

# ---------------- 相性 ----------------
aisho_faq = [
    ("相性が「ぶつかりやすい」と出たら合わないのですか?", "合わないという意味ではありません。気持ちのスイッチが入る場所が違うということです。結果の「落ち込んだ時は」の欄に、相手に効く接し方を書いています。"),
    ("点数で出ないのはなぜですか?", "月星座の関係は「どう違うか」を表すもので、良し悪しの点数にはなりません。根拠のない点数を出すより、すれ違いやすい場面と対処を具体的に書いています。"),
    ("友達や家族にも使えますか?", "はい。月星座は気持ちの動き方を表すので、恋人以外の関係にもそのまま使えます。"),
]
aisho_body = f"""
<section class="ct-panel ct-panel--raised ct-stack" style="--ct-gap:20px">
<form id="aisho-form" class="ct-stack" style="--ct-gap:16px" novalidate>
<div class="ct-grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:var(--ct-s-5)">
<fieldset class="ct-stack" style="--ct-gap:12px;border:0;padding:0;margin:0"><legend class="ct-h3">あなた</legend>{date_field("a-date", "生年月日")}{time_field("a-time", "生まれた時刻")}</fieldset>
<fieldset class="ct-stack" style="--ct-gap:12px;border:0;padding:0;margin:0"><legend class="ct-h3">お相手</legend>{date_field("b-date", "生年月日")}{time_field("b-time", "生まれた時刻")}</fieldset>
</div>
<button type="submit" class="ct-btn ct-btn--primary ct-btn--block">2人の相性を見る</button>
</form>
<ol class="ct-steps" id="aisho-steps" hidden aria-live="polite"><li>あなたの月星座を計算</li><li>お相手の月星座を計算</li><li>2人のライフパスナンバーを計算</li></ol>
</section>
<div id="aisho-result" class="tk-result ct-section" tabindex="-1" hidden aria-live="polite"></div>
<section class="ct-section"><h2 class="ct-h2">月星座で見る相性の考え方</h2>
<div class="ct-body"><p>2人の月星座が12星座の輪の上でどれだけ離れているかで、気持ちの通じ方が変わります。同じ星座・60°・120°は感じ方が近く、90°・180°は違いが大きいぶん刺激し合う関係、隣どうし・150°は理解に時間がかかる関係です。</p>
<p>当サイトでは点数ではなく、相手が落ち込んだ時に効くこと・避けたいことを具体的に出します。数秘術(ライフパスナンバー)の組み合わせもあわせて表示します。</p></div></section>
{faq_html(aisho_faq)}
<nav class="ct-related" aria-label="関連ページ"><ul><li><a href="tsuki.html">自分の月星座を詳しく見る</a></li><li><a href="suuhi.html">数秘術でライフパスナンバーを見る</a></li></ul></nav>
"""
page("aisho.html", "相性診断【無料】2人の生年月日で月星座と数秘術の相性を診断｜月の占い",
     "2人の生年月日から月星座とライフパスナンバーを計算し、気持ちの通じ方・すれ違いやすい場面・相手が落ち込んだ時に効く接し方を具体的に診断します。登録不要・無料。",
     "相性診断", "2人の月星座の関係から、気持ちの通じ方と、相手が落ち込んだ時に効く接し方を出します。",
     aisho_body, ld_extra=[faq_ld(aisho_faq)], crumb="相性診断")

# ---------------- 数秘術 ----------------
NUM_SHORT = [(1, "リーダー", "独立・開拓・始めること"), (2, "協調者", "調和・感受性・支えること"), (3, "表現者", "創造・喜び・伝えること"),
             (4, "建設者", "安定・勤勉・積み上げること"), (5, "冒険者", "自由・変化・経験すること"), (6, "養育者", "愛情・責任・育てること"),
             (7, "探求者", "知恵・直感・深く考えること"), (8, "達成者", "力・豊かさ・形にすること"), (9, "完成者", "博愛・締めくくり・手放すこと"),
             (11, "直感の人", "マスターナンバー。鋭い感受性"), (22, "大きく築く人", "マスターナンバー。理想を現実に"), (33, "癒やす人", "マスターナンバー。無条件の愛情")]
suuhi_faq = [
    ("個人年とは何ですか?", "誕生日の月と日に、今年の西暦を足して1桁にした数です。9年で1周し、その年のテーマを表します。毎年1月1日に切り替わります。"),
    ("11・22・33が出たら?", "マスターナンバーと呼ばれ、それ以上足さずにそのまま扱います。"),
]
suuhi_body = f"""
<section class="ct-panel ct-panel--raised ct-stack" style="--ct-gap:20px">
<form id="suuhi-form" class="ct-stack" style="--ct-gap:16px" novalidate>
{date_field("s-date", "生年月日")}
<button type="submit" class="ct-btn ct-btn--primary ct-btn--block">ライフパスナンバーを出す</button>
</form>
</section>
<div id="suuhi-result" class="tk-result ct-section" tabindex="-1" hidden aria-live="polite"></div>
<section class="ct-section"><h2 class="ct-h2">ライフパスナンバー一覧</h2>
<p class="ct-body">生年月日の数字をすべて足し、1桁(または11・22・33)になるまで足し続けた数がライフパスナンバーです。</p>
<ul class="tk-signs">{''.join(f'<li><b>{n} {name}</b><p>{t}</p></li>' for n, name, t in NUM_SHORT)}</ul></section>
<section class="ct-section"><h2 class="ct-h2">計算方法</h2><div class="ct-body">
<p>例: 1990年5月23日生まれ → 1+9+9+0+0+5+2+3 = 29 → 2+9 = 11(マスターナンバーなのでここで止めます)</p>
<p>結果では、あなたの数字で同じ計算の途中経過を表示し、今年と来年の「個人年」もあわせて出します。</p></div></section>
{faq_html(suuhi_faq)}
<nav class="ct-related" aria-label="関連ページ"><ul><li><a href="tsuki.html">月星座診断も見る</a></li><li><a href="aisho.html">2人の相性を見る</a></li></ul></nav>
"""
page("suuhi.html", "数秘術診断【無料】生年月日でライフパスナンバーと今年の個人年を算出｜月の占い",
     "生年月日からライフパスナンバー(1〜9・11・22・33)を計算の途中経過つきで算出。本質・恋愛・仕事・気をつけたいことに加え、今年と来年の個人年のテーマもわかります。",
     "数秘術診断", "生年月日からライフパスナンバーを、計算の途中経過つきで出します。今年と来年の「個人年」もわかります。",
     suuhi_body, ld_extra=[faq_ld(suuhi_faq)], crumb="数秘術診断")

# ---------------- トップ ----------------
idx_faq = [
    ("月星座と、ふつうの星座占いの星座は何が違いますか?", "ふつうの星座占いは誕生日に太陽があった星座(太陽星座)で、人から見える性格を表すとされます。月星座は月があった星座で、気持ちの動き方や安心するものなど内側の自分を表すとされます。"),
    ("「いまの月」はいつの情報ですか?", "ページを開いた時刻の月を、あなたのブラウザで計算しています。開くたびに最新になります。"),
    ("無料ですか?", "すべて無料で、登録も不要です。"),
]
cards = [("tsuki.html", "月星座診断", "生まれた瞬間の月の星座から、気持ちの動き方・恋愛・落ち込んだ時に効くことがわかります。"),
         ("aisho.html", "相性診断", "2人の月星座の関係から、すれ違いやすい場面と相手に効く接し方を出します。"),
         ("suuhi.html", "数秘術診断", "ライフパスナンバーと、今年・来年の個人年のテーマがわかります。")]
idx_body = f"""
<section class="ct-panel ct-panel--raised" id="today-moon" aria-live="polite"><p>いまの月を計算しています。JavaScriptが無効な場合は表示されません。</p></section>
<section class="ct-section"><h2 class="ct-h2">診断を選ぶ</h2><div class="tk-cards">
{''.join(f'<a href="{h}"><div class="ct-panel"><h3 class="ct-h3">{t}</h3><p class="ct-caption">{d}</p></div></a>' for h, t, d in cards)}
</div></section>
<section class="ct-section"><h2 class="ct-h2">月の占いでわかること</h2><div class="ct-body">
<p>月は約2日半ごとに星座を移り、約29.5日で新月から満月を経てまた新月に戻ります。当サイトは月の位置を天文計算で求め、あなたの月星座と、これから来る新月・満月があなたの月星座とどんな角度になるかを出します。</p>
<p>月星座診断で「この端末に覚えておく」を選ぶと、トップページを開くたびに、あなたの月星座から見たこれからの月の予定が表示されます。</p></div></section>
{faq_html(idx_faq)}
"""
page("index.html", "月の占い｜月星座・相性・数秘術を生年月日で無料診断",
     "生年月日から月星座・相性・数秘術を無料で診断。月の位置を天文計算で求め、星座が切り替わる日は時刻まで表示します。いまの月の星座と月齢、次の新月・満月があなたにどう関わるかも毎日わかります。",
     "生年月日でわかる、あなたの月", "いまの月と、あなたの月星座から見たこれからの新月・満月。開くたびに最新の位置で計算します。",
     idx_body, ld_extra=[faq_ld(idx_faq), {"@context": "https://schema.org", "@type": "WebSite", "name": "月の占い", "url": BASE, "inLanguage": "ja"}])

# ---------------- サイトについて / プライバシー ----------------
page("about.html", "サイトについて｜月の占い", "月の占いの運営者・計算方法・データの扱いについて。",
     "サイトについて", "月の占いは、月星座・相性・数秘術を生年月日から無料で診断するサイトです。",
     """<section class="ct-section"><div class="ct-body">
<h2 class="ct-h2">計算方法</h2><p>月と太陽の位置は J. Meeus『Astronomical Algorithms』第2版の計算式(月は第47章の主要項、太陽は第25章)で求めています。星座は西洋占星術で使う回帰黄道の12区分です。月は1時間に約0.5°動くため、星座が切り替わる時刻の誤差はおおむね数分です。</p>
<h2 class="ct-h2">データの扱い</h2><p>入力された生年月日はお使いのブラウザの中だけで計算し、サーバーへは送信しません。「この端末に覚えておく」を選んだ場合だけ、その端末のブラウザ(localStorage)に保存します。トップページの「保存を消す」でいつでも消せます。</p>
<h2 class="ct-h2">診断の位置づけ</h2><p>月の位置は天文計算ですが、星座ごとの読み物は占星術の伝統的な解釈にもとづく娯楽です。医療・法律・お金などの大切な判断は専門家にご相談ください。</p>
<h2 class="ct-h2">運営者</h2><p>ClawTech(クロウテック) <a href="https://clawtechjp.com/" rel="noopener">https://clawtechjp.com/</a></p>
</div></section>""", scripts=False, crumb="サイトについて")
page("privacy.html", "プライバシーポリシー｜月の占い", "月の占いのプライバシーポリシー。入力内容の扱い・端末への保存・アクセス解析について。",
     "プライバシーポリシー", "入力内容の扱いと、アクセス解析について説明します。",
     """<section class="ct-section"><div class="ct-body">
<h2 class="ct-h2">入力内容</h2><p>診断フォームに入力された生年月日・時刻は、お使いのブラウザの中だけで処理し、外部へ送信・保存しません。</p>
<h2 class="ct-h2">端末への保存</h2><p>月星座診断で「この端末に生年月日を覚えておく」を選んだ場合に限り、生年月日・時刻・月星座をその端末のブラウザ(localStorage)に保存します。保存した内容は当サイトのページ表示にだけ使い、送信しません。トップページの「保存を消す」、またはブラウザのサイトデータ削除で消せます。</p>
<h2 class="ct-h2">アクセス解析</h2><p>サイト改善のため Google アナリティクスを使用しています。Google アナリティクスは Cookie を使って利用状況を収集しますが、個人を特定する情報は含みません。診断を使ったこと・結果をシェアしたことのイベントは記録しますが、生年月日そのものは送りません。詳しくは Google のポリシーをご覧ください。</p>
<h2 class="ct-h2">免責事項</h2><p>当サイトの診断は娯楽を目的としたものです。診断結果にもとづく判断で生じた損害について、当サイトは責任を負いかねます。</p>
<h2 class="ct-h2">お問い合わせ</h2><p>ClawTech(クロウテック) <a href="https://clawtechjp.com/" rel="noopener">https://clawtechjp.com/</a></p>
</div></section>""", scripts=False, crumb="プライバシーポリシー")
print("built")
