import json
import os

def list_unique_work_types():
    # JSON dosyasının yolunu belirle
    json_path = "public/data/yazilimci-maaslari.json"
    
    # Dosyanın var olup olmadığını kontrol et
    if not os.path.exists(json_path):
        print(f"Hata: {json_path} dosyası bulunamadı.")
        return
    
    try:
        # JSON dosyasını oku
        with open(json_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Tüm work_type değerlerini topla
        work_types = []
        for entry in data:
            if "work_type" in entry:
                work_types.append(entry["work_type"])
        
        # Benzersiz work_type değerlerini bul
        unique_work_types = sorted(set(work_types))
        
        # Sonuçları yazdır
        print("Benzersiz work_type değerleri:")
        for work_type in unique_work_types:
            print(f"- {work_type}")
        
        print(f"\nToplam {len(unique_work_types)} farklı work_type değeri bulundu.")
    
    except Exception as e:
        print(f"Hata oluştu: {e}")

if __name__ == "__main__":
    list_unique_work_types()
