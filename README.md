<div dir="rtl">

# israel-companies · חיפוש חברות ברשם החברות

[![npm](https://img.shields.io/npm/v/israel-companies?color=2447D6)](https://www.npmjs.com/package/israel-companies)
[![tests](https://github.com/aiterra-il/israel-companies/actions/workflows/tests.yml/badge.svg)](https://github.com/aiterra-il/israel-companies/actions/workflows/tests.yml)
[![license](https://img.shields.io/badge/license-MIT-3E96F9)](LICENSE)
![dependencies](https://img.shields.io/badge/dependencies-0-060B22)

הספרייה מחפשת חברה ישראלית לפי מספר ח.פ. או לפי שם, ישר מהמאגר הפתוח של **רשם החברות** ב-data.gov.il. אין צורך במפתח API, בהרשמה או בתשלום.

היא בודקת את ספרת הביקורת לפני שהיא פונה למאגר, ומסבירה בעברית מה אומר כל סטטוס: פעילה, מחוקה, בפירוק מרצון, מפרת חוק ועוד.

**למה זה שימושי?**

- **טפסי הרשמה ו-KYC.** בודקים שהח.פ. שהלקוח הקליד קיים, ושהחברה פעילה ולא מחוקה.
- **CRM והנהלת חשבונות.** ממלאים אוטומטית שם, כתובת ושם באנגלית לפי מספר החברה.
- **בדיקת ספקים.** מסמנים חברה שרשומה כ״מפרת חוק״ או שנמצאת בהליך מחיקה.

## התקנה

```bash
npm install israel-companies
```

בלי תלויות. עובד ב-Node.js 20 ומעלה ובדפדפן (data.gov.il מאפשר CORS), וכולל טיפוסים ל-TypeScript.

## שימוש

```js
import { getCompany, searchCompanies, checkCompanyNumber, statusInfo } from 'israel-companies'

checkCompanyNumber('52-000011-9')
// { valid: false, reason: 'checksum', message: 'ספרת הביקורת לא מתאימה למספר, ...' }

const company = await getCompany('520000118')
// {
//   number: '520000118',
//   name: 'בנק הפועלים בע״מ',
//   typeLabel: 'חברה ציבורית',
//   status: 'פעילה',
//   tone: 'active',
//   founded: '1921-05-15',
//   address: { street: "שד' רוטשילד 50", city: 'תל אביב - יפו', zip: '66883', country: 'ישראל' },
//   ...
// }

statusInfo(company.status).text
// 'החברה רשומה כפעילה: היא לא נמחקה, לא חוסלה ולא נמצאת בפירוק. ...'

await searchCompanies('טבע תעשיות')
await searchCompanies('teva pharmaceutical')
```

החיפוש לפי שם עובד בעברית ובאנגלית, מתעלם מ״בע״מ״ ומ-Ltd, ומחזיר קודם חברות פעילות שהשם שלהן מתחיל במילה שחיפשתם.

### שגיאות

כשהמאגר לא זמין נזרקת `CompanyLookupError` עם `code` אחד מאלה: `invalid-number`, `network`, `timeout`, `blocked`, `server`, `format`. ל-`blocked` מגיעים כשהמאגר מגביל קצב, ואז כדאי לחכות דקה.

```js
try {
  await getCompany(input, { timeoutMs: 10000, signal })
} catch (error) {
  if (error.code === 'blocked') retryLater()
}
```

## API

| פונקציה | מה היא עושה |
|---|---|
| `getCompany(number, options)` | מחזירה חברה לפי מספר, או `null` אם אין חברה כזו |
| `searchCompanies(name, { limit })` | חיפוש לפי שם בעברית או באנגלית |
| `checkCompanyNumber(value)` | בודקת אורך, ספרת ביקורת וקידומת, בלי לפנות לרשת |
| `isValidIsraeliId(value)` | ספרת ביקורת של תעודת זהות, ח.פ., שותפות ועמותה |
| `entityOf(number)` | לפי הקידומת: חברה, שותפות, חברת חוץ או עמותה |
| `statusInfo(status)` | הסבר בעברית לסטטוס של החברה |
| `getDataDate()` | מתי המאגר עודכן לאחרונה |

## לנסות בלי קוד

**[בדיקת חברה לפי ח.פ. או שם](https://www.aiterra.co.il/tools/company-lookup)** באתר של Aiterra.

## מקור הנתונים

[מאגר החברות של רשות התאגידים](https://data.gov.il/he/datasets/ministry_of_justice/ica_companies) ב-data.gov.il. את תאריך העדכון האחרון מחזירה `getDataDate()`. זו ספרייה של הקהילה, ואין לה קשר רשמי למשרד המשפטים. לנסח חברה רשמי פונים לרשם החברות.

---

נבנה ב-**[Aiterra](https://www.aiterra.co.il)**, סטודיו לבניית אתרים, אוטומציה וסוכני AI בישראל. רישיון MIT.

</div>

## English

Look up Israeli companies in the Registrar of Companies open dataset on data.gov.il by company number (ח.פ.) or by Hebrew or English name. The library validates the check digit before calling the API, maps the Hebrew field names to a clean typed object (ISO dates, structured address), ranks active companies first, and explains every registry status in Hebrew. It needs no API key, has no dependencies, works in Node 20+ and browsers, and ships TypeScript types. MIT, by [Aiterra](https://www.aiterra.co.il).
