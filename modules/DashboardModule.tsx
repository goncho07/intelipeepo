import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, Clock, UserX, Bell, CalendarDays, GraduationCap, Briefcase, ShieldCheck, Home, ChevronLeft, ChevronRight, BarChart2, CheckCircle2, Building } from 'lucide-react';
import { PageHeader, KPICard, containerVariants } from '../components/UI';
import { ModuleProps } from '../types';

interface AttendanceStats {
  asistencias: number;
  faltas: number;
  tardanzas: number;
  justificadas: number;
  total: number;
}

export const DashboardModule: React.FC<ModuleProps> = ({ onNavigate }) => {
  const [attendanceGroup, setAttendanceGroup] = useState<'Inicial' | 'Primaria' | 'Secundaria'>('Inicial');
  
  // Estado para la fecha actual y rango semanal
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [weekRangeStr, setWeekRangeStr] = useState('');

  // Efecto para calcular fechas en tiempo real (Zona Horaria Lima)
  useEffect(() => {
    const getLimaDate = () => {
      const now = new Date();
      // Formateador para Lima
      const formatter = new Intl.DateTimeFormat('es-PE', {
        timeZone: 'America/Lima',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return { now, formatter };
    };

    const updateDates = () => {
      const { now, formatter } = getLimaDate();
      setCurrentDateStr(formatter.format(now));

      // Calcular inicio (Lunes) y fin (Domingo) de la semana
      const dayOfWeek = now.getDay(); // 0 (Domingo) - 6 (Sábado)
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const mondayStr = formatter.format(monday);
      const sundayStr = formatter.format(sunday);

      setWeekRangeStr(`${mondayStr} - ${sundayStr}`);
    };

    updateDates();
    // Actualizar cada minuto por si cambia el día mientras está abierto
    const interval = setInterval(updateDates, 60000); 
    return () => clearInterval(interval);
  }, []);

  // Datos simulados (Asistencia Global)
  const attendanceData: Record<'Inicial' | 'Primaria' | 'Secundaria', AttendanceStats> = useMemo(() => ({
    'Inicial': { asistencias: 250, faltas: 15, tardanzas: 30, justificadas: 5, total: 300 },
    'Primaria': { asistencias: 400, faltas: 20, tardanzas: 60, justificadas: 15, total: 495 },
    'Secundaria': { asistencias: 200, faltas: 10, tardanzas: 30, justificadas: 10, total: 250 }
  }), []);

  // Cálculos Totales para KPI Cards
  const kpiTotals = useMemo(() => {
    const values = Object.values(attendanceData);
    return {
      institucion: values.reduce((acc, curr) => acc + curr.total, 0),
      presentes: values.reduce((acc, curr) => acc + curr.asistencias, 0),
      tardanzas: values.reduce((acc, curr) => acc + curr.tardanzas, 0),
      faltas: values.reduce((acc, curr) => acc + curr.faltas, 0),
    };
  }, [attendanceData]);

  const currentStats = attendanceData[attendanceGroup];

  // Donut Chart logic
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const pctA = currentStats.asistencias / currentStats.total;
  const pctF = currentStats.faltas / currentStats.total;
  const pctT = currentStats.tardanzas / currentStats.total;
  const pctJ = currentStats.justificadas / currentStats.total;

  const dashA = pctA * circumference;
  const dashF = pctF * circumference;
  const dashT = pctT * circumference;
  const dashJ = pctJ * circumference;

  const rotA = -90;
  const rotJ = rotA + (pctA * 360); 
  const rotT = rotJ + (pctJ * 360); 
  const rotF = rotT + (pctT * 360); 

  // Datos Simulados para el Gráfico Semanal (Lunes - Viernes)
  const weeklyAttendance = [
    { day: 'Lun', present: 980, absent: 25, late: 40 },
    { day: 'Mar', present: 950, absent: 35, late: 60 },
    { day: 'Mié', present: 920, absent: 45, late: 80 },
    { day: 'Jue', present: 990, absent: 15, late: 40 },
    { day: 'Vie', present: 900, absent: 80, late: 65 },
  ];

  const maxWeeklyValue = 1100; // Para escalar las barras

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="h-full flex flex-col">
      <PageHeader title="Panel Principal" subtitle="Resumen de actividad institucional y métricas de rendimiento." icon={Home} />
      
      {/* KPI CARDS (Renombradas y Calculadas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 shrink-0">
        <KPICard 
          title="Total Institución" 
          value={kpiTotals.institucion.toLocaleString()} 
          icon={Building} 
          variant="cyan" 
        />
        <KPICard 
          title="Total Presentes" 
          value={kpiTotals.presentes.toLocaleString()} 
          icon={CheckCircle2} 
          variant="emerald" 
        />
        <KPICard 
          title="Total Tardanzas" 
          value={kpiTotals.tardanzas.toLocaleString()} 
          icon={Clock} 
          variant="orange" 
        />
        <KPICard 
          title="Total Faltas" 
          value={kpiTotals.faltas.toLocaleString()} 
          icon={UserX} 
          variant="rose" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1 min-h-0">
        
        {/* ASISTENCIA CHART (DONUT) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6 text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest border-b border-gray-50 dark:border-slate-800 pb-4">
            <Zap size={16} className="text-blue-500"/> 
            <span>Asistencia del Día <span className="text-blue-600 dark:text-blue-400">{currentDateStr}</span></span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-8 bg-gray-50 dark:bg-slate-800 p-1.5 rounded-xl shrink-0">
             {['Inicial', 'Primaria', 'Secundaria'].map((group) => (
                <button 
                  key={group}
                  onClick={() => setAttendanceGroup(group as any)}
                  className={`py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all flex items-center justify-center gap-2 ${attendanceGroup === group ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <GraduationCap size={14}/>
                  <span>{group}</span>
                </button>
             ))}
          </div>
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 px-4">
            {/* Gráfico de Dona Mejorado */}
            <div className="relative w-56 h-56 shrink-0 group">
                {/* Sombra sutil de fondo para profundidad */}
                <div className="absolute inset-4 rounded-full bg-gray-50 dark:bg-slate-800/50 shadow-inner"></div>
                
                <svg className="w-full h-full drop-shadow-xl" viewBox="0 0 100 100">
                    {/* Track de fondo */}
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="10" className="text-gray-100 dark:text-slate-800" />
                    
                    {/* Segmentos con bordes redondeados */}
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#10b981" strokeWidth="10" strokeDasharray={`${dashA} ${circumference}`} strokeLinecap="round" transform={`rotate(${rotA} 50 50)`} className="transition-all duration-1000 ease-out" />
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#3b82f6" strokeWidth="10" strokeDasharray={`${dashJ} ${circumference}`} strokeLinecap="round" transform={`rotate(${rotJ} 50 50)`} className="transition-all duration-1000 ease-out" />
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f97316" strokeWidth="10" strokeDasharray={`${dashT} ${circumference}`} strokeLinecap="round" transform={`rotate(${rotT} 50 50)`} className="transition-all duration-1000 ease-out" />
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f43f5e" strokeWidth="10" strokeDasharray={`${dashF} ${circumference}`} strokeLinecap="round" transform={`rotate(${rotF} 50 50)`} className="transition-all duration-1000 ease-out" />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <motion.span 
                      key={attendanceGroup}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-5xl font-black text-gray-800 dark:text-white tracking-tighter"
                    >
                      {Math.round((currentStats.asistencias / currentStats.total) * 100)}%
                    </motion.span>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Presentismo</span>
                </div>
            </div>

            {/* Leyenda y Datos Premium en Cuadrícula (Filas de 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[640px]">
                {[
                  { label: 'Asistió', value: currentStats.asistencias, color: 'bg-emerald-500', icon: CheckCircle2, textColor: 'text-emerald-600' },
                  { label: 'Faltó', value: currentStats.faltas, color: 'bg-rose-500', icon: UserX, textColor: 'text-rose-600' },
                  { label: 'Tardanza', value: currentStats.tardanzas, color: 'bg-orange-500', icon: Clock, textColor: 'text-orange-600' },
                  { label: 'Justif.', value: currentStats.justificadas, color: 'bg-blue-500', icon: ShieldCheck, textColor: 'text-blue-600' }
                ].map((item, i) => {
                  const percentage = Math.round((item.value / currentStats.total) * 100) || 0;
                  return (
                    <div key={i} className="relative group overflow-hidden p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700/50 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-slate-600 transition-all duration-300">
                      {/* Fondo decorativo sutil */}
                      <div className={`absolute top-0 right-0 w-20 h-20 ${item.color} opacity-[0.03] -mr-6 -mt-6 rounded-full blur-2xl group-hover:opacity-[0.06] transition-opacity`}></div>
                      
                      <div className="relative flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl ${item.color} bg-opacity-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                            <item.icon size={18} className={item.textColor} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">{item.label}</span>
                            <span className="text-lg font-black text-gray-800 dark:text-white tracking-tight leading-none">{item.value}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-bold ${item.textColor} bg-opacity-10 px-1.5 py-0.5 rounded-md`}>{percentage}%</span>
                        </div>
                      </div>

                      {/* Barra de Progreso Mini */}
                      <div className="relative h-1 w-full bg-gray-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                          className={`absolute top-0 left-0 h-full ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* ASISTENCIA SEMANAL (BAR CHART) - MEJORADO CON TOOLTIPS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-8 border-b border-gray-50 dark:border-slate-800 pb-4 shrink-0">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">
              <BarChart2 size={18} className="text-blue-500"/> 
              <span>Asistencia Semanal <span className="text-blue-600 dark:text-blue-400 text-xs block sm:inline sm:ml-2 opacity-80">{weekRangeStr}</span></span>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-500"></div><span className="text-[10px] font-bold text-gray-400 uppercase">Pres</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-rose-500"></div><span className="text-[10px] font-bold text-gray-400 uppercase">Aus</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-orange-500"></div><span className="text-[10px] font-bold text-gray-400 uppercase">Tar</span></div>
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-4 px-2 pb-2">
            {weeklyAttendance.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 flex-1 h-full justify-end group">
                <div className="flex items-end justify-center gap-2 w-full h-full relative px-2">
                  
                  {/* Present Bar */}
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-t-xl h-full flex items-end relative overflow-visible group/bar">
                     <div 
                        className="w-full bg-emerald-500 rounded-t-xl transition-all duration-700 relative hover:brightness-110"
                        style={{ height: `${(day.present / maxWeeklyValue) * 100}%` }}
                     >
                        <div className="absolute top-0 w-full h-1 bg-white/20"></div>
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-md">
                          {day.present}
                        </div>
                     </div>
                  </div>

                  {/* Absent Bar */}
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-t-xl h-full flex items-end relative overflow-visible group/bar">
                     <div 
                        className="w-full bg-rose-500 rounded-t-xl transition-all duration-700 relative hover:brightness-110"
                        style={{ height: `${(day.absent / maxWeeklyValue) * 100}%` }}
                     >
                        <div className="absolute top-0 w-full h-1 bg-white/20"></div>
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-md">
                          {day.absent}
                        </div>
                     </div>
                  </div>

                  {/* Late Bar */}
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-t-xl h-full flex items-end relative overflow-visible group/bar">
                     <div 
                        className="w-full bg-orange-500 rounded-t-xl transition-all duration-700 relative hover:brightness-110"
                        style={{ height: `${(day.late / maxWeeklyValue) * 100}%` }}
                     >
                        <div className="absolute top-0 w-full h-1 bg-white/20"></div>
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-md">
                          {day.late}
                        </div>
                     </div>
                  </div>

                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};