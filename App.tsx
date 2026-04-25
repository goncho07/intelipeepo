import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Bot, Moon, Sun, ChevronDown, User, Settings, HelpCircle, CheckCircle2, AlertTriangle, CreditCard, CalendarDays, Maximize2, ChevronLeft, ChevronRight, X, MapPin, Clock, Bell, Mail, Users, Coffee, BookOpen } from 'lucide-react';
import { SidebarItem } from './components/UI';
import { AIChatPanel } from './components/Modals';
import { LoginModule } from './modules/LoginModule.tsx';
import { MENU_CONFIG } from './config/menu';
import { APP_CONFIG } from './constants';
import { ModuleId } from './types';

// --- CONFIGURACIÓN CALENDARIO (Movido a Global) ---
const YEAR = 2026;
const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

interface CalendarEvent {
  label: string;
  type: 'feriado' | 'academico' | 'civico' | 'gestion' | 'vacaciones' | 'incidencia' | 'otros';
  time?: string;
  student?: string;
  parent?: string;
  reason?: string;
}

// Keys are "MonthIndex-Day" (0-based month)
const EVENTS_2026: Record<string, CalendarEvent[]> = {
  "2-8": [{ label: "Día Int. de la Mujer", type: "civico" }],
  "2-14": [{ label: "Nac. Albert Einstein", type: "civico" }],
  "2-15": [{ label: "Día Derechos Consumidor", type: "civico" }],
  "2-16": [{ label: "INICIO AÑO ESCOLAR / I BIMESTRE", type: "academico" }],
  "2-21": [{ label: "Día Síndrome de Down", type: "civico" }],
  "2-22": [{ label: "Día Mundial del Agua", type: "civico" }],
  "2-24": [{ label: "Lucha contra TBC", type: "civico" }],
  "2-26": [{ label: "La Hora del Planeta", type: "civico" }],
  "2-28": [{ label: "Nac. Mario Vargas Llosa", type: "civico" }],
  "3-1": [{ label: "Día de la Educación", type: "civico" }],
  "3-2": [{ label: "Jueves Santo", type: "feriado" }, { label: "Día Libro Infantil / Autismo", type: "civico" }],
  "3-3": [{ label: "Viernes Santo", type: "feriado" }],
  "3-7": [{ label: "Día Mundial de la Salud", type: "civico" }],
  "3-12": [{ label: "Día Niño Peruano / Inca Garcilaso", type: "civico" }],
  "3-14": [{ label: "Día de las Américas", type: "civico" }],
  "3-22": [{ label: "Día de la Tierra", type: "civico" }],
  "3-23": [{ label: "Día del Idioma / Libro", type: "civico" }],
  "4-1": [{ label: "Día del Trabajo", type: "feriado" }],
  "4-2": [{ label: "Combate del Dos de Mayo", type: "civico" }],
  "4-8": [{ label: "Cruz Roja", type: "civico" }],
  "4-10": [{ label: "Día de la Madre", type: "civico" }],
  "4-11": [{ label: "Acción Heroica M. Parado de Bellido", type: "civico" }],
  "4-15": [{ label: "FIN I BIMESTRE", type: "academico" }, { label: "Día de la Familia", type: "civico" }],
  "4-16": [{ label: "Inicio Vacaciones Gestión 1", type: "vacaciones" }],
  "4-17": [{ label: "Día de Internet", type: "civico" }, { label: "Vacaciones", type: "vacaciones" }],
  "4-18": [{ label: "Sacrificio Túpac Amaru II", type: "civico" }, { label: "Vacaciones", type: "vacaciones" }],
  "4-19": [{ label: "Vacaciones", type: "vacaciones" }],
  "4-20": [{ label: "Vacaciones", type: "vacaciones" }],
  "4-21": [{ label: "Vacaciones", type: "vacaciones" }],
  "4-22": [{ label: "Vacaciones", type: "vacaciones" }],
  "4-23": [{ label: "Vacaciones", type: "vacaciones" }],
  "4-24": [{ label: "Fin Vacaciones", type: "vacaciones" }],
  "4-25": [{ label: "INICIO II BIMESTRE", type: "academico" }, { label: "Educación Inicial", type: "civico" }],
  "4-26": [{ label: "Integración Andina", type: "civico" }],
  "4-31": [{ label: "Día Sin Tabaco", type: "civico" }],
  "5-2": [{ label: "Día Faustino Sánchez Carrión", type: "civico" }],
  "5-5": [{ label: "Medio Ambiente", type: "civico" }],
  "5-7": [{ label: "Día de la Bandera", type: "feriado" }],
  "5-12": [{ label: "Contra Trabajo Infantil", type: "civico" }],
  "5-17": [{ label: "Lucha contra Sequía", type: "civico" }],
  "5-21": [{ label: "Día del Padre", type: "civico" }],
  "5-24": [{ label: "Día del Campesino", type: "civico" }],
  "5-26": [{ label: "Lucha contra Drogas", type: "civico" }],
  "5-29": [{ label: "San Pedro y San Pablo", type: "feriado" }],
  "6-6": [{ label: "Día del Maestro", type: "civico" }],
  "6-7": [{ label: "Descubrimiento Machu Picchu", type: "civico" }],
  "6-10": [{ label: "Batalla de Huamachuco", type: "civico" }],
  "6-23": [{ label: "Capitán FAP Quiñones", type: "feriado" }],
  "6-24": [{ label: "FIN II BIMESTRE", type: "academico" }, { label: "Nac. Simón Bolívar", type: "civico" }],
  "6-27": [{ label: "Inicio Vacaciones Medio Año", type: "vacaciones" }],
  "6-28": [{ label: "Independencia del Perú", type: "feriado" }, { label: "Vacaciones", type: "vacaciones" }],
  "6-29": [{ label: "Fiestas Patrias", type: "feriado" }, { label: "Vacaciones", type: "vacaciones" }],
  "6-30": [{ label: "Vacaciones", type: "vacaciones" }],
  "6-31": [{ label: "Vacaciones", type: "vacaciones" }],
  "7-1": [{ label: "Vacaciones", type: "vacaciones" }],
  "7-2": [{ label: "Vacaciones", type: "vacaciones" }],
  "7-3": [{ label: "Vacaciones", type: "vacaciones" }],
  "7-4": [{ label: "Vacaciones", type: "vacaciones" }],
  "7-5": [{ label: "Vacaciones", type: "vacaciones" }],
  "7-6": [{ label: "Batalla de Junín", type: "feriado" }, { label: "Vacaciones", type: "vacaciones" }],
  "7-7": [{ label: "Fin Vacaciones", type: "vacaciones" }],
  "7-9": [{ label: "Poblaciones Indígenas", type: "civico" }],
  "7-10": [{ label: "INICIO III BIMESTRE", type: "academico" }],
  "7-17": [{ label: "Muerte San Martín", type: "civico" }],
  "7-22": [{ label: "Día del Folclore", type: "civico" }],
  "7-26": [{ label: "Día del Adulto Mayor", type: "civico" }],
  "7-28": [{ label: "Reincorporación de Tacna", type: "civico" }],
  "7-30": [{ label: "Santa Rosa de Lima", type: "feriado" }],
  "8-1": [{ label: "Semana Educación Vial", type: "civico" }],
  "8-7": [{ label: "Derechos Cívicos de la Mujer", type: "civico" }],
  "8-8": [{ label: "Alfabetización", type: "civico" }],
  "8-13": [{ label: "Familia Peruana", type: "civico" }],
  "8-23": [{ label: "Primavera / Juventud", type: "civico" }],
  "8-24": [{ label: "Derechos Humanos", type: "civico" }],
  "9-1": [{ label: "Día del Periodismo", type: "civico" }],
  "9-8": [{ label: "Combate de Angamos", type: "feriado" }, { label: "Educación Física", type: "civico" }],
  "9-9": [{ label: "FIN III BIMESTRE", type: "academico" }],
  "9-10": [{ label: "Inicio Gestión 3", type: "vacaciones" }],
  "9-11": [{ label: "Vacaciones", type: "vacaciones" }],
  "9-12": [{ label: "Llegada Cristóbal Colón", type: "civico" }, { label: "Vacaciones", type: "vacaciones" }],
  "9-13": [{ label: "Vacaciones", type: "vacaciones" }],
  "9-14": [{ label: "Vacaciones", type: "vacaciones" }],
  "9-15": [{ label: "Vacaciones", type: "vacaciones" }],
  "9-16": [{ label: "Persona con Discapacidad", type: "civico" }, { label: "Vacaciones", type: "vacaciones" }],
  "9-17": [{ label: "Vacaciones", type: "vacaciones" }],
  "9-18": [{ label: "Fin Vacaciones", type: "vacaciones" }],
  "9-19": [{ label: "INICIO IV BIMESTRE", type: "academico" }],
  "9-21": [{ label: "Ahorro de Energía", type: "civico" }],
  "9-31": [{ label: "Día de la Canción Criolla", type: "civico" }],
  "10-1": [{ label: "Todos los Santos", type: "feriado" }],
  "10-4": [{ label: "Rebelión Túpac Amaru II", type: "civico" }],
  "10-10": [{ label: "Biblioteca Escolar", type: "civico" }],
  "10-20": [{ label: "Derechos del Niño", type: "civico" }],
  "10-27": [{ label: "Batalla de Tarapacá", type: "civico" }],
  "11-1": [{ label: "Lucha contra el SIDA", type: "civico" }],
  "11-8": [{ label: "Inmaculada Concepción", type: "feriado" }],
  "11-9": [{ label: "Batalla de Ayacucho", type: "feriado" }],
  "11-10": [{ label: "Derechos Humanos", type: "civico" }],
  "11-18": [{ label: "FIN IV BIMESTRE / CLAUSURA", type: "academico" }],
  "11-25": [{ label: "Navidad", type: "feriado" }],
};

const CITATIONS_2026: Record<string, CalendarEvent[]> = {
  // MARZO
  "2-3": [{ label: "Citación de Apoderado de Lucía D.", type: "academico", time: "09:00 AM", student: "Lucía Domínguez", parent: "María López", reason: "Falta de tareas" }],
  "2-5": [{ label: "Citación Padre de José", type: "otros", time: "11:00 AM", student: "José Ramirez", parent: "Carlos Ruiz", reason: "Faltas injustificadas" }],
  "2-10": [
     { label: "Citación Madre de Camila V.", type: "incidencia", time: "10:30 AM", student: "Camila Vargas", parent: "Ana Vargas", reason: "Pelea en recreo" },
     { label: "Citación Padre de Mateo R.", type: "academico", time: "12:00 PM", student: "Mateo Rojas", parent: "Elena Rojas", reason: "Entrega de libreta" }
  ],
  "2-12": [{ label: "Citación Madre de Thiago", type: "gestion", time: "08:15 AM", student: "Thiago Gómez", parent: "Luis Gómez", reason: "Firma de compromiso" }],
  "2-15": [{ label: "Citación Padre de Andrés", type: "academico", time: "09:00 AM", student: "Andrés León", parent: "Pedro León", reason: "Bajo rendimiento en ciencias" }],
  "2-16": [{ label: "Citación Padre de Sofia", type: "incidencia", time: "11:30 AM", student: "Sofia Luna", parent: "Andres Luna", reason: "Bullying a compañero" }],
  "2-18": [{ label: "Citación con Padre de Valentina Sol", type: "academico", time: "10:00 AM", student: "Valentina Sol", parent: "Roberto Sol", reason: "Bajo rendimiento en Matemáticas" }],
  "2-20": [{ label: "Citación Madre de Joaquin", type: "academico", time: "08:30 AM", student: "Joaquin Vega", parent: "Carla Vega", reason: "No rinde las evaluaciones" }],
  "2-22": [{ label: "Citación Padre de Bruno", type: "incidencia", time: "13:00 PM", student: "Bruno Díaz", parent: "Thomas Díaz", reason: "Evasión de clases" }],
  "2-24": [
     { label: "Citación Padre de Fabricio", type: "otros", time: "09:00 AM", student: "Fabricio Soto", parent: "Jose Soto", reason: "Citación general de grado" },
     { label: "Citación Madre de Ximena", type: "incidencia", time: "10:30 AM", student: "Ximena Torres", parent: "Diana Torres", reason: "Falta de respeto al docente" }
  ],
  "2-25": [{ label: "Citación con Madre de Lucas Vega", type: "incidencia", time: "09:30 AM", student: "Lucas Vega", parent: "María Vega", reason: "Problemas de conducta continuos" }],
  "2-27": [{ label: "Citación Padre de Miguel", type: "gestion", time: "14:00 PM", student: "Miguel Ríos", parent: "Jorge Ríos", reason: "Actualización de datos médicos" }],
  "2-28": [{ label: "Citación Madre de Daniela", type: "academico", time: "12:15 PM", student: "Daniela Blanco", parent: "Marta Blanco", reason: "Tutoría académica" }],
  "2-30": [{ label: "Citación Padre de Rodrigo", type: "incidencia", time: "10:00 AM", student: "Rodrigo Mora", parent: "Luis Mora", reason: "Daño a propiedad del colegio" }],
  
  // ABRIL
  "3-2": [{ label: "Citación Padre de Santiago", type: "academico", time: "09:45 AM", student: "Santiago Ruiz", parent: "Andrés Ruiz", reason: "Mejora reportada" }],
  "3-4": [{ label: "Citación Madre de Valery M.", type: "incidencia", time: "11:00 AM", student: "Valery Mamani", parent: "Martha Campos", reason: "Acumulación de incidencias" }],
  "3-5": [{ label: "Citación con Apoderado de Sofía Ruiz", type: "otros", time: "11:00 AM", student: "Sofía Ruiz", parent: "Carlos Ruiz", reason: "Faltas injustificadas" }],
  "3-8": [
     { label: "Citación Madre de Juan Pérez", type: "incidencia", time: "2:00 PM", student: "Juan Pérez", parent: "Ana L.", reason: "Agresión en aula" },
     { label: "Citación Padre de Luis Silva", type: "academico", time: "08:00 AM", student: "Luis Silva", parent: "Alberto Silva", reason: "Apoyo en Lenguaje" }
  ],
  "3-10": [{ label: "Citación Madre de Andrea", type: "academico", time: "12:30 PM", student: "Andrea Conde", parent: "Julia Conde", reason: "Revisión de cuaderno" }],
  "3-12": [{ label: "Citación Padre de Nicolas", type: "gestion", time: "08:45 AM", student: "Nicolas Salas", parent: "Victor Salas", reason: "Matrícula condicional" }],
  "3-15": [{ label: "Citación Padre de Carlos", type: "otros", time: "10:15 AM", student: "Carlos Paredes", parent: "Raul Paredes", reason: "Dificultades en taller de arte" }],
  "3-16": [{ label: "Citación Madre de Flavia", type: "incidencia", time: "09:00 AM", student: "Flavia Mendez", parent: "Rosa Mendez", reason: "Comportamiento disruptivo" }],
  "3-18": [{ label: "Citación con Padre de Diego C.", type: "otros", time: "08:15 AM", student: "Diego Castro", parent: "Juan Castro", reason: "Reunión de coordinación y mediación escolar" }],
  "3-20": [{ label: "Citación con Madre de Mateo Rojas", type: "academico", time: "12:00 PM", student: "Mateo Rojas", parent: "Elena Rojas", reason: "Entrega de libreta de notas - I Bimestre" }],
  "3-22": [
     { label: "Citación Madre de Fernando", type: "incidencia", time: "09:30 AM", student: "Fernando Arce", parent: "Gloria Arce", reason: "Falsificación de firma" },
     { label: "Citación Padre de Micaela", type: "otros", time: "11:00 AM", student: "Micaela Wong", parent: "Javier Wong", reason: "Faltas injustificadas" }
  ],
  "3-25": [{ label: "Citación Madre de Sebastián", type: "academico", time: "08:00 AM", student: "Sebastián Reyes", parent: "Mónica Reyes", reason: "Reforzamiento de inglés" }],
  "3-27": [{ label: "Citación Padre de Pablo", type: "gestion", time: "14:30 PM", student: "Pablo Cueva", parent: "Julio Cueva", reason: "Firma de permiso de viaje" }],
  "3-29": [{ label: "Citación Padre de Ariana", type: "incidencia", time: "10:00 AM", student: "Ariana Vega", parent: "Esteban Vega", reason: "Uso de celular en clase" }],

  // MAYO
  "4-2": [{ label: "Citación con Padre de Camila Paz", type: "academico", time: "10:30 AM", student: "Camila Paz", parent: "Andrés Paz", reason: "Mejora reportada en su desempeño general" }],
  "4-8": [{ label: "Citación con Madre de Juan Pérez", type: "incidencia", time: "2:00 PM", student: "Juan Pérez", parent: "Ana L.", reason: "Agresión e indisciplina en el aula" }],
  "4-20": [{ label: "Citación con Apoderado de Ana S.", type: "otros", time: "09:00 AM", student: "Ana Soto", parent: "Pedro Soto", reason: "Regularización de matrícula y ficha de datos" }],
  "4-22": [{ label: "Citación con Padre de Luis Silva", type: "academico", time: "08:00 AM", student: "Luis Silva", parent: "Alberto Silva", reason: "Apoyo adicional requerido en Lenguaje" }],
  "5-15": [{ label: "Citación con Madre de Rosa M.", type: "incidencia", time: "11:30 AM", student: "Rosa M.", parent: "Carmen T.", reason: "Faltas recurrentes sin justificación escrita" }],
};

const SCHEDULE_TIME_SLOTS = [
  { start: "8:00", end: "8:45" },
  { start: "8:45", end: "9:30" },
  { start: "9:30", end: "10:15" },
  { start: "10:15", end: "11:00" },
  { start: "11:00", end: "11:15", isRecreo: true },
  { start: "11:15", end: "12:00" },
  { start: "12:00", end: "12:45" },
  { start: "12:45", end: "13:15", isRecreo: true },
  { start: "13:15", end: "14:00" },
  { start: "14:00", end: "14:45" },
  { start: "14:45", end: "15:30" },
];

const getEventColor = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'feriado': return 'bg-rose-500';
    case 'incidencia': return 'bg-rose-500';
    case 'vacaciones': return 'bg-amber-400';
    case 'otros': return 'bg-yellow-400';
    case 'academico': return 'bg-blue-600';
    case 'gestion': return 'bg-purple-500';
    default: return 'bg-cyan-500'; // civico
  }
};

const getEventBadgeStyles = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'feriado': return 'bg-rose-50 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800 text-slate-900 dark:text-slate-100';
    case 'incidencia': return 'bg-rose-50 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800 text-slate-900 dark:text-slate-100';
    case 'vacaciones': return 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 text-slate-900 dark:text-slate-100';
    case 'otros': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800 text-slate-900 dark:text-slate-100';
    case 'academico': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 text-slate-900 dark:text-slate-100';
    case 'gestion': return 'bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800 text-slate-900 dark:text-slate-100';
    default: return 'bg-cyan-50 border-cyan-200 dark:bg-cyan-900/30 dark:border-cyan-800 text-slate-900 dark:text-slate-100'; // civico
  }
};

const getDaysInMonth = (monthIndex: number, year: number) => new Date(year, monthIndex + 1, 0).getDate();
const getFirstDayOfMonth = (monthIndex: number, year: number) => new Date(year, monthIndex, 1).getDay();

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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [userRole, setUserRole] = useState<'admin' | 'parent' | null>(null);
  const [parentStudentId, setParentStudentId] = useState<string | undefined>(undefined);
  const [currentView, setCurrentView] = useState<ModuleId>('dashboard'); 
  const [chatOpen, setChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Estados para los menús desplegables
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  
  // Estado Global Calendario
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarViewMode, setCalendarViewMode] = useState<"calendario" | "horario" | "citaciones">("calendario");
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null);
  const [horarioDay, setHorarioDay] = useState<"Lunes"|"Martes"|"Miércoles"|"Jueves"|"Viernes">("Lunes");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate()); // Start with today selected
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  
  // Referencias para detectar clics fuera
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Manejo del Modo Oscuro
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Manejo de Clic Fuera de los Menús
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Evento global para abrir calendario
  useEffect(() => {
    const handleOpenCalendarEvent = (e: any) => {
      setIsCalendarOpen(true);
      setCalendarViewMode("citaciones");
      if (e.detail?.date) {
        // e.detail.date puede ser "Míercoles 15, Abril" o "En proceso para el 22, Abril"
        const dateStr = e.detail.date;
        const matchNumber = dateStr.match(/\d+/);
        if (matchNumber) {
          const d = parseInt(matchNumber[0], 10);
          setSelectedDate(d);
          // Opcional: Extraer "Abril" y encontrar su índice, aquí asumo el mes actual por simplicidad o busco en texto:
          const lowerStr = dateStr.toLowerCase();
          const monthIndex = MONTH_NAMES.findIndex(m => lowerStr.includes(m.toLowerCase()));
          if (monthIndex > -1) {
             setCurrentMonthIndex(monthIndex);
          }
        }
      }
    };
    window.addEventListener("openCalendar", handleOpenCalendarEvent);
    return () => {
      window.removeEventListener("openCalendar", handleOpenCalendarEvent);
    };
  }, []);

  // Lógica Calendario
  const handlePrevMonth = () => {
    setCurrentMonthIndex(prev => prev === 0 ? 11 : prev - 1);
    setSelectedDate(null);
  };
  const handleNextMonth = () => {
    setCurrentMonthIndex(prev => prev === 11 ? 0 : prev + 1);
    setSelectedDate(null);
  };
  const handleGoToday = () => {
    const today = new Date();
    setCurrentMonthIndex(today.getMonth());
    setSelectedDate(today.getDate());
  }
  
  const calendarDays = useMemo(() => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonthIndex, YEAR);
    const firstDay = getFirstDayOfMonth(currentMonthIndex, YEAR);
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [currentMonthIndex]);

  // Eventos del día seleccionado
  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    const eventsDict = calendarViewMode === "citaciones" ? CITATIONS_2026 : EVENTS_2026;
    return eventsDict[`${currentMonthIndex}-${selectedDate}`] || [];
  }, [selectedDate, currentMonthIndex, calendarViewMode]);

  const upcomingEvents = useMemo(() => {
    // Show events for the rest of the month if no day selected
    if (selectedDate) return [];
    const events = [];
    const eventsDict = calendarViewMode === "citaciones" ? CITATIONS_2026 : EVENTS_2026;
    for(let d = 1; d <= getDaysInMonth(currentMonthIndex, YEAR); d++) {
        const evs = eventsDict[`${currentMonthIndex}-${d}`];
        if(evs) {
            events.push({ day: d, items: evs });
        }
    }
    return events;
  }, [currentMonthIndex, selectedDate, calendarViewMode]);

  // Dynamic View Resolver
  const ActiveComponent = MENU_CONFIG.find(m => m.id === currentView)?.component || MENU_CONFIG[0].component;

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) setHasUnread(false);
  };

  return (
    <>
      {!isAuthenticated ? (
        <LoginModule onLogin={(role = 'admin', studentId) => {
          setUserRole(role);
          setParentStudentId(studentId);
          setIsAuthenticated(true);
          if (role === 'parent') {
            setCurrentView('classrooms');
          }
        }} config={APP_CONFIG} />
      ) : userRole === 'parent' ? (
        <div className="h-screen w-screen bg-gray-50/50 dark:bg-slate-950 overflow-y-auto font-poppins flex flex-col">
           {/* Simple header with logout */}
           <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shrink-0">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <User size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">Portal del Apoderado</h1>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">Vista detallada del estudiante</p>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
               <button 
                 className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-700 transition-all active:scale-95 flex items-center justify-center overflow-hidden relative"
                 title="Notificaciones"
               >
                 <Bell size={18} strokeWidth={2.5} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-800"></span>
               </button>
               <button 
                 className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-700 transition-all active:scale-95 flex items-center justify-center overflow-hidden"
                 title="Ver Calendario"
               >
                 <CalendarDays size={18} strokeWidth={2.5} />
               </button>
               <button 
                 onClick={() => setIsDarkMode(!isDarkMode)}
                 className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-gray-400 hover:text-blue-500 dark:hover:text-yellow-400 shadow-sm border border-gray-100 dark:border-slate-700 transition-all active:scale-95 flex items-center justify-center overflow-hidden"
                 title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
               >
                 <AnimatePresence mode="wait" initial={false}>
                   <motion.div
                     key={isDarkMode ? 'sun' : 'moon'}
                     initial={{ y: -20, opacity: 0, rotate: -45 }}
                     animate={{ y: 0, opacity: 1, rotate: 0 }}
                     exit={{ y: 20, opacity: 0, rotate: 45 }}
                     transition={{ duration: 0.2 }}
                   >
                     {isDarkMode ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
                   </motion.div>
                 </AnimatePresence>
               </button>
               <div className="flex items-center gap-3 pl-2 pr-4 h-10 rounded-full shadow-sm border bg-white border-gray-100 dark:bg-slate-800 dark:border-slate-700 relative cursor-pointer" onClick={() => setProfileOpen(!profileOpen)}>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    PV
                  </div>
                  <div className="hidden md:block text-left mr-1">
                    <p className="text-xs font-bold text-gray-800 dark:text-white leading-tight">Peepo Vega</p>
                    <p className="text-[10px] text-gray-400 font-medium">Apoderado</p>
                  </div>
                  <ChevronDown size={14} className="text-gray-400"/>
                  
                  <AnimatePresence>
                    {profileOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-12 right-0 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 p-2 z-50"
                        >
                            <button onClick={() => {
                              setIsAuthenticated(false);
                              setUserRole(null);
                              setParentStudentId(undefined);
                            }} className="w-full text-left p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-3 text-xs font-bold text-rose-600 transition-colors">
                                <LogOut size={18}/> Cerrar Sesión
                            </button>
                        </motion.div>
                    )}
                  </AnimatePresence>
               </div>
             </div>
           </div>
           <div className="max-w-7xl mx-auto p-8 w-full flex-1">
             <ActiveComponent key="parent-view" onNavigate={setCurrentView} parentViewStudentId={parentStudentId} />
           </div>
        </div>
      ) : (
        <div className="h-screen w-screen bg-white dark:bg-slate-950 overflow-hidden flex relative text-gray-800 dark:text-gray-200 font-poppins">
          
          {/* SIDEBAR */}
          {userRole === 'admin' && (
            <motion.div 
              animate={{ width: isSidebarExpanded ? 256 : 112 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="flex flex-col items-center py-8 border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-20 shrink-0 h-full relative"
            >
            {/* Toggle Button */}
            <button 
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="absolute -right-3 top-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm z-50"
            >
              {isSidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            <motion.div layout className={`mb-10 flex items-center gap-3 ${isSidebarExpanded ? 'px-6 w-full' : 'justify-center'}`}>
              <motion.div layout className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm p-1 bg-white shrink-0">
                <img src={APP_CONFIG.sidebarLogo} alt="Logo" className="w-full h-full object-contain" />
              </motion.div>
              <AnimatePresence>
                {isSidebarExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }} 
                    animate={{ opacity: 1, width: 'auto' }} 
                    exit={{ opacity: 0, width: 0 }} 
                    className="flex flex-col overflow-hidden whitespace-nowrap"
                  >
                    <span className="text-lg font-black text-gray-900 dark:text-white leading-tight">I.E 6049</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Ricardo Palma</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <motion.nav layout className={`flex flex-col gap-2 w-full flex-1 ${isSidebarExpanded ? 'px-4' : 'px-2'}`}>
              {MENU_CONFIG.filter(item => !item.hidden).map((item) => (
                <SidebarItem 
                  key={item.id}
                  icon={item.icon} 
                  label={item.label} 
                  active={currentView === item.id} 
                  onClick={() => setCurrentView(item.id)} 
                  expanded={isSidebarExpanded}
                />
              ))}
            </motion.nav>
            
            <motion.div layout className={`mt-auto flex flex-col gap-4 w-full ${isSidebarExpanded ? 'px-6' : 'px-4'}`}>
              <button onClick={() => setChatOpen(true)} className={`w-full p-4 text-blue-500 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-2xl transition-colors hover:scale-105 active:scale-95 flex ${isSidebarExpanded ? 'justify-start items-center gap-3' : 'justify-center'} shadow-sm`}>
                <motion.div layout>
                  <Bot size={isSidebarExpanded ? 24 : 32} strokeWidth={2.5}/>
                </motion.div>
                <AnimatePresence>
                  {isSidebarExpanded && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }} 
                      animate={{ opacity: 1, width: 'auto' }} 
                      exit={{ opacity: 0, width: 0 }} 
                      className="font-bold text-sm overflow-hidden whitespace-nowrap"
                    >
                      Asistente AI
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button onClick={() => setIsAuthenticated(false)} className={`w-full p-3 text-gray-400 hover:text-rose-500 transition-colors flex ${isSidebarExpanded ? 'justify-start items-center gap-3' : 'justify-center'}`}>
                <motion.div layout>
                  <LogOut size={isSidebarExpanded ? 24 : 30}/>
                </motion.div>
                <AnimatePresence>
                  {isSidebarExpanded && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }} 
                      animate={{ opacity: 1, width: 'auto' }} 
                      exit={{ opacity: 0, width: 0 }} 
                      className="font-bold text-sm overflow-hidden whitespace-nowrap"
                    >
                      Cerrar Sesión
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </motion.div>
          )}
          
          {/* MAIN CONTENT */}
          <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-gray-50/50 dark:bg-slate-950">
            
            {/* TOP BAR (Absolute) */}
            <div className="absolute top-8 right-8 z-50 flex justify-end items-center gap-5">
               

               {/* 0. Notifications Button */}
               {userRole === 'admin' && (
                 <div className="relative" ref={notifRef}>
                   <button 
                     onClick={() => {
                     setNotificationsOpen(!notificationsOpen);
                     if (!notificationsOpen) setHasUnread(false);
                   }}
                   className={`w-14 h-14 rounded-full shadow-sm border transition-all active:scale-95 flex items-center justify-center overflow-hidden relative ${notificationsOpen ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400' : 'bg-white border-gray-100 text-gray-400 hover:text-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:hover:text-blue-400'}`}
                   title="Notificaciones"
                 >
                   <Bell size={24} strokeWidth={2.5} />
                   {hasUnread && (
                     <span className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                   )}
                 </button>

                 <AnimatePresence>
                   {notificationsOpen && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       transition={{ duration: 0.2 }}
                       className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden z-50 flex flex-col"
                     >
                       <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                         <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notificaciones</h3>
                         <button 
                           onClick={() => setHasUnread(false)}
                           className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                         >
                           Marcar leídas
                         </button>
                       </div>
                       
                       <div className="max-h-80 overflow-y-auto p-2 space-y-1 scrollbar-hide">
                         <div className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 items-start">
                           <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                             <AlertTriangle size={16} className="text-rose-600 dark:text-rose-400" />
                           </div>
                           <div>
                             <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight mb-1">Nueva incidencia registrada</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400">Se ha registrado una incidencia grave en 3°A.</p>
                             <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Hace 10 min</p>
                           </div>
                         </div>
                         
                         <div className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 items-start">
                           <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                             <CalendarDays size={16} className="text-blue-600 dark:text-blue-400" />
                           </div>
                           <div>
                             <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight mb-1">Recordatorio de evento</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400">Mañana es el Día del Logro.</p>
                             <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Hace 2 horas</p>
                           </div>
                         </div>

                         <div className="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 items-start opacity-60">
                           <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                             <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                           </div>
                           <div>
                             <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight mb-1">Reportes generados</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400">Los reportes mensuales están listos.</p>
                             <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Ayer</p>
                           </div>
                         </div>
                       </div>
                       
                       <div className="p-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                         <button className="w-full text-center text-xs font-bold text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                           Ver todas las notificaciones
                         </button>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
               )}

               {/* 1. Calendar Button */}
               <button 
                 onClick={() => setIsCalendarOpen(true)}
                 className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-700 transition-all active:scale-95 flex items-center justify-center overflow-hidden"
                 title="Ver Calendario"
               >
                 <CalendarDays size={24} strokeWidth={2.5} />
               </button>

               {/* 2. Theme Toggle */}
               <button 
                 onClick={() => setIsDarkMode(!isDarkMode)}
                 className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 text-gray-400 hover:text-blue-500 dark:hover:text-yellow-400 shadow-sm border border-gray-100 dark:border-slate-700 transition-all active:scale-95 flex items-center justify-center overflow-hidden"
                 title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
               >
                 <AnimatePresence mode="wait" initial={false}>
                   <motion.div
                     key={isDarkMode ? 'sun' : 'moon'}
                     initial={{ y: -20, opacity: 0, rotate: -45 }}
                     animate={{ y: 0, opacity: 1, rotate: 0 }}
                     exit={{ y: 20, opacity: 0, rotate: 45 }}
                     transition={{ duration: 0.2 }}
                   >
                     {isDarkMode ? <Sun size={24} strokeWidth={2.5} /> : <Moon size={24} strokeWidth={2.5} />}
                   </motion.div>
                 </AnimatePresence>
               </button>

               {/* 3. User Profile */}
               <div className="relative" ref={profileRef}>
                  <div 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-3 pl-2 pr-5 h-14 rounded-full shadow-sm border cursor-pointer transition-all select-none ${profileOpen ? 'bg-blue-50 border-blue-200 dark:bg-slate-800' : 'bg-white border-gray-100 dark:bg-slate-800 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}
                  >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {userRole === 'admin' ? 'AD' : 'PV'}
                      </div>
                      <div className="hidden md:block text-left mr-1">
                        <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">
                          {userRole === 'admin' ? 'Admin Principal' : 'Peepo Vega'}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          {userRole === 'admin' ? 'Director General' : 'Apoderado'}
                        </p>
                      </div>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`}/>
                  </div>

                  <AnimatePresence>
                    {profileOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden z-50 p-2"
                        >
                            <div className="p-4 border-b border-gray-100 dark:border-slate-800 mb-2 bg-gray-50/50 dark:bg-slate-800/50 rounded-xl">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                  {userRole === 'admin' ? 'Administrador' : 'Apoderado'}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                  {userRole === 'admin' ? 'admin@peepos.edu.pe' : 'peepo@ejemplo.com'}
                                </p>
                            </div>
                            
                            {userRole === 'admin' && (
                              <div className="space-y-1">
                                  <button 
                                      onClick={() => {
                                        setCurrentView('profile');
                                        setProfileOpen(false);
                                      }}
                                      className="w-full text-left p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors group"
                                  >
                                      <User size={18} className="text-gray-400 group-hover:text-blue-500"/> Mi Perfil
                                  </button>
                                  <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors group">
                                      <Settings size={18} className="text-gray-400 group-hover:text-blue-500"/> Configuración
                                  </button>
                                  <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors group">
                                      <HelpCircle size={18} className="text-gray-400 group-hover:text-blue-500"/> Ayuda y Soporte
                                  </button>
                              </div>
                            )}

                            <div className="my-2 border-t border-gray-100 dark:border-slate-800"></div>
                            
                            <button onClick={() => {
                              setIsAuthenticated(false);
                              setUserRole(null);
                              setParentStudentId(undefined);
                            }} className="w-full text-left p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-3 text-xs font-bold text-rose-600 transition-colors">
                                <LogOut size={18}/> Cerrar Sesión
                            </button>
                        </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>

            <main className="flex-1 overflow-y-auto px-8 pb-8 pt-8">
              <AnimatePresence mode="wait">
                <ActiveComponent key={currentView} onNavigate={setCurrentView} />
              </AnimatePresence>
            </main>
          </div>
          <AIChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />

          {/* MODAL GLOBAL CALENDARIO REDISEÑADO */}
          <AnimatePresence>
            {isCalendarOpen && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setIsCalendarOpen(false)}
              >
                <motion.div 
                   initial={{ scale: 0.95, opacity: 0 }} 
                   animate={{ scale: 1, opacity: 1 }} 
                   exit={{ scale: 0.95, opacity: 0 }}
                   className="bg-white dark:bg-slate-900 w-full h-[85vh] max-w-5xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-slate-800"
                   onClick={(e) => e.stopPropagation()}
                >
                   {/* HEADER */}
                   <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
                      <div className="flex items-center gap-5">
                         <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl shadow-sm">
                            <CalendarDays size={28} />
                         </div>
                         <div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                              {calendarViewMode === "horario" ? "Mi Horario Semanal" : MONTH_NAMES[currentMonthIndex]}
                            </h2>
                            <p className="text-sm text-gray-400 font-medium mt-1">Año Académico {YEAR}</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mr-2">
                           <button 
                             onClick={() => setCalendarViewMode("calendario")}
                             className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${calendarViewMode === 'calendario' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                           >
                             Calendario
                           </button>
                           <button 
                             onClick={() => setCalendarViewMode("citaciones")}
                             className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${calendarViewMode === 'citaciones' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                           >
                             Citaciones
                           </button>
                           <button 
                             onClick={() => setCalendarViewMode("horario")}
                             className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${calendarViewMode === 'horario' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                           >
                             Mi Horario
                           </button>
                         </div>
                         {(calendarViewMode === "calendario" || calendarViewMode === "citaciones") && (
                           <>
                             <button 
                                onClick={handleGoToday}
                                className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors"
                             >
                                Hoy
                             </button>
                             <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
                                <button onClick={handlePrevMonth} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-300 transition-all shadow-sm"><ChevronLeft size={20}/></button>
                                <button onClick={handleNextMonth} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-300 transition-all shadow-sm"><ChevronRight size={20}/></button>
                             </div>
                           </>
                         )}
                         <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>
                         <button 
                            onClick={() => setIsCalendarOpen(false)}
                            className="p-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 rounded-xl transition-colors text-gray-400"
                         >
                            <X size={20}/>
                         </button>
                      </div>
                   </div>

                   {/* CONTENIDO SPLIT */}
                   <div className="flex-1 flex overflow-hidden">
                      {(calendarViewMode === "calendario" || calendarViewMode === "citaciones") ? (
                        <>
                          {/* COLUMNA IZQUIERDA: CALENDARIO GRID */}
                          <div className="flex-[2] flex flex-col p-6 border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                              <div className="grid grid-cols-7 mb-4">
                            {DAY_NAMES.map((day, i) => (
                              <div key={i} className="text-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{day}</span>
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 grid-rows-6 gap-3 h-full">
                             {calendarDays.map((day, i) => {
                               const eventKey = day ? `${currentMonthIndex}-${day}` : null;
                               const eventsDict = calendarViewMode === "citaciones" ? CITATIONS_2026 : EVENTS_2026;
                               const dayEvents = eventKey ? eventsDict[eventKey] : null;
                               const isSelected = selectedDate === day;
                               const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonthIndex && new Date().getFullYear() === YEAR;

                               return (
                                 <button 
                                   key={i} 
                                   onClick={() => day && setSelectedDate(day)}
                                   disabled={!day}
                                   className={`relative rounded-2xl flex flex-col items-center justify-center transition-all duration-200 group ${
                                     !day 
                                       ? 'opacity-0 pointer-events-none'
                                       : isSelected
                                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none scale-105 z-10'
                                          : isToday
                                             ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-200 dark:border-blue-800'
                                             : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
                                   }`}
                                 >
                                    <span className={`text-lg font-bold ${!day ? '' : ''}`}>{day}</span>
                                    
                                    {/* Indicadores de Eventos (Puntos o Pill) */}
                                    {dayEvents && (
                                       calendarViewMode === "citaciones" ? (
                                         <div className={`mt-1 text-[9px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                                            {dayEvents.length} {dayEvents.length === 1 ? 'cita' : 'citas'}
                                         </div>
                                       ) : (
                                         <div className="flex gap-1 mt-1 flex-wrap justify-center px-1">
                                            {dayEvents.slice(0, 3).map((ev, idx) => (
                                               <div key={idx} className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-white' : getEventColor(ev.type)}`}></div>
                                            ))}
                                            {dayEvents.length > 3 && <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-white' : 'bg-gray-300 dark:bg-slate-600'}`}></div>}
                                         </div>
                                       )
                                    )}
                                 </button>
                               );
                             })}
                          </div>
                      </div>

                      {/* COLUMNA DERECHA: DETALLES EVENTOS (CON LAYOUT FLEXIBLE) */}
                      <div className="flex-1 bg-gray-50 dark:bg-slate-950 flex flex-col overflow-hidden">
                          {/* LISTA SCROLLABLE */}
                          <div className="flex-1 overflow-y-auto p-6">
                              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 sticky top-0 bg-gray-50 dark:bg-slate-950 z-10 py-2">
                                 {selectedDate ? `Eventos del ${selectedDate} de ${MONTH_NAMES[currentMonthIndex]}` : `Próximos Eventos - ${MONTH_NAMES[currentMonthIndex]}`}
                              </h3>
                              
                              <div className="space-y-3">
                                 {selectedDate ? (
                                    selectedDayEvents.length > 0 ? (
                                       selectedDayEvents.map((ev, idx) => (
                                          <motion.div 
                                             initial={{ opacity: 0, x: 20 }}
                                             animate={{ opacity: 1, x: 0 }}
                                             transition={{ delay: idx * 0.1 }}
                                             key={idx} 
                                             className={`p-4 rounded-2xl border flex gap-3 ${getEventBadgeStyles(ev.type)} bg-white dark:bg-slate-900 border-l-4`}
                                          >
                                             <div className="mt-0.5"><Clock size={16} /></div>
                                             <div className="flex-1 w-full text-left">
                                                <p className="text-sm font-extrabold">{ev.label}</p>
                                                {ev.time && (
                                                    <div className="mt-2.5 text-[11px] opacity-90 space-y-1.5 w-full">
                                                       <p className="flex justify-between items-center px-2 py-1.5 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                                                          <span className="font-bold opacity-80">Hora:</span> 
                                                          <span className="font-extrabold text-xs">{ev.time}</span>
                                                       </p>
                                                       {ev.parent && (
                                                           <p className="flex justify-between items-center px-2 py-1.5 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                                                              <span className="font-bold opacity-80">Apoderado:</span> 
                                                              <span className="font-bold">{ev.parent}</span>
                                                           </p>
                                                       )}
                                                       {ev.student && (
                                                           <p className="flex justify-between items-center px-2 py-1.5 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                                                              <span className="font-bold opacity-80">Estudiante:</span> 
                                                              <span className="font-bold">{ev.student}</span>
                                                           </p>
                                                       )}
                                                       {ev.reason && (
                                                           <div className="flex flex-col px-2 py-1.5 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 mt-1.5">
                                                              <span className="font-bold opacity-80 mb-0.5">Motivo:</span> 
                                                              <span className="italic leading-snug">{ev.reason}</span>
                                                           </div>
                                                       )}
                                                    </div>
                                                )}
                                                <p className="text-[10px] opacity-100 uppercase font-bold mt-2.5 inline-block px-2 py-0.5 bg-white shadow-sm dark:bg-slate-900 rounded-[5px] border border-current">{ev.type}</p>
                                             </div>
                                          </motion.div>
                                       ))
                                    ) : (
                                       <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                             <CalendarDays size={32} className="opacity-50"/>
                                          </div>
                                          <p className="text-sm font-medium">Sin eventos programados</p>
                                          <p className="text-xs mt-1">Selecciona otro día para ver más.</p>
                                       </div>
                                    )
                                 ) : (
                                    // Lista de próximos eventos del mes (Estilo Tarjetas)
                                    upcomingEvents.length > 0 ? (
                                       upcomingEvents.map((group, gIdx) => (
                                          <div key={gIdx} className="mb-5">
                                             {/* Header de Fecha */}
                                             <div className="flex items-center gap-2 mb-3">
                                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                   {group.day} {MONTH_NAMES[currentMonthIndex].substring(0,3)}
                                                </span>
                                                <div className="h-px bg-gray-200 dark:bg-slate-800 flex-1"></div>
                                             </div>
                                             
                                             {/* Lista de Eventos del Día */}
                                             <div className="space-y-2">
                                                {group.items.map((ev, idx) => (
                                                   <div key={idx} className={`p-3 rounded-xl border flex gap-3 items-start bg-white dark:bg-slate-900 shadow-sm ${getEventBadgeStyles(ev.type)}`}>
                                                      <div className="mt-0.5"><Clock size={14} /></div>
                                                      <div className="flex-1 w-full text-left">
                                                         <p className="text-xs font-extrabold leading-tight">{ev.label}</p>
                                                         {ev.time && (
                                                             <div className="mt-2 text-[10px] opacity-90 space-y-1 w-full">
                                                                <p className="flex justify-between items-center px-1.5 py-1 bg-black/5 dark:bg-white/5 rounded-md border border-black/5 dark:border-white/5">
                                                                   <span className="font-bold opacity-80">Hora:</span> 
                                                                   <span className="font-extrabold">{ev.time}</span>
                                                                </p>
                                                                {ev.parent && (
                                                                    <p className="flex justify-between items-center px-1.5 py-1 bg-black/5 dark:bg-white/5 rounded-md border border-black/5 dark:border-white/5">
                                                                       <span className="font-bold opacity-80">Apoderado:</span> 
                                                                       <span className="font-bold">{ev.parent}</span>
                                                                    </p>
                                                                )}
                                                                {ev.student && (
                                                                    <p className="flex justify-between items-center px-1.5 py-1 bg-black/5 dark:bg-white/5 rounded-md border border-black/5 dark:border-white/5">
                                                                       <span className="font-bold opacity-80">Estudiante:</span> 
                                                                       <span className="font-bold">{ev.student}</span>
                                                                    </p>
                                                                )}
                                                                {ev.reason && (
                                                                    <div className="flex flex-col px-1.5 py-1 bg-black/5 dark:bg-white/5 rounded-md border border-black/5 dark:border-white/5 mt-1">
                                                                       <span className="font-bold opacity-80 mb-0.5">Motivo:</span> 
                                                                       <span className="italic leading-snug">{ev.reason}</span>
                                                                    </div>
                                                                )}
                                                             </div>
                                                         )}
                                                         <p className="text-[9px] opacity-100 uppercase font-black mt-2 tracking-wide inline-block px-1.5 py-0.5 bg-white shadow-sm dark:bg-slate-900 rounded-[4px] border border-current">{ev.type}</p>
                                                      </div>
                                                   </div>
                                                ))}
                                             </div>
                                          </div>
                                       ))
                                    ) : (
                                       <p className="text-center text-gray-400 text-sm py-10">No hay más eventos este mes.</p>
                                    )
                                 )}
                              </div>
                          </div>
                          
                          {/* LEYENDA (Footer Fijo) */}
                          <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Leyenda de Eventos</p>
                             <div className="flex flex-wrap gap-2">
                                {calendarViewMode === 'citaciones' ? (
                                  <>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-lg">
                                       <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                       <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300">Incidencia</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                                       <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                       <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300">Académico</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-lg">
                                       <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                       <span className="text-[10px] font-bold text-yellow-700 dark:text-yellow-300">Otros</span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-lg">
                                       <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                       <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300">Feriado</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                                       <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                       <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300">Académico</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800 rounded-lg">
                                       <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                       <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300">Cívico</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg">
                                       <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                       <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300">Gestión</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg">
                                       <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                       <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">Vacaciones</span>
                                    </div>
                                  </>
                                )}
                             </div>
                          </div>
                        </div>
                     </>
                  ) : (
                        <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-[32px] w-full flex-1 animate-in fade-in zoom-in-95 overflow-hidden">
                          {/* GRID HEADER: Day Names */}
                          <div className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 shrink-0">
                            <div className="p-4 flex items-center justify-center border-r border-gray-100 dark:border-slate-800">
                               <Clock size={18} className="text-slate-400" />
                            </div>
                            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map(day => (
                              <div key={day} className="p-4 text-center border-r border-gray-100 dark:border-slate-800 last:border-r-0">
                                <span className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight uppercase">{day}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* GRID BODY: Time Slots */}
                          <div className="flex-1 overflow-y-auto custom-scrollbar">
                             <div className="grid grid-cols-[100px_repeat(5,1fr)] min-h-0">
                                {SCHEDULE_TIME_SLOTS.map((slot, sIdx) => (
                                   <React.Fragment key={sIdx}>
                                      {/* Time label column */}
                                      <div className={`p-4 border-r border-b border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center sticky left-0 bg-white dark:bg-slate-900 z-10 ${slot.isRecreo ? 'bg-slate-50/80 dark:bg-slate-800/20' : ''}`}>
                                         <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300 leading-none">{slot.start}</span>
                                         <span className="text-[10px] font-medium text-slate-400 mt-1">{slot.end}</span>
                                      </div>
                                      
                                      {/* Day columns */}
                                      {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map(day => {
                                         const block = TEACHER_SCHEDULE[day].find(b => b.start === slot.start);
                                         
                                         return (
                                            <div key={`${day}-${sIdx}`} className={`p-2 border-r border-b border-gray-100 dark:border-slate-800 last:border-r-0 relative min-h-[90px] ${slot.isRecreo ? 'bg-slate-50/50 dark:bg-slate-800/10 min-h-[70px]' : ''}`}>
                                               {block && block.subject !== "LIBRE" && (
                                                  <div className={`h-full w-full rounded-[14px] p-2.5 flex flex-col justify-between border shadow-sm transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-md z-0 group relative overflow-hidden ${block.color}`}>
                                                     <div className="absolute inset-0 bg-white/20 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                     <div className="flex items-start justify-between relative z-10 w-full gap-1">
                                                        <span className="font-extrabold text-xs tracking-tight uppercase leading-tight line-clamp-2">{block.subject}</span>
                                                        {block.section && <span className="bg-black/10 dark:bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-black shrink-0">{block.section}</span>}
                                                     </div>
                                                     <div className="flex items-center gap-1.5 opacity-80 mt-1 relative z-10 text-current">
                                                        {block.subject.includes("REUNIÓN") ? <Users size={12}/> : slot.isRecreo ? <Coffee size={12}/> : <BookOpen size={12}/>}
                                                        <span className="text-[9px] font-bold uppercase truncate">{slot.isRecreo ? 'Descanso' : block.subject.includes("REUNIÓN") ? 'Docentes' : 'Regular'}</span>
                                                     </div>
                                                  </div>
                                               )}
                                               
                                               
                                               {(!block || block.subject === "LIBRE") && (
                                                  <div className="h-full w-full flex flex-col items-center justify-center rounded-[14px] border border-dashed border-slate-200 dark:border-slate-700/60 bg-slate-50/30 dark:bg-slate-800/20 opacity-60 hover:opacity-100 transition-all cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800">
                                                     <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden group-hover:inline-block transition-all">Disponible</span>
                                                  </div>
                                               )}
                                            </div>
                                         );
                                      })}
                                   </React.Fragment>
                                ))}
                             </div>
                          </div>
                          
                          {/* FOOTER: Horario Legend */}
                          <div className="px-10 py-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex items-center justify-between">
                             <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leyenda</span>
                                <div className="flex items-center gap-4">
                                   <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 rounded-md bg-indigo-200 dark:bg-indigo-900/40 border border-indigo-300 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                                         <BookOpen size={10} strokeWidth={3}/>
                                      </div>
                                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Clase Regular</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                         <Users size={10} strokeWidth={3}/>
                                      </div>
                                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Reunión Docente</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 rounded-md bg-slate-50 dark:bg-slate-800 border-dashed border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                                         <Coffee size={10} strokeWidth={3}/>
                                      </div>
                                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Receso</span>
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">Vista Web Optimizada</span>
                             </div>
                          </div>
                        </div>
                     )}
                   </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}