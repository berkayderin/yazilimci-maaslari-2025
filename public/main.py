import json
import os
from collections import defaultdict
import statistics

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

def analyze_salaries_by_categories():
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
        
        # Pozisyon, seviye ve para birimine göre maaşları sınıflandırmak için veri yapıları
        position_salaries = defaultdict(list)
        level_salaries = defaultdict(list)
        currency_salaries = defaultdict(list)
        
        # Maaş verisini numaraya çevirmek için yardımcı fonksiyon
        def parse_salary(salary_str):
            if not salary_str or not isinstance(salary_str, str):
                return None
            
            # Maaş aralığı varsa (örn. "195.000 - 199.999") ortalamasını al
            if " - " in salary_str:
                parts = salary_str.split(" - ")
                try:
                    min_salary = float(parts[0].replace(".", "").replace(",", ".").strip())
                    max_salary = float(parts[1].replace(".", "").replace(",", ".").strip())
                    return (min_salary + max_salary) / 2
                except (ValueError, IndexError):
                    return None
            
            # Tek değer varsa
            try:
                return float(salary_str.replace(".", "").replace(",", ".").strip())
            except ValueError:
                return None
        
        # Verileri işleme
        for entry in data:
            # Gerekli alanların varlığını kontrol et
            position = entry.get("position")
            level = entry.get("level")
            currency = entry.get("currency")
            salary_str = entry.get("salary")
            
            salary = parse_salary(salary_str)
            if salary is not None:
                if position:
                    position_salaries[position].append(salary)
                if level:
                    level_salaries[level].append(salary)
                if currency:
                    currency_salaries[currency].append(salary)
        
        # Sonuçları analiz et ve yazdır
        print("\n--- POZİSYONA GÖRE MAAŞ ANALİZİ ---")
        for position, salaries in sorted(position_salaries.items()):
            if salaries:
                avg = sum(salaries) / len(salaries)
                min_salary = min(salaries)
                max_salary = max(salaries)
                print(f"Pozisyon: {position}")
                print(f"  Ortalama: {avg:.2f}")
                print(f"  Minimum: {min_salary:.2f}")
                print(f"  Maksimum: {max_salary:.2f}")
                print(f"  Veri Sayısı: {len(salaries)}")
                print()
        
        print("\n--- SEVİYEYE GÖRE MAAŞ ANALİZİ ---")
        for level, salaries in sorted(level_salaries.items()):
            if salaries:
                avg = sum(salaries) / len(salaries)
                min_salary = min(salaries)
                max_salary = max(salaries)
                print(f"Seviye: {level}")
                print(f"  Ortalama: {avg:.2f}")
                print(f"  Minimum: {min_salary:.2f}")
                print(f"  Maksimum: {max_salary:.2f}")
                print(f"  Veri Sayısı: {len(salaries)}")
                print()
        
        print("\n--- PARA BİRİMİNE GÖRE MAAŞ ANALİZİ ---")
        for currency, salaries in sorted(currency_salaries.items()):
            if salaries:
                avg = sum(salaries) / len(salaries)
                min_salary = min(salaries)
                max_salary = max(salaries)
                print(f"Para Birimi: {currency}")
                print(f"  Ortalama: {avg:.2f}")
                print(f"  Minimum: {min_salary:.2f}")
                print(f"  Maksimum: {max_salary:.2f}")
                print(f"  Veri Sayısı: {len(salaries)}")
                print()
                
    except Exception as e:
        print(f"Hata oluştu: {e}")

def list_unique_cities():
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
        
        # Tüm city değerlerini topla
        cities = []
        for entry in data:
            if "city" in entry:
                cities.append(entry["city"])
        
        # Benzersiz city değerlerini bul
        unique_cities = sorted(set(cities))
        
        # Sonuçları yazdır
        print("\nBenzersiz şehir değerleri:")
        for city in unique_cities:
            print(f"- {city}")
        
        print(f"\nToplam {len(unique_cities)} farklı şehir bulundu.")
    
    except Exception as e:
        print(f"Hata oluştu: {e}")

def list_unique_companies():
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
        
        # Tüm company değerlerini topla
        companies = []
        for entry in data:
            if "company" in entry:
                companies.append(entry["company"])
        
        # Benzersiz company değerlerini bul
        unique_companies = sorted(set(companies))
        
        # Sonuçları yazdır
        print("\nBenzersiz şirket değerleri:")
        for company in unique_companies:
            print(f"- {company}")
        
        print(f"\nToplam {len(unique_companies)} farklı şirket bulundu.")
    
    except Exception as e:
        print(f"Hata oluştu: {e}")

def list_unique_company_sizes():
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
        
        # Tüm company_size değerlerini topla
        company_sizes = []
        for entry in data:
            if "company_size" in entry:
                company_sizes.append(entry["company_size"])
        
        # Benzersiz company_size değerlerini bul
        unique_company_sizes = sorted(set(company_sizes))
        
        # Sonuçları yazdır
        print("\nBenzersiz şirket büyüklüğü değerleri:")
        for size in unique_company_sizes:
            print(f"- {size}")
        
        print(f"\nToplam {len(unique_company_sizes)} farklı şirket büyüklüğü kategorisi bulundu.")
    
    except Exception as e:
        print(f"Hata oluştu: {e}")

def list_unique_tech_stacks():
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
        
        # Tüm tech_stack değerlerini topla
        tech_stacks = []
        for entry in data:
            if "tech_stack" in entry:
                # Virgülle ayrılmış teknolojileri ayır ve listeye ekle
                technologies = entry["tech_stack"].split(",")
                tech_stacks.extend([tech.strip() for tech in technologies])
        
        # Benzersiz tech_stack değerlerini bul ve sırala
        unique_tech_stacks = sorted(set(tech_stacks))
        
        # Her bir teknolojinin kullanım sayısını hesapla
        tech_stack_counts = defaultdict(int)
        for tech in tech_stacks:
            tech_stack_counts[tech] += 1
        
        # Kullanım sayısına göre sırala (çoktan aza)
        sorted_tech_stacks = sorted(tech_stack_counts.items(), key=lambda x: x[1], reverse=True)
        
        # Sonuçları yazdır
        print("\nTeknolojiler ve kullanım sayıları:")
        for tech, count in sorted_tech_stacks:
            print(f"- {tech}: {count} kez")
        
        print(f"\nToplam {len(unique_tech_stacks)} farklı teknoloji bulundu.")
        print(f"Toplam {sum(tech_stack_counts.values())} teknoloji kullanımı var.")
    
    except Exception as e:
        print(f"Hata oluştu: {e}")

if __name__ == "__main__":
    # list_unique_work_types()
    # analyze_salaries_by_categories()
    # list_unique_cities()
    # list_unique_companies()
    # list_unique_company_sizes()
    list_unique_tech_stacks()
