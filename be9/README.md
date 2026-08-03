# be9 — benine9 studio 홈페이지 제안 시안

benine9 studio(학교 졸업앨범 전문 스튜디오)에 피칭할 홈페이지 리뉴얼 시안입니다.
실제 서비스가 아니며, 계약 전 제안용입니다. 상세 배경은 [PRD.md](./PRD.md) 참고.

## 구조

```
be9/
├── index.html      홈
├── album.html      졸업앨범 (사양·구성)
├── process.html    제작 과정 (연간 일정·검수·초상권)
├── works.html      납품 실적 · 포트폴리오   ← 가장 중요한 페이지
├── guide.html       학생·학부모 안내
├── contact.html     문의 · 견적
├── styles.css        6페이지 공용 스타일 (빌드 없음, 순수 CSS)
└── images/            임시 이미지 (Unsplash, 실제 촬영물로 교체 필요)
```

`benine9-proposal.html`은 구버전(단일 페이지) 자리에 남긴 리다이렉트 스텁입니다.
이미 `nolwoo.github.io/be9/benine9-proposal.html`로 한 번 공개된 주소라 죽은 링크를 막기 위해 남겨뒀습니다.

## 로컬에서 보기

```bash
cd be9
python3 -m http.server 8931
# http://localhost:8931/index.html
```

## 대표님 확인 필요 항목

전 페이지 푸터의 고지문에 "가정해 작성" 명시됨. 확인되면 해당 문구·placeholder를 실제 값으로 교체하고 고지에서 뺄 것.

| # | 항목 | 위치 |
|---|---|---|
| 1 | **납품 실적** — 학교 수, 연차, 학교명 공개 범위 | works.html 전체 |
| 2 | **나라장터 종합쇼핑몰 등록 여부** — 미확인(공식 사이트에도 언급 없음). 확인 경로: shop.g2b.go.kr 업체명 검색 | index.html 통계, process.html FAQ |
| 3 | 앨범 사양 — 판형·페이지 수·제본·용지 | album.html 사양표 |
| 4 | 재인쇄 부담 기준 | process.html FAQ |
| 5 | 원본 데이터 보관 기간 | process.html, guide.html |
| 6 | 동의서 양식 제공 여부·미동의 학생 처리 방식 | process.html 초상권 섹션 |
| 7 | 주력 학교급(초/중/고), 활동 지역 범위 | 전체 카피 톤 |
| 8 | 상호·대표자·사업자등록번호·주소 | 전 페이지 푸터 |
| 9 | 실제 촬영물·앨범 실물 사진 (**초상권 동의 확인 후**) | works.html 갤러리, album.html 등 |

## 수정 방법

- 6페이지가 `styles.css` 하나를 공유합니다. 색상·버튼·카드 등 공통 요소는 `styles.css`만 고치면 전 페이지에 반영됩니다.
- 페이지 고유 문구는 각 `.html` 파일 안에서 직접 수정합니다.
- 네비게이션(`nav.primary`, `footer .foot-nav`)은 6개 파일 모두에 동일하게 들어 있습니다. 메뉴 구조를 바꾸면 **6곳 전부** 고쳐야 합니다.
- 이미지 교체 시 `images/` 폴더의 같은 파일명에 덮어쓰면 모든 페이지에 자동 반영됩니다(파일명 유지 시).

## 배포

계약 확정 전까지는 `nolwoo.github.io/be9/`에 그대로 둡니다(무료 GitHub Pages, 검색 노출 없음).
계약이 확정되면 도메인을 붙여야 하므로 **Cloudflare Pages**로 옮기는 것을 권장합니다(무료, 상업적 이용 명시적 허용).
Vercel Hobby는 상업적 이용이 약관상 금지되어 있어 권장하지 않습니다.
