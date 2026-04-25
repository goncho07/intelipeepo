import React from 'react';
import { motion } from 'framer-motion';
import { Building } from 'lucide-react';
import { PageHeader, containerVariants } from '../components/UI';
import { ModuleProps } from '../types';

export const SettingsModule: React.FC<ModuleProps> = () => (
  <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-8">
    <PageHeader title="Configuración" subtitle="Parámetros del sistema." icon={Building} />
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm">
       <div className="flex items-center gap-4"><div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Building/></div><div><h3 className="font-bold">Perfil del Colegio</h3><p className="text-xs text-gray-400">Logos, nombres y dirección.</p></div></div>
    </div>
  </motion.div>
);