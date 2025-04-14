import logging
import os

from dotenv import load_dotenv  # To load environment variables from a .env file

# Load environment variables from the .env file, if it exists.
if not load_dotenv(dotenv_path="../config/.env"):
    raise FileNotFoundError(
        "Environment file not found. Please ensure `.env` file exists in the `config` directory."
    )

from google import genai  # Google's Generative AI client library
from google.genai import types  # Specific types used by the Generative AI API

CLIENT = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
logging.info("Gemini API client initialized.")


def call_gemini(prompt: str, model: str, temparature: float = 1):
    # Prepare the content to be sent to the translation API.
    contents = [types.Content(parts=[types.Part.from_text(text=prompt)], role="user")]
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="text/plain",
        temperature=temparature,  # Adjust the temperature for randomness
    )
    try:
        response = CLIENT.models.generate_content(
            model=model, contents=contents, config=generate_content_config
        )

        logging.info(f"Gemini resonse: {response.text.strip()}")
        return response.text.strip()

    except Exception as e:
        logging.error(f"Error calling Gemini API: {e}")
        return "Error: Unable to call Gemini API"
