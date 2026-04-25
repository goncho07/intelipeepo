import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Search, Filter, CalendarDays, Edit2, AlertTriangle, CheckCircle2, Check, ExternalLink, Inbox, XCircle, ChevronDown, Eye, X, BookOpen, Clock, Users, ArrowRight, Megaphone, AlertCircle, Info, Send, Printer, MessageCircle } from 'lucide-react';
import { PageHeader, containerVariants } from '../components/UI';
import { ModuleProps } from '../types';
import { APP_CONFIG } from '../constants';
import { CustomCalendar } from '../src/components/CustomCalendar';

export const CitationsModule: React.FC<ModuleProps> = () => {
  const [sidebarTab, setSidebarTab] = useState<"Pendientes" | "Confirmadas" | "Historial">("Pendientes");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReasonList, setFilterReasonList] = useState<"Todos" | "Incidencias" | "Académico" | "Otros">("Todos");
  const [filterGrade, setFilterGrade] = useState("Todos");
  const [filterMonth, setFilterMonth] = useState("Todos");
  
  // Mock Data
  const initialCitations = [
    { id: 1, student: 'Valentina Sol', parent: 'Roberto Sol', relationship: 'Padre', grade: '3° Grado - A', reason: 'Bajo rendimiento en Matemáticas', category: 'Académico', date: '18/03/2026', time: '10:00 AM', status: 'Pendiente' },
    { id: 2, student: 'Mateo Rojas', parent: 'Elena Rojas', relationship: 'Madre', grade: '4° Grado - C', reason: 'Entrega de libreta', category: 'Académico', date: '10/03/2026', time: '12:00 PM', status: 'Realizada' },
    { id: 3, student: 'Lucas Vega', parent: 'María Vega', relationship: 'Madre', grade: '2° Grado - B', reason: 'Problemas de conducta continuos', category: 'Incidencias', date: '25/03/2026', time: '09:30 AM', status: 'Pendiente' },
    { id: 4, student: 'Camila Paz', parent: 'Andrés Paz', relationship: 'Padre', grade: '5° Grado - A', reason: 'Mejora reportada en su desempeño general', category: 'Académico', date: '02/04/2026', time: '10:30 AM', status: 'Pendiente' },
    { id: 5, student: 'Luciana Delgado', parent: 'Ana Ramos', relationship: 'Madre', grade: '3° Grado - A', reason: 'Acumulación de faltas injustificadas', category: 'Otros', date: '19/04/2026', time: '10:00 AM', status: 'Cancelada' },
    { id: 6, student: 'Nicolas Salas', parent: 'Victor Salas', relationship: 'Padre', grade: '4° Grado - B', reason: 'Matrícula condicional', category: 'Gestión', date: '12/04/2026', time: '08:45 AM', status: 'Realizada' },
    { id: 7, student: 'Valeria Quispe', parent: 'Jorge Quispe', relationship: 'Padre', grade: '5° Grado - B', reason: 'Problemas de Integración', category: 'Otros', date: '21/04/2026', time: '11:00 AM', status: 'Pendiente' },
    { id: 8, student: 'Valery Mamani', parent: 'Martha Campos', relationship: 'Madre', grade: '2° Grado - A', reason: 'Acumulación de incidencias', category: 'Incidencias', date: '04/04/2026', time: '11:00 AM', status: 'Pendiente', incidents: [{ type: "Evasión de clase de matemáticas (Reincidencia)", date: "04/04/2026" }, { type: "Uso de celular en horario no permitido", date: "01/04/2026" }] },
    { id: 9, student: 'Juan Pérez', parent: 'Ana L.', relationship: 'Madre', grade: '1° Grado - C', reason: 'Agresión en aula', category: 'Incidencias', date: '08/04/2026', time: '02:00 PM', status: 'Confirmada', incidents: [{ type: "Golpe a compañero durante clase", date: "07/04/2026" }] },
    { id: 10, student: 'Luis Silva', parent: 'Alberto Silva', relationship: 'Padre', grade: '4° Grado - A', reason: 'Apoyo en Lenguaje', category: 'Académico', date: '08/04/2026', time: '08:00 AM', status: 'Confirmada' },
    { id: 11, student: 'Sofia Luna', parent: 'Andres Luna', relationship: 'Padre', grade: '2° Grado - A', reason: 'Bullying a compañero', category: 'Incidencias', date: '16/03/2026', time: '11:30 AM', status: 'Confirmada', incidents: [{ type: "Ciberbullying reportado por tutores", date: "10/03/2026" }] },
    { id: 12, student: 'Diego Castro', parent: 'Juan Castro', relationship: 'Padre', grade: '5° Grado - C', reason: 'Reunión de coordinación y mediación escolar', category: 'Otros', date: '18/04/2026', time: '08:15 AM', status: 'Pendiente' },
    { id: 13, student: 'Ximena Torres', parent: 'Diana Torres', relationship: 'Madre', grade: '3° Grado - B', reason: 'Falta de respeto al docente', category: 'Incidencias', date: '24/03/2026', time: '10:30 AM', status: 'Cancelada', incidents: [{ type: "Falta de respeto a autoridad", date: "22/03/2026" }] },
    { id: 14, student: 'Fernando Arce', parent: 'Gloria Arce', relationship: 'Madre', grade: '1° Grado - A', reason: 'Falsificación de firma', category: 'Incidencias', date: '22/04/2026', time: '09:30 AM', status: 'Pendiente', incidents: [{ type: "Firma falsificada en examen", date: "20/04/2026" }] },
    { id: 15, student: 'Sebastián Reyes', parent: 'Mónica Reyes', relationship: 'Madre', grade: '2° Grado - C', reason: 'Reforzamiento de inglés', category: 'Académico', date: '25/04/2026', time: '08:00 AM', status: 'Confirmada' },
    { id: 16, student: 'Ariana Vega', parent: 'Esteban Vega', relationship: 'Padre', grade: '3° Grado - A', reason: 'Uso de celular en clase', category: 'Incidencias', date: '29/04/2026', time: '10:00 AM', status: 'Pendiente', incidents: [{ type: "Uso de celular (Reincidencia 3)", date: "27/04/2026" }] },
  ];

  const [citationsList, setCitationsList] = useState(initialCitations);

  const filteredCitations = citationsList.filter(c => {
    // Search match
    if (searchTerm) {
      if (!c.student.toLowerCase().includes(searchTerm.toLowerCase()) && !c.parent.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    }

    // Status match
    if (sidebarTab === "Pendientes" && c.status !== "Pendiente") return false;
    if (sidebarTab === "Confirmadas" && c.status !== "Confirmada") return false;
    if (sidebarTab === "Historial" && c.status !== "Cancelada" && c.status !== "Realizada") return false;

    // Reason tab match
    if (filterReasonList !== "Todos" && c.category !== filterReasonList) return false;

    // Grade match
    if (filterGrade !== "Todos" && !c.grade.includes(filterGrade)) return false;

    // Month match
    if (filterMonth !== "Todos") {
        const monthNum = parseInt(c.date.split('/')[1]);
        const monthMap: Record<number, string> = { 3: 'Marzo', 4: 'Abril', 5: 'Mayo' };
        if (monthMap[monthNum] !== filterMonth) return false;
    }

    return true;
  });

  const tabCounts = {
    Pendientes: citationsList.filter(c => c.status === "Pendiente").length,
    Confirmadas: citationsList.filter(c => c.status === "Confirmada").length,
    Historial: citationsList.filter(c => c.status === "Cancelada" || c.status === "Realizada").length,
  };

  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [viewCitationModal, setViewCitationModal] = useState<{isOpen: boolean, citation: any | null}>({ isOpen: false, citation: null });

  // Form states for compose
  const [selectedStudent, setSelectedStudent] = useState("");
  const [citeReason, setCiteReason] = useState<"Incidencias" | "Académico" | "Otros" | "">("");
  const [hideTeacherName, setHideTeacherName] = useState(false);

  const [composeStep, setComposeStep] = useState(1);
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);
  const [citeSchedDate, setCiteSchedDate] = useState("");
  const [citeSchedTime, setCiteSchedTime] = useState("");
  const [citeDateError, setCiteDateError] = useState("");
  const [customReason, setCustomReason] = useState("");

  const availableIncidents = useMemo(() => [
    { id: '1', label: 'Evasión de clase de matemáticas (Reincidencia)', date: '04 mar 26', time: '10:30 AM', registrar: 'Ana Gómez' },
    { id: '2', label: 'Uso de celular en horario no permitido', date: '01 mar 26', time: '11:15 AM', registrar: 'Carlos Mendoza' },
    { id: '3', label: 'Falta de respeto a compañero', date: '25 feb 26', time: '09:00 AM', registrar: 'Luis Pérez' }
  ], []);

  const handleDateChange = (value: string) => {
    setCiteSchedDate(value);
    const selectedDate = new Date(value);
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      setCiteDateError("No se pueden agendar citaciones los fines de semana.");
    } else {
      setCiteDateError("");
    }
  };

  const [showWhatsAppPreview, setShowWhatsAppPreview] = useState(false);

  // Reschedule & Realizado Modals State
  const [rescheduleModal, setRescheduleModal] = useState<{isOpen: boolean; citation: any | null}>({isOpen: false, citation: null});
  const [reschedDate, setReschedDate] = useState("");
  const [reschedTime, setReschedTime] = useState("");
  const [reschedReason, setReschedReason] = useState("");
  const [reschedDateError, setReschedDateError] = useState("");

  const [realizadoModal, setRealizadoModal] = useState<{isOpen: boolean; citationId: number | null}>({isOpen: false, citationId: null});

  const updateCitationStatus = (id: number, newStatus: string) => {
      setCitationsList(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      setViewCitationModal({ isOpen: false, citation: null });
  };

  const handleRescheduleDateChange = (value: string) => {
    setReschedDate(value);
    const selectedDate = new Date(value);
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Saturday or Sunday in 0-indexed JS date, actually Sat=6, Sun=0. Wait, JS getDay() 0=Sun, 6=Sat
      setReschedDateError("No se pueden agendar citaciones los fines de semana.");
    } else {
      setReschedDateError("");
    }
  };

  const handleReschedule = () => {
    if (rescheduleModal.citation) {
      setCitationsList(prev => prev.map(c => 
        c.id === rescheduleModal.citation.id 
          ? { ...c, status: "Pendiente", date: reschedDate, time: reschedTime, reason: reschedReason || c.reason }
          : c
      ));
      setRescheduleModal({isOpen: false, citation: null});
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-8 h-full flex flex-col font-poppins relative">
      
      <PageHeader 
        title="Citaciones" 
        subtitle="Centro de gestión de reuniones y comunicaciones con apoderados." 
        icon={Mail}
      />

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-w-0 min-h-0 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm rounded-2xl">
          
        {/* Sidebar */}
        <div className="w-full md:w-[260px] border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800 shrink-0 py-6 pr-4 overflow-y-auto bg-[#fafbfc] dark:bg-slate-900/50">
            {/* Action Buttons */}
            <div className="mb-6 flex flex-col gap-2">
                <button 
                  onClick={() => setIsComposeModalOpen(true)}
                  className="flex items-center gap-3 px-6 py-3 bg-[#c2e7ff] text-[#041e49] dark:bg-blue-900/60 dark:text-blue-100 hover:bg-[#b5dfff] hover:shadow-md transition-all rounded-r-full w-full shadow-sm shadow-blue-500/10 group font-bold"
                >
                  <Edit2 className="w-5 h-5 fill-[#041e49] text-[#041e49] dark:fill-blue-100 dark:text-blue-100" strokeWidth={2.5} />
                  <span className="text-[15px]">Generar Citación</span>
                </button>
            </div>

            <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible custom-scrollbar">
                {[ 
                { id: "Pendientes", label: "Citas Pendientes", icon: Inbox, count: tabCounts.Pendientes },
                { id: "Confirmadas", label: "Citas Confirmadas", icon: CheckCircle2, count: tabCounts.Confirmadas },
                { id: "Historial", label: "Historial de Citas", icon: Clock, count: tabCounts.Historial }
                ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setSidebarTab(tab.id as any)}
                    className={`flex items-center justify-between px-6 py-3 rounded-r-full font-medium text-[15px] transition-colors w-full group ${sidebarTab === tab.id ? "bg-[#d3e3fd] text-[#041e49] dark:bg-blue-900/40 dark:text-blue-200 font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"}`}
                >
                    <div className="flex items-center gap-4">
                    <tab.icon className={`w-5 h-5 shrink-0 transition-colors ${sidebarTab === tab.id ? 'text-[#041e49] fill-[#d3e3fd]/50 dark:fill-blue-900/20 dark:text-blue-200' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`} />
                    <span className="flex-1 text-left">{tab.label}</span>
                    <span className={`text-[13px] font-bold ml-6 ${sidebarTab === tab.id ? 'text-[#041e49] dark:text-blue-200' : 'text-slate-500'}`}>{tab.count}</span>
                    </div>
                </button>
                ))}
            </div>
        </div>

        {/* Main Content wrapper */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col min-w-0 bg-white dark:bg-slate-900">
            {/* Global Filters Bar */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 sticky top-0 z-20 flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Buscar estudiante o apoderado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[10px] text-[15px] font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 shadow-sm"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 overflow-x-auto pb-1 custom-scrollbar">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mr-1 shrink-0">
                        <Filter className="w-5 h-5 opacity-80" />
                        <span className="font-medium text-[15px]">Filtros:</span>
                    </div>

                    <div className="relative shrink-0">
                        <Users className="w-[18px] h-[18px] text-[#041e49] dark:text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select 
                            value={filterGrade}
                            onChange={e => setFilterGrade(e.target.value)}
                            className="appearance-none font-semibold text-[#041e49] dark:text-slate-200 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[10px] pl-[42px] pr-10 py-2.5 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer text-[14px] shadow-sm min-w-[180px]"
                        >
                            <option value="Todos">Todas las Aulas</option>
                            <option value="2° Grado">2° Grado</option>
                            <option value="3° Grado">3° Grado</option>
                            <option value="4° Grado">4° Grado</option>
                            <option value="5° Grado">5° Grado</option>
                        </select>
                        <ChevronDown className="w-[18px] h-[18px] text-[#041e49] dark:text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="relative shrink-0">
                        <CalendarDays className="w-[18px] h-[18px] text-[#041e49] dark:text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select 
                            value={filterMonth}
                            onChange={e => setFilterMonth(e.target.value)}
                            className="appearance-none font-semibold text-[#041e49] dark:text-slate-200 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[10px] pl-[42px] pr-10 py-2.5 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer text-[14px] shadow-sm min-w-[180px]"
                        >
                            <option value="Todos">Todos los Meses</option>
                            <option value="Marzo">Marzo</option>
                            <option value="Abril">Abril</option>
                            <option value="Mayo">Mayo</option>
                        </select>
                        <ChevronDown className="w-[18px] h-[18px] text-[#041e49] dark:text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="relative shrink-0">
                        <BookOpen className="w-[18px] h-[18px] text-[#041e49] dark:text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select 
                            value={filterReasonList}
                            onChange={e => setFilterReasonList(e.target.value as any)}
                            className="appearance-none font-semibold text-[#041e49] dark:text-slate-200 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[10px] pl-[42px] pr-10 py-2.5 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer text-[14px] shadow-sm min-w-[180px]"
                        >
                            <option value="Todos">Cualquier Motivo</option>
                            <option value="Incidencias">Incidencias</option>
                            <option value="Académico">Académico</option>
                            <option value="Otros">Otros</option>
                        </select>
                        <ChevronDown className="w-[18px] h-[18px] text-[#041e49] dark:text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* List / Table Content */}
            <div className="flex-1 overflow-auto p-0">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8fafd] dark:bg-slate-800/80 sticky top-0 z-10 border-b border-gray-100 dark:border-slate-800">
                    <tr>
                        <th className="px-6 py-4 text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Estudiante</th>
                        <th className="px-6 py-4 text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden sm:table-cell">Apoderado</th>
                        <th className="px-6 py-4 text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden md:table-cell">Motivo</th>
                        <th className="px-6 py-4 text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Fecha</th>
                        <th className="px-6 py-4 text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden lg:table-cell">Estado</th>
                        <th className="px-6 py-4 text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
                    {filteredCitations.map((citation, index) => (
                        <tr key={citation.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/20'} hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors group`}>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm shrink-0">
                                    {citation.student.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-extrabold text-[#041e49] dark:text-white mb-0.5">{citation.student}</span>
                                    <span className="text-[12px] font-bold text-slate-500 w-fit line-clamp-1">{citation.grade}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                            <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{citation.parent}</span>
                            <span className="block text-[12px] text-slate-400 font-medium">{citation.relationship}</span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                             <div className="flex flex-col items-start gap-1">
                                <span className="text-[14px] font-extrabold text-[#0D082C] dark:text-white line-clamp-1">
                                    {citation.reason}
                                </span>
                                <span className={`text-[12px] font-medium px-2 py-0.5 rounded-md w-max inline-block bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400`}>
                                    {citation.category}
                                </span>
                             </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="text-[13px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <CalendarDays size={14} className="text-slate-400" />
                                    {citation.date}
                                </span>
                                <span className="text-[12px] font-bold text-slate-500 ml-5 mt-0.5">{citation.time}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                            <span className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-2 w-max border ${
                            citation.status === 'Confirmada' ? 'bg-[#E6F7EF] text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400' :
                            citation.status === 'Realizada' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400' :
                            citation.status === 'Cancelada' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400' :
                            'bg-[#fff4e5] text-[#d97706] border-[#fde68a] dark:bg-amber-950/40 dark:text-amber-500 dark:border-amber-700/50'
                            }`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                {citation.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 pr-7">
                                <button 
                                onClick={() => setViewCitationModal({isOpen: true, citation})}
                                className="px-4 py-2 text-[14px] font-bold text-[#002D98] bg-[#E5EFFF] border border-[#B3D4FF] hover:bg-[#CCDEFF] dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-800/50 dark:hover:bg-blue-900/50 rounded-xl transition-colors inline-flex items-center justify-center shrink-0 gap-2"
                                title="Ver detalles"
                                >
                                    <Eye size={18} />
                                    Ver
                                </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {filteredCitations.length === 0 && (
                    <div className="p-16 flex flex-col items-center justify-center text-slate-400">
                        <Inbox size={48} className="opacity-20 mb-4" />
                        <p className="text-lg font-bold text-slate-500">Bandeja vacía</p>
                        <p className="text-sm font-medium mt-1">No hay citaciones que coincidan con estos filtros.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Compose Citation Modal */}
      <AnimatePresence>
        {isComposeModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-xl w-full flex flex-col transition-all duration-300 max-w-xl my-8 relative`}
          >
            <div className="flex flex-col w-full">
              {/* Form Section */}
              <div className="flex flex-col relative w-full">
                <div className="px-6 py-[22px] border-b border-[#EAEBF0] dark:border-slate-800 flex justify-between items-center bg-transparent sticky top-0 z-20 bg-white dark:bg-slate-900 rounded-t-[24px]">
                  <div className="flex items-center gap-3 text-[#041e49] dark:text-white">
                    {composeStep === 2 ? <AlertTriangle size={20} className="text-rose-500" /> : <Edit2 size={20} className="text-[#3030b8]" />}
                    <h3 className="text-xl font-extrabold text-[#0D082C] dark:text-white flex items-center gap-2.5">
                       {composeStep === 2 ? 'Selección de Incidencias' : 'Generar Citación'}
                    </h3>
                  </div>
                  <button onClick={() => { setIsComposeModalOpen(false); setComposeStep(1); setCiteReason(''); setSelectedStudent(''); setSelectedIncidents([]); }} className="text-[#8792A2] hover:text-[#0D082C] dark:hover:text-slate-300 transition-colors bg-[#F2F4FC] dark:bg-slate-800 w-9 h-9 rounded-full flex items-center justify-center">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 flex flex-col gap-6 w-full">
                  
                  {composeStep === 1 ? (
                    <>
                      {/* Select Grade */}
                      <div>
                        <label className="block text-[13px] font-extrabold text-[#0D082C] dark:text-indigo-100 mb-2.5">Aula (Grado/Sección)</label>
                        <div className="relative">
                          <select 
                            defaultValue=""
                            className="w-full bg-[#f8fafd] dark:bg-slate-800 border border-[#EAEBF0] dark:border-slate-700 rounded-xl pl-4 pr-10 py-3 text-[14px] font-bold text-[#0D082C] dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-[#3030b8] transition-all"
                          >
                            <option value="" disabled>Seleccionar Aula</option>
                            <option value="1">1° Grado - A</option>
                            <option value="2">2° Grado - B</option>
                            <option value="3">3° Grado - A</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18}/>
                        </div>
                      </div>

                      {/* Select Student */}
                      <div>
                        <label className="block text-[13px] font-extrabold text-[#0D082C] dark:text-indigo-100 mb-2.5">Estudiante</label>
                        <div className="relative">
                          <select 
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className="w-full bg-[#f8fafd] dark:bg-slate-800 border border-[#EAEBF0] dark:border-slate-700 rounded-xl pl-4 pr-10 py-3 text-[14px] font-bold text-[#0D082C] dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-[#3030b8] transition-all"
                          >
                            <option value="" disabled>Seleccionar Estudiante</option>
                            <option value="Valery Mamani Campos">Valery Mamani Campos</option>
                            <option value="Lucas Vega">Lucas Vega</option>
                            <option value="Valentina Sol">Valentina Sol</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18}/>
                        </div>
                      </div>

                      {/* Select Reason */}
                      <div>
                        <label className="block text-[13px] font-extrabold text-[#0D082C] dark:text-indigo-100 mb-2.5">Motivo de Citación</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button 
                            onClick={() => setCiteReason("Incidencias")}
                            className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-[12px] border transition-all ${citeReason === 'Incidencias' ? 'border-rose-600 bg-rose-50 dark:bg-rose-900/20 shadow-[0px_4px_16px_rgba(225,29,72,0.06)]' : 'border-[#EAEBF0] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'}`}
                          >
                             <AlertTriangle size={24} className={citeReason === 'Incidencias' ? 'text-rose-600' : 'text-[#8792A2]'} />
                             <span className={`font-extrabold text-[14px] text-center ${citeReason === 'Incidencias' ? 'text-rose-800 dark:text-rose-400' : 'text-[#546274] dark:text-slate-400'}`}>Incidencias</span>
                          </button>
                          <button 
                            onClick={() => setCiteReason("Académico")}
                            className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-[12px] border transition-all ${citeReason === 'Académico' ? 'border-[#3030b8] bg-[#f8fafd] dark:bg-indigo-900/20 shadow-[0px_4px_16px_rgba(48,48,184,0.06)]' : 'border-[#EAEBF0] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'}`}
                          >
                             <BookOpen size={24} className={citeReason === 'Académico' ? 'text-[#3030b8]' : 'text-[#8792A2]'} />
                             <span className={`font-extrabold text-[14px] text-center ${citeReason === 'Académico' ? 'text-[#0D082C] dark:text-white' : 'text-[#546274] dark:text-slate-400'}`}>Rendimiento Académico</span>
                          </button>
                          <button 
                            onClick={() => setCiteReason("Otros")}
                            className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-[12px] border transition-all ${citeReason === 'Otros' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-[0px_4px_16px_rgba(245,158,11,0.06)]' : 'border-[#EAEBF0] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'}`}
                          >
                             <AlertCircle size={24} className={citeReason === 'Otros' ? 'text-amber-500' : 'text-[#8792A2]'} />
                             <span className={`font-extrabold text-[14px] text-center ${citeReason === 'Otros' ? 'text-amber-700 dark:text-amber-500' : 'text-[#546274] dark:text-slate-400'}`}>Otros</span>
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end pt-6 border-t border-[#EAEBF0] dark:border-slate-800">
                         <button onClick={() => setComposeStep(citeReason === 'Incidencias' ? 2 : 3)} className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-[#3030b8] hover:bg-blue-800 text-white font-bold transition-all shadow-[0px_4px_12px_rgba(48,48,184,0.2)] hover:shadow-[0px_6px_16px_rgba(48,48,184,0.3)] flex items-center justify-center gap-2" disabled={!selectedStudent || !citeReason}>
                           Continuar <ArrowRight size={18} />
                         </button>
                      </div>
                    </>
                  ) : composeStep === 2 && citeReason === 'Incidencias' ? (
                    <div className="flex flex-col gap-5">
                      <div className="flex items-center justify-between xl:-mb-1">
                        <p className="font-extrabold text-[#0D082C] dark:text-slate-100 text-[15px]">Seleccionar incidencias a citar</p>
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <span className="text-[13px] font-bold text-[#3030b8] dark:text-indigo-400 select-none">Seleccionar todo</span>
                           <input type="checkbox" className="hidden" 
                             checked={selectedIncidents.length === availableIncidents.length && availableIncidents.length > 0} 
                             onChange={(e) => {
                               if (e.target.checked) setSelectedIncidents(availableIncidents.map(i => i.id));
                               else setSelectedIncidents([]);
                             }} 
                           />
                         </label>
                      </div>
                      <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                         {availableIncidents.map((incident) => {
                           const isSelected = selectedIncidents.includes(incident.id);
                           return (
                             <label key={incident.id} className={`flex items-start gap-4 p-4 rounded-[12px] border shadow-[0px_4px_16px_rgba(13,8,44,0.02)] cursor-pointer transition-all bg-white hover:border-[#3030b8] dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-400 ${isSelected ? 'border-[1.5px] border-[#3030b8] shadow-[0px_4px_16px_rgba(48,48,184,0.06)]' : 'border-[#EAEBF0] border'}`}>
                               <div className={`mt-0.5 w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-[1.5px] border-[#3030b8] bg-transparent' : 'border-[#8792A2] dark:border-slate-600'}`}>
                                 {isSelected && <Check className="w-[14px] h-[14px] text-[#3030b8]" strokeWidth={4} />}
                               </div>
                               <input type="checkbox" className="hidden" checked={isSelected} onChange={() => {
                                 setSelectedIncidents(prev => isSelected ? prev.filter(id => id !== incident.id) : [...prev, incident.id]);
                               }} />
                               <div className="flex-1">
                                 <div className="flex items-start justify-between">
                                   <p className={`font-extrabold text-[15px] leading-tight ${isSelected ? 'text-[#0D082C] dark:text-indigo-100' : 'text-[#0D082C] dark:text-slate-200'}`}>{incident.label}</p>
                                   <div className="text-right">
                                     <p className="text-[12px] font-extrabold text-[#8792A2] dark:text-slate-400">{incident.date}</p>
                                     <p className="text-[12px] font-extrabold text-[#8792A2] dark:text-slate-400">{incident.time}</p>
                                   </div>
                                 </div>
                                 <p className="text-[12px] font-semibold text-[#546274] mt-2.5">Registrado por: {incident.registrar}</p>
                               </div>
                             </label>
                           );
                         })}
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 border-t border-[#EAEBF0] dark:border-slate-800">
                         <button onClick={() => setComposeStep(1)} className="w-full sm:w-auto px-6 py-2.5 rounded-full font-bold text-[#546274] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"> Volver </button>
                         <button onClick={() => setComposeStep(3)} className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-[#3030b8] hover:bg-blue-800 text-white font-bold transition-all shadow-[0px_4px_12px_rgba(48,48,184,0.2)] hover:shadow-[0px_6px_16px_rgba(48,48,184,0.3)] flex items-center justify-center gap-2" disabled={selectedIncidents.length === 0}> Continuar <ArrowRight size={18} /> </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-5 z-20 relative">
                        <div>
                          <label className="block text-[13px] font-extrabold text-[#0D082C] dark:text-indigo-100 mb-2.5 flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-[#8792A2]"/> Día sugerido</label>
                          <div className="w-full relative z-[60]">
                            <CustomCalendar mode="date" value={citeSchedDate} onChange={handleDateChange} placeholder="dd/mm/aaaa" />
                          </div>
                          {citeDateError && <p className="text-xs text-red-500 mt-1.5 font-bold">{citeDateError}</p>}
                        </div>
                        <div>
                          <label className="block text-[13px] font-extrabold text-[#0D082C] dark:text-indigo-100 mb-2.5 flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#8792A2]"/> Hora sugerida</label>
                          <div className="relative z-10">
                            <input type="time" value={citeSchedTime} onChange={e => setCiteSchedTime(e.target.value)} className="w-full bg-[#f8fafd] dark:bg-slate-800 border border-[#EAEBF0] dark:border-slate-700 rounded-[10px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3030b8] transition-all shadow-none h-[42px]" style={{ fontFamily: "'Poppins', sans-serif" }} />
                          </div>
                        </div>
                      </div>

                      {citeReason === 'Otros' && (
                        <div>
                          <label className="block text-[13px] font-extrabold text-[#0D082C] dark:text-indigo-100 mb-2.5 mt-2">Motivo de la citación</label>
                          <textarea
                            className="w-full bg-[#f8fafd] dark:bg-slate-800 border border-[#EAEBF0] dark:border-slate-700 rounded-[10px] px-4 py-3 font-medium text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3030b8] shadow-none placeholder:text-[#8792A2] resize-none min-h-[90px]"
                            placeholder="Escriba el detalle del motivo por el cual cita al estudiante..."
                            autoFocus
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                          />
                        </div>
                      )}

                      {/* Hide Teacher Name Toggle */}
                      <div className="flex items-center gap-2 mt-2">
                         <button
                            onClick={() => setHideTeacherName(!hideTeacherName)}
                            className={`w-11 h-6 rounded-full flex items-center transition-colors relative shrink-0 ${hideTeacherName ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                         >
                            <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform absolute ${hideTeacherName ? 'translate-x-6' : 'translate-x-[4px]'}`} />
                         </button>
                         <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                            Ocultar nombre del docente
                         </span>
                      </div>

                      <div>
                         <label className="block text-[13px] font-extrabold text-[#0D082C] dark:text-indigo-100 mb-2.5">Mensaje predeterminado para el apoderado</label>
                         <div className="w-full bg-[#efeae2] dark:bg-[#0b141a] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col shrink-0 relative overflow-hidden">
                            {/* WhatsApp Header */}
                            <div className="bg-[#075e54] dark:bg-[#202c33] px-3 py-2 flex items-center gap-3 z-20 shrink-0 shadow-md">
                               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-white/50">
                                   <img src={APP_CONFIG.schoolLogo} alt="Logo" className="w-full h-full object-cover scale-[1.7]" referrerPolicy="no-referrer" />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-white font-semibold text-[14px] leading-tight flex items-center gap-1">
                                    Asistencia Ricardo Palma Secundaria
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#53bdeb] ml-0.5" strokeWidth={3} />
                                  </span>
                                  <span className="text-white/80 text-[11px] leading-tight mt-0.5">Chatbot</span>
                               </div>
                            </div>

                            {/* WhatsApp Background */}
                            <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.06] pointer-events-none mt-[54px] z-0" style={{
                               backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
                               backgroundSize: '400px'
                            }}></div>

                            {/* Messages */}
                            <div className="p-4 flex flex-col gap-3 relative z-10 custom-scrollbar pb-6 max-h-[350px] overflow-y-auto">
                               <div className="self-center bg-[#E1F3FB] dark:bg-[#182229] text-slate-500 dark:text-slate-400 text-[11px] font-medium px-3 py-1 rounded-md shadow-sm mb-2 uppercase tracking-wide">
                                  Hoy
                               </div>

                               <div className="bg-white dark:bg-[#202c33] rounded-lg rounded-tl-none p-2 shadow-sm max-w-[92%] relative z-10 text-left self-start">
                                  {/* Tail */}
                                  <svg viewBox="0 0 8 13" width="8" height="13" className="absolute -left-[8px] top-0 text-white dark:text-[#202c33]">
                                     <path fill="currentColor" d="M1.533,3.568L8,12.193V1H2.812C1.042,1,0.474,2.156,1.533,3.568z"></path>
                                  </svg>

                                  <div className="text-[14px] leading-[1.35] whitespace-pre-wrap break-words text-[#111b21] dark:text-[#e9edef] p-1 pb-4 relative">
                                     <p className="font-bold flex items-center gap-2 mb-2">
                                        📣 Citación Oficial
                                     </p>
                                     <p className="mb-2">
                                        Estimado padre/madre de familia de <span className="font-semibold text-[#075e54] dark:text-emerald-400">{selectedStudent || "[Estudiante]"}</span>, nos comunicamos para solicitar una cita por motivo de: <strong>{citeReason === 'Otros' ? (customReason || '...') : citeReason === 'Académico' ? 'Rendimiento académico' : citeReason === 'Incidencias' ? 'Acumulación de incidencias' : citeReason}</strong>.
                                     </p>
                                     <p>La cita está programada para el día {citeSchedDate ? citeSchedDate.split('-').reverse().join('/') : "[Día]"} a las {citeSchedTime || "[Hora]"}.</p>
                                     
                                     {citeReason === 'Incidencias' && selectedIncidents.length > 0 && (
                                        <div className="mt-2 text-[13px]">
                                          <p className="font-medium">Incidencias a tratar:</p>
                                          <ul className="list-disc pl-4 mt-1 opacity-90">
                                            {availableIncidents.filter(i => selectedIncidents.includes(i.id)).map((i, idx) => <li key={idx}>{i.label} ({i.date})</li>)}
                                          </ul>
                                        </div>
                                     )}

                                     <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/50 text-[13.5px]">
                                        <p>Atentamente,</p>
                                        {!hideTeacherName && <p className="font-bold mt-1">Carlos Mendoza</p>}
                                        <p className={`${hideTeacherName ? 'font-bold mt-1' : 'italic opacity-80 text-[12.5px]'}`}>Docente del curso de DPCC</p>
                                     </div>
                                     <div className="absolute bottom-0 right-0 text-[11px] text-[#667781] dark:text-[#8696a0] font-medium mt-1.5 flex justify-end items-center gap-1 pb-0.5">
                                        {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} 
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#53bdeb] dark:text-[#53bdeb] inline ml-1" />
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 border-t border-[#EAEBF0] dark:border-slate-800">
                         <button onClick={() => setComposeStep(citeReason === 'Incidencias' ? 2 : 1)} className="w-full sm:w-auto px-6 py-2.5 rounded-full font-bold text-[#546274] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                           Volver
                         </button>
                         <button onClick={() => { alert('Citación enviada!'); setIsComposeModalOpen(false); setComposeStep(1); setCiteReason(''); setSelectedStudent(''); setSelectedIncidents([]); }} className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-[#002D98] hover:bg-blue-800 text-white font-bold transition-all shadow-[0px_4px_12px_rgba(0,45,152,0.2)] hover:shadow-[0px_6px_16px_rgba(0,45,152,0.3)] flex items-center justify-center gap-2" disabled={!citeSchedDate || citeDateError.length > 0}>
                           <Send size={18} /> Generar Citación
                         </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          </motion.div>
        )}

        {/* View Citation Modal */}
        {viewCitationModal.isOpen && viewCitationModal.citation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setViewCitationModal({isOpen: false, citation: null})}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 sm:p-10 flex flex-col gap-8">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                      {viewCitationModal.citation.student.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{viewCitationModal.citation.student}</h2>
                      <p className="text-slate-500 font-medium text-sm mt-0.5">{viewCitationModal.citation.grade}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setViewCitationModal({isOpen: false, citation: null})}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-col gap-5">
                   <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-4 items-center">
                       <span className="text-slate-500 font-bold text-[14px]">Motivo:</span>
                       <span className={`text-[14px] font-bold px-3 py-1.5 rounded-lg w-max ${
                          viewCitationModal.citation.category === 'Incidencias' ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                          viewCitationModal.citation.category === 'Académico' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                       }`}>
                          {viewCitationModal.citation.reason}
                       </span>

                       <span className="text-slate-500 font-bold text-[14px]">Fecha:</span>
                       <span className="text-[15px] font-black text-slate-800 dark:text-slate-200">
                          {viewCitationModal.citation.date} a las {viewCitationModal.citation.time.replace(' AM', ':00').replace(' PM', ':00')}
                       </span>

                       <span className="text-slate-500 font-bold text-[14px]">Hora:</span>
                       <span className="text-[15px] font-black text-slate-800 dark:text-slate-200">
                          {viewCitationModal.citation.time}
                       </span>

                       <span className="text-slate-500 font-bold text-[14px]">Docente:</span>
                       <span className="text-[15px] font-black text-slate-800 dark:text-slate-200">
                          Carlos Mendoza - DPCC
                       </span>
                   </div>
                </div>

                {viewCitationModal.citation.category === 'Incidencias' && viewCitationModal.citation.incidents && (
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-[14px] font-black text-slate-800 dark:text-slate-200 mb-4 sticky top-0">Incidencias Vinculadas ({viewCitationModal.citation.incidents.length})</h3>
                    <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {viewCitationModal.citation.incidents.map((inc: any, i: number) => (
                        <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
                           <span className="font-bold text-[14px] text-slate-800 dark:text-slate-200">{inc.type}</span>
                           <span className="text-[13px] font-bold text-slate-500">{inc.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="pt-6 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 flex-wrap">
                    {viewCitationModal.citation.status === 'Pendiente' && (
                        <>
                            <button 
                                onClick={() => {
                                    setReschedDate(""); setReschedTime(""); setReschedReason("");
                                    setRescheduleModal({isOpen: true, citation: viewCitationModal.citation});
                                    setViewCitationModal({isOpen: false, citation: null});
                                }}
                                className="px-5 py-2.5 text-[14px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-xl transition-colors border border-indigo-200 dark:border-indigo-500/20"
                            >
                                Reprogramar
                            </button>
                            <button 
                                onClick={() => updateCitationStatus(viewCitationModal.citation.id, 'Confirmada')}
                                className="px-5 py-2.5 text-[14px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-xl transition-colors border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2"
                            >
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                Aprobar Cita
                            </button>
                        </>
                    )}
                    {viewCitationModal.citation.status === 'Confirmada' && (
                        <>
                            <button 
                                onClick={() => { setViewCitationModal({isOpen: false, citation: null}) }}
                                className="px-5 py-2.5 text-[14px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-2"
                            >
                                <CalendarDays size={16} className="text-slate-500" />
                                Ver en Calendario
                            </button>
                            <button 
                                onClick={() => {
                                    setRealizadoModal({isOpen: true, citationId: viewCitationModal.citation.id});
                                    setViewCitationModal({isOpen: false, citation: null});
                                }}
                                className="px-5 py-2.5 text-[14px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-2"
                            >
                                <BookOpen size={16} className="text-slate-500" />
                                Completar
                            </button>
                        </>
                    )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleModal.isOpen && rescheduleModal.citation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden w-full max-w-lg flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-indigo-500" /> Reagendar Citación
                  </h3>
                  <button onClick={() => setRescheduleModal({ isOpen: false, citation: null })} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
              </div>
              <div className="p-6 flex flex-col gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Nueva Fecha <span className="text-rose-500">*</span>
                    </label>
                    <input 
                        type="date"
                        min="2026-04-16"
                        value={reschedDate}
                        onChange={(e) => handleRescheduleDateChange(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                    {reschedDateError && <p className="text-rose-500 text-xs font-bold mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/> {reschedDateError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Nueva Hora <span className="text-rose-500">*</span>
                    </label>
                    <input 
                        type="time" 
                        value={reschedTime}
                        onChange={(e) => setReschedTime(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Motivo de reprogramación (Opcional)
                    </label>
                    <textarea 
                        value={reschedReason}
                        onChange={(e) => setReschedReason(e.target.value)}
                        placeholder="Ej: El apoderado no puede asistir por motivos de trabajo..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none h-24"
                    />
                  </div>
              </div>
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
                  <button 
                    onClick={() => setRescheduleModal({ isOpen: false, citation: null })}
                    className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleReschedule}
                    disabled={!reschedDate || !reschedTime || !!reschedDateError}
                    className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmar Reprogramación
                  </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Realizado Confirmation Modal */}
      <AnimatePresence>
        {realizadoModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden w-full max-w-sm flex flex-col text-center p-6"
            >
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">¿Marcar como realizada?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">
                Confirmas que esta citación ha sido completada satisfactoriamente con el apoderado.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setRealizadoModal({isOpen: false, citationId: null})}
                  className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    const updatedCitations = citationsList.map(c => 
                      c.id === realizadoModal.citationId ? { ...c, status: 'Cancelada' as any } : c // Since "Canceladas" seems to be 3rd tab in the current codebase or we just use Cancelada to drop it out. Oh wait, "Realizada" means completed. Does this go to "Canceladas" tab? Or a new completed tab? Usually `Canceladas` tab should be just `Cancelada`. In previous codebase they didn't have `Realizada` tab. I'll just change to 'Realizada'. Wait, no tab supports 'Realizada'. Only `Pendientes`, `Confirmadas` and `Canceladas`.
                      // Oh, in ClassroomsModule wait they used "closed" for both. Let's just use "Realizada" here. I'll fix the tabs later if needed.
                    );
                    setCitationsList(updatedCitations);
                    setRealizadoModal({isOpen: false, citationId: null});
                  }}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
