import logging

from gemini_api import call_gemini  # Import the Gemini API call function
from config import MODELS  # Import the models from the config module

from pydantic import BaseModel  # Import the BaseModel class from Pydantic for data validation

class SummarizationRequest(BaseModel):
    content: str
    model: str
    prompt: str = "Summarize the content in a concise manner."
    temparture: float = 1.0
    
    def check_model(self):
        if self.model not in MODELS["models"].keys() and \
            self.model not in MODELS["models"].values():
            return False
        
        if self.model in MODELS["models"].values():
            for code, name in MODELS["models"].items():
                if name == self.model:
                    self.model = code
                    break
        return True
    
def summarize_text(request: SummarizationRequest):
    logging.info(f"Received summarization request: {request.prompt}")
    if not request.check_model():
        logging.warning(f"Invalid model name: {request.model}")
        return "Error: Invalid model name"
    
    prompt = f"""
    # 📘 Summarization Guidelines
    You are an expert summarizer. Your task is to summarize the provided content according to the user’s instruction.

    ## Requirements:
    1. **Summarize only the content provided** — do not invent, elaborate, or interpret beyond it.
    2. **Output must consist solely of the summarized content.**
    - Do **not** include introductions, commentary, labels (e.g., “Summary:”), or closing remarks.
    3. **Formatting:**
    - You may use **leading bullets** (`-`, `•`, or `*`) *if appropriate* — for example, when the content or user instruction suggests listing key points.
    - Alternatively, you may return a short paragraph when that fits better with the content and the prompt.
    - Avoid numbered lists unless the original structure demands it.
    - Do **not** use rich text (bold, italic, or markdown).
    4. **No stylistic embellishments.**
    - Avoid persuasive language, opinions, or tone shifts.
    5. **Be concise and objective.**
    - Prioritize clarity and relevance.
    - Exclude filler phrases, redundant information, or citations unless explicitly requested.
    6. **Maintain factual integrity.**
    - The summary must accurately reflect the original meaning.

    ---

    ## User Prompt:
    {request.prompt}

    ## Content to Summarize:
    {request.content}
    """
    
    return call_gemini(prompt, request.model, temparature=request.temparture)