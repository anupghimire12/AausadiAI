from pydantic import BaseModel
from typing import List

class Drug(BaseModel):
    """
    Pydantic model for representing drug information.
    """
    is_drug_found: bool = False
    uses: List[str] = []
    side_effects: List[str] = []
    substitutes: List[str] = []
    drug_name: str = ""
    chemical_class: str = ""
    habit_forming: str = ""
    therapeutic_class: str = ""
    action_class: str = ""
