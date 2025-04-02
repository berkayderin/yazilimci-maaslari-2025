"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { RotateCcw } from "lucide-react";

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
    cityAverageSalary: ChartData[];
    companyAverageSalary: ChartData[];
    techStackSalary: ChartData[];
    positionExperienceSalaries?: {
      position: string;
      data: {
        experience: string;
        salary: number;
      }[];
    }[];
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
  }>({
    positions: ["all"],
    levels: ["all"],
  });

  const handleReset = () => {
    setFilter({
      position: "all",
      level: "all",
      currency: "₺ - Türk Lirası",
    });
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch("/api/salary-data");
        const data = await response.json();

        if (data.success) {
          setOptions({
            positions: ["all", ...data.stats.positions],
            levels: ["all", ...data.stats.levels],
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

        const [statsResponse, techStackResponse, positionExpResponse] =
          await Promise.all([
            fetch(`/api/salary-stats?${params.toString()}`),
            fetch(`/api/salary-stats/tech-stack?${params.toString()}`),
            fetch(`/api/salary-stats/position-experience?${params.toString()}`),
          ]);

        const [statsData, techStackData, positionExpData] = await Promise.all([
          statsResponse.json(),
          techStackResponse.json(),
          positionExpResponse.json(),
        ]);

        if (
          statsData.success &&
          techStackData.success &&
          positionExpData.success
        ) {
          setStats({
            ...statsData.stats,
            techStackSalary: techStackData.stats.techStackSalary,
            positionExperienceSalaries:
              positionExpData.stats.positionExperienceSalaries,
          });
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="p-3 md:p-4">
        <header className="max-w-6xl mx-auto mb-4 text-center">
          <h1 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800 dark:text-white tracking-tight">
            Türkiye&apos;de Yazılımcı Maaşları 2025
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm">
            Türkiye&apos;deki yazılımcı maaşlarının kapsamlı analizi (Sadece
            Türk Lirası)
          </p>
        </header>

        <div className="max-w-6xl mx-auto mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Card className="md:col-span-3">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Filtreler
                    </CardTitle>
                    {(filter.position !== "all" || filter.level !== "all") && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Aktif filtreler uygulanıyor
                      </p>
                    )}
                  </div>
                  {(filter.position !== "all" || filter.level !== "all") && (
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 px-2.5 h-7 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Sıfırla
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Pozisyon
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setFilter((prev) => ({ ...prev, position: value }))
                      }
                      value={filter.position}
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
                      value={filter.level}
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
                </div>
              </CardContent>
            </Card>

            {stats && (
              <Card>
                <CardHeader className="pb-0 px-6 pt-4">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Ortalama Maaş
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pt-3">
                  <div className="flex flex-col">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getCurrencySymbol(filter.currency)}{" "}
                      {new Intl.NumberFormat("tr-TR").format(
                        stats.salaryRanges.avg
                      )}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>
                        {filter.position === "all"
                          ? "Tüm pozisyonlar"
                          : filter.position}
                      </span>
                      <span>•</span>
                      <span>
                        {filter.level === "all"
                          ? "Tüm seviyeler"
                          : filter.level}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {stats && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Pozisyona Göre Ortalama Maaş
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Yazılım pozisyonlarında ortalama maaş dağılımı
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={stats.positionAverageSalary.slice(0, 8)}
                        margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorValue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
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
                        <Area
                          type="monotone"
                          dataKey="value"
                          name="Ortalama Maaş"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorValue)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Deneyime Göre Maaş Dağılımı
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Deneyim yılına göre maaş değişimi
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px]">
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Şirket Büyüklüğüne Göre Maaş
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Şirket büyüklüğüne göre ortalama maaş değişimi
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.companySizeAvgSalary}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#eee"
                          opacity={0.3}
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10, fill: "#6b7280" }}
                          tickFormatter={(value) =>
                            new Intl.NumberFormat("tr-TR", {
                              notation: "compact",
                              compactDisplay: "short",
                            }).format(value)
                          }
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          tick={{ fontSize: 10, fill: "#6b7280" }}
                          width={100}
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
                          radius={[0, 2, 2, 0]}
                        >
                          {stats.companySizeAvgSalary.map((entry, index) => {
                            const colors = [
                              "#1e40af",
                              "#2563eb",
                              "#3b82f6",
                              "#60a5fa",
                              "#93c5fd",
                              "#bfdbfe",
                              "#dbeafe",
                            ];

                            return (
                              <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Çalışma Türüne Göre Dağılım
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Remote, Ofis ve Hibrit çalışanların dağılımı
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.workTypeDistribution}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#eee"
                          opacity={0.3}
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10, fill: "#6b7280" }}
                          tickFormatter={(value) =>
                            new Intl.NumberFormat("tr-TR", {
                              notation: "compact",
                              compactDisplay: "short",
                            }).format(value)
                          }
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          tick={{ fontSize: 10, fill: "#6b7280" }}
                          width={100}
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
                          name="Çalışan Sayısı"
                          fill="#3b82f6"
                          radius={[0, 2, 2, 0]}
                        >
                          {stats.workTypeDistribution.map((entry, index) => {
                            const colors = [
                              "#1e40af", // En koyu mavi
                              "#2563eb",
                              "#3b82f6",
                              "#60a5fa",
                              "#93c5fd", // En açık mavi
                            ];

                            return (
                              <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Şehirlere Göre Maaş Dağılımı
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    En yüksek ortalama maaşa sahip 10 şehir
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.cityAverageSalary}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#eee"
                          opacity={0.3}
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10, fill: "#6b7280" }}
                          tickFormatter={(value) =>
                            new Intl.NumberFormat("tr-TR", {
                              notation: "compact",
                              compactDisplay: "short",
                            }).format(value)
                          }
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          tick={{ fontSize: 10, fill: "#6b7280" }}
                          width={100}
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
                          radius={[0, 2, 2, 0]}
                        >
                          {stats.cityAverageSalary.map((entry, index) => {
                            const colors = [
                              "#1e40af",
                              "#2563eb",
                              "#3b82f6",
                              "#60a5fa",
                              "#93c5fd",
                            ];

                            return (
                              <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Şirketlere Göre Maaş Dağılımı
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    En yüksek ortalama maaşa sahip 10 şirket
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.companyAverageSalary}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#eee"
                          opacity={0.3}
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10, fill: "#6b7280" }}
                          tickFormatter={(value) =>
                            new Intl.NumberFormat("tr-TR", {
                              notation: "compact",
                              compactDisplay: "short",
                            }).format(value)
                          }
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          tick={{ fontSize: 10, fill: "#6b7280" }}
                          width={100}
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
                          radius={[0, 2, 2, 0]}
                        >
                          {stats.companyAverageSalary.map((entry, index) => {
                            const colors = [
                              "#1e40af",
                              "#2563eb",
                              "#3b82f6",
                              "#60a5fa",
                              "#93c5fd",
                            ];

                            return (
                              <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Teknolojilere Göre Maaş Dağılımı
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Yazılım dillerine ve teknolojilere göre ortalama maaş
                    dağılımı
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.techStackSalary}
                        layout="horizontal"
                        margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#eee"
                          opacity={0.3}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 12,
                            fill: "#374151",
                            fontWeight: 500,
                          }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={0}
                        />
                        <YAxis
                          type="number"
                          tick={{ fontSize: 11, fill: "#6b7280" }}
                          tickFormatter={(value) =>
                            new Intl.NumberFormat("tr-TR", {
                              notation: "compact",
                              compactDisplay: "short",
                            }).format(value)
                          }
                          domain={[0, "dataMax"]}
                        />
                        <Tooltip
                          formatter={(value: number) =>
                            `${new Intl.NumberFormat("tr-TR").format(value)} ₺`
                          }
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.97)",
                            borderRadius: "6px",
                            padding: "8px 12px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                            border: "none",
                            fontSize: "12px",
                          }}
                          labelStyle={{
                            fontWeight: "600",
                            marginBottom: "6px",
                            fontSize: "13px",
                          }}
                          cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                        />
                        <Bar
                          dataKey="value"
                          name="Ortalama Maaş"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                          barSize={32}
                        >
                          {stats.techStackSalary.map((entry, index) => {
                            const colors = [
                              "#1e40af", // En koyu mavi
                              "#1d4ed8",
                              "#2563eb",
                              "#3b82f6",
                              "#60a5fa", // En açık mavi
                            ];

                            return (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  colors[
                                    Math.floor(
                                      (index / stats.techStackSalary.length) *
                                        colors.length
                                    )
                                  ]
                                }
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Pozisyonlara ve Deneyime Göre Maaş Dağılımı
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Backend, Frontend ve Full Stack pozisyonlarının deneyime
                    göre maaş değişimi
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        margin={{ top: 20, right: 30, left: 30, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="experience"
                          type="category"
                          allowDuplicatedCategory={false}
                          tick={{ fontSize: 11, fill: "#6b7280" }}
                        />
                        <YAxis
                          tickFormatter={(value) =>
                            new Intl.NumberFormat("tr-TR", {
                              notation: "compact",
                              compactDisplay: "short",
                            }).format(value)
                          }
                          tick={{ fontSize: 11, fill: "#6b7280" }}
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
                        />
                        <Legend />
                        {stats?.positionExperienceSalaries?.map(
                          (position, index) => {
                            const colors = ["#2563eb", "#16a34a", "#dc2626"];
                            return (
                              <Line
                                key={position.position}
                                data={position.data}
                                dataKey="salary"
                                name={position.position}
                                stroke={colors[index]}
                                strokeWidth={2}
                                dot={{ fill: colors[index], r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                              />
                            );
                          }
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <footer className="max-w-6xl mx-auto pb-4 text-center border-t border-gray-200 dark:border-gray-700 pt-2">
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
            Kaynak
          </a>{" "}
          &middot;{" "}
          <a
            href="https://github.com/berkayderin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            Sofware Engineer
          </a>
        </p>
      </footer>
    </div>
  );
}
