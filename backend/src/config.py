# ================================================================
# config.py
# This module handles environment variable loading, logging setup,
# and configuration file parsing. It also builds a mapping of model names
# to their corresponding codes.
# ================================================================

import json  # For parsing JSON files
import logging  # For logging events and errors


models_file = "../config/models.json"  # Path to the JSON configuration file
languages_file = "../config/languages.json"  # Path to the languages configuration file
MODELS, LANGUAGES = None, None # Initialize variables for models and languages

# ------------------------------------------------
# Setup Logging
# ------------------------------------------------
# Logging is configured to write messages to ".log".
# This file will record informational messages and errors.
if not logging.getLogger().handlers:
    with open("../config/.log", "w") as f:
        f.write("")
    # Create a log file if it doesn't exist
    logging.basicConfig(
        filename="../config/.log",  # The log file path
        level=logging.INFO,  # Log level; change to DEBUG for more detailed output
        format="%(asctime)s - %(levelname)s - %(message)s",  # Format for each log message
    )

# ------------------------------------------------
# Load and Parse Configuration
# ------------------------------------------------
# Attempt to open and parse the JSON configuration file "data.json".
# The configuration is expected to contain a "models" key.
try:
    with open(models_file, "r", encoding="utf-8") as f:
        MODELS = json.load(f)  # Load the JSON data into a Python dictionary
    with open(languages_file, "r", encoding="utf-8") as f:
        LANGUAGES = json.load(f)  # Load the JSON data into a Python dictionary
    logging.info("Configuration loaded successfully.")
    
except Exception as e:
    # If any error occurs during loading, log the error and set default empty values.
    logging.error(f"Error loading configuration: {e}")
    MODELS, LANGUAGES = None, None # Initialize variables for models and languages
    
