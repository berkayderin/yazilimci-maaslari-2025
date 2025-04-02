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
  tech_stack?: string;
}

// İzin verilen teknolojiler listesi
const ALLOWED_TECHNOLOGIES = [
  {
    name: ".Net",
    aliases: [".net", "dotnet", "asp.net"]
  },
  {
    name: "Java",
    aliases: ["java"]
  },
  {
    name: "JavaScript | HTML | CSS",
    aliases: ["javascript", "html", "css", "js"]
  },
  {
    name: "React",
    aliases: ["react", "reactjs"]
  },
  {
    name: "NextJS",
    aliases: ["Nextjs", "Next", "Next.js"]
  },
  {
    name: "Python",
    aliases: ["python"]
  },
  {
    name: "NodeJS",
    aliases: ["node", "node.js", "nodejs"]
  },
  {
    name: "Angular",
    aliases: ["angular", "angularjs"]
  },
  {
    name: "Vue",
    aliases: ["vue", "vue.js", "vuejs"]
  },
  {
    name: "C / C++",
    aliases: ["c++", "c"]
  },
  {
    name: "PHP",
    aliases: ["php"]
  },
  {
    name: "React Native",
    aliases: ["react native", "react-native", "React Native"]
  },
  {
    name: "Kotlin",
    aliases: ["kotlin"]
  },
  {
    name: "Go",
    aliases: ["go", "golang"]
  },
  {
    name: "Swift",
    aliases: ["swift"]
  },
  {
    name: "Flutter",
    aliases: ["flutter"]
  },
  {
    name: "Unity",
    aliases: ["unity"]
  },
  {
    name: "Objective C",
    aliases: ["objective c", "objective-c", "objectivec"]
  },
  {
    name: "SQL",
    aliases: ["sql", "mysql", "postgresql", "mssql"]
  },
  {
    name: "NoSQL",
    aliases: ["nosql", "mongodb", "mongo", "mongoDB"]
  },
  {
    name: "Ruby",
    aliases: ["ruby", "ruby on rails", "rails"]
  },
  {
    name: "SAP / ABAP",
    aliases: ["abap", "ABAP", "SAP", "Sap"]
  }
];

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

    // Tech stack'e göre maaş dağılımı
    const techStackSalary = filteredData.reduce((acc: { [key: string]: { total: number; count: number } }, item) => {
      if (item.tech_stack && item.salary) {
        const salary = parseFloat(item.salary.replace(/\./g, "").replace(",", "."));
        if (!isNaN(salary)) {
          // Virgülle ayrılmış teknolojileri diziye çeviriyoruz
          const technologies = item.tech_stack.split(",").map(tech => tech.trim().toLowerCase());
          
          technologies.forEach((tech) => {
            // Her bir teknoloji için izin verilen teknolojileri kontrol et
            ALLOWED_TECHNOLOGIES.forEach(allowedTech => {
              if (allowedTech.aliases.some(alias => tech.includes(alias))) {
                if (!acc[allowedTech.name]) {
                  acc[allowedTech.name] = { total: 0, count: 0 };
                }
                acc[allowedTech.name].total += salary;
                acc[allowedTech.name].count += 1;
              }
            });
          });
        }
      }
      return acc;
    }, {});

    const techStackSalaryArray = Object.entries(techStackSalary)
      .map(([name, { total, count }]) => ({
        name,
        value: Math.round(total / count),
      }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json({
      success: true,
      stats: {
        techStackSalary: techStackSalaryArray,
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