import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Filter, ChevronDown, Users, GraduationCap, AlertCircle, Calendar, Search, FileDown, FileText, Eye, Download, SearchX, Folder, ChevronRight, ArrowLeft, Home, X, CheckCircle2, XCircle, Clock, Info, CalendarDays, CalendarRange, Layers, AlertTriangle } from 'lucide-react';
import { PageHeader, containerVariants } from '../components/UI';
import { CustomCalendar } from '../src/components/CustomCalendar';
import { MOCK_USERS, EDUCATIONAL_STRUCTURE } from '../constants';
import { ModuleProps } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportHistoryItem {
  id: number;
  type: string;
  title: string;
  date: string;
  level: string;
  grade: string;
  section: string;
  size: string;
  progress: number;
}

const REPORT_TYPES = ['Diario', 'Semanal', 'Mensual', 'Bimestral'];

const MOCK_REPORTS_HISTORY: ReportHistoryItem[] = (() => {
  const reports: ReportHistoryItem[] = [];
  let id = 1;
  
  REPORT_TYPES.forEach(type => {
    Object.entries(EDUCATIONAL_STRUCTURE).forEach(([level, grades]) => {
      Object.entries(grades).forEach(([grade, sections]) => {
        sections.forEach(section => {
          if (type === 'Diario') {
            const days = [
              { day: 'Lunes 16', date: '16 mar 2026' },
              { day: 'Martes 17', date: '17 mar 2026' },
              { day: 'Miércoles 18', date: '18 mar 2026' },
              { day: 'Jueves 19', date: '19 mar 2026' },
              { day: 'Viernes 20', date: '20 mar 2026' },
              { day: 'Lunes 23', date: '23 mar 2026' },
              { day: 'Martes 24', date: '24 mar 2026' },
              { day: 'Miércoles 25', date: '25 mar 2026' },
              { day: 'Jueves 26', date: '26 mar 2026' },
              { day: 'Viernes 27', date: '27 mar 2026' },
              { day: 'Lunes 30', date: '30 mar 2026' },
              { day: 'Martes 31', date: '31 mar 2026' }
            ];
            days.forEach(({ day, date }) => {
              reports.push({
                id: id++,
                type,
                title: day,
                date,
                level,
                grade,
                section,
                size: `${(Math.random() * 1 + 0.5).toFixed(1)} MB`,
                progress: Math.floor(Math.random() * 30) + 70
              });
            });
          } else if (type === 'Semanal') {
            const weeks = [
              { title: 'Semana 12', date: 'Marzo 2026' },
              { title: 'Semana 13', date: 'Marzo 2026' },
              { title: 'Semana 14', date: 'Marzo 2026' }
            ];
            weeks.forEach(week => {
              reports.push({
                id: id++,
                type,
                title: week.title,
                date: week.date,
                level,
                grade,
                section,
                size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
                progress: Math.floor(Math.random() * 30) + 70
              });
            });
          } else if (type === 'Mensual') {
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            months.forEach(month => {
              reports.push({
                id: id++,
                type,
                title: month,
                date: `${month} 2026`,
                level,
                grade,
                section,
                size: `${(Math.random() * 3 + 2).toFixed(1)} MB`,
                progress: Math.floor(Math.random() * 30) + 70
              });
            });
          } else if (type === 'Bimestral') {
            const bimesters = [
              { title: 'I Bimestre', date: '16-03-2026 al 15-05-2026' },
              { title: 'II Bimestre', date: '25-05-2026 al 24-07-2026' },
              { title: 'III Bimestre', date: '10-08-2026 al 09-10-2026' },
              { title: 'IV Bimestre', date: '19-10-2026 al 18-12-2026' }
            ];
            bimesters.forEach(bimester => {
              reports.push({
                id: id++,
                type,
                title: bimester.title,
                date: bimester.date,
                level,
                grade,
                section,
                size: `${(Math.random() * 5 + 3).toFixed(1)} MB`,
                progress: Math.floor(Math.random() * 30) + 70
              });
            });
          }
        });
      });
    });
  });
  return reports;
})();

export const getFolderStyle = (folderName: string, isReportsModule: boolean = false) => {
  const renderIcon = (IconComponent: any) => (
    <IconComponent size={32} strokeWidth={2.5} />
  );

  switch (folderName) {
    case 'Diario':
      return {
        icon: renderIcon(CalendarDays),
        colorClass: 'text-blue-600 dark:text-blue-400',
        bgClass: 'bg-blue-50 dark:bg-blue-900/20',
        borderClass: 'hover:border-blue-200 dark:hover:border-blue-800',
        cardBorderClass: 'border-blue-400 dark:border-blue-500',
        topBgClass: 'bg-[#e0f0ff] dark:bg-blue-900/40',
        bottomBgClass: 'bg-[#f0f8ff] dark:bg-blue-900/20',
        subtitle: 'Reportes por día'
      };
    case 'Semanal':
      return {
        icon: renderIcon(CalendarDays),
        colorClass: 'text-emerald-600 dark:text-emerald-400',
        bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
        borderClass: 'hover:border-emerald-200 dark:hover:border-emerald-800',
        cardBorderClass: 'border-emerald-400 dark:border-emerald-500',
        topBgClass: 'bg-[#e0f5e8] dark:bg-emerald-900/40',
        bottomBgClass: 'bg-[#f0fdf4] dark:bg-emerald-900/20',
        subtitle: 'Reportes por semana'
      };
    case 'Mensual':
      return {
        icon: renderIcon(CalendarDays),
        colorClass: 'text-purple-600 dark:text-purple-400',
        bgClass: 'bg-purple-50 dark:bg-purple-900/20',
        borderClass: 'hover:border-purple-200 dark:hover:border-purple-800',
        cardBorderClass: 'border-purple-400 dark:border-purple-500',
        topBgClass: 'bg-[#ede9fe] dark:bg-purple-900/40',
        bottomBgClass: 'bg-[#f5f3ff] dark:bg-purple-900/20',
        subtitle: 'Reportes por mes'
      };
    case 'Bimestral':
      return {
        icon: renderIcon(CalendarDays),
        colorClass: 'text-orange-600 dark:text-orange-400',
        bgClass: 'bg-orange-50 dark:bg-orange-900/20',
        borderClass: 'hover:border-orange-200 dark:hover:border-orange-800',
        cardBorderClass: 'border-orange-400 dark:border-orange-500',
        topBgClass: 'bg-[#ffedd5] dark:bg-orange-900/40',
        bottomBgClass: 'bg-[#fff7ed] dark:bg-orange-900/20',
        subtitle: 'Reportes por bimestre'
      };
    default:
      return {
        icon: renderIcon(Folder),
        colorClass: 'text-gray-600 dark:text-gray-400',
        bgClass: 'bg-gray-50 dark:bg-gray-800',
        borderClass: 'hover:border-gray-200 dark:hover:border-gray-700',
        cardBorderClass: 'border-gray-300 dark:border-gray-600',
        topBgClass: 'bg-gray-100 dark:bg-gray-800',
        bottomBgClass: 'bg-gray-50 dark:bg-gray-900',
        subtitle: 'Carpeta'
      };
  }
};

export const ReportPreviewModal = ({ report, onClose }: { report: ReportHistoryItem, onClose: () => void }) => {
  // Generate some mock data based on the report
  const totalStudents = 26;
  const asistieron = 21;
  const faltaron = 2;
  const tardanzas = 1;
  const justificadas = 2;
  const pctAsistencia = Math.round((asistieron / totalStudents) * 100);

  // Mock students list
  const students = Array.from({ length: 15 }).map((_, i) => {
    let state = 'Asistió';
    let color = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    let dot = 'bg-emerald-500';
    
    if (i === 3 || i === 7) {
      state = 'Faltó';
      color = 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      dot = 'bg-rose-500';
    } else if (i === 5) {
      state = 'Tardanza';
      color = 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      dot = 'bg-orange-500';
    } else if (i === 9 || i === 12) {
      state = 'Justificada';
      color = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      dot = 'bg-blue-500';
    }

    return {
      id: i,
      name: `Estudiante ${i + 1}`,
      state,
      color,
      dot,
      ingreso: state === 'Faltó' || state === 'Justificada' ? '-' : (state === 'Tardanza' ? '08:15 AM' : '07:45 AM'),
      salida: state === 'Faltó' || state === 'Justificada' ? '-' : '02:00 PM'
    };
  });

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(report.title, 14, 22);
    doc.setFontSize(11);
    doc.text(`${report.date} | ${report.level} - ${report.grade} ${report.section}`, 14, 30);
    
    autoTable(doc, {
      startY: 40,
      head: [['Estudiante', 'Estado', 'Hora Ingreso', 'Hora Salida']],
      body: students.map(s => [s.name, s.state, s.ingreso, s.salida]),
    });
    
    doc.save(`${report.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{report.title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span className="flex items-center gap-1"><Calendar size={14} /> {report.date}</span>
                <span className="text-gray-300 dark:text-slate-700">|</span>
                <span className="flex items-center gap-1"><Users size={14} /> {report.level} - {report.grade.replace(' Grado', '')} {report.section}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="w-10 h-10 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors tooltip-trigger" title="Descargar PDF">
              <Download size={20} />
            </button>
            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Chart Section */}
          <div className="border border-gray-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="relative w-48 h-48">
              {/* SVG Donut Chart */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-gray-100 dark:text-slate-800" strokeWidth="12" />
                {/* Asistieron */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray={`${(asistieron/totalStudents)*251.2} 251.2`} />
                {/* Faltaron */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f43f5e" strokeWidth="12" strokeDasharray={`${(faltaron/totalStudents)*251.2} 251.2`} strokeDashoffset={`-${(asistieron/totalStudents)*251.2}`} />
                {/* Tardanzas */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="12" strokeDasharray={`${(tardanzas/totalStudents)*251.2} 251.2`} strokeDashoffset={`-${((asistieron+faltaron)/totalStudents)*251.2}`} />
                {/* Justificadas */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray={`${(justificadas/totalStudents)*251.2} 251.2`} strokeDashoffset={`-${((asistieron+faltaron+tardanzas)/totalStudents)*251.2}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-gray-900 dark:text-white">{pctAsistencia}%</span>
                <span className="text-[10px] font-bold text-gray-400 tracking-widest">ASISTENCIA</span>
              </div>
            </div>
            
            <div className="space-y-4 min-w-[200px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">ASISTIÓ</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{asistieron}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">FALTAS</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{faltaron}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">TARDANZAS</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{tardanzas}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">JUSTIFICADAS</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{justificadas}</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 font-bold text-xs tracking-wider">
                <tr>
                  <th className="p-4">ESTUDIANTE</th>
                  <th className="p-4">ESTADO</th>
                  <th className="p-4">HORA DE INGRESO</th>
                  <th className="p-4">HORA DE SALIDA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-bold text-gray-900 dark:text-white">{student.name}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${student.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${student.dot}`}></span>
                        {student.state}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{student.ingreso}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{student.salida}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ReportsModule: React.FC<ModuleProps> = () => {
  const [activeTab, setActiveTab] = useState<'generar' | 'historial'>('generar');
  const [historyPath, setHistoryPath] = useState<string[]>([]);
  const [previewReport, setPreviewReport] = useState<ReportHistoryItem | null>(null);
  
  // --- Estados de Filtros ---
  const [periodo, setPeriodo] = useState('Mensual');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const week = Math.ceil(Math.floor((d.getTime() - new Date(year, 0, 1).getTime()) / (24 * 60 * 60 * 1000)) / 7);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  });
  const [selectedBimestre, setSelectedBimestre] = useState('1');
  const [userType, setUserType] = useState<'Estudiante' | 'Docente'>('Estudiante');
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  // Filtros de Aula (Cascada)
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Actualizar filtros en cascada
  useEffect(() => {
    if (selectedLevel === 'Todos') {
      setSelectedGrade('Todos');
      setSelectedSection('Todos');
      return;
    }
    const grades = Object.keys(EDUCATIONAL_STRUCTURE[selectedLevel] || {});
    if (grades.length > 0 && selectedGrade !== 'Todos') {
      // No forzar si ya es algo válido o si queremos mantener 'Todos'
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedGrade === 'Todos') {
      setSelectedSection('Todos');
      return;
    }
    // @ts-ignore
    const sections = EDUCATIONAL_STRUCTURE[selectedLevel]?.[selectedGrade] || [];
    if (sections.length > 0 && selectedSection !== 'Todos') {
      // No forzar
    }
  }, [selectedGrade, selectedLevel]);

  const gradeOptions = useMemo(() => {
    if (selectedLevel === 'Todos') return ['Todos'];
    return ['Todos', ...Object.keys(EDUCATIONAL_STRUCTURE[selectedLevel] || {})];
  }, [selectedLevel]);

  const sectionOptions = useMemo(() => {
    if (selectedLevel === 'Todos' || selectedGrade === 'Todos') return ['Todos'];
    // @ts-ignore
    return ['Todos', ...(EDUCATIONAL_STRUCTURE[selectedLevel]?.[selectedGrade] || [])];
  }, [selectedLevel, selectedGrade]);

  // --- Generación de Datos de Asistencia (Simulación) ---
  
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDayLabel = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);
    const dayOfWeek = date.getDay(); // 0 = Dom, 1 = Lun, etc.
    const labels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    return labels[dayOfWeek];
  };

  const filteredUsers = useMemo(() => {
    if (userType === 'Estudiante' && selectedLevel === '') return [];
    return MOCK_USERS.filter(u => 
      u.role === userType &&
      (userType === 'Docente' ? true : ( 
        (selectedLevel === 'Todos' || u.level === selectedLevel) &&
        (selectedGrade === 'Todos' || u.grade === selectedGrade) &&
        (selectedSection === 'Todos' || u.section === selectedSection)
      )) &&
      (search === '' || u.name.toLowerCase().includes(search.toLowerCase()) || u.dni.includes(search))
    );
  }, [userType, selectedLevel, selectedGrade, selectedSection, search]);

  const attendanceData = useMemo(() => {
    return filteredUsers.map(user => {
      const statuses: string[] = [];
      let tardanzas = 0;
      let faltas = 0;
      let asistencias = 0;
      let justificadas = 0;

      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(selectedYear, selectedMonth, i);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        if (isWeekend) {
          statuses.push(''); 
        } else {
          const rand = Math.random();
          if (rand > 0.92) { statuses.push('F'); faltas++; }
          else if (rand > 0.85) { statuses.push('T'); tardanzas++; }
          else if (rand > 0.80) { statuses.push('J'); justificadas++; } 
          else { statuses.push('A'); asistencias++; }
        }
      }
      return { ...user, statuses, stats: { tardanzas, faltas, asistencias, justificadas } };
    });
  }, [filteredUsers, selectedMonth, selectedYear, daysInMonth]);

  // Estadísticas Globales para el Gráfico
  const stats = useMemo(() => {
    let t = 0, f = 0, a = 0, j = 0;
    attendanceData.forEach(d => {
      t += d.stats.tardanzas;
      f += d.stats.faltas;
      a += d.stats.asistencias;
      j += d.stats.justificadas;
    });
    const total = t + f + a + j || 1; 
    
    return { 
      tardanzas: t, 
      faltas: f, 
      asistencias: a, 
      justificadas: j,
      total 
    };
  }, [attendanceData]);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;

    // Función para dibujar una tabla para un grupo específico
    const drawTableForGroup = (users: any[], level: string, grade: string, section: string, startY: number) => {
      // Header de la tabla de grupo
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      
      // Dibujar cuadro de info
      doc.setDrawColor(0);
      doc.setLineWidth(0.2);
      doc.rect(margin, startY, pageWidth - (margin * 2), 15);
      
      doc.text(`TIPO: ${userType.toUpperCase()}S`, margin + 5, startY + 10);
      doc.text(`NIVEL: ${level.toUpperCase()}`, margin + 60, startY + 10);
      doc.text(`GRADO: ${grade.toUpperCase()}`, margin + 110, startY + 10);
      doc.text(`SECCIÓN: ${section.toUpperCase()}`, margin + 160, startY + 10);
      doc.text(`MES: ${monthNames[selectedMonth].toUpperCase()} ${selectedYear}`, margin + 220, startY + 10);

      const tableHeaders = [
        { content: 'N°', rowSpan: 2, styles: { halign: 'center' as const, valign: 'middle' as const } },
        { content: 'APELLIDOS Y NOMBRES', rowSpan: 2, styles: { halign: 'left' as const, valign: 'middle' as const } },
        ...daysArray.map(d => ({ content: d.toString(), styles: { halign: 'center' as const } }))
      ];

      const dayLabels = daysArray.map(d => getDayLabel(d));
      const subHeader = dayLabels.map(l => ({ content: l, styles: { halign: 'center' as const, fontSize: 7 } }));

      const tableData = users.map((u, i) => [
        (i + 1).toString(),
        u.name.toUpperCase(),
        ...u.statuses.map((s: string) => s === 'A' ? '' : s) // Según la imagen, 'A' no se muestra, solo un punto o vacío. En la imagen parece vacío para asistencias.
      ]);

      autoTable(doc, {
        startY: startY + 18,
        head: [tableHeaders, subHeader],
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 1,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          textColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineWidth: 0.2
        },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 60 },
        },
        margin: { left: margin, right: margin },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index > 1) {
            const val = data.cell.text[0];
            if (val === 'F') data.cell.styles.textColor = [244, 63, 94];
            if (val === 'T') data.cell.styles.textColor = [249, 115, 22];
            if (val === 'J') data.cell.styles.textColor = [59, 130, 246];
          }
        }
      });

      return (doc as any).lastAutoTable.finalY;
    };

    // Título Principal
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('I.E 6049 RICARDO PALMA', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('REGISTRO DE ASISTENCIA', pageWidth / 2, 22, { align: 'center' });

    let currentY = 30;

    if (selectedLevel === 'Todos' || selectedGrade === 'Todos' || selectedSection === 'Todos') {
      // Agrupar datos
      const groups: { [key: string]: any[] } = {};
      attendanceData.forEach(u => {
        const key = `${u.level} - ${u.grade} - ${u.section}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(u);
      });

      Object.entries(groups).forEach(([key, users], index) => {
        const [level, grade, section] = key.split(' - ');
        if (index > 0) {
          doc.addPage();
          currentY = 15; // Reset Y on new page
          // Re-dibujar títulos en cada página si es necesario, o solo el de grupo
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('I.E 6049 RICARDO PALMA', pageWidth / 2, 15, { align: 'center' });
          doc.setFontSize(12);
          doc.text('REGISTRO DE ASISTENCIA', pageWidth / 2, 22, { align: 'center' });
          currentY = 30;
        }
        currentY = drawTableForGroup(users, level, grade, section, currentY);
      });
    } else {
      drawTableForGroup(attendanceData, selectedLevel, selectedGrade, selectedSection, currentY);
    }

    // Footer (en la última página o en todas?)
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const footerY = doc.internal.pageSize.getHeight() - 10;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('. Asistió  F Faltó  T Tardanza  J Falta justificada', margin, footerY);
      
      const now = new Date();
      const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} p. m.`;
      doc.text(`Impreso: ${dateStr}`, pageWidth - margin, footerY, { align: 'right' });
    }

    doc.save(`Reporte_Asistencia_${monthNames[selectedMonth]}_${selectedYear}.pdf`);
  };

  // Configuración del Donut Chart Multi-segmento
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  
  // Calcular offsets para apilar los segmentos
  // Orden: Asistencia (Verde) -> Justificada (Azul) -> Tardanza (Naranja) -> Falta (Rojo)
  const pctA = stats.asistencias / stats.total;
  const pctJ = stats.justificadas / stats.total;
  const pctT = stats.tardanzas / stats.total;
  const pctF = stats.faltas / stats.total;

  const dashA = pctA * circumference;
  const dashJ = pctJ * circumference;
  const dashT = pctT * circumference;
  const dashF = pctF * circumference;

  // Rotation offsets (cumulative degrees)
  // Start at -90deg (top)
  const rotA = -90;
  const rotJ = rotA + (pctA * 360);
  const rotT = rotJ + (pctJ * 360);
  const rotF = rotT + (pctT * 360);

  const currentFolderContent = useMemo(() => {
    if (historyPath.length === 0) {
      return { type: 'folders', items: REPORT_TYPES };
    }
    
    const freq = historyPath[0];
    
    let filteredReports = MOCK_REPORTS_HISTORY.filter(r => r.type === freq);
    
    if (selectedLevel && selectedLevel !== 'Todos') {
      filteredReports = filteredReports.filter(r => r.level === selectedLevel);
    }
    if (selectedGrade && selectedGrade !== 'Todos') {
      filteredReports = filteredReports.filter(r => r.grade === selectedGrade);
    }
    if (selectedSection && selectedSection !== 'Todos') {
      filteredReports = filteredReports.filter(r => r.section === selectedSection);
    }

    // Filtro por fecha o semana si aplica
    if (freq === 'Diario' && selectedDate) {
      const [y, m, d] = selectedDate.split('-');
      const day = parseInt(d, 10);
      const monthStr = monthNames[parseInt(m, 10) - 1]?.substring(0, 3).toLowerCase();
      const formattedDate = `${day} ${monthStr}`;
      
      filteredReports = filteredReports.filter(r => r.date.toLowerCase().includes(formattedDate) || r.title.toLowerCase().includes(formattedDate));
    }

    if (freq === 'Semanal' && selectedWeek) {
      // Simulamos filtro por semana
      const weekNum = selectedWeek.split('-W')[1];
      filteredReports = filteredReports.filter(r => r.title.includes(`Semana ${parseInt(weekNum || '0')}`));
    }

    if (freq === 'Mensual') {
      const monthName = monthNames[selectedMonth];
      filteredReports = filteredReports.filter(r => r.date.includes(monthName) && r.date.includes(selectedYear.toString()));
    }

    if (freq === 'Bimestral') {
      const bimesterMap: Record<string, string> = {
        '1': 'I Bimestre',
        '2': 'II Bimestre',
        '3': 'III Bimestre',
        '4': 'IV Bimestre'
      };
      const bimesterStr = bimesterMap[selectedBimestre];
      if (bimesterStr) {
        filteredReports = filteredReports.filter(r => r.title.includes(bimesterStr) && r.date.includes(selectedYear.toString()));
      }
    }
    
    return { type: 'files', items: filteredReports };
  }, [historyPath, selectedLevel, selectedGrade, selectedSection, selectedDate, selectedWeek, selectedMonth, selectedYear, selectedBimestre]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 md:p-8 h-full flex flex-col max-h-screen overflow-hidden font-poppins">
      <PageHeader 
        title="Reportes de Asistencia" 
        subtitle="Monitoreo detallado de asistencia y puntualidad." 
        icon={BarChart3}
      />

      <div className="flex flex-col md:flex-row gap-6 h-full min-h-0">
          {/* Side Filters */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
            <div className="bg-gray-50/80 dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <Filter size={18} className="text-blue-500" />
                Filtros de Búsqueda
              </h3>
              
              <div className="space-y-4">
                      <div className="bg-gray-50/80 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800/60 p-5 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Nivel</label>
                        <div className="relative">
                          <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="w-full appearance-none bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-3 pr-10 transition-all hover:border-gray-300 dark:hover:border-slate-600 shadow-sm"
                          >
                            <option value="">Todos los niveles</option>
                            {Object.keys(EDUCATIONAL_STRUCTURE).map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>
                      </div>

                      <div className="bg-gray-50/80 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800/60 p-5 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Grado</label>
                        <div className="relative">
                          <select
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            disabled={!selectedLevel}
                            className="w-full appearance-none bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-3 pr-10 transition-all hover:border-gray-300 dark:hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                          >
                            <option value="">Todos los grados</option>
                            {gradeOptions.map(grade => (
                              <option key={grade} value={grade}>{grade}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>
                      </div>

                      <div className="bg-gray-50/80 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800/60 p-5 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Sección</label>
                        <div className="relative">
                          <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            disabled={!selectedGrade}
                            className="w-full appearance-none bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-3 pr-10 transition-all hover:border-gray-300 dark:hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                          >
                            <option value="">Todas las secciones</option>
                            {sectionOptions.map(section => (
                              <option key={section} value={section}>{section}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>
                      </div>

                {/* Botón Aplicar Filtros */}
                <button 
                  onClick={() => {
                    setIsApplying(true);
                    setTimeout(() => setIsApplying(false), 1500);
                  }}
                  className={`w-full mt-4 py-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${isApplying ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {isApplying ? (
                    <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Aplicando...</>
                  ) : 'Aplicar Filtros'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 overflow-x-auto">
            {historyPath.length > 0 && (
              <button
                onClick={() => setHistoryPath(historyPath.slice(0, -1))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors mr-2 border border-gray-200 dark:border-slate-700 shrink-0"
                title="Retroceder"
              >
                <ArrowLeft size={16} />
                Atrás
              </button>
            )}
            <button 
              onClick={() => setHistoryPath([])}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shrink-0 ${historyPath.length === 0 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            >
              <Home size={16} />
              Inicio
            </button>
            
            {historyPath.map((path, index) => (
              <React.Fragment key={path}>
                <ChevronRight size={16} className="text-gray-400 shrink-0" />
                <button 
                  onClick={() => setHistoryPath(historyPath.slice(0, index + 1))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shrink-0 whitespace-nowrap ${index === historyPath.length - 1 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                  {path}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentFolderContent.type === 'folders' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(currentFolderContent.items as string[]).map(folderName => {
                  const style = getFolderStyle(folderName);
                  return (
                    <button 
                      key={folderName}
                      onClick={() => setHistoryPath([...historyPath, folderName])}
                      className={`group relative flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-[24px] border border-gray-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${style.borderClass}`}
                    >
                      {/* Background subtle glow on hover */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${style.bgClass}`}></div>
                      
                      <div className="relative w-28 h-28 mb-5 drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
                        <img 
                          src="https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/file-folder.svg" 
                          alt="Folder" 
                          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-200 opacity-100 group-hover:opacity-0" 
                        />
                        <img 
                          src="https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/open-file-folder.svg" 
                          alt="Open Folder" 
                          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-200 opacity-0 group-hover:opacity-100" 
                        />
                      </div>
                      
                      <div className="relative z-10 flex flex-col items-center">
                        <h4 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-1">{folderName}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{style.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Cabecera de la carpeta con selector de fecha */}
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Reportes {historyPath[0] === 'Diario' ? 'Diarios' : historyPath[0] === 'Semanal' ? 'Semanales' : historyPath[0] === 'Mensual' ? 'Mensuales' : 'Bimestrales'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {historyPath[0] === 'Diario' ? 'Selecciona una fecha para ver los reportes de ese día.' : historyPath[0] === 'Semanal' ? 'Selecciona una semana para ver los reportes.' : 'Visualiza los reportes generados.'}
                    </p>
                  </div>
                  
                  {historyPath[0] === 'Diario' && (
                    <div className="shrink-0">
                      <CustomCalendar 
                        mode="date"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        placeholder="Seleccionar Fecha"
                        align="right"
                      />
                    </div>
                  )}
                  {historyPath[0] === 'Semanal' && (
                    <div className="shrink-0">
                      <CustomCalendar 
                        mode="week"
                        value={selectedWeek}
                        onChange={setSelectedWeek}
                        placeholder="Seleccionar Semana"
                        align="right"
                      />
                    </div>
                  )}
                  {historyPath[0] === 'Mensual' && (
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="relative">
                        <select 
                          value={selectedMonth} 
                          onChange={(e) => setSelectedMonth(Number(e.target.value))}
                          className="w-full sm:w-auto appearance-none bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all shadow-sm"
                        >
                          {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                      </div>
                      <div className="relative w-24">
                        <input 
                          type="number" 
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-center transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  )}
                  {historyPath[0] === 'Bimestral' && (
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="relative">
                        <select 
                          value={selectedBimestre} 
                          onChange={(e) => setSelectedBimestre(e.target.value)}
                          className="w-full sm:w-auto appearance-none bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all shadow-sm"
                        >
                          <option value="1">I Bimestre</option>
                          <option value="2">II Bimestre</option>
                          <option value="3">III Bimestre</option>
                          <option value="4">IV Bimestre</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                      </div>
                      <div className="relative w-24">
                        <input 
                          type="number" 
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-center transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {currentFolderContent.items.length > 0 ? (
                  (currentFolderContent.items as typeof MOCK_REPORTS_HISTORY).map(report => (
                    <React.Fragment key={report.id}>
                      {/* Reporte de Asistencia */}
                      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                            <FileText size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold text-gray-900 dark:text-white">{report.title}</h4>
                              <span className="px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold">
                                {report.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                              <Users size={14} />
                              <span>{report.level} - {report.grade.replace(' Grado', '')} {report.section}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600"></span>
                              <span>{report.size}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                          <div className="flex flex-col items-end gap-1 w-32">
                            <div className="flex justify-between w-full items-center">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progreso</span>
                              <span className={`text-xs font-bold ${report.progress >= 90 ? 'text-emerald-500' : report.progress >= 80 ? 'text-orange-500' : 'text-rose-500'}`}>
                                {report.progress}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${report.progress >= 90 ? 'bg-emerald-500' : report.progress >= 80 ? 'bg-orange-500' : 'bg-rose-500'}`}
                                style={{ width: `${report.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setPreviewReport(report)}
                              className="w-10 h-10 rounded-xl border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors tooltip-trigger" 
                              title="Previsualizar"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                const doc = new jsPDF();
                                doc.setFontSize(18);
                                doc.text(report.title, 14, 22);
                                doc.setFontSize(11);
                                doc.text(`${report.date} | ${report.level} - ${report.grade} ${report.section}`, 14, 30);
                                
                                autoTable(doc, {
                                  startY: 40,
                                  head: [['Estudiante', 'Estado', 'Hora Ingreso', 'Hora Salida']],
                                  body: Array.from({ length: 15 }).map((_, i) => [`Estudiante ${i + 1}`, 'Asistió', '07:45 AM', '02:00 PM']),
                                });
                                
                                doc.save(`${report.title.replace(/\s+/g, '_')}.pdf`);
                              }}
                              className="w-10 h-10 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors tooltip-trigger" 
                              title="Descargar PDF"
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Reporte de Incidencias (Solo en Mensual) */}
                      {historyPath[0] === 'Mensual' && (
                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow group ml-8 relative before:content-[''] before:absolute before:left-[-16px] before:top-1/2 before:-translate-y-1/2 before:w-4 before:h-px before:bg-gray-200 dark:before:bg-slate-700">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 group-hover:scale-110 transition-transform">
                              <AlertTriangle size={24} />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">Reporte de Incidencias - {report.title.split(' - ')[1] || report.title}</h4>
                                <span className="px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold">
                                  {report.date}
                               </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                <Users size={14} />
                                <span>{report.level} - {report.grade.replace(' Grado', '')} {report.section}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600"></span>
                                <span>2 Incidencias</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  const doc = new jsPDF();
                                  doc.setFontSize(18);
                                  doc.text(`Reporte de Incidencias - ${report.title.split(' - ')[1] || report.title}`, 14, 22);
                                  doc.setFontSize(11);
                                  doc.text(`${report.date} | ${report.level} - ${report.grade} ${report.section}`, 14, 30);
                                  
                                  autoTable(doc, {
                                    startY: 40,
                                    head: [['Fecha', 'Estudiante', 'Tipo', 'Descripción']],
                                    body: [
                                      ['05/03/2026', 'Juan Pérez', 'Leve', 'Llegó tarde'],
                                      ['12/03/2026', 'María Gómez', 'Grave', 'Falta de respeto'],
                                    ],
                                  });
                                  
                                  doc.save(`Incidencias_${report.title.replace(/\s+/g, '_')}.pdf`);
                                }}
                                className="w-10 h-10 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors tooltip-trigger" 
                                title="Descargar PDF"
                              >
                                <Download size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                      <SearchX size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Carpeta vacía</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                      Aún no se han generado reportes para esta sección en el periodo actual.
                    </p>
                  </div>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
        </div>

      {previewReport && (
        <ReportPreviewModal 
          report={previewReport} 
          onClose={() => setPreviewReport(null)} 
        />
      )}
    </motion.div>
  );
};