# 범일금고 영등포대리점 홈페이지

Next.js 앱. Vercel로 배포합니다. 환경변수는 `.env.example`을 참고하세요.

## 외부 이미지 주의

상품 이미지는 저장소에 없고 **외부 서버에서 직접 불러옵니다** (`lib/products.ts`).

- `bumilsafe.co.kr` (범일금고 본사 사이트)
- `shop-phinf.pstatic.net` (네이버 스마트스토어 이미지 서버)

본사나 스토어가 이미지 주소를 바꾸거나 지우면 이 사이트의 상품 사진이 깨집니다.
이미지 사용 허락 범위는 본사와 확인해 두세요.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
