# ================================================================
# main.py
# This file contains the FastAPI application setup, including
# endpoint definitions, the translation function, and integration
# with Google's Generative AI API.
# ================================================================

import logging  # For logging events and errors

# Import the configuration and model mapping from config.py.
from config import MODELS, LANGUAGES  # Import the models and languages from the config module
from fastapi import FastAPI  # FastAPI framework for building APIs
from fastapi.middleware.cors import (
    CORSMiddleware,
)  # Middleware for handling Cross-Origin Resource Sharing

from translate import translate_text, TranslationRequest
from summarize import summarize_text, SummarizationRequest  # Import the summarize function from summarize.py


# ------------------------------------------------
# Initialize the FastAPI App
# ------------------------------------------------
app = FastAPI()
logging.info("FastAPI server started in main.py")

# ------------------------------------------------
# Configure CORS Middleware
# ------------------------------------------------
# This middleware enables Cross-Origin requests from any origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development; restrict in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ------------------------------------------------
# Define API Endpoints
# ------------------------------------------------

@app.api_route("/translate_config", methods=["GET", "POST"])
async def get_translate_config():
    logging.info("Fetching configuration")
    sent_config = {
        "models": [name for name in MODELS["models"].values()],
        "languages": [name for name in LANGUAGES["languages"].values()],
        "styles": [name for name in LANGUAGES["styles"].values()],
    }
    return sent_config

@app.api_route("/summarize_config", methods=["GET", "POST"])
async def get_summarize_config():
    logging.info("Fetching configuration")
    sent_config = {
        "models": [name for name in MODELS["models"].values()],
    }
    return sent_config


# Endpoint to perform translation.
@app.post("/translate")
async def translate(request: TranslationRequest):
    # Process the translation request and return the translated text.
    result = translate_text(request)
    return {"translated_text": result}

@app.post("/summarize")
async def summarize(request: SummarizationRequest):
    # Process the summarization request and return the summarized text.
    result = summarize_text(request)
    return {"summarized_text": result}

# ------------------------------------------------
# Application Entry Point
# ------------------------------------------------
# When run directly, start the FastAPI server with uvicorn.
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
