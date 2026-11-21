"""One-time PDF import. The resulting JSON is editable; do not rerun over manual edits."""
import argparse
import json
import re
from pathlib import Path

import pdfplumber

parser = argparse.ArgumentParser()
parser.add_argument('pdf', type=Path)
parser.add_argument('output', type=Path)
args = parser.parse_args()

def clean(value):
    return re.sub(r'\s+', ' ', value or '').strip()

products = []
with pdfplumber.open(args.pdf) as document:
    for page_number, page in enumerate(document.pages, start=1):
        for cells in page.extract_table():
            if not re.fullmatch(r'\d+\.', clean(cells[0])):
                continue
            number = int(clean(cells[0]).rstrip('.'))
            # A tiny extra grid segment splits the final "гр." on rows 50 and 206.
            high = clean(''.join(cells[5:])) if any(cells[6:]) else clean(cells[5])
            merged = cells[4] is None and cells[5] is None
            products.append({
                'id': f'pdf-{number:03d}', 'name': clean(cells[1]),
                'group': clean(cells[2]),
                'safeDose': None if merged else clean(cells[3]),
                'mediumDose': None if merged else clean(cells[4]),
                'highDose': None if merged else high,
                'combinedDose': clean(cells[3]) if merged else None,
                'aliases': [], 'note': '',
                'source': {'document': 'low-fodmap-table.pdf', 'page': page_number, 'row': number},
            })

assert [p['source']['row'] for p in products] == list(range(1, 493)), 'PDF rows missing or duplicated'
assert all(p['group'] in ['Low', 'Medium', 'High'] for p in products)
assert all(p['combinedDose'] or (p['safeDose'] and p['mediumDose'] and p['highDose']) for p in products)
args.output.parent.mkdir(parents=True, exist_ok=True)
args.output.write_text(json.dumps(products, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Imported {len(products)} products from 10 pages; merged cells retained.')
