import logging

from pydantic import BaseModel  # For request data validation using Pydantic

from config import MODELS, LANGUAGES  # Import the models and languages from the config module
from gemini_api import call_gemini  # Import the Gemini API call function


# ------------------------------------------------
# Define the Request Model for Translation
# ------------------------------------------------
# The TranslationRequest model defines the expected structure of requests.
class TranslationRequest(BaseModel):
    text: str  # The input text to translate
    target_lang: str  # The target language for the translation
    model: str  # The name of the translation model to use
    style: str  # The desired style for the translation
    
    def check_language(self):
        # self.target_lang = self.target_lang.lower()
        if self.target_lang not in LANGUAGES["languages"].keys() and \
            self.target_lang not in LANGUAGES["languages"].values():
            return False
        
        if self.target_lang in LANGUAGES["languages"].keys():
            self.target_lang = LANGUAGES["languages"][self.target_lang]
        return True
    
    def check_model(self):
        # self.model = self.model.lower()
        if self.model not in MODELS["models"].keys() and \
            self.model not in MODELS["models"].values():
            return False
        
        if self.model in MODELS["models"].values():
            for code, name in MODELS["models"].items():
                if name == self.model:
                    self.model = code
                    break
        return True

# ------------------------------------------------
# Define the Translation Function
# ------------------------------------------------
# This function builds a detailed prompt for the translation API,
# sends the request, and processes the response.
def translate_text(request: TranslationRequest):
    logging.info(f"Received translation request: {request}")
    if not request.check_language():
        logging.warning(f"Invalid language name: {request.target_lang}")
        return "Error: Invalid language name"
    
    if not request.check_model():
        logging.warning(f"Invalid model name: {request.model}")
        return "Error: Invalid model name"

    # Construct a prompt with clear instructions for the AI model.
    prompt = f"""
    You are a highly skilled {request.style} writer and translator.  
    Your task is to **automatically detect** the language of the given text and **translate it accurately** into {request.target_lang}.  

    ### **Guidelines**:
    - Preserve the **original meaning, tone, and style** of the text.  
    - Maintain the **formatting and structure**, including **line breaks, punctuation, and special characters**.  
    - Make the translation **concise** while keeping key details.  
    - Adapt idioms, cultural expressions, and technical terms appropriately for the target language.  

    ### **Strict Output Requirement**:
    - ❌ **Do NOT** add explanations, comments, notes, or extra output.  
    - ✅ **Only return the translated sentence(s), nothing else.**  

    ### **Input Text**:
    "{request.text}"

    ### **Expected Output (Translation Only)**:
    A **clean, natural-sounding translation** in {request.target_lang}.
    """

    return call_gemini(prompt, request.model).strip("\"'")

