import { 
  Home, 
  Users, 
  BookOpen,
  Mail
} from 'lucide-react';
import { DashboardModule } from '../modules/DashboardModule';
import { UsersModule } from '../modules/UsersModule';
import { ProfileModule } from '../modules/ProfileModule';
import { ClassroomsModule } from '../modules/ClassroomsModule';
import { CitationsModule } from '../modules/CitationsModule';
import { MenuItemConfig } from '../types';

export const MENU_CONFIG: MenuItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Inicio',
    icon: Home, // Icono cambiado a Casa
    component: DashboardModule
  },
  {
    id: 'users',
    label: 'Usuarios',
    icon: Users,
    component: UsersModule
  },
  {
    id: 'classrooms',
    label: 'Aulas',
    icon: BookOpen,
    component: ClassroomsModule
  },
  {
    id: 'citations',
    label: 'Citaciones',
    icon: Mail,
    component: CitationsModule
  },
  {
    id: 'profile',
    label: 'Mi Perfil',
    icon: Home, // It won't be shown in sidebar anyway
    component: ProfileModule,
    hidden: true
  }
];