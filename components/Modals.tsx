import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Fingerprint, Mail, Phone, MapPin, Settings, Bot, Loader2, Send, School, BookOpen, HeartHandshake, Calendar, User, Hash, Baby, Clock, CheckCircle2, BadgeCheck, GraduationCap, Briefcase, Shield, CreditCard, IdCard, Pencil, Bell, SquarePen, Save, Download, ChevronDown, MoreVertical, Users } from 'lucide-react';
import { UserItem, ChatMessage } from '../types';
import { sendMessageToAI } from '../services/geminiService';

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 }
};

export const UserDetailsModal: React.FC<{ user: UserItem; onClose: () => void; initialTab?: 'personal' | 'academic' | 'family' | 'account' }> = ({ user, onClose, initialTab = 'personal' }) => {
  const isTeacher = user.role === 'Docente';
  const isAdmin = user.role === 'Administrativo';
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'family' | 'account'>(initialTab);
  const [notifiedParent, setNotifiedParent] = useState<'Padre' | 'Madre'>('Padre');
  
  // Simulamos datos de la cuenta
  const [username, setUsername] = useState(user.dni);
  const [password, setPassword] = useState('********');

  // Simulamos datos de los padres basados en el apellido del estudiante
  const apellidos = user.name.split(' ').slice(1);
  const fatherName = `${apellidos[0] || 'Padre'} ${apellidos[1] || ''}`;
  const motherName = `${apellidos[1] || 'Madre'} de ${apellidos[0] || ''}`;

  const tabs = useMemo(() => {
    if (user.role === 'Estudiante') {
      return [
        { id: 'personal', label: 'Datos Personales' }, 
        { id: 'academic', label: 'Académico' }, 
        { id: 'family', label: 'Familia' }
      ];
    }
    if (user.role === 'Docente') {
      return [
        { id: 'personal', label: 'Datos Personales' }, 
        { id: 'academic', label: 'Académico' },
        { id: 'account', label: 'Cuenta' }
      ];
    }
    if (user.role === 'Administrativo') {
      return [
        { id: 'personal', label: 'Datos Personales' },
        { id: 'account', label: 'Cuenta' }
      ];
    }
    return [{ id: 'personal', label: 'Datos Personales' }];
  }, [user.role]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex justify-center items-center p-4" onClick={onClose}>
      <motion.div 
        variants={modalVariants} 
        initial="hidden" 
        animate="visible" 
        exit="exit" 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">
            Detalles del {user.role}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full focus:outline-none">
            <X size={20}/>
          </button>
        </div>

        {/* --- PROFILE CARD --- */}
        <div className="p-6 shrink-0 bg-white flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-2xl ${user.avatarColor || 'bg-teal-500'} flex items-center justify-center text-white text-3xl font-bold`}>
              {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
            </div>
            
            <div className="flex flex-col justify-center">
               <h2 className="text-xl font-bold text-gray-900" title={user.name}>
                  {user.name}
               </h2>
               <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wide">
                    {user.role}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${user.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                    {user.status === 'Activo' ? (isTeacher ? 'ACTIVO' : 'MATRICULADO') : user.status.toUpperCase()}
                  </span>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none">
              Editar {user.role}
            </button>
            <button className="p-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors shadow-sm focus:outline-none" aria-label="Más acciones">
              <MoreVertical size={20}/>
            </button>
          </div>
        </div>

        {/* --- TABS NAVIGATION --- */}
        <div className="px-6 flex border-b border-gray-200 shrink-0 bg-white gap-6 overflow-x-auto scrollbar-hide">
           {tabs.map((tab) => {
             const isActive = activeTab === tab.id;
             return (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`pb-3 border-b-2 text-sm transition-colors whitespace-nowrap focus:outline-none ${isActive ? 'font-medium text-blue-600 border-blue-600' : 'font-normal text-gray-500 hover:text-gray-700 border-transparent'}`}
               >
                 {tab.label}
               </button>
             );
           })}
        </div>
        
        {/* --- CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-[300px]">
           <AnimatePresence mode="wait">
             
             {/* PESTAÑA PERSONAL */}
             {activeTab === 'personal' && (
               <motion.div 
                 key="personal"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
                 className="grid grid-cols-2 gap-y-6 gap-x-8"
               >
                   <DataField label="DNI / Documento" value={user.dni} icon={CreditCard} />
                   <DataField label="Fecha Nacimiento" value="09/06/2017" subValue="(8 Años)" icon={Calendar} />
                   {isTeacher ? (
                     <DataField label="Teléfono" value={user.phone || '+51 987 654 321'} icon={Phone} />
                   ) : (
                     <DataField label="Código Modular" value="00000090275274" icon={Hash} />
                   )}
                   <DataField label="Género" value="Femenino" icon={User} />
                   <DataField label="Correo Electrónico" value={user.email} icon={Mail} className="col-span-2" />
               </motion.div>
             )}

             {/* PESTAÑA ACADÉMICA */}
             {activeTab === 'academic' && (
               <motion.div 
                 key="academic"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
                 className="grid grid-cols-2 gap-y-6 gap-x-8"
               >
                   {isTeacher ? (
                     <div className="col-span-2 grid grid-cols-2 gap-y-6 gap-x-8">
                        <DataField label="Curso que enseña" value="Matemáticas y Razonamiento" icon={BookOpen} className="col-span-2" />
                        <DataField label="Tutor de" value="5to de Secundaria - A" icon={Users} className="col-span-2" />
                     </div>
                   ) : (
                     <div className="col-span-2 grid grid-cols-2 gap-y-6 gap-x-8">
                       <DataField label="Nivel Educativo" value={user.level || 'No Asignado'} icon={School} />
                       <DataField label="Grado y Sección" value={`${user.grade || '-'} "${user.section || '-'}"`} icon={BookOpen} />
                       <DataField label="Turno Asignado" value="Mañana" icon={Clock} />
                       <DataField label="Estado Académico" value="Matrícula Regular" icon={CheckCircle2} />
                     </div>
                   )}
               </motion.div>
             )}

             {/* PESTAÑA FAMILIA */}
             {activeTab === 'family' && (
               <motion.div 
                 key="family"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
                 className="grid grid-cols-2 gap-y-6 gap-x-8"
               >
                   <DataField label="Padre" value={fatherName} subValue="(987 654 321)" icon={User} className="col-span-2" />
                   <DataField label="Madre" value={motherName} subValue="(912 345 678)" icon={User} className="col-span-2" />
               </motion.div>
             )}

             {/* PESTAÑA CUENTA */}
             {activeTab === 'account' && (
               <motion.div 
                 key="account"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
                 className="grid grid-cols-2 gap-y-6 gap-x-8"
               >
                   <DataField label="Usuario" value={username} icon={User} />
                   <DataField label="Contraseña" value="********" icon={Settings} />
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const TeacherScheduleModal: React.FC<{ teacher: UserItem; onClose: () => void }> = ({ teacher, onClose }) => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const hours = ['08:00 - 09:30', '09:30 - 11:00', '11:00 - 11:30', '11:30 - 13:00', '13:00 - 14:30'];
  
  const scheduleData = [
    ['Matemática', 'Física', 'RECREO', 'Matemática', 'Tutoría'],
    ['Raz. Mat.', 'Matemática', 'RECREO', 'Física', 'Raz. Mat.'],
    ['Matemática', 'Raz. Mat.', 'RECREO', 'Matemática', 'Libre'],
    ['Física', 'Matemática', 'RECREO', 'Raz. Mat.', 'Matemática'],
    ['Matemática', 'Física', 'RECREO', 'Matemática', 'Raz. Mat.']
  ];

  const downloadSchedulePDF = () => {
    // @ts-ignore
    import('jspdf').then(({ default: jsPDF }) => {
      // @ts-ignore
      import('jspdf-autotable').then(({ default: autoTable }) => {
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        const pageWidth = doc.internal.pageSize.getWidth();
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('HORARIO ESCOLAR 2025', pageWidth / 2, 15, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`DOCENTE: ${teacher.name.toUpperCase()}`, pageWidth / 2, 22, { align: 'center' });
        
        const tableBody = hours.map((hour, i) => [hour, ...scheduleData.map(day => day[i])]);

        autoTable(doc, {
          startY: 30,
          head: [['HORA', ...days]],
          body: tableBody,
          theme: 'grid',
          headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255], halign: 'center' },
          bodyStyles: { halign: 'center', fontSize: 10 },
          columnStyles: { 0: { fontStyle: 'bold', fillColor: [245, 245, 245] } }
        });

        doc.save(`Horario_${teacher.name.replace(/\s+/g, '_')}.pdf`);
      });
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex justify-center items-center p-4" onClick={onClose}>
      <motion.div 
        variants={modalVariants} 
        initial="hidden" 
        animate="visible" 
        exit="exit" 
        className="w-full max-w-4xl bg-white dark:bg-slate-950 rounded-[24px] shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shadow-sm">
              <Calendar size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Horario del Docente</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">{teacher.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={downloadSchedulePDF}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-sm"
            >
              <Download size={16} /> Descargar PDF
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X size={24}/>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-xs font-bold text-gray-500 uppercase tracking-wider">Hora</th>
                {days.map(day => (
                  <th key={day} className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-xs font-bold text-gray-500 uppercase tracking-wider">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour, i) => (
                <tr key={hour}>
                  <td className="p-3 border border-gray-200 dark:border-slate-800 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-slate-900/50">{hour}</td>
                  {scheduleData.map((day, j) => (
                    <td key={j} className={`p-3 border border-gray-200 dark:border-slate-800 text-xs font-medium text-center ${day[i] === 'RECREO' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>
                      {day[i]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- SUB-COMPONENTES TRADICIONALES ---

const DataField = ({ label, value, subValue, icon: Icon, className = "" }: any) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        <div className="flex items-center gap-1.5 text-gray-500">
            {Icon && <Icon size={16} />}
            <span className="text-sm font-normal">{label}</span>
        </div>
        <div className="text-base font-medium text-gray-900">
            {value} {subValue && <span className="text-sm font-normal text-gray-500 ml-1">{subValue}</span>}
        </div>
    </div>
);

const FamilyRow = ({ role, name, dni, phone, color, isNotified, onSetNotified }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPhone, setEditedPhone] = useState(phone);
    const [editedName, setEditedName] = useState(name);
    const [editedDni, setEditedDni] = useState(dni);

    const isPink = color === 'pink';
    const textClass = isPink ? 'text-pink-600 dark:text-pink-400' : 'text-blue-600 dark:text-blue-400';
    const bgClass = isPink ? 'bg-pink-50 dark:bg-pink-900/20' : 'bg-blue-50 dark:bg-blue-900/20';
    const borderClass = isPink ? 'border-pink-100 dark:border-pink-800' : 'border-blue-100 dark:border-blue-800';
        
    return (
        <div className={`p-6 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all flex flex-col gap-6 ${isNotified ? 'bg-blue-50/20 dark:bg-blue-900/5' : ''}`}>
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 shadow-sm border ${bgClass} ${textClass} ${borderClass}`}>
                        {role[0]}
                    </div>
                    <div className="flex-1">
                        {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Nombre Completo</label>
                                    <div className="relative">
                                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={editedName} 
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="Nombre completo"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">DNI / Documento</label>
                                    <div className="relative">
                                        <IdCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={editedDni} 
                                            onChange={(e) => setEditedDni(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="DNI"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Teléfono de Contacto</label>
                                    <div className="relative">
                                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={editedPhone} 
                                            onChange={(e) => setEditedPhone(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="Teléfono"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-1.5">
                                    <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight uppercase">{editedName}</p>
                                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${bgClass} ${textClass} ${borderClass}`}>
                                        {role}
                                    </span>
                                    {isNotified && (
                                        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800 uppercase">
                                            <Bell size={10} /> Apoderado
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                                        <IdCard size={14} className="text-gray-400"/> 
                                        <span className="text-gray-900 dark:text-gray-200">{editedDni}</span>
                                    </span>
                                    <span className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                                        <Phone size={14} className="text-gray-400"/> 
                                        <span className="text-gray-900 dark:text-gray-200">+51 {editedPhone}</span>
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-wider"
                            >
                                Guardar
                            </button>
                            <button 
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedName(name);
                                    setEditedPhone(phone);
                                    setEditedDni(dni);
                                }}
                                className="px-5 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs font-black rounded-2xl transition-all uppercase tracking-wider"
                            >
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20 uppercase tracking-wider"
                        >
                            <Pencil size={14}/>
                            Editar
                        </button>
                    )}
                </div>
            </div>

            {/* APODERADO TOGGLE SECTION */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isNotified ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Bell size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">Recibir Notificaciones</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Designar como apoderado principal para avisos y alertas.</p>
                    </div>
                </div>
                
                <button 
                    onClick={onSetNotified}
                    disabled={isNotified}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 outline-none ${isNotified ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}
                >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm ${isNotified ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>
        </div>
    );
};

export const CreateUserModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [type, setType] = useState('Estudiante');
  if (!isOpen) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex justify-center items-center p-4" onClick={onClose}>
      <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-blue-600 p-8 flex justify-between items-center text-white"><h2 className="text-2xl font-bold">Nuevo Registro</h2><button onClick={onClose}><X/></button></div>
        <div className="p-8 space-y-6">
           <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl outline-none"><option>Estudiante</option><option>Docente</option><option>Administrativo</option></select>
           <input type="text" className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl outline-none" placeholder="Nombre Completo"/>
           <input type="text" className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl outline-none" placeholder="DNI"/>
           <button onClick={onClose} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl">Registrar</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const AIChatPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'ai', text: "Bienvenida Lisha. Soy Peepos AI. ¿Deseas generar un reporte financiero o inscribir un nuevo alumno?" }]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!input.trim()) return;
    
    const userMsg = input; 
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]); 
    setInput(''); 
    setLoading(true);
    
    try {
      const responseText = await sendMessageToAI(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch { 
      setMessages(prev => [...prev, { role: 'ai', text: "Error de red." }]); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <AnimatePresence>{isOpen && (
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="absolute bottom-8 right-8 w-[350px] bg-white dark:bg-slate-900 rounded-[36px] shadow-2xl border border-gray-100 dark:border-slate-800 z-50 overflow-hidden flex flex-col h-[520px]">
        <div className="bg-blue-600 p-6 flex justify-between items-center text-white shrink-0 shadow-lg relative"><div className="flex items-center gap-3"><div className="p-2 bg-white/20 rounded-2xl backdrop-blur-md"><Bot size={22}/></div><div><p className="font-bold text-sm leading-none">Peepos AI</p><p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest mt-1">Inteligencia Administrativa</p></div></div><button onClick={onClose}><X size={20}/></button></div>
        <div className="p-6 flex-1 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-slate-800/50 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-4 text-xs font-medium leading-relaxed rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-tl-none'}`}>{m.text}</div></div>
          ))}
          {loading && <Loader2 size={18} className="animate-spin text-blue-600 mx-auto" />}<div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-5 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex gap-3 shrink-0"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-gray-100 dark:bg-slate-800 rounded-2xl px-5 py-4 text-xs font-semibold outline-none" placeholder="Hazme una pregunta..." /><button type="submit" className="p-4 bg-blue-600 text-white rounded-2xl"><Send size={20}/></button></form>
      </motion.div>
    )}</AnimatePresence>
  );
};