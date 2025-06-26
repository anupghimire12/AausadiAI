from nlp import cosine, get_drugs, get_result

# Example: test with a medicine name from your CSV, e.g., "Paracetamol"
name = "Paracetamol"
drug_entity = get_drugs(name)
print("NER result:", drug_entity)
drug_key = cosine(drug_entity or name)
print("Cosine match:", drug_key)
result = get_result(drug_key)
print("Final result:", result)