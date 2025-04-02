import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { SalaryData } from '../salary-data/route';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'yazilimci-maaslari.json');
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data: SalaryData[] = JSON.parse(fileContents);
    
    const searchParams = request.nextUrl.searchParams;
    const position = searchParams.get('position') || 'all';
    const level = searchParams.get('level') || 'all';
    const currency = searchParams.get('currency') || '₺ - Türk Lirası';
    
    const filteredData = data.filter(item => {
      return (
        (position === 'all' || item.position === position) &&
        (level === 'all' || item.level === level) &&
        (currency === 'all' || item.currency === currency)
      );
    });
    
    const stats = {
      positionAverageSalary: calculatePositionAverageSalary(filteredData),
      
      experienceSalaryData: calculateExperienceSalaryData(filteredData),
      
      companySizeAvgSalary: calculateCompanySizeAvgSalary(filteredData),
      
      workTypeDistribution: calculateWorkTypeDistribution(filteredData),
      
      salaryRanges: {
        min: calculateMinSalary(filteredData),
        max: calculateMaxSalary(filteredData),
        avg: calculateAvgSalary(filteredData)
      }
    };
    
    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'İstatistikler hesaplanırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

function calculatePositionAverageSalary(data: SalaryData[]) {
  const positions: Record<string, { total: number; count: number }> = {};
  
  data.forEach(item => {
    const position = item.position;
    const salaryRange = item.salary.split(' - ');
    let avgSalary = 0;
    
    if (salaryRange.length > 1) {
      const min = parseFloat(salaryRange[0].replace(/[^0-9]/g, ''));
      const max = parseFloat(salaryRange[1].replace(/[^0-9]/g, ''));
      avgSalary = (min + max) / 2;
    } else {
      avgSalary = parseFloat(salaryRange[0].replace(/[^0-9]/g, ''));
    }
    
    if (!positions[position]) {
      positions[position] = { total: avgSalary, count: 1 };
    } else {
      positions[position].total += avgSalary;
      positions[position].count += 1;
    }
  });
  
  return Object.keys(positions).map(position => ({
    name: position,
    value: Math.round(positions[position].total / positions[position].count)
  })).sort((a, b) => b.value - a.value);
}

function calculateExperienceSalaryData(data: SalaryData[]) {
  const experienceLevels: Record<string, { total: number; count: number }> = {};
  
  data.forEach(item => {
    const experience = item.experience;
    const salaryRange = item.salary.split(' - ');
    let avgSalary = 0;
    
    if (salaryRange.length > 1) {
      const min = parseFloat(salaryRange[0].replace(/[^0-9]/g, ''));
      const max = parseFloat(salaryRange[1].replace(/[^0-9]/g, ''));
      avgSalary = (min + max) / 2;
    } else {
      avgSalary = parseFloat(salaryRange[0].replace(/[^0-9]/g, ''));
    }
    
    if (!experienceLevels[experience]) {
      experienceLevels[experience] = { total: avgSalary, count: 1 };
    } else {
      experienceLevels[experience].total += avgSalary;
      experienceLevels[experience].count += 1;
    }
  });
  
  return Object.keys(experienceLevels).map(exp => ({
    name: exp,
    value: Math.round(experienceLevels[exp].total / experienceLevels[exp].count)
  })).sort((a, b) => {
    const expOrder: Record<string, number> = {
      "0 - 1 Yıl": 1,
      "1 - 3 Yıl": 2,
      "3 - 5 Yıl": 3,
      "5 - 7 Yıl": 4,
      "7 - 10 Yıl": 5,
      "10 - 12 Yıl": 6,
      "12 - 14 Yıl": 7,
      "15 Yıl ve üzeri": 8
    };
    return expOrder[a.name] - expOrder[b.name];
  });
}

function calculateCompanySizeAvgSalary(data: SalaryData[]) {
  const sizes: Record<string, { total: number; count: number }> = {};
  
  data.forEach(item => {
    const size = item.company_size;
    const salaryRange = item.salary.split(' - ');
    let avgSalary = 0;
    
    if (salaryRange.length > 1) {
      const min = parseFloat(salaryRange[0].replace(/[^0-9]/g, ''));
      const max = parseFloat(salaryRange[1].replace(/[^0-9]/g, ''));
      avgSalary = (min + max) / 2;
    } else {
      avgSalary = parseFloat(salaryRange[0].replace(/[^0-9]/g, ''));
    }
    
    if (!sizes[size]) {
      sizes[size] = { total: avgSalary, count: 1 };
    } else {
      sizes[size].total += avgSalary;
      sizes[size].count += 1;
    }
  });
  
  return Object.keys(sizes).map(size => ({
    name: size,
    value: Math.round(sizes[size].total / sizes[size].count)
  })).sort((a, b) => {
    const sizeOrder: Record<string, number> = {
      "1 - 5 Kişi": 1,
      "6 - 10 Kişi": 2,
      "11 - 20 Kişi": 3,
      "21 - 50 Kişi": 4,
      "51 - 100 Kişi": 5,
      "101 - 249 Kişi": 6,
      "250+": 7
    };
    return sizeOrder[a.name] - sizeOrder[b.name];
  });
}

// Çalışma türüne göre dağılım hesaplama
function calculateWorkTypeDistribution(data: SalaryData[]) {
  const types: Record<string, number> = {};
  
  data.forEach(item => {
    const type = item.work_type;
    if (!types[type]) {
      types[type] = 1;
    } else {
      types[type] += 1;
    }
  });
  
  return Object.keys(types).map(type => ({
    name: type,
    value: types[type]
  }));
}

// Ortalama maaş hesaplama
function calculateAvgSalary(data: SalaryData[]): number {
  if (data.length === 0) return 0;
  
  let total = 0;
  
  data.forEach(item => {
    const salaryRange = item.salary.split(' - ');
    let avgSalary = 0;
    
    if (salaryRange.length > 1) {
      const min = parseFloat(salaryRange[0].replace(/[^0-9]/g, ''));
      const max = parseFloat(salaryRange[1].replace(/[^0-9]/g, ''));
      avgSalary = (min + max) / 2;
    } else {
      avgSalary = parseFloat(salaryRange[0].replace(/[^0-9]/g, ''));
    }
    
    total += avgSalary;
  });
  
  return Math.round(total / data.length);
}

function calculateMinSalary(data: SalaryData[]): number {
  if (data.length === 0) return 0;
  
  let minSalary = Infinity;
  
  data.forEach(item => {
    const salaryRange = item.salary.split(' - ');
    let salary = 0;
    
    if (salaryRange.length > 1) {
      salary = parseFloat(salaryRange[0].replace(/[^0-9]/g, ''));
    } else {
      salary = parseFloat(salaryRange[0].replace(/[^0-9]/g, ''));
    }
    
    if (salary < minSalary) {
      minSalary = salary;
    }
  });
  
  return Math.round(minSalary);
}

function calculateMaxSalary(data: SalaryData[]): number {
  if (data.length === 0) return 0;
  
  let maxSalary = 0;
  
  data.forEach(item => {
    const salaryRange = item.salary.split(' - ');
    let salary = 0;
    
    if (salaryRange.length > 1) {
      salary = parseFloat(salaryRange[1].replace(/[^0-9]/g, ''));
    } else {
      salary = parseFloat(salaryRange[0].replace(/[^0-9]/g, ''));
    }
    
    if (salary > maxSalary) {
      maxSalary = salary;
    }
  });
  
  return Math.round(maxSalary);
} 