import pdfplumber
import sys

files = {
    'en_resume': r'x:\2025\Zhaoyang_Master_personal_website_rebulid\public\en_resume.pdf',
    'cn_resume': r'x:\2025\Zhaoyang_Master_personal_website_rebulid\public\cn_resume.pdf',
    'all_materials': r'x:\2025\Zhaoyang_Master_personal_website_rebulid\docs\resume_archive\me_所有资料_compressed.pdf',
}

for name, path in files.items():
    print(f'\n{"="*60}')
    print(f'FILE: {name}')
    print(f'{"="*60}')
    try:
        with pdfplumber.open(path) as pdf:
            print(f'Total Pages: {len(pdf.pages)}')
            for i, page in enumerate(pdf.pages):
                print(f'\n--- Page {i+1} ---')
                text = page.extract_text()
                if text:
                    print(text)
                else:
                    print('[No selectable text - may be image-based PDF]')
    except Exception as e:
        print(f'ERROR: {e}')
