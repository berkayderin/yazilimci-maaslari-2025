"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartData {
  name: string;
  value: number;
}

interface StatsResponse {
  success: boolean;
  stats: {
    positionAverageSalary: ChartData[];
    experienceSalaryData: ChartData[];
    companySizeAvgSalary: ChartData[];
    workTypeDistribution: ChartData[];
    salaryRanges: {
      min: number;
      max: number;
      avg: number;
    };
  };
}

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsResponse["stats"] | null>(null);
  const [filter, setFilter] = useState({
    position: "all",
    level: "all",
    currency: "₺ - Türk Lirası",
  });
  const [options, setOptions] = useState<{
    positions: string[];
    levels: string[];
    currencies: string[];
  }>({
    positions: ["all"],
    levels: ["all"],
    currencies: ["all"],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch("/api/salary-data");
        const data = await response.json();

        if (data.success) {
          setOptions({
            positions: ["all", ...data.stats.positions],
            levels: ["all", ...data.stats.levels],
            currencies: ["all", ...data.stats.currencies],
          });
        }
      } catch (err) {
        console.error("Seçenekler yüklenirken bir hata oluştu:", err);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter.position !== "all")
          params.append("position", filter.position);
        if (filter.level !== "all") params.append("level", filter.level);
        if (filter.currency !== "all")
          params.append("currency", filter.currency);

        const response = await fetch(`/api/salary-stats?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setStats(data.stats);
        } else {
          setError("İstatistikler yüklenirken bir hata oluştu.");
        }
      } catch (err) {
        console.error("İstatistikler yüklenirken bir hata oluştu:", err);
        setError("İstatistikler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [filter]);

  const getCurrencySymbol = (currencyString: string) => {
    if (currencyString === "all") return "";
    return currencyString.split(" ")[0];
  };

  if (loading && !stats)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-white dark:bg-gray-950">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
        <p className="text-sm font-normal text-gray-700 dark:text-gray-300">
          Veriler yükleniyor...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-white dark:bg-gray-950">
        <div className="p-4 max-w-md text-center">
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
            {error}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
            Lütfen daha sonra tekrar deneyin.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );

  return (
    <div className="p-3 md:p-4 bg-gray-50 dark:bg-gray-900 font-sans">
      <header className="max-w-6xl mx-auto mb-4 text-center">
        <h1 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800 dark:text-white tracking-tight">
          Yazılımcı Maaşları Analizi
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm">
          Türkiye ve yurt dışındaki yazılımcı maaşlarının analizi
        </p>
      </header>

      <div className="max-w-6xl mx-auto mb-4">
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4">
          <h2 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-200">
            Filtreler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Pozisyon
              </label>
              <Select
                onValueChange={(value) =>
                  setFilter((prev) => ({ ...prev, position: value }))
                }
                defaultValue={filter.position}
              >
                <SelectTrigger className="w-full h-8 text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-none focus:ring-1 focus:ring-blue-500">
                  <SelectValue placeholder="Pozisyon seçin" />
                </SelectTrigger>
                <SelectContent>
                  {options.positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position === "all" ? "Tüm Pozisyonlar" : position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Seviye
              </label>
              <Select
                onValueChange={(value) =>
                  setFilter((prev) => ({ ...prev, level: value }))
                }
                defaultValue={filter.level}
              >
                <SelectTrigger className="w-full h-8 text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-none focus:ring-1 focus:ring-blue-500">
                  <SelectValue placeholder="Seviye seçin" />
                </SelectTrigger>
                <SelectContent>
                  {options.levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level === "all" ? "Tüm Seviyeler" : level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Para Birimi
              </label>
              <Select
                onValueChange={(value) =>
                  setFilter((prev) => ({ ...prev, currency: value }))
                }
                defaultValue={filter.currency}
              >
                <SelectTrigger className="w-full h-8 text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-none focus:ring-1 focus:ring-blue-500">
                  <SelectValue placeholder="Para birimi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Para Birimleri</SelectItem>
                  <SelectItem value="₺ - Türk Lirası">
                    ₺ - Türk Lirası
                  </SelectItem>
                  <SelectItem value="$ - Dolar">$ - Dolar</SelectItem>
                  <SelectItem value="€ - Euro">€ - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {stats && (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="pb-2 border-b-0 pt-3 px-3">
                <CardTitle className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                  Ortalama Maaş
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {getCurrencySymbol(filter.currency)}{" "}
                  {new Intl.NumberFormat("tr-TR").format(
                    stats.salaryRanges.avg
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="pb-2 border-b-0 pt-3 px-3">
                <CardTitle className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                  Minimum Maaş
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {getCurrencySymbol(filter.currency)}{" "}
                  {new Intl.NumberFormat("tr-TR").format(
                    stats.salaryRanges.min
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="pb-2 border-b-0 pt-3 px-3">
                <CardTitle className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                  Maksimum Maaş
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {getCurrencySymbol(filter.currency)}{" "}
                  {new Intl.NumberFormat("tr-TR").format(
                    stats.salaryRanges.max
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
              <h3 className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                Pozisyona Göre Ortalama Maaş
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                Yazılım pozisyonlarında ortalama maaş dağılımı
              </p>
              <div className="h-[210px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.positionAverageSalary.slice(0, 8)}
                    margin={{ top: 5, right: 10, left: 10, bottom: 50 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#eee"
                      opacity={0.3}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tickMargin={10}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("tr-TR", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(value)
                      }
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat("tr-TR").format(value)
                      }
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.97)",
                        borderRadius: "4px",
                        padding: "6px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        border: "none",
                        fontSize: "12px",
                      }}
                      labelStyle={{
                        fontWeight: "500",
                        marginBottom: "4px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      name="Ortalama Maaş"
                      fill="#3b82f6"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
              <h3 className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                Deneyime Göre Maaş Dağılımı
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                Deneyim yılına göre maaş değişimi
              </p>
              <div className="h-[210px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.experienceSalaryData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 50 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#eee"
                      opacity={0.3}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tickMargin={10}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("tr-TR", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(value)
                      }
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat("tr-TR").format(value)
                      }
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.97)",
                        borderRadius: "4px",
                        padding: "6px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        border: "none",
                        fontSize: "12px",
                      }}
                      labelStyle={{
                        fontWeight: "500",
                        marginBottom: "4px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Ortalama Maaş"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{
                        r: 3,
                        fill: "#3b82f6",
                        strokeWidth: 0,
                      }}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
              <h3 className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                Şirket Büyüklüğüne Göre Maaş
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                Şirket büyüklüğüne göre ortalama maaş değişimi
              </p>
              <div className="h-[210px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.companySizeAvgSalary}
                    margin={{ top: 5, right: 10, left: 10, bottom: 25 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#eee"
                      opacity={0.3}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      tickMargin={5}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("tr-TR", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(value)
                      }
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat("tr-TR").format(value)
                      }
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.97)",
                        borderRadius: "4px",
                        padding: "6px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        border: "none",
                        fontSize: "12px",
                      }}
                      labelStyle={{
                        fontWeight: "500",
                        marginBottom: "4px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      name="Ortalama Maaş"
                      fill="#3b82f6"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
              <h3 className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                Çalışma Türüne Göre Dağılım
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                Remote, Ofis ve Hibrit çalışanların dağılımı
              </p>
              <div className="h-[210px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <Pie
                      data={stats.workTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name.split(" ")[0]}: ${(percent * 100).toFixed(0)}%`
                      }
                      paddingAngle={2}
                    >
                      {stats.workTypeDistribution.map((entry, index) => {
                        // Çalışma türlerine göre renk ataması
                        const colors = {
                          Remote: "#3b82f6", // Mavi
                          Ofis: "#ef4444", // Kırmızı
                          Hibrit: "#10b981", // Yeşil
                          Şu: "#f59e0b", // Turuncu - "Şu an" ile başlayan ifadeler için
                        };

                        // Çalışma türüne göre renk seç
                        const colorKey =
                          (Object.keys(colors).find((key) =>
                            entry.name.startsWith(key)
                          ) as keyof typeof colors) ||
                          ("Remote" as keyof typeof colors);

                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[colorKey]}
                            stroke="#fff"
                            strokeWidth={1}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `${value} kişi`}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.97)",
                        borderRadius: "4px",
                        padding: "6px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        border: "none",
                        fontSize: "12px",
                      }}
                      labelStyle={{
                        fontWeight: "500",
                        marginBottom: "4px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-6xl mx-auto pb-2 text-center border-t border-gray-200 dark:border-gray-700 pt-2">
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          Veri son güncelleme:{" "}
          {format(new Date(), "d MMMM yyyy", { locale: tr })}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
          <a
            href="https://github.com/oncekiyazilimci/2025-yazilim-sektoru-maaslari"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            Veri Kaynağı
          </a>{" "}
          &middot;{" "}
          <a
            href="https://github.com/berkayderin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            Geliştirici
          </a>
        </p>
      </footer>
    </div>
  );
}
