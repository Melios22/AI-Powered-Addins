#  Google Sheets Add-on
<a id="readme-top"></a>

## 🚀 Overview
The **Google Sheets Add-on** seamless integrates into Google Sheets, providing a quick and efficient way to translate or summarize text using AI-powered models.


## 🔧 Installation & Setup
### 1️⃣ Install the necessary files
- On Google Docs, go to `Extensions` > `Apps Script`
- Copy and Paste Files
    - Open `code.gs` (Google Apps Script backend) and paste it.
    - Open `sidebar_summarize.html` and `sidebar_translate.html` (frontend UI) and paste it.

### 2️⃣ Configure URL Access
We cannot directly access the FastAPI backend from Google Apps Script. To overcome this, we need to deploy the FastAPI backend and expose it using ngrok.
```bash
ngrok http 8000
```
Copy the ngrok URL and update the BASE_URL in `code.gs` and save it.
```javascript
var BASE_URL = "https://your-ngrok-url.ngrok.io"; // Change this
```

### 3️⃣ Run the Add-on
- Back to Google Sheets, there will be an option of `AI-Powered Tools` on the top menu. 
- Click on it and then click on `Translator` or `Summarizer` on your selection to launch the sidebar.

*<u>Note</u>:* On the first run, Google will ask for permission to access the Google Docs. Click on `Review Permissions` and then `Allow`.


## 🧩 How to Use the Add-ons and Custom Functions

### ✨ Translator

You can access the translation feature in two ways:

#### 🔠 1. Using the Custom Function: `GPT_TRANSLATE`

A quick and simple way to translate directly within cells using a formula.

**Prototype:**  
```
GPT_TRANSLATE(text, targetLang, style, model)
```
**Parameters:**
- `text` *(string)*  
  The input text to be translated.
- `targetLang` *(string)*  
  The target language or language code (e.g., `"en"`, `"vi"`).  
  *Defaults to:* `"en"` (English).
- `style` *(string)*  
  The tone or style of the translation (e.g., `"formal"`, `"informal"`).  
  *Defaults to:* `"formal"`.
- `model` *(string)*  
  The translation model to use (e.g., `"gemini-2.0-flash"`).  
  *Defaults to:* `"gemini-2.0-flash"`.

#### 🧭 2. Using the Add-on Menu: `AI-Powered Tools → Translator`

Provides a user-friendly UI with advanced control:
- **Source / Destination Columns**: Choose where to read and write translated text.
- **Skipped Rows**: Specify how many rows (e.g., headers) to skip before processing.
- **Apply To**: Choose to apply translation to all rows, auto-detected range, or a fixed number of rows.
- **Model Settings**: Configure the target language, model, and translation style.
- **Actions**:
  - `Batch Translate`: Run the translation based on your settings.
  - `Clear`: Reset all options and fields in the sidebar.

---

### 🧠 Summarizer
Like the Translator, the Summarizer supports both custom functions and a UI-based add-on.

#### 🧾 1. Using the Custom Function: `GPT_SUMMARIZE`
Allows you to summarize cell content dynamically with your own prompt.

**Prototype:**  
```
GPT_SUMMARIZE(text, userPrompt, model, temperature)
```

**Parameters:**
- `text` *(string)*  
  The text to be summarized.
- `userPrompt` *(string)*  
  A custom instruction to guide the summarization (e.g., "Summarize key points").  
  *Defaults to:* `"Summarize this content"`.
- `model` *(string)*  
  The model used for summarization.  
  *Defaults to:* `"gemini-2.0-flash"`.
- `temperature` *(number)*  
  Controls creativity/randomness (0 = deterministic, 2 = creative).  
  *Clamped to:* range between 0 and 2.  
  *Defaults to:* `1.0`.

#### 🧭 2. Using the Add-on Menu: `AI-Powered Tools → Summarizer`
A sidebar interface that simplifies summarizing large ranges:
- **Source Column**: Select the column containing the text to be summarized.
- **Prompt**: Enter a custom instruction to guide how the model summarizes the content.
- **Model Settings**: Choose the summarization model and adjust the temperature for randomness.
- **Destination Column**: Define where the summarized output should be placed.
- **Other settings** are similar to those in the Translator tool, including skipped rows and row selection range.
- **Actions**:
  - `Batch Summarize`: Apply the summarization in bulk.
  - `Clear`: Reset the UI settings.


## 🎨 Customization
The sidebar UI can be customized by modifying the `sidebar_summarize.html` and `sidebar_translate.html` file. You can change the layout, styles, and functionality as needed.


## ⚠️ Troubleshooting
Open the browser console (`Ctrl+Shift+J` in Chrome) to check for any errors.


## 📌 Related Guides
- **[Main Project README](../README.md)**
- **[Google Docs Add-on](../google-docs/README.md)**
- **[Microsoft Word Add-in](../microsoft-word/README.md)**


<p align="right">
  <a href="#readme-top">⬆️ Back to top</a>
</p>