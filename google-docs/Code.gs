// Global variable for API URL.
// Replace with your backend URL published by ngrok or your own server.
var BASE_URL = "YOUR_BACKEND_URL_HERE";

/**
 * Adds "AI Translator" to the Google Docs menu.
 * Called automatically when the document is opened.
 */
function onOpen() {
  DocumentApp.getUi()
    .createMenu("AI-Powered Tools")
    .addItem("Translator", "openSidebar")
    .addToUi();
}

/**
 * Opens the sidebar for the translator.
 * Uses the HTML file named "sidebar".
 */
function openSidebar() {
  var html = HtmlService.createHtmlOutputFromFile("sidebar")
    .setTitle("AI Translator");
  DocumentApp.getUi().showSidebar(html);
}

/**
 * Fetches translation configuration options from the backend.
 *
 * @returns {Object} An object containing languages, styles, and models.
 *                   In case of error, returns an object with empty arrays.
 */
function getOptions() {
  try {
    var response = UrlFetchApp.fetch(BASE_URL + "/translate_config", {
      method: "post",
      muteHttpExceptions: true,
      headers: {
        "Content-Type": "application/json"
      }
    });

    Logger.log("Response Code: " + response.getResponseCode());
    Logger.log("Response Text: " + response.getContentText());

    // Throw an error if response is not OK
    if (response.getResponseCode() !== 200) {
      throw new Error("Error fetching options: " + response.getContentText());
    }

    return JSON.parse(response.getContentText());

  } catch (error) {
    Logger.log("Fetch Error: " + error.message);
    // Return default empty configuration if request fails
    return { languages: [], styles: [], models: [] };
  }
}

/**
 * Retrieves the currently selected text in the active Document.
 *
 * @return {string} The selected text, or an empty string if no selection exists.
 */
function getSelectedText() {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();
  
  if (!selection) {
    Logger.log("No text selected.");
    return "";
  }

  var text = "";
  var elements = selection.getRangeElements();
  
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i].getElement();
    if (elements[i].isPartial()) {
      // For partial selection, extract only the selected portion.
      text += element.asText().getText().substring(
        elements[i].getStartOffset(),
        elements[i].getEndOffsetInclusive() + 1
      );
    } else {
      // For whole element selection, take the full text.
      text += element.asText().getText();
    }
  }

  Logger.log("Selected Text: " + text);
  return text;
}

/**
 * Calls the backend API to translate the given text.
 * After receiving the translated text, it replaces the current selection with it.
 *
 * @param {string} text The text to translate.
 * @param {string} targetLang The target language code.
 * @param {string} model The translation model to use.
 * @param {string} style The translation style (e.g., formal, informal).
 * @return {string} The translated text, or an error message if the call fails.
 */
function translateText(text, targetLang, model, style) {
  var payload = {
    text: text,
    target_lang: targetLang,
    model: model,
    style: style
  };

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(BASE_URL + "/translate", options);
    var json = JSON.parse(response.getContentText());
    var translatedText = json.translated_text;

    // Replace selected text with translated text and retain the new selection.
    replaceSelectedText(translatedText);

    return translatedText;
  } catch (e) {
    Logger.log("❌ Error: " + e.toString());
    return "Error contacting translation service.";
  }
}

/**
 * Replaces the currently selected text in the active Document with new text.
 * It also re-selects the newly inserted translated text.
 *
 * @param {string} newText The text to insert in place of the selected text.
 */
function replaceSelectedText(newText) {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();

  if (!selection) {
    Logger.log("No selection to replace.");
    return;
  }

  var elements = selection.getRangeElements();
  
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i].getElement();
    if (elements[i].isPartial()) {
      var textElement = element.asText();
      var start = elements[i].getStartOffset();
      var end = elements[i].getEndOffsetInclusive();
      
      // Break the text into three parts: before, newText, and after.
      var originalText = textElement.getText();
      var before = originalText.substring(0, start);
      var after = originalText.substring(end + 1);
      textElement.setText(before + newText + after);
      
      // Build a new range to re-select the inserted translated text.
      var rangeBuilder = doc.newRange();
      rangeBuilder.addElement(textElement, start, start + newText.length - 1);
      doc.setSelection(rangeBuilder.build());
    }
  }
}
