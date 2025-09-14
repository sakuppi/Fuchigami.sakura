
  // ページ読み込みが終わったらローダーをふわっと消す（最低表示0.9s）
  (function () {
    const loader = document.getElementById('loader');
    if (!loader) return;
    const MIN = 3000; // ms
    const start = performance.now();
    window.addEventListener('load', () => {
      const wait = Math.max(0, MIN - (performance.now() - start));
      setTimeout(() => loader.classList.add('done'), wait);
      // 余裕があればDOMから削除
      loader.addEventListener('transitionend', () => loader.remove(), { once:true });
    });
  })();


(function(){
  const loader = document.getElementById('loader');
  if (!loader) return;
  // SVGRepo傘の path（1行）
  const UMB_PATH = `m17.852 11.059c-.968.001-1.837.426-2.431 1.1l-.003.004c-.596-.678-1.465-1.103-2.434-1.104-.968.001-1.837.426-2.431 1.099l-.003.004c-.597-.677-1.466-1.102-2.434-1.103-.968.001-1.837.426-2.431 1.099l-.003.004c-.597-.677-1.466-1.102-2.434-1.103-.002 0-.003 0-.005 0-.588 0-1.139.157-1.614.432l.016-.008c.276-4.705 4.156-8.417 8.904-8.423h.001c4.749.006 8.629 3.718 8.903 8.399l.001.024c-.459-.266-1.01-.423-1.598-.423-.002 0-.003 0-.005 0zm-6.484-9.597v-.646c0-.451-.366-.817-.817-.817-.451 0-.817.366-.817.817v.646c-5.461.442-9.727 4.98-9.735 10.515v2.333c0 .451.366.817.817.817.451 0 .816-.366.817-.817.001-.893.724-1.617 1.617-1.617.893.001 1.616.725 1.617 1.617 0 .451.366.817.817.817.451 0 .817-.366.817-.817.001-.893.724-1.617 1.617-1.617.893.001 1.617.724 1.617 1.617v6.439c.002 1.794 1.456 3.248 3.25 3.25 1.794-.002 3.248-1.456 3.25-3.25 0-.451-.366-.817-.817-.817-.451 0-.817.366-.817.817-.001.893-.724 1.616-1.616 1.617-.893-.001-1.617-.724-1.617-1.617v-6.439c.001-.893.724-1.617 1.617-1.617.893.001 1.616.725 1.617 1.617 0 .451.366.817.817.817.451 0 .817-.366.817-.817.001-.893.724-1.617 1.617-1.617.893.001 1.616.725 1.617 1.617 0 .451.366.817.817.817.451 0 .817-.366.817-.817v-2.332c-.008-5.536-4.273-10.073-9.696-10.514l-.038-.002z`;

  // 色・位置・スピードのプリセット（好きに編集OK）
  const specs = [
    { x: 10, hue: 330, delay: .0, dur: 6.2, scale: 1.00 },
    { x: 22, hue: 200, delay: .2, dur: 5.8, scale: .95 },
    { x: 34, hue: 260, delay: .4, dur: 6.4, scale: 1.05 },
    { x: 46, hue: 150, delay: .1, dur: 5.9, scale: .92 },
    { x: 58, hue:  55, delay: .3, dur: 6.6, scale: 1.08 },
    { x: 70, hue:  20, delay: .5, dur: 5.7, scale: .90 },
    { x: 82, hue: 275, delay: .1, dur: 6.1, scale: .98 },
    { x: 90, hue: 195, delay: .4, dur: 6.3, scale: 1.02 },
  ];

  const NS = 'http://www.w3.org/2000/svg';
  specs.forEach(s => {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'umb umb--ext');
    svg.setAttribute('viewBox', '-1.5 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.setProperty('--x', `${s.x}%`);
    svg.style.setProperty('--hue', s.hue);
    svg.style.setProperty('--delay', `${s.delay}s`);
    svg.style.setProperty('--dur', `${s.dur}s`);
    svg.style.setProperty('--scale', s.scale);

    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', UMB_PATH);
    svg.appendChild(path);
    loader.appendChild(svg);
  });
})();


const marqueeInner = document.querySelector('.marquee__inner');
if (marqueeInner) {
  const base = marqueeInner.querySelector('.outline').textContent.trim();

  // 中身を2回以上並べて、@keyframes( -50% )で無限スクロール
  marqueeInner.innerHTML = `
    <span class="outline">${base}</span>
    <span class="outline">${base}</span>
    <span class="outline">${base}</span>
  `;

  // テキスト幅に応じて速度を微調整（任意）
  const totalWidth = marqueeInner.scrollWidth;
  // 画面幅の割合からざっくり計算（大きいほど長く）
  const seconds = Math.max(14, Math.min(28, totalWidth / 60));
  marqueeInner.style.animationDuration = `${seconds}s`;
}

// ====== 動きを苦手とする環境では停止 ======
const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
const applyMotionPref = () => {
  marqueeInner && (marqueeInner.style.animationPlayState = mql.matches ? 'paused' : 'running');
};
mql.addEventListener?.('change', applyMotionPref);
applyMotionPref();


  // loading… を１文字ずつspan化して、時間差で上下
  (function(){
    const el = document.querySelector('.loader__text');
    if(!el) return;
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.setProperty('--i', i);
      el.appendChild(span);
    });
  })();

// ===== Hero Fade (pin + fade out) =====
(function () {
  if (window.__heroFadeInitialized) return;
  window.__heroFadeInitialized = true;

  // GSAP未ロードなら終了
  if (!(window.gsap && window.ScrollTrigger)) {
    console.warn("GSAP/ScrollTrigger が読み込まれていません。");
    return;
  }

  // hero-fade 要素がなければ終了
  if (!document.querySelector('.hero-fade')) return;

  if (window.gsap && window.ScrollTrigger) { gsap.registerPlugin(ScrollTrigger); }

  const endLen = matchMedia("(max-width: 767px)").matches ? "+=80%" : "+=120%";

  gsap.timeline({
    scrollTrigger: {
      trigger: ".hero-fade",
      start: "top top",
      end: endLen,
      scrub: 1,
      pin: true,
      anticipatePin: 1
    }
  })
  .to(".hero-fade", { backgroundColor: "var(--yellow-bg)", ease: "none" }, 0)
  .to(".hero-fade .hero",    { opacity: 0, y: -50, ease: "none" }, 0)
  .to(".hero-fade .marquee", { opacity: 0, y: -50, ease: "none" }, 0);

  gsap.set(".hero-fade", { willChange: "transform" });
})();


document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const about = document.querySelector("#about");
  if (!about) return;

  const isDetail = about.classList.contains("about--detail");

  // 画像：トップは before、詳細は after
  const activePhoto = isDetail
    ? ".about__photo .photo--after"
    : ".about__photo .photo--before";

  // 文章：ページごとにターゲット切り替え
  const textTargets = isDetail
    ? [".about__heading", ".about__long-body", ".about__back"]
    : [".about__name", ".about__bio", ".about__toggle"];

  // 見出し（トップは .about__label の1文字ずつ、詳細はブロックで）
  const hasLabelSpans = !!about.querySelector(".about__label span");

  // 初期化（ふわっと用）
  about.classList.add("fx-init");
  gsap.set(activePhoto, { opacity: 0, scale: 1.06 });
  gsap.set(".fx-photoMask", { xPercent: 0 });

  if (hasLabelSpans) {
    gsap.set(".about__label span", { opacity: 0, y: 20 });
  } else if (isDetail) {
    gsap.set(".about__heading", { opacity: 0, y: 20 });
  }

  gsap.set(textTargets, { opacity: 0, y: 20 });

  // アニメーション本体
  const tl = gsap.timeline({
    scrollTrigger: { trigger: "#about", start: "top 70%", once: true }
  });

  tl.to(".fx-photoMask", { xPercent: 105, duration: 0.9, ease: "power3.inOut" }, 0)
    .to(activePhoto, { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }, 0.08)
    // 見出し：トップは1文字ずつ／詳細はブロック
    .to(hasLabelSpans ? ".about__label span" : ".about__heading", {
      y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: hasLabelSpans ? 0.05 : 0
    }, 0.15)
    // 文章（名前/本文/ボタン or 見出し以外の本文/戻る）
    .to(textTargets, {
      y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08
    }, 0.35)
    .add(() => about.classList.remove("fx-init"));
});

gsap.registerPlugin(ScrollTrigger);

(function setupHistoryKV() {
  const section = document.querySelector("#history");
  if (!section) return;

  const stack = section.querySelector(".kv__stack");
  const imgs  = gsap.utils.toArray("#history .kv__img");
  if (!stack || imgs.length <= 1) return;

  // セクション内のスクロール量（= (枚数 - 1) * 100vh）
  function pinDistance() {
    return window.innerHeight * (imgs.length - 1);
  }

  // 見せ方のタイムライン
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section.querySelector(".history__kv"), // このブロック内だけpin
      start: "top top",
      end: () => "+=" + pinDistance(),
      scrub: true,
      pin: stack,
      anticipatePin: 1
    }
  });

  // 2枚目以降を順番に「下→上に開く」
  imgs.slice(1).forEach((img, i) => {
    tl.to(img, { clipPath: "inset(0% 0 0 0)", duration: 1 }, i);
  });

  // セクションの高さを画像枚数に応じて調整（保険）
  const kv = section.querySelector(".history__kv");
  function resizeKV() {
    kv.style.height = (window.innerHeight * (Math.max(1, imgs.length))) + "px";
    ScrollTrigger.refresh();
  }
  resizeKV();
  window.addEventListener("resize", resizeKV);
})();

gsap.registerPlugin(ScrollTrigger);

(function initCareerAnimation() {
  const root = document.querySelector("#career");
  if (!root) return;

  const imgs = gsap.utils.toArray("#career .career__kv-img");
  const items = gsap.utils.toArray("#career .career__item");

  // 初期設定
  gsap.set(imgs.slice(1), { clipPath: "inset(100% 0 0 0)" });
  gsap.set(items, { opacity: 0, y: 16 });

  // スクロールアニメーション
  items.forEach((item) => {
    const idx = +item.dataset.idx || 0;

    // フェードイン
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 75%",
      },
    });

    // 画像切替
    ScrollTrigger.create({
      trigger: item,
      start: "top 60%",
      end: "bottom 60%",
      onEnter: () => showImage(idx),
      onEnterBack: () => showImage(idx),
    });
  });

  function showImage(idx) {
    imgs.forEach((img, i) => {
      gsap.to(img, {
        clipPath: i === idx ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
        duration: 0.8,
        ease: i === idx ? "power2.out" : "power2.in",
      });
    });
  }

  window.addEventListener("resize", () => ScrollTrigger.refresh());
})();

// ★ ページ読み込み時に丸にしたいなら true、四角なら false
const CIRCLE_DEFAULT = false;

(function setupShapeToggle(){
  const root = document.querySelector("#career");
  if(!root) return;

  // 初期形状
  root.classList.toggle("is-circle", CIRCLE_DEFAULT);

  // キーボードでトグル（c キー）
  window.addEventListener("keydown", (e)=>{
    if(e.key.toLowerCase() === "c"){
      root.classList.toggle("is-circle");
      // サイズが変わるので再計測
      ScrollTrigger.refresh();
    }
  });
})();



