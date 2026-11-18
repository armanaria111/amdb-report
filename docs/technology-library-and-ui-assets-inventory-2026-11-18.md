# موجودی جامع فناوری، کتابخانه‌ها و دارایی‌های رابط کاربری AMDB

**تاریخ بررسی:** 2026-11-18  
**مخزن سورس:** `armanaria111/amdb-laravel2`  
**شاخه:** `main`  
**Commit بررسی‌شده:** `8b939a4325a9017ffc06678032e5f23b80e9fc94`  
**نوع بررسی:** ایستا و فقط‌خواندنی؛ بدون نصب پکیج، build، تست، اجرای برنامه یا تغییر دیتابیس.

## دامنه و روش

فایل‌های `composer.json`، `composer.lock`، `package.json`، `package-lock.json`، `vite.config.js`، `resources/css/app.css`، `resources/js/app.js`، `resources/views/layouts/app.blade.php` و Git tree مخزن بررسی شدند. نسخه‌های درج‌شده در این سند از lockfileها هستند، نه حدس از محدوده نسخه‌های manifest.

## 1. کتابخانه‌ها و وابستگی‌های PHP

| کتابخانه | نسخه قفل‌شده | کاربرد |
|---|---:|---|
| Laravel Framework | v13.43.0 | هسته برنامه، Route، ORM، Migration و زیرساخت |
| Laravel Scout | v11.10.0 | لایه یکپارچه‌سازی جستجو؛ driver فعال جداگانه باید بررسی شود |
| Laravel Tinker | v3.0.2 | REPL و تعامل خط فرمان با برنامه |
| Livewire | v4.4.8 | ساخت کامپوننت‌های تعاملی با PHP |
| Spatie Activitylog | 5.1.5 | ثبت فعالیت‌ها و رویدادها |
| Spatie Media Library | 11.23.13 | مدیریت فایل و رسانه متصل به مدل‌ها |
| Spatie Sitemap | 8.2.0 | تولید نقشه سایت |
| Spatie Translatable | 6.15.0 | ویژگی‌ها و داده‌های ترجمه‌پذیر |

شرط‌های مهم manifest:
- PHP: `^8.3`
- Laravel: `^13.17`؛ نسخه دقیق lock برابر `v13.43.0` است.
- Livewire در `composer.json` با شرط `*` تعریف شده است؛ بهتر است در بازبینی وابستگی‌ها نسخه مجاز محدودتر شود.
- نسخه محلی PHP 8.5.12 و Laravel 13.39.0 قبلاً از سوی کاربر گزارش شده بود؛ این محیط در این ممیزی دوباره بررسی نشده است.

## 2. ابزارهای توسعه و تست PHP

| ابزار | نسخه قفل‌شده | کاربرد |
|---|---:|---|
| Laravel Debugbar | v4.4.5 | عیب‌یابی محیط توسعه |
| Faker | v1.24.1 | داده ساختگی |
| Laravel Pail | v1.2.7 | مشاهده لاگ‌ها |
| Laravel Pao | v1.1.5 | ابزار کمکی توسعه |
| Laravel Pint | v1.32.3 | قالب‌بندی کد PHP |
| Mockery | 1.6.15 | Mock در تست |
| Collision | v8.9.5 | نمایش خطاهای CLI و تست |
| PHPUnit | 12.5.42 | چارچوب تست PHP |

وجود این ابزارها در lockfile به معنی اجرای تست یا فعال بودن Debugbar در محیط production نیست.

## 3. کتابخانه‌ها و ابزارهای JavaScript/CSS

| کتابخانه | نسخه قفل‌شده | نوع | کاربرد |
|---|---:|---|---|
| Tailwind CSS | 4.3.3 | توسعه | چارچوب CSS |
| @tailwindcss/vite | 4.3.3 | توسعه | اتصال Tailwind به Vite |
| Vite | 8.3.5 | توسعه | سرور توسعه و build |
| laravel-vite-plugin | 3.2.0 | توسعه | اتصال Vite به Laravel و افزونه فونت |
| Chart.js | 4.6.1 | runtime dependency | نمودارهای JavaScript؛ استفاده اجرایی در این نوبت تأیید نشد |
| Concurrently | 10.0.6 | توسعه | اجرای هم‌زمان فرمان‌ها |
| @laravel/multiplex | 0.4.5 | اختیاری | وابستگی optional؛ استفاده فعال بررسی نشده |

ورودی‌های build:
- CSS: `resources/css/app.css`
- JavaScript: `resources/js/app.js`
- Tailwind از طریق `@import "tailwindcss";` وارد شده است.
- منابع اسکن Tailwind شامل `resources/views` و `resources/js` هستند.
- پیکربندی Vite افزونه `bunny` را از `laravel-vite-plugin/fonts` وارد می‌کند و فونت Instrument Sans با وزن‌های 400، 500 و 600 را تنظیم کرده است. استفاده نهایی این فونت در CSS صفحات تأیید نشد.

## 4. کتابخانه آیکون — Font Awesome

**Font Awesome Pro 7.3.1** در قالب اصلی سایت بارگذاری شده است.

- روش ارائه: فایل‌های محلی در `public/vendor/fontawesome/`
- تعداد فایل‌های CSS در Git tree: 88
- تعداد فایل‌های فونت WOFF2: 38
- این کتابخانه در `composer.json` یا `package.json` dependency ثبت‌شده نیست؛ فایل‌ها به‌صورت vendored داخل public قرار گرفته‌اند.
- فایل‌های stylesheet که Layout اصلی بارگذاری می‌کند:
  - `fontawesome.css`
  - `brands.css`
  - `solid.css`
  - `regular.css`
  - `light.css`
  - `thin.css`
  - `duotone.css`
- نمونه استفاده در Layout: `<i class="fa-solid fa-magnifying-glass"></i>`

**وضعیت مجوز:** هدر فایل CSS نسخه Pro عبارت Commercial License را اعلام می‌کند. سند خرید یا مجوز معتبر در مخزن بررسی‌شده وجود نداشت/تأیید نشد. قبل از انتشار عمومی AMDB باید مجوز استفاده و توزیع این نسخه Pro بررسی شود. این نکته یک ریسک مستندسازی/حقوقی است، نه اثبات نقض مجوز.

## 5. فونت‌های رابط کاربری و زبان‌ها

| زبان | کد | جهت | فونت تعریف‌شده | منبع |
|---|---|---|---|---|
| English | `en` | LTR | Inter | Google Fonts |
| دری | `fa-AF` | RTL | Vazirmatn | Google Fonts |
| پښتو | `ps` | RTL | Noto Sans Arabic | Google Fonts |

قواعد CSS در `resources/css/app.css`:
- `html[lang="en"] body` → Inter
- `html[lang="fa-AF"] body` → Vazirmatn
- `html[lang="ps"] body` → Noto Sans Arabic

Layout اصلی لینک Google Fonts و preconnectهای مربوط را دارد. فایل فونت UI به‌صورت محلی در Git tree دیده نشد؛ فایل‌های WOFF2 محلی مربوط به Font Awesome هستند. پوشش دقیق حروف پشتو، بارگذاری شبکه‌ای فونت‌ها و fallbackها باید در مرورگر بررسی شود. صرف تعریف font-family تضمین نمی‌کند همه نویسه‌ها درست نمایش داده شوند.

## 6. موجودی ساختار مخزن در commit بررسی‌شده

| مورد | تعداد |
|---|---:|
| ورودی‌های Git tree | 555 |
| فایل Migration | 29 |
| مدل Eloquent | 40 |
| فایل Blade | 50 |
| فایل ترجمه PHP در سه زبان | 63 |
| فراخوانی نام‌گذاری Route در `routes/web.php` | 103 |
| فایل CSS مربوط به Font Awesome | 88 |
| فایل WOFF2 مربوط به Font Awesome | 38 |

این اعداد موجودی فایل‌های سورس‌اند. تعداد جدول‌های دقیق schema در این نوبت دوباره استخراج نشده و وضعیت واقعی دیتابیس محلی یا Migrationهای اجراشده را اثبات نمی‌کنند.

## 7. مواردی که هنوز تأیید اجرایی نشده‌اند

1. اجرای `npm install` یا `npm ci` و موفقیت build با Vite.
2. تست مرورگری بارگذاری Font Awesome و تمام وزن‌های آیکون.
3. بررسی نمایش Inter، Vazirmatn و Noto Sans Arabic در سه زبان، مخصوصاً پوشش حروف پشتو.
4. تأیید استفاده واقعی Chart.js در صفحات داشبورد.
5. بررسی driver و اتصال اجرایی Laravel Scout.
6. تأیید سند مجوز Font Awesome Pro 7.3.1.
7. تطبیق نسخه‌های نصب‌شده روی سیستم محلی با lockfileهای GitHub.

## 8. ملاحظات و اقدامات بعدی

- نسخه و منبع Font Awesome در مستندات ثبت و مدرک مجوز خارج از مخزن نگهداری شود.
- فونت‌های هر سه زبان در مرورگر واقعی و روی متن نمونه دری/پشتو بررسی شوند.
- استفاده یا عدم استفاده Chart.js و Scout در کد و runtime مشخص شود.
- وضعیت دیتابیس محلی فقط پس از backup و با دستورهای read-only بررسی شود؛ هیچ `migrate:fresh` یا reset مخرب مجاز نیست.
- تست‌های جامع طبق تصمیم کاربر برای پایان کار نگه داشته شوند.

## 9. محدودیت این گزارش

این سند ممیزی ایستای manifestها، lockfileها، layout و دارایی‌های ثبت‌شده در Git است. این گزارش جایگزین تست runtime، تست مرورگر، ممیزی امنیتی کامل، بررسی دیتابیس زنده یا تأیید حقوقی مجوز فونت‌آوسام نیست.
