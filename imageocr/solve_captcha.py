import easyocr
import sys
import re

# Initialize EasyOCR Reader
reader = easyocr.Reader(['en'])

# Get captcha image path from command-line arguments
captcha_image_path = sys.argv[1]

# Perform OCR to extract text from captcha image
result = reader.readtext(captcha_image_path, detail=0)

# Join the results and filter non-alphanumeric characters
captcha_text = ''.join(result)
captcha_text = re.sub(r'[^A-Z0-9]', '', captcha_text)

# Print recognized text to console (this will be captured by Node.js)
print(captcha_text)

