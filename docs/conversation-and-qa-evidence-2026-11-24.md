# دفتر شواهد گفتگوها و تست‌های تأییدشده AMDB

**تاریخ به‌روزرسانی:** 2026-11-24  
**پروژه:** بانک اطلاعاتی فیلم افغانستان (AMDB)  
**مخزن کد:** https://github.com/armanaria111/amdb-laravel2  
**مخزن گزارش:** https://github.com/armanaria111/amdb-report

این سند خلاصه شواهد فنی و تصمیم‌های ثبت‌شده در گفتگوهای توسعه است؛ transcript کامل گفتگوها نیست. نتیجه‌ها با تاریخ، محیط و محدوده‌شان ثبت شده‌اند تا تست محلی، CI، بررسی ایستا و تأیید بصری با یکدیگر اشتباه نشوند.

## 1. نتایج جدید و قطعی — 2026-11-24

### 1.1 اجرای کامل PHPUnit محلی

| شاخص | نتیجه |
|---|---:|
| محیط | `APP_ENV=testing` |
| دیتابیس تست | SQLite حافظه‌ای، `:memory:` |
| تست موفق | 282 |
| شکست | 0 |
| Assertion | 1,120 |
| زمان | 40.67 ثانیه |
| MySQL محلی | دست‌نخورده |

**قید گزارش:** خروجی اجرای تست، commit دقیق checkout را مشخص نکرده است؛ بنابراین این نتیجه به commit فعلی `main` یا CI نسبت داده نمی‌شود.

### 1.2 سازگاری Spatie Activitylog v5

- نسخه قفل‌شده و بررسی‌شده: `spatie/laravel-activitylog 5.1.5`.
- کلاس صحیح: `Spatie\\Activitylog\\Support\\LogOptions`.
- API مورد استفاده: `dontLogEmptyChanges()`؛ متد قدیمی `dontSubmitEmptyLogs()` متعلق به API قبلی است.
- پنج مدل `Artist`، `Company`، `Festival`، `News` و `Title` در runtime تنظیمات Activitylog را با کلاس جدید بارگذاری کردند.
- جدول `activity_log` در MySQL موجود بود و هر دو migration زیر وضعیت `Ran` داشتند:
  - `2026_11_20_235900_create_activity_log_table`
  - `2026_11_20_235901_add_activitylog_v5_columns`
- اتصال پیش‌فرض دیتابیس و اتصال Activitylog هر دو `mysql` بودند.
- ستون `attribute_changes` جزئیات old/new را نگهداری کرد؛ خالی بودن `properties` در رکورد بررسی‌شده به معنی فقدان تغییرات نبود.

### 1.3 نتیجه تراکنشی پنج مدل

| مدل | created | updated | جزئیات تغییر | پاک‌سازی با rollback |
|---|---|---|---|---|
| News | موفق | موفق | موفق | موفق |
| Artist | موفق | موفق | موفق | موفق |
| Company | موفق | موفق | موفق | موفق |
| Festival | موفق | موفق | موفق | موفق |
| Title | موفق | موفق | موفق | موفق |

- News ابتدا به‌صورت مستقل آزمایش شد؛ یک رکورد واقعی خبر و Activitylog آن حفظ شد و رکورد آزمایشی جداگانه پس از rollback باقی نماند.
- چهار مدل Artist، Company، Festival و Title در یک اجرای نهایی مستقل، همگی `PASS` شدند.
- در رویدادهای ویرایش، مقادیر قبلی و جدید در `attribute_changes` ثبت شدند.
- برای داده‌های آزمایشی هیچ فایل رسانه‌ای یا رکورد دائمی ایجاد نشد.
- نتیجه این بخش: **۵ مدل موفق، صفر شکست**.
- این نتیجه runtime محلی است؛ تست مرورگر، staging یا production را اثبات نمی‌کند.

### 1.4 بررسی ساختار دیتابیس

در همان گفتگو، ستون‌های واقعی این چهار جدول با `Schema::getColumnListing` خوانده شدند:

- `artists`: شامل `public_id`، `wordpress_id` و `birth_date_source`.
- `companies`: شامل `public_id` و ستون‌های کاتالوگ شرکت.
- `festivals`: شامل ستون‌های کاتالوگ جشنواره.
- `titles`: شامل `public_id`، `wordpress_id` و `content_type_id`.

Migrationهای اولیه کاتالوگ، هنرمند، شرکت و جشنواره نیز از نظر فیلدهای لازم برای ایجاد رکورد آزمایشی بررسی شدند. در این مرحله **هیچ Migration اجرا نشد** و هیچ reset یا حذف داده انجام نشد.

## 2. تست‌های محلی تاریخی ثبت‌شده در گفتگوها

### 2.1 اجرای PHPUnit در 2026-11-22

- یک اجرای محلی کامل با **257 تست، 990 assertion، صفر شکست و 28.61 ثانیه** در گفتگو تأیید شده است.
- تست متمرکز `TitleCreditImportTemplateTest`: یک تست و دو assertion موفق.
- در گزارش تاریخی دیگری از همان بازه، اجرای **256 تست و 990 assertion** نیز ثبت شده است؛ این اجراها جدا نگهداری می‌شوند و با هم جمع نمی‌شوند.
- هشدار deprecation مربوط به فراخوانی `fputcsv()` بدون آرگومان صریح `$escape` گزارش شده بود؛ تست مربوطه موفق بود.

### 2.2 Migration و Seeder محلی — 2026-11-22

- کاربر اجرای 43 Migration باقی‌مانده روی MySQL محلی را موفق گزارش کرد.
- پس از اجرا، در `migrate:status` مورد Pending مشاهده نشد.
- `ProfessionGroupSeeder` با موفقیت اجرا شد.
- وجود جدول‌های `profession_groups`، `companies` و `title_ratings` با `Schema::hasTable` تأیید شد.
- شمار کل جدول‌های دیتابیس در آن بررسی اندازه‌گیری نشد.

### 2.3 صفحات و زبان‌ها — 2026-11-22

- صفحات `/`، `/artists`، `/news` و `/festivals` پاسخ HTTP 200 دادند.
- مسیرهای تغییر زبان `en`، `fa-AF` و `ps` هر سه HTTP 200 دادند.
- فایل‌های CSS و JavaScript buildشده HTTP 200 دادند.
- کاربر پس از refresh مرورگر رفع مشکل ظاهری هدر و فوتر را تأیید کرد.
- این بررسی‌ها smoke test محدود هستند، نه آزمون کامل تعاملی همه صفحات.

### 2.4 API و جست‌وجو — 2026-11-22

- API هنرمندان: شش سناریوی صفحه‌بندی و شناسه با status مورد انتظار موفق شدند.
- API هنرمندان: پنج سناریوی locale و جست‌وجوی URL-encoded موفق شدند؛ جست‌وجوی فارسی دارای نتیجه و بدون نتیجه هر دو پاسخ مورد انتظار داشتند.
- API آثار: هفت سناریوی شناسه/صفحه‌بندی و جزئیات در سه locale طبق گزارش قبلی موفق بودند.
- API کاتالوگ شرکت‌ها، آثار و جشنواره‌ها: پنج درخواست HTTP 200 با JSON معتبر و ساختار `data/meta` داشتند.
- این موارد smoke/contract checks محدود هستند و پوشش کامل امنیت، مجوزها و تمام edge caseها را ثابت نمی‌کنند.

### 2.5 CI تاریخی

- CI روی main در run شماره `45049622525`: تست SQLite با 261 تست و 1,020 assertion و تست MySQL 8.4 با 261 تست و 1,020 assertion موفق شد؛ Vite build و Blade compile/lint نیز موفق بودند.
- CI قدیمی‌تر PR90: 97 تست و 396 assertion موفق بود.
- نتایج CI روی runnerهای موقت GitHub اجرا شده‌اند و جایگزین دیتابیس MySQL محلی یا پذیرش مرورگر کاربر نیستند.

### 2.6 PDF و Chromium

- کاربر تأیید کرد Chrome headless یک PDF آزمایشی تولید کرده و متن انگلیسی، دری و پشتو به‌درستی نمایش داده شده است.
- این تأیید فقط preview/خروجی آزمایشی Chrome را پوشش می‌دهد؛ تست Laravel/CI مربوط به پیاده‌سازی PDF و نصب Chromium روی هاست تولید در آن زمان تأیید نشده بود.
- DomPDF نسخه 3.1.2 در وابستگی‌ها موجود بود؛ وجود پکیج به‌تنهایی به معنی پیاده‌سازی یا پذیرش PDF چندزبانه نیست.

## 3. موارد گزارش‌شده در گفتگو که هنوز تأیید رفع ندارند

در 2026-11-24 کاربر مشکلات ظاهری/نمایشی را در موارد زیر گزارش کرد:

- صفحه ورود؛
- مدیریت اخبار؛
- مدیریت فیلم‌ها و سریال‌ها؛
- چند صفحه دیگر پنل مدیریت.

در نتیجه، اصلاحات ظاهری پنل مدیریت و صفحه ورود باید در وضعیت **نیازمند بررسی/QA تعاملی** باقی بمانند. وجود commit جدید در شاخه main با پیام «Apply consistent styling across all admin pages» به‌تنهایی رفع مشکل در checkout محلی یا تأیید مرورگر را ثابت نمی‌کند.

## 4. وضعیت شاخه‌ها و مرز گزارش

- آخرین commit مشاهده‌شده شاخه `main` مخزن کد در GitHub در زمان ثبت این سند: `2a06f9d9a200c95bf6c206c53d52ef3d56c05968`.
- ممیزی تفصیلی موجود در snapshot گزارش تا commit `e133e1d1244f2560fb9aedb8a53a56cc118c6cd4` انجام شده است؛ commit جدیدتر هنوز در این snapshot ممیزی کامل نشده است.
- این سند و به‌روزرسانی‌های همراه فقط در مخزن `amdb-report` انجام می‌شوند. هیچ کد Laravel، Migration یا داده دیتابیس از مخزن گزارش تغییر نمی‌کند.

## 5. مواردی که نباید به‌عنوان تست موفق نمایش داده شوند

- تست تعاملی کامل مرورگر برای همه پنل‌ها و فرم‌ها؛
- رفع قطعی مشکلات صفحه ورود و همه صفحات مدیریت؛
- پذیرش staging/production؛
- نصب و اجرای Chromium روی هاست تولید؛
- اجرای Migrationهای Pending پس از وضعیت ثبت‌شده قبلی؛
- نسبت دادن PHPUnit محلی 282/1120 به commit مشخص، چون SHA آن checkout در خروجی ثبت نشده است.

**مرجع وضعیت ساختاریافته:** [project-status.json](../project-status.json)  
**تاریخچه تغییرات گزارش:** [CHANGELOG.md](../CHANGELOG.md)


## 6. MySQL محلی — اجرای Migrationهای مالی/تبلیغاتی و حقوق پخش (2026-11-24)

**محیط گزارش‌شده:** Windows + Laragon، اتصال Laravel با درایور `mysql` به دیتابیس `amdbl`.

### 6.1 اجرای Migrationها

پنج Migration زیر روی دیتابیس محلی اجرا شدند و هر پنج مورد در خروجی Artisan با `DONE` و سپس در `migrate:status` با Batch شماره 17 و وضعیت `Ran` تأیید شدند:

1. `2026_11_22_160000_add_company_to_advertising_campaigns_table`
2. `2026_11_22_190000_add_unique_payout_reference_to_settlements`
3. `2026_11_22_200000_create_platform_revenue_entries_table`
4. `2026_11_23_010000_add_campaign_to_platform_revenue_entries_table`
5. `2026_11_24_120000_add_company_title_right_to_playback_sources`

### 6.2 بررسی ساختار پس از Migration

اسکریپت PHP موقت و فقط‌خواندنی، موارد زیر را تأیید کرد:

- `advertising_campaigns.company_id`: موجود.
- `revenue_settlement_requests.payout_reference`: موجود.
- جدول `platform_revenue_entries` و ستون‌های `id`, `source`, `currency`, `amount`, `campaign_id`, `recorded_by`, `reviewed_by`: موجود.
- `playback_sources.company_title_right_id`: موجود.
- ایندکس یکتای `revenue_settlement_payout_reference_unique`: موجود و unique.
- اتصال فعال: `mysql`; نام دیتابیس: `amdbl`.
- نتیجه اسکریپت: `ALL CHECKS PASSED`.

یک تلاش اولیه برای اجرای بررسی با `php -r` به‌دلیل quoting در PowerShell Parse error داد؛ این خطا مربوط به دستور بررسی بود، نه Migration. بررسی مجدد با فایل PHP موقت بدون BOM با موفقیت انجام شد.

### 6.3 ممیزی کلیدهای خارجی و رکوردهای یتیم

پنج رابطه زیر در `information_schema.KEY_COLUMN_USAGE` وجود کلید خارجی داشتند و شمار رکوردهای یتیم هر رابطه صفر بود:

| رابطه | Foreign key | Orphan records |
|---|---|---:|
| advertising_campaigns.company_id → companies.id | موجود | 0 |
| platform_revenue_entries.campaign_id → advertising_campaigns.id | موجود | 0 |
| platform_revenue_entries.recorded_by → users.id | موجود | 0 |
| platform_revenue_entries.reviewed_by → users.id | موجود | 0 |
| playback_sources.company_title_right_id → company_title_rights.id | موجود | 0 |

**نتیجه:** `ALL RELATION CHECKS PASSED`.

### 6.4 محدوده و محدودیت شواهد

- این نتایج runtime واقعی دیتابیس MySQL محلی کاربر هستند، نه صرفاً بررسی ایستای سورس.
- هیچ رکوردی برای آزمایش ایجاد، ویرایش یا حذف نشد؛ هیچ جدول/داده‌ای reset یا پاک نشد.
- این بررسی، صحت وجود schema و FKها و نبود orphan در پنج رابطه مشخص را ثابت می‌کند؛ صحت کامل منطق مالی، هم‌زمانی تراکنش‌ها، مجوزهای دسترسی، رابط کاربری و جریان انتهابه‌انتها را ثابت نمی‌کند.
- خطای Parse اولیه دستور `php -r` نباید به‌عنوان شکست Migration یا خرابی دیتابیس ثبت شود.


## 7. بررسی ایستای چرخه عمر کمپین و سابقه درآمد — یافته باز (2026-11-24)

در بازبینی سورس `main` این مسیرها بررسی شدند:

- `AdvertisingCampaignController::update()` اجازه تغییر `provider` را بدون بررسی وجود درآمدهای متصل می‌دهد.
- `AdvertisingCampaignController::destroy()` کمپین را حذف می‌کند و پیش از حذف، وجود ردیف‌های `platform_revenue_entries` وابسته را بررسی نمی‌کند.
- Migration مربوط به `platform_revenue_entries.campaign_id` از `nullOnDelete()` استفاده می‌کند؛ بنابراین حذف کمپین، اتصال کمپین به ردیف‌های درآمدی تاریخی را null می‌کند.
- Migration مربوط به `advertising_events.campaign_id` از `cascadeOnDelete()` استفاده می‌کند؛ بنابراین حذف کمپین، رویدادهای آماری آن را نیز حذف می‌کند.
- گزارش عملکرد کمپین و خروجی CSV، درآمد مستقیم AFN را از طریق `campaign_id` به کمپین نسبت می‌دهند.

**ریسک:** حذف کمپین یا تغییر provider آن پس از ثبت درآمد می‌تواند زنجیره انتساب و قابلیت حسابرسی درآمد تاریخی را تضعیف کند؛ حذف همچنین آمار رویدادهای تبلیغاتی را پاک می‌کند.

**وضعیت:** `open_static_review_finding` — این مورد از روی سورس شناسایی شده و هنوز با تست runtime یا مرورگر بازتولید نشده است. هیچ کدی در این مرحله تغییر نکرده است.

**اقدام پیشنهادی:** قبل از حذف کمپین، وجود درآمد وابسته و رویدادهای وابسته بررسی شود؛ کمپین دارای سابقه مالی/آماری باید به‌جای حذف فیزیکی، غیرفعال/آرشیو شود. پس از ثبت درآمد مستقیم، تغییر provider از `direct` به provider دیگر باید ممنوع یا به گردش‌کار مهاجرت حسابرسی‌شده تبدیل شود. تست‌های Feature برای جلوگیری از حذف و تغییر provider پس از ثبت درآمد و حفظ تاریخچه رویدادها اضافه شوند.


## 8. اعتبارسنجی PDF چندزبانه گزارش تبلیغات — PR132 (2026-11-24)

### 8.1 تست‌های شاخه و CI

- در worktree مستقل `C:\\laragon\\www\\amdb\\amdb-pdf-validation`، پس از `npm run build`، اجرای کامل PHPUnit موفق شد: **282 passed (1120 assertions)**؛ مدت گزارش‌شده 38.38 ثانیه.
- GitHub Actions run [45428873147](https://github.com/armanaria111/amdb-laravel2/actions/runs/45428873147)، اجرای AMDB CI شماره 429، با نتیجه `success` تکمیل شد.
- Jobهای موفق: Vite production build؛ Laravel tests روی PHP 8.5 / SQLite؛ Laravel tests روی PHP 8.5 / MySQL 8.4. مراحل Composer validation، compile و lint تمام Bladeها و PHPUnit نیز موفق بودند.
- route list در worktree، مسیر `GET|HEAD admin/advertising/pdf` با نام `admin.advertising.pdf` و کنترلر `Admin\\AdvertisingReportPdfController` را نشان داد.

### 8.2 Smoke test مستقیم سرویس Chromium

- `PDF_CHROME_PATH` روی Chrome نصب‌شده در ویندوز تنظیم شد.
- `App\\Services\\Pdf\\ChromiumPdfRenderer::render()` با HTML آزمایشی فراخوانی شد.
- نتیجه: `PDF_SIZE: 35714` و `PDF_SIGNATURE: %PDF-`؛ فایل واقعی PDF در مسیر خصوصی موقت `storage/app/private/pdf-temp` ساخته شد.
- این نتیجه رندر واقعی سرویس Laravel را تأیید می‌کند، نه صرفاً اجرای مستقل Chrome.

### 8.3 محدوده و محدودیت شواهد

- تست کامل محلی و CI موفق‌اند؛ تست ساختار دیتابیس `amdbl` در checkout اصلی نیز پیش‌تر با `ALL CHECKS PASSED` تأیید شده بود.
- این smoke test محتوای بصری PDF نهایی را با مشاهده انسانی تأیید نکرد؛ رشته‌های فارسی/پشتو در ورودی ترمینال PowerShell به‌صورت `?` دیده شدند، بنابراین کیفیت glyph/RTL در خروجی این اجرای خاص را نباید تأییدشده اعلام کرد.
- دانلود HTTP از مسیر محافظت‌شده پنل مدیریت، مجوز دسترسی/فیلترهای گزارش در مرورگر و وجود Chrome/Chromium روی هاست تولید هنوز تست نشده‌اند.
- PR132 همچنان شاخه‌ای و ادغام‌نشده است؛ هیچ تغییری در دیتابیس اصلی یا reset مخرب انجام نشد.
