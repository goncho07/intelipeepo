import React from 'react';
import { motion } from 'framer-motion';

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

export const PageHeader: React.FC<{ 
  title: string; 
  subtitle: string; 
  icon: any; 
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, icon: Icon, action, className = "" }) => {
  return (
    <div className={`w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
          <Icon size={32} strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-base mt-1">{subtitle}</p>
        </div>
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
};

export const KPICard: React.FC<{ 
  title: string; 
  value: string; 
  icon: any; 
  variant: 'blue' | 'emerald' | 'orange' | 'rose' | 'purple' | 'cyan';
  compact?: boolean;
}> = ({ title, value, icon: Icon, variant, compact }) => {
  
  // Nueva paleta de colores pastel planos
  const styles = {
    emerald: {
      container: "bg-[#E6F7EF] border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50",
      iconBg: "bg-[#A3E3C7] text-emerald-800 dark:bg-emerald-900 dark:text-emerald-400",
      text: "text-emerald-950 dark:text-emerald-50",
      label: "text-emerald-800 dark:text-emerald-200",
      shadow: "shadow-emerald-100 dark:shadow-none"
    },
    rose: {
      container: "bg-[#FEECEC] border-rose-100 dark:bg-rose-950/30 dark:border-rose-900/50",
      iconBg: "bg-[#FFB5B5] text-rose-800 dark:bg-rose-900 dark:text-rose-400",
      text: "text-rose-950 dark:text-rose-50",
      label: "text-rose-800 dark:text-rose-200",
      shadow: "shadow-rose-100 dark:shadow-none"
    },
    orange: {
      container: "bg-[#FFF4E5] border-orange-100 dark:bg-orange-950/30 dark:border-orange-900/50",
      iconBg: "bg-[#FFD6A5] text-orange-800 dark:bg-orange-900 dark:text-orange-400",
      text: "text-orange-950 dark:text-orange-50",
      label: "text-orange-800 dark:text-orange-200",
      shadow: "shadow-orange-100 dark:shadow-none"
    },
    cyan: { // Mapeado al estilo Azul (Porcentaje)
      container: "bg-[#E0F2FE] border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/50",
      iconBg: "bg-[#BAE6FD] text-blue-800 dark:bg-blue-900 dark:text-blue-400",
      text: "text-blue-950 dark:text-blue-50",
      label: "text-blue-800 dark:text-blue-200",
      shadow: "shadow-blue-100 dark:shadow-none"
    },
    // Fallbacks
    blue: {
      container: "bg-blue-50 border-blue-100 dark:bg-blue-900/20",
      iconBg: "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-300",
      text: "text-blue-900 dark:text-white",
      label: "text-blue-700 dark:text-blue-300",
      shadow: "shadow-blue-100 dark:shadow-none"
    },
    purple: {
      container: "bg-purple-50 border-purple-100 dark:bg-purple-900/20",
      iconBg: "bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-300",
      text: "text-purple-900 dark:text-white",
      label: "text-purple-700 dark:text-purple-300",
      shadow: "shadow-purple-100 dark:shadow-none"
    }
  };

  const style = styles[variant] || styles.blue;

  const compactStyles = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800",
    rose: "text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800",
    cyan: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-100 dark:border-cyan-800"
  };

  if (compact) {
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4 min-h-[100px]"
      >
        <div className={`p-3 rounded-2xl ${compactStyles[variant]} border`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</h3>
        </div>
      </motion.div>
    );
  }

  // Nuevo diseño para las tarjetas principales
  return (
    <motion.div 
      variants={itemVariants} 
      className={`${style.container} p-6 rounded-[32px] border ${style.shadow} relative overflow-hidden group min-h-[200px] flex flex-col justify-between`}
    >
       <div className={`absolute -right-8 -bottom-8 opacity-[0.08] group-hover:scale-110 transition-transform duration-700 rotate-12 ${style.text}`}>
          <Icon size={160} />
       </div>
       
       <div className="relative z-10">
          <div className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center mb-6 shadow-sm`}>
             <Icon size={28} strokeWidth={2.5} />
          </div>
       </div>
       
       <div className="relative z-10">
          <p className={`text-xs font-black uppercase tracking-widest mb-1 ${style.label}`}>{title}</p>
          <h3 className={`text-5xl font-black tracking-tight leading-none ${style.text}`}>{value}</h3>
       </div>
    </motion.div>
  );
};

export const SidebarItem: React.FC<{ icon: any; label: string; active: boolean; onClick: () => void; expanded?: boolean }> = ({ icon: Icon, label, active, onClick, expanded = false }) => (
  <motion.div 
    layout
    onClick={onClick} 
    className={`flex ${expanded ? 'flex-row items-center justify-start px-4' : 'flex-col items-center justify-center'} gap-3 py-4 rounded-2xl cursor-pointer group relative transition-colors w-full overflow-hidden ${active ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}
  >
    {expanded && active && (
      <motion.div layout className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
    )}
    <motion.div layout className={expanded ? 'shrink-0' : ''}>
      <Icon size={expanded ? 26 : 30} strokeWidth={active ? 2.5 : 2} />
    </motion.div>
    <motion.span layout className={`${expanded ? 'text-base font-bold' : 'text-[11px] font-bold text-center px-1'} tracking-tight whitespace-nowrap`}>
      {label}
    </motion.span>
  </motion.div>
);