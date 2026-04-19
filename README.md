# HR Interview Panel — Live Comment Tracker

A lightweight, single-file HR interview tool built for real-time panel interviews.  
Three panel members can fill ratings, comments and verdicts during the interview — everything auto-saves to **Google Sheets** instantly.

---

## 🔴 Live Demo

> Open `index.html` in any browser — no server or installation needed.

---

## ✨ Features

- **3-Member Panel Support** — Nitish Kumar · Sumedha · Harpreet Kaur
- **Star Rating (1–5)** per interviewer per candidate
- **Comment Box** for individual observations during interview
- **Verdict Buttons** — Select / Hold / Reject per panelist
- **Final Decision** dropdown with overall remarks
- **Auto-save to Google Sheets** — every save syncs in real time
- **Auto-load from Google Sheets** — reopening the file restores saved data
- **Live counters** — Selected / On Hold / Rejected update instantly
- **Works offline** — open from any device, no internet needed to view
- **Mobile responsive** — works on phone, tablet and laptop

---

## 👥 Candidates

| # | Name | Role |
|---|------|------|
| 1 | Keshvi Priya Sinha | PR / Media Executive |
| 2 | Sharmistha Das | Social Media Manager |
| 3 | Niharika Katyura | Video / Multimedia Production |
| 4 | Komal Solanki | Content Writer / SEO |
| 5 | Palak Sharma | Brand / Social Media |
| 6 | Aditya Banerjee | Public Affairs / CSR |
| 7 | Priyanshi Pandey | HR / Admin Executive |
| 8 | Reeya Reetuparna Rout | PR / Communications Intern |
| 9 | Shivani Singh | E-Commerce / Digital Admin |
| 10 | Anshu Kumari | Admin / Data Entry Support |

---

## ⚙️ Setup — Google Sheets Sync

This tool uses a **Google Apps Script Web App** to save and load data.

### Step 1 — Create a Google Sheet
Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.

### Step 2 — Open Apps Script
In your sheet: **Extensions → Apps Script**

### Step 3 — Paste the script

```javascript
const SHEET_ID = "YOUR_GOOGLE_SHEET_ID";
const SHEET_NAME = "Panel Interview Comments";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "#","Candidate","Role",
        "Nitish Kumar — Rating","Nitish Kumar — Comment","Nitish Kumar — Verdict",
        "Sumedha — Rating","Sumedha — Comment","Sumedha — Verdict",
        "Harpreet Kaur — Rating","Harpreet Kaur — Comment","Harpreet Kaur — Verdict",
        "Panel Avg","Final Decision","Overall Remarks","Last Updated"
      ]);
    }

    const values = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][1] === data.name) { rowIndex = i + 1; break; }
    }

    const row = [
      data.num, data.name, data.role,
      data.r0, data.c0, data.v0,
      data.r1, data.c1, data.v1,
      data.r2, data.c2, data.v2,
      data.avg, data.final, data.remarks,
      new Date().toLocaleString("en-IN")
    ];

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", msg: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return ContentService
    .createTextOutput(JSON.stringify({ rows: [] }))
    .setMimeType(ContentService.MimeType.JSON);
  const values = sheet.getDataRange().getValues();
  return ContentService
    .createTextOutput(JSON.stringify({ rows: values.slice(1) }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Step 4 — Deploy as Web App
1. Click **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Click **Deploy** → copy the Web App URL

### Step 5 — Update `index.html`
Replace the `GS_URL` value near the top of `index.html`:

```javascript
const GS_URL = "YOUR_WEB_APP_URL_HERE";
```

---

## 📁 File Structure

```
hr-interview-panel/
│
├── index.html        ← Main interview panel tool (open this)
├── README.md         ← Setup guide and documentation
└── apps-script.js    ← Google Apps Script code (reference copy)
```

---

## 🚀 How to Use

1. Share `index.html` with all panel members before the interview
2. Each member opens it in their browser
3. Click a candidate card to expand
4. Fill in **rating**, **comments** and **verdict** during the interview
5. Click **Save to Sheets** — syncs to Google Sheets instantly
6. Reopening the file later restores all previously saved data automatically

---

## 🛠️ Tech Stack

- Pure **HTML / CSS / JavaScript** — no frameworks, no dependencies
- **Google Apps Script** — serverless backend for Sheets sync
- **Google Sheets** — data storage

---

## 📄 License

MIT License — free to use, modify and distribute.

---

> Built for internal HR use · Confidential candidate data should be handled responsibly.
