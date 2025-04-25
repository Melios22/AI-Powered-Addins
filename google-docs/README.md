#  Google Docs Add-on
<a id="readme-top"></a>

## 🚀 Overview
The **Google Docs AI Translator Add-on** seamless integrates into Google Docs, providing a quick and efficient way to translate selected text using AI-powered models.


## 🔧 Installation & Setup
### 1️⃣ Install the necessary files
- On Google Docs, go to `Extensions` > `Apps Script`
- Copy and Paste Files
    - Open `code.gs` (Google Apps Script backend) and paste it.
    - Open `sidebar.html` (frontend UI) and paste it.

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
- Back to Google Docs, there will be an option of `AI-Powered Tools` on the top menu. 
- Click on it and then click on `Translator` to launch the sidebar.

*<u>Note</u>:* On the first run, Google will ask for permission to access the Google Docs. Click on `Review Permissions` and then `Allow`.

## 🎨 Customization
The sidebar UI can be customized by modifying the `sidebar.html` file. You can change the layout, styles, and functionality as needed.


## ⚠️ Troubleshooting
Open the browser console (`Ctrl+Shift+J` in Chrome) to check for any errors.


## 📌 Related Guides
- **[Main Project README](../README.md)**
- **[Google Sheets Add-on](../google-sheets/README.md)**
- **[Microsoft Word Add-in](../microsoft-word/README.md)**

<p align="right">
  <a href="#readme-top">⬆️ Back to top</a>
</p>