// 하나의숲 (One Forest) — 공통 스크립트: 모바일 내비게이션 토글 + 시안용 더미 폼 제출

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const carousel = document.getElementById('homeCarousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const dotsWrap = carousel.querySelector('.carousel-dots');
    const prevBtn = carousel.querySelector('.carousel-btn--prev');
    const nextBtn = carousel.querySelector('.carousel-btn--next');

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `${i + 1}번째 슬라이드로 이동`);
      dot.addEventListener('click', () => {
        track.scrollTo({ left: slides[i].offsetLeft, behavior: 'smooth' });
      });
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    const setActive = () => {
      const idx = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === idx)));
    };
    setActive();
    track.addEventListener('scroll', () => {
      window.clearTimeout(track._scrollTimer);
      track._scrollTimer = window.setTimeout(setActive, 80);
    });

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('form[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.parentElement.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        success.setAttribute('role', 'status');
      }
      form.reset();
    });
  });
});
