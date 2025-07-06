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

# Nomremzade.az - Phone Number Trading Platform

Azərbaycan üçün nömrə alış-satış platforması

## 🚀 Xüsusiyyətlər

- **Avtomatik Qeydiyyat Yönləndirməsi**: Giriş etməmiş istifadəçilər avtomatik qeydiyyata yönləndirilir
- **Premium/Gold/Standart Elan Sistemi**: Müxtəlif elan paketləri
- **Secure Database**: Təhlükəsiz məlumat saxlanması
- **User Session Management**: İstifadəçi sessiya idarəetməsi
- **Responsive Design**: Mobil və desktop uyğunluq

## 📱 Elan Sistemləri

### Premium Elan (30 gün)
- Xüsusi vurğulanma
- Siyahının yuxarısında göstərilmə
- Daha çox görünmə

### Gold Elan (20 gün)
- Öncelikli göstərilmə
- Orta səviyyə vurğulanma

### Standart Elan (7 gün)
- Adi göstərilmə
- Qısa müddət

## 🔧 Texniki Məlumatlar

### Faylların Təşkili
```
/src/app/
  ├── register/           → Qeydiyyat səhifəsi
  ├── login/              → Giriş səhifəsi
  ├── numbers/            → Elanların göstərilməsi
  └── post-ad/
      ├── premium/        → Premium elan
      ├── gold/           → Gold elan
      └── standard/       → Standart elan

/src/components/
  ├── layout/             → Səhifə strukturu
  └── ui/                 → UI komponentləri

/src/lib/
  └── database.ts         → Məlumat bazası əməliyyatları
```

### Məlumat Saxlanması
- LocalStorage ilə encrypted məlumat saxlanması
- İstifadəçi məlumatları və elanlar təhlükəsizdir
- Secure Database sinifi ilə idarəetmə

### İstifadəçi Autentifikasiyası
- Qeydiyyat və giriş sistemi
- Session idarəetməsi
- Təhlükəsiz şifrə saxlanması

## 🛠️ Development

### Lokal olaraq işə salmaq:
```bash
# Dependencies yüklə
npm install

# Development server başlat
npm run dev

# Production build
npm run build

# Production server başlat
npm run start
```

### Environment Variables
`.env.local` faylı yaradın:
```bash
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database encryption key
DATABASE_ENCRYPTION_KEY=your_secret_key
```

## 📄 Səhifələr

- `/` - Ana səhifə
- `/register` - Qeydiyyat
- `/login` - Giriş
- `/numbers` - Elanlar siyahısı
- `/post-ad/premium` - Premium elan yerləşdir
- `/post-ad/gold` - Gold elan yerləşdir
- `/post-ad/standard` - Standart elan yerləşdir

## 🔐 Təhlükəsizlik

- Məlumatlar encrypted şəkildə saxlanılır
- İstifadəçi sessiyaları təhlükəsizdir
- Form validasiyası və sanitization
- XSS və CSRF qorunması

## 📞 Əlaqə

- Website: [nomremzade.az](https://nomremzade.az)
- Email: support@nomremzade.az

---

Made with ❤️ for Azerbaijan 🇦🇿
