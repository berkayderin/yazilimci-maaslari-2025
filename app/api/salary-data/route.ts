import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

export interface SalaryData {
  level: string;
  position: string;
  tech_stack: string;
  experience: string;
  gender: string;
  company: string;
  company_size: string;
  work_type: string;
  city: string;
  currency: string;
  salary: string;
  raise_period: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const position = searchParams.get('position') || 'all';
    const level = searchParams.get('level') || 'all';
    const currency = searchParams.get('currency') || '₺ - Türk Lirası';
    
    const filePath = path.join(process.cwd(), 'public', 'data', 'yazilimci-maaslari.json');
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data: SalaryData[] = JSON.parse(fileContents);
    
    const filteredData = data.filter(item => {
      return (
        (position === 'all' || item.position === position) &&
        (level === 'all' || item.level === level) &&
        (currency === 'all' || item.currency === currency)
      );
    });

    const stats = {
      totalCount: filteredData.length,
      avgSalary: calculateAvgSalary(filteredData),
      positions: getUniqueValues(filteredData, 'position'),
      levels: getUniqueValues(filteredData, 'level'),
      currencies: getUniqueValues(filteredData, 'currency'),
    };
    
    return NextResponse.json({
      success: true,
      data: filteredData,
      stats,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Veri yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

function calculateAvgSalary(data: SalaryData[]): number {
  if (data.length === 0) return 0;
  
  let total = 0;
  
  data.forEach(item => {
    const salaryRange = item.salary.split(' - ');
    let avgSalary = 0;
    
    if (salaryRange.length > 1) {
      const min = parseFloat(salaryRange[0].replace(/\./g, '').replace(',', '.'));
      const max = parseFloat(salaryRange[1].replace(/\./g, '').replace(',', '.'));
      avgSalary = (min + max) / 2;
    } else {
      avgSalary = parseFloat(salaryRange[0].replace(/\./g, '').replace(',', '.'));
    }
    
    total += avgSalary;
  });
  
  return Math.round(total / data.length);
}

function getUniqueValues(data: SalaryData[], field: keyof SalaryData): string[] {
  const values = new Set<string>();
  
  data.forEach(item => {
    values.add(item[field]);
  });
  
  return Array.from(values);
} 