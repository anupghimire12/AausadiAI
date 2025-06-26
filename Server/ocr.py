import re
from paddleocr import PaddleOCR
import cv2
import numpy as np
from PIL import Image
from io import BytesIO

class TextRecognizer:
    def __init__(self, img: bytes):
        self.ocr = PaddleOCR(use_angle_cls=True, lang='en')  # GPU will be used if available and configured
        # Preprocess the image bytes before passing to OCR
        processed_img_np = self.preprocess_image(img)
        self.results = self.ocr.ocr(processed_img_np, cls=True)
        self.extracted_text = self.get_text()

    def preprocess_image(self, img_bytes: bytes):
        """
        Decodes image bytes, performs resolution enhancement and Otsu binarization.
        Returns a NumPy array suitable for PaddleOCR.
        """
        # Decode image bytes using PIL and convert to BGR for OpenCV
        img_pil = Image.open(BytesIO(img_bytes)).convert("RGB")
        img_np = np.array(img_pil)
        img_np = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

        # --- Binarization using Otsu ---
        # Convert to grayscale and apply Otsu's thresholding
        gray_img = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)
        _, binarized_img = cv2.threshold(gray_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        # Convert back to BGR (PaddleOCR can handle grayscale but BGR is common)
        processed_img_np = cv2.cvtColor(binarized_img, cv2.COLOR_GRAY2BGR)

        return processed_img_np

    def get_text(self):
        extracted_text = ""
        for line in self.results[0]:
            extracted_text += " " + line[1][0]
        return extracted_text

    def clean_text(self):
        # More robust cleaning, keeps hyphens and periods useful for drug names/dosages
        cleanText = self.extracted_text
        cleanText = re.sub(r"http\S+\s*", " ", cleanText)  # Remove URLs
        cleanText = re.sub("RT|cc", " ", cleanText)
        cleanText = re.sub(r"#\S+", "", cleanText) # Remove hashtags
        cleanText = re.sub(r"@\S+", " ", cleanText) # Replace mentions with a space
        # Keep alphanumeric, spaces, periods, and hyphens. Remove other punctuation.
        cleanText = re.sub(r'[^\w\s.-]', ' ', cleanText)
        cleanText = re.sub(r"[^\x00-\x7f]", " ", cleanText) # Remove non-ASCII characters
        cleanText = re.sub(r"\s+", " ", cleanText) # Replace multiple spaces with a single space
        return cleanText.strip() # Remove leading/trailing spaces


if __name__ == "__main__":
    with open("Server/uploaded_images/amoxicillin-1.png", "rb") as f:
        tr = TextRecognizer(f.read())
        print(tr.clean_text())
