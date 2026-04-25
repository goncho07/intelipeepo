import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  Search,
  ChevronLeft,
  Users,
  PieChart as PieChartIcon,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  School,
  XCircle,
  Clock,
  Download,
  LayoutGrid,
  ShieldCheck,
  X,
  Check,
  CheckCheck,
  Info,
  Calendar,
  User,
  ChevronDown,
  ChevronRight,
  Filter,
  ShieldAlert,
  Palette,
  BookOpen,
  FileText,
  FileDown,
  CalendarDays,
  CalendarRange,
  Layers,
  Folder,
  Eye,
  GraduationCap,
  ExternalLink,
  MessageCircle,
  Bell,
  ArrowLeft,
  UserCheck,
  MonitorPlay,
  Mail,
  Send,
  BookUser,
  Edit2,
  Archive,
  Megaphone,
  AlertCircle,
  SquarePen
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  EDUCATIONAL_STRUCTURE,
  MOCK_USERS,
  INCIDENT_TYPES,
  APP_CONFIG,
} from "../constants";
import { UserItem } from "../types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PageHeader, containerVariants } from "../components/UI";
import {
  CustomCalendar,
  getDateFromWeekString,
  getWeekString,
} from "../src/components/CustomCalendar";
import {
  ReportHistoryItem,
  getFolderStyle,
  ReportPreviewModal,
} from "../components/ReportShared";

const COLORS = [
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
];

const MONTHS = [
  { value: 2, label: "Marzo" },
  { value: 3, label: "Abril" },
  { value: 4, label: "Mayo" },
  { value: 5, label: "Junio" },
  { value: 6, label: "Julio" },
  { value: 7, label: "Agosto" },
  { value: 8, label: "Septiembre" },
  { value: 9, label: "Octubre" },
  { value: 10, label: "Noviembre" },
  { value: 11, label: "Diciembre" },
];

import { ModuleProps } from "../types";

const getAuxiliarForClassroom = (
  level: string,
  grade: string,
  section: string,
) => {
  if (level === "Secundaria") {
    if (grade === "1° Grado" || grade === "2° Grado") {
      return grade === "1° Grado" ? "Carlos Mendoza" : "Ana Rojas";
    } else if (grade === "3° Grado" || grade === "4° Grado") {
      return grade === "3° Grado" ? "Luis Ramirez" : "Carmen Vega";
    } else if (grade === "5° Grado") {
      return ["A", "B"].includes(section) ? "Jorge Silva" : "Rosa Paredes";
    }
  } else if (level === "Primaria") {
    return "María Fernandez";
  }
  return "Juana Perez";
};

export const ClassroomsModule: React.FC<ModuleProps> = ({
  onNavigate,
  onRegisterIncident,
  parentViewStudentId,
}) => {
  const [selectedClassroom, setSelectedClassroom] = useState<{
    level: string;
    grade: string;
    section: string;
  } | null>(null);
  
  const [selectedLevel, setSelectedLevel] = useState<string>("Todos");
  const [selectedGrade, setSelectedGrade] = useState<string>("Todos");

  const [selectedStudent, setSelectedStudent] = useState<UserItem | null>(
    () => {
      if (parentViewStudentId) {
        return MOCK_USERS.find((u) => u.id === parentViewStudentId) || null;
      }
      return null;
    },
  );
  const [showHistoryDirectly, setShowHistoryDirectly] = useState(false);

  // Form states for comunicado
  const [isComunicadoModalOpen, setIsComunicadoModalOpen] = useState(false);
  const [comunicadoDestino, setComunicadoDestino] = useState("");
  const [comunicadoMotivo, setComunicadoMotivo] = useState<"Urgente" | "Informativo" | "Recordatorio" | "">("");
  const [comunicadoMensaje, setComunicadoMensaje] = useState("");
  const [hideTeacherNameComunicado, setHideTeacherNameComunicado] = useState(false);

  const handleOpenComunicado = (level: string, grade: string, section: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setComunicadoDestino(`${grade} ${section}`);
    setIsComunicadoModalOpen(true);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="h-full flex flex-col font-poppins"
    >
      {!parentViewStudentId && (
        <PageHeader
          title="Aulas"
          subtitle="Seleccione un aula para ver sus detalles y estudiantes"
          icon={LayoutGrid}
        />
      )}
      <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
        {selectedStudent ? (
          <StudentDetail
            student={selectedStudent}
            onBack={() => {
              if (!parentViewStudentId) {
                setSelectedStudent(null);
              }
            }}
            isParentView={!!parentViewStudentId}
          />
        ) : selectedClassroom ? (
          <ClassroomDetail
            classroom={selectedClassroom}
            onBack={() => {
              setSelectedClassroom(null);
              setShowHistoryDirectly(false);
            }}
            onLevelClick={() => {
              setSelectedClassroom(null);
              setShowHistoryDirectly(false);
              setSelectedGrade("Todos");
            }}
            onGradeClick={() => {
              setSelectedClassroom(null);
              setShowHistoryDirectly(false);
            }}
            onSelectStudent={setSelectedStudent}
            initialShowHistory={showHistoryDirectly}
          />
        ) : (
          <ClassroomList
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            onSelectClassroom={(c) => {
              setSelectedClassroom(c);
              setShowHistoryDirectly(false);
            }}
            onSelectClassroomHistory={(c) => {
              setSelectedClassroom(c);
              setShowHistoryDirectly(true);
            }}
            onRegisterIncident={onRegisterIncident}
            onOpenComunicado={handleOpenComunicado}
          />
        )}
      </div>

      <AnimatePresence>
        {isComunicadoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#f8fafd] dark:bg-slate-900 rounded-[32px] shadow-2xl w-full max-w-[500px] overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3 text-[#041e49] dark:text-white">
                  <Megaphone size={24} className="fill-current text-blue-500" />
                  <h3 className="text-xl font-bold">Enviar Comunicado</h3>
                </div>
                <button 
                  onClick={() => setIsComunicadoModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                {/* Destinatario */}
                <div className="bg-white dark:bg-slate-800 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
                    <label className="block text-[12px] font-black text-[#041e49] dark:text-blue-300 uppercase tracking-widest mb-4">Destinatario</label>
                    <div className="relative">
                        <select
                            value={comunicadoDestino}
                            onChange={(e) => setComunicadoDestino(e.target.value)}
                            className="w-full pl-5 pr-12 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-orange-500 hover:border-orange-400 dark:focus:border-orange-500 rounded-[20px] text-[15px] font-bold text-slate-800 dark:text-slate-200 appearance-none focus:ring-0 outline-none transition-colors cursor-pointer"
                        >
                            <option value="" disabled>Seleccione un aula...</option>
                            <option value={comunicadoDestino}>{comunicadoDestino}</option>
                            <option value="Todas las Aulas">Todas las Aulas</option>
                            <option value="3° Grado">3° Grado</option>
                            <option value="4° Grado">4° Grado</option>
                            <option value="5° Grado">5° Grado</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20}/>
                    </div>
                </div>
                
                {/* Motivo */}
                <div className="bg-white dark:bg-slate-800 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col gap-4">
                    <label className="block text-[12px] font-black text-[#041e49] dark:text-blue-300 uppercase tracking-widest">Motivo del Comunicado</label>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => setComunicadoMotivo('Urgente')}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${comunicadoMotivo === 'Urgente' ? 'border-rose-500/50 bg-rose-50/50 dark:bg-rose-900/10' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 dark:border-slate-700/50 dark:bg-slate-800/30'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${comunicadoMotivo === 'Urgente' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-white border border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-600'}`}>
                                <AlertTriangle size={20} />
                            </div>
                            <span className="font-bold text-[15px] text-slate-700 dark:text-slate-200">Urgente</span>
                        </button>
                        
                        <button 
                            onClick={() => setComunicadoMotivo('Informativo')}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${comunicadoMotivo === 'Informativo' ? 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 dark:border-slate-700/50 dark:bg-slate-800/30'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${comunicadoMotivo === 'Informativo' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-white border border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-600'}`}>
                                <Info size={20} />
                            </div>
                            <span className="font-bold text-[15px] text-slate-700 dark:text-slate-200">Informativo</span>
                        </button>
                        
                        <button 
                            onClick={() => setComunicadoMotivo('Recordatorio')}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${comunicadoMotivo === 'Recordatorio' ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-900/10' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 dark:border-slate-700/50 dark:bg-slate-800/30'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${comunicadoMotivo === 'Recordatorio' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-white border border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-600'}`}>
                                <Megaphone size={20} />
                            </div>
                            <span className="font-bold text-[15px] text-slate-700 dark:text-slate-200">Recordatorio</span>
                        </button>
                    </div>
                </div>
                
                {/* Cuerpo y Preview */}
                <div className="bg-white dark:bg-slate-800 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col gap-4">
                    <label className="block text-[12px] font-black text-[#041e49] dark:text-blue-300 uppercase tracking-widest">Cuerpo del Mensaje</label>
                    <textarea
                        value={comunicadoMensaje}
                        onChange={(e) => setComunicadoMensaje(e.target.value)}
                        placeholder="Estimados apoderados, les comunicamos que..."
                        className="w-full p-5 bg-[#f8fafd] dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-[15px] font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none min-h-[140px]"
                    />
                    
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            onClick={() => setHideTeacherNameComunicado(!hideTeacherNameComunicado)}
                            className={`w-11 h-6 rounded-full flex items-center transition-colors relative shrink-0 ${hideTeacherNameComunicado ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform absolute ${hideTeacherNameComunicado ? 'translate-x-6' : 'translate-x-[4px]'}`} />
                        </button>
                        <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                            Ocultar nombre del docente en el mensaje
                        </span>
                    </div>

                    <div className="w-full bg-[#efeae2] dark:bg-[#0b141a] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col shrink-0 relative overflow-hidden mt-6 shadow-sm">
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

                        <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.06] pointer-events-none mt-[54px] z-0" style={{
                           backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
                           backgroundSize: '400px'
                        }}></div>

                        <div className="p-4 flex flex-col gap-3 relative z-10 custom-scrollbar pb-6 max-h-[350px] overflow-y-auto w-full">
                           <div className="self-center bg-[#E1F3FB] dark:bg-[#182229] text-slate-500 dark:text-slate-400 text-[11px] font-medium px-3 py-1 rounded-md shadow-sm mb-2 uppercase tracking-wide">
                              Hoy
                           </div>
                           
                           <div className="bg-white dark:bg-[#202c33] rounded-lg rounded-tl-none p-2 shadow-sm max-w-[92%] relative z-10 text-left self-start">
                              <svg viewBox="0 0 8 13" width="8" height="13" className="absolute -left-[8px] top-0 text-white dark:text-[#202c33]">
                                 <path fill="currentColor" d="M1.533,3.568L8,12.193V1H2.812C1.042,1,0.474,2.156,1.533,3.568z"></path>
                              </svg>

                              <div className="text-[14px] leading-[1.35] whitespace-pre-wrap break-words text-[#111b21] dark:text-[#e9edef] p-1 pb-4 relative">
                                 {comunicadoMotivo && <p className="font-bold flex items-center gap-2 mb-2">
                                    {comunicadoMotivo === 'Urgente' ? '⚠️' : comunicadoMotivo === 'Informativo' ? 'ℹ️' : '🔔'} Comunicado {comunicadoMotivo}
                                 </p>}
                                 <p className={`${comunicadoMensaje ? 'text-[#111b21] dark:text-[#e9edef]' : 'text-slate-400 dark:text-slate-500 italic'}`}>
                                    {comunicadoMensaje || 'Redacte su mensaje en el campo superior...'}
                                 </p>
                                 
                                 {(comunicadoMensaje) && (
                                   <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/50 text-[13.5px]">
                                     <p>Atentamente,</p>
                                     {!hideTeacherNameComunicado && <p className="font-bold mt-1">Carlos Mendoza</p>}
                                     <p className={`${hideTeacherNameComunicado ? 'font-bold mt-1' : 'italic opacity-80 text-[12.5px]'}`}>Docente del curso de DPCC</p>
                                   </div>
                                 )}
                                 <div className="absolute bottom-0 right-0 text-[11px] text-[#667781] dark:text-[#8696a0] font-medium mt-1.5 flex justify-end items-center gap-1 pb-0.5">
                                    {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} 
                                 </div>
                              </div>
                           </div>
                        </div>
                    </div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-between">
                <button 
                  onClick={() => setIsComunicadoModalOpen(false)}
                  className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  className={`flex items-center gap-2 font-bold px-8 py-3 rounded-xl transition-all ${comunicadoDestino && comunicadoMotivo && comunicadoMensaje ? 'bg-[#c2e7ff] text-[#041e49] hover:bg-[#b5dfff] hover:shadow-md dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500' : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'}`}
                  disabled={!comunicadoDestino || !comunicadoMotivo || !comunicadoMensaje}
                >
                    <Send size={18} />
                    <span>Enviar</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ClassroomList: React.FC<{
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  onSelectClassroom: (c: {
    level: string;
    grade: string;
    section: string;
  }) => void;
  onSelectClassroomHistory: (c: {
    level: string;
    grade: string;
    section: string;
  }) => void;
  onRegisterIncident?: () => void;
  onOpenComunicado: (level: string, grade: string, section: string, e: React.MouseEvent) => void;
}> = ({ selectedLevel, setSelectedLevel, selectedGrade, setSelectedGrade, onSelectClassroom, onSelectClassroomHistory, onRegisterIncident, onOpenComunicado }) => {
  const [isDesglosado, setIsDesglosado] = useState(false);

  const getMockClassroomKPIs = (
    level: string,
    grade: string,
    section: string,
  ) => {
    const hash = (level + grade + section)
      .split("")
      .reduce((a, b) => a + b.charCodeAt(0), 0);
    const attendance = 85 + (hash % 16); // 85% to 100%
    const alerts = hash % 4; // 0 to 3
    const capacity = 30;
    return { attendance, alerts, capacity };
  };

  return (
    <div className="flex-1 overflow-hidden min-h-0 flex flex-col pt-1">
      {/* CONTENIDO PRINCIPAL */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden h-full relative">
        <div className="flex-1 overflow-auto bg-gray-50/30 dark:bg-slate-900/50">
          {selectedLevel === "Todos" ? (
            <div className="animate-in fade-in duration-300">
              <div className="bg-[#f0f4f8] dark:bg-slate-800/50 rounded-t-2xl p-6 sm:p-8 border-b border-gray-200 dark:border-slate-700 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  <button
                    disabled
                    className="flex-shrink-0 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <ArrowLeft className="w-6 h-6 text-slate-400 dark:text-slate-500" strokeWidth={3} />
                  </button>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                      Selecciona tu nivel educativo
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-base font-medium">
                      Explora las estadísticas y gestiona las secciones por nivel
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-b-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
                  {Object.keys(EDUCATIONAL_STRUCTURE).map((level, index) => {
                    const gradeCount = Object.keys(
                      EDUCATIONAL_STRUCTURE[
                        level as keyof typeof EDUCATIONAL_STRUCTURE
                      ],
                    ).length;
                    const sectionCount = Object.values(
                      EDUCATIONAL_STRUCTURE[
                        level as keyof typeof EDUCATIONAL_STRUCTURE
                      ],
                    ).reduce((acc, sections) => acc + sections.length, 0);

                    const studentsCount =
                      level === "Inicial"
                        ? 280
                        : level === "Primaria"
                          ? 532
                          : 952;
                    const teachersCount =
                      level === "Inicial" ? 36 : level === "Primaria" ? 38 : 43;

                    const style =
                      level === "Inicial"
                        ? {
                            bg: "bg-purple-50/80 dark:bg-purple-900/20",
                            border:
                              "border-purple-200 dark:border-purple-800/50 hover:border-purple-400 dark:hover:border-purple-500/80",
                            badgeTheme:
                              "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
                            icon: "artist-palette.svg",
                            shadow: "hover:shadow-purple-500/20",
                          }
                        : level === "Primaria"
                          ? {
                              bg: "bg-blue-50/80 dark:bg-blue-900/20",
                              border:
                                "border-blue-200 dark:border-blue-800/50 hover:border-blue-400 dark:hover:border-blue-500/80",
                              badgeTheme:
                                "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
                              icon: "open-book.svg",
                              shadow: "hover:shadow-blue-500/20",
                            }
                          : {
                              bg: "bg-orange-50/80 dark:bg-orange-900/20",
                              border:
                                "border-orange-200 dark:border-orange-800/50 hover:border-orange-400 dark:hover:border-orange-500/80",
                              badgeTheme:
                                "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
                              icon: "graduation-cap.svg",
                              shadow: "hover:shadow-orange-500/20",
                            };

                    return (
                      <motion.button
                        key={level}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedLevel(level)}
                        className={`flex flex-col items-center justify-center p-8 ${style.bg} rounded-[32px] border-2 ${style.border} ${style.shadow} transition-all duration-300 overflow-hidden group relative text-center`}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 dark:bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-150 duration-500"></div>

                        <div className="relative w-32 h-32 mb-6 drop-shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                          <img
                            src={`https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/${style.icon}`}
                            alt={level}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/school.svg";
                            }}
                          />
                        </div>

                        <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-6 tracking-tight">
                          {level}
                        </h3>

                            <div className="flex flex-col justify-center items-center gap-1 w-full bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-3 sm:p-4 backdrop-blur-md border border-slate-100 dark:border-slate-700/50 transition-all group-hover:bg-blue-50/50 dark:group-hover:bg-slate-800/80 shadow-sm mt-auto mx-auto relative z-10 px-4 sm:px-5">
                              <div className="flex flex-col w-full relative z-10">
                                <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-700/60 text-sm w-full">
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                                    <Users size={18} strokeWidth={2} className="text-slate-500" />
                                    <span>Alumnos:</span>
                                  </div>
                                  <span className="font-bold text-slate-900 dark:text-white text-base">{studentsCount}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 text-sm w-full">
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                                    <BookUser size={18} strokeWidth={2} className="text-slate-500" />
                                    <span>Docentes:</span>
                                  </div>
                                  <span className="font-bold text-slate-900 dark:text-white text-base">{teachersCount}</span>
                                </div>
                              </div>
                              <div className="flex items-center border-t border-slate-200/50 dark:border-slate-700/50 pt-2 w-full justify-center text-center mt-1">
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
                                  {gradeCount} grados · {sectionCount} secciones
                                </p>
                              </div>
                            </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : selectedGrade === "Todos" ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-[#f0f4f8] dark:bg-slate-800/50 rounded-t-2xl p-6 sm:p-8 border-b border-gray-200 dark:border-slate-700 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  <button
                    onClick={() => setSelectedLevel("Todos")}
                    className="flex-shrink-0 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 dark:hover:text-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group"
                  >
                    <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
                  </button>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                      Selecciona el grado académico
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-base font-medium">
                      Explora las aulas y estudiantes del nivel{" "}
                      {selectedLevel.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-b-2xl p-6 sm:p-8 border border-gray-200 dark:border-slate-700 shadow-sm">
                {isDesglosado ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
                    {Object.entries(
                      EDUCATIONAL_STRUCTURE[
                        selectedLevel as keyof typeof EDUCATIONAL_STRUCTURE
                      ],
                    ).flatMap(([grade, sections]) =>
                      sections.map((section, index) => {
                        const studentCount = MOCK_USERS.filter(
                          (u) =>
                            u.role === "Estudiante" &&
                            u.level === selectedLevel &&
                            u.grade === grade &&
                            u.section === section,
                        ).length;
                        const tutor = MOCK_USERS.find(
                          (u) =>
                            u.role === "Docente" &&
                            u.level === selectedLevel &&
                            u.grade === grade &&
                            u.section === section,
                        );
                        const isInicial = selectedLevel === "Inicial";
                        return (
                            <motion.div
                              key={`${grade}-${section}`}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ y: -4 }}
                              onClick={() =>
                                onSelectClassroom({
                                  level: selectedLevel,
                                  grade,
                                  section,
                                })
                              }
                              className="group relative bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[24px] border-2 border-gray-100 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col items-center text-center cursor-pointer max-w-sm mx-auto w-full"
                            >
                              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-150 duration-500"></div>

                              <div className="relative w-24 h-24 mb-6 drop-shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 shrink-0">
                                <img
                                  src={`https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/${getFluentClassroomIcon(section)}`}
                                  alt="Classroom"
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/open-book.svg";
                                  }}
                                />
                              </div>

                              <div className="w-full flex-1 flex flex-col">
                                <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0">
                                  {isInicial
                                    ? grade.replace(/Años/i, "AÑOS")
                                    : grade.replace("° Grado", "°")}{" "}
                                  {section}
                               </h4>

                              <div className="flex flex-col justify-center items-center gap-1 w-full bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-3 sm:p-4 backdrop-blur-md border border-slate-100 dark:border-slate-700/50 transition-all group-hover:bg-blue-50/50 dark:group-hover:bg-slate-800/80 shadow-sm mx-auto relative z-10 shrink-0 px-4 sm:px-5">
                                <div className="flex flex-col w-full relative z-10">
                                  <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-700/60 text-sm w-full">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                                      <Users size={18} strokeWidth={2} className="text-slate-500" />
                                      <span>Alumnos:</span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white text-base">{studentCount || 28}</span>
                                  </div>
                                  <div className="flex items-center justify-between py-2 text-sm w-full">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                                      <BookUser size={18} strokeWidth={2} className="text-slate-500" />
                                      <span>Tutor:</span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white text-base truncate ml-2 text-right" title={tutor ? tutor.name : "No asignado"}>
                                      {tutor ? (() => {
                                        const p = tutor.name.split(' ');
                                        return p.length > 1 ? `${p[0]}. ${p[1][0]}` : p[0];
                                      })() : 'S/N'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-3 w-full mt-6 shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectClassroomHistory({
                                      level: selectedLevel,
                                      grade,
                                      section,
                                    });
                                  }}
                                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-50/90 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all font-semibold text-base text-slate-900 dark:text-white shadow-sm group-hover:border-amber-300"
                                >
                                  <img
                                    src="https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/file-folder.svg"
                                    alt="Folder"
                                    className="w-5 h-5 object-contain"
                                  />
                                  <span>Reportes</span>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onRegisterIncident)
                                      onRegisterIncident();
                                  }}
                                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-50/80 dark:bg-rose-900/10 rounded-xl border border-rose-200 dark:border-rose-800/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all font-semibold text-base text-slate-900 dark:text-white shadow-sm group-hover:border-rose-300"
                                >
                                  <img
                                    src="https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/warning.svg"
                                    alt="Warning"
                                    className="w-5 h-5 object-contain"
                                  />
                                  <span>Incidencia</span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      }),
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
                    {Object.entries(
                      EDUCATIONAL_STRUCTURE[
                        selectedLevel as keyof typeof EDUCATIONAL_STRUCTURE
                      ],
                    ).map(([grade, sections], index) => {
                      const totalStudents = sections.reduce((acc, section) => {
                        return (
                          acc +
                          MOCK_USERS.filter(
                            (u) =>
                              u.role === "Estudiante" &&
                              u.level === selectedLevel &&
                              u.grade === grade &&
                              u.section === section,
                          ).length
                        );
                      }, 0);
                      const totalTeachers = sections.reduce((acc, section) => {
                        return (
                          acc +
                          MOCK_USERS.filter(
                            (u) =>
                              u.role === "Docente" &&
                              u.level === selectedLevel &&
                              u.grade === grade &&
                              u.section === section,
                          ).length
                        );
                      }, 0);

                      return (
                        <motion.button
                          key={grade}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedGrade(grade)}
                          className="group relative bg-white dark:bg-slate-800 p-8 rounded-[24px] border-2 border-gray-100 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col items-center text-center"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-150 duration-500"></div>

                          <div className="relative w-24 h-24 mb-5 drop-shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                            <img
                              src="https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/books.svg"
                              alt="Grade"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/open-book.svg";
                              }}
                            />
                          </div>

                          <div className="w-full mt-auto">
                            <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {grade}
                            </h4>

                            <div className="flex flex-col justify-center items-center gap-1 w-full bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-3 sm:p-4 backdrop-blur-md border border-slate-100 dark:border-slate-700/50 transition-all group-hover:bg-blue-50/50 dark:group-hover:bg-slate-800/80 shadow-sm mt-auto mx-auto relative z-10 px-4 sm:px-5">
                              <div className="flex flex-col w-full text-sm relative z-10">
                                <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-700/60 w-full">
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                                    <Users size={18} strokeWidth={2} className="text-slate-500" />
                                    <span>Alumnos:</span>
                                  </div>
                                  <span className="font-bold text-slate-900 dark:text-white text-base">{totalStudents || (index + 1) * 28}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-700/60 w-full">
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                                    <BookUser size={18} strokeWidth={2} className="text-slate-500" />
                                    <span>Docentes:</span>
                                  </div>
                                  <span className="font-bold text-slate-900 dark:text-white text-base">{totalTeachers || sections.length}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 w-full">
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                                    <UserCheck size={18} strokeWidth={2} className="text-slate-500" />
                                    <span>Auxiliares:</span>
                                  </div>
                                  <span className="font-bold text-slate-900 dark:text-white text-base">{Math.max(1, Math.ceil((totalStudents || (index + 1) * 28) / 30))}</span>
                                </div>
                              </div>
                              <div className="flex items-center border-t border-slate-200/50 dark:border-slate-700/50 pt-2 w-full justify-center text-center mt-1">
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
                                  {sections.length} secciones activas
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-[#f0f4f8] dark:bg-slate-800/50 rounded-t-2xl p-6 sm:p-8 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  <button
                    onClick={() => setSelectedGrade("Todos")}
                    className="flex-shrink-0 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 dark:hover:text-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group"
                  >
                    <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
                  </button>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                      Selecciona el aula académica
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-base font-medium">
                      Explora las secciones de {selectedGrade} de{" "}
                      {selectedLevel.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-b-2xl p-6 sm:p-8 border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
                  {/* @ts-ignore */}
                  {EDUCATIONAL_STRUCTURE[selectedLevel][selectedGrade].map(
                    (section, index) => {
                      const studentCount = MOCK_USERS.filter(
                        (u) =>
                          u.role === "Estudiante" &&
                          u.level === selectedLevel &&
                          u.grade === selectedGrade &&
                          u.section === section,
                      ).length;
                      const tutor = MOCK_USERS.find(
                        (u) =>
                          u.role === "Docente" &&
                          u.level === selectedLevel &&
                          u.grade === selectedGrade &&
                          u.section === section,
                      );

                      const isInicial = selectedLevel === "Inicial";

                      return (
                        <motion.div
                          key={`${selectedGrade}-${section}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -4 }}
                          onClick={() =>
                            onSelectClassroom({
                              level: selectedLevel,
                              grade: selectedGrade,
                              section,
                            })
                          }
                          className="group relative bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[24px] border-2 border-gray-100 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col items-center text-center cursor-pointer max-w-sm mx-auto w-full"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-150 duration-500"></div>

                          <div className="relative w-24 h-24 mb-6 drop-shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 shrink-0">
                            <img
                              src={`https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/${getFluentClassroomIcon(section)}`}
                              alt="Classroom"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/open-book.svg";
                              }}
                            />
                          </div>

                          <div className="w-full flex-1 flex flex-col">
                            <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0">
                              {isInicial
                                ? selectedGrade.replace(/Años/i, "AÑOS")
                                : selectedGrade.replace("° Grado", "°")}{" "}
                              {section}
                            </h4>

                              <div className="flex flex-col justify-center items-center gap-1 w-full bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-3 sm:p-4 backdrop-blur-md border border-slate-100 dark:border-slate-700/50 transition-all group-hover:bg-blue-50/50 dark:group-hover:bg-slate-800/80 shadow-sm mx-auto relative z-10 shrink-0 px-4 sm:px-5">
                                <div className="flex flex-col w-full relative z-10">
                                  <div className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-700/60 text-sm w-full">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                                      <Users size={18} strokeWidth={2} className="text-slate-500" />
                                      <span>Alumnos:</span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white text-base">{studentCount || 28}</span>
                                  </div>
                                  <div className="flex items-center justify-between py-2 text-sm w-full">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                                      <BookUser size={18} strokeWidth={2} className="text-slate-500" />
                                      <span>Tutor:</span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white text-base truncate ml-2 text-right" title={tutor ? tutor.name : "No asignado"}>
                                      {tutor ? (() => {
                                        const p = tutor.name.split(' ');
                                        return p.length > 1 ? `${p[0]}. ${p[1][0]}` : p[0];
                                      })() : "No asignado"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-3 w-full mt-6 shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectClassroomHistory({
                                      level: selectedLevel,
                                      grade: selectedGrade,
                                      section,
                                    });
                                  }}
                                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-50/90 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all font-semibold text-base text-slate-900 dark:text-white shadow-sm group-hover:border-amber-300"
                                >
                                  <img
                                    src="https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/file-folder.svg"
                                    alt="Folder"
                                    className="w-5 h-5 object-contain"
                                  />
                                  <span>Reportes</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onRegisterIncident) onRegisterIncident();
                                  }}
                                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-50/80 dark:bg-rose-900/10 rounded-xl border border-rose-200 dark:border-rose-800/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all font-semibold text-base text-slate-900 dark:text-white shadow-sm group-hover:border-rose-300"
                                >
                                  <img
                                    src="https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/warning.svg"
                                    alt="Warning"
                                    className="w-5 h-5 object-contain"
                                  />
                                  <span>Incidencia</span>
                                </button>
                              </div>
                          </div>
                        </motion.div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getScopedReportsHistory = (classroom: {
  level: string;
  grade: string;
  section: string;
}) => {
  const reports: ReportHistoryItem[] = [];
  let id = 1;
  const REPORT_TYPES = ["Diario", "Semanal", "Mensual", "Bimestral"];

  REPORT_TYPES.forEach((type) => {
    if (type === "Diario") {
      const days = [
        { day: "Lunes 16", date: "16 mar 2026" },
        { day: "Martes 17", date: "17 mar 2026" },
        { day: "Miércoles 18", date: "18 mar 2026" },
        { day: "Jueves 19", date: "19 mar 2026" },
        { day: "Viernes 20", date: "20 mar 2026" },
      ];
      days.forEach(({ day, date }) => {
        reports.push({
          id: id++,
          type,
          title: `Reporte Diario - ${day} de Marzo`,
          date,
          level: classroom.level,
          grade: classroom.grade,
          section: classroom.section,
          size: `${(Math.random() * 1 + 0.5).toFixed(1)} MB`,
          progress: 100,
        });
      });
    } else if (type === "Semanal") {
      const weeks = [
        { title: "Semana 12", date: "Marzo 2026" },
        { title: "Semana 13", date: "Marzo 2026" },
        { title: "Semana 14", date: "Marzo 2026" },
      ];
      weeks.forEach((week) => {
        reports.push({
          id: id++,
          type,
          title: `Reporte Semanal - ${week.title}`,
          date: week.date,
          level: classroom.level,
          grade: classroom.grade,
          section: classroom.section,
          size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
          progress: 100,
        });
      });
    } else if (type === "Mensual") {
      const months = ["Enero", "Febrero", "Marzo"];
      months.forEach((month) => {
        reports.push({
          id: id++,
          type,
          title: `Reporte Mensual - ${month}`,
          date: `${month} 2026`,
          level: classroom.level,
          grade: classroom.grade,
          section: classroom.section,
          size: `${(Math.random() * 3 + 2).toFixed(1)} MB`,
          progress: 100,
        });
      });
    } else if (type === "Bimestral") {
      const bimesters = [
        { title: "I Bimestre", date: "16-03-2026 al 15-05-2026" },
      ];
      bimesters.forEach((bimester) => {
        reports.push({
          id: id++,
          type,
          title: `Reporte Bimestral - ${bimester.title}`,
          date: bimester.date,
          level: classroom.level,
          grade: classroom.grade,
          section: classroom.section,
          size: `${(Math.random() * 5 + 3).toFixed(1)} MB`,
          progress: 100,
        });
      });
    }
  });
  return reports;
};

const ClassroomReportsHistory: React.FC<{
  classroom: { level: string; grade: string; section: string };
  onBack: () => void;
  onDownloadReport: (
    type: "Asistencia" | "Incidencias",
    period: "Día" | "Semana" | "Mes" | "Bimestre",
    month?: number,
    bimestre?: number,
  ) => void;
}> = ({ classroom, onBack, onDownloadReport }) => {
  const [historyPath, setHistoryPath] = useState<string[]>([]);
  const [previewReport, setPreviewReport] = useState<ReportHistoryItem | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const week = Math.ceil(
      Math.floor(
        (d.getTime() - new Date(year, 0, 1).getTime()) / (24 * 60 * 60 * 1000),
      ) / 7,
    );
    return `${year}-W${week.toString().padStart(2, "0")}`;
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedBimestre, setSelectedBimestre] = useState("1");

  const scopedReports = useMemo(
    () => getScopedReportsHistory(classroom),
    [classroom],
  );

  const currentFolderContent = useMemo(() => {
    if (historyPath.length === 0) {
      return {
        type: "folders",
        items: ["Diario", "Semanal", "Mensual", "Bimestral"],
      };
    }

    const currentFolder = historyPath[historyPath.length - 1];
    return {
      type: "files",
      items: scopedReports.filter((r) => r.type === currentFolder),
    };
  }, [historyPath, scopedReports]);

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const tutor = useMemo(() => {
    return MOCK_USERS.find(
      (u) =>
        u.role === "Docente" &&
        u.level === classroom.level &&
        u.grade === classroom.grade &&
        u.section === classroom.section,
    );
  }, [classroom]);

  return (
    <div className="flex-1 overflow-hidden min-h-0 flex flex-col pt-1">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden h-full relative animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex-1 overflow-auto bg-gray-50/30 dark:bg-slate-900/50">
          <div className="bg-[#f0f4f8] dark:bg-slate-800/50 rounded-t-2xl p-6 sm:p-8 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
              <button
                onClick={historyPath.length > 0 ? () => setHistoryPath([]) : onBack}
                className="flex-shrink-0 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 dark:hover:text-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group"
              >
                <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
              </button>
              <div>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                {historyPath.length > 0
                  ? `Reportes ${
                      historyPath[0] === "Diario"
                        ? "Diarios"
                        : historyPath[0] === "Semanal"
                          ? "Semanales"
                          : historyPath[0] === "Mensual"
                            ? "Mensuales"
                            : "Bimestrales"
                    }`
                  : "Historial de Reportes"}
              </h2>
              {historyPath.length === 0 ? (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-base font-medium">
                  <span>
                    {classroom.level === "Inicial"
                      ? `${classroom.grade.replace(/Años/i, "- AÑOS").toUpperCase()} - ${classroom.section}`
                      : `${classroom.grade.replace("° Grado", "")}°${classroom.section}`}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span>{classroom.level}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-5 h-5" /> Tutor:{" "}
                    {tutor ? tutor.name : "Sin asignar"}
                  </span>
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-400 text-base font-medium mt-1">
                  {historyPath[0] === "Diario"
                    ? "Selecciona una fecha para ver los reportes de ese día."
                    : historyPath[0] === "Semanal"
                      ? "Selecciona una semana para ver los reportes."
                      : "Visualiza los reportes generados."}
                </p>
              )}
              </div>
            </div>

            {historyPath.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                {historyPath[0] === "Diario" && (
                  <div className="shrink-0 bg-white dark:bg-slate-900 rounded-xl px-2">
                    <CustomCalendar
                      mode="date"
                      value={selectedDate}
                      onChange={setSelectedDate}
                      placeholder="Seleccionar Fecha"
                      align="right"
                    />
                  </div>
                )}
                {historyPath[0] === "Semanal" && (
                  <div className="shrink-0 bg-white dark:bg-slate-900 rounded-xl px-2">
                    <CustomCalendar
                      mode="week"
                      value={selectedWeek}
                      onChange={setSelectedWeek}
                      placeholder="Seleccionar Semana"
                      align="right"
                    />
                  </div>
                )}
                {historyPath[0] === "Mensual" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="relative">
                      <select
                        value={selectedMonth}
                        onChange={(e) =>
                          setSelectedMonth(Number(e.target.value))
                        }
                        className="w-full sm:w-auto appearance-none bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all shadow-sm"
                      >
                        {monthNames.map((m, i) => (
                          <option key={i} value={i}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                    <div className="relative w-24">
                      <input
                        type="number"
                        value={selectedYear}
                        onChange={(e) =>
                          setSelectedYear(Number(e.target.value))
                        }
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-center transition-all shadow-sm"
                      />
                    </div>
                  </div>
                )}
                {historyPath[0] === "Bimestral" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="relative">
                      <select
                        value={selectedBimestre}
                        onChange={(e) => setSelectedBimestre(e.target.value)}
                        className="w-full sm:w-auto appearance-none bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all shadow-sm"
                      >
                        <option value="1">I Bimestre</option>
                        <option value="2">II Bimestre</option>
                        <option value="3">III Bimestre</option>
                        <option value="4">IV Bimestre</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                    <div className="relative w-24">
                      <input
                        type="number"
                        value={selectedYear}
                        onChange={(e) =>
                          setSelectedYear(Number(e.target.value))
                        }
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-center transition-all shadow-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-b-2xl border border-gray-200 dark:border-slate-700 p-6 md:p-8 shadow-sm">
            {currentFolderContent.type === "folders" ? (
              <div className="flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(currentFolderContent.items as string[]).map(
                    (folderName) => {
                      const style = getFolderStyle(folderName, false);
                      return (
                        <button
                          key={folderName}
                          onClick={() =>
                            setHistoryPath([...historyPath, folderName])
                          }
                          className={`group relative flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-[24px] border border-gray-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${style.borderClass}`}
                        >
                          {/* Background subtle glow on hover */}
                          <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${style.bgClass}`}
                          ></div>

                          <div className="relative w-28 h-28 mb-5 transition-transform duration-300 group-hover:scale-110 drop-shadow-sm">
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
                            <h4 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-1">
                              {folderName}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {style.subtitle}
                            </p>
                          </div>
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6 mt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentFolderContent.items.length > 0 ? (
                    (currentFolderContent.items as ReportHistoryItem[]).map(
                      (report) => {
                        const formatShortDate = (dateStr: string) => {
                          const months: Record<string, string> = {
                            ene: "01",
                            feb: "02",
                            mar: "03",
                            abr: "04",
                            may: "05",
                            jun: "06",
                            jul: "07",
                            ago: "08",
                            sep: "09",
                            oct: "10",
                            nov: "11",
                            dic: "12",
                          };
                          const match = dateStr
                            .toLowerCase()
                            .match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/);
                          if (match) {
                            return `${match[1].padStart(2, "0")}/${months[match[2]] || "01"}/${match[3].slice(2)}`;
                          }
                          return dateStr;
                        };
                        return (
                          <div
                            key={report.id}
                            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-lg transition-all group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 flex items-center justify-center shrink-0 rounded-[14px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                                  <FileText
                                    className="w-6 h-6"
                                    strokeWidth={2}
                                  />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white">
                                    {report.title}
                                  </h4>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {formatShortDate(report.date)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 mt-2">
                              <button
                                onClick={() => {
                                  const doc = new jsPDF();
                                  doc.setFontSize(18);
                                  doc.text(report.title, 14, 22);
                                  doc.setFontSize(11);
                                  doc.text(
                                    `${report.date} | ${report.level} - ${report.grade} ${report.section}`,
                                    14,
                                    30,
                                  );

                                  autoTable(doc, {
                                    startY: 40,
                                    head: [
                                      [
                                        "Estudiante",
                                        "Estado",
                                        "Hora Ingreso",
                                        "Hora Salida",
                                      ],
                                    ],
                                    body: Array.from({ length: 15 }).map(
                                      (_, i) => [
                                        `Estudiante ${i + 1}`,
                                        "Asistió",
                                        "07:45 AM",
                                        "02:00 PM",
                                      ],
                                    ),
                                  });

                                  doc.save(
                                    `${report.title.replace(/\s+/g, "_")}.pdf`,
                                  );
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/40 transition-colors text-sm font-bold"
                              >
                                <Download size={18} /> PDF
                              </button>
                              <button
                                onClick={() => {
                                  // Mock Excel download
                                  alert(
                                    `Descargando Excel para ${report.title}`,
                                  );
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30 dark:hover:bg-emerald-900/40 transition-colors text-sm font-bold"
                              >
                                <Download size={18} /> Excel
                              </button>
                            </div>
                          </div>
                        );
                      },
                    )
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <FileText size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        No hay reportes
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        No se encontraron reportes para los filtros
                        seleccionados.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <AnimatePresence>
            {previewReport && (
              <ReportPreviewModal
                report={previewReport}
                onClose={() => setPreviewReport(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export type CitationStatus = "pending" | "waiting" | "confirmed_by_parent" | "closed";

export interface CitationItem {
  id: string;
  name: string;
  studentId?: string;
  avatarLetter: string;
  avatarColor: string;
  reason: string;
  theme: "yellow" | "orange" | "red" | "blue";
  status: CitationStatus;
  scheduledDate?: string;
  incidents?: { type: string; date: string; time: string; teacher: string }[];
}

export const INITIAL_CITATIONS: CitationItem[] = [
  { id: "c1", name: "Luciana Delgado Ramos", avatarLetter: "L", avatarColor: "bg-teal-600", reason: "Incidencias - Acumulación de 5 incidencias leves", theme: "yellow", status: "pending", scheduledDate: "En proceso para el 2026-04-20 a las 10:00", incidents: [ { type: "Uso de joyas", date: "10/04/2026", time: "08:15", teacher: "Ana Rojas" }, { type: "Uso de celular", date: "11/04/2026", time: "11:30", teacher: "Carlos Mendoza" }, { type: "Uñas pintadas", date: "12/04/2026", time: "10:00", teacher: "Ana Rojas" }, { type: "Falta de aseo personal", date: "14/04/2026", time: "09:45", teacher: "Luis Ramirez" }, { type: "Uniforme incompleto", date: "15/04/2026", time: "12:20", teacher: "Ana Rojas" } ] },
  { id: "c2", name: "Nicolas Mendoza Sanchez", avatarLetter: "N", avatarColor: "bg-rose-500", reason: "Incidencias - Acumulación de 3 incidencias moderadas", theme: "orange", status: "waiting", scheduledDate: "En proceso para el 2026-04-20 a las 15:30" },
  { id: "c3", name: "Luana Gutierrez Ramos", avatarLetter: "L", avatarColor: "bg-rose-500", reason: "Incidencias - 4 incidencias leves reportadas (En límite)", theme: "orange", status: "confirmed_by_parent", scheduledDate: "Confirmada para el 2026-04-20 a las 15:30" },
  { id: "c4", name: "Catalina Chavez Paredes", avatarLetter: "C", avatarColor: "bg-purple-500", reason: "Incidencias - 1 incidencia grave reportada", theme: "red", status: "closed", scheduledDate: "Confirmada para el 2026-04-20 a las 15:30" },
  { id: "c5", name: "Diego Ramos Vargas", avatarLetter: "D", avatarColor: "bg-blue-600", reason: "Incidencias - Conducta reiterativa", theme: "yellow", status: "closed", scheduledDate: "Confirmada para el 2026-04-21 a las 09:00" },
  { id: "c6", name: "Valentina Ruiz", avatarLetter: "V", avatarColor: "bg-emerald-600", reason: "Académico - Bajo rendimiento académico", theme: "orange", status: "closed", scheduledDate: "Confirmada para el 2026-04-22 a las 10:30" },
  { id: "c7", name: "Santiago Silva", avatarLetter: "S", avatarColor: "bg-indigo-600", reason: "Otros - Faltas injustificadas", theme: "red", status: "closed", scheduledDate: "Confirmada para el 2026-04-24 a las 11:00" },
  { id: "c8", name: "María Fernanda Lopez", avatarLetter: "M", avatarColor: "bg-pink-600", reason: "Otros - Problemas de convivencia", theme: "red", status: "closed", scheduledDate: "Confirmada para el 2026-04-05 a las 08:30" },
  { id: "c9", name: "Joaquin Perez Rey", avatarLetter: "J", avatarColor: "bg-sky-600", reason: "Incidencias - Uso inadecuado de tablet", theme: "orange", status: "closed", scheduledDate: "Confirmada para el 2026-04-12 a las 10:00" },
  { id: "c10", name: "Valeria Gomez Torre", avatarLetter: "V", avatarColor: "bg-amber-600", reason: "Académico - Falta a clase virtual", theme: "blue", status: "pending", scheduledDate: "En proceso para el 2026-04-25 a las 16:00" },
  { id: "c11", name: "Sebastián Diaz", avatarLetter: "S", avatarColor: "bg-lime-600", reason: "Académico - Falta de tareas", theme: "blue", status: "waiting", scheduledDate: "En proceso para el 2026-04-26 a las 12:00" },
  { id: "c12", name: "Carla Pineda", avatarLetter: "C", avatarColor: "bg-cyan-600", reason: "Incidencias - Evasión de clases", theme: "red", status: "pending", scheduledDate: "En proceso para el 2026-04-22 a las 11:30", incidents: [{type: "Fuga de aula", date: "16/04/2026", time: "11:20", teacher: "Marta Díaz"}] },
  { id: "c13", name: "Matias Cardenas", avatarLetter: "M", avatarColor: "bg-fuchsia-600", reason: "Académico - Falta de entrega de proyectos asignados", theme: "blue", status: "waiting", scheduledDate: "En proceso para el 2026-04-23 a las 09:15" },
];

const getFluentClassroomIcon = (section: string) => {
  const hash = section.charCodeAt(0) % 5;
  const icons = [
    "blue-book.svg",
    "green-book.svg",
    "orange-book.svg",
    "closed-book.svg",
    "open-book.svg",
  ];
  return icons[hash];
};

const ClassroomDetail: React.FC<{
  classroom: { level: string; grade: string; section: string };
  onBack: () => void;
  onLevelClick: () => void;
  onGradeClick: () => void;
  onSelectStudent: (s: UserItem) => void;
  initialShowHistory?: boolean;
}> = ({ classroom, onBack, onLevelClick, onGradeClick, onSelectStudent, initialShowHistory = false }) => {
  const [showReportsHistory, setShowReportsHistory] =
    useState(initialShowHistory);
  const [showVirtualAttendance, setShowVirtualAttendance] = useState(false);
  const [showCitationsPanel, setShowCitationsPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCharts, setShowCharts] = useState(false);
  const [showIncidentColumns, setShowIncidentColumns] = useState(false);
  const [incidentsSortDesc, setIncidentsSortDesc] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [citationsList, setCitationsList] = useState<CitationItem[]>(INITIAL_CITATIONS);
  const [hideTeacherNameComunicado, setHideTeacherNameComunicado] = useState(false);
  
  const [comunicadoModal, setComunicadoModal] = useState<{
    isOpen: boolean;
    destinatario: string;
    motivo: "Urgente" | "Informativo" | "Recordatorio" | "";
    mensaje: string;
    showPreview: boolean;
    tab: "redactar" | "historial";
    step: 1 | 2;
  }>({
    isOpen: false,
    destinatario: `${classroom.grade} - ${classroom.section}`,
    motivo: "",
    mensaje: "",
    showPreview: true,
    tab: "redactar",
    step: 1
  });

  const [comunicadosHistory, setComunicadosHistory] = useState([
    { id: 1, date: "15/04/2026", type: "Informativo", message: "Estimados apoderados, se recuerda la reunión general de padres para la próxima semana...", recipient: "Todas las Aulas", seenCount: 145, totalCount: 150 },
    { id: 2, date: "10/04/2026", type: "Recordatorio", message: "Se recuerda a los estudiantes traer sus materiales de la clase de Arte.", recipient: "1° Secundaria - A", seenCount: 28, totalCount: 30 },
    { id: 3, date: "05/04/2026", type: "Urgente", message: "Estimados apoderados, por motivos de fuerza mayor se suspenden las clases del día de mañana.", recipient: "Todas las Aulas", seenCount: 150, totalCount: 150 }
  ]);

  const [citationModal, setCitationModal] = useState<{
    isOpen: boolean; 
    step: number; 
    student: any; 
    reason: string; 
    customReason: string; 
    selectedIncidents: any[];
    availableIncidents: any[];
    showPreview: boolean;
  }>({
    isOpen: false, 
    step: 1, 
    student: null, 
    reason: '', 
    customReason: '', 
    selectedIncidents: [],
    availableIncidents: [],
    showPreview: false
  });
  const [citeSchedDate, setCiteSchedDate] = useState("");
  const [citeSchedTime, setCiteSchedTime] = useState("");
  const [citeDateError, setCiteDateError] = useState("");

  const handleDateChange = (value: string, setter: React.Dispatch<React.SetStateAction<string>>, errorSetter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(value);
    errorSetter("");
    if (!value) return;
    const [y, m, d] = value.split('-');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    const day = date.getDay();
    if (day === 0 || day === 6) {
      errorSetter("Las citas solo pueden programarse de Lunes a Viernes.");
      setter("");
    }
  };

  const handleQuickCite = (student: any, reasonType: string) => {
    let initialStep = 2;
    let availableIncidents: any[] = [];
    if (reasonType === 'Incidencias') {
      initialStep = 1;
      availableIncidents = [
        { id: "inc-1", label: "No trajo el material escolar", date: "14/04/2026", time: "10:55 AM", registrar: "Auxiliar Juan Perez" },
        { id: "inc-2", label: "Falta de respeto a compañero", date: "12/04/2026", time: "10:42 AM", registrar: "Prof. Ana Gómez" },
        { id: "inc-3", label: "Interrupción constante", date: "14/04/2026", time: "10:40 AM", registrar: "Prof. Ana Gómez" },
        { id: "inc-4", label: "Uso inadecuado del celular", date: "13/04/2026", time: "10:56 AM", registrar: "Prof. Lorenzo Castillo" }
      ];
    }
    
    setCitationModal({
      isOpen: true,
      step: initialStep,
      student,
      reason: reasonType,
      customReason: '',
      selectedIncidents: [],
      availableIncidents
    });
    setActionMenuId(null);
  };

  const handleSendCitation = () => {
    if (!citationModal.student) return;
    const finalReason = citationModal.reason === 'Otros' ? (citationModal.customReason || 'Otros') : citationModal.reason === 'Académico' ? 'Rendimiento académico' : citationModal.reason === 'Incidencias' ? 'Acumulación de incidencias' : citationModal.reason;

    const newCitation: CitationItem = {
      id: `cite-${Date.now()}`,
      studentId: citationModal.student.id,
      name: citationModal.student.name,
      avatarColor: citationModal.student.avatarColor,
      avatarLetter: citationModal.student.name.charAt(0),
      reason: finalReason,
      status: 'pending', 
      theme: citationModal.reason.includes('Incidencia') ? 'red' : citationModal.reason === 'Otros' ? 'yellow' : 'orange',
      scheduledDate: citeSchedDate && citeSchedTime ? `En proceso para el ${citeSchedDate} a las ${citeSchedTime}` : 'En proceso (Sin fecha)',
    };
    setCitationsList(prev => [newCitation, ...prev]);
    setCitationModal(prev => ({ ...prev, isOpen: false, student: null, reason: '', customReason: '', selectedIncidents: [], step: 1 }));
  };
  const [attendancePeriod, setAttendancePeriod] = useState<
    "Día" | "Semana" | "Mes" | "Bimestre"
  >("Día");
  const [reportPeriod, setReportPeriod] = useState<
    "Día" | "Semana" | "Mes" | "Bimestre"
  >("Día");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedWeek, setSelectedWeek] = useState<string>(
    getWeekString(new Date()),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() >= 2 && new Date().getMonth() <= 11
      ? new Date().getMonth()
      : 2,
  );
  const [selectedBimestre, setSelectedBimestre] = useState<number>(1);

  const [incidentsReportPeriod, setIncidentsReportPeriod] = useState<
    "Día" | "Semana" | "Mes" | "Bimestre"
  >("Día");
  const [selectedIncidentsDate, setSelectedIncidentsDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedIncidentsWeek, setSelectedIncidentsWeek] = useState<string>(
    getWeekString(new Date()),
  );
  const [selectedIncidentsMonth, setSelectedIncidentsMonth] = useState<number>(
    new Date().getMonth() >= 2 && new Date().getMonth() <= 11
      ? new Date().getMonth()
      : 2,
  );
  const [selectedIncidentsBimestre, setSelectedIncidentsBimestre] =
    useState<number>(1);

  const [dashboardIncidentsMonth, setDashboardIncidentsMonth] =
    useState<number>(
      new Date().getMonth() >= 2 && new Date().getMonth() <= 11
        ? new Date().getMonth()
        : 2,
    );

  const peruDate = useMemo(
    () =>
      new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Lima" }),
      ),
    [],
  );

  const weekStr = useMemo(() => {
    const start = new Date(peruDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    const end = new Date(start);
    end.setDate(start.getDate() + 4);

    const startMonth = start.toLocaleDateString("es-PE", { month: "short" });
    const endMonth = end.toLocaleDateString("es-PE", { month: "short" });

    if (startMonth === endMonth) {
      return `${start.getDate()} al ${end.getDate()} ${endMonth}`;
    } else {
      return `${start.getDate()} ${startMonth} al ${end.getDate()} ${endMonth}`;
    }
  }, [peruDate]);

  const dayStr = useMemo(
    () =>
      peruDate.toLocaleDateString("es-PE", { day: "numeric", month: "short" }),
    [peruDate],
  );

  const students = useMemo(() => {
    return MOCK_USERS.filter(
      (u) =>
        u.role === "Estudiante" &&
        u.level === classroom.level &&
        u.grade === classroom.grade &&
        u.section === classroom.section,
    );
  }, [classroom]);

  const studentIncidents = useMemo(() => {
    const map: Record<string, { leve: number; mod: number; grave: number; total: number }> = {};
    students.forEach((s, idx) => {
      const seed = s.id.charCodeAt(0) + idx;
      const leve = seed % 4;
      const mod = (seed * 2) % 3;
      const grave = (seed * 3) % 2;
      map[s.id] = { leve, mod, grave, total: leve + mod + grave };
    });
    return map;
  }, [students]);

  const filteredStudents = useMemo(() => {
    let filtered = students.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    if (showIncidentColumns && incidentsSortDesc) {
      filtered = [...filtered].sort((a, b) => studentIncidents[b.id].total - studentIncidents[a.id].total);
    }
    return filtered;
  }, [students, searchQuery, showIncidentColumns, incidentsSortDesc, studentIncidents]);

  // Mock data for charts
  const attendanceData = [
    { name: "ASISTIÓ", value: 21, color: "#10b981" },
    { name: "FALTAS", value: 2, color: "#ef4444" },
    { name: "TARDANZAS", value: 1, color: "#f59e0b" },
    { name: "JUSTIFICADAS", value: 2, color: "#3b82f6" },
  ];

  const weeklyAttendanceData = [
    { name: "Lun", Presente: 25, Tardanza: 3, Falta: 2 },
    { name: "Mar", Presente: 28, Tardanza: 1, Falta: 1 },
    { name: "Mié", Presente: 26, Tardanza: 2, Falta: 2 },
    { name: "Jue", Presente: 29, Tardanza: 0, Falta: 1 },
    { name: "Vie", Presente: 24, Tardanza: 4, Falta: 2 },
  ];

  const incidentsData = [
    { name: "Leve", value: 20, color: "#f59e0b" },
    { name: "Moderado", value: 12, color: "#f97316" },
    { name: "Grave", value: 5, color: "#ef4444" },
  ];

  const handleDownloadReport = (type: "Asistencia" | "Incidencias") => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Título Principal
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("I.E 6049 RICARDO PALMA", pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`REPORTE DE ${type.toUpperCase()}`, pageWidth / 2, 22, {
      align: "center",
    });

    // Cuadro de Información
    const startY = 30;
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.rect(margin, startY, pageWidth - margin * 2, 20);

    let periodText = "";
    const currentReportPeriod =
      type === "Asistencia" ? reportPeriod : incidentsReportPeriod;
    const currentDate =
      type === "Asistencia" ? selectedDate : selectedIncidentsDate;
    const currentWeek =
      type === "Asistencia" ? selectedWeek : selectedIncidentsWeek;
    const currentMonth =
      type === "Asistencia" ? selectedMonth : selectedIncidentsMonth;
    const currentBimestre =
      type === "Asistencia" ? selectedBimestre : selectedIncidentsBimestre;

    if (currentReportPeriod === "Día") {
      periodText = `DÍA: ${new Date(currentDate + "T12:00:00").toLocaleDateString("es-PE")}`;
    } else if (currentReportPeriod === "Semana") {
      const weekStart = getDateFromWeekString(currentWeek);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      periodText = `SEMANA: ${weekStart.toLocaleDateString("es-PE")} - ${weekEnd.toLocaleDateString("es-PE")}`;
    } else if (currentReportPeriod === "Mes") {
      const monthLabel =
        MONTHS.find((m) => m.value === currentMonth)?.label || "";
      periodText = `MES: ${monthLabel.toUpperCase()}`;
    } else {
      periodText = `BIMESTRE: ${currentBimestre}°`;
    }

    doc.setFontSize(9);
    doc.text(`NIVEL: ${classroom.level.toUpperCase()}`, margin + 5, startY + 7);
    doc.text(
      `GRADO/SECCIÓN: ${classroom.grade.toUpperCase()} ${classroom.section.toUpperCase()}`,
      margin + 5,
      startY + 14,
    );
    doc.text(periodText, margin + 100, startY + 7);

    // Table Data
    let head = [];
    let tableData = [];

    if (type === "Asistencia") {
      head = [["#", "ESTUDIANTE", "ASISTENCIA (%)", "TARDANZAS", "FALTAS"]];
      tableData = filteredStudents.map((s, index) => [
        (index + 1).toString(),
        s.name,
        `${Math.floor(Math.random() * 20 + 80)}%`, // Mock data 80-100%
        Math.floor(Math.random() * 5).toString(), // Mock data 0-4
        Math.floor(Math.random() * 3).toString(), // Mock data 0-2
      ]);
    } else {
      head = [["#", "ESTUDIANTE", "INCIDENCIAS LEVES", "MODERADAS", "GRAVES"]];
      tableData = filteredStudents.map((s, index) => {
        const inc = studentIncidents[s.id];
        return [
          (index + 1).toString(),
          s.name,
          inc.leve.toString(),
          inc.mod.toString(),
          inc.grave.toString(),
        ];
      });
    }

    autoTable(doc, {
      startY: startY + 25,
      head: head,
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineWidth: 0.2,
      },
      margin: { left: margin, right: margin },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const footerY = doc.internal.pageSize.getHeight() - 10;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const now = new Date();
      const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
      doc.text(`Generado el: ${dateStr}`, margin, footerY);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, footerY, {
        align: "right",
      });
    }

    let fileNameSuffix = "";
    if (currentReportPeriod === "Día") {
      fileNameSuffix = `Dia_${new Date(currentDate + "T12:00:00").toLocaleDateString("es-PE").replace(/\//g, "-")}`;
    } else if (currentReportPeriod === "Semana") {
      const weekStart = getDateFromWeekString(currentWeek);
      fileNameSuffix = `Semana_${weekStart.toLocaleDateString("es-PE").replace(/\//g, "-")}`;
    } else if (currentReportPeriod === "Mes") {
      const monthLabel =
        MONTHS.find((m) => m.value === currentMonth)?.label || "";
      fileNameSuffix = `Mes_${monthLabel}`;
    } else {
      fileNameSuffix = `Bimestre_${currentBimestre}`;
    }

    doc.save(
      `Reporte_${type}_${classroom.grade.replace("° Grado", "")}${classroom.section}_${fileNameSuffix}.pdf`,
    );
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
          <p className="font-bold text-slate-800 dark:text-white mb-2">
            {label || payload[0].name}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              <span className="text-slate-600 dark:text-slate-300">
                {entry.name}:
              </span>
              <span className="font-semibold text-slate-800 dark:text-white">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const tutor = useMemo(() => {
    return MOCK_USERS.find(
      (u) =>
        u.role === "Docente" &&
        u.level === classroom.level &&
        u.grade === classroom.grade &&
        u.section === classroom.section,
    );
  }, [classroom]);

  if (showReportsHistory) {
    return (
      <ClassroomReportsHistory
        classroom={classroom}
        onBack={onBack}
        onDownloadReport={(type, period, month, bimestre) => {
          if (type === "Incidencias") {
            setIncidentsReportPeriod(period);
            if (month !== undefined) setSelectedIncidentsMonth(month);
            if (bimestre !== undefined) setSelectedIncidentsBimestre(bimestre);
            setTimeout(() => handleDownloadReport("Incidencias"), 0);
          } else {
            setReportPeriod(period);
            if (month !== undefined) setSelectedMonth(month);
            if (bimestre !== undefined) setSelectedBimestre(bimestre);
            setTimeout(() => handleDownloadReport("Asistencia"), 0);
          }
        }}
      />
    );
  }

  if (showVirtualAttendance) {
    return (
      <VirtualAttendance
        classroom={classroom}
        students={students}
        onBack={() => setShowVirtualAttendance(false)}
      />
    );
  }

  if (showCitationsPanel) {
    return (
      <CitationsPanel
        classroom={classroom}
        students={students}
        tutor={tutor}
        citations={citationsList}
        setCitations={setCitationsList}
        onBack={() => setShowCitationsPanel(false)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-hidden min-h-0 flex flex-col pt-1">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden h-full relative animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex-1 overflow-auto bg-gray-50/30 dark:bg-slate-900/50">
          {/* Header & Charts Section (Grey) */}
          <div className="bg-[#f0f4f8] dark:bg-slate-800/50 rounded-t-2xl p-6 sm:p-8 border-b border-gray-200 dark:border-slate-700 shrink-0">
            <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${showCharts ? 'mb-8' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                 <button
                    onClick={onBack}
                    className="flex-shrink-0 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 dark:hover:text-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group"
                  >
                    <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
                  </button>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center drop-shadow-sm">
                    <img src={`https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/${getFluentClassroomIcon(classroom.section)}`} className="w-14 h-14 object-contain" alt="Classroom Book" onError={(e) => { e.currentTarget.src = "https://unpkg.com/fluentui-emoji@1.3.0/icons/modern/open-book.svg" }} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {classroom.level === "Inicial"
                        ? `${classroom.grade.replace(/Años/i, "- AÑOS").toUpperCase()} - ${classroom.section}`
                        : `${classroom.grade.replace("° Grado", "")}°${classroom.section}`}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-slate-600 dark:text-slate-400 font-medium text-base">
                       <span>{classroom.level}</span>
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></span>
                       <GraduationCap className="w-5 h-5 flex-shrink-0" />
                       <span className="whitespace-nowrap">Tutor: {tutor ? tutor.name : "Sin asignar"}</span>
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 hidden sm:block"></span>
                       <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium text-base ml-0 sm:ml-2">
                         <Users className="w-4 h-4 flex-shrink-0" />
                         {students.length} Estudiantes
                       </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Primary Actions Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className="flex items-center gap-3 px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-bold text-base"
                >
                  <BarChart3 className="w-5 h-5" />
                  {showCharts ? 'Ocultar gráficos' : 'Visualizar gráficos'}
                </button>
                <button
                  onClick={() => setComunicadoModal(prev => ({...prev, isOpen: true, step: 1, tab: 'redactar'}))}
                  className="flex items-center gap-3 px-6 py-3.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm font-bold text-base relative"
                >
                  <Megaphone className="w-5 h-5" />
                  Comunicados
                </button>
                <button
                  onClick={() => setShowVirtualAttendance(true)}
                  className="flex items-center gap-3 px-6 py-3.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-sm font-bold text-base"
                >
                  <MonitorPlay className="w-5 h-5" />
                  Asistencia
                </button>
              </div>
            </div>

            {/* Charts Section */}
            {showCharts && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                      Asistencia General
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Semana: {weekStr}
                    </p>
                  </div>
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg">
                    <button
                      onClick={() => setAttendancePeriod("Día")}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${attendancePeriod === "Día" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                      Hoy
                    </button>
                    <button
                      onClick={() => setAttendancePeriod("Semana")}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${attendancePeriod === "Semana" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                      Semana
                    </button>
                  </div>
                </div>

                <div className="flex-1 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 min-h-[250px] flex flex-col w-full">
                  {attendancePeriod === "Semana" ? (
                    <div className="w-full flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={weeklyAttendanceData}
                          margin={{ top: 20, right: 20, left: -20, bottom: 40 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e2e8f0"
                          />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                          />
                          <RechartsTooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "transparent" }}
                          />
                          <Legend
                            iconType="circle"
                            wrapperStyle={{
                              fontSize: "12px",
                              paddingTop: "20px",
                            }}
                          />
                          <Bar
                            dataKey="Presente"
                            stackId="a"
                            fill="#10b981"
                            radius={[0, 0, 4, 4]}
                            maxBarSize={40}
                          />
                          <Bar
                            dataKey="Tardanza"
                            stackId="a"
                            fill="#f59e0b"
                            maxBarSize={40}
                          />
                          <Bar
                            dataKey="Falta"
                            stackId="a"
                            fill="#ef4444"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full flex-1">
                      <div className="w-1/2 h-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={attendanceData}
                              cx="50%"
                              cy="50%"
                              innerRadius="55%"
                              outerRadius="80%"
                              paddingAngle={2}
                              dataKey="value"
                              stroke="none"
                            >
                              {attendanceData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-3xl font-black text-slate-800 dark:text-white">
                            81%
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
                            {dayStr}
                          </span>
                        </div>
                      </div>
                      <div className="w-1/2 flex flex-col justify-center gap-4 pl-8">
                        {attendanceData.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-sm font-black text-slate-900 dark:text-white">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    Incidencias por Categoría
                  </h3>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                    <button
                      onClick={() =>
                        setDashboardIncidentsMonth((prev) =>
                          prev > 2 ? prev - 1 : 11,
                        )
                      }
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200 min-w-[80px] text-center">
                      {
                        [
                          "Enero",
                          "Febrero",
                          "Marzo",
                          "Abril",
                          "Mayo",
                          "Junio",
                          "Julio",
                          "Agosto",
                          "Septiembre",
                          "Octubre",
                          "Noviembre",
                          "Diciembre",
                        ][dashboardIncidentsMonth]
                      }
                    </span>
                    <button
                      onClick={() =>
                        setDashboardIncidentsMonth((prev) =>
                          prev < 11 ? prev + 1 : 2,
                        )
                      }
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 min-h-[250px] flex flex-col w-full">
                  <div className="flex items-center justify-center h-full flex-1 min-h-0">
                    <div className="w-1/2 h-full relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={incidentsData}
                            cx="50%"
                            cy="50%"
                            innerRadius="55%"
                            outerRadius="80%"
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {incidentsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-slate-800 dark:text-white">
                          37
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider mt-1">
                          TOTAL
                        </span>
                      </div>
                    </div>
                    <div className="w-1/2 flex flex-col justify-center gap-4 pl-8">
                      {incidentsData.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-sm font-black text-slate-900 dark:text-white">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Students List Section (White) */}
          <div className="bg-white dark:bg-slate-900 rounded-b-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-sm flex-1 flex flex-col min-h-0">
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-[500px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-base text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
                  />
                </div>
                <div className="flex items-center gap-3 ml-auto sm:ml-0">
                  {showIncidentColumns && (
                    <button
                      onClick={() => setIncidentsSortDesc(!incidentsSortDesc)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border ${incidentsSortDesc ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-400 dark:border-indigo-800/50' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700'}`}
                    >
                      <BarChart3 size={18} />
                      Ordenar mayor a menor
                    </button>
                  )}
                  <button
                    onClick={() => setShowIncidentColumns(!showIncidentColumns)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border ${showIncidentColumns ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/40 dark:text-orange-400 dark:border-orange-800/50' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700'}`}
                  >
                    <Filter size={18} />
                    {showIncidentColumns ? 'Ocultar Incidencias' : 'Mostrar incidencias'}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold w-12 text-center">#</th>
                      <th className="p-4 font-semibold">Estudiante</th>
                      {!showIncidentColumns && (
                        <th className="p-4 font-semibold text-center text-slate-400 w-40"></th>
                      )}
                      {showIncidentColumns && (
                        <>
                          <th className="p-4 font-semibold text-center text-amber-600 dark:text-amber-400 cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors" onClick={() => setShowIncidentColumns(false)}>
                             Leve
                          </th>
                          <th className="p-4 font-semibold text-center text-orange-600 dark:text-orange-400 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors" onClick={() => setShowIncidentColumns(false)}>
                             Moderado
                          </th>
                          <th className="p-4 font-semibold text-center text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors" onClick={() => setShowIncidentColumns(false)}>
                             Grave
                          </th>
                        </>
                      )}
                      <th className="p-4 pr-16 font-extrabold text-right text-[#041e49] dark:text-indigo-200 tracking-wide">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <tr
                          key={student.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          <td className="p-4 text-center text-slate-400 dark:text-slate-500 font-mono text-sm font-medium cursor-pointer" onClick={() => onSelectStudent(student)}>
                            {index + 1}
                          </td>
                          <td className="p-4 cursor-pointer" onClick={() => onSelectStudent(student)}>
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${student.avatarColor}`}
                              >
                                {student.name.charAt(0)}
                              </div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {student.name}
                              </p>
                            </div>
                          </td>
                          {!showIncidentColumns ? (
                             <td className="p-4 text-center cursor-pointer" onClick={() => onSelectStudent(student)}>
                               {/* empty cell for padding when closed */}
                             </td>
                          ) : (
                            <>
                              <td className="p-4 text-center cursor-pointer" onClick={() => onSelectStudent(student)}>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-700 text-xs font-bold dark:bg-amber-900/30 dark:text-amber-400">{studentIncidents[student.id].leve}</span>
                              </td>
                              <td className="p-4 text-center cursor-pointer" onClick={() => onSelectStudent(student)}>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-50 text-orange-700 text-xs font-bold dark:bg-orange-900/30 dark:text-orange-400">{studentIncidents[student.id].mod}</span>
                              </td>
                              <td className="p-4 text-center cursor-pointer" onClick={() => onSelectStudent(student)}>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-700 text-xs font-bold dark:bg-red-900/30 dark:text-red-400">{studentIncidents[student.id].grave}</span>
                              </td>
                            </>
                          )}
                          <td className="p-4 pr-16 text-right">
                            <div className="flex items-center justify-end relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActionMenuId(actionMenuId === student.id ? null : student.id);
                                  }}
                                  className="inline-flex items-center justify-center w-[46px] h-[46px] rounded-[14px] bg-[#f3f4fa] dark:bg-indigo-900/20 hover:bg-[#e6e8f4] dark:hover:bg-indigo-900/40 transition-colors relative z-10 text-[#5252d4] dark:text-indigo-400"
                                >
                                  <SquarePen className="w-[22px] h-[22px]" strokeWidth={2.5} />
                                </button>

                              <AnimatePresence>
                                {actionMenuId === student.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-12 top-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
                                  >
                                    <div className="py-1">
                                      <div className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-left">
                                        Citar por:
                                      </div>
                                      <button onClick={(e) => { e.stopPropagation(); handleQuickCite(student, 'Incidencias'); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 transition-colors flex items-center gap-2">
                                        <AlertTriangle size={16} /> Incidencias
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); handleQuickCite(student, 'Académico'); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                                        <BookOpen size={16} /> Académico
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); handleQuickCite(student, 'Otros'); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 transition-colors flex items-center gap-2">
                                        <Info size={16} /> Otros
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-8 text-center text-slate-500 dark:text-slate-400"
                        >
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                            <p>
                              No se encontraron estudiantes que coincidan con la
                              búsqueda.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {citationModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden w-full flex flex-col transition-all duration-300 max-w-xl`}
            >
              <div className="flex flex-col lg:flex-row w-full h-full max-h-[90vh]">
                
                 {/* Form Section */}
                 <div className="flex-1 flex flex-col min-h-0 relative overflow-y-auto custom-scrollbar">
                   <div className="px-6 py-[22px] border-b border-[#EAEBF0] dark:border-slate-800 flex justify-between items-center bg-transparent sticky top-0 z-10 bg-white dark:bg-slate-900">
                     <h3 className="text-xl font-extrabold text-[#0D082C] dark:text-white flex items-center gap-2.5">
                       {citationModal.step === 1 && citationModal.reason === 'Incidencias' ? <AlertTriangle className="w-[22px] h-[22px] text-[#3030b8]" /> : <Send className="w-[22px] h-[22px] text-[#3030b8]" />} <span className="pt-0.5">{citationModal.step === 1 && citationModal.reason === 'Incidencias' ? 'Selección de Incidencias' : 'Generar Citación'}</span>
                     </h3>
                     <button onClick={() => setCitationModal(prev => ({ ...prev, isOpen: false, student: null, reason: '', customReason: '', selectedIncidents: [], step: 1 }))} className="text-[#8792A2] hover:text-[#0D082C] dark:hover:text-slate-300 transition-colors bg-[#F2F4FC] w-9 h-9 rounded-full flex items-center justify-center">
                       <X className="w-5 h-5" />
                     </button>
                   </div>
                   
                   <div className="p-6 flex flex-col gap-5 flex-1">
                 <div className="flex items-center gap-4 bg-[#F2F4FC] dark:bg-indigo-900/20 p-5 rounded-[12px] border-none shadow-none">
                   <div className={`w-[45px] h-[45px] rounded-full flex items-center justify-center text-white font-bold text-[18px] bg-[#4B4AEF] ${citationModal.student?.avatarColor}`}>
                      {citationModal.student?.name?.charAt(0)}
                   </div>
                   <div>
                     <p className="font-extrabold text-[#0D082C] dark:text-white text-[17px] leading-none mb-1">{citationModal.student?.name}</p>
                     <div className="flex items-center gap-1">
                       <p className="text-[13px] text-[#3030b8] dark:text-indigo-400 font-semibold whitespace-nowrap">Motivo:</p>
                       <span className="font-semibold text-[13px] text-[#3030b8] dark:text-indigo-400">
                         {citationModal.reason === 'Académico' ? 'Rendimiento académico' : citationModal.reason === 'Incidencias' ? 'Incidencia' : citationModal.reason}
                       </span>
                     </div>
                   </div>
                 </div>

                 {citationModal.step === 1 && citationModal.reason === 'Incidencias' ? (
                   <div className="flex flex-col gap-3">
                     <div className="flex items-center justify-between xl:-mb-1">
                       <p className="font-extrabold text-[#0D082C] dark:text-slate-100 text-[15px]">Seleccionar incidencias a citar</p>
                       <label className="flex items-center gap-2 cursor-pointer group">
                         <span className="text-[13px] font-bold text-[#3030b8] dark:text-indigo-400 select-none">Seleccionar todo</span>
                         <input type="checkbox" className="hidden" 
                           checked={citationModal.selectedIncidents.length === citationModal.availableIncidents.length && citationModal.availableIncidents.length > 0} 
                           onChange={(e) => {
                             if (e.target.checked) setCitationModal(prev => ({ ...prev, selectedIncidents: prev.availableIncidents.map(i => i.id) }));
                             else setCitationModal(prev => ({ ...prev, selectedIncidents: [] }));
                           }} 
                         />
                       </label>
                     </div>

                     <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-2">
                       {citationModal.availableIncidents.map((incident: any) => {
                         const isSelected = citationModal.selectedIncidents.includes(incident.id);
                         return (
                           <label key={incident.id} className={`flex items-start gap-4 p-4 rounded-[12px] border shadow-[0px_4px_16px_rgba(13,8,44,0.02)] cursor-pointer transition-all bg-white hover:border-[#3030b8] dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-400 ${isSelected ? 'border-[1.5px] border-[#3030b8] shadow-[0px_4px_16px_rgba(48,48,184,0.06)]' : 'border-[#EAEBF0] border'}`}>
                             <div className={`mt-0.5 w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-[1.5px] border-[#3030b8] bg-transparent' : 'border-[#8792A2] dark:border-slate-600'}`}>
                               {isSelected && <Check className="w-[14px] h-[14px] text-[#3030b8]" strokeWidth={4} />}
                             </div>
                             <input type="checkbox" className="hidden" checked={isSelected} onChange={() => {
                               setCitationModal(prev => ({
                                 ...prev,
                                 selectedIncidents: isSelected ? prev.selectedIncidents.filter(id => id !== incident.id) : [...prev.selectedIncidents, incident.id]
                               }))
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
                   </div>
                 ) : (
                   <>
                     <div className="grid grid-cols-2 gap-5">
                       <div>
                         <label className="block text-[13px] font-extrabold text-[#0D082C] dark:text-indigo-100 mb-2.5 flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-[#8792A2]"/> Día sugerido</label>
                         <div className="w-full relative z-[60]">
                           <CustomCalendar mode="date" value={citeSchedDate} onChange={(val) => handleDateChange(val, setCiteSchedDate, setCiteDateError)} placeholder="dd/mm/aaaa" />
                         </div>
                         {citeDateError && <p className="text-xs text-red-500 mt-1.5 font-bold">{citeDateError}</p>}
                       </div>
                       <div>
                         <label className="block text-[13px] font-extrabold text-[#0D082C] dark:text-indigo-100 mb-2.5 flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#8792A2]"/> Hora sugerida</label>
                         <div className="relative">
                           <input type="time" value={citeSchedTime} onChange={e => setCiteSchedTime(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-[#EAEBF0] dark:border-slate-700 rounded-[10px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3030b8] transition-all shadow-none h-[42px]" style={{ fontFamily: "'Poppins', sans-serif" }} />
                         </div>
                       </div>
                     </div>
                     {citationModal.reason === 'Otros' && (
                       <div>
                         <label className="block text-[13px] font-extrabold text-[#0D082C] dark:text-indigo-100 mb-2.5 mt-2">Motivo de la citación</label>
                         <textarea
                           className="w-full bg-white dark:bg-slate-900 border border-[#EAEBF0] dark:border-slate-700 rounded-[10px] px-4 py-3 font-medium text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3030b8] shadow-none placeholder:text-[#8792A2] resize-none min-h-[90px]"
                           placeholder="Escriba el detalle del motivo por el cual cita al estudiante..."
                           autoFocus
                           value={citationModal.customReason}
                           onChange={(e) => setCitationModal(prev => ({ ...prev, customReason: e.target.value }))}
                         />
                       </div>
                     )}

                     <div>
                        <label className="block text-[13px] font-extrabold text-[#0D082C] dark:text-indigo-100 mb-2.5">Mensaje predeterminado para el apoderado</label>
                        <div className="w-full bg-[#efeae2] dark:bg-[#0b141a] rounded-2xl relative overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
                          <div className="bg-[#075e54] dark:bg-[#202c33] px-3 py-2 flex items-center gap-3 z-20 shrink-0 shadow-md">
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-white/50">
                                 <img src={APP_CONFIG.schoolLogo} alt="Logo" className="w-full h-full object-cover scale-[1.7]" referrerPolicy="no-referrer" />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-white font-semibold text-[14px] leading-tight">Asistencia Ricardo Palma Secundaria</span>
                                <span className="text-white/80 text-[11px] leading-tight mt-0.5">Cuenta Oficial de Empresa</span>
                             </div>
                          </div>
                          <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.06] pointer-events-none mt-[54px] z-0" style={{
                             backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
                             backgroundSize: '400px'
                          }}></div>
                          <div className="p-4 flex flex-col gap-3 relative z-10 custom-scrollbar pb-6">
                             <div className="bg-white dark:bg-[#202c33] rounded-lg rounded-tl-none p-2 shadow-sm max-w-[92%] relative z-10 text-left self-start">
                               <svg viewBox="0 0 8 13" width="8" height="13" className="absolute -left-[8px] top-0 text-white dark:text-[#202c33]">
                                 <path fill="currentColor" d="M1.533,3.568L8,12.193V1H2.812C1.042,1,0.474,2.156,1.533,3.568z"></path>
                               </svg>
                               <div className="text-[14px] leading-[1.35] whitespace-pre-wrap break-words text-[#111b21] dark:text-[#e9edef] p-1 pb-4 relative">
                                 <p className="font-bold flex items-center gap-2 mb-2">📣 Citación Oficial</p>
                                 <p className="mb-2">Estimado padre/madre de familia de <span className="font-semibold text-[#075e54] dark:text-emerald-400">{citationModal.student?.name}</span>, nos comunicamos para solicitar una cita por motivo de: <strong>{citationModal.reason === 'Otros' ? (citationModal.customReason || '...') : citationModal.reason === 'Académico' ? 'Rendimiento académico' : citationModal.reason === 'Incidencias' ? 'Acumulación de incidencias' : citationModal.reason}</strong>.</p>
                                 <p>La cita está programada para el día {citeSchedDate ? citeSchedDate.split('-').reverse().join('/') : "[Día]"} a las {citeSchedTime || "[Hora]"}.</p>
                                 {citationModal.reason === 'Incidencias' && citationModal.selectedIncidents.length > 0 && (
                                    <div className="mt-2 text-[13px]">
                                      <p className="font-medium">Incidencias a tratar:</p>
                                      <ul className="list-disc pl-4 mt-1 opacity-90">
                                        {citationModal.availableIncidents.filter(i => citationModal.selectedIncidents.includes(i.id)).map((i, idx) => <li key={idx}>{i.label} ({i.date})</li>)}
                                      </ul>
                                    </div>
                                 )}
                                 <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/50 text-[13.5px]">
                                   <p>Atentamente,</p>
                                   <p className="font-bold mt-1">Carlos Mendoza</p>
                                   <p className="italic opacity-80 text-[12.5px]">Docente del curso de DPCC</p>
                                 </div>
                                 <div className="absolute right-0 bottom-0 text-[11px] text-[#667781] dark:text-[#8696a0] mt-1.5 flex justify-end items-center gap-1 font-medium pb-0.5">
                                    {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} 
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#53bdeb] dark:text-[#53bdeb] inline ml-1" />
                                 </div>
                               </div>
                             </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
               </div>
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-6 bg-transparent sticky bottom-0 z-10 bg-white dark:bg-slate-900">
                     <button onClick={() => setCitationModal(prev => ({ ...prev, isOpen: false, student: null, reason: '', customReason: '', selectedIncidents: [], step: 1 }))} className="px-[25px] py-[11px] rounded-[10px] font-extrabold text-[#0D082C] dark:text-slate-300 hover:text-[#546274] transition-colors border border-[#EAEBF0] text-[13px]">Cancelar</button>
                     {citationModal.step === 1 && citationModal.reason === 'Incidencias' ? (
                       <button onClick={() => setCitationModal(prev => ({ ...prev, step: 2 }))} disabled={citationModal.selectedIncidents.length === 0} className="px-[25px] py-[11px] rounded-[10px] font-extrabold bg-[#4B4AEF] text-white hover:bg-[#3030b8] transition-colors flex items-center gap-2 min-w-[120px] justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-none text-[13px]">Continuar</button>
                     ) : (
                       <button onClick={handleSendCitation} className="px-[25px] py-[11px] rounded-[10px] font-extrabold bg-[#4B4AEF] text-white hover:bg-[#3030b8] transition-colors flex items-center gap-2 min-w-[120px] justify-center shadow-none text-[13px]">Generar</button>
                     )}
                   </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {comunicadoModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl w-full flex flex-col overflow-hidden my-auto border border-slate-200 dark:border-slate-800 transition-all duration-300 max-w-2xl max-h-[95vh] relative`}
            >
              <div className="flex justify-between items-center px-6 sm:px-10 pt-8 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                 <h3 className="text-[22px] font-extrabold text-[#0D082C] dark:text-white flex items-center gap-3">
                    <Megaphone className="text-[#3030b8] dark:text-indigo-400" size={26} />
                    Comunicados
                 </h3>
                 <button onClick={() => setComunicadoModal(prev => ({...prev, isOpen: false}))} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-2.5 rounded-full transition-colors relative z-10">
                   <X size={20} className="text-slate-500" strokeWidth={2.5} />
                 </button>
                 
              </div>
              
              <div className="px-6 sm:px-10 border-b border-slate-200 dark:border-slate-800 shrink-0">
                 <div className="flex items-center gap-8 translate-y-[1px]">
                     <button
                        onClick={() => setComunicadoModal(prev => ({...prev, tab: 'redactar'}))}
                        className={`pb-4 text-[14px] font-bold transition-all border-b-2 ${comunicadoModal.tab === 'redactar' ? 'border-[#3030b8] text-[#3030b8] dark:text-indigo-400 dark:border-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                     >
                       Redactar comunicado
                     </button>
                     <button
                        onClick={() => setComunicadoModal(prev => ({...prev, tab: 'historial'}))}
                        className={`pb-4 text-[14px] font-bold transition-all border-b-2 ${comunicadoModal.tab === 'historial' ? 'border-[#3030b8] text-[#3030b8] dark:text-indigo-400 dark:border-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                     >
                       Historial
                     </button>
                 </div>
              </div>

              <div className="flex-1 p-6 sm:px-10 overflow-y-auto custom-scrollbar flex flex-col gap-6 relative">
                 {comunicadoModal.tab === 'redactar' ? (
                   <>
                     {comunicadoModal.step === 1 ? (
                       <div className="flex flex-col gap-6">
                         <div>
                            <label className="text-[13px] font-black tracking-wider text-[#0D082C] dark:text-slate-300 uppercase mb-2.5 block">Destinatario</label>
                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 font-bold text-slate-800 dark:text-slate-200 flex justify-between items-center cursor-not-allowed opacity-80">
                              {comunicadoModal.destinatario}
                              <ChevronDown className="text-slate-400" size={20} />
                            </div>
                         </div>

                         <div>
                            <label className="text-[13px] font-black tracking-wider text-[#0D082C] dark:text-slate-300 uppercase mb-3 block">Motivo del Comunicado</label>
                            <div className="flex flex-col gap-3">
                                {[
                                  { id: 'Urgente', icon: AlertCircle, hexBg: '#FFE5E8', hexBorder: '#ED325C', hexInner: '#FFCFD8', hexText: '#A30022' },
                                  { id: 'Informativo', icon: Info, hexBg: '#E5EFFF', hexBorder: '#1D60FC', hexInner: '#CCDEFF', hexText: '#002D98' },
                                  { id: 'Recordatorio', icon: Megaphone, hexBg: '#FFEFE5', hexBorder: '#FF6812', hexInner: '#FFDECC', hexText: '#963600' }
                                ].map((item: any) => {
                                  const isSelected = comunicadoModal.motivo === item.id;
                                  return (
                                    <button 
                                      key={item.id}
                                      onClick={() => setComunicadoModal(prev => ({...prev, motivo: item.id as any}))}
                                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${isSelected ? 'shadow-sm' : 'border-transparent bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                      style={isSelected ? { backgroundColor: item.hexBg, borderColor: item.hexBorder } : {}}
                                    >
                                      <div 
                                        className={`p-2 rounded-xl transition-colors ${isSelected ? '' : 'bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500'}`}
                                        style={isSelected ? { backgroundColor: item.hexInner, color: item.hexText } : {}}
                                      >
                                        <item.icon size={20} />
                                      </div>
                                      <span 
                                        className={`font-bold text-[15px]`}
                                        style={isSelected ? { color: item.hexText } : { color: 'inherit' }}
                                      >
                                        {item.id}
                                      </span>
                                    </button>
                                  );
                                })}
                            </div>
                         </div>

                         <button 
                            disabled={!comunicadoModal.motivo}
                            onClick={() => setComunicadoModal(prev => ({...prev, step: 2}))}
                            className="bg-[#3030b8] hover:bg-[#202090] text-white font-bold py-3.5 rounded-xl transition-colors w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            Siguiente
                         </button>
                       </div>
                     ) : (
                       <div className="flex flex-col gap-4">
                         <button 
                            onClick={() => setComunicadoModal(prev => ({...prev, step: 1}))}
                            className="flex items-center gap-2 text-[#3030b8] dark:text-indigo-400 font-bold w-fit mb-2 hover:opacity-80 transition-opacity"
                         >
                            <ChevronLeft size={20} /> Volver a Atrás
                         </button>

                         <div>
                           <label className="text-[13px] font-black tracking-wider text-[#0D082C] dark:text-slate-300 uppercase mb-3 block">Cuerpo del Mensaje</label>
                           <textarea 
                              value={comunicadoModal.mensaje}
                              onChange={e => setComunicadoModal(prev => ({...prev, mensaje: e.target.value}))}
                              placeholder="Estimados apoderados, les comunicamos que..."
                              className="w-full bg-[#F5F6F8] dark:bg-slate-800/80 border border-transparent focus:border-[#3030b8] dark:focus:border-indigo-500 rounded-2xl p-5 min-h-[160px] resize-none focus:outline-none focus:ring-4 focus:ring-[#3030b8]/10 transition-all font-medium text-[15px] text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                           />
                         </div>

                         {/* Hide Teacher Name Toggle */}
                         <div className="flex items-center gap-2 mt-2">
                             <button
                                onClick={() => setHideTeacherNameComunicado(!hideTeacherNameComunicado)}
                                className={`w-11 h-6 rounded-full flex items-center transition-colors relative shrink-0 ${hideTeacherNameComunicado ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                             >
                                <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform absolute ${hideTeacherNameComunicado ? 'translate-x-6' : 'translate-x-[4px]'}`} />
                             </button>
                             <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                                Ocultar nombre del docente
                             </span>
                         </div>

                         <div className="w-full bg-[#efeae2] dark:bg-[#0b141a] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col shrink-0 relative overflow-hidden mt-4 shadow-sm">
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

                             <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.06] pointer-events-none mt-[54px] z-0" style={{
                                backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
                                backgroundSize: '400px'
                             }}></div>

                             <div className="p-4 flex flex-col gap-3 relative z-10 custom-scrollbar pb-6 max-h-[350px] overflow-y-auto w-full">
                                <div className="self-center bg-[#E1F3FB] dark:bg-[#182229] text-slate-500 dark:text-slate-400 text-[11px] font-medium px-3 py-1 rounded-md shadow-sm mb-2 uppercase tracking-wide">
                                   Hoy
                                </div>
                                
                                <div className="bg-white dark:bg-[#202c33] rounded-lg rounded-tl-none p-2 shadow-sm max-w-[92%] relative z-10 text-left self-start">
                                   <svg viewBox="0 0 8 13" width="8" height="13" className="absolute -left-[8px] top-0 text-white dark:text-[#202c33]">
                                      <path fill="currentColor" d="M1.533,3.568L8,12.193V1H2.812C1.042,1,0.474,2.156,1.533,3.568z"></path>
                                   </svg>

                                   <div className="text-[14px] leading-[1.35] whitespace-pre-wrap break-words text-[#111b21] dark:text-[#e9edef] p-1 pb-4 relative">
                                      {comunicadoModal.motivo && <p className="font-bold flex items-center gap-2 mb-2">
                                         {comunicadoModal.motivo === 'Urgente' ? '⚠️' : comunicadoModal.motivo === 'Informativo' ? 'ℹ️' : '🔔'} Comunicado {comunicadoModal.motivo}
                                      </p>}
                                      <p className={`${comunicadoModal.mensaje ? 'text-[#111b21] dark:text-[#e9edef]' : 'text-slate-400 dark:text-slate-500 italic'}`}>
                                         {comunicadoModal.mensaje || 'Redacte su mensaje en el campo superior...'}
                                      </p>
                                      
                                      {(comunicadoModal.mensaje) && (
                                        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/50 text-[13.5px]">
                                          <p>Atentamente,</p>
                                          {!hideTeacherNameComunicado && <p className="font-bold mt-1">Carlos Mendoza</p>}
                                          <p className={`${hideTeacherNameComunicado ? 'font-bold mt-1' : 'italic opacity-80 text-[12.5px]'}`}>Docente del curso de DPCC</p>
                                        </div>
                                      )}
                                      <div className="absolute bottom-0 right-0 text-[11px] text-[#667781] dark:text-[#8696a0] font-medium mt-1.5 flex justify-end items-center gap-1 pb-0.5">
                                         {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} 
                                      </div>
                                   </div>
                                </div>
                             </div>
                         </div>
                       </div>
                     )}
                   </>
                 ) : (
                   <div className="flex flex-col gap-4">
                     {comunicadosHistory.length === 0 ? (
                       <div className="py-12 bg-slate-50 border border-slate-100 rounded-[20px] dark:bg-slate-800/20 dark:border-slate-800 text-center flex flex-col items-center">
                         <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                           <Info size={28} className="text-slate-400" />
                         </div>
                         <h4 className="text-slate-700 dark:text-slate-300 font-bold text-base mb-1">No hay historial</h4>
                         <p className="text-slate-500 text-[13px]">Los comunicados compartidos aparecerán aquí.</p>
                       </div>
                     ) : (
                       comunicadosHistory.map((com, index) => (
                         <div key={com.id} className="bg-white border flex flex-col gap-3 p-4 border-slate-200 rounded-[24px] dark:bg-slate-800/40 dark:border-slate-700 shadow-sm relative transition-all hover:bg-slate-50">
                           <div className="flex items-center justify-between mt-1">
                             <div className="flex items-center gap-2">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${com.type === 'Urgente' ? 'bg-rose-100 text-rose-600' : com.type === 'Informativo' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                                 {com.type === 'Urgente' ? <AlertTriangle size={14}/> : com.type === 'Informativo' ? <Info size={14}/> : <Megaphone size={14}/>}
                               </div>
                               <span className="font-extrabold text-[14px] text-slate-800 dark:text-white leading-none">Comunicado {com.type}</span>
                             </div>
                             <span className="text-[12px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{com.date}</span>
                           </div>
                           <div className="px-1 text-slate-600 text-[13px] dark:text-slate-300 font-medium break-words leading-relaxed truncate">{com.message}</div>
                           <div className="flex items-center justify-between mt-1">
                             <div className="px-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Users size={12}/> Enviado a: {com.recipient}</div>
                             
                             {(com.seenCount !== undefined && com.totalCount !== undefined) && (
                               <div className="flex items-center gap-2">
                                  <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md text-[11px] font-bold">
                                     <CheckCheck size={14} /> {com.seenCount} Vistos
                                  </span>
                                  <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 rounded-md text-[11px] font-bold">
                                     <Clock size={12} /> {com.totalCount - com.seenCount} Faltantes
                                  </span>
                               </div>
                             )}
                           </div>
                         </div>
                       ))
                     )}
                     
                   </div>
                 )}
              </div>

              {comunicadoModal.tab === 'redactar' && comunicadoModal.step === 2 && (
                <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
                  <button 
                     disabled={!comunicadoModal.mensaje || !comunicadoModal.motivo}
                     onClick={() => {
                         const newHistoryItem = {
                            id: Date.now(),
                            date: new Date().toLocaleDateString('es-PE'),
                            type: comunicadoModal.motivo,
                            message: comunicadoModal.mensaje,
                            recipient: comunicadoModal.destinatario,
                            seenCount: 0,
                            totalCount: comunicadoModal.destinatario.includes('Todas') ? 150 : 30
                         };
                         setComunicadosHistory([newHistoryItem, ...comunicadosHistory]);
                         alert("Comunicado enviado por WhatsApp masivamente a las secciones exitosamente.");
                         setComunicadoModal(prev => ({...prev, isOpen: false, mensaje: '', motivo: '', step: 1, tab: 'redactar'}));
                     }}
                     className="w-full bg-[#00a884] hover:bg-[#008f6f] text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                  >
                     <Send size={20} />
                     Enviar por WhatsApp Masivo
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

const StudentDetail: React.FC<{
  student: UserItem;
  onBack: () => void;
  isParentView?: boolean;
}> = ({ student, onBack, isParentView }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() >= 2 && new Date().getMonth() <= 11
      ? new Date().getMonth()
      : 2,
  );
  const [justifiedDays, setJustifiedDays] = useState<Record<string, string>>(
    {},
  );
  const [isJustifyModalOpen, setIsJustifyModalOpen] = useState(false);
  const [
    isAttendanceNotificationsModalOpen,
    setIsAttendanceNotificationsModalOpen,
  ] = useState(false);
  const [activeAttendanceTab, setActiveAttendanceTab] = useState<
    "asistencia" | "salidas"
  >("asistencia");
  const [parentViewIncident, setParentViewIncident] = useState<any>(null);
  const [showWebhookSimulation, setShowWebhookSimulation] = useState(false);
  const [dayToJustify, setDayToJustify] = useState<any>(null);
  const [justificationObservation, setJustificationObservation] = useState("");
  const [incidentSignatures, setIncidentSignatures] = useState<
    Record<string, { status: "pending" | "signed"; date?: string; ip?: string }>
  >({
    "inc-1": { status: "pending" },
    "inc-2": { status: "signed", date: "2026-03-06 14:20", ip: "192.168.1.45" },
  });

  const [isRegisterIncidentModalOpen, setIsRegisterIncidentModalOpen] = useState(false);
  const [showIncidentWhatsAppPreview, setShowIncidentWhatsAppPreview] = useState(false);
  const [incidentForm, setIncidentForm] = useState({ type: '', description: '', teacher: 'Carlos Mendoza del curso de DPCC' });

  const months = [
    { value: 2, label: "Marzo" },
    { value: 3, label: "Abril" },
    { value: 4, label: "Mayo" },
    { value: 5, label: "Junio" },
    { value: 6, label: "Julio" },
    { value: 7, label: "Agosto" },
    { value: 8, label: "Septiembre" },
    { value: 9, label: "Octubre" },
    { value: 10, label: "Noviembre" },
    { value: 11, label: "Diciembre" },
  ];

  const calendarData = useMemo(() => {
    const year = new Date().getFullYear();
    const data = [];
    const firstDay = new Date(year, selectedMonth, 1);
    const lastDay = new Date(year, selectedMonth + 1, 0);

    let startOffset = firstDay.getDay() - 1;
    if (startOffset === -1) startOffset = 6; // Sunday

    for (let i = 0; i < startOffset; i++) {
      data.push(null);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const current = new Date(year, selectedMonth, d);
      const isWeekend = current.getDay() === 0 || current.getDay() === 6;

      let status = "Sin registro";
      let color = "bg-slate-100 dark:bg-slate-800 text-slate-400";

      if (!isWeekend) {
        const hash =
          current.getDate() + student.name.charCodeAt(0) + selectedMonth;
        status = "Presente";
        color =
          "bg-emerald-500 border-2 border-emerald-600 text-white shadow-sm";
        if (hash % 10 === 0) {
          status = "Falta";
          color = "bg-rose-500 border-2 border-rose-600 text-white shadow-sm";
        } else if (hash % 7 === 0) {
          status = "Tardanza";
          color = "bg-amber-500 border-2 border-amber-600 text-white shadow-sm";
        }

        const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
        if (justifiedDays[dateStr]) {
          status = `${status} (Justificada)`;
          color = "bg-blue-500 border-2 border-blue-600 text-white shadow-sm";
        }
      }

      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
      data.push({
        date: dateStr,
        dayNumber: d,
        isWeekend,
        status,
        color,
        originalStatus: status.split(" ")[0],
      });
    }
    return data;
  }, [student.name, selectedMonth, justifiedDays]);

  const [incidentsPage, setIncidentsPage] = useState(1);

  // Estados para el reporte del estudiante
  const [reportPeriod, setReportPeriod] = useState<
    "Día" | "Semana" | "Mes" | "Bimestre"
  >("Día");
  const [reportType, setReportType] = useState<
    "Asistencia" | "Incidencias" | "Completo"
  >("Completo");
  const [selectedReportDate, setSelectedReportDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedReportWeek, setSelectedReportWeek] = useState<string>(
    getWeekString(new Date()),
  );
  const [selectedReportMonth, setSelectedReportMonth] = useState<number>(
    new Date().getMonth() >= 2 && new Date().getMonth() <= 11
      ? new Date().getMonth()
      : 2,
  );
  const [selectedReportBimestre, setSelectedReportBimestre] =
    useState<number>(1);

  // Reset page when month changes
  useEffect(() => {
    setIncidentsPage(1);
  }, [selectedMonth]);

  // Mock data for personal incidents combined with attendance
  const personalIncidents = useMemo(() => {
    const year = new Date().getFullYear();
    const monthAttendance = [];

    // Generate attendance for the selected month to show in incidents list
    const lastDay = new Date(year, selectedMonth + 1, 0).getDate();
    for (let d = 1; d <= lastDay; d++) {
      const current = new Date(year, selectedMonth, d);
      const isWeekend = current.getDay() === 0 || current.getDay() === 6;
      if (!isWeekend) {
        const hash = d + student.name.charCodeAt(0) + selectedMonth;
        let status = "Presente";
        if (hash % 10 === 0) {
          status = "Falta";
        } else if (hash % 7 === 0) {
          status = "Tardanza";
        }

        const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
        const isJustified = justifiedDays[dateStr] !== undefined;

        monthAttendance.push({
          date: dateStr,
          originalStatus: status,
          isJustified,
          justification: justifiedDays[dateStr],
        });
      }
    }

    const attendanceIncidents = monthAttendance.flatMap((d) => {
      const isFalta = d.originalStatus === "Falta";
      const isTardanza = d.originalStatus === "Tardanza";
      const isPresente = d.originalStatus === "Presente";

      const entryId = `att-in-${d.date}`;
      const exitId = `att-out-${d.date}`;

      const incidents = [];

      // Ingreso
      incidents.push({
        id: entryId,
        date: d.date,
        time: isFalta ? "08:00 AM" : isTardanza ? "08:15 AM" : "07:50 AM",
        teacher: null,
        originalStatus: d.originalStatus,
        type: {
          id: isFalta ? "falta" : isTardanza ? "tardanza" : "ingreso",
          label: isFalta ? "Inasistencia" : isTardanza ? "Tardanza" : "Ingreso",
          category: isFalta ? "Grave" : isTardanza ? "Leve" : "Informativo",
          icon: isFalta ? AlertTriangle : isTardanza ? Clock : CheckCircle2,
          color: d.isJustified
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : isFalta
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : isTardanza
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
        description: d.isJustified
          ? `Justificada: ${d.justification || "Sin observación"}`
          : `Registro de ${d.originalStatus.toLowerCase()} en el sistema de asistencia.`,
        signatureStatus:
          incidentSignatures[entryId]?.status || "Esperando confirmación",
        signatureDate: incidentSignatures[entryId]?.date,
        signatureIp: incidentSignatures[entryId]?.ip,
      });

      // Salida (only if not Falta)
      if (!isFalta) {
        incidents.push({
          id: exitId,
          date: d.date,
          time: "02:00 PM",
          teacher: null,
          originalStatus: "Salida",
          type: {
            id: "salida",
            label: "Salida",
            category: "Informativo",
            icon: CheckCircle2,
            color: "bg-slate-50 text-slate-700 border-slate-200",
          },
          description: `Registro de salida del estudiante.`,
          signatureStatus:
            incidentSignatures[exitId]?.status || "Esperando confirmación",
          signatureDate: incidentSignatures[exitId]?.date,
          signatureIp: incidentSignatures[exitId]?.ip,
        });
      }

      return incidents;
    });

    const mockIncidents = [
      {
        id: "inc-1",
        date: `${year}-${String(selectedMonth + 1).padStart(2, "0")}-15`,
        time: "10:30 AM",
        teacher: "Prof. María Gómez",
        type: INCIDENT_TYPES[0],
        description: "Discusión en el recreo",
      },
      {
        id: "inc-2",
        date: `${year}-${String(selectedMonth + 1).padStart(2, "0")}-05`,
        time: "08:15 AM",
        teacher: "Prof. Carlos Ruiz",
        type: INCIDENT_TYPES[4],
        description: "No presentó la tarea de matemáticas",
      },
    ].map((inc) => ({
      ...inc,
      signatureStatus:
        incidentSignatures[inc.id]?.status || "Esperando confirmación",
      signatureDate: incidentSignatures[inc.id]?.date,
      signatureIp: incidentSignatures[inc.id]?.ip,
    }));

    return [...mockIncidents, ...attendanceIncidents].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [student.name, selectedMonth, justifiedDays, incidentSignatures]);

  const paginatedIncidents = useMemo(() => {
    const startIndex = (incidentsPage - 1) * 5;
    return personalIncidents.slice(startIndex, startIndex + 5);
  }, [personalIncidents, incidentsPage]);

  const totalIncidentPages = Math.ceil(personalIncidents.length / 5);

  const handleOpenJustifyModal = (record: any) => {
    if (
      record.originalStatus === "Falta" ||
      record.originalStatus === "Tardanza"
    ) {
      setDayToJustify(record);
      setJustificationObservation("");
      setIsJustifyModalOpen(true);
    }
  };

  const handleConfirmJustification = () => {
    if (!dayToJustify) return;
    setJustifiedDays((prev) => ({
      ...prev,
      [dayToJustify.date]: justificationObservation || "Sin observación",
    }));
    setIsJustifyModalOpen(false);
    setDayToJustify(null);
  };

  const handleDownloadPersonalReport = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("I.E 6049 RICARDO PALMA", pageWidth / 2, 15, { align: "center" });
    doc.text(`REGISTRO DE ${reportType.toUpperCase()}`, pageWidth / 2, 22, {
      align: "center",
    });

    // Subheader info
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("TIPO: ESTUDIANTES", 14, 35);
    doc.text("NIVEL: INICIAL", 70, 35);
    doc.text("GRADO: 3 AÑOS", 130, 35);
    doc.text("SECCIÓN: MARGARITAS", 190, 35);

    const monthNames = [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ];
    const currentMonthName = monthNames[selectedReportMonth];
    const currentYear = new Date().getFullYear();
    doc.text(`MES: ${currentMonthName} ${currentYear}`, 250, 35);

    // Draw border for subheader
    doc.rect(12, 28, pageWidth - 24, 10);

    if (reportType === "Asistencia") {
      // Generate days for the month
      const daysInMonth = new Date(
        currentYear,
        selectedReportMonth + 1,
        0,
      ).getDate();
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

      const dayLetters = days.map((day) => {
        const date = new Date(currentYear, selectedReportMonth, day);
        const dayOfWeek = date.getDay();
        return ["D", "L", "M", "M", "J", "V", "S"][dayOfWeek];
      });

      const head = [
        [
          {
            content: "N°",
            rowSpan: 2,
            styles: { halign: "center" as const, valign: "middle" as const },
          },
          {
            content: "APELLIDOS Y NOMBRES",
            rowSpan: 2,
            styles: { halign: "center" as const, valign: "middle" as const },
          },
          ...days.map((d) => ({
            content: d.toString(),
            styles: { halign: "center" as const, cellPadding: 1 },
          })),
        ],
        [
          ...dayLetters.map((l) => ({
            content: l,
            styles: { halign: "center" as const, cellPadding: 1 },
          })),
        ],
      ];

      const body = [
        [
          1,
          `${student.lastName} ${student.firstName}`.toUpperCase(),
          ...days.map((day) => {
            const date = new Date(currentYear, selectedReportMonth, day);
            const dayOfWeek = date.getDay();

            if (dayOfWeek === 0 || dayOfWeek === 6) {
              return ""; // Weekend
            } else {
              // Use actual calendar data if available
              const record = calendarData.find((r) => r && r.dayNumber === day);
              if (record) {
                if (record.originalStatus === "Falta")
                  return {
                    content: "F",
                    styles: {
                      textColor: [255, 0, 0] as [number, number, number],
                    },
                  };
                if (record.originalStatus === "Tardanza")
                  return {
                    content: "T",
                    styles: {
                      textColor: [255, 165, 0] as [number, number, number],
                    },
                  };
                if (record.status.includes("Justificada"))
                  return {
                    content: "J",
                    styles: {
                      textColor: [0, 0, 255] as [number, number, number],
                    },
                  };
              }
              return ""; // Present
            }
          }),
        ],
      ];

      autoTable(doc, {
        startY: 40,
        head: head,
        body: body,
        theme: "grid",
        styles: {
          fontSize: 7,
          cellPadding: 1,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 50 },
        },
      });

      // Legend
      const finalY = (doc as any).lastAutoTable.finalY || 40;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        ". Asistió   F Faltó   T Tardanza   J Falta justificada",
        14,
        finalY + 5,
      );

      // Print date
      const printDate = new Date().toLocaleString("es-PE");
      doc.text(`Impreso: ${printDate}`, pageWidth - 14, finalY + 5, {
        align: "right",
      });
    } else if (reportType === "Incidencias") {
      const head = [["Fecha", "Hora", "Tipo", "Descripción", "Registrado por"]];
      const body = personalIncidents.map((inc) => [
        inc.date,
        inc.time || "10:30 AM",
        inc.type.label,
        inc.description,
        inc.teacher || "Prof. María García",
      ]);

      autoTable(doc, {
        startY: 40,
        head: head,
        body: body,
        theme: "grid",
        styles: { fontSize: 8, lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
      });

      const finalY = (doc as any).lastAutoTable.finalY || 40;
      const printDate = new Date().toLocaleString("es-PE");
      doc.setFontSize(8);
      doc.text(`Impreso: ${printDate}`, pageWidth - 14, finalY + 5, {
        align: "right",
      });
    }

    doc.save(
      `Reporte_${reportType}_${student.firstName}_${student.lastName}.pdf`,
    );
  };

  const unconfirmedAttendancesCount = useMemo(() => {
    return personalIncidents.filter(
      (inc) =>
        inc.id.startsWith("att-") &&
        inc.signatureStatus === "Esperando confirmación",
    ).length;
  }, [personalIncidents]);

  return (
    <div className="flex-1 overflow-hidden min-h-0 flex flex-col pt-1 font-poppins animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden h-full relative">
        <div className="flex-1 overflow-auto bg-gray-50/30 dark:bg-slate-900/50">
          
          <div className="bg-[#f0f4f8] dark:bg-slate-800/50 rounded-t-2xl p-6 sm:p-8 border-b border-gray-200 dark:border-slate-700 shrink-0">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                {!isParentView && (
                  <button
                    onClick={onBack}
                    className="flex-shrink-0 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 dark:hover:text-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group"
                  >
                    <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
                  </button>
                )}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 shrink-0 rounded-[20px] flex items-center justify-center text-white text-2xl font-bold shadow-md ${student.avatarColor}`}
                  >
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {student.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-base font-medium">
                        DNI: {student.dni}
                      </span>
                      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-base font-medium">
                        {student.level === "Inicial"
                          ? student.section
                          : `${student.grade.replace("° Grado", "")}°${student.section}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Heatmap Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                Asistencia
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-sm">
                <button
                  onClick={() =>
                    setSelectedMonth((prev) => (prev > 2 ? prev - 1 : 11))
                  }
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200 min-w-[80px] text-center">
                  {months.find((m) => m.value === selectedMonth)?.label}
                </span>
                <button
                  onClick={() =>
                    setSelectedMonth((prev) => (prev < 11 ? prev + 1 : 2))
                  }
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
              <button
                onClick={() => setIsAttendanceNotificationsModalOpen(true)}
                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-sm min-w-[44px] flex justify-center items-center relative"
                title="Ver Notificaciones de Asistencia"
              >
                <Bell className="w-5 h-5" />
                {unconfirmedAttendancesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unconfirmedAttendancesCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setReportType("Asistencia");
                  setReportPeriod("Mes");
                  setSelectedReportMonth(selectedMonth);
                  setTimeout(handleDownloadPersonalReport, 0);
                }}
                className="p-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors shadow-sm min-w-[44px] flex justify-center items-center"
                title="Descargar Asistencia"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6 flex-1 bg-white dark:bg-slate-900">
            <div className="grid grid-cols-7 gap-3">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                <div
                  key={day}
                  className="text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2"
                >
                  {day}
                </div>
              ))}
              {calendarData.map((record, idx) => {
                if (!record) {
                  return (
                    <div key={`empty-${idx}`} className="aspect-square"></div>
                  );
                }
                return (
                  <div
                    key={idx}
                    onClick={() =>
                      !record.isWeekend && handleOpenJustifyModal(record)
                    }
                    className={`relative aspect-square rounded-2xl ${record.isWeekend ? "bg-slate-50/80 dark:bg-slate-800/50 text-slate-400 font-bold" : record.color} group ${!record.isWeekend && (record.originalStatus === "Falta" || record.originalStatus === "Tardanza") ? "cursor-pointer hover:ring-2 hover:ring-blue-400" : "cursor-help"} transition-transform hover:scale-105 flex items-center justify-center`}
                  >
                    <span className="text-lg font-bold">
                      {record.dayNumber}
                    </span>
                    {!record.isWeekend && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 rounded-2xl backdrop-blur-sm z-10">
                        <span className="text-white text-[10px] font-bold text-center leading-tight px-1">
                          {record.status}
                          {(record.originalStatus === "Falta" ||
                            record.originalStatus === "Tardanza") &&
                            !record.status.includes("Justificada") && (
                              <span className="block text-[8px] text-blue-300 mt-1">
                                Click para justificar
                              </span>
                            )}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-600"></div>{" "}
                Presente
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-amber-600"></div>{" "}
                Tardanza
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-rose-600"></div>{" "}
                Falta
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-600"></div>{" "}
                Justificada
              </div>
            </div>
          </div>
        </div>

        {/* Incidents Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Incidencias
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg text-sm font-bold">
                <AlertTriangle className="w-4 h-4" />
                {
                  calendarData.filter((d) => d?.originalStatus === "Falta")
                    .length
                }{" "}
                Faltas
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-bold">
                <Clock className="w-4 h-4" />
                {
                  calendarData.filter((d) => d?.originalStatus === "Tardanza")
                    .length
                }{" "}
                Tardanzas
              </div>
              <button
                onClick={() => {
                  setReportType("Incidencias");
                  setReportPeriod("Mes");
                  setSelectedReportMonth(selectedMonth);
                  setTimeout(handleDownloadPersonalReport, 0);
                }}
                className="p-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors shadow-sm min-w-[48px] flex justify-center"
                title="Descargar Incidencias"
              >
                <Download className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsRegisterIncidentModalOpen(true)}
                className="p-3 bg-rose-600 text-white hover:bg-rose-700 rounded-xl transition-colors shadow-sm flex items-center gap-2 font-bold px-4"
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="hidden sm:inline">Registrar Incidencia</span>
              </button>
            </div>
          </div>
          <div className="p-5 flex-1 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col">
            {personalIncidents.length > 0 ? (
              <>
                <div className="space-y-4 flex-1">
                  {paginatedIncidents.map((incident, idx) => {
                    const Icon = incident.type.icon;
                    const isSevere = incident.type.category === "Grave";
                    return (
                      <div
                        key={idx}
                        className={`p-5 bg-white dark:bg-slate-800 rounded-xl border ${isSevere ? "border-rose-200 dark:border-rose-900/50 shadow-rose-100 dark:shadow-rose-900/20" : "border-slate-200 dark:border-slate-700"} shadow-sm hover:shadow-md transition-all flex gap-4`}
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${incident.type.color.includes("rose") ? "bg-rose-600 text-white" : incident.type.color.includes("amber") ? "bg-amber-500 text-white" : incident.type.color.includes("blue") ? "bg-blue-600 text-white" : "bg-slate-700 text-white"}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-800 dark:text-white text-base uppercase tracking-wide">
                              {incident.type.label}
                            </h4>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${isSevere ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}
                            >
                              {incident.type.category}
                            </span>
                            {incident.signatureStatus && (
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 ${incident.signatureStatus === "Confirmado por el padre" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}
                              >
                                {incident.signatureStatus ===
                                "Confirmado por el padre" ? (
                                  <CheckCircle2 className="w-3 h-3" />
                                ) : (
                                  <Clock className="w-3 h-3" />
                                )}
                                {incident.signatureStatus ===
                                "Confirmado por el padre"
                                  ? "Confirmado por el padre"
                                  : "Esperando confirmación"}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                            {incident.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {incident.date}
                              </div>
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {incident.time}
                              </div>
                              {incident.teacher && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                  <div className="flex items-center gap-1">
                                    <User className="w-3.5 h-3.5" />
                                    {incident.teacher}
                                  </div>
                                </>
                              )}
                            </div>
                            {incident.signatureStatus ===
                              "Esperando confirmación" && (
                              <button
                                onClick={() => {
                                  setParentViewIncident(incident);
                                  setShowWebhookSimulation(false);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded-lg text-xs font-bold transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                Simular WhatsApp
                              </button>
                            )}
                            {incident.signatureStatus ===
                              "Confirmado por el padre" && (
                              <div
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700"
                                title={`IP: ${incident.signatureIp}`}
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                {incident.signatureDate}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {totalIncidentPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() =>
                        setIncidentsPage((p) => Math.max(1, p - 1))
                      }
                      disabled={incidentsPage === 1}
                      className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Anterior
                    </button>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Página {incidentsPage} de {totalIncidentPages}
                    </span>
                    <button
                      onClick={() =>
                        setIncidentsPage((p) =>
                          Math.min(totalIncidentPages, p + 1),
                        )
                      }
                      disabled={incidentsPage === totalIncidentPages}
                      className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                </div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                  Excelente comportamiento
                </p>
                <p className="text-sm mt-1">
                  No se registran incidencias para este estudiante.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE JUSTIFICACIÓN */}
      <AnimatePresence>
        {isJustifyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsJustifyModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shadow-sm">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                        Justificar {dayToJustify?.originalStatus}
                      </h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        Validación Manual
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsJustifyModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl flex gap-3 mb-6">
                  <AlertTriangle
                    className="text-amber-600 shrink-0"
                    size={20}
                  />
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300 leading-relaxed">
                    Asegúrate de que los documentos físicos presentados sean
                    correctos. Esta acción quedará registrada en el historial.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Estudiante
                    </p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Fecha: {dayToJustify?.date}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase tracking-widest">
                      Motivo / Observación (Opcional)
                    </label>
                    <textarea
                      value={justificationObservation}
                      onChange={(e) =>
                        setJustificationObservation(e.target.value)
                      }
                      placeholder="Ej: Presentó certificado médico físico..."
                      className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-transparent rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-200 transition-all min-h-[100px] resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button
                    onClick={() => setIsJustifyModalOpen(false)}
                    className="py-4 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmJustification}
                    className="py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2"
                  >
                    <Check size={18} /> Confirmar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VISTA WHATSAPP MODAL */}
      <AnimatePresence>
        {parentViewIncident && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setParentViewIncident(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <div className="relative flex flex-col md:flex-row gap-6 items-center justify-center w-full max-w-4xl pointer-events-none">
              {/* Phone Simulation */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-sm h-[80vh] max-h-[700px] bg-[#efeae2] rounded-[40px] shadow-2xl border-[12px] border-slate-900 overflow-hidden flex flex-col pointer-events-auto"
                style={{
                  backgroundImage:
                    'url("https://i.pinimg.com/originals/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg")',
                  backgroundSize: "cover",
                  backgroundBlendMode: "overlay",
                  backgroundColor: "rgba(239, 234, 226, 0.9)",
                }}
              >
                {/* Mobile Status Bar Simulation */}
                <div className="h-7 bg-[#075e54] w-full flex justify-between items-center px-5 shrink-0 text-white/90 text-[10px] font-medium">
                  <span>18:47</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full border border-white/50"></div>
                    <div className="w-3 h-3 rounded-full bg-white/80"></div>
                  </div>
                </div>

                {/* WhatsApp Header */}
                <div className="bg-[#005c4b] dark:bg-[#202C33] py-2.5 px-3 flex items-center gap-3 shrink-0 shadow-sm relative z-10">
                  <button
                    onClick={() => setParentViewIncident(null)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors -ml-1 text-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-white/50">
                    <img src={APP_CONFIG.schoolLogo} alt="Logo" className="w-full h-full object-cover scale-[1.7]" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col text-white">
                    <span className="font-bold text-[15px] leading-tight flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                      Asistencia Ricardo Palma Secundaria
                    </span>
                    <span className="text-[12px] text-white/80 leading-tight">Cuenta Oficial de Empresa</span>
                  </div>
                </div>

                {/* Chat Content */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative custom-scrollbar">
                  {/* Fake WhatsApp Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.06] pointer-events-none" style={{
                     backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
                     backgroundSize: 'cover'
                  }}></div>

                  <div className="self-center bg-[#E1F3FB] dark:bg-[#182229] text-slate-700 dark:text-slate-300 text-[11px] font-medium px-3 py-1 rounded-lg uppercase tracking-wider relative z-10 shadow-sm">
                     HOY
                  </div>

                  {/* Message Bubble */}
                  <div className="bg-white dark:bg-[#202C33] rounded-[12px] rounded-tl-[0px] p-3 shadow-sm max-w-[90%] relative z-10 text-left">
                    <div className="text-[15px] leading-[1.4] whitespace-pre-wrap break-words text-slate-800 dark:text-slate-100 font-medium space-y-3">
                      <p className="font-bold flex items-center gap-2">
                        🚨 Notificación de Incidencia
                      </p>
                      <p>
                        Estimado padre de familia, se ha registrado una
                        incidencia conductual del estudiante{" "}
                        <span className="font-semibold text-[#005c4b] dark:text-emerald-400">
                          {student.name}
                        </span>
                        .
                      </p>
                      <p className="font-bold">Detalle: {parentViewIncident.description}</p>
                      
                      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/50 text-[14px]">
                        <p>📝 *Registrado por:*</p>
                        <p className="font-bold mt-1">{parentViewIncident.teacher || parentViewIncident.registrar || 'Carlos Mendoza'}</p>
                        <p className="italic opacity-80 text-[13px] mt-0.5">Docente del curso de DPCC</p>
                      </div>

                      <p className="italic text-[13px] opacity-80 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                        Por favor, confirme que ha recibido este aviso digital.
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                        ID: {parentViewIncident.id?.toUpperCase() || "INC-2026-001"}
                      </p>
                    </div>
                    {/* Bubble arrow */}
                    <div className="absolute left-[-8px] top-0 w-3 h-4 bg-white dark:bg-[#202C33]" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}></div>
                    <div className="text-right mt-1">
                      <span className="text-[10px] text-slate-400">18:47</span>
                    </div>

                    {/* Interactive Buttons */}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2">
                      {incidentSignatures[parentViewIncident.id]?.status ===
                      "Confirmado por el padre" ? (
                        <div className="flex items-center justify-center gap-2 py-2 text-[#075e54] font-medium text-sm">
                          <Check className="w-4 h-4" /> Confirmado por el padre
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setShowWebhookSimulation(true);
                            setTimeout(() => {
                              setIncidentSignatures((prev) => ({
                                ...prev,
                                [parentViewIncident.id]: {
                                  status: "Confirmado por el padre",
                                  date: new Date().toLocaleString("es-PE", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  }),
                                  ip: "190.234.x.x",
                                },
                              }));
                            }, 1500);
                          }}
                          className="flex items-center justify-center gap-2 py-2 text-[#00a884] font-medium text-sm hover:bg-slate-50 rounded-md transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Confirmar de
                          Enterado
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Parent Reply (if signed) */}
                  {incidentSignatures[parentViewIncident.id]?.status ===
                    "Confirmado por el padre" && (
                    <div className="bg-[#dcf8c6] rounded-lg rounded-tr-none p-2 shadow-sm max-w-[80%] self-end relative">
                      <p className="text-sm text-slate-800">✅ Conforme</p>
                      <div className="text-right mt-1 flex items-center justify-end gap-1">
                        <span className="text-[10px] text-slate-500">
                          18:48
                        </span>
                        <Check className="w-3 h-3 text-blue-500" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Webhook Simulation Terminal */}
              <AnimatePresence>
                {showWebhookSimulation && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md bg-[#1e1e1e] rounded-xl shadow-2xl border border-slate-700 overflow-hidden font-mono text-sm pointer-events-auto"
                  >
                    <div className="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center border-b border-slate-700">
                      <span className="text-emerald-400 font-bold text-xs">
                        SIMULACIÓN WEBHOOK WAHA
                      </span>
                      <span className="bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                        RECIBIDO
                      </span>
                    </div>
                    <div className="p-4 text-slate-300 space-y-1">
                      <p>{"{"}</p>
                      <p className="pl-4">
                        <span className="text-blue-400">"event"</span>:{" "}
                        <span className="text-amber-300">"message.create"</span>
                        ,
                      </p>
                      <p className="pl-4">
                        <span className="text-blue-400">"payload"</span>: {"{"}
                      </p>
                      <p className="pl-8">
                        <span className="text-blue-400">"from"</span>:{" "}
                        <span className="text-amber-300">
                          "51900000000@c.us"
                        </span>
                        ,
                      </p>
                      <p className="pl-8">
                        <span className="text-blue-400">"body"</span>:{" "}
                        <span className="text-amber-300">"✅ Conforme"</span>,
                      </p>
                      <p className="pl-8">
                        <span className="text-blue-400">
                          "selectedButtonId"
                        </span>
                        :{" "}
                        <span className="text-amber-300">
                          "CONFORME_LECTURA"
                        </span>
                        ,
                      </p>
                      <p className="pl-8">
                        <span className="text-blue-400">"timestamp"</span>:{" "}
                        <span className="text-purple-400">
                          {Math.floor(Date.now() / 1000)}
                        </span>
                      </p>
                      <p className="pl-4">{"}"}</p>
                      <p>{"}"}</p>

                      {incidentSignatures[parentViewIncident.id]?.status ===
                        "Confirmado por el padre" && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4 pt-4 border-t border-slate-700 text-emerald-400 font-bold"
                        >
                          Acción: Guardando firma digital en Base de Datos para
                          auditoría UGEL...
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Registrar Incidencia Modal with WhatsApp Preview */}
      <AnimatePresence>
        {isRegisterIncidentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden w-full flex flex-col transition-all duration-300 max-w-xl`}
            >
              <div className="flex flex-col lg:flex-row w-full h-full max-h-[90vh]">
                
                 {/* Form Section */}
                 <div className="flex-1 flex flex-col min-h-0 relative overflow-y-auto custom-scrollbar">
                   <div className="px-6 py-[22px] border-b border-[#EAEBF0] dark:border-slate-800 flex justify-between items-center bg-transparent sticky top-0 z-10 bg-white dark:bg-slate-900">
                     <h3 className="text-xl font-extrabold text-[#0D082C] dark:text-white flex items-center gap-2.5">
                       <AlertTriangle className="w-[22px] h-[22px] text-rose-500" /> <span className="pt-0.5">Registrar Incidencia</span>
                     </h3>
                     <button onClick={() => setIsRegisterIncidentModalOpen(false)} className="text-[#8792A2] hover:text-[#0D082C] dark:hover:text-slate-300 transition-colors bg-[#F2F4FC] dark:bg-slate-800 w-9 h-9 rounded-full flex items-center justify-center">
                       <X className="w-5 h-5" />
                     </button>
                   </div>
                   
                   <div className="p-6 flex flex-col gap-6 flex-1">
                     <div>
                       <label className="block text-sm font-extrabold text-slate-700 dark:text-slate-300 mb-2">Estudiante</label>
                       <div className="flex items-center gap-4 bg-rose-50 dark:bg-rose-900/20 p-4 rounded-[12px] border-none shadow-none">
                         <div className={`w-[45px] h-[45px] rounded-full flex items-center justify-center text-white font-bold text-[18px] bg-rose-500`}>
                            {student.name.charAt(0)}
                         </div>
                         <div>
                           <p className="font-extrabold text-rose-900 dark:text-rose-100 text-[17px] leading-none mb-1">{student.name}</p>
                           <p className="text-[13px] text-rose-700 dark:text-rose-400 font-semibold">{student.grade.replace("° Grado", "")}°{student.section}</p>
                         </div>
                       </div>
                     </div>

                     <div>
                       <label className="block text-sm font-extrabold text-slate-700 dark:text-slate-300 mb-2">Tipo de Incidencia</label>
                       <select
                         value={incidentForm.type}
                         onChange={(e) => setIncidentForm(prev => ({ ...prev, type: e.target.value }))}
                         className="w-full pl-4 pr-10 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 appearance-none focus:ring-2 focus:ring-rose-500 outline-none"
                       >
                         <option value="" disabled>Seleccione un tipo</option>
                         <option value="Conducta en clase">Conducta en clase</option>
                         <option value="Falta de respeto">Falta de respeto</option>
                         <option value="Falta de material">Falta de material</option>
                         <option value="Uso indebido de celular">Uso indebido de celular</option>
                         <option value="Incumplimiento de tareas">Incumplimiento de tareas</option>
                       </select>
                     </div>

                     <div>
                       <label className="block text-sm font-extrabold text-slate-700 dark:text-slate-300 mb-2">Descripción Detallada</label>
                       <textarea
                         value={incidentForm.description}
                         onChange={(e) => setIncidentForm(prev => ({ ...prev, description: e.target.value }))}
                         placeholder="Describa el suceso ocurrido..."
                         className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[10px] px-4 py-3 font-medium text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[120px] resize-none"
                       />
                     </div>
                   </div>

                   <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-4 bg-transparent sticky bottom-0 z-10 bg-white dark:bg-slate-900">
                     <button onClick={() => setIsRegisterIncidentModalOpen(false)} className="px-[25px] py-[11px] rounded-[10px] font-extrabold text-slate-700 dark:text-slate-300 hover:text-slate-900 transition-colors border border-slate-200 dark:border-slate-700 text-[13px]">Cancelar</button>
                     <button 
                       disabled={!incidentForm.type || !incidentForm.description} 
                       className="px-[25px] py-[11px] rounded-[10px] font-extrabold bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-2 min-w-[120px] justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-none text-[13px]"
                     >
                       Registrar Incidencia
                     </button>
                   </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Attendance Notifications Modal */}
      <AnimatePresence>
        {isAttendanceNotificationsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                      Estado de Notificaciones
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Ingresos y salidas de {student.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAttendanceNotificationsModalOpen(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {unconfirmedAttendancesCount > 0 && (
                  <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-amber-800 dark:text-amber-300 font-bold text-sm">
                        Acción Requerida
                      </h4>
                      <p className="text-amber-600 dark:text-amber-400 text-xs mt-1">
                        Hay {unconfirmedAttendancesCount} notificaciones
                        esperando confirmación del padre/apoderado.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setActiveAttendanceTab("asistencia")}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeAttendanceTab === "asistencia" ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`}
                  >
                    Asistencia
                  </button>
                  <button
                    onClick={() => setActiveAttendanceTab("salidas")}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeAttendanceTab === "salidas" ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`}
                  >
                    Salidas
                  </button>
                </div>

                <div className="space-y-4">
                  {personalIncidents.filter((inc) =>
                    inc.id.startsWith(
                      activeAttendanceTab === "asistencia"
                        ? "att-in-"
                        : "att-out-",
                    ),
                  ).length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      No hay notificaciones de{" "}
                      {activeAttendanceTab === "asistencia"
                        ? "asistencia"
                        : "salida"}{" "}
                      registradas.
                    </div>
                  ) : (
                    personalIncidents
                      .filter((inc) =>
                        inc.id.startsWith(
                          activeAttendanceTab === "asistencia"
                            ? "att-in-"
                            : "att-out-",
                        ),
                      )
                      .map((incident) => (
                        <div
                          key={incident.id}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg shrink-0 ${incident.type.color}`}
                            >
                              <incident.type.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-800 dark:text-white">
                                  {incident.type.label}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />{" "}
                                  {incident.date}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {incident.time}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {incident.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full flex items-center gap-1 ${incident.signatureStatus === "Confirmado por el padre" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}
                            >
                              {incident.signatureStatus ===
                              "Confirmado por el padre" ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                              {incident.signatureStatus ===
                              "Confirmado por el padre"
                                ? "Confirmado por el padre"
                                : "Esperando confirmación"}
                            </span>

                            {incident.signatureStatus ===
                            "Confirmado por el padre" ? (
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-500" />{" "}
                                {incident.signatureDate}
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setIsAttendanceNotificationsModalOpen(false);
                                  setParentViewIncident(incident);
                                  setShowWebhookSimulation(false);
                                }}
                                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                              >
                                <MessageCircle className="w-3 h-3" /> Simular
                                WhatsApp
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const TEACHER_SCHEDULE: Record<string, {start: string; end: string; subject: string; section?: string; color: string}[]> = {
  "Lunes": [
    { start: "8:00", end: "8:45", subject: "DPCC", section: "4°A", color: "bg-indigo-200 text-indigo-900 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800" },
    { start: "8:45", end: "9:30", subject: "DPCC", section: "4°A", color: "bg-indigo-200 text-indigo-900 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800" },
    { start: "9:30", end: "10:15", subject: "DPCC", section: "3°B", color: "bg-pink-200 text-pink-900 border-pink-300 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-800" },
    { start: "10:15", end: "11:00", subject: "DPCC", section: "3°B", color: "bg-pink-200 text-pink-900 border-pink-300 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-800" },
    { start: "11:00", end: "11:15", subject: "RECREO", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
    { start: "11:15", end: "12:00", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "12:00", end: "12:45", subject: "DPCC", section: "3°A", color: "bg-amber-400 text-amber-900 border-amber-500 dark:bg-amber-600/40 dark:text-amber-300 dark:border-amber-700" },
    { start: "12:45", end: "13:15", subject: "RECREO", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
    { start: "13:15", end: "14:00", subject: "DPCC", section: "3°A", color: "bg-amber-400 text-amber-900 border-amber-500 dark:bg-amber-600/40 dark:text-amber-300 dark:border-amber-700" },
    { start: "14:00", end: "14:45", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "14:45", end: "15:30", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
  ],
  "Martes": [
    { start: "8:00", end: "8:45", subject: "DPCC", section: "3°C", color: "bg-yellow-300 text-yellow-900 border-yellow-400 dark:bg-yellow-600/40 dark:text-yellow-300 dark:border-yellow-700" },
    { start: "8:45", end: "9:30", subject: "DPCC", section: "3°C", color: "bg-yellow-300 text-yellow-900 border-yellow-400 dark:bg-yellow-600/40 dark:text-yellow-300 dark:border-yellow-700" },
    { start: "9:30", end: "10:15", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "10:15", end: "11:00", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "11:00", end: "11:15", subject: "RECREO", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
    { start: "11:15", end: "12:00", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "12:00", end: "12:45", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "12:45", end: "13:15", subject: "RECREO", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
    { start: "13:15", end: "14:00", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "14:00", end: "14:45", subject: "TUT", section: "3°C", color: "bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-600/60 dark:text-emerald-100 dark:border-emerald-700" },
    { start: "14:45", end: "15:30", subject: "TUT", section: "3°C", color: "bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-600/60 dark:text-emerald-100 dark:border-emerald-700" }
  ],
  "Miércoles": [
    { start: "8:00", end: "8:45", subject: "DPCC", section: "3°D", color: "bg-sky-400 text-sky-900 border-sky-500 dark:bg-sky-600/40 dark:text-sky-200 dark:border-sky-700" },
    { start: "8:45", end: "9:30", subject: "DPCC", section: "3°D", color: "bg-sky-400 text-sky-900 border-sky-500 dark:bg-sky-600/40 dark:text-sky-200 dark:border-sky-700" },
    { start: "9:30", end: "10:15", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "10:15", end: "11:00", subject: "DPCC", section: "3°B", color: "bg-pink-200 text-pink-900 border-pink-300 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-800" },
    { start: "11:00", end: "11:15", subject: "RECREO", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
    { start: "11:15", end: "12:00", subject: "DPCC", section: "3°B", color: "bg-pink-200 text-pink-900 border-pink-300 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-800" },
    { start: "12:00", end: "12:45", subject: "REUNIÓN TUTORIAS", color: "bg-transparent text-slate-800 font-bold dark:text-slate-200" },
    { start: "12:45", end: "13:15", subject: "RECREO", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
    { start: "13:15", end: "14:00", subject: "REUNIÓN TUTORIAS", color: "bg-transparent text-slate-800 font-bold dark:text-slate-200" },
    { start: "14:00", end: "14:45", subject: "DPCC", section: "4°A", color: "bg-indigo-200 text-indigo-900 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800" },
    { start: "14:45", end: "15:30", subject: "DPCC", section: "4°A", color: "bg-indigo-200 text-indigo-900 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800" }
  ],
  "Jueves": [
    { start: "8:00", end: "8:45", subject: "DPCC", section: "4°B", color: "bg-lime-300 text-lime-900 border-lime-400 dark:bg-lime-600/40 dark:text-lime-300 dark:border-lime-700" },
    { start: "8:45", end: "9:30", subject: "DPCC", section: "4°B", color: "bg-lime-300 text-lime-900 border-lime-400 dark:bg-lime-600/40 dark:text-lime-300 dark:border-lime-700" },
    { start: "9:30", end: "10:15", subject: "DPCC", section: "4°B", color: "bg-lime-300 text-lime-900 border-lime-400 dark:bg-lime-600/40 dark:text-lime-300 dark:border-lime-700" },
    { start: "10:15", end: "11:00", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "11:00", end: "11:15", subject: "RECREO", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
    { start: "11:15", end: "12:00", subject: "DPCC", section: "3°A", color: "bg-amber-400 text-amber-900 border-amber-500 dark:bg-amber-600/40 dark:text-amber-300 dark:border-amber-700" },
    { start: "12:00", end: "12:45", subject: "DPCC", section: "3°A", color: "bg-amber-400 text-amber-900 border-amber-500 dark:bg-amber-600/40 dark:text-amber-300 dark:border-amber-700" },
    { start: "12:45", end: "13:15", subject: "RECREO", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
    { start: "13:15", end: "14:00", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "14:00", end: "14:45", subject: "DPCC", section: "3°C", color: "bg-yellow-300 text-yellow-900 border-yellow-400 dark:bg-yellow-600/40 dark:text-yellow-300 dark:border-yellow-700" },
    { start: "14:45", end: "15:30", subject: "DPCC", section: "3°C", color: "bg-yellow-300 text-yellow-900 border-yellow-400 dark:bg-yellow-600/40 dark:text-yellow-300 dark:border-yellow-700" }
  ],
  "Viernes": [
    { start: "8:00", end: "8:45", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "8:45", end: "9:30", subject: "REUNIÓN CORD DPCC", color: "bg-transparent text-slate-800 font-bold dark:text-slate-200" },
    { start: "9:30", end: "10:15", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "10:15", end: "11:00", subject: "DPCC", section: "4°B", color: "bg-lime-300 text-lime-900 border-lime-400 dark:bg-lime-600/40 dark:text-lime-300 dark:border-lime-700" },
    { start: "11:00", end: "11:15", subject: "RECREO", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
    { start: "11:15", end: "12:00", subject: "DPCC", section: "3°D", color: "bg-sky-400 text-sky-900 border-sky-500 dark:bg-sky-600/40 dark:text-sky-200 dark:border-sky-700" },
    { start: "12:00", end: "12:45", subject: "DPCC", section: "3°D", color: "bg-sky-400 text-sky-900 border-sky-500 dark:bg-sky-600/40 dark:text-sky-200 dark:border-sky-700" },
    { start: "12:45", end: "13:15", subject: "RECREO", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
    { start: "13:15", end: "14:00", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "14:00", end: "14:45", subject: "LIBRE", color: "bg-transparent text-slate-400 border-dashed border-slate-200 dark:border-slate-800" },
    { start: "14:45", end: "15:30", subject: "REUNIÓN CORD EPT", color: "bg-transparent text-slate-800 font-bold dark:text-slate-200" }
  ]
};

const CitationsPanel: React.FC<{
  classroom: { level: string; grade: string; section: string };
  students: UserItem[];
  tutor?: UserItem;
  citations: CitationItem[];
  setCitations: React.Dispatch<React.SetStateAction<CitationItem[]>>;
  onBack: () => void;
}> = ({ classroom, students, tutor, citations, setCitations, onBack }) => {
  const [sidebarTab, setSidebarTab] = useState<"Pendientes" | "Confirmadas" | "Historial" | "Canceladas">("Pendientes");
  const [showIncidentsFilter, setShowIncidentsFilter] = useState(false);
  const [selectedStudentToCite, setSelectedStudentToCite] = useState<UserItem | null>(null);
  const [citeReason, setCiteReason] = useState<"Incidencias" | "Rendimiento Académico" | "Otros">("Incidencias");
  const [customCiteReason, setCustomCiteReason] = useState("");
  
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");

  const [rescheduleModal, setRescheduleModal] = useState<{isOpen: boolean; citation: CitationItem | null}>({isOpen: false, citation: null});
  const [realizadoModal, setRealizadoModal] = useState<{isOpen: boolean; citationId: string | null}>({isOpen: false, citationId: null});
  const [reschedDate, setReschedDate] = useState("");
  const [reschedTime, setReschedTime] = useState("");
  const [reschedReason, setReschedReason] = useState("");
  const [reschedDateError, setReschedDateError] = useState("");
  const [expandedCitations, setExpandedCitations] = useState<string[]>([]);

  const toggleCitation = (id: string) => {
    setExpandedCitations(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [filterGrade, setFilterGrade] = useState("Todos");
  const [filterMonth, setFilterMonth] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Confirmadas"); // For confirmed tab
  const [filterReasonList, setFilterReasonList] = useState<"Todos" | "Incidencias" | "Académico" | "Otros">("Todos");

  const [composeStep, setComposeStep] = useState(1);
  const [selectedIncidentsForCitation, setSelectedIncidentsForCitation] = useState<string[]>([]);
  const dummyIncidentsList = useMemo(() => [
    { id: "inc-1", type: "No trajo el material escolar", date: "14/04/2026", time: "10:55 AM", reporter: "Auxiliar Juan Perez" },
    { id: "inc-2", type: "Falta de respeto a compañero", date: "12/04/2026", time: "10:42 AM", reporter: "Prof. Ana Gómez" },
    { id: "inc-3", type: "Interrupción constante", date: "14/04/2026", time: "10:40 AM", reporter: "Prof. Ana Gómez" },
    { id: "inc-4", type: "Uso inadecuado del celular", date: "13/04/2026", time: "10:56 AM", reporter: "Prof. Lorenzo Castillo" },
  ], []);

  const handleNextStep = () => {
    if (composeStep === 1) {
      if (citeReason === "Incidencias") {
        setComposeStep(2);
      } else {
        setComposeStep(3); // skip incidents
      }
    } else if (composeStep === 2) {
      setComposeStep(3);
    }
  };

  const handlePrevStep = () => {
    if (composeStep === 3) {
      if (citeReason === "Incidencias") {
        setComposeStep(2);
      } else {
        setComposeStep(1);
      }
    } else if (composeStep === 2) {
      setComposeStep(1);
    }
  };

  const toggleIncidentSelection = (id: string) => {
    setSelectedIncidentsForCitation(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  const toggleAllIncidents = () => {
    if (selectedIncidentsForCitation.length === dummyIncidentsList.length) {
      setSelectedIncidentsForCitation([]);
    } else {
      setSelectedIncidentsForCitation(dummyIncidentsList.map(i => i.id));
    }
  };

  const handleRescheduleDateChange = (value: string) => {
    setReschedDate(value);
    setReschedDateError("");
    if (!value) return;
    const [y, m, d] = value.split('-');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    const day = date.getDay();
    if (day === 0 || day === 6) {
      setReschedDateError("Las citas solo pueden programarse de Lunes a Viernes.");
      setReschedDate("");
    }
  };

  const handleReschedule = () => {
    if (rescheduleModal.citation) {
      setCitations(prev => prev.map(c => 
        c.id === rescheduleModal.citation!.id 
          ? { ...c, status: "waiting", scheduledDate: `En proceso para el ${reschedDate} a las ${reschedTime}`, reason: reschedReason || c.reason }
          : c
      ));
      setRescheduleModal({isOpen: false, citation: null});
    }
  };

  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 3, 1));
  const nextCalendarMonth = () => setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const prevCalendarMonth = () => setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  const calYear = currentCalendarDate.getFullYear();
  const calMonth = currentCalendarDate.getMonth();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfMonth = (new Date(calYear, calMonth, 1).getDay() + 6) % 7; 
  const monthName = currentCalendarDate.toLocaleString('es-PE', { month: 'long', year: 'numeric' });

  const getMonthFromName = (dateString: string | undefined) => {
    if(!dateString) return "";
    return dateString.toLowerCase().includes("abril") ? "Abril" : 
           dateString.toLowerCase().includes("mayo") ? "Mayo" : 
           dateString.toLowerCase().includes("junio") ? "Junio" : "";
  };

  const inProcess = citations.filter(c => {
    if (!(c.status === "waiting" || c.status === "confirmed_by_parent" || c.status === "pending")) return false;
    if (filterMonth !== "Todos" && getMonthFromName(c.scheduledDate) !== filterMonth) return false;
    if (filterReasonList !== "Todos") {
        if (filterReasonList === "Incidencias" && !c.reason.toLowerCase().includes("incidencia")) return false;
        if (filterReasonList === "Académico" && !c.reason.toLowerCase().includes("académico") && !c.reason.toLowerCase().includes("academico") && !c.reason.toLowerCase().includes("acad")) return false;
        if (filterReasonList === "Otros" && !c.reason.toLowerCase().includes("otro")) return false;
    }
    // Assuming c doesn't have grade natively, we mock it via classroom if it matches but usually all belong to classroom
    return true;
  });

  const confirmed = citations.filter(c => {
    if (filterStatus === "Confirmadas" && c.status !== "closed") return false;
    if (filterStatus === "Rechazadas" && c.status !== "rejected") return false; // Assuming 'rejected' exists
    if (filterStatus === "Rechazadas" && c.status === "closed") return false;
    if (c.status !== "closed" && c.status !== "rejected") return false;

    if (filterMonth !== "Todos" && getMonthFromName(c.scheduledDate) !== filterMonth) return false;
    
    if (filterReasonList !== "Todos") {
        if (filterReasonList === "Incidencias" && !c.reason.toLowerCase().includes("incidencia")) return false;
        if (filterReasonList === "Académico" && !c.reason.toLowerCase().includes("académico") && !c.reason.toLowerCase().includes("academico") && !c.reason.toLowerCase().includes("acad")) return false;
        if (filterReasonList === "Otros" && !c.reason.toLowerCase().includes("otro")) return false;
    }
    return true;
  });

  const handleSendCitation = () => {
    if (!selectedStudentToCite) return;
    const finalReason = citeReason === 'Otros' ? (customCiteReason || 'Otros') : citeReason === 'Rendimiento Académico' ? 'Rendimiento académico' : citeReason === 'Incidencias' ? 'Acumulación de incidencias' : citeReason;
    
    const newCitation: CitationItem = {
      id: `cite-${Date.now()}`,
      studentId: selectedStudentToCite.id,
      name: selectedStudentToCite.name,
      avatarColor: selectedStudentToCite.avatarColor,
      avatarLetter: selectedStudentToCite.name.charAt(0),
      reason: finalReason,
      status: 'pending', 
      theme: citeReason.includes('Incidencias') ? 'red' : citeReason === 'Otros' ? 'yellow' : 'orange',
      scheduledDate: schedDate && schedTime ? `En proceso para el ${schedDate} a las ${schedTime}` : 'En proceso (Sin fecha)',
    };
    setCitations(prev => [newCitation, ...prev]);
    setIsComposeModalOpen(false);
    setSelectedStudentToCite(null);
    setSchedDate("");
    setSchedTime("");
  };

  const incidentCounts = useMemo(() => {
    const counts: Record<string, { leve: number, moderado: number, grave: number }> = {};
    students.forEach((s, idx) => {
      counts[s.id] = {
        leve: (idx * 3) % 4,
        moderado: (idx * 2) % 3,
        grave: idx % 2 === 0 ? 0 : 1
      };
    });
    return counts;
  }, [students]);

  return (
    <div className="flex-1 overflow-hidden min-h-0 flex flex-col pt-1">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden h-full relative animate-in fade-in slide-in-from-right-4 duration-500">
        
        <div className="bg-[#f0f4f8] dark:bg-slate-800/50 rounded-t-2xl p-6 sm:p-10 shrink-0">
          <div className="flex items-start sm:items-center w-full">
            <button
              onClick={onBack}
              className="flex-shrink-0 mr-4 sm:mr-6 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 dark:hover:text-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group"
            >
              <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
            </button>
            <div className="flex-1 flex items-center gap-6 min-w-0">
              <div className="relative w-16 h-16 shrink-0 rounded-[20px] bg-gradient-to-br from-indigo-500 to-purple-600 hidden sm:flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-indigo-400">
                <Mail className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Citaciones
                </h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-base mt-2">
                  Bandeja de gestión y notificaciones para padres de familia
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-w-0 min-h-0 bg-white dark:bg-slate-900">
          
          {/* Sidebar */}
          <div className="w-full md:w-[260px] border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800 shrink-0 py-4 sm:py-6 pr-4 overflow-y-auto">
             
             {/* Compose Button */}
             <div className="mb-6">
                <button 
                  onClick={() => {
                    setIsComposeModalOpen(true);
                    setComposeStep(1);
                    setSelectedStudentToCite(null);
                    setCiteReason("Incidencias");
                    setSchedDate("");
                    setSchedTime("");
                    setSelectedIncidentsForCitation([]);
                  }}
                  className="flex items-center gap-3 px-6 py-4 bg-[#c2e7ff] text-[#041e49] hover:bg-[#b5dfff] hover:shadow-md transition-all rounded-r-full w-full shadow-sm shadow-blue-500/10 group"
                >
                  <Edit2 className="w-5 h-5 fill-[#041e49] text-[#041e49]" strokeWidth={2.5} />
                  <span className="font-semibold text-[15px]">Redactar</span>
                </button>
             </div>

             <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible custom-scrollbar">
                {[ 
                  { id: "Pendientes", label: "Citas Pendientes", icon: Inbox, count: inProcess.length },
                  { id: "Confirmadas", label: "Citas Confirmadas", icon: CheckCircle2, count: confirmed.length },
                  { id: "Canceladas", label: "Citas Canceladas", icon: XCircle, count: 0 }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setSidebarTab(tab.id as any); setSelectedStudentToCite(null); }}
                    className={`flex items-center justify-between px-6 py-3 rounded-r-full font-medium text-[15px] transition-colors w-full group ${sidebarTab === tab.id ? "bg-[#d3e3fd] text-[#041e49] dark:bg-indigo-900/40 dark:text-indigo-200 font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}
                  >
                    <div className="flex items-center gap-4">
                      <tab.icon className={`w-5 h-5 shrink-0 transition-colors ${sidebarTab === tab.id ? 'text-[#041e49] fill-[#d3e3fd]/50 dark:fill-indigo-900/20' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`} />
                      <span className="flex-1 text-left">{tab.label}</span>
                    </div>
                    {tab.count > 0 && <span className={`text-[13px] font-bold ${sidebarTab === tab.id ? 'text-[#041e49] dark:text-indigo-200' : 'text-slate-500'}`}>{tab.count}</span>}
                  </button>
                ))}
              </div>
          </div>

          {/* Main Content wrapper */}
          <div className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col min-w-0 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800/50">
            
            {/* Global Filters Bar */}
            <div className="px-6 sm:px-10 pt-4 pb-4 border-b border-slate-100 dark:border-slate-800">
               <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                 {/* Left side: Reason Tabs */}
                 <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl w-full xl:max-w-md border border-slate-200 dark:border-slate-700 shadow-sm items-center h-[50px]">
                    <button 
                      onClick={() => setFilterReasonList("Todos")}
                      className={`flex-1 h-full font-bold rounded-lg text-[15px] flex justify-center items-center gap-2 transition-colors ${filterReasonList === 'Todos' ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow shadow-slate-200/50 dark:shadow-none' : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}
                    >
                       Todos
                    </button>
                    <button 
                      onClick={() => setFilterReasonList("Incidencias")}
                      className={`flex-1 h-full font-bold rounded-lg text-[15px] flex justify-center items-center gap-2 transition-colors ${filterReasonList === 'Incidencias' ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow shadow-slate-200/50 dark:shadow-none' : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}
                    >
                       Incidencias
                    </button>
                    <button 
                      onClick={() => setFilterReasonList("Académico")}
                      className={`flex-1 h-full font-bold rounded-lg text-[15px] flex justify-center items-center gap-2 transition-colors ${filterReasonList === 'Académico' ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow shadow-slate-200/50 dark:shadow-none' : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}
                    >
                       Académico
                    </button>
                    <button 
                      onClick={() => setFilterReasonList("Otros")}
                      className={`flex-1 h-full font-bold rounded-lg text-[15px] flex justify-center items-center gap-2 transition-colors ${filterReasonList === 'Otros' ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow shadow-slate-200/50 dark:shadow-none' : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}
                    >
                       Otros
                    </button>
                 </div>

                 {/* Right side: Dropdowns */}
                 <div className="flex flex-wrap items-center gap-3">
                   <div className="relative">
                     <select 
                       value={filterGrade}
                       onChange={e => setFilterGrade(e.target.value)}
                       className="appearance-none font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-5 pr-12 py-3 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer text-[15px] shadow-sm min-w-[140px]"
                     >
                        <option value="Todos">Todas las Aulas</option>
                        <option value="3°C">Secundaria - 3°C</option>
                        <option value="4°B">Secundaria - 4°B</option>
                        <option value="5°A">Secundaria - 5°A</option>
                     </select>
                     <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                   </div>
                   <div className="relative">
                     <select 
                       value={filterMonth}
                       onChange={e => setFilterMonth(e.target.value)}
                       className="appearance-none font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-5 pr-12 py-3 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer text-[15px] shadow-sm min-w-[140px]"
                     >
                        <option value="Todos">Todos los Meses</option>
                        <option value="Abril">Abril</option>
                        <option value="Mayo">Mayo</option>
                        <option value="Junio">Junio</option>
                     </select>
                     <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                   </div>
                 </div>
               </div>
            </div>

            <div className="p-6 sm:p-10 flex-1 flex flex-col w-full h-full">
              {/* En Proceso List */}
              {sidebarTab === "Pendientes" && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-8 w-full max-w-7xl pt-2">
                <div className="flex flex-col gap-4 w-full">
                {inProcess.map(c => {
                  const isExpanded = expandedCitations.includes(c.id);
                  let timeStr = "10:00 hrs";
                  let dateStr = "15 Abr";
                  if(c.scheduledDate) {
                     const parts = c.scheduledDate.replace('En proceso para el ', '').replace('Confirmada para el ', '').split('a las');
                     if(parts[0]) {
                        dateStr = parts[0].trim();
                        if(dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                           const dDate = new Date(dateStr);
                           dateStr = `${dDate.getDate()} ${dDate.toLocaleString('es-PE', {month: 'short'})}`;
                        } else {
                           dateStr = dateStr.split(',')[0].replace(' de ', ', ');
                        }
                     }
                     if(parts[1]) timeStr = parts[1].trim() + " hrs";
                  }
                  
                  let badge = null;
                  if (dateStr.includes("20")) {
                     badge = <span className="px-2 py-0.5 rounded text-[10px] uppercase font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">HOY</span>;
                  }

                  return (
                  <div key={c.id} className="bg-white dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700/80 rounded-2xl flex flex-col shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all w-full overflow-hidden">
                    <button 
                      onClick={() => toggleCitation(c.id)} 
                      className="flex items-center justify-between p-4 sm:px-6 w-full text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${c.avatarColor}`}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#041e49] dark:text-white text-[15px]">{c.name}</p>
                          <p className="text-slate-600 dark:text-slate-400 font-medium text-[12px] mt-0.5">{c.reason.replace(/^(Incidencias|Académico|Otros)\s*-\s*/i, '')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <div className="flex items-center gap-2 mb-0.5">
                               {badge}
                               <span className="font-bold text-slate-800 dark:text-slate-200 text-[13px]">{dateStr.replace(/miercoles/i, 'Míercoles')}</span>
                            </div>
                            <span className="text-slate-500 font-medium text-[12px]">{timeStr}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6 overflow-hidden"
                        >
                          <div className="flex flex-col gap-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                            <div className="w-full">
                                <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[130px_1fr] gap-y-4 gap-x-4 items-center">
                                    <span className="text-slate-500 dark:text-slate-400 font-semibold text-[14px]">Motivo:</span>
                                    <div className="flex items-center">
                                      <span className={`text-[13px] w-fit px-3 py-1.5 rounded-lg font-bold tracking-wide ${c.theme === 'yellow' || c.theme === 'orange' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : c.theme === 'blue' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                                        {c.reason.replace(/^(Incidencias|Académico|Otros)\s*-\s*/i, '').charAt(0).toUpperCase() + c.reason.replace(/^(Incidencias|Académico|Otros)\s*-\s*/i, '').slice(1)}
                                      </span>
                                    </div>

                                    <span className="text-slate-500 dark:text-slate-400 font-semibold text-[14px]">Fecha:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[15px] whitespace-nowrap">
                                      {c.scheduledDate ? c.scheduledDate.replace('En proceso para el ', '').replace('Confirmada para el ', '').split(',')[0].replace(' de ', ', ').replace(/miercoles/i, 'Míercoles') : "Míercoles 15, Abril"}
                                    </span>

                                    <span className="text-slate-500 dark:text-slate-400 font-semibold text-[14px]">Hora:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">{c.scheduledDate?.split(',')[1]?.trim() || "10:00 AM"}</span>

                                    <span className="text-slate-500 dark:text-slate-400 font-semibold text-[14px]">Docente:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">Ana Gómez - Matemática</span>
                                </div>
                                
                                {c.incidents && c.incidents.length > 0 && (
                                  <div className="mt-6">
                                     <h4 className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-100 dark:border-slate-700/50 pb-2">Incidencias Vinculadas ({c.incidents.length})</h4>
                                     <div className="flex flex-col gap-2">
                                       {c.incidents.map((inc, i) => (
                                         <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl gap-2">
                                            <div className="flex flex-col">
                                              <span className="font-bold text-[14px] text-slate-800 dark:text-slate-200">{inc.type}</span>
                                              <span className="text-[12px] text-slate-500 font-medium">Reportado por: {inc.teacher}</span>
                                            </div>
                                            <div className="flex sm:flex-col items-end gap-2 sm:gap-0">
                                              <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{inc.date}</span>
                                              <span className="text-[12px] text-slate-500">{inc.time}</span>
                                            </div>
                                         </div>
                                       ))}
                                     </div>
                                  </div>
                                )}
                            </div>

                            <div className="flex w-full justify-end gap-3 pt-6 lg:pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                                <button
                                  className="px-6 py-2.5 bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors font-bold text-[14px] flex items-center gap-2 whitespace-nowrap"
                                >
                                  Cancelar Cita
                                </button>
                                <button 
                                  onClick={() => { setReschedDate(""); setReschedTime(""); setReschedReason(""); setRescheduleModal({isOpen: true, citation: c}); }} 
                                  className="px-6 py-2.5 justify-center bg-indigo-50 dark:bg-indigo-900/20 text-[#5c4ce1] dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border-[1.5px] border-indigo-200 dark:border-indigo-800/50 shadow-sm transition-colors font-bold text-[14px] flex items-center gap-2 whitespace-nowrap"
                                >
                                  Reprogramar
                                </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )})}
                </div>
                {inProcess.length === 0 && <p className="text-center text-slate-500 py-12 font-medium">No hay citas en este momento.</p>}
              </div>
            )}

            {/* Confirmadas List */}
            {sidebarTab === "Confirmadas" && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-8 w-full max-w-7xl">
                
                <div className="flex flex-col gap-4 w-full">
                {confirmed.map(c => {
                  const isExpanded = expandedCitations.includes(c.id);
                  let timeStr = "10:00 hrs";
                  let dateStr = "15 Abr";
                  if(c.scheduledDate) {
                     const parts = c.scheduledDate.replace('En proceso para el ', '').replace('Confirmada para el ', '').split('a las');
                     if(parts[0]) {
                        dateStr = parts[0].trim();
                        // Format specifically if it's "2026-04-20"
                        if(dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                           const dDate = new Date(dateStr);
                           dateStr = `${dDate.getDate()} ${dDate.toLocaleString('es-PE', {month: 'short'})}`;
                        } else {
                           dateStr = dateStr.split(',')[0].replace(' de ', ', ');
                        }
                     }
                     if(parts[1]) timeStr = parts[1].trim() + " hrs";
                  }
                  
                  let badge = null;
                  if (dateStr.includes("20")) {
                     badge = <span className="px-2 py-0.5 rounded text-[10px] uppercase font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">HOY</span>;
                  }

                  return (
                  <div key={c.id} className="bg-white dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700/80 rounded-2xl flex flex-col shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all w-full overflow-hidden">
                    <button 
                      onClick={() => toggleCitation(c.id)} 
                      className="flex items-center justify-between p-4 sm:px-6 w-full text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${c.avatarColor}`}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#041e49] dark:text-white text-[15px]">{c.name}</p>
                          <p className="text-slate-600 dark:text-slate-400 font-medium text-[12px] mt-0.5">{c.reason.replace(/^(Incidencias|Académico|Otros)\s*-\s*/i, '')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <div className="flex items-center gap-2 mb-0.5">
                               {badge}
                               <span className="font-bold text-slate-800 dark:text-slate-200 text-[13px]">{dateStr.replace(/miercoles/i, 'Míercoles')}</span>
                            </div>
                            <span className="text-slate-500 font-medium text-[12px]">{timeStr}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6 overflow-hidden"
                        >
                          <div className="flex flex-col gap-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                            <div className="w-full">
                                <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[130px_1fr] gap-y-4 gap-x-4 items-center">
                                    <span className="text-slate-500 dark:text-slate-400 font-semibold text-[14px]">Motivo:</span>
                                    <div className="flex items-center">
                                      <span className={`text-[13px] w-fit px-3 py-1.5 rounded-lg font-bold tracking-wide bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`}>
                                        {c.reason.replace(/^(Incidencias|Académico|Otros)\s*-\s*/i, '').charAt(0).toUpperCase() + c.reason.replace(/^(Incidencias|Académico|Otros)\s*-\s*/i, '').slice(1)}
                                      </span>
                                    </div>

                                    <span className="text-slate-500 dark:text-slate-400 font-semibold text-[14px]">Fecha:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[15px] whitespace-nowrap">
                                      {c.scheduledDate ? c.scheduledDate.replace('En proceso para el ', '').replace('Confirmada para el ', '').split(',')[0].replace(' de ', ', ').replace(/miercoles/i, 'Míercoles') : "Míercoles 15, Abril"}
                                    </span>

                                    <span className="text-slate-500 dark:text-slate-400 font-semibold text-[14px]">Hora:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">{c.scheduledDate?.split(',')[1]?.trim() || "08:00 AM"}</span>

                                    <span className="text-slate-500 dark:text-slate-400 font-semibold text-[14px]">Docente:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">Ana Gómez - Matemática</span>
                                </div>
                                
                                {c.incidents && c.incidents.length > 0 && (
                                  <div className="mt-6">
                                     <h4 className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-100 dark:border-slate-700/50 pb-2">Incidencias Vinculadas ({c.incidents.length})</h4>
                                     <div className="flex flex-col gap-2">
                                       {c.incidents.map((inc, i) => (
                                         <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl gap-2">
                                            <div className="flex flex-col">
                                              <span className="font-bold text-[14px] text-slate-800 dark:text-slate-200">{inc.type}</span>
                                              <span className="text-[12px] text-slate-500 font-medium">Reportado por: {inc.teacher}</span>
                                            </div>
                                            <div className="flex sm:flex-col items-end gap-2 sm:gap-0">
                                              <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{inc.date}</span>
                                              <span className="text-[12px] text-slate-500">{inc.time}</span>
                                            </div>
                                         </div>
                                       ))}
                                     </div>
                                  </div>
                                )}
                            </div>

                            <div className="flex w-full justify-end gap-3 pt-6 lg:pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                                <button
                                  onClick={() => {
                                    window.dispatchEvent(new CustomEvent('openCalendar', { detail: { date: c.scheduledDate } }));
                                  }}
                                  className="px-6 py-2.5 bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors font-bold text-[14px] flex items-center gap-2 whitespace-nowrap"
                                >
                                  <CalendarDays className="w-4 h-4" /> Calendario
                                </button>
                                <button 
                                  onClick={() => setRealizadoModal({isOpen: true, citationId: c.id})} 
                                  className="px-6 py-2.5 justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border-[1.5px] border-emerald-200 dark:border-emerald-800/50 shadow-sm transition-colors font-bold text-[14px] flex items-center gap-2 whitespace-nowrap"
                                >
                                  <Check className="w-5 h-5"/> Realizado
                                </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )})}
                </div>
                {confirmed.length === 0 && <p className="text-center text-slate-500 py-12 font-medium">No hay citas confirmadas.</p>}
              </div>
            )}

            {/* Canceladas List */}
            {sidebarTab === "Canceladas" && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-8 w-full max-w-7xl items-center justify-center pt-20">
                 <div className="bg-rose-50 dark:bg-rose-900/20 w-20 h-20 rounded-full flex items-center justify-center mb-4 border border-rose-100 dark:border-rose-900/50">
                    <XCircle className="w-10 h-10 text-rose-400" />
                 </div>
                 <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-200">No hay citas canceladas</h3>
                 <p className="text-slate-500 font-medium max-w-sm text-center">
                    Las citas que hayan sido rechazadas o canceladas definitivamente se mostrarán aquí.
                 </p>
              </div>
            )}

            {/* Reagendar Modal */}
            <AnimatePresence>
              {rescheduleModal.isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
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
                    <div className="p-6 flex flex-col gap-5">
                       <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${rescheduleModal.citation?.avatarColor}`}>
                            {rescheduleModal.citation?.name?.charAt(0)}
                         </div>
                         <div>
                           <p className="font-extrabold text-slate-800 dark:text-white text-lg leading-tight">{rescheduleModal.citation?.name}</p>
                           <p className="text-sm text-slate-500 font-medium mt-0.5">Motivo original: <span className="font-bold text-slate-700 dark:text-slate-300">{rescheduleModal.citation?.reason}</span></p>
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-5">
                         <div>
                           <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-indigo-500"/> Nueva fecha</label>
                           <div className="w-full relative z-[60]">
                             <CustomCalendar mode="date" value={reschedDate} onChange={handleRescheduleDateChange} placeholder="Seleccionar Fecha" />
                           </div>
                           {reschedDateError && <p className="text-xs text-red-500 mt-1.5 font-bold">{reschedDateError}</p>}
                         </div>
                         <div>
                           <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-500"/> Nueva hora</label>
                           <div className="relative">
                             <input type="time" value={reschedTime} onChange={e => setReschedTime(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm h-[42px]" style={{ fontFamily: "'Poppins', sans-serif" }} />
                           </div>
                         </div>
                       </div>

                       <div>
                         <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nuevo motivo (Opcional)</label>
                         <input type="text" value={reschedReason} onChange={e => setReschedReason(e.target.value)} placeholder="Ej. Cambio de horario a solicitud del padre" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                       </div>
                    </div>
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
                      <button onClick={() => setRescheduleModal({ isOpen: false, citation: null })} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancelar</button>
                      <button onClick={handleReschedule} className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-colors flex items-center gap-2"><Send className="w-4 h-4"/> Guardar y Notificar</button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Compose Modal */}
            <AnimatePresence>
              {isComposeModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden w-full max-w-[500px] flex flex-col max-h-[90vh]"
                  >
                    {/* Dynamic Header */}
                    <div className={`p-6 border-b flex justify-between items-center ${composeStep === 2 ? 'border-indigo-100 dark:border-indigo-800/50 bg-white dark:bg-slate-900 border-b-2' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'}`}>
                       <h3 className={`text-[19px] font-extrabold flex items-center gap-2 ${composeStep === 2 ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-white'}`}>
                         {composeStep === 2 ? (
                           <><AlertTriangle className="w-5 h-5 text-indigo-600" /> Selección de Incidencias</>
                         ) : (
                           <><Edit2 className="w-5 h-5 text-indigo-500" /> Generar Citación</>
                         )}
                       </h3>
                       <button onClick={() => { setIsComposeModalOpen(false); setSelectedStudentToCite(null); setComposeStep(1); }} className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-colors">
                         <X className="w-5 h-5" strokeWidth={2.5} />
                       </button>
                    </div>

                    {/* Step 1: Estudiante y Motivo */}
                    {composeStep === 1 && (
                      <div className="p-6 flex flex-col gap-6 overflow-y-auto">
                         <div>
                           <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Estudiante</label>
                           <div className="relative">
                             <select 
                               value={selectedStudentToCite?.id || ""} 
                               onChange={(e) => {
                                 const st = students.find(s => s.id === e.target.value);
                                 setSelectedStudentToCite(st || null);
                               }}
                               className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[15px] font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                             >
                               <option value="" disabled>Seleccione un estudiante</option>
                               {students.map(s => (
                                 <option key={s.id} value={s.id}>{s.name}</option>
                               ))}
                             </select>
                             <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                           </div>
                         </div>

                         <div>
                           <label className="block text-[17px] font-extrabold text-slate-900 dark:text-slate-300 mb-4 pt-2">Selecciona el motivo:</label>
                           <div className="flex flex-col gap-3">
                               <button
                                 onClick={() => {
                                   if (!selectedStudentToCite) return;
                                   setCiteReason("Incidencias");
                                   setComposeStep(2);
                                 }}
                                 disabled={!selectedStudentToCite}
                                 className="flex items-center justify-between p-4 rounded-[14px] bg-[#fff0f2] border border-[#ffe0e4] hover:bg-[#ffe4e8] transition-colors disabled:opacity-50"
                               >
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#ffd4dd] flex items-center justify-center text-[#9f0f29]">
                                      <AlertTriangle className="w-[20px] h-[20px]" strokeWidth={2.5}/>
                                    </div>
                                    <span className="font-extrabold text-[#7a061b] text-[17px]">Incidencias</span>
                                 </div>
                                 <ChevronRight className="w-5 h-5 text-[#f15e76]" strokeWidth={2.5} />
                               </button>

                               <button
                                 onClick={() => {
                                   if (!selectedStudentToCite) return;
                                   setCiteReason("Académico");
                                   setComposeStep(3);
                                 }}
                                 disabled={!selectedStudentToCite}
                                 className="flex items-center justify-between p-4 rounded-[14px] bg-[#eff9ff] border border-[#d9efff] hover:bg-[#e4f6ff] transition-colors disabled:opacity-50"
                               >
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#cbe9ff] flex items-center justify-center text-[#064289]">
                                      <BookOpen className="w-[20px] h-[20px]" strokeWidth={2.5}/>
                                    </div>
                                    <span className="font-extrabold text-[#033166] text-[17px]">Académico</span>
                                 </div>
                                 <ChevronRight className="w-5 h-5 text-[#62a2eb]" strokeWidth={2.5} />
                               </button>

                               <button
                                 onClick={() => {
                                   if (!selectedStudentToCite) return;
                                   setCiteReason("Otros");
                                   setComposeStep(3);
                                 }}
                                 disabled={!selectedStudentToCite}
                                 className="flex items-center justify-between p-4 rounded-[14px] bg-[#fffce8] border border-[#fff2ba] hover:bg-[#fff9d4] transition-colors disabled:opacity-50"
                               >
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#ffe484] flex items-center justify-center text-[#6e4600]">
                                      <Info className="w-[20px] h-[20px]" strokeWidth={2.5}/>
                                    </div>
                                    <span className="font-extrabold text-[#503100] text-[17px]">Otros</span>
                                 </div>
                                 <ChevronRight className="w-5 h-5 text-[#f4aa24]" strokeWidth={2.5} />
                               </button>
                           </div>
                         </div>
                      </div>
                    )}

                    {/* Step 2: Selección de Incidencias */}
                    {composeStep === 2 && selectedStudentToCite && (
                      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900/50">
                        <div className="bg-[#f3f4fa] dark:bg-indigo-900/20 border border-transparent p-5 rounded-2xl flex items-center gap-4 mb-6">
                           <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center text-white font-extrabold text-2xl ${selectedStudentToCite.avatarColor}`}>
                             {selectedStudentToCite.name.charAt(0)}
                           </div>
                           <div className="flex flex-col justify-center">
                             <p className="font-extrabold text-slate-900 dark:text-white text-[17px] leading-tight mb-0.5">{selectedStudentToCite.name}</p>
                             <p className="text-[#5252d4] dark:text-indigo-300 font-semibold text-[14px]">Motivo: {citeReason}</p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between mb-4 px-1">
                          <p className="font-extrabold text-slate-900 dark:text-slate-100 text-[15px]">Seleccionar incidencias a citar</p>
                          <button onClick={toggleAllIncidents} className="text-[#5252d4] dark:text-indigo-400 font-extrabold text-[14px] hover:underline">
                            Seleccionar todo
                          </button>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          {dummyIncidentsList.map(inc => (
                             <label key={inc.id} className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-700/50 rounded-[14px] hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors bg-white dark:bg-slate-800 shadow-sm">
                               <div className="mt-0.5 relative flex items-center justify-center">
                                 <input 
                                   type="checkbox" 
                                   checked={selectedIncidentsForCitation.includes(inc.id)}
                                   onChange={() => toggleIncidentSelection(inc.id)}
                                   className="appearance-none peer w-5 h-5 rounded-[4px] border-[1.5px] border-slate-400 checked:border-[#5252d4] checked:bg-[#5252d4] transition-all cursor-pointer hover:border-[#5252d4]" 
                                 />
                                 <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={4} />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-3">
                                     <span className="font-extrabold text-slate-900 dark:text-slate-100 text-[15px] leading-snug flex-1 break-words">{inc.type}</span>
                                     <div className="flex flex-col items-end shrink-0">
                                       <span className="text-[13px] font-bold text-[#8694a3] dark:text-slate-400">{inc.date}</span>
                                       <span className="text-[13px] font-bold text-[#8694a3] dark:text-slate-400 mt-0.5">{inc.time}</span>
                                     </div>
                                  </div>
                                  <p className="text-[14px] text-slate-600 dark:text-slate-400 mt-1.5 font-medium">Registrado por: {inc.reporter.replace('Prof. ', 'Prof. ')}</p>
                               </div>
                             </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Agendar (Fecha/Hora) */}
                    {composeStep === 3 && (
                      <div className="p-6 flex flex-col gap-5 overflow-y-auto">
                        
                         <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl flex items-center justify-between mb-2">
                           <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-md ${selectedStudentToCite?.avatarColor}`}>
                               {selectedStudentToCite?.name.charAt(0)}
                             </div>
                             <div>
                               <p className="font-extrabold text-slate-800 dark:text-white text-[15px]">{selectedStudentToCite?.name}</p>
                               <p className="text-indigo-600 dark:text-indigo-300 font-semibold text-xs leading-tight">{citeReason}</p>
                             </div>
                           </div>
                         </div>
                       
                         <div className="grid grid-cols-2 gap-5 z-20 relative">
                           <div>
                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-indigo-500"/> Fecha sugerida</label>
                             <div className="w-full relative z-[60]">
                               <CustomCalendar mode="date" value={schedDate} onChange={setSchedDate} placeholder="Seleccionar" />
                             </div>
                           </div>
                           <div>
                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-500"/> Hora sugerida</label>
                             <div className="relative">
                               <input type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-[15px] font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm h-[44px]" style={{ fontFamily: "'Poppins', sans-serif" }} />
                             </div>
                           </div>
                         </div>
                         {citeReason === 'Otros' && (
                           <div>
                             <label className="block text-[13px] font-extrabold text-slate-700 dark:text-slate-300 mb-2.5 mt-2">Motivo de la citación</label>
                             <textarea
                               className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 font-medium text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm placeholder:text-gray-400 resize-none min-h-[90px]"
                               placeholder="Escriba el detalle del motivo por el cual cita al estudiante..."
                               autoFocus
                               value={customCiteReason}
                               onChange={(e) => setCustomCiteReason(e.target.value)}
                             />
                           </div>
                         )}
                      </div>
                    )}


                    <div className={`p-6 flex justify-[space-evenly] gap-3 bg-slate-50 border-t border-slate-100 dark:bg-slate-900 rounded-b-3xl ${composeStep === 2 && 'bg-slate-50 dark:bg-slate-800'}`}>
                      <div className={`flex justify-center ${composeStep === 1 ? 'w-full' : 'flex-1 flex justify-center'}`}>
                      {composeStep === 2 ? (
                        <button onClick={() => { setIsComposeModalOpen(false); setSelectedStudentToCite(null); setComposeStep(1); }} className="font-extrabold text-[#041e49] dark:text-slate-300 hover:opacity-70 transition-opacity">Cancelar</button>
                      ) : composeStep === 3 ? (
                        <button onClick={handlePrevStep} className="font-extrabold text-[#041e49] dark:text-slate-300 hover:opacity-70 transition-opacity">Atrás</button>
                      ) : (
                        <button onClick={() => { setIsComposeModalOpen(false); setSelectedStudentToCite(null); setComposeStep(1); }} className="font-extrabold text-[#041e49] dark:text-slate-300 hover:opacity-70 transition-opacity">Cancelar</button>
                      )}
                      </div>
                      
                      {composeStep > 1 && (
                        <div className="flex justify-center flex-1">
                        {composeStep < 3 ? (
                          <button 
                            onClick={handleNextStep} 
                            disabled={composeStep === 1 && !selectedStudentToCite}
                            className="px-8 py-2.5 rounded-xl font-extrabold bg-[#acabf3] text-white hover:bg-indigo-400 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
                          >
                            Continuar
                          </button>
                        ) : (
                          <button 
                            onClick={handleSendCitation} 
                            disabled={!schedDate || !schedTime}
                            className="px-6 py-2.5 rounded-xl font-extrabold bg-[#5c4ce1] text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center w-full"
                          >
                             <Send className="w-4 h-4"/> Enviar Citación
                          </button>
                        )}
                        </div>
                      )}
                    </div>

                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Realizado Modal */}
            <AnimatePresence>
              {realizadoModal.isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden w-full max-w-[420px] flex flex-col items-center text-center p-8 pb-10"
                  >
                     <div className="w-[72px] h-[72px] rounded-full bg-[#dcfce7] flex items-center justify-center mb-5">
                       <div className="w-10 h-10 rounded-full border-[2.5px] border-[#0ea5e9] flex items-center justify-center border-emerald-600">
                          <Check className="w-5 h-5 text-emerald-600" strokeWidth={3} />
                       </div>
                     </div>
                     <h3 className="text-[22px] font-extrabold text-[#041e49] dark:text-white mb-2 leading-tight">
                       ¿Marcar como realizado?
                     </h3>
                     <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium px-4 mb-8">
                       Esta acción archivará la citación en el historial permanentemente.
                     </p>
                     
                     <div className="flex gap-4 w-full px-2">
                        <button 
                          onClick={() => setRealizadoModal({isOpen: false, citationId: null})}
                          className="flex-1 py-3.5 rounded-xl font-extrabold text-[#041e49] dark:text-slate-300 bg-[#f4f6fa] dark:bg-slate-800 hover:bg-[#e2e8f0] transition-colors"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={() => {
                            const updatedCitations = citations.map(c => 
                              c.id === realizadoModal.citationId ? { ...c, status: 'closed' as any } : c
                            );
                            setCitations(updatedCitations);
                            setRealizadoModal({isOpen: false, citationId: null});
                          }}
                          className="flex-1 py-3.5 rounded-xl font-extrabold text-white bg-[#059669] hover:bg-emerald-700 shadow-sm transition-colors"
                        >
                          Confirmar
                        </button>
                     </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

const VirtualAttendance: React.FC<{
  classroom: { level: string; grade: string; section: string };
  students: UserItem[];
  onBack: () => void;
}> = ({ classroom, students, onBack }) => {
  const [attendanceState, setAttendanceState] = useState<
    Record<string, "presente" | "tardanza" | "falta">
  >({});

  const handleMark = (
    studentId: string,
    status: "presente" | "tardanza" | "falta",
  ) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSave = () => {
    // Simulate saving
    alert("Asistencia virtual registrada correctamente.");
    onBack();
  };

  const currentDate = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex-1 overflow-hidden min-h-0 flex flex-col pt-1">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden h-full relative animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex-1 overflow-auto bg-gray-50/30 dark:bg-slate-900/50">
          <div className="bg-[#f0f4f8] dark:bg-slate-800/50 rounded-t-2xl p-6 sm:p-8 border-b border-gray-200 dark:border-slate-700 shrink-0">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                <button
                  onClick={onBack}
                  className="flex-shrink-0 mt-1 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 dark:hover:text-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group"
                >
                  <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 shrink-0 rounded-[20px] bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-cyan-400">
                    <MonitorPlay
                      className="w-8 h-8 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Asistencia
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-base capitalize mt-2">
                      {currentDate}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Registrar
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                      <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16 text-center">
                        #
                      </th>
                      <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Estudiante
                      </th>
                      <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                        Asistencia
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {students.map((student, index) => {
                      const status = attendanceState[student.id];
                      return (
                        <tr
                          key={student.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          <td className="p-4 text-center text-slate-400 dark:text-slate-500 font-mono text-sm font-medium">
                            {index + 1}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${student.avatarColor}`}
                              >
                                {student.name.charAt(0)}
                              </div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">
                                {student.name}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  handleMark(student.id, "presente")
                                }
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${status === "presente" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-50 text-slate-400 border border-slate-200 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                title="Presente"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleMark(student.id, "tardanza")
                                }
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${status === "tardanza" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" : "bg-slate-50 text-slate-400 border border-slate-200 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                title="Tardanza"
                              >
                                <Clock className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleMark(student.id, "falta")}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${status === "falta" ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" : "bg-slate-50 text-slate-400 border border-slate-200 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                title="Falta"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
