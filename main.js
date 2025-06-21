// イチオシ（recommend）用 Swiper
const swiper = new Swiper('.swiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
    el: '.swiper-pagination',
    clickable: true,
    },
    navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
    }
});

// ラインナップ用 Swiper（カテゴリ別に複数ある）
document.querySelectorAll('#lineup .swiper').forEach(swiperEl => {
    new Swiper(swiperEl, {
        loop: false,
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: swiperEl.querySelector('.swiper-pagination'),
            clickable: true,
        },
    });
});

  // カテゴリ切り替え（タブ切り替え）
const tabButtons = document.querySelectorAll('.tab-button');
const menuGroups = document.querySelectorAll('.menu-group');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
    const category = button.dataset.category;

    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    menuGroups.forEach(group => {
        group.classList.toggle('active', group.dataset.category === category);
    });
    });
});

const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');

hamburger.addEventListener('click', () => {
hamburger.classList.toggle('open');
nav.classList.toggle('open');
});