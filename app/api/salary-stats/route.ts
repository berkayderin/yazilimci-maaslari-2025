import { NextResponse } from "next/server";
import data from "@/public/data/yazilimci-maaslari.json";

interface SalaryEntry {
  position?: string;
  level?: string;
  currency?: string;
  company?: string;
  salary?: string;
  city?: string;
  work_type?: string;
  experience?: string;
  company_size?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");
    const level = searchParams.get("level");

    const filteredData = (data as SalaryEntry[]).filter((item) => {
      const matchesPosition = !position || position === "all" || item.position === position;
      const matchesLevel = !level || level === "all" || item.level === level;
      const matchesCurrency = item.currency === "₺ - Türk Lirası";
      return matchesPosition && matchesLevel && matchesCurrency;
    });

    // Ortalama maaş hesaplama
    const calculateAvgSalary = (data: SalaryEntry[]): number => {
      if (data.length === 0) return 0;
      
      let total = 0;
      let count = 0;
      
      data.forEach(item => {
        if (item.salary) {
          const salary = parseFloat(item.salary.replace(/\./g, "").replace(",", "."));
          if (!isNaN(salary)) {
            total += salary;
            count += 1;
          }
        }
      });
      
      return count > 0 ? Math.round(total / count) : 0;
    };

    // Deneyime göre maaş dağılımı
    const experienceSalary = filteredData
      .reduce((acc: { [key: string]: { total: number; count: number } }, item) => {
        if (item.experience && item.salary) {
          const salary = parseFloat(item.salary.replace(/\./g, "").replace(",", "."));
          if (!isNaN(salary)) {
            if (!acc[item.experience]) {
              acc[item.experience] = { total: 0, count: 0 };
            }
            acc[item.experience].total += salary;
            acc[item.experience].count += 1;
          }
        }
        return acc;
      }, {});

    const experienceOrder = [
      "0 - 1 Yıl",
      "1 - 3 Yıl",
      "3 - 5 Yıl",
      "5 - 7 Yıl",
      "7 - 10 Yıl",
      "10 - 12 Yıl",
      "12 - 14 Yıl",
      "15 Yıl ve üzeri"
    ];

    const experienceSalaryData = experienceOrder
      .filter(exp => experienceSalary[exp])
      .map(exp => ({
        name: exp,
        value: Math.round(experienceSalary[exp].total / experienceSalary[exp].count),
      }));

    // Şirket büyüklüğüne göre maaş dağılımı
    const companySizeAvgSalary = filteredData
      .reduce((acc: { [key: string]: { total: number; count: number } }, item) => {
        if (item.company_size && item.salary) {
          const salary = parseFloat(item.salary.replace(/\./g, "").replace(",", "."));
          if (!isNaN(salary)) {
            if (!acc[item.company_size]) {
              acc[item.company_size] = { total: 0, count: 0 };
            }
            acc[item.company_size].total += salary;
            acc[item.company_size].count += 1;
          }
        }
        return acc;
      }, {});

    const companySizeOrder = [
      "1 - 5 Kişi",
      "6 - 10 Kişi",
      "11 - 20 Kişi",
      "21 - 50 Kişi",
      "51 - 100 Kişi",
      "101 - 249 Kişi",
      "250+"
    ];

    const companySizeAvgSalaryArray = companySizeOrder
      .filter(size => companySizeAvgSalary[size])
      .map(size => ({
        name: size,
        value: Math.round(companySizeAvgSalary[size].total / companySizeAvgSalary[size].count),
      }));

    // Çalışma türüne göre dağılım
    const workTypeDistribution = filteredData
      .reduce((acc: { [key: string]: number }, item) => {
        if (item.work_type) {
          acc[item.work_type] = (acc[item.work_type] || 0) + 1;
        }
        return acc;
      }, {});

    const workTypeDistributionArray = Object.entries(workTypeDistribution)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);

    // Pozisyonlara göre maaş dağılımı
    const positionAverageSalary = filteredData
      .reduce((acc: { [key: string]: { total: number; count: number } }, item) => {
        if (item.position && item.salary) {
          const salary = parseFloat(item.salary.replace(/\./g, "").replace(",", "."));
          if (!isNaN(salary)) {
            if (!acc[item.position]) {
              acc[item.position] = { total: 0, count: 0 };
            }
            acc[item.position].total += salary;
            acc[item.position].count += 1;
          }
        }
        return acc;
      }, {});

    const positionAverageSalaryArray = Object.entries(positionAverageSalary)
      .map(([name, { total, count }]) => ({
        name,
        value: Math.round(total / count),
      }))
      .sort((a, b) => b.value - a.value);

    // Şirketlere göre maaş dağılımı
    const companyAverageSalary = filteredData
      .reduce((acc: { [key: string]: { total: number; count: number } }, item) => {
        if (item.company && item.salary) {
          const salary = parseFloat(item.salary.replace(/\./g, "").replace(",", "."));
          if (!isNaN(salary)) {
            if (!acc[item.company]) {
              acc[item.company] = { total: 0, count: 0 };
            }
            acc[item.company].total += salary;
            acc[item.company].count += 1;
          }
        }
        return acc;
      }, {});

    const companyAverageSalaryArray = Object.entries(companyAverageSalary)
      .map(([name, { total, count }]) => ({
        name,
        value: Math.round(total / count),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Şehirlere göre maaş ortalaması
    const turkishCities = [
      "Adana", "Adıyaman", "Afyonkarahisar", "Aksaray", "Amasya", "Ankara", "Antalya",
      "Ardahan", "Artvin", "Aydın", "Ağrı", "Balıkesir", "Batman", "Bilecik", "Bitlis",
      "Bolu", "Bursa", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan",
      "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Hakkari", "Hatay", "Isparta",
      "Iğdır", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri",
      "Kilis", "Kocaeli", "Konya", "Kütahya", "Kırklareli", "Kırşehir", "Malatya",
      "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu",
      "Osmaniye", "Rize", "Sakarya", "Samsun", "Sinop", "Sivas", "Tekirdağ", "Tokat",
      "Trabzon", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak", "Çanakkale", "Çorum",
      "İstanbul", "İzmir", "Şanlıurfa"
    ];

    const cityAverageSalary = filteredData
      .reduce((acc: { [key: string]: { total: number; count: number } }, item) => {
        if (item.city && item.salary && turkishCities.includes(item.city)) {
          const salary = parseFloat(item.salary.replace(/\./g, "").replace(",", "."));
          if (!isNaN(salary)) {
            if (!acc[item.city]) {
              acc[item.city] = { total: 0, count: 0 };
            }
            acc[item.city].total += salary;
            acc[item.city].count += 1;
          }
        }
        return acc;
      }, {});

    const cityAverageSalaryArray = Object.entries(cityAverageSalary)
      .map(([name, { total, count }]) => ({
        name,
        value: Math.round(total / count),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      stats: {
        positionAverageSalary: positionAverageSalaryArray,
        experienceSalaryData,
        companySizeAvgSalary: companySizeAvgSalaryArray,
        workTypeDistribution: workTypeDistributionArray,
        companyAverageSalary: companyAverageSalaryArray,
        cityAverageSalary: cityAverageSalaryArray,
        salaryRanges: {
          avg: calculateAvgSalary(filteredData)
        }
      },
    });
  } catch (error) {
    console.error("API Hatası:", error);
    return NextResponse.json(
      { success: false, error: "Veriler işlenirken bir hata oluştu." },
      { status: 500 }
    );
  }
} 