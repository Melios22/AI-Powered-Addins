#  Microsoft Word Add-in - Setup Guide
<a id="readme-top"></a>

## 🚀 Overview
The **Microsoft Word AI Translator Add-in** seamless integrates into Microsoft Word, providing a quick and efficient way to translate selected text using AI-powered models.


## 🔧 Installation & Setup
### 1️⃣ **Install Node.js (If Not Installed)**
MS Word uses Node.js to run the add-in. If you don't have Node.js installed, download and install it from [here](https://nodejs.org/).

### 2️⃣ **Install SSL Certificate**
MS Word requires the add-in to be served over HTTPS. To do this, we need to create a self-signed SSL certificate.
```bash
npm install -g office-addin-dev-certs
office-addin-dev-certs install
```

### 3️⃣ **Install via Microsoft Office Add-ins Development Kit**
- In VSCode (or your preferred code editor), install the extension `Microsoft Office Add-ins Development Kit`.
- Hit create a new add-in, follow its instructions:
    - Select `Word Add-in` as the platform.
    - Choose `Add-in with Task Pane` as the type of add-in.
    - Select `JavaScript` as the programming language.
    - Choose your project path and name.
- A new project will be created with the necessary files and configurations (including the `guid`)
- Replace these files in the `src/taskpane` folder:
    - `taskpane.html`
    - `taskpane.js`
    - `taskpane.css`

### 4️⃣ **Run the Add-in**
- On the first run, install the dependencies by running the following command in the terminal.
    - If it does not have a `package.json` file, initialize it.
    ```bash
    npm init -y
    ```
    - Install the dependencies and generate the `node_modules` folder.
    ```bash
    npm install
    ```
- In the terminal, run the following command to start the add-in server.
```bash
npm start
```

During the startup process, `Allow localhost loopback for Microsoft Edge WebView? (Y/n)` will be prompted. You can select either `Y` or `n` based on your preference, but it is not required for running the add-in.

*<u>Note</u>*: It may take a while to generate the `node_modules` folder and start the server for the first time.


## 🎨 Customization
The sidebar UI can be customized by modifying the files in the `src/taskpane` folder. You can change the layout, styles, and functionality as needed.

In the `manifest.xml` file, you can further customize the add-in with icons and other properties.


## ⚠️ Troubleshooting
Open the terminal or the debug console to check for any errors.


## 📌 Related Guides
- **[Google Docs Add-on - Setup Guide](../google/README.md)**
 - **[Main Project README](../README.md)**

<p align="right">
  <a href="#readme-top">⬆️ Back to top</a>
</p>

