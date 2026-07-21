/* ============================================================
   RY 共通 JS（assets/shared.js）— 共通 chrome 注入＋共通挙動
   出典：mtg_5/index.html（2026-07-09 step0 準項目化で逐字搬出・挙動/数値は不変更）
   前提：<body> 冒頭で同期読込（chrome＝#ry-mark/NAV/抽屉/解説モード壳 をこの位置に即時注入・無闪烁）
   頁側 API：
     RY.mountFooter()            … footer＋返頂 を呼出位置に注入（body 末尾で）
     RY.init()                   … 共通挙動一括起動（解説モード開閉/paging/palette/抽屉/navp/返頂）
     RY.group(sel, fn)           … 解説モードの seg ボタン束（aria-pressed 連動）
     RY.initImgPickers(pools)    … 換図 picker（頁が候補プールを渡す）
     RY.reveal(selectors)        … scroll reveal（頁が対象セレクタ列を渡す）
     RY.onFrame(fn) / RY.requestFrame() … 共用 rAF scroll frame への頁 hook（parallax/scrub 等）
   変更（2026-07-13・L2 追加 about-company）：① mountChrome サブページ適応に L2（親-子.html）→親 L1 の
     aria-current="true" 付与を追加 ② NAV 子菜単「会社概要」へ href 接線（既建の評審頁のみ・他項は頁建成時に順次）。
   変更（2026-07-13・L2 追加 about-strengths）：NAV 子菜単「強み・数字」へ href 接線。
   解説モードの中身：頁の <template id="ry-dm-content"> を共通壳へ展開。
   palette 組＝260720 strip（deep 本採用・選定機構撤去）。
   ============================================================ */
(function(){
"use strict";

/* ---- 共通 chrome テンプレ（index.html 2026-07-09 版から逐字移設）---- */
var SYMBOL_HTML = `<!-- 実 logo（260608_C と同じ #ry-mark／currentColor で再着色）-->
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="ry-mark" viewBox="0 0 176.19898 176.13703"><defs><clipPath id="rc1"><path transform="matrix(1,0,0,-1,-413.0675,890.94998)" d="M413.0675 714.8129H589.2665V890.94998H413.0675Z" clip-rule="evenodd"/></clipPath><clipPath id="rc2"><path transform="matrix(1,0,0,-1,-413.0675,890.94998)" d="M0 1000H1000V0H0Z"/></clipPath></defs><g clip-path="url(#rc1)"><g clip-path="url(#rc2)"><path transform="matrix(1,0,0,-1,7.3475039,221.48053)" d="M0 0C-1.662 1.377-4.088 2.065-7.278 2.065H-15.935V-13.935H-7.278C-4.088-13.935-1.662-13.236 0-11.836 1.661-10.438 2.492-8.471 2.492-5.935 2.492-3.355 1.661-1.377 0 0M2.688-35.181-6.164-22.394H-6.688-15.935V-35.181H-26.558V10.722H-6.688C-2.623 10.722 .907 10.043 3.901 8.688 6.896 7.333 9.202 5.41 10.82 2.918 12.437 .426 13.246-2.524 13.246-5.935 13.246-9.345 12.427-12.285 10.787-14.754 9.147-17.225 6.82-19.115 3.804-20.427L14.099-35.181Z" fill="currentColor"/><path transform="matrix(1,0,0,-1,50.364107,240.39844)" d="M0 0V-16.263H-10.623V.131L-28.394 29.64H-17.115L-4.853 9.246 7.41 29.64H17.836Z" fill="currentColor"/><path transform="matrix(1,0,0,-1,-413.0675,890.94998)" d="M504.939 680.191H509.792V634.289H504.939Z" fill="currentColor"/><path transform="matrix(1,0,0,-1,138.59168,225.67774)" d="M0 0C2.558-2.514 3.836-6.175 3.836-10.983V-30.983H-.819V-11.442C-.819-7.858-1.716-5.126-3.508-3.245-5.301-1.366-7.858-.426-11.181-.426-14.896-.426-17.836-1.53-20-3.737-22.164-5.945-23.246-8.994-23.246-12.885V-30.983H-27.901V3.509H-23.442V-2.853C-22.175-.754-20.416 .874-18.164 2.033-15.913 3.191-13.301 3.771-10.328 3.771-6 3.771-2.558 2.514 0 0" fill="currentColor"/><path transform="matrix(1,0,0,-1,160.36219,254.75983)" d="M0 0C-2.688 1.486-4.799 3.574-6.328 6.263-7.859 8.951-8.623 11.978-8.623 15.345-8.623 18.71-7.859 21.727-6.328 24.394-4.799 27.06-2.688 29.137 0 30.623 2.688 32.109 5.737 32.853 9.147 32.853 12.12 32.853 14.775 32.273 17.114 31.115 19.453 29.956 21.3 28.263 22.655 26.033L19.181 23.673C18.043 25.378 16.601 26.656 14.853 27.509 13.104 28.361 11.202 28.787 9.147 28.787 6.655 28.787 4.415 28.229 2.426 27.115 .437 26-1.115 24.415-2.229 22.361-3.345 20.306-3.902 17.968-3.902 15.345-3.902 12.678-3.345 10.328-2.229 8.296-1.115 6.263 .437 4.688 2.426 3.574 4.415 2.459 6.655 1.902 9.147 1.902 11.202 1.902 13.104 2.317 14.853 3.147 16.601 3.978 18.043 5.246 19.181 6.951L22.655 4.591C21.3 2.361 19.442 .666 17.082-.491 14.721-1.65 12.075-2.229 9.147-2.229 5.737-2.229 2.688-1.486 0 0" fill="currentColor"/><path transform="matrix(1,0,0,-1,191.44318,255.93958)" d="M0 0C-.679 .698-1.017 1.551-1.017 2.557-1.017 3.563-.679 4.403 0 5.082 .677 5.759 1.496 6.098 2.459 6.098 3.42 6.098 4.251 5.759 4.95 5.082 5.649 4.403 6 3.563 6 2.557 6 1.551 5.649 .698 4.95 0 4.251-.7 3.42-1.05 2.459-1.05 1.496-1.05 .677-.7 0 0" fill="currentColor"/><path transform="matrix(1,0,0,-1,81.548007,58.54303)" d="M0 0-.089 44.543-37.847 44.541C-54.25 44.541-67.548 31.215-67.548 14.778V-103.594H-40.223V29.064C-40.223 32.68-37.298 35.612-33.69 35.612-30.081 35.612-27.155 32.68-27.155 29.064V-14.286-29.581-29.647-103.594H0V-59.228C0-43.766-11.77-31.067-26.82-29.614-11.77-28.161 0-15.463 0 0M53.288 44.543V-88.115C53.288-91.732 50.36-94.663 46.746-94.663 43.132-94.663 40.202-91.732 40.202-88.115V-44.765-29.47-29.405 44.543H13.01V.177C13.01-15.286 24.796-27.984 39.867-29.437 24.796-30.891 13.01-43.588 13.01-59.051L13.098-103.594 50.91-103.593C67.335-103.593 80.651-90.267 80.651-73.83V44.543Z" fill="currentColor" fill-rule="evenodd"/></g></g></symbol></svg>`;

var NAV_HTML = `<!-- 全局吸顶 NAV（動效パス：hero 内 → body 直下へ移動。fixed を hero の isolation stacking-context から出すため／markup は不変·親要素のみ変更）-->
<nav class="hero-nav" aria-label="グローバルナビ">
  <div class="hero-nav-in">
    <a class="hero-nav-logo" href="#top" aria-label="株式会社RY ホーム"><svg class="hnl-mark" viewBox="0 0 176.19898 176.13703"><use href="#ry-mark"/></svg><span class="hnl-wm">株式会社RY</span></a>
    <div class="hero-nav-menu" id="navMenu">
      <div class="nav-item">
        <a href="about.html">RYについて</a>
        <div class="nav-sub" aria-label="RYについて の下層">
          <a href="about-company.html">会社概要</a>
          <a href="about-strengths.html">強み・数字</a>
          <a href="about-network.html">多言語・ネットワーク</a>
        </div>
      </div>
      <div class="nav-item">
        <a href="business.html">事業紹介</a>
        <div class="nav-sub" aria-label="事業紹介 の下層">
          <a>保有・管理・運営</a>
          <a>建物修繕</a>
          <a>投資情報提供</a>
          <a>投資サポート</a>
          <a>実績・事例</a>
        </div>
      </div>
      <div class="nav-item">
        <a href="guide.html">投資ガイド</a>
      </div>
      <a class="hero-cta" href="#contact">お問い合わせ</a>
    </div>
    <a class="hero-cta hero-cta-bar" href="#contact">お問い合わせ</a>
    <button class="nav-burger" type="button" aria-label="メニュー" aria-expanded="false" aria-controls="navDrawer"><span></span><span></span><span></span></button>
  </div>
</nav>`;

var DRAWER_HTML = `<!-- 手机端 下拉抽屉（body 直下＝.hero-nav の backdrop-filter 包含块の外·fixed が視口基準に解決。桌面端は CSS で display:none）-->
<nav class="nav-drawer" id="navDrawer" aria-label="モバイルメニュー" aria-hidden="true">
  <a href="about.html">RYについて</a>
  <a href="business.html">事業紹介</a>
  <a href="guide.html">投資ガイド</a>
</nav>`;

var DM_TOGGLE_HTML = `<button class="dm-toggle" id="dmToggle" aria-expanded="false" aria-label="解説モード切替"><span>解</span><span>説</span><span>表</span><span>示</span></button>`;
var DM_OPEN_HTML = `<aside class="dm-panel" id="dmPanel" hidden aria-label="解説モード">`;
var DM_HEAD_HTML = `  <div class="dm-head"><b>解説モード</b><button class="dm-close" id="dmClose" aria-label="閉じる">×</button></div>`;

/* palette 組＝260720 PM strip（deep 本採用・選定機構撤去） */

var FOOTER_HTML = `<!-- 08 FOOTER 帯 -->
<div class="footer-wf"><div class="wrap">
  <div class="sec-id" style="color:rgba(255,255,255,.5)">08 / FOOTER（全站共通·260608_C 蒸馏）<span class="lv" style="background:#fff;color:var(--brand)">主色帯</span></div>
  <div class="f-top">
    <div>
      <div class="f-brand"><svg class="f-logo" viewBox="0 0 176.19898 176.13703"><use href="#ry-mark"/></svg><span class="f-wm">株式会社RY</span></div>
      <dl class="f-dl"><dt>設立</dt><dd>2021年11月</dd><dt>所在地</dt><dd>東京都港区赤坂2丁目5番8号 ヒューリックJP赤坂ビル3F-6F</dd><dt>代表者</dt><dd>清水 梛央</dd><dt>TEL</dt><dd><a href="tel:0344000809">03-4400-0809</a></dd></dl>
    </div>
    <div class="f-legal"><h4>Legal</h4><ul>
      <li><a href="#">サイトマップ</a></li>
      <li><span class="soon">プライバシーポリシー<span class="kari">（準備中）</span></span></li>
      <li><span class="soon">サイトのご利用について<span class="kari">（準備中）</span></span></li>
    </ul></div>
  </div>
  <p class="f-disc">【免責事項（案・公開前に行政書士・弁護士の確認）】当社は宅地建物取引業免許および金融商品取引業の登録を受けておりません。特定の金融商品・不動産の購入を勧誘するものではなく、個別の投資助言・投資判断の代行・資産運用の受託を行いません。掲載情報は一般的な情報提供を目的とし、将来の収益・成果を保証しません。掲載の数字・データは作成時点のものです。</p>
  <p class="f-copy">© 2026 株式会社RY</p>
</div></div>`;

var TOTOP_HTML = `<!-- 返回顶部（260608_C 完全照搬·样式/特效/动画）-->
<button class="to-top" id="toTop" aria-label="ページ上部へ戻る"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>`;

/* ---- 共通ヘルパ（元 index IIFE から移設）---- */
  function group(sel,fn){ var b=document.querySelectorAll(sel); b.forEach(function(x){ x.addEventListener("click",function(){ fn(x); b.forEach(function(y){ y.setAttribute("aria-pressed",y===x?"true":"false"); }); }); }); }

/* ===== 全库画像リスト + poolAll（全库槽·DRY）===== */
var ALL_IMAGES = [
  "01_guide-plan-b",
  "02_hanvin-cheong",
  "04_johan-mouchet",
  "05_kazuo-ota",
  "06_l-ch",
  "07_matt-mutlu",
  "08_petr",
  "09_amineispir",
  "10_asia-culture",
  "12_ellusionist",
  "13_faruktokluoglu",
  "14_kampus-660",
  "15_kampus-662",
  "16_kuma-jio",
  "17_mebmrauf",
  "18_nappy",
  "19_railgunbreaker",
  "20_toki-no-ori",
  "21_phc-software",
  "22_pjh",
  "23_trac-vu",
  "24_tsuyoshi-kozu",
  "25_aditya-anjagi",
  "26_freguesia",
  "27_getty-1NQ9",
  "28_getty-HfwZ",
  "29_getty-JGbH",
  "30_guo-ziyu",
  "31_huy-phan",
  "32_kiki",
  "33_michal-vrba",
  "34_night-owl",
  "35_niu",
  "36_pourya-gohari",
  "37_roman-davydko",
  "38_ryan-wu",
  "39_szymon-23yv",
  "40_szymon-Keba",
  "41_teng-yuhong",
  "42_tsuyoshi-B7WW",
  "43_tsuyoshi-sUnt",
  "44_vanja-milicic",
  "aditya-anjagi-KZSDCocsOEE-unsplash",
  "beth-macdonald-ozc4SB3b8xs-unsplash",
  "bo-peng-93tU5310sFo-unsplash",
  "chen-jack-SwOU27y-7Sk-unsplash",
  "christina-wocintechchat-com-m-eF7HN40WbAQ-unsplash",
  "christopher-politano-cUuQ-L7XlzM-unsplash",
  "curated-lifestyle-tFNOLyih_cw-unsplash",
  "curated-lifestyle-uKh6BAovukk-unsplash",
  "curated-lifestyle-zd5CY2KWzHs-unsplash",
  "freguesia-de-estrela-KGLXzxjq9G0-unsplash",
  "getty-images-HfwZGsly8bw-unsplash",
  "getty-images-JGbH69r09dU-unsplash",
  "getty-images-WSFZHeBOicc-unsplash",
  "getty-images-Wb4D-1wIpLI-unsplash",
  "getty-images-i1gRNqPHpiw-unsplash",
  "getty-images-ySFV4eoiWfw-unsplash",
  "guo-ziyu-Vur3FaIzFR0-unsplash",
  "huy-phan-_0cMXnXumW8-unsplash",
  "james-pere-fceahev31_o-unsplash",
  "johannes-sejer-xjoNmIWq3wo-unsplash",
  "joseph-sullan-5Fc-dKWSUU8-unsplash",
  "kiki-RnbQSysWOhY-unsplash",
  "kobu-agency-7okkFhxrxNw-unsplash",
  "kun-w-cyOiBjKRFn8-unsplash",
  "leo-okuyama-zriTEKDT1-A-unsplash",
  "lucius-hunter-Lfu1ICiJfOw-unsplash",
  "mak-GYeT5f3aGrE-unsplash",
  "mak-cQxVzy9f4xM-unsplash",
  "marco-kaufmann-0kbNh7XrJ7Q-unsplash",
  "michael-pointner-i1fu0UG_ybQ-unsplash",
  "michal-vrba-aFL5zs_tCBA-unsplas",
  "night-owl-P4PaGY1Oe3c-unsplash",
  "niu-orJX4Pp4ctA-unsplash",
  "oyut-jargalsaikhan-WFxi7CXFtDk-unsplash",
  "pourya-gohari--xN7kiPnXTg-unsplash",
  "robert-ruggiero-X2bcQMMhaow-unsplash",
  "roman-davydko-l4jgRsJZ5DQ-unsplash",
  "ryan-wu-KCkCPCLwoVc-unsplash",
  "shraga-kopstein-E5S7Aks1fFY-unsplash",
  "szymon-shields-23yvcQJoxBI-unsplash",
  "szymon-shields-KebaWH0BVCc-unsplash",
  "szymon-shields-lRulcJ232XE-unsplash",
  "teng-yuhong-7vwsQxHGaYg-unsplash",
  "teodor-kuduschiev-4u_t4jXkol4-unsplash",
  "the-jopwell-collection-_jfWNP86sNM-unsplash",
  "tsuyoshi-kozu-6CIhr2rzj78-unsplash",
  "tsuyoshi-kozu-B7WWCyQmhRc-unsplash",
  "tsuyoshi-kozu-cr7mSB_r4Hk-unsplash",
  "tsuyoshi-kozu-sUnt68uI5b4-unsplash",
  "tunafish-CqZWwYZdiOg-unsplash",
  "van-tay-media-TFFn3BYLc5s-unsplash",
  "vanja-milicic-VuIVcLgzfn4-unsplash",
  "xinqi-yao-9f5M0KTl6Uc-unsplash",
  "yamato-yamaguchi-wIPTPTGbRuY-unsplash",
  "zhenyu-luo-XQCqXajLCp4-unsplash"
];
function poolAll(def){ return [def].concat(ALL_IMAGES.filter(function(n){ return n!==def; })); }

/* 換図 picker エンジン（imgsw ◀▶ ＋ ⊞ グリッド）*/
var _pPools={}, _pIdx={};
function _pSet(sec){
  var pool=_pPools[sec]; if(!pool) return;
  var i=_pIdx[sec], name=pool[i];
  var el=document.getElementById("img-"+sec); if(el){ el.src="images/"+name+".webp"; }
  var lbl=document.querySelector('.imgsw[data-sec="'+sec+'"] .imgnow'); if(lbl){ lbl.textContent=name+" \u00B7 "+(i+1)+"/"+pool.length; }
  if(_gridSec===sec) _gridHi(i);
}
function setImgTo(sec,i){ if(_pPools[sec]){ _pIdx[sec]=i; _pSet(sec); } }
function initImgPickers(pools){
  _pPools=pools; _pIdx={}; Object.keys(pools).forEach(function(k){ _pIdx[k]=0; });
  document.querySelectorAll(".imgsw").forEach(function(g){
    var sec=g.dataset.sec, pool=pools[sec]; if(!pool) return;
    var seg=g.querySelector(".imgseg")||g;
    var pv=g.querySelector(".imgprev"), nx=g.querySelector(".imgnext");
    if(pv) pv.addEventListener("click",function(){ _pIdx[sec]=(_pIdx[sec]-1+pool.length)%pool.length; _pSet(sec); });
    if(nx) nx.addEventListener("click",function(){ _pIdx[sec]=(_pIdx[sec]+1)%pool.length; _pSet(sec); });
    var gb=document.createElement("button"); gb.className="imggrid"; gb.type="button";
    gb.setAttribute("aria-label","\u753B\u50CF\u30B0\u30EA\u30C3\u30C9"); gb.textContent="\u229E";
    gb.addEventListener("click",function(){ openGrid(sec); });
    seg.appendChild(gb);
    _pSet(sec);
  });
}

/* ===== 画像グリッド modal ===== */
var _gridSec=null, _gridEl=null;
function _gridBuild(){
  if(_gridEl) return _gridEl;
  var o=document.createElement("div"); o.className="ry-grid"; o.id="ryGrid"; o.hidden=true;
  o.innerHTML='<div class="ry-grid-bg"></div><div class="ry-grid-box"><div class="ry-grid-hd"><span class="ry-grid-t"></span><button class="ry-grid-x" type="button" aria-label="close">\u2715</button></div><div class="ry-grid-list"></div></div>';
  document.body.appendChild(o);
  o.querySelector(".ry-grid-bg").addEventListener("click",closeGrid);
  o.querySelector(".ry-grid-x").addEventListener("click",closeGrid);
  document.addEventListener("keydown",function(e){ if(e.key==="Escape") closeGrid(); });
  _gridEl=o; return o;
}
function openGrid(sec){
  var pool=_pPools[sec]; if(!pool||!pool.length) return;
  var o=_gridBuild(); _gridSec=sec;
  o.querySelector(".ry-grid-t").textContent=sec+" \u00B7 "+pool.length;
  var list=o.querySelector(".ry-grid-list"); list.innerHTML="";
  var frag=document.createDocumentFragment();
  pool.forEach(function(name,idx){
    var b=document.createElement("button"); b.className="ry-grid-cell"; b.type="button"; b.dataset.i=idx;
    if(idx===_pIdx[sec]) b.classList.add("on");
    b.innerHTML='<img loading="lazy" decoding="async" src="images/thumb/'+name+'.webp" alt=""><span>'+name+'</span>';
    b.addEventListener("click",function(){ setImgTo(sec,idx); closeGrid(); });
    frag.appendChild(b);
  });
  list.appendChild(frag);
  o.hidden=false; document.body.classList.add("ry-grid-open");
}
function closeGrid(){ if(_gridEl){ _gridEl.hidden=true; } document.body.classList.remove("ry-grid-open"); _gridSec=null; }
function _gridHi(i){ if(!_gridEl||_gridEl.hidden) return; _gridEl.querySelectorAll(".ry-grid-cell").forEach(function(c){ c.classList.toggle("on", (+c.dataset.i)===i); }); }

/* scroll reveal エンジン（元 index 実装の revealSel を引数 selectors に一般化・処理は同一）*/
function reveal(selectors){
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = [];
  selectors.forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(el){ el.classList.add("reveal"); revealEls.push(el); });
  });
  if(reduce || !("IntersectionObserver" in window)){
    revealEls.forEach(function(el){ el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold:0.12, rootMargin:"0px 0px -8% 0px" });
    revealEls.forEach(function(el){ io.observe(el); });
  }
}

/* 共用 rAF frame への頁 hook（parallax／Facts scrub 等を頁が登録）*/
var hooks = [];
function onFrame(fn){ hooks.push(fn); if(RY.requestFrame){ RY.requestFrame(); } }

/* ---- chrome 注入（parse 時同期・script 自身の位置へ）---- */
function mountChrome(){
  var here = document.currentScript;
  if(!here){ return; }
  var tpl = document.getElementById("ry-dm-content");
  var dmContent = tpl ? tpl.innerHTML : "";
  var html = SYMBOL_HTML + "\n\n" + NAV_HTML + "\n\n" + DRAWER_HTML + "\n\n" +
    DM_TOGGLE_HTML + "\n" + DM_OPEN_HTML + "\n" + DM_HEAD_HTML + "\n" + dmContent + "\n</aside>";
  here.insertAdjacentHTML("beforebegin", html);

  /* ---- サブページ適応（2026-07-10 L1 解耦で追加）----
     NAV/抽屉は上の単一ソース＝Home 形（logo→#top・CTA→#contact）。現頁ファイル名で判定し
     index 以外では：① logo→index.html ② CTA→index.html#contact（#contact は Home 内 section）
     ③ 現頁と一致するリンク＝aria-current="page"（標示 CSS＝shared.css NAV 節）・href→#top（自頁再読込を回避）
     ※ file:// 直開きでも pathname 末尾のファイル名で成立。index では何も変えない（回帰ゼロ）。 */
  var page = location.pathname.split("/").pop() || "index.html";
  if(page !== "index.html"){
    /* L2 追加（2026-07-13・about-company 起）：評審集の L2 ファイル名規約＝「親-子.html」。
       現頁一致＝aria-current="page"（href→#top・自頁再読込回避／nav-sub 内の自頁リンクも該当）。
       L2 では所属の親 L1 リンクへ aria-current="true" を付与（リンクは親頁へ生かす・href 不変）。
       標示 CSS＝shared.css NAV 節（[aria-current] へ一般化済）。L1／index＝正規表現不一致で従来挙動のまま（回帰ゼロ）。 */
    var m = page.match(/^(about|business|guide)-/);
    var parent = m ? (m[1] + ".html") : null;
    document.querySelectorAll(".hero-nav a, .nav-drawer a").forEach(function(a){
      var href = a.getAttribute("href");
      if(href === page){ a.setAttribute("aria-current","page"); a.setAttribute("href","#top"); }
      else if(parent && href === parent){ a.setAttribute("aria-current","true"); }
    });
    document.querySelectorAll(".hero-nav .hero-nav-logo").forEach(function(a){ a.setAttribute("href","index.html"); });
    document.querySelectorAll(".hero-nav .hero-cta").forEach(function(a){ a.setAttribute("href","index.html#contact"); });
  }
}

function mountFooter(){
  var here = document.currentScript;
  if(here){ here.insertAdjacentHTML("beforebegin", FOOTER_HTML + "\n\n" + TOTOP_HTML); }
}

/* ---- 共通挙動 init（footer 注入後・頁 script より先に呼ぶ）---- */
function init(){
  var body=document.body;
  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mqMobile = matchMedia("(max-width:760px)");
  // 解説パネル 開閉
  var panel=document.getElementById("dmPanel"), tgl=document.getElementById("dmToggle"), cls=document.getElementById("dmClose");
  function openPanel(o){ panel.hidden=!o; document.body.classList.toggle("dm-on", !!o); tgl.setAttribute("aria-expanded",o?"true":"false"); }
  tgl.addEventListener("click",function(){ openPanel(panel.hidden); });
  cls.addEventListener("click",function(){ openPanel(false); });

  /* 解説モード ページング（1=レイアウト / 2=配色）*/
  var dmPages=panel.querySelectorAll(".dm-page"), dmNav=panel.querySelectorAll(".dm-nav button");
  dmNav.forEach(function(b){ b.addEventListener("click",function(){ var p=b.dataset.page; dmPages.forEach(function(pg){ pg.hidden = pg.dataset.page!==p; }); dmNav.forEach(function(x){ x.setAttribute("aria-pressed", x===b?"true":"false"); }); }); });

  var toTop=document.getElementById("toTop");
  if(toTop){ var onScrollTop=function(){ toTop.classList.toggle("show", window.scrollY > innerHeight*0.9); }; onScrollTop(); addEventListener("scroll",onScrollTop,{passive:true}); toTop.addEventListener("click",function(){ scrollTo({top:0,behavior:reduce?"auto":"smooth"}); }); }

  /* ---- 吸顶 NAV 渐变＋返顶白闪（元・動效パス IIFE から移設）。頁固有 frame（parallax/scrub）は hooks 経由 ----
     body[data-nav="solid"]（L1 等・浅色 type-led 页頭）：NAV 常時実底＝グラデ/白閃 不使用
     （--navp:1 は shared.css が data 属性で先行適用＝init 前の白字化なし・ここは .stuck 付与とスクロール更新の skip のみ） */
  var nav      = document.querySelector(".hero-nav");
  var navSolid = body.dataset.nav === "solid";
  var ticking = false, wasScrolled = false;
  if(nav && navSolid){ nav.classList.add("stuck"); }

  function navRange(){ var after = document.querySelector(".about"); var end = after ? after.offsetTop : (window.innerHeight * 0.9); return Math.max(1, end); }

  function frame(){
    ticking = false;
    var y = window.scrollY || window.pageYOffset || 0;

    if(nav && !navSolid){
      /* (4a) NAV 渐变（smoothstep=循序渐进） */
      var p = Math.min(1, Math.max(0, y / navRange()));
      var eased = p * p * (3 - 2 * p);
      nav.style.setProperty("--navp", eased.toFixed(3));
      if(y > 36){ nav.classList.add("stuck"); } else { nav.classList.remove("stuck"); }

      /* (4b) 返顶白闪：曾滚动 → 回到顶端の瞬間に一度（reduce 不放） */
      if(y > 80){ wasScrolled = true; }
      if(wasScrolled && y <= 2 && !reduce){
        wasScrolled = false;
        nav.classList.remove("flash"); void nav.offsetWidth; nav.classList.add("flash");
      }
    }

    /* 頁固有 frame hook（parallax／Facts scrub 等・RY.onFrame 登録分）*/
    for(var i=0;i<hooks.length;i++){ hooks[i](y); }
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true });
  if(nav){ nav.addEventListener("animationend", function(e){ if(e.animationName === "navFlash"){ nav.classList.remove("flash"); } }); }
  /* ---- 5) 手机端 汉堡 → 下拉抽屉（≤760px·抽屉=body 直下 #navDrawer·状态挂 body.menu-open）---- */
  var burger = nav ? nav.querySelector(".nav-burger") : null;
  var navDrawer = document.getElementById("navDrawer");
  function setMenu(open){
    document.body.classList.toggle("menu-open", open);
    if(burger){ burger.setAttribute("aria-expanded", open ? "true" : "false"); }
    if(navDrawer){ navDrawer.setAttribute("aria-hidden", open ? "false" : "true"); }
  }
  if(burger){ burger.addEventListener("click", function(){ setMenu(!document.body.classList.contains("menu-open")); }); }
  if(navDrawer){ navDrawer.addEventListener("click", function(e){ if(e.target.closest("a")){ setMenu(false); } }); }
  document.addEventListener("keydown", function(e){ if(e.key === "Escape" && document.body.classList.contains("menu-open")){ setMenu(false); } });

  if(mqMobile.addEventListener){ mqMobile.addEventListener("change", function(){ if(!mqMobile.matches){ setMenu(false); } onScroll(); }); }
  RY.requestFrame = onScroll;
  frame();
}

window.RY = { group:group, initImgPickers:initImgPickers, poolAll:poolAll, setImgTo:setImgTo, openGrid:openGrid, reveal:reveal, onFrame:onFrame,
              mountFooter:mountFooter, init:init, requestFrame:null };

mountChrome();
})();
