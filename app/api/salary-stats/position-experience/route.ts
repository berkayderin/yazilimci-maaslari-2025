import { NextResponse } from "next/server";
import salaryData from "@/public/data/yazilimci-maaslari.json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");
    const level = searchParams.get("level");

    let filteredData = [...salaryData];

    if (position && position !== "all") {
      filteredData = filteredData.filter((item) => item.position === position);
    }

    if (level && level !== "all") {
      filteredData = filteredData.filter((item) => item.level === level);
    }

    const positions = ["Back-end Developer", "Front-end Developer", "Full Stack Developer"];
    const experienceLevels = [
      "0 - 1 Yıl",
      "1 - 3 Yıl",
      "3 - 5 Yıl",
      "5 - 7 Yıl",
      "7 - 10 Yıl",
      "10 - 12 Yıl",
      "12 - 14 Yıl",
      "15 Yıl ve üzeri",
    ];

    const positionExperienceSalaries = positions.map((pos) => {
      const experienceData = experienceLevels.map((exp) => {
        const relevantData = filteredData.filter(
          (item) =>
            item.position === pos &&
            item.experience === exp &&
            item.currency === "₺ - Türk Lirası"
        );

        const avgSalary =
          relevantData.length > 0
            ? relevantData.reduce((sum, item) => {
                const salary = parseFloat(item.salary.split(" - ")[0].replace(/[.,]/g, ""));
                return sum + salary;
              }, 0) / relevantData.length
            : 0;

        return {
          experience: exp,
          salary: Math.round(avgSalary),
        };
      });

      return {
        position: pos,
        data: experienceData,
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        positionExperienceSalaries,
      },
    });
  } catch (error) {
    console.error("Veri işlenirken hata oluştu:", error);
    return NextResponse.json(
      { success: false, error: "Veri işlenirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 