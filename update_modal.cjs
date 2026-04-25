const fs = require('fs');

let content = fs.readFileSync('./components/Modals.tsx', 'utf8');

// Replace DataField
const dataFieldRegex = /const DataField = \(\{ label, value, subValue, icon: Icon \}: any\) => \([\s\S]*?    <\/div>\n\);/m;

const newDataField = `const DataField = ({ label, value, subValue, icon: Icon, className = "" }: any) => (
    <div className={\`flex flex-col gap-1.5 \${className}\`}>
        <div className="flex items-center gap-1.5 text-gray-500">
            {Icon && <Icon size={16} />}
            <span className="text-sm font-normal">{label}</span>
        </div>
        <div className="text-base font-medium text-gray-900">
            {value} {subValue && <span className="text-sm font-normal text-gray-500 ml-1">{subValue}</span>}
        </div>
    </div>
);`;
content = content.replace(dataFieldRegex, newDataField);

// We need to replace UserDetailsModal as well
const userDetailsModalStartRegex = /export const UserDetailsModal: React\.FC<\{ user: UserItem; onClose: \(\) => void; initialTab\?: 'personal' \| 'academic' \| 'family' \| 'account' \}> = \(\{ user, onClose, initialTab = 'personal' \}\) => \{/m;

const teacherScheduleModalRegex = /export const TeacherScheduleModal: React\.FC<\{ teacher: UserItem; onClose: \(\) => void \}> = \(\{ teacher, onClose \}\) => \{/m;

const startSplit = content.split(userDetailsModalStartRegex);
if(startSplit.length > 1) {
    const endSplit = startSplit[1].split(teacherScheduleModalRegex);
    
    const newUserDetailsModal = `export const UserDetailsModal: React.FC<{ user: UserItem; onClose: () => void; initialTab?: 'personal' | 'academic' | 'family' | 'account' }> = ({ user, onClose, initialTab = 'personal' }) => {
  const isTeacher = user.role === 'Docente';
  const isAdmin = user.role === 'Administrativo';
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'family' | 'account'>(initialTab);
  const [notifiedParent, setNotifiedParent] = useState<'Padre' | 'Madre'>('Padre');
  
  // Simulamos datos de la cuenta
  const [username, setUsername] = useState(user.dni);
  const [password, setPassword] = useState('********');

  // Simulamos datos de los padres basados en el apellido del estudiante
  const apellidos = user.name.split(' ').slice(1);
  const fatherName = \`\${apellidos[0] || 'Padre'} \${apellidos[1] || ''}\`;
  const motherName = \`\${apellidos[1] || 'Madre'} de \${apellidos[0] || ''}\`;

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
            <div className={\`w-20 h-20 rounded-2xl \${user.avatarColor || 'bg-teal-500'} flex items-center justify-center text-white text-3xl font-bold\`}>
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
                  <span className={\`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide \${user.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}\`}>
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
                 className={\`pb-3 border-b-2 text-sm transition-colors whitespace-nowrap focus:outline-none \${isActive ? 'font-medium text-blue-600 border-blue-600' : 'font-normal text-gray-500 hover:text-gray-700 border-transparent'}\`}
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
                       <DataField label="Grado y Sección" value={\`\${user.grade || '-'} "\${user.section || '-'}"\`} icon={BookOpen} />
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

export const TeacherScheduleModal: React.FC<{ teacher: UserItem; onClose: () => void }> = ({ teacher, onClose }) => {`;
    
    content = startSplit[0] + newUserDetailsModal + endSplit[1];
}

fs.writeFileSync('./components/Modals.tsx', content);
console.log('Done replacement');
