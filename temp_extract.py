from pathlib import Path
from PyPDF2 import PdfReader
pdf_path = Path(r'Ecommerce-project/src/components/images/products/medicines/Cattle_Medicines_53_Products.pdf')
reader = PdfReader(str(pdf_path))
print('pages', len(reader.pages))
for i, page in enumerate(reader.pages):
    text = page.extract_text() or ''
    print(f'--- PAGE {i+1} ---')
    print(text[:12000])
    print()
