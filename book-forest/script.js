// 인생책숲 — 공통 스크립트: 모바일 내비게이션 + data/programs.js, data/reviews.js를 화면에 렌더링

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

const STATUS_CLASS = {
  '모집중': 'status-badge--open',
  '모집마감': 'status-badge--closed',
  '진행중': 'status-badge--ongoing',
  '종료': 'status-badge--done'
};

function detailRow(label, value) {
  if (!value || (Array.isArray(value) && value.length === 0)) return '';
  const text = Array.isArray(value) ? value.join(', ') : value;
  return `<li><strong>${escapeHtml(label)}</strong><span>${escapeHtml(text)}</span></li>`;
}

function programCard(p, { full = false } = {}) {
  const statusClass = STATUS_CLASS[p.status] || 'status-badge--closed';
  const details = full ? [
    detailRow('일정', p.schedule),
    detailRow('기간', p.period),
    detailRow('형태', p.mode === '오프라인' ? `오프라인 · ${p.place || ''}` : '온라인'),
    detailRow('정원', p.capacity),
    detailRow('참가비', p.fee),
    detailRow('신청 마감', p.deadline),
    detailRow('진행자', p.host),
    detailRow('지정도서', p.books)
  ].join('') : [
    detailRow('일정', p.schedule),
    detailRow('참가비', p.fee)
  ].join('');

  const refund = full && p.refund
    ? `<p class="refund-note">환불 규정: ${escapeHtml(p.refund)}</p>`
    : '';

  return `
    <article class="program-card">
      <div class="top-row">
        <span class="type-badge">${escapeHtml(p.type)}</span>
        <span class="status-badge ${statusClass}">${escapeHtml(p.status)}</span>
      </div>
      <h3>${escapeHtml(p.name)}${p.cohort ? ` <span class="cohort">${escapeHtml(p.cohort)}</span>` : ''}</h3>
      <p class="summary">${escapeHtml(p.summary || '')}</p>
      <ul class="detail-list">${details}</ul>
      ${refund}
      <div class="card-cta">
        <a class="btn btn-outline btn-sm" href="${escapeHtml(p.applyUrl || 'https://open.kakao.com/o/gp18A1Nf')}" target="_blank" rel="noopener">오픈채팅에서 문의하기</a>
      </div>
    </article>
  `;
}

function renderPrograms(targetId, list, opts) {
  const el = document.getElementById(targetId);
  if (!el) return;
  if (!list.length) {
    el.innerHTML = `
      <div class="empty-note">
        <strong>지금은 모집 중인 모임이 없어요</strong>
        <p>오픈채팅에 들어오시면 다음 모집 소식을 가장 먼저 받아보실 수 있어요.</p>
      </div>`;
    return;
  }
  el.innerHTML = list.map((p) => programCard(p, opts)).join('');
}

function renderReviews(targetId, list) {
  const el = document.getElementById(targetId);
  if (!el || !list.length) return;
  el.innerHTML = list.map((r) => `
    <div class="review-card">
      <p class="quote">${escapeHtml(r.quote)}</p>
      <p class="who">${escapeHtml(r.name)} · <span class="program-tag">${escapeHtml(r.program)}</span></p>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  if (typeof PROGRAMS !== 'undefined') {
    const openList = PROGRAMS.filter((p) => p.status === '모집중');
    renderPrograms('homeProgramList', openList, { full: false });

    const allListEl = document.getElementById('allProgramList');
    if (allListEl) {
      const tabs = document.querySelectorAll('.filter-tab');
      const applyFilter = (status) => {
        const list = status === '전체' ? PROGRAMS : PROGRAMS.filter((p) => p.status === status);
        renderPrograms('allProgramList', list, { full: true });
      };
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => t.setAttribute('aria-pressed', 'false'));
          tab.setAttribute('aria-pressed', 'true');
          applyFilter(tab.dataset.status);
        });
      });
      applyFilter('전체');
    }
  }

  if (typeof REVIEWS !== 'undefined') {
    renderReviews('homeReviewList', REVIEWS.slice(0, 3));
    renderReviews('aboutReviewList', REVIEWS);
  }
});
