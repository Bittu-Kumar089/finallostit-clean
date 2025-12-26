export const generatePythonBackend = (apiKey: string) => {
  return `
import sys
import time

# Helper to keep window open on error
def print_error_and_wait(msg):
    print("\\n" + "!"*60)
    print(f"ERROR: {msg}")
    print("!"*60 + "\\n")
    input("Press Enter to exit...")
    sys.exit(1)

# Try importing dependencies
try:
    import os
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    import google.generativeai as genai
except ImportError as e:
    missing_lib = str(e).split("'")[-2] if "'" in str(e) else str(e)
    print_error_and_wait(f"Missing library: {e}\\n\\nPlease run this command to fix it:\\npip install flask flask-cors google-generativeai")

app = Flask(__name__)
CORS(app)

# Configure your API Key directly or via environment variable
API_KEY = "${apiKey || 'YOUR_API_KEY_HERE'}"

if API_KEY == 'YOUR_API_KEY_HERE':
    print("\\nWARNING: You haven't set your API Key in this script yet.")
    print("Please right-click server.py -> Edit, and replace 'YOUR_API_KEY_HERE' with your actual key.\\n")

try:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')
except Exception as e:
     print(f"Warning: Failed to configure Gemini AI: {e}")

SYSTEM_PROMPT = """
You are a cybersecurity expert. Analyze the input file data for security threats.
Check for:
1. Mismatched magic bytes (headers vs extension).
2. Obfuscated code in scripts (eval, base64 decoding).
3. Dangerous shell commands.
Return JSON: { "threatLevel": "SAFE"|"SUSPICIOUS"|"DANGEROUS", "score": 0-100, "summary": "string" }
"""

@app.route('/analyze', methods=['POST'])
def analyze_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read file content
        content = file.read()
        
        # Prepare content for Gemini
        response = model.generate_content([
            SYSTEM_PROMPT,
            {
                "mime_type": file.mimetype or "application/octet-stream",
                "data": content
            }
        ])
        
        return jsonify({"analysis": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "active", "service": "FileGuard Local Backend"})

if __name__ == '__main__':
    try:
        print(f"Starting FileGuard Backend on port 5000...")
        print(f"API Key configured: {'Yes' if API_KEY != 'YOUR_API_KEY_HERE' else 'No (Please edit file)'}")
        app.run(debug=True, port=5000)
    except Exception as e:
        print_error_and_wait(str(e))
    
    # Keep window open if it stops naturally
    input("Server stopped. Press Enter to close...")
`;
};