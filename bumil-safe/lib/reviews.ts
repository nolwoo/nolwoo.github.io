export type Review = {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
};

const POOL: Review[] = [
  {
    id: "r01",
    author: "김*영",
    date: "2025.12.03",
    rating: 5,
    text: "설치 기사님이 정말 친절하게 해주셨어요. 무거운 금고인데 안전하게 설치하고 사용법도 꼼꼼히 설명해 주셨습니다. 튼튼하고 만족해요.",
  },
  {
    id: "r02",
    author: "박*준",
    date: "2026.01.15",
    rating: 5,
    text: "디자인이 생각보다 훨씬 예쁘네요. 인테리어를 해치지 않아서 좋고, 잠금장치도 확실해서 믿음이 갑니다.",
  },
  {
    id: "r03",
    author: "이*희",
    date: "2025.10.22",
    rating: 5,
    text: "중요한 서류 보관용으로 구매했는데 딱 좋아요. 크기도 적당하고 비밀번호 설정도 어렵지 않았어요. 상담도 친절하게 해주셨습니다.",
  },
  {
    id: "r04",
    author: "최*수",
    date: "2026.02.08",
    rating: 5,
    text: "가격이 조금 있지만 그만큼 튼튼하고 마감도 깔끔해요. 전문 기사가 직접 설치해 주니 믿음직스럽습니다. 적극 추천해요.",
  },
  {
    id: "r05",
    author: "정*아",
    date: "2025.11.30",
    rating: 5,
    text: "지문인식 속도가 정말 빠릅니다. 새벽에 급하게 꺼낼 때도 불편함 없어요. 가족 3명 지문 다 등록했는데 한 번도 오작동 없었어요.",
  },
  {
    id: "r06",
    author: "한*민",
    date: "2026.03.12",
    rating: 5,
    text: "사무실에 두고 쓰는데 딱 좋아요. 비밀번호와 이중 잠금이라 더 안심되고요. 사용법이 직관적이어서 편하게 쓰고 있습니다.",
  },
  {
    id: "r07",
    author: "윤*리",
    date: "2025.09.05",
    rating: 4,
    text: "전반적으로 만족스럽습니다. 생각보다 묵직해서 혼자 이동은 어렵지만, 그만큼 튼튼한 것 같아요. 설치 서비스 이용하길 잘 했어요.",
  },
  {
    id: "r08",
    author: "강*진",
    date: "2026.01.28",
    rating: 4,
    text: "품질은 좋은데 처음 배달이 조금 늦었어요. 설치 기사님이 친절하게 해주셔서 기다린 보람이 있었습니다.",
  },
  {
    id: "r09",
    author: "임*호",
    date: "2025.12.19",
    rating: 5,
    text: "현금과 귀중품 보관용으로 샀어요. 무게감이 있어서 든든하고, 인테리어에도 잘 어울려요. 오래 쓸 것 같아 만족합니다.",
  },
  {
    id: "r10",
    author: "신*현",
    date: "2026.02.24",
    rating: 4,
    text: "처음에 비밀번호 설정이 조금 헷갈렸는데 매뉴얼 보니까 금방 됐어요. 가격 대비 품질 좋고, 묵직해서 도둑이 옮기기도 어렵겠어요.",
  },
  {
    id: "r11",
    author: "오*진",
    date: "2025.08.17",
    rating: 5,
    text: "상담부터 설치까지 전부 친절하게 챙겨주셨어요. 집에 설치하고 나니 더 안심됩니다. 부모님께도 추천해 드렸어요.",
  },
  {
    id: "r12",
    author: "홍*영",
    date: "2026.03.05",
    rating: 3,
    text: "금고 자체는 괜찮은데, 배터리 교체 방법을 처음엔 몰랐어요. A/S 상담으로 빠르게 해결했고, 답변이 빨라서 좋았습니다.",
  },
];

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getReviews(productId: string, count = 6): Review[] {
  return [...POOL]
    .sort((a, b) => hashCode(a.id + productId) - hashCode(b.id + productId))
    .slice(0, count);
}

export type RatingDist = Record<1 | 2 | 3 | 4 | 5, number>;

export function ratingDist(rating: number, total: number): RatingDist {
  const r = Math.min(5, Math.max(1, rating));
  const fivePct = r >= 4 ? (r - 4) * 0.35 + 0.6 : Math.max(0.2, (r - 1) * 0.15);
  const rest = 1 - fivePct;
  return {
    5: Math.round(fivePct * total),
    4: Math.round(rest * 0.55 * total),
    3: Math.round(rest * 0.28 * total),
    2: Math.round(rest * 0.10 * total),
    1: Math.round(rest * 0.07 * total),
  };
}
