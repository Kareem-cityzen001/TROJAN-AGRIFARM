from pathlib import Path
import json
import shutil
from urllib.parse import quote

root = Path('Ecommerce-project')
source_images_dir = root / 'src/components/images/products/medicines'
pub_products_dir = root / 'public/images/products/medicines'
pub_products_dir.mkdir(parents=True, exist_ok=True)

for item in source_images_dir.iterdir():
    if item.is_file():
        shutil.copy2(item, pub_products_dir / item.name)

logo_src = source_images_dir / 'logo.png'
logo_dest_dir = root / 'public/images'
for name in ['logo.png', 'logo-white.png', 'mobile-logo.png', 'mobile-logo-white.png']:
    shutil.copy2(logo_src, logo_dest_dir / name)

products = [
    ("Oxytetracycline LA", 850, "oxytetracycline LA.jpg", ["antibiotic", "injection", "cattle"]),
    ("Penicillin-Streptomycin", 780, "penicilin streptomycin.jpg", ["antibiotic", "injection", "cattle"]),
    ("Tylosin Injection", 950, "tylosin injection.jpg", ["antibiotic", "injection", "cattle"]),
    ("Gentamycin Injection", 1100, "gentamycin injections.jpg", ["antibiotic", "injection", "cattle"]),
    ("Amoxicillin LA", 980, "amoxylin LA.jpg", ["antibiotic", "injection", "cattle"]),
    ("Enrofloxacin Injection", 1250, "enroflox injection.jpg", ["antibiotic", "injection", "cattle"]),
    ("Sulfadimidine Injection", 890, "sulfadimidine.jpg", ["antibiotic", "injection", "cattle"]),
    ("Trimethoprim Sulpha", 1000, "sulphamethoxazole.jpg", ["antibiotic", "injection", "cattle"]),
    ("Cloxacillin Mastitis Tube", 250, "clocam-LC.jpg", ["mastitis", "tube", "cattle"]),
    ("Mastijet Forte", 320, "mastijet-forte.jpg", ["mastitis", "tube", "cattle"]),
    ("Albendazole Bolus", 180, "albendazole suspension.jpg", ["dewormer", "bolus", "cattle"]),
    ("Albendazole Suspension", 650, "albendazole suspension.jpg", ["dewormer", "oral", "cattle"]),
    ("Levamisole Injection", 720, "levamisole- injection.jpg", ["dewormer", "injection", "cattle"]),
    ("Ivermectin Injection", 1150, "clocam-LC.jpg", ["dewormer", "injection", "cattle"]),
    ("Closantel Injection", 1350, "closantel injections.jpg", ["dewormer", "injection", "cattle"]),
    ("Fenbendazole Suspension", 790, "fenbendazole .jpg", ["dewormer", "oral", "cattle"]),
    ("Oxyclozanide Drench", 880, "delete EC.jpg", ["dewormer", "oral", "cattle"]),
    ("Triclabendazole Drench", 1250, "triax.jpg", ["dewormer", "oral", "cattle"]),
    ("Amitraz Tick Spray", 600, "amitraz.jpg", ["tick control", "spray", "cattle"]),
    ("Cypermethrin Pour-on", 980, "cypermenthrin.jpg", ["tick control", "pour-on", "cattle"]),
    ("Deltamethrin Pour-on", 1050, "deltamenthrin.jpg", ["tick control", "pour-on", "cattle"]),
    ("Flumethrin Pour-on", 1450, "flumenthrin.jpg", ["tick control", "pour-on", "cattle"]),
    ("Tick Grease", 350, "amitraz.jpg", ["tick control", "cream", "cattle"]),
    ("Diazinon Spray", 700, "diazinone.jpg", ["tick control", "spray", "cattle"]),
    ("Vitamin ADE Injection", 850, "vitamin ADE.jpg", ["vitamin", "injection", "cattle"]),
    ("Vitamin B Complex", 550, "vitamin B complex.jpg", ["vitamin", "injection", "cattle"]),
    ("Multivitamin Injection", 780, "multivitamin.jpg", ["vitamin", "injection", "cattle"]),
    ("Calcium Borogluconate", 980, "calcium borogluconate.jpg", ["mineral", "injection", "cattle"]),
    ("Phosphorus Injection", 1100, "phosphorus injection.jpg", ["mineral", "injection", "cattle"]),
    ("Selenium + Vitamin E", 980, "selenium + vitamin E.jpg", ["supplement", "injection", "cattle"]),
    ("Iron Dextran", 680, "iron dextran.jpg", ["supplement", "injection", "cattle"]),
    ("Dextrose 50%", 420, "dextrose 50%.jpg", ["energy", "injection", "cattle"]),
    ("Electrolyte Powder", 450, "electrolyte powder.jpg", ["supplement", "powder", "cattle"]),
    ("Oral Rehydration Salts", 320, "oral rehydration salt.jpg", ["supplement", "powder", "cattle"]),
    ("Ketoprofen Injection", 980, "ketoprofen injection.jpg", ["pain relief", "injection", "cattle"]),
    ("Meloxicam Injection", 1150, "meloxicam injection.jpg", ["pain relief", "injection", "cattle"]),
    ("Flunixin Meglumine", 1300, "diclofenac injection.jpg", ["pain relief", "injection", "cattle"]),
    ("Diclofenac Injection", 780, "diclofenac injection.jpg", ["pain relief", "injection", "cattle"]),
    ("Oxytocin Injection", 450, "calcium jet.jpg", ["reproduction", "injection", "cattle"]),
    ("Prostaglandin Injection", 1800, "prostagandin injection.jpg", ["reproduction", "injection", "cattle"]),
    ("Calcium Gel", 750, "calcium jet.jpg", ["mineral", "oral gel", "cattle"]),
    ("Rumen Booster", 680, "rumen booster.jpg", ["digestive", "powder", "cattle"]),
    ("Activated Charcoal", 420, "activated charcoal.jpg", ["digestive", "powder", "cattle"]),
    ("Probiotic Powder", 560, "probiotic powder.jpg", ["digestive", "powder", "cattle"]),
    ("Antibloat Liquid", 650, "anti-bloat.jpg", ["digestive", "oral", "cattle"]),
    ("Antiseptic Spray", 450, "antiseptic spary.jpg", ["wound care", "spray", "cattle"]),
    ("Iodine Solution", 280, "iodine solution.jpg", ["disinfectant", "liquid", "cattle"]),
    ("Wound Healing Spray", 620, "wound-healing spray.jpg", ["wound care", "spray", "cattle"]),
    ("Hoof Dressing", 550, "hoof-dressing.jpg", ["hoof care", "liquid", "cattle"]),
    ("Fly Repellent Spray", 520, "fly-repellent.jpg", ["pest control", "spray", "cattle"]),
    ("Rabies Vaccine", 350, "rabbies-vaccine.jpg", ["vaccine", "injection", "cattle"]),
    ("Black Quarter Vaccine", 420, "black-quaters vaccine.jpg", ["vaccine", "injection", "cattle"]),
    ("Anthrax Vaccine", 400, "lumpy-skin vaccine.jpg", ["vaccine", "injection", "cattle"]),
]


def write_catalog(path, export_name):
    lines = [f"export const {export_name} = ["]
    for idx, (name, price_ksh, image_file, keywords) in enumerate(products, start=1):
        product_id = f"medicine-{idx:03d}"
        image_path = "images/products/medicines/" + quote(image_file)
        lines.append("  {")
        lines.append(f'    id: {json.dumps(product_id)},')
        lines.append(f'    image: {json.dumps(image_path)},')
        lines.append(f'    name: {json.dumps(name)},')
        lines.append("    rating: {")
        lines.append(f'      stars: {4.2 + ((idx % 5) * 0.1):.1f},')
        lines.append(f'      count: {40 + idx * 3},')
        lines.append("    },")
        lines.append(f'    priceCents: {price_ksh * 100},')
        lines.append(f'    keywords: {json.dumps(keywords)}')
        lines.append("  },")
    lines.append("];\n")
    Path(path).write_text("\n".join(lines), encoding="utf-8")

write_catalog('Ecommerce-project/starting-code/data/products.js', 'products')
write_catalog('Ecommerce-backend/defaultData/defaultProducts.js', 'defaultProducts')
print('Catalog generated successfully')
