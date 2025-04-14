# AI-Powered-Addins
<a id="readme-top"></a>

<details>
    <summary>Table of Contents</summary>
    <ol>
        <li><a href="#overview">Overview</a></li>
        <li><a href="#features">Key Features</a></li>
        <li><a href="#getting-started">Getting Started</a></li>
        <li><a href="#integration-guides">Integration Guides</a></li>
        <li><a href="#how-to-use">How to use</a></li>
        <li><a href="#customization">Customization</a></li>
        <li><a href="#troubleshooting">Troubleshooting</a></li>
        <li><a href="#license">License</a></li>
    </ol>
</details>


## 🚀 Overview  <a id="overview"></a>
This project provides a **real-time AI-Powered tool** as an add-in for **Google Docs**, **Google Sheets** and **Microsoft Word**. It allows users to translate selected text directly in their documents while preserving formatting and context, or summarize the chosen contents.


## ✨ Key Features <a id="features"></a>
✅ **Supports multiple languages**\
✅ **AI-powered operations** (Google Gemini & more)\
✅ **Custom translation styles** (e.g., formal, casual, technical)\
✅ **User-friendly sidebar interface**\
✅ **Customizable**


## 🛠️ Getting Started <a id="getting-started"></a>
### 🔧 Backend Setup  
1. **Clone the repository**  
   ```bash
   git clone https://github.com/Melios22/AI-Powered-Addins.git
   cd AI-Powered-Addins/backend/src
   ```

2. **Install dependencies**  
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure the API Key**  
   - Create a `.env` file in the `backend/config` directory.
   - Add your API key to the `.env` file:
    ```env
    GEMINI_API_KEY="your-api-key"
    ```
    You can get the API key (for free) from the [Google AI Studio](https://aistudio.google.com/apikey).

3. **Start the FastAPI backend**  
   ```bash
   python main.py
   ```

4. *(Optional)* **Expose API using ngrok**  
   ```bash
   ngrok http 8000
   ```


## 📚 Integration Guides  <a id="integration-guides"></a>
📌 **[Google Docs Add-on - Setup Guide](./google-docs/README.md)**\
📌 **[Google Sheets Add-on - Setup Guide](./google-sheets/README.md)**\
📌 **[Microsoft Word Add-in - Setup Guide](./microsoft/README.md)**  


## 📖 How to use  <a id="how-to-use"></a>
### Document-based translations
1. Upon accessing the add-in, users can select text within the document and hit `Refresh Selected Text` to display the selected text in the sidebar.
2. Users can then choose the desired language, model and style for translation (The language will be automatically recognized).
3. Click on `Translate` to replace the selected text with the translated text.
    - If users wish to revert the changes, they can simply hit `Ctrl+Z` to undo the translation.
4. Hit `Clear` to clear the text in the sidebar.

### Spreadsheet-based translations and summarizations
- User can access these features by calling the custom functions of `GPT_TRANSLATE` and `GPT_SUMMARIZE`.
- User can also access the add-ons and using on its UI:
   1. (Summarization only) Entering the prompt of how you want the model to summarize like.
   2. Choose the columns for the input source and output destination.
   3. Choose the number of rows to be applied.
   4. Change the setting arcording to your choice.
   5. Hit `Batch Translate` or `Batch Summarize` to begin the process.
   6. Hit `Clear` to clear out the inputted settings.

## 🎨 Customization  <a id="customization"></a>
### Modify the Sidebar UI
The sidebar is built with HTML, CSS and Javascript. To customize:
1. Open the corresponding files' folder.
2. Modify the HTML, CSS and Javascript as needed.
3. Save the changes and reload the add-in.

### Options
Within the `backend/config` folder, you can modify the `models.json` and `languages.json` file to change:
- **Languages**: Add or remove languages from the list.
- **Models**: Add or remove translation models.
- **Styles**: Add or remove translation styles.


## ⚠️ Troubleshooting  <a id="troubleshooting"></a>
- **No response from API?** Ensure FastAPI backend is running  
- **Errors in translation?** Check API key configuration

For more information, please check the `.log` files in the `backend/config` directory.

## 📝 License  <a id="license"></a>
This project is licensed under the **MIT License** – Free to use and modify.  


<p align="right">
  <a href="#readme-top">⬆️ Back to top</a>
</p>

