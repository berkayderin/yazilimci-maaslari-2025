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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

  const COLORS = ["#3B82F6", "#E5E7EB"];
  const PRIMARY_COLOR = "#3B82F6";

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
    <div className="min-h-screen p-4 md:p-6 bg-white dark:bg-gray-950 font-sans">
      <header className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-medium mb-2 text-gray-900 dark:text-white tracking-tight">
          Yazılımcı Maaşları Analizi
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm">
          Türkiye ve yurt dışındaki yazılımcı maaşlarının analizi
        </p>
      </header>

      <div className="max-w-4xl mx-auto mb-10">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md mb-6">
          <h2 className="text-base font-medium mb-4 text-gray-800 dark:text-gray-200">
            Filtreler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-normal text-gray-500 dark:text-gray-400 mb-1">
                Pozisyon
              </label>
              <Select
                onValueChange={(value) =>
                  setFilter((prev) => ({ ...prev, position: value }))
                }
                defaultValue={filter.position}
              >
                <SelectTrigger className="w-full h-9 text-sm border-0 bg-white dark:bg-gray-800 shadow-none">
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
              <label className="block text-xs font-normal text-gray-500 dark:text-gray-400 mb-1">
                Seviye
              </label>
              <Select
                onValueChange={(value) =>
                  setFilter((prev) => ({ ...prev, level: value }))
                }
                defaultValue={filter.level}
              >
                <SelectTrigger className="w-full h-9 text-sm border-0 bg-white dark:bg-gray-800 shadow-none">
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
              <label className="block text-xs font-normal text-gray-500 dark:text-gray-400 mb-1">
                Para Birimi
              </label>
              <Select
                onValueChange={(value) =>
                  setFilter((prev) => ({ ...prev, currency: value }))
                }
                defaultValue={filter.currency}
              >
                <SelectTrigger className="w-full h-9 text-sm border-0 bg-white dark:bg-gray-800 shadow-none">
                  <SelectValue placeholder="Para birimi seçin" />
                </SelectTrigger>
                <SelectContent>
                  {options.currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency === "all" ? "Tüm Para Birimleri" : currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {stats && (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <Card className="overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-none">
              <CardHeader className="pb-1 border-b-0 pt-3 px-3">
                <CardTitle className="text-base text-gray-900 dark:text-white font-normal">
                  Ortalama Maaş
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-3 pb-3">
                <p className="text-2xl font-medium text-blue-500 dark:text-blue-400">
                  {new Intl.NumberFormat("tr-TR").format(
                    stats.salaryRanges.avg
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-none">
              <CardHeader className="pb-1 border-b-0 pt-3 px-3">
                <CardTitle className="text-base text-gray-900 dark:text-white font-normal">
                  Minimum Maaş
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-3 pb-3">
                <p className="text-2xl font-medium text-blue-500 dark:text-blue-400">
                  {new Intl.NumberFormat("tr-TR").format(
                    stats.salaryRanges.min
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-none">
              <CardHeader className="pb-1 border-b-0 pt-3 px-3">
                <CardTitle className="text-base text-gray-900 dark:text-white font-normal">
                  Maksimum Maaş
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-3 pb-3">
                <p className="text-2xl font-medium text-blue-500 dark:text-blue-400">
                  {new Intl.NumberFormat("tr-TR").format(
                    stats.salaryRanges.max
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-md p-4 mb-10">
            <Tabs defaultValue="position" className="w-full">
              <TabsList className="w-full mb-6 grid grid-cols-1 md:grid-cols-4 gap-1 bg-transparent">
                <TabsTrigger
                  value="position"
                  className="text-sm data-[state=active]:bg-gray-100 data-[state=active]:text-blue-500 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400"
                >
                  Pozisyona Göre
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="text-sm data-[state=active]:bg-gray-100 data-[state=active]:text-blue-500 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400"
                >
                  Deneyime Göre
                </TabsTrigger>
                <TabsTrigger
                  value="company"
                  className="text-sm data-[state=active]:bg-gray-100 data-[state=active]:text-blue-500 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400"
                >
                  Şirket Büyüklüğüne Göre
                </TabsTrigger>
                <TabsTrigger
                  value="worktype"
                  className="text-sm data-[state=active]:bg-gray-100 data-[state=active]:text-blue-500 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400"
                >
                  Çalışma Türüne Göre
                </TabsTrigger>
              </TabsList>

              <TabsContent value="position" className="mt-0">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-md mb-4">
                  <h3 className="text-base font-medium mb-1 text-gray-900 dark:text-white">
                    Pozisyona Göre Ortalama Maaş
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
                    Yazılım pozisyonlarında ortalama maaş dağılımı
                  </p>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.positionAverageSalary.slice(0, 8)}
                        margin={{ top: 10, right: 20, left: 20, bottom: 80 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#eee"
                          opacity={0.3}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: "#888" }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          tickMargin={20}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#888" }}
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
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "4px",
                            padding: "8px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                            border: "none",
                          }}
                          labelStyle={{
                            fontWeight: "normal",
                            marginBottom: "4px",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          name="Ortalama Maaş"
                          fill={PRIMARY_COLOR}
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="experience" className="mt-0">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-md mb-4">
                  <h3 className="text-base font-medium mb-1 text-gray-900 dark:text-white">
                    Deneyime Göre Maaş Dağılımı
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
                    Deneyim yılına göre maaş değişimi
                  </p>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={stats.experienceSalaryData}
                        margin={{ top: 10, right: 20, left: 20, bottom: 80 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#eee"
                          opacity={0.3}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: "#888" }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          tickMargin={20}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#888" }}
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
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "4px",
                            padding: "8px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                            border: "none",
                          }}
                          labelStyle={{
                            fontWeight: "normal",
                            marginBottom: "4px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="Ortalama Maaş"
                          stroke={PRIMARY_COLOR}
                          strokeWidth={2}
                          dot={{
                            r: 4,
                            fill: PRIMARY_COLOR,
                            strokeWidth: 0,
                          }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="company" className="mt-0">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-md mb-4">
                  <h3 className="text-base font-medium mb-1 text-gray-900 dark:text-white">
                    Şirket Büyüklüğüne Göre Maaş
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
                    Şirket büyüklüğüne göre ortalama maaş değişimi
                  </p>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.companySizeAvgSalary}
                        margin={{ top: 10, right: 20, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#eee"
                          opacity={0.3}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: "#888" }}
                          tickMargin={10}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#888" }}
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
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "4px",
                            padding: "8px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                            border: "none",
                          }}
                          labelStyle={{
                            fontWeight: "normal",
                            marginBottom: "4px",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          name="Ortalama Maaş"
                          fill={PRIMARY_COLOR}
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="worktype" className="mt-0">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-md mb-4">
                  <h3 className="text-base font-medium mb-1 text-gray-900 dark:text-white">
                    Çalışma Türüne Göre Dağılım
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
                    Remote, Ofis ve Hibrit çalışanların dağılımı
                  </p>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <Pie
                          data={stats.workTypeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          paddingAngle={1}
                        >
                          {stats.workTypeDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              stroke="none"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => `${value} kişi`}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "4px",
                            padding: "8px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                            border: "none",
                          }}
                          labelStyle={{
                            fontWeight: "normal",
                            marginBottom: "4px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      <footer className="max-w-4xl mx-auto mt-10 pb-4 text-center border-t border-gray-100 dark:border-gray-900 pt-4">
        <p className="text-gray-400 dark:text-gray-500 text-xs">
          Veri son güncelleme:{" "}
          {format(new Date(), "d MMMM yyyy", { locale: tr })}
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
          Veri kaynağı:{" "}
          <a
            href="https://github.com/oncekiyazilimci/2025-yazilim-sektoru-maaslari"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            github.com/oncekiyazilimci
          </a>
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
          Geliştirici:{" "}
          <a
            href="https://github.com/berkayderin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Berkay Derin
          </a>
        </p>
      </footer>
    </div>
  );
}
