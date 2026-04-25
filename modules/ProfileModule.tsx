import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, Bell, Key, Camera, Save, CheckCircle2 } from 'lucide-react';
import { PageHeader, containerVariants } from '../components/UI';
import { ModuleProps } from '../types';

export const ProfileModule: React.FC<ModuleProps> = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'notifications'>('info');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Admin Principal',
    role: 'Director General',
    email: 'admin@peepos.edu.pe',
    phone: '+51 987 654 321',
    address: 'Av. Javier Prado Este 1234, San Borja, Lima',
    bio: 'Director General con más de 15 años de experiencia en gestión educativa y administración escolar.'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-8 h-full flex flex-col font-poppins">
      <PageHeader 
        title="Mi Perfil" 
        subtitle="Gestiona tu información personal, seguridad y preferencias." 
        icon={User} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Columna Izquierda: Tarjeta de Perfil */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            {/* Header de la tarjeta */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500 relative">
              <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors">
                <Camera size={18} />
              </button>
            </div>
            
            {/* Avatar y Datos Básicos */}
            <div className="px-6 pb-6 relative flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 p-1.5 -mt-12 relative z-10">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-3xl shadow-md">
                  AD
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full border-2 border-white dark:border-slate-900 transition-colors shadow-sm">
                  <Camera size={14} />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-3">{userData.name}</h3>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">{userData.role}</p>
              
              <div className="w-full h-px bg-gray-100 dark:bg-slate-800 my-5"></div>
              
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-500 shrink-0">
                    <Mail size={16} />
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 truncate font-medium">{userData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-500 shrink-0">
                    <Phone size={16} />
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 font-medium">{userData.phone}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-500 shrink-0 mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{userData.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Estado de la cuenta */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield size={18} className="text-emerald-500" /> Estado de la Cuenta
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Verificación de Email</span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1">
                  <CheckCircle2 size={12} /> Verificado
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Autenticación 2FA</span>
                <span className="px-2.5 py-1 bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 text-xs font-bold rounded-lg">
                  Inactivo
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Último acceso</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">Hoy, 08:30 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Contenido de Pestañas */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col h-full overflow-hidden">
            
            {/* Navegación de Pestañas */}
            <div className="flex border-b border-gray-100 dark:border-slate-800 px-6 pt-2 overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setActiveTab('info')}
                className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                <User size={18} /> Información Personal
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'security' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                <Key size={18} /> Seguridad
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'notifications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                <Bell size={18} /> Notificaciones
              </button>
            </div>

            {/* Contenido de la Pestaña */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
              {activeTab === 'info' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Datos Personales</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Nombres Completos</label>
                      <input 
                        type="text" 
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Cargo / Rol</label>
                      <input 
                        type="text" 
                        value={userData.role}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800/50 border border-transparent rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Correo Electrónico</label>
                      <input 
                        type="email" 
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Teléfono</label>
                      <input 
                        type="tel" 
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Dirección</label>
                      <input 
                        type="text" 
                        value={userData.address}
                        onChange={(e) => setUserData({...userData, address: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Biografía / Notas</label>
                      <textarea 
                        rows={4}
                        value={userData.bio}
                        onChange={(e) => setUserData({...userData, bio: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Cambiar Contraseña</h3>
                  
                  <div className="max-w-md space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Contraseña Actual</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Nueva Contraseña</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Confirmar Nueva Contraseña</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Requisitos de la contraseña:</h4>
                      <ul className="space-y-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Mínimo 8 caracteres</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Al menos una letra mayúscula</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Al menos un número</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-gray-300 dark:text-slate-600"/> Al menos un carácter especial (!@#$%^&*)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Preferencias de Notificación</h3>
                  
                  <div className="space-y-4">
                    {[
                      { title: 'Notificaciones Push', desc: 'Recibir alertas en el navegador mientras usas la aplicación.', active: true },
                      { title: 'Correos de Resumen Semanal', desc: 'Recibir un resumen de la actividad de la semana cada lunes.', active: true },
                      { title: 'Alertas de Incidencias', desc: 'Notificarme inmediatamente cuando se registre una incidencia grave.', active: true },
                      { title: 'Actualizaciones del Sistema', desc: 'Recibir correos sobre nuevas funcionalidades y mantenimientos.', active: false },
                      { title: 'Mensajes Directos', desc: 'Notificarme cuando reciba un mensaje de otro usuario.', active: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start justify-between p-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="pr-4">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</h4>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                          <input type="checkbox" className="sr-only peer" defaultChecked={item.active} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer con Botón de Guardar */}
            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex items-center justify-end gap-4">
              {showSuccess && (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 size={18} /> Cambios guardados
                </span>
              )}
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <><Save size={18} /> Guardar Cambios</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
