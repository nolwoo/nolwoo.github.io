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
