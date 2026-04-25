import React, { useState } from 'react';
import { Mail, Lock, ArrowRightCircle, Users, IdCard, Phone, MessageSquare, CheckCircle2, ArrowLeft } from 'lucide-react';

interface LoginModuleProps {
  onLogin: (role?: 'admin' | 'parent', parentStudentId?: string) => void;
  config: any;
}

export const LoginModule: React.FC<LoginModuleProps> = ({ onLogin, config }) => {
  const [view, setView] = useState<'login' | 'parent-dni' | 'parent-phone' | 'parent-code'>('login');
  const [dni, setDni] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [parentName, setParentName] = useState<string | null>(null);

  const handleDniSubmit = () => {
    if (dni === '60825400') {
      setParentName('Peepo Vega');
      setTimeout(() => {
        setView('parent-phone');
      }, 1500);
    } else {
      alert('DNI no encontrado');
    }
  };

  const handlePhoneSubmit = () => {
    if (phone.length >= 9) {
      setView('parent-code');
    }
  };

  const handleCodeSubmit = () => {
    if (code.length >= 4) {
      // Login as parent, passing the student ID
      onLogin('parent', '2');
    }
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-slate-950">
      <div className="hidden lg:block lg:w-[60%] relative overflow-hidden">
        <img 
          src={config.loginBg} 
          alt="Fondo" 
          className="w-full h-full object-cover object-bottom"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/90 via-indigo-900/60 to-transparent backdrop-blur-[2px] flex flex-col items-start justify-end p-20 text-white">
            {/* Texto eliminado por solicitud */}
        </div>
      </div>
      <div className="w-full lg:w-[40%] flex items-center justify-center p-12 bg-gray-50 dark:bg-slate-900">
        <div className="w-full max-w-lg space-y-10">
           <div className="text-center">
              {/* Logo Modo Claro */}
              <img 
                src="https://media.discordapp.net/attachments/1383264716536680462/1455043534494367827/Diseno_sin_titulo_45.png?ex=696e5124&is=696cffa4&hm=83585ffcd7a01b2e8091a34fd0aa1c3f472c1f985fe0e32e05f8ac225af32f0a&=&format=webp&quality=lossless&width=1407&height=791" 
                alt="Logo" 
                className="mx-auto h-64 mb-8 object-contain dark:hidden" 
                referrerPolicy="no-referrer"
              />
              {/* Logo Modo Oscuro (Mantiene el original) */}
              <img 
                src={config.schoolLogo} 
                alt="Logo" 
                className="mx-auto h-64 mb-8 object-contain hidden dark:block" 
                referrerPolicy="no-referrer"
              />
              
              {view === 'login' && (
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Bienvenido</h2>
              )}
              {view !== 'login' && (
                <div className="flex items-center justify-center gap-3 mb-2 relative">
                  <button onClick={() => setView('login')} className="absolute left-0 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    <ArrowLeft size={24} />
                  </button>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Vista Apoderado</h2>
                </div>
              )}
           </div>

           {view === 'login' && (
             <>
               <div className="space-y-5">
                  <div className="relative">
                    <Mail size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="text" placeholder="Correo" className="w-full pl-14 pr-6 py-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl outline-none focus:ring-4 focus:ring-blue-100 dark:text-white transition-all text-lg"/>
                  </div>
                  <div className="relative">
                    <Lock size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="password" placeholder="Clave" className="w-full pl-14 pr-6 py-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl outline-none focus:ring-4 focus:ring-blue-100 dark:text-white transition-all text-lg"/>
                  </div>
               </div>
               <div className="space-y-4">
                 <button onClick={() => onLogin('admin')} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-bold text-xl hover:bg-blue-700 shadow-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                   Ingresar <ArrowRightCircle size={28}/>
                 </button>
                 <button onClick={() => setView('parent-dni')} className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 py-6 rounded-3xl font-bold text-xl hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                   <Users size={28}/> Vista Apoderado
                 </button>
               </div>
             </>
           )}

           {view === 'parent-dni' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                  <p className="text-slate-500 dark:text-slate-400">Ingrese su DNI para verificar su identidad en la base de datos del colegio.</p>
                </div>
                {parentName ? (
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-3xl flex flex-col items-center justify-center gap-3 animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Apoderado Verificado</p>
                      <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">{parentName}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <IdCard size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input 
                        type="text" 
                        placeholder="Número de DNI" 
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        className="w-full pl-14 pr-6 py-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl outline-none focus:ring-4 focus:ring-blue-100 dark:text-white transition-all text-lg"
                      />
                    </div>
                    <button onClick={handleDniSubmit} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-bold text-xl hover:bg-blue-700 shadow-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                      Verificar DNI <ArrowRightCircle size={28}/>
                    </button>
                  </>
                )}
             </div>
           )}

           {view === 'parent-phone' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center space-y-2">
                  <p className="text-slate-500 dark:text-slate-400">Hola, <span className="font-bold text-slate-800 dark:text-slate-200">{parentName}</span>. Ingrese su número de celular para enviarle un código de seguridad por WhatsApp.</p>
                </div>
                <div className="relative">
                  <Phone size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input 
                    type="tel" 
                    placeholder="Número de Celular" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-14 pr-6 py-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl outline-none focus:ring-4 focus:ring-blue-100 dark:text-white transition-all text-lg"
                  />
                </div>
                <button onClick={handlePhoneSubmit} className="w-full bg-[#25D366] text-white py-6 rounded-3xl font-bold text-xl hover:bg-[#128C7E] shadow-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  Enviar Código <MessageSquare size={28}/>
                </button>
             </div>
           )}

           {view === 'parent-code' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center space-y-2">
                  <p className="text-slate-500 dark:text-slate-400">Hemos enviado un código por WhatsApp al <span className="font-bold text-slate-800 dark:text-slate-200">{phone}</span>.</p>
                </div>
                <div className="relative">
                  <Lock size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input 
                    type="text" 
                    placeholder="Código de 6 dígitos" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full pl-14 pr-6 py-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl outline-none focus:ring-4 focus:ring-blue-100 dark:text-white transition-all text-lg text-center tracking-widest font-mono"
                    maxLength={6}
                  />
                </div>
                <button onClick={handleCodeSubmit} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-bold text-xl hover:bg-blue-700 shadow-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  Acceder a la Vista <ArrowRightCircle size={28}/>
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
