import { 
  MessageSquare, 
  BookOpen, 
  Shirt, 
  AlertTriangle, 
  Smartphone,
  Clock,
  UserX,
  Ban,
  LogOut,
  FileWarning,
  Gem,
  Palette,
  Gavel,
  Sparkles,
  User,
  Megaphone,
  Skull,
  Hammer,
  AlertOctagon,
  Users,
  Flag,
  ShieldAlert,
  Crosshair
} from 'lucide-react';
import { IncidentType, ClassItem, UserItem } from './types';

// --- ESTRUCTURA EDUCATIVA COMPLETA ---

interface SectionConfig {
  [grade: string]: string[];
}

interface LevelConfig {
  [level: string]: SectionConfig;
}

export const EDUCATIONAL_STRUCTURE: LevelConfig = {
  'Inicial': {
    '3 Años': ['Margaritas', 'Crisantemos'],
    '4 Años': ['Jasminez', 'Rosas', 'Lirios', 'Geranios'],
    '5 Años': ['Orquídeas', 'Tulipanes', 'Girasoles', 'Claveles']
  },
  'Primaria': {
    '1° Grado': ['A', 'B', 'C'],
    '2° Grado': ['A', 'B', 'C'],
    '3° Grado': ['A', 'B', 'C'],
    '4° Grado': ['A', 'B', 'C', 'D'],
    '5° Grado': ['A', 'B', 'C'],
    '6° Grado': ['A', 'B', 'C']
  },
  'Secundaria': {
    '1° Grado': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    '2° Grado': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    '3° Grado': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    '4° Grado': ['A', 'B', 'C', 'D', 'E', 'F'],
    '5° Grado': ['A', 'B', 'C', 'D', 'E', 'F']
  }
};

// --- LISTADO DE INCIDENCIAS ACTUALIZADO ---
export const INCIDENT_TYPES: IncidentType[] = [
  // Leves
  { id: '1', label: 'Uso de joyas', category: 'Leve', icon: Gem, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '2', label: 'Uñas pintadas', category: 'Leve', icon: Palette, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '3', label: 'Cabello suelto', category: 'Leve', icon: User, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '4', label: 'Falta de aseo personal', category: 'Leve', icon: Sparkles, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '5', label: 'Uniforme incompleto', category: 'Leve', icon: Shirt, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '6', label: 'No trajo útiles', category: 'Leve', icon: BookOpen, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '7', label: 'Incumplimiento de tareas', category: 'Leve', icon: FileWarning, color: 'bg-slate-50 text-slate-700 border-slate-200' },

  // Moderadas
  { id: '8', label: 'Indisciplina en formación', category: 'Moderada', icon: Users, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '9', label: 'Indisciplina en aula', category: 'Moderada', icon: AlertOctagon, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '10', label: 'Falta de respeto a símbolos patrios', category: 'Moderada', icon: Flag, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '11', label: 'Falta de respeto al docente', category: 'Moderada', icon: UserX, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '12', label: 'Agresión verbal', category: 'Moderada', icon: MessageSquare, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '13', label: 'Uso de celular', category: 'Moderada', icon: Smartphone, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '14', label: 'Daño a infraestructura', category: 'Moderada', icon: Hammer, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '15', label: 'Escándalo en aula', category: 'Moderada', icon: Megaphone, color: 'bg-slate-50 text-slate-700 border-slate-200' },

  // Graves
  { id: '16', label: 'Salida no autorizada', category: 'Grave', icon: LogOut, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '17', label: 'Agresión física', category: 'Grave', icon: ShieldAlert, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '18', label: 'Acoso escolar', category: 'Grave', icon: AlertTriangle, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '19', label: 'Consumo de drogas', category: 'Grave', icon: Skull, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: '20', label: 'Porte de armas', category: 'Grave', icon: Crosshair, color: 'bg-slate-50 text-slate-700 border-slate-200' },
];

export const MOCK_CLASSES: ClassItem[] = [
  { id: 'c1', name: '3° Grado Primaria - C' },
  { id: 'c2', name: '5° Grado Secundaria - A' },
  { id: 'c3', name: '2° Grado Secundaria - B' },
];

// --- GENERADOR DE DATOS SIMULADOS (FACTORY) ---

const FIRST_NAMES = [
  'Mateo', 'Valentina', 'Santiago', 'Luciana', 'Thiago', 'Maria', 'Liam', 'Catalina', 
  'Gael', 'Fernanda', 'Alessandro', 'Mia', 'Nicolas', 'Alessia', 'Benjamin', 'Camila',
  'Sebastian', 'Ariana', 'Matias', 'Luana', 'Diego', 'Ximena', 'Joaquin', 'Danna',
  'Carlos', 'Ana', 'Jose', 'Elena', 'Luis', 'Sofia', 'Jorge', 'Gabriela', 'Piero', 'Valery'
];

const LAST_NAMES = [
  'Quispe', 'Flores', 'Rodriguez', 'Sanchez', 'Garcia', 'Rojas', 'Mamani', 'Chavez',
  'Lopez', 'Mendoza', 'Torres', 'Diaz', 'Castillo', 'Espinoza', 'Huaman', 'Vargas',
  'Ramos', 'Gutierrez', 'Ruiz', 'Fernandez', 'Gomez', 'Perez', 'Vasquez', 'Castro',
  'Romero', 'Suarez', 'Delgado', 'Acosta', 'Paredes', 'Salazar', 'Reyna', 'Campos'
];

const COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-rose-500', 
  'bg-indigo-500', 'bg-cyan-600', 'bg-teal-600', 'bg-pink-500', 'bg-slate-500'
];

const generateRandomUser = (id: number, role: UserItem['role'], level?: any, grade?: string, section?: string): UserItem => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName1 = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const lastName2 = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const fullName = `${firstName} ${lastName1} ${lastName2}`;
  
  // DNI Generator (8 digits)
  const dni = Math.floor(10000000 + Math.random() * 90000000).toString();
  
  // Code Generator
  const code = role === 'Estudiante' ? `EST20261000${1000 + id}` : undefined;

  // Status Generator
  let status: UserItem['status'] = 'Activo';
  if (role === 'Estudiante') {
    const rand = Math.random();
    if (rand > 0.95) status = 'Retirado';
    else if (rand > 0.90) status = 'Trasladado';
    else if (rand > 0.85) status = 'Egresado';
    else status = 'Matriculado';
  } else {
    status = Math.random() > 0.95 ? 'Inactivo' : 'Activo';
  }
  
  return {
    id: id.toString(),
    code: code,
    name: fullName,
    dni: dni,
    role: role,
    level: level,
    grade: grade,
    section: section,
    status: status,
    avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
    email: `${firstName.toLowerCase()}.${lastName1.toLowerCase()}@peepos.edu.pe`,
    phone: `9${Math.floor(10000000 + Math.random() * 90000000)}`,
    address: 'Av. Siempre Viva 123'
  };
};

const generateMockData = (): UserItem[] => {
  let users: UserItem[] = [];
  let idCounter = 1;

  // 1. Generate Students (30 per section)
  Object.entries(EDUCATIONAL_STRUCTURE).forEach(([level, grades]) => {
    Object.entries(grades).forEach(([grade, sections]) => {
      (sections as string[]).forEach(section => {
        for (let i = 0; i < 30; i++) {
          users.push(generateRandomUser(idCounter++, 'Estudiante', level, grade, section));
        }
      });
    });
  });

  // 2. Generate Teachers (Docentes) - One per classroom
  Object.entries(EDUCATIONAL_STRUCTURE).forEach(([level, grades]) => {
    Object.entries(grades).forEach(([grade, sections]) => {
      (sections as string[]).forEach(section => {
        users.push(generateRandomUser(idCounter++, 'Docente', level, grade, section));
      });
    });
  });

  // Generate some extra teachers without specific classrooms
  for (let i = 0; i < 10; i++) {
    const levels = ['Inicial', 'Primaria', 'Secundaria'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    users.push(generateRandomUser(idCounter++, 'Docente', randomLevel));
  }

  // 3. Generate Admins - Approx 15
  for (let i = 0; i < 15; i++) {
    users.push(generateRandomUser(idCounter++, 'Administrativo'));
  }

  // 4. Generate Parents (Apoderados) - Approx 100 random ones for demo
  for (let i = 0; i < 100; i++) {
    const levels = ['Inicial', 'Primaria', 'Secundaria'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    users.push(generateRandomUser(idCounter++, 'Apoderado', randomLevel));
  }

  return users;
};

export const MOCK_USERS = generateMockData();

export const APP_CONFIG = {
  // Using Google Drive Thumbnail endpoint with sz=w1920 (width 1920px) which is more reliable for embedding than export=view
  loginBg: 'https://drive.google.com/thumbnail?id=1JOjD0MmX_y9udKCQPEcFdQgVc5D5XARb&sz=w1920',
  schoolLogo: 'https://drive.google.com/thumbnail?id=1oai4WgUeM77ne_3cBK18_q7JXpKvKbFZ&sz=w1000',
  sidebarLogo: 'https://drive.google.com/thumbnail?id=1IXIpFfX7cP7XjqqekPWvCemhA_kC-6Jv&sz=w500'
};