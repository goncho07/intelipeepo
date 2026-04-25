import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Download, Plus, Search, SquarePen, ArrowLeft, ShieldCheck, Briefcase, GraduationCap, Filter, ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight, LayoutGrid, List, MoreHorizontal, Mail, Phone, User, IdCard, ChevronRightCircle, X, Calendar, CreditCard, Baby, Check } from 'lucide-react';
import { PageHeader, containerVariants, KPICard } from '../components/UI';
import { CreateUserModal, UserDetailsModal, TeacherScheduleModal } from '../components/Modals';
import { MOCK_USERS, EDUCATIONAL_STRUCTURE } from '../constants';
import { UserItem, ModuleProps } from '../types';
import jsPDF from 'jspdf';

export const UsersModule: React.FC<ModuleProps> = () => {
  // Estado Principal
  const [selectedRole, setSelectedRole] = useState<UserItem['role']>('Estudiante');
  
  // Filtros
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [selectedGrade, setSelectedGrade] = useState('Todos');
  const [selectedSection, setSelectedSection] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [search, setSearch] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedLevel !== 'Todos') count++;
    if (selectedGrade !== 'Todos') count++;
    if (selectedSection !== 'Todos') count++;
    if (selectedStatus !== 'Todos') count++;
    return count;
  }, [selectedLevel, selectedGrade, selectedSection, selectedStatus]);

  const clearFilters = () => {
    setSelectedLevel('Todos');
    setSelectedGrade('Todos');
    setSelectedSection('Todos');
    setSelectedStatus('Todos');
    setSearch('');
  };
  
  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCarnetModalOpen, setIsCarnetModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [selectedTeacherForSchedule, setSelectedTeacherForSchedule] = useState<UserItem | null>(null);
  const [initialModalTab, setInitialModalTab] = useState<'personal' | 'academic' | 'family' | 'account'>('personal');

  const COURSES = [
    "Matemática", "Comunicación", "Ciencia y Tecnología", 
    "Personal Social", "Inglés", "Arte y Cultura", 
    "Educación Física", "Religión", "Tutoría", "Computación"
  ];

  const handleDownloadQR = async (user: UserItem) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const cardWidth = 85;
    const cardHeight = 54;
    const margin = 15;
    const gap = 5;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    let currentX = margin;
    let currentY = margin;

    // Mostrar un indicador de carga si es posible, pero aquí lo haremos directo
    for (const course of COURSES) {
      if (currentY + cardHeight > 280) {
        doc.addPage();
        currentY = margin;
        currentX = margin;
      }

      // Draw Card Border
      doc.setDrawColor(220, 220, 220);
      doc.roundedRect(currentX, currentY, cardWidth, cardHeight, 3, 3, 'S');

      // Header background
      doc.setFillColor(30, 64, 175);
      doc.roundedRect(currentX, currentY, cardWidth, 10, 3, 3, 'F');
      
      // Header text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('I.E 6049 RICARDO PALMA', currentX + cardWidth / 2, currentY + 6, { align: 'center' });

      // Student Info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(user.name.toUpperCase(), currentX + cardWidth / 2, currentY + 16, { align: 'center' });
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(75, 85, 99);
      doc.text(course.toUpperCase(), currentX + cardWidth / 2, currentY + 22, { align: 'center' });

      // QR Code
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`STUDENT:${user.dni}:${course}`)}`;
      try {
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        doc.addImage(base64, 'PNG', currentX + (cardWidth - 25) / 2, currentY + 25, 25, 25);
      } catch (e) {
        console.error("Error loading QR", e);
      }

      // Footer info
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(156, 163, 175);
      doc.text(`${user.level} - ${user.grade} ${user.section}`, currentX + cardWidth / 2, currentY + cardHeight - 4, { align: 'center' });

      // Update positions for grid (2 columns)
      if (currentX + cardWidth + gap + cardWidth > pageWidth) {
        currentX = margin;
        currentY += cardHeight + gap;
      } else {
        currentX += cardWidth + gap;
      }
    }

    doc.save(`Carnets_QR_${user.name.replace(/\s+/g, '_')}.pdf`);
  };

  const handleDownloadIncidents = (user: UserItem) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Título Principal
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('I.E 6049 RICARDO PALMA', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('REPORTE INDIVIDUAL DE INCIDENCIAS', pageWidth / 2, 22, { align: 'center' });

    // Cuadro de Información
    const startY = 30;
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.rect(margin, startY, pageWidth - (margin * 2), 20);
    
    doc.setFontSize(9);
    doc.text(`ESTUDIANTE: ${user.name.toUpperCase()}`, margin + 5, startY + 7);
    doc.text(`DNI: ${user.dni}`, margin + 5, startY + 14);
    doc.text(`NIVEL: ${user.level?.toUpperCase() || '-'}`, margin + 100, startY + 7);
    doc.text(`GRADO/SECCIÓN: ${user.grade?.toUpperCase() || '-'} ${user.section?.toUpperCase() || '-'}`, margin + 100, startY + 14);

    // Mock Table Data (since we don't have the real logs here)
    const tableData = [
      ['12/05/2025', '08:15 AM', 'FALTA DE UNIFORME', 'NORMAS', 'Vino sin la corbata del uniforme.', 'REGISTRADO'],
      ['14/05/2025', '11:00 AM', 'SIN MATERIAL', 'ACADÉMICO', 'No trajo material de arte.', 'REGISTRADO']
    ];

    // @ts-ignore
    import('jspdf-autotable').then(({ default: autoTable }) => {
      autoTable(doc, {
        startY: startY + 25,
        head: [['FECHA', 'HORA', 'INCIDENCIA', 'CATEGORÍA', 'DETALLE', 'ESTADO']],
        body: tableData,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          textColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineWidth: 0.2
        },
        margin: { left: margin, right: margin }
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const footerY = doc.internal.pageSize.getHeight() - 10;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        const now = new Date();
        const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        doc.text(`Generado el: ${dateStr}`, margin, footerY);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, footerY, { align: 'right' });
      }

      doc.save(`Reporte_Incidencias_${user.name.replace(/\s+/g, '_')}.pdf`);
    });
  };

  const generateBulkCarnets = async (level: string, grade: string, section: string) => {
    const students = MOCK_USERS.filter(u => 
      u.role === 'Estudiante' && 
      (level === 'Todos' || u.level === level) &&
      (grade === 'Todos' || u.grade === grade) &&
      (section === 'Todos' || u.section === section)
    );

    if (students.length === 0) {
      alert("No se encontraron estudiantes con los filtros seleccionados.");
      return;
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const cardWidth = 85;
    const cardHeight = 54;
    const margin = 15;
    const gap = 5;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    let currentX = margin;
    let currentY = margin;
    let isFirst = true;

    for (const user of students) {
      for (const course of COURSES) {
        if (!isFirst && currentX === margin && currentY === margin) {
          doc.addPage();
        }
        isFirst = false;

        // Draw Card Border
        doc.setDrawColor(220, 220, 220);
        doc.roundedRect(currentX, currentY, cardWidth, cardHeight, 3, 3, 'S');

        // Header background
        doc.setFillColor(30, 64, 175);
        doc.roundedRect(currentX, currentY, cardWidth, 10, 3, 3, 'F');
        
        // Header text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('I.E 6049 RICARDO PALMA', currentX + cardWidth / 2, currentY + 6, { align: 'center' });

        // Student Info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(user.name.toUpperCase(), currentX + cardWidth / 2, currentY + 16, { align: 'center' });
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(75, 85, 99);
        doc.text(course.toUpperCase(), currentX + cardWidth / 2, currentY + 22, { align: 'center' });

        // QR Code
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`STUDENT:${user.dni}:${course}`)}`;
        try {
          const response = await fetch(qrUrl);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          doc.addImage(base64, 'PNG', currentX + (cardWidth - 25) / 2, currentY + 25, 25, 25);
        } catch (e) {
          console.error("Error loading QR", e);
        }

        // Footer info
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(156, 163, 175);
        doc.text(`${user.level} - ${user.grade} ${user.section}`, currentX + cardWidth / 2, currentY + cardHeight - 4, { align: 'center' });

        // Update positions for grid (2 columns)
        if (currentX + cardWidth + gap + cardWidth > pageWidth) {
          currentX = margin;
          currentY += cardHeight + gap;
          if (currentY + cardHeight > 280) {
            currentY = margin;
          }
        } else {
          currentX += cardWidth + gap;
        }
      }
    }

    doc.save(`Carnets_Lote_${level}_${grade}_${section}.pdf`);
  };

  // --- LÓGICA DE DATOS ---

  // Reiniciar filtros al cambiar de rol
  useEffect(() => {
    setSelectedLevel('Todos');
    setSelectedGrade('Todos');
    setSelectedSection('Todos');
    setSelectedStatus('Todos');
    setCurrentPage(1);
    setSearch('');
  }, [selectedRole]);

  // Filtros en cascada
  useEffect(() => { setSelectedGrade('Todos'); setSelectedSection('Todos'); }, [selectedLevel]);
  useEffect(() => { setSelectedSection('Todos'); }, [selectedGrade]);
  useEffect(() => { setCurrentPage(1); }, [selectedLevel, selectedGrade, selectedSection, selectedStatus, search]);

  // Opciones Dinámicas
  const gradeOptions = useMemo(() => {
    if (selectedLevel === 'Todos' || !EDUCATIONAL_STRUCTURE[selectedLevel]) return [];
    return Object.keys(EDUCATIONAL_STRUCTURE[selectedLevel]);
  }, [selectedLevel]);

  const sectionOptions = useMemo(() => {
    if (selectedLevel === 'Todos' || selectedGrade === 'Todos') return [];
    // @ts-ignore
    return EDUCATIONAL_STRUCTURE[selectedLevel][selectedGrade] || [];
  }, [selectedLevel, selectedGrade]);

  // Cálculo de Estadísticas (Contadores)
  const stats = useMemo(() => {
    return {
      estudiantes: MOCK_USERS.filter(u => u.role === 'Estudiante').length,
      docentes: MOCK_USERS.filter(u => u.role === 'Docente').length,
      apoderados: MOCK_USERS.filter(u => u.role === 'Apoderado').length,
      administrativos: MOCK_USERS.filter(u => u.role === 'Administrativo').length,
    };
  }, []);

  // Filtrado de Usuarios
  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(u => {
      const matchesRole = u.role === selectedRole;
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.dni.includes(search);
      const matchesLevel = selectedLevel === 'Todos' || u.level === selectedLevel;
      const matchesGrade = selectedGrade === 'Todos' || u.grade === selectedGrade;
      const matchesSection = selectedSection === 'Todos' || u.section === selectedSection;
      const matchesStatus = selectedStatus === 'Todos' || u.status === selectedStatus;
      
      return matchesRole && matchesSearch && matchesLevel && matchesGrade && matchesSection && matchesStatus;
    });
  }, [search, selectedRole, selectedLevel, selectedGrade, selectedSection, selectedStatus]);

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Componente Reutilizable para Tarjetas Superiores
  const StatCard = ({ role, label, count, icon: Icon }: any) => {
    const isActive = selectedRole === role;
    
    // Theme mapping based on role
    const getTheme = () => {
      switch (role) {
        case 'Estudiante': return {
          bg: 'bg-blue-50/80 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          ring: 'ring-blue-500/50',
          iconBgActive: 'bg-blue-200 dark:bg-blue-800',
          iconColorActive: 'text-blue-600 dark:text-blue-400',
          iconBgInactive: 'bg-white dark:bg-slate-800',
          iconColorInactive: 'text-slate-700 dark:text-slate-300',
          labelActive: 'text-blue-700 dark:text-blue-400',
          labelInactive: 'text-slate-900 dark:text-white',
          watermark: 'text-blue-200 dark:text-blue-900/40'
        };
        case 'Docente': return {
          bg: 'bg-emerald-50/80 dark:bg-emerald-900/20',
          border: 'border-emerald-200 dark:border-emerald-800',
          ring: 'ring-emerald-500/50',
          iconBgActive: 'bg-emerald-200 dark:bg-emerald-800',
          iconColorActive: 'text-emerald-600 dark:text-emerald-400',
          iconBgInactive: 'bg-white dark:bg-slate-800',
          iconColorInactive: 'text-slate-700 dark:text-slate-300',
          labelActive: 'text-emerald-700 dark:text-emerald-400',
          labelInactive: 'text-slate-900 dark:text-white',
          watermark: 'text-emerald-200 dark:text-emerald-900/40'
        };
        case 'Apoderado': return {
          bg: 'bg-rose-50/80 dark:bg-rose-900/20',
          border: 'border-rose-200 dark:border-rose-800',
          ring: 'ring-rose-500/50',
          iconBgActive: 'bg-rose-200 dark:bg-rose-800',
          iconColorActive: 'text-rose-600 dark:text-rose-400',
          iconBgInactive: 'bg-white dark:bg-slate-800',
          iconColorInactive: 'text-slate-700 dark:text-slate-300',
          labelActive: 'text-rose-700 dark:text-rose-400',
          labelInactive: 'text-slate-900 dark:text-white',
          watermark: 'text-rose-200 dark:text-rose-900/40'
        };
        case 'Administrativo': return {
          bg: 'bg-orange-50/80 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          ring: 'ring-orange-500/50',
          iconBgActive: 'bg-orange-200 dark:bg-orange-800',
          iconColorActive: 'text-orange-600 dark:text-orange-400',
          iconBgInactive: 'bg-white dark:bg-slate-800',
          iconColorInactive: 'text-slate-700 dark:text-slate-300',
          labelActive: 'text-orange-700 dark:text-orange-400',
          labelInactive: 'text-slate-900 dark:text-white',
          watermark: 'text-orange-200 dark:text-orange-900/40'
        };
        default: return {
          bg: 'bg-gray-50', border: 'border-gray-200', ring: 'ring-gray-500/50', iconBgActive: 'bg-gray-200', iconColorActive: 'text-gray-600', iconBgInactive: 'bg-white', iconColorInactive: 'text-gray-700', labelActive: 'text-gray-700', labelInactive: 'text-gray-900', watermark: 'text-gray-200'
        };
      }
    };

    const theme = getTheme();

    return (
      <button 
        onClick={() => setSelectedRole(role)}
        className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 border h-full w-full ${theme.bg} ${theme.border} shadow-sm hover:shadow-md ${isActive ? `ring-2 ring-offset-2 ${theme.ring} dark:ring-offset-slate-900` : 'hover:brightness-95'}`}
      >
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${isActive ? theme.iconBgActive : theme.iconBgInactive} ${isActive ? theme.iconColorActive : theme.iconColorInactive} shadow-sm`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
          <div>
             <span className={`block text-[11px] font-black uppercase tracking-widest mb-1 ${isActive ? theme.labelActive : theme.labelInactive}`}>
               {label}
             </span>
             <span className="block text-3xl font-black text-slate-900 dark:text-white">
               {count}
             </span>
          </div>
        </div>
        {/* Decoración de fondo */}
        <Icon 
          size={100} 
          strokeWidth={1.5}
          className={`absolute -right-4 -bottom-4 opacity-40 ${theme.watermark}`} 
        />
      </button>
    );
  };

  // Componente Chip Group Personalizado
  const FilterChipGroup = ({ label, value, onChange, options, disabled = false, defaultColor = 'blue' }: any) => {
    const getColorClasses = (colorName: string) => {
      switch (colorName) {
        case 'amber': return 'bg-amber-500 text-white shadow-md shadow-amber-500/20';
        case 'indigo': return 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20';
        case 'pink': return 'bg-pink-500 text-white shadow-md shadow-pink-500/20';
        case 'emerald': return 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20';
        case 'purple': return 'bg-purple-500 text-white shadow-md shadow-purple-500/20';
        case 'blue':
        default: return 'bg-blue-600 text-white shadow-md shadow-blue-500/20';
      }
    };

    return (
      <div className={`flex flex-col gap-3 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {label && (
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
            {label}
          </label>
        )}
        <div className="flex flex-wrap gap-2">
          {options.map((opt: any) => {
            const isSelected = value === opt.value;
            const activeClass = getColorClasses(opt.color || defaultColor);
            return (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  isSelected
                    ? activeClass
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const DropdownFilter = ({ label, options, value, onChange, isOpen, onToggle }: any) => {
    return (
      <div className="relative inline-block text-left font-poppins">
        <button
          onClick={onToggle}
          className={`flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-colors w-40 shadow-sm border border-gray-200 dark:border-slate-700 ${
            value !== 'Todos' && value !== ''
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
              : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
          }`}
        >
          <span className="truncate">{value !== 'Todos' && value !== '' ? value.toUpperCase() : label.toUpperCase()}</span>
          <ChevronDown size={14} className={`transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={onToggle}></div>
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 z-20 py-1">
              {options.map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(value === opt ? 'Todos' : opt);
                    onToggle();
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center justify-between transition-colors ${
                    value === opt
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {opt}
                  {value === opt && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const HierarchicalDropdownFilter = ({
    selectedLevel, setSelectedLevel,
    selectedGrade, setSelectedGrade,
    selectedSection, setSelectedSection,
    gradeOptions, sectionOptions,
    isOpen, onToggle
  }: any) => {
    let currentStep = 'level';
    if (selectedLevel !== 'Todos' && selectedGrade === 'Todos') currentStep = 'grade';
    if (selectedGrade !== 'Todos') currentStep = 'section';

    let buttonLabel = 'NIVEL / AULA';
    if (selectedSection !== 'Todos') buttonLabel = `${selectedGrade.replace(' Grado', '')} ${selectedSection}`;
    else if (selectedGrade !== 'Todos') buttonLabel = selectedGrade.replace(' Grado', '');
    else if (selectedLevel !== 'Todos') buttonLabel = selectedLevel;

    return (
      <div className="relative inline-block text-left font-poppins">
        <button
          onClick={onToggle}
          className={`flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-colors w-48 shadow-sm border border-gray-200 dark:border-slate-700 ${
            selectedLevel !== 'Todos'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
              : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
          }`}
        >
          <span className="truncate">{buttonLabel.toUpperCase()}</span>
          <ChevronDown size={14} className={`transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={onToggle}></div>
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 z-20 py-1 overflow-hidden">
              
              {currentStep === 'grade' && (
                <button
                  onClick={() => { setSelectedLevel('Todos'); setSelectedGrade('Todos'); setSelectedSection('Todos'); }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-gray-500 hover:text-blue-600 hover:bg-gray-50 flex items-center gap-1 border-b border-gray-100 dark:border-slate-700"
                >
                  <ChevronLeft size={14} /> Volver a Niveles
                </button>
              )}
              {currentStep === 'section' && (
                <button
                  onClick={() => { setSelectedGrade('Todos'); setSelectedSection('Todos'); }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-gray-500 hover:text-blue-600 hover:bg-gray-50 flex items-center gap-1 border-b border-gray-100 dark:border-slate-700"
                >
                  <ChevronLeft size={14} /> Volver a Grados
                </button>
              )}

              <div className="max-h-60 overflow-y-auto">
                {currentStep === 'level' && ['Inicial', 'Primaria', 'Secundaria'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSelectedLevel(opt); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between transition-colors text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-700"
                  >
                    {opt}
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}

                {currentStep === 'grade' && gradeOptions.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => { setSelectedGrade(opt); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between transition-colors text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-700"
                  >
                    {opt.replace(' Grado', '')}
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}

                {currentStep === 'section' && sectionOptions.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => { 
                      if (selectedSection === opt) {
                        setSelectedSection('Todos');
                      } else {
                        setSelectedSection(opt); 
                      }
                      onToggle(); 
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between transition-colors ${
                      selectedSection === opt
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    Sección {opt}
                    {selectedSection === opt && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="h-full flex flex-col font-poppins">
      
      {/* Header Estandarizado */}
      <PageHeader 
        title="Usuarios" 
        subtitle="Gestiona estudiantes, docentes, apoderados y personal administrativo." 
        icon={Users} 
      />

      {/* Grid Principal Layout Unificado */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        
        {/* FILA 1: Tarjetas KPI */}
        <div className="lg:col-span-1">
          <button
            onClick={() => setSelectedRole('Estudiante')}
            className={`w-full text-left rounded-[32px] transition-all ${selectedRole === 'Estudiante' ? 'ring-4 ring-blue-500/50' : ''}`}
          >
            <KPICard
              title="Estudiantes"
              value={stats.estudiantes.toString()}
              icon={GraduationCap}
              variant="blue"
            />
          </button>
        </div>
        <div className="lg:col-span-1">
          <button
            onClick={() => setSelectedRole('Apoderado')}
            className={`w-full text-left rounded-[32px] transition-all ${selectedRole === 'Apoderado' ? 'ring-4 ring-rose-500/50' : ''}`}
          >
            <KPICard
              title="Apoderados"
              value={stats.apoderados.toString()}
              icon={User}
              variant="rose"
            />
          </button>
        </div>
        <div className="lg:col-span-1">
          <button
            onClick={() => setSelectedRole('Docente')}
            className={`w-full text-left rounded-[32px] transition-all ${selectedRole === 'Docente' ? 'ring-4 ring-emerald-500/50' : ''}`}
          >
            <KPICard
              title="Docentes"
              value={stats.docentes.toString()}
              icon={Briefcase}
              variant="emerald"
            />
          </button>
        </div>
        <div className="lg:col-span-1">
          <button
            onClick={() => setSelectedRole('Administrativo')}
            className={`w-full text-left rounded-[32px] transition-all ${selectedRole === 'Administrativo' ? 'ring-4 ring-orange-500/50' : ''}`}
          >
            <KPICard
              title="Administrativos"
              value={stats.administrativos.toString()}
              icon={ShieldCheck}
              variant="orange"
            />
          </button>
        </div>

        {/* BARRA DE BÚSQUEDA Y ACCIONES (Columna 1-4) */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Buscar por nombre o documento..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-full pl-14 pr-4 py-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl outline-none focus:border-blue-500 transition-colors shadow-sm text-base"
                    />
                </div>
                
                <div className="flex gap-2">
                    <button
                      onClick={() => setIsCarnetModalOpen(true)}
                      className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
                    >
                      <IdCard size={20} /> Descargar Carnets
                    </button>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                    >
                      <Plus size={20} /> Crear Usuario
                    </button>
                </div>
            </div>

            {/* Info de resultados debajo del buscador */}
            <div className="px-2 mt-1">
                <span className="text-xs font-bold text-gray-500">
                    Mostrando {paginatedUsers.length} de {filteredUsers.length} {selectedRole.toLowerCase()}s
                </span>
                {activeFiltersCount > 0 && (
                    <button 
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 ml-4 px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                    >
                        <X size={12} /> Limpiar filtros
                    </button>
                )}
            </div>
        </div>

        {/* PANEL DERECHO: TABLA (Columna 1-4) */}
        <div className="col-span-1 lg:col-span-4 w-full bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
           <div className="overflow-x-auto flex-1 p-0">
             {/* Solo vista de lista */}
             <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                 <thead>
                   <tr className="bg-blue-50/40 dark:bg-slate-800 border-b border-blue-100 dark:border-slate-700">
                     <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-[40%]">Usuario</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <HierarchicalDropdownFilter
                            selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel}
                            selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade}
                            selectedSection={selectedSection} setSelectedSection={setSelectedSection}
                            gradeOptions={gradeOptions} sectionOptions={sectionOptions}
                            isOpen={openDropdown === 'hierarchy'}
                            onToggle={() => setOpenDropdown(openDropdown === 'hierarchy' ? null : 'hierarchy')}
                          />
                        </div>
                     </th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <DropdownFilter
                            label="Estado"
                            value={selectedStatus}
                            options={selectedRole === 'Estudiante' ? ['Matriculado', 'Retirado', 'Trasladado', 'Egresado'] : ['Activo', 'Inactivo', 'Suspendido']}
                            isOpen={openDropdown === 'status'}
                            onToggle={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                            onChange={setSelectedStatus}
                          />
                        </div>
                     </th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right w-[15%]">Acciones</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                   {paginatedUsers.length > 0 ? paginatedUsers.map((user, index) => (
                     <tr key={user.id} onClick={() => setSelectedUser(user)} className={`${index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-100 dark:bg-slate-800/80'} hover:bg-blue-50/50 dark:hover:bg-slate-700 transition-colors cursor-pointer group`}>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full border border-gray-100 dark:border-slate-700 flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-slate-800`}>
                               <User size={20} />
                             </div>
                             <div>
                                <p className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-tight">{user.name}</p>
                                {user.code && <p className="text-xs text-gray-400 font-medium mt-0.5">{user.code}</p>}
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase">{user.level || '-'}</span>
                             {user.grade ? (
                               <span className="text-sm text-gray-500 font-black mt-1">{user.grade.replace(' Grado', '')} {user.section}</span>
                             ) : (
                               <span className="text-[11px] text-gray-400 mt-0.5">-</span>
                             )}
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            user.status === 'Matriculado' || user.status === 'Activo' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            user.status === 'Retirado' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            user.status === 'Trasladado' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                            user.status === 'Egresado' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {user.status}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             {selectedRole === 'Estudiante' ? (
                               <>
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); handleDownloadQR(user); }}
                                   className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                                   title="Descargar Carnets QR"
                                 >
                                    <Download size={18} />
                                 </button>
  
                                 <button 
                                   onClick={(e) => { 
                                     e.stopPropagation(); 
                                     setInitialModalTab('family');
                                     setSelectedUser(user); 
                                   }}
                                   className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                   title="Editar Familia"
                                 >
                                    <SquarePen size={18} />
                                 </button>
                               </>
                             ) : selectedRole === 'Docente' ? (
                               <>
                                 <button 
                                   onClick={(e) => { 
                                     e.stopPropagation(); 
                                     setSelectedTeacherForSchedule(user);
                                     setIsScheduleModalOpen(true);
                                   }}
                                   className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                                   title="Ver Horario"
                                 >
                                    <Calendar size={18} />
                                 </button>
                                 <button 
                                   onClick={(e) => { 
                                     e.stopPropagation(); 
                                     setInitialModalTab('account');
                                     setSelectedUser(user); 
                                   }}
                                   className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                   title="Editar Cuenta"
                                  >
                                    <SquarePen size={18} />
                                  </button>
                               </>
                              ) : (
                                <>
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      setInitialModalTab('account');
                                      setSelectedUser(user); 
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                    title="Editar Cuenta"
                                  >
                                     <SquarePen size={18} />
                                  </button>
                                </>
                              )}
                          </div>
                       </td>
                     </tr>
                   )) : (
                     <tr>
                       <td colSpan={4} className="py-12 text-center text-gray-400">
                         <Filter size={32} className="mx-auto mb-2 opacity-20"/>
                         No se encontraron resultados.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
           </div>

           {/* Paginación */}
           <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/30">
              <button 
                 disabled={currentPage === 1}
                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                 className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-300"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs font-bold text-gray-500">
                 Página {currentPage} de {totalPages || 1}
              </span>
              <button 
                 disabled={currentPage === totalPages || totalPages === 0}
                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                 className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-300"
              >
                <ChevronRight size={20} />
              </button>
           </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isModalOpen && <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
        {selectedUser && (
          <UserDetailsModal 
            user={selectedUser} 
            onClose={() => { 
              setSelectedUser(null); 
              setInitialModalTab('personal'); 
            }} 
            initialTab={initialModalTab} 
          />
        )}
        {isScheduleModalOpen && selectedTeacherForSchedule && (
          <TeacherScheduleModal 
            teacher={selectedTeacherForSchedule}
            onClose={() => {
              setIsScheduleModalOpen(false);
              setSelectedTeacherForSchedule(null);
            }}
          />
        )}
        {isCarnetModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCarnetModalOpen(false)}
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
                      <IdCard size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Generar Carnets</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Filtro de Lote</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsCarnetModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl transition-colors text-gray-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <FilterChipGroup 
                    label="Nivel Educativo"
                    value={selectedLevel}
                    onChange={setSelectedLevel}
                    options={[
                      { value: 'Todos', label: 'Todos', color: 'blue' },
                      { value: 'Inicial', label: 'Inicial', color: 'amber' },
                      { value: 'Primaria', label: 'Primaria', color: 'indigo' },
                      { value: 'Secundaria', label: 'Secundaria', color: 'pink' }
                    ]}
                  />
                  
                  <div className="flex flex-col gap-6">
                    <FilterChipGroup 
                      label=""
                      value={selectedGrade}
                      onChange={setSelectedGrade}
                      disabled={selectedLevel === 'Todos'}
                      options={[
                        { value: 'Todos', label: 'Todos' },
                        ...gradeOptions.map(g => ({ value: g, label: g.replace(' Grado', '') }))
                      ]}
                    />
                    <FilterChipGroup 
                      label="Sección"
                      value={selectedSection}
                      onChange={setSelectedSection}
                      disabled={selectedGrade === 'Todos'}
                      options={[
                        { value: 'Todos', label: 'Todos' },
                        ...sectionOptions.map(s => ({ value: s, label: s }))
                      ]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button 
                    onClick={() => setIsCarnetModalOpen(false)}
                    className="py-4 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      generateBulkCarnets(selectedLevel, selectedGrade, selectedSection);
                      setIsCarnetModalOpen(false);
                    }}
                    className="py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2"
                  >
                    <Download size={18} /> Generar PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};