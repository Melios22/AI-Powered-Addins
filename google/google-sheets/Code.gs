// 🌐 Set this to your backend endpoint (use ngrok for local testing)
var BASE_URL = "https://07ab-1-55-42-167.ngrok-free.app"; // ← CHANGE THIS

// 📂 Sidebar menu item
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("AI Translator")
    .addItem("Open Translator", "showSidebar")
    .addToUi();
}

// 📜 Open the sidebar UI
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile("sidebar")
    .setTitle("AI Sheet Translator");
  SpreadsheetApp.getUi().showSidebar(html);
}

// 🔤 Custom formula for translating a single cell
// Usage in Sheet: =GPT_TRANSLATION(A1, "en", "formal", "gemini-2.0-flash")
function GPT_TRANSLATION(text, targetLang, style, model) {
  Logger.log("=== GPT_TRANSLATION START ===");
  Logger.log("Input Text: " + text);
  Logger.log("Target Language: " + targetLang);
  Logger.log("Style: " + style);
  Logger.log("Model: " + model);

  const payload = {
    text: text || "xin chào thầy và các bạn",
    target_lang: targetLang || "en",
    style: style || "formal",
    model: model || "gemini-2.0-flash",
  };

  Logger.log("Payload: " + JSON.stringify(payload));

  try {
    const response = UrlFetchApp.fetch(BASE_URL + "/translate", {
      method: "POST",
      contentType: "application/json",
      payload: JSON.stringify(payload),
    });

    Logger.log("Response Code: " + response.getResponseCode());
    Logger.log("Response Text: " + response.getContentText());

    const data = JSON.parse(response.getContentText());
    Logger.log("Translation Result: " + data.translated_text);

    return data.translated_text || "⚠️ No translation found";

  } catch (error) {
    Logger.log("GPT_TRANSLATION Error: " + error.message);
    return "⚠️ Translation failed";
  }
}

// ⚙️ Fetch available options for language, style, and model dropdowns
function getOptions() {
  try {
    const response = UrlFetchApp.fetch(BASE_URL + "/config", {
      method: "POST",
      muteHttpExceptions: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    Logger.log("Response Code: " + response.getResponseCode());
    Logger.log("Response Text: " + response.getContentText());

    if (response.getResponseCode() !== 200) {
      throw new Error("Non-200 response: " + response.getContentText());
    }

    return JSON.parse(response.getContentText());

  } catch (error) {
    Logger.log("getOptions Error: " + error.message);
    return { languages: [], styles: [], models: [] };
  }
}

// 🔁 Translate a column of text into another column
function translateRangeBatch(startCol, endCol, skipHeader, applyAllRows, rowLimit, targetLang, model, style) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  const startRow = skipHeader + 1;
  const endRow = applyAllRows ? lastRow : Math.min(startRow + rowLimit - 1, lastRow);

  const originalRange = sheet.getRange(`${startCol}${startRow}:${startCol}${endRow}`);
  const values = originalRange.getValues();

  const results = values.map(row => {
    const text = row[0];
    if (!text || typeof text !== "string" || text.trim() === "") return [""];
    try {
      const payload = {
        text,
        target_lang: targetLang,
        model,
        style,
      };
      const response = UrlFetchApp.fetch(BASE_URL + "/translate", {
        method: "POST",
        contentType: "application/json",
        payload: JSON.stringify(payload),
      });
      const data = JSON.parse(response.getContentText());
      return [data.translation || ""];
    } catch (e) {
      Logger.log("translateRangeBatch Error: " + e.message);
      return ["⚠️ Error"];
    }
  });

  sheet.getRange(`${endCol}${startRow}:${endCol}${endRow}`).setValues(results);
}
