// Global variable for API URL.
// Replace with your backend URL published by ngrok or your own server.
var BASE_URL = "YOUR_BACKEND_URL_HERE";

// -------------------------------------------------------------------
// 📂 Spreadsheet Menu Setup

/**
 * Adds custom AI-Powered Tools menu to the Spreadsheet UI.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("AI-Powered Tools")
    .addItem("Translator", "showSidebarTranslate")
    .addItem("Summarizer", "showSidebarSummarize")
    .addToUi();
}

// -------------------------------------------------------------------
// 🔤 Translator Sidebar and Functions

/**
 * Opens the sidebar for AI Translator.
 */
function showSidebarTranslate() {
  const html = HtmlService.createHtmlOutputFromFile("sidebar_translate")
    .setTitle("AI Translator");
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Custom formula for translating a single cell.
 *
 * Usage in Sheet: =GPT_TRANSLATE(A1, "en", "formal", "gemini-2.0-flash")
 *
 * @param {string} text - The text to translate.
 * @param {string} targetLang - The language or language code to which the text should be translated - Default to "English".
 * @param {string} style - The style to apply (e.g., "formal", "informal") - Default to "formal".
 * @param {string} model - The translation model to use - Default to "gemini-2.0-flash".
 * @returns {string} The translated text or an error message if translation fails.
 * @customfunction
 */
function GPT_TRANSLATE(text, targetLang, style, model) {
  const payload = {
    text: text.toLowerCase(), // Default Vietnamese greeting if text is empty
    target_lang: (targetLang || "en").toLowerCase(),
    style: (style || "formal").toLowerCase(),
    model: (model || "gemini-2.0-flash").toLowerCase(),
  };

  try {
    const response = UrlFetchApp.fetch(BASE_URL + "/translate", {
      method: "POST",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    });

    const data = JSON.parse(response.getContentText());
    Logger.log("Translation Result: " + data.translated_text);

    return data.translated_text;
  } catch (error) {
    Logger.log("GPT_TRANSLATION Error: " + error.message);
    return "⚠️ Translation failed";
  }
}

/**
 * Fetch available configuration options for translation such as languages, styles, and models.
 *
 * @returns {Object} An object containing arrays for languages, styles, and models.
 */
function getOptionsTranslate() {
  try {
    const response = UrlFetchApp.fetch(BASE_URL + "/translate_config", {
      method: "POST",
      muteHttpExceptions: true,
      headers: { "Content-Type": "application/json" }
    });

    if (response.getResponseCode() !== 200) {
      throw new Error("Non-200 response: " + response.getContentText());
    }

    return JSON.parse(response.getContentText());
  } catch (error) {
    Logger.log("getOptions Error: " + error.message);
    return { languages: [], styles: [], models: [] };
  }
}

/**
 * Translates a column range of text into another column.
 *
 * @param {string} startCol - The starting column letter for the source text.
 * @param {string} endCol - The column letter where the translated text will be written.
 * @param {number} skipHeader - Number of header rows to skip.
 * @param {boolean} applyAllRows - Whether to apply translation on all rows.
 * @param {number} rowLimit - Limit the number of rows to translate (if applyAllRows is false).
 * @param {string} targetLang - The target language code.
 * @param {string} model - The translation model.
 * @param {string} style - The style for translation.
 */
function translateRangeBatch(startCol, endCol, skipHeader, applyAllRows, rowLimit, targetLang, model, style) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  const startRow = skipHeader + 1;
  const endRow = applyAllRows ? lastRow : Math.min(startRow + rowLimit - 1, lastRow);

  // Get the range of original text values
  const originalRange = sheet.getRange(`${startCol}${startRow}:${startCol}${endRow}`);
  const values = originalRange.getValues();

  // Process each text row and perform translation
  const results = values.map(row => {
    const text = row[0];
    if (!text || typeof text !== "string" || text.trim() === "") return [""];
    try {
      const payload = {
        text: text,
        target_lang: targetLang,
        model: model,
        style: style
      };
      const response = UrlFetchApp.fetch(BASE_URL + "/translate", {
        method: "POST",
        contentType: "application/json",
        payload: JSON.stringify(payload)
      });
      const data = JSON.parse(response.getContentText());
      return [data.translated_text || ""];
    } catch (e) {
      Logger.log("translateRangeBatch Error: " + e.message);
      return ["⚠️ Error"];
    }
  });

  // Set the translation results into the designated column
  sheet.getRange(`${endCol}${startRow}:${endCol}${endRow}`).setValues(results);
}

// -------------------------------------------------------------------
// 🧠 Summarizer Sidebar and Functions

/**
 * Opens the sidebar for AI Summarizer.
 */
function showSidebarSummarize() {
  const html = HtmlService.createHtmlOutputFromFile("sidebar_summarize")
    .setTitle("AI Summarizer");
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Custom formula for summarizing a single cell.
 *
 * Usage in Sheet: =GPT_SUMMARIZE(A1, "Summarize key points")
 *
 * @param {string} text - The text content to summarize.
 * @param {string} userPrompt - A custom prompt to guide the summarization.
 * @param {string} model - The summarization model to use.
 * @param {number} temperature - The temperature setting for randomness (usually between 0 and 1).
 * @returns {string} The summarized text or an error message if summarization fails.
 * @customfunction
 */
function GPT_SUMMARIZE(text, userPrompt, model, temperature) {
  const payload = {
    content: text.toLowerCase(),
    prompt: (userPrompt || "Summarize this content").toLowerCase(),
    model: (model || "gemini-2.0-flash").toLowerCase(),
    temperature: Math.min(2, Math.max(0, temperature || 1.0)),
  };

  try {
    const response = UrlFetchApp.fetch(BASE_URL + "/summarize", {
      method: "POST",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    });

    const data = JSON.parse(response.getContentText());
    return data.summarized_text;
  } catch (error) {
    Logger.log("GPT_SUMMARIZE Error: " + error.message);
    return "⚠️ Summarization failed";
  }
}

/**
 * Fetch available options for summarization configuration (models, etc.).
 *
 * @returns {Object} An object containing an array for models.
 */
function getOptionsSummarize() {
  try {
    const response = UrlFetchApp.fetch(BASE_URL + "/summarize_config", {
      method: "POST",
      muteHttpExceptions: true,
      headers: { "Content-Type": "application/json" }
    });

    if (response.getResponseCode() !== 200) {
      throw new Error("Non-200 response: " + response.getContentText());
    }

    return JSON.parse(response.getContentText());
  } catch (error) {
    Logger.log("getOptions Error: " + error.message);
    return { models: [] };
  }
}

/**
 * Summarizes a column range of text into another column.
 *
 * @param {string} startCol - The starting column letter for the source text.
 * @param {string} endCol - The column letter where the summarized text will be written.
 * @param {number} skipHeader - Number of header rows to skip.
 * @param {boolean} applyAllRows - Whether to apply summarization on all rows.
 * @param {number} rowLimit - Limit the number of rows to summarize (if applyAllRows is false).
 * @param {string} model - The summarization model.
 * @param {number} temperature - The temperature setting controlling creativity.
 * @param {string} userPrompt - A custom prompt guiding the summarization.
 */
function summarizeRangeBatch(startCol, endCol, skipHeader, applyAllRows, rowLimit, model, temperature, userPrompt) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  const startRow = skipHeader + 1;
  const endRow = applyAllRows ? lastRow : Math.min(startRow + rowLimit - 1, lastRow);

  // Get the range of original text values
  const originalRange = sheet.getRange(`${startCol}${startRow}:${startCol}${endRow}`);
  const values = originalRange.getValues();

  // Process each text row and perform summarization
  const results = values.map(row => {
    const text = row[0];
    if (!text || typeof text !== "string" || text.trim() === "") return [""];
    try {
      const payload = {
        content: text,
        prompt: userPrompt || "Summarize this content",
        model: model,
        temperature: temperature
      };
      const response = UrlFetchApp.fetch(BASE_URL + "/summarize", {
        method: "POST",
        contentType: "application/json",
        payload: JSON.stringify(payload)
      });
      const data = JSON.parse(response.getContentText());
      return [data.summarized_text || ""];
    } catch (e) {
      Logger.log("summarizeRangeBatch Error: " + e.message);
      return ["⚠️ Error"];
    }
  });

  // Set the summarization results into the designated column
  sheet.getRange(`${endCol}${startRow}:${endCol}${endRow}`).setValues(results);
}
