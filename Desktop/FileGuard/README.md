HELLLO
# FileGuard - AI-Powered File Threat Analysis

![FileGuard Hero](https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3)

**FileGuard** is a modern, web-based static analysis tool designed to detect malicious files, spoofed extensions, and hidden threats using a combination of **Magic Byte Forensics** and **Gemini 2.5 AI Heuristics**.

Unlike traditional antivirus software that relies on signature databases, FileGuard uses generative AI to inspect code structure, metadata anomalies, and obfuscated patterns to identify "Zero-Day" or unknown threats.

## 🚀 Features

*   **🛡️ Magic Byte Verification**: Detects file extension spoofing (e.g., an `.exe` disguised as a `.jpg`) by reading raw hexadecimal headers.
*   **🧠 AI Forensics (Gemini 2.5)**: Deep analysis of scripts (`.js`, `.py`, `.bat`), documents, and code for malicious logic (obfuscation, shell commands, data exfiltration).
*   **🔒 Privacy-First**: Files are processed in-memory. Only metadata and text snippets are sent for analysis; large binaries are not uploaded to a persistent server.
*   **⚡ Real-time Reports**: Instant threat scoring (0-100), classification (Safe/Suspicious/Dangerous), and technical reasoning.
*   **🧩 Browser Extension Mode**: Can be run as a sidebar or popup extension for quick analysis.
*   **🧪 Simulation Lab**: Built-in test samples to verify accuracy without risking your machine.

---

## 🛠️ Tech Stack

*   **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
*   **Visualization**: Recharts (for risk score gauges)
*   **AI Engine**: Google Gemini API (`@google/genai`)
*   **Icons**: Lucide React

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/fileguard.git
cd fileguard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Key
Create a `.env` file in the root directory and add your Google Gemini API key:
```env
API_KEY=your_google_api_key_here
```
> **Note**: You can get an API key from [Google AI Studio](https://aistudio.google.com/).

### 4. Run Locally
```bash
npm run dev
```
Open your browser to `http://localhost:5173`.

---

## 🧩 How to Install as a Chrome Extension

You can load FileGuard into Chrome or Edge as a real sidebar extension.

1.  **Build the Project:**
    In your terminal, run:
    ```bash
    npm run build
    ```
    This creates a `dist` folder with the optimized code.

2.  **Open Extensions Management:**
    Open Chrome and navigate to:
    ```
    chrome://extensions
    ```

3.  **Enable Developer Mode:**
    Toggle the switch in the top-right corner.

4.  **Load Unpacked:**
    Click the **"Load unpacked"** button (top-left) and select the `dist` folder inside your project directory.

5.  **Run It:**
    Click the puzzle piece icon in your Chrome toolbar and select **FileGuard AI**. It will open as a popup scanner!

---

## 🔍 How It Works

1.  **Ingestion**: user drags and drops a file.
2.  **Hex Dump**: The browser reads the first 64 bytes of the file to determine the true MIME type.
3.  **Content Extraction**:
    *   If text/script: Extracts source code.
    *   If binary/image: Extracts metadata and converts to base64.
4.  **AI Inference**: The data is sent to Gemini 2.5 Flash with a strict system prompt designed for security analysis.
5.  **Result**: The JSON response is parsed into a visual report.

---

## ⚠️ Disclaimer

**FileGuard is a Heuristic Analysis Tool, not a replacement for a full Antivirus.**
It is designed to provide a "second opinion" and analyze file structure. It may not detect encrypted malware or sophisticated rootkits. Always exercise caution when dealing with suspicious files.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
