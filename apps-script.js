// ============================================================
// HR Interview Panel — Google Apps Script Backend
// Deploy this as a Web App in Google Apps Script
// Execute as: Me | Access: Anyone
// ============================================================

const SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Panel Interview Comments";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "#", "Candidate", "Role",
        "Nitish Kumar — Rating", "Nitish Kumar — Comment", "Nitish Kumar — Verdict",
        "Sumedha — Rating", "Sumedha — Comment", "Sumedha — Verdict",
        "Harpreet Kaur — Rating", "Harpreet Kaur — Comment", "Harpreet Kaur — Verdict",
        "Panel Avg", "Final Decision", "Overall Remarks", "Last Updated"
      ]);
    }

    // Find existing row for candidate or append new
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

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", msg: err.message }))
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
