import json

import en_core_med7_lg
import numpy as np
import spacy
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load drug data and NLP model once at module level
try:
    with open("drug_data.json", "r") as f:
        data = json.load(f)
    ALL_KEYS = list(data.keys())
    if not ALL_KEYS:
        print("Warning: drug_data.json loaded but contains no keys.")
except FileNotFoundError:
    print("Error: drug_data.json not found. NLP functions requiring it will fail.")
    data = {}
    ALL_KEYS = []
except json.JSONDecodeError:
    print("Error: drug_data.json is not valid JSON. NLP functions requiring it will fail.")
    data = {}
    ALL_KEYS = []

# Load the spaCy model once when the module is imported
try:
    nlp_model = spacy.load("en_core_med7_lg")
    # nlp_model = spacy.load("content/model-best") # If you have a custom model
except OSError:
    print("Warning: spaCy model 'en_core_med7_lg' not found. Please download it: python -m spacy download en_core_med7_lg")
    nlp_model = None

def get_drugs(label: str):
    if not nlp_model:
        print("Warning: spaCy model not loaded. get_drugs will return empty string.")
        return ""
    if not label or not label.strip(): # Handle empty or whitespace-only input
        return ""
    doc = nlp_model(label)
    drug_names = [ent.text for ent in doc.ents if ent.label_ == "DRUG"]
    return " ".join(drug_names).strip() # Ensure no leading/trailing spaces


def cosine(drug_names_query: str):
    if not drug_names_query:
        # print(f"DEBUG Cosine: Called with empty query: '{drug_names_query}'")
        return None # Consistent return type for "not found" or error

    if not ALL_KEYS:
        print("Error: No drug keys loaded from drug_data.json to compare against.")
        return None

    # Combine the query document with the existing documents
    all_documents = ALL_KEYS + [drug_names_query]

    # Create a CountVectorizer to convert the documents into a bag-of-words representation
    # Use character n-grams to be more robust to misspellings/OCR errors
    vectorizer = CountVectorizer(analyzer='char_wb', ngram_range=(2, 4))
    
    try:
        X = vectorizer.fit_transform(all_documents)
    except ValueError:
        print(f"DEBUG Cosine: Vectorizer failed for query: '{drug_names_query}'.")
        return None

    if X.shape[0] < 2: # Should not happen if ALL_KEYS is not empty and drug_names_query is present
        print(f"DEBUG Cosine: Not enough documents to compare. Query: '{drug_names_query}'")
        return None

    # Cosine similarity: query (last) vs all known keys (all but last)
    similarities = cosine_similarity(X[-1], X[:-1]).flatten()

    if len(similarities) == 0:
        print(f"DEBUG Cosine: Similarities array is empty. Query: '{drug_names_query}'")
        return None

    best_match_idx = np.argmax(similarities)
    highest_similarity = similarities[best_match_idx]

    print(f"DEBUG Cosine: Input query: '{drug_names_query}'")
    print(f"DEBUG Cosine: Best match in dataset: '{ALL_KEYS[best_match_idx]}'")
    print(f"DEBUG Cosine: Similarity score: {highest_similarity:.4f}")

    SIMILARITY_THRESHOLD = 0.1 # This threshold might need tuning
    if highest_similarity >= SIMILARITY_THRESHOLD:
        return ALL_KEYS[best_match_idx]
    else:
        print(f"DEBUG Cosine: Similarity {highest_similarity:.4f} is below threshold {SIMILARITY_THRESHOLD}.")
        return None


def get_result(drug_key: str):
    if drug_key not in data:
        print(f"Warning: Drug key '{drug_key}' not found in data.")
        return {} # Return empty dict or handle as an error
    return data[drug_key]


if __name__ == "__main__":
    print(
        get_result(
            cosine(
                get_drugs(
                    "30 capsules Cipla Rx Formotero Fumarate and Budesonide Powder For Inhalation IP foracort rotacaps 200"
                )
            )
        )
    )