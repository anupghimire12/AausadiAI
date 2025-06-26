from io import BytesIO

from fastapi import FastAPI, File, Path, UploadFile, Body
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from nlp import cosine, get_drugs, get_result
from ocr import TextRecognizer
from models import Drug

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
async def index():
    return {"name": "initial data"}


@app.post("/files")
async def create_upload_file(file: UploadFile = File(...)):
    print(f"[DEBUG] File received: {file.filename}, Content-Type: {file.content_type}")
    contents = await file.read()
    print(f"[DEBUG] File read into memory, size: {len(contents)} bytes")
    drug = Drug()
    try:
        tr = TextRecognizer(contents)
        print("[DEBUG] TextRecognizer initialized successfully.")
    except Exception as e:
        print(f"[ERROR] Failed to initialize TextRecognizer: {e}")
        raise Exception("Image not supported") from e

    extracted_text = tr.extracted_text
    print(f"[DEBUG] Raw OCR Extracted Text: '{extracted_text}'")

    cleaned_text = tr.clean_text()
    print(f"[DEBUG] Cleaned OCR Text: '{cleaned_text}'")

    # Attempt to extract drug entities using spaCy NER
    drug_composition_from_ner = get_drugs(cleaned_text)
    print(f"[DEBUG] Drug Composition from NER (original case): '{drug_composition_from_ner}'")

    if not drug_composition_from_ner:
        drug_composition_from_ner = get_drugs(cleaned_text.lower())
        print(f"[DEBUG] Drug Composition from NER (lowercase): '{drug_composition_from_ner}'")

    # Determine the text to use for cosine similarity
    if drug_composition_from_ner:
        text_for_cosine = drug_composition_from_ner
        print(f"[DEBUG] Using NER extracted composition for cosine: '{text_for_cosine}'")
    elif cleaned_text.strip():
        text_for_cosine = cleaned_text.lower()
        print(f"[DEBUG] NER found no drug entities. Using full cleaned OCR text (lowercase) for cosine: '{text_for_cosine}'")
    else:
        print(f"[DEBUG] No text available from OCR to perform similarity matching.")
        return drug

    drug_name = cosine(text_for_cosine)
    print(f"[DEBUG] Drug name from cosine similarity: '{drug_name}'")
    if not drug_name:
        print(f"[DEBUG] Cosine similarity too low or no match found for: '{text_for_cosine}'")
        return drug

    result = get_result(drug_name)
    print(f"[DEBUG] Final result from get_result: {result}")

    drug.is_drug_found = True
    drug.uses = result.get("Uses", [])
    drug.side_effects = result.get("Side_effects", [])
    drug.drug_name = result.get("Medicine_name", "")
    drug.chemical_class = result.get("Chemical Class", "")
    drug.habit_forming = result.get("Habit Forming", "")
    drug.therapeutic_class = result.get("Therapeutic Class", "")
    drug.action_class = result.get("Action Class", "")
    print(f"[DEBUG] Drug object to return: {drug}")

    return drug

@app.post("/ping")
async def ping():
    print("[DEBUG] Received ping from client.")
    return {"msg": "ok"};

@app.post("/manual_search")
async def manual_search(query: dict = Body(...)):
    drug_name = cosine(query.get("query", ""))
    if not drug_name:
        return {"is_drug_found": False}
    result = get_result(drug_name)
    result["is_drug_found"] = True
    return result