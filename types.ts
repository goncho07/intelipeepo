import React from 'react';

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export interface UserItem {
  id: string;
  code?: string;
  name: string;
  dni: string;
  role: 'Estudiante' | 'Docente' | 'Administrativo' | 'Apoderado';
  level?: 'Inicial' | 'Primaria' | 'Secundaria'; // Campo agregado para filtros
  grade?: string;
  section?: string;
  status: 'Activo' | 'Inactivo' | 'Suspendido' | 'Matriculado' | 'Retirado' | 'Trasladado' | 'Egresado';
  avatarColor: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface IncidentType {
  id: string;
  label: string;
  category: 'Leve' | 'Moderada' | 'Grave';
  icon: any;
  color: string;
}

export interface ClassItem {
  id: string;
  name: string;
}

// --- Arquitectura SaaS ---

export type ModuleId = 'dashboard' | 'users' | 'profile' | 'classrooms' | 'citations';

export interface ModuleProps {
  onNavigate: (view: ModuleId) => void;
  onRegisterIncident?: () => void;
  parentViewStudentId?: string;
}

export interface MenuItemConfig {
  id: ModuleId;
  label: string;
  icon: any; // LucideIcon type implies 'any' in loose contexts, keeping simple for now
  component: React.FC<ModuleProps>;
  hidden?: boolean;
}