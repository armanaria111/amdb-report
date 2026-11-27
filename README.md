# مرکز گزارش پروژه بانک اطلاعاتی فیلم افغانستان (AMDB)

**نام انگلیسی:** Afghanistan Movie Database  
**دامنه:** https://amdb.af  
**مخزن اصلی کد:** https://github.com/armanaria111/amdb-laravel2  
**مخزن گزارش:** https://github.com/armanaria111/amdb-report

## وضعیت جاری — ۲۷ نوامبر ۲۰۲۶

- [داشبورد زنده پروژه](https://armanaria111.github.io/amdb-report/)
- [مرجع وضعیت ساختاریافته](project-status.json)
- [روش‌شناسی گزارش](docs/reporting-methodology.md)
- [تاریخچه تغییرات گزارش](CHANGELOG.md)
- [دفتر شواهد گفتگوها و QA](docs/conversation-and-qa-evidence-2026-11-24.md)

آخرین commit تأییدشده مخزن برنامه روی شاخه `main`:

`404a2a12ca663fc67f50d261f1bb8d9b327270f7`

PRهای #166، #172 تا #175 و سپس PRهای Dependabot #177 تا #182 نیز در ۲۷ نوامبر ۲۰۲۶ ادغام شدند. اکنون هیچ PR بازی در مخزن اصلی وجود ندارد. آخرین commit شاخه main برابر `404a2a12ca663fc67f50d261f1bb8d9b327270f7` است. جزئیات ادغام‌ها در CHANGELOG و project-status.json ثبت شده‌اند.

## آخرین کارهای غیرعملیاتی انجام‌شده

- [PR #140 — تست مرزهای middleware کشور بیننده](https://github.com/armanaria111/amdb-laravel2/pull/140) ادغام شد؛ 306 تست و 1193 assertion روی SQLite و MySQL 8.4 موفق.
- [PR #141 — سند حاکمیت کیفیت داده و provenance](https://github.com/armanaria111/amdb-laravel2/pull/141) ادغام شد و به README مخزن اصلی پیوند خورد.
- [PR #142 — قفل تراکنشی پیشنهادهای اصلاح عنوان](https://github.com/armanaria111/amdb-laravel2/pull/142) ادغام شد؛ CI با 306 تست و 1193 assertion روی SQLite و MySQL 8.4 موفق است. آزمون هم‌زمانی مستقل MySQL به‌عنوان hardening بیشتر توصیه می‌شود.
- [PR #143 — انتقال CSS صفحات عمومی به فایل اصلی](https://github.com/armanaria111/amdb-laravel2/pull/143) ادغام شد؛ CI با 306 تست و 1193 assertion روی SQLite و MySQL 8.4 موفق است.

## شواهد CI و وضعیت امنیت وابستگی‌ها

آخرین CI سرشاخه‌های PRهای ادغام‌شده:

- PR #175: SQLite **308 passed / 1208 assertions** و MySQL 8.4 **308 passed / 1208 assertions**؛ Vite production build موفق.
- PR #173: MySQL 8.4 **312 passed / 1213 assertions**؛ Vite موفق.
- PR #174: MySQL 8.4 **311 passed / 1219 assertions**؛ Migrationها، Blade و Vite موفق.
- Composer Audit همچنان به‌دلیل پنج advisory در `symfony/http-kernel`، `symfony/mailer` و `symfony/routing` شکست می‌خورد. PR #175 اجرای تست SQLite را قبل از Audit قرار داد؛ هشدارهای امنیتی را رفع نکرد.
- Dependabot در PR #166 فعال شده تا به‌روزرسانی‌های وابستگی را پیشنهاد کند؛ این تنظیم به‌تنهایی lockfile را اصلاح نمی‌کند.

CI پس از آخرین ادغام روی commit نهایی `main` هنوز در این snapshot تأیید نشده است. نتایج CI سرشاخه PRها جایگزین QA مرورگر، QA موبایل، پذیرش محلی Laragon یا smoke test محیط عملیاتی نیستند.

## موارد باقی‌مانده برای پذیرش نهایی

1. **QA مرورگر و موبایل:** بررسی واقعی ورود، صفحات عمومی اخبار، فهرست/جزئیات خبر، مدیریت اخبار، فهرست و فرم‌های آثار، هنرمندان، کاربران، شرکت‌ها، نقش‌ها، درخواست‌های حرفه‌ای و اشتراک‌ها در اندازه‌های موبایل/تبلت/دسکتاپ و هر سه زبان.
2. **پذیرش محلی:** همگام‌سازی امن نسخه محلی با `main`، نگهداری تغییرات محلی، بررسی `git status` و `migrate:status` و مقایسه schema بدون reset یا حذف داده.
3. **ممیزی دیتابیس:** بازبینی Migrationها و روابط روی commit جاری، بررسی یافته‌های تاریخی DB-010 تا DB-019 و آزمون MySQL concurrency؛ هیچ نتیجه تاریخی بدون بازبینی مجدد، وضعیت قطعی امروز محسوب نمی‌شود.
4. **پیکربندی عملیاتی:** بررسی SMTP فرم تماس، صف‌ها و scheduler، Activitylog، Sitemap، Chart.js، SEO، اعلان‌ها، backup و بازیابی، پایش و لاگ‌ها.
5. **پذیرش پخش:** تکمیل زنجیره امن رسانه خصوصی، trusted proxy/GeoIP، HLS، entitlement و پذیرش واقعی worker/storage/CDN؛ قابلیت‌های پخش میزبانی‌شده و پرداخت واقعی باید تا تکمیل همه کنترل‌ها خاموش بمانند.
6. **پرداخت مصرف‌کننده:** انتخاب رسمی provider، کشورها و ارزهای مجاز، adapter واقعی، sandbox، refund/chargeback، reconciliation و آزمون staging؛ زیرساخت provider-neutral به معنی فعال بودن پرداخت نیست.
7. **اعتمادپذیری داده (P0):** ثبت منبع و شواهد، تاریخچه تغییرات فیلدبه‌فیلد، پیشنهاد اصلاح توسط جامعه، تشخیص تکراری با ادغام تحت تأیید مدیر و امتیاز کیفیت رکورد.
8. **داده WordPress:** دریافت export واقعی و مستندات جداول/فیلدها و روابط عوامل؛ هیچ تطبیق حدسی بر اساس نام یا عنوان نباید انجام شود.

## قواعد ایمنی و اعتماد به گزارش

- این مخزن فقط برای مستندسازی، داشبورد و پیگیری است؛ کد برنامه در مخزن اصلی نگهداری می‌شود.
- وضعیت «پیاده‌سازی‌شده در سورس»، «تست نوشته‌شده»، «تست اجراشده»، «Migration اجراشده»، «QA مرورگر» و «تأیید Production» مستقل‌اند.
- در گزارش فعلی، اجرای ۴۳ Migration در MySQL محلی در ۲۲ نوامبر توسط کاربر گزارش شده و پس از آن Pending صفر گزارش شده بود؛ این گزارش، وضعیت امروز دیتابیس محلی یا عملیاتی را مستقلاً تأیید نمی‌کند.
- بررسی مستقیم `Schema::hasTable` فقط برای چند جدول مشخص گزارش شده است؛ از آن نباید تعداد کل جداول را نتیجه گرفت.
- هیچ‌گاه از `migrate:fresh`، `db:wipe` یا حذف/بازسازی مخرب داده‌ها استفاده نشود.
- درصد پیشرفت کلی نمایش داده نمی‌شود؛ وضعیت هر قابلیت و مرحله QA جداگانه ثبت می‌شود.
- هنرمندان و عوامل فیلم درآمد، سهم یا حق نشر ندارند؛ درآمد و حقوق آثار فقط برای شرکت دارای مالکیت/مجوز معتبر و نمایندگان مجاز آن است.
- درآمد تبلیغات چهار ارز را مستقل نگه می‌دارد: USD و EUR برای Google AdSense، IRR برای تبلیغات ایران و AFN برای تبلیغات اختصاصی.

## نقشه راه محصول

پیشنهادهای توسعه در `product_recommendations` داخل `project-status.json` ثبت شده‌اند. اولویت نخست، اعتماد و کیفیت داده است؛ سپس تکمیل کاتالوگ سینمایی، جستجوی چندزبانه، تجربه جامعه، ابزارهای هنرمندان، تحریریه، درآمدزایی و عملیات زیرساختی دنبال می‌شوند. موارد نقشه راه تا زمان پیاده‌سازی و QA مستقل، قابلیت تکمیل‌شده محسوب نمی‌شوند.

## ساختار فایل‌ها

- `index.html`: داشبورد
- `project-status.json`: وضعیت قابلیت‌ها، QA، پنل‌ها و تاریخچه
- `assets/script.js`: منطق داشبورد
- `assets/style.css`: استایل داشبورد
- `docs/reporting-methodology.md`: روش‌شناسی و محدودیت‌های گزارش
- `CHANGELOG.md`: تاریخچه تغییرات


## به‌روزرسانی وابستگی‌ها — ۲۷ نوامبر ۲۰۲۶

شش PR خودکار Dependabot نیز بررسی و ادغام شدند:

- [#177](https://github.com/armanaria111/amdb-laravel2/pull/177) — actions/setup-node v7
- [#178](https://github.com/armanaria111/amdb-laravel2/pull/178) — actions/cache v6
- [#179](https://github.com/armanaria111/amdb-laravel2/pull/179) — actions/download-artifact v8
- [#180](https://github.com/armanaria111/amdb-laravel2/pull/180) — PHPUnit 13.4.8
- [#181](https://github.com/armanaria111/amdb-laravel2/pull/181) — actions/upload-artifact v7
- [#182](https://github.com/armanaria111/amdb-laravel2/pull/182) — actions/checkout v7

در هر شش CI سرشاخه، PHPUnit روی SQLite و MySQL 8.4 و Vite build موفق بودند؛ مرحله Composer Audit در SQLite به‌دلیل پنج advisory امنیتی همچنان شکست نهایی داشت. CI پس از آخرین ادغام روی main هنوز تأیید نشده است. تعداد PRهای باز پس از ادغام: صفر.
