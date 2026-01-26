# Country House

> IMPORTANT: This project was updated after a security incident (CVE-2025-55182).
>
> Before deployment, read:
> - [Secure deployment guide](../tashi-ani/COUNTRY_HOUSE_SECURITY_DEPLOY.md)
> - [Security checklist](../tashi-ani/COUNTRY_HOUSE_CHECKLIST.md)
> - [Emergency fix for CVE-2025-55182](../tashi-ani/CVE-2025-55182_URGENT_FIX.md)

## Secure deployment

CRITICAL: Always use a .npmrc with ignore-scripts=true.

```bash
# Install dependencies without running scripts
npm install --ignore-scripts

# Manually run only the safe script
npx prisma generate

# Build
npm run build
```

## CVE-2025-55182 (React4Shell)

This project was updated to mitigate a critical vulnerability:
- React 19.0.1+ (19.0.0 was vulnerable)
- Next.js 16.0.7+
- .npmrc with ignore-scripts=true
- CPU monitoring
- Mining pool port checks

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
