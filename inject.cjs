const fs = require('fs');
const file = './modules/ClassroomsModule.tsx';

let content = fs.readFileSync(file, 'utf8');

const regexComponent = /          <div className="grid grid-cols-1 gap-4">[\s\S]*?<\/AnimatePresence>\n    <\/div>\n  \);\n\};/m;

const replacementBody = `            {activeTab === 'General' ? (
              <div className="grid grid-cols-1 gap-4">
                {studentsWithGeneralIncidents.map(student => (
                  <div key={student.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <div className="flex items-center gap-4">
                        <div className={\`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm \${student.avatarColor}\`}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{student.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                              <AlertTriangle className="w-3 h-3 inline mr-1" />
                              {student.incidentCount} INCIDENCIAS ACUMULADAS
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        {citados.includes(student.id) ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-bold px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                            <CheckCircle2 className="w-4 h-4" /> Citado
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleCitar(student.id)}
                            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            <Mail className="w-4 h-4" />
                            Citar Apoderado
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="text-blue-500 w-5 h-5" />
                  Citación por Rendimiento Académico
                </h3>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Seleccione Estudiante</label>
                  <select 
                    value={selectedStudentForAcademic}
                    onChange={e => setSelectedStudentForAcademic(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Seleccionar --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.dni})</option>
                    ))}
                  </select>
                </div>

                {selectedAcademicStudent && (
                  <div className="mt-4 border-t border-slate-100 dark:border-slate-700 pt-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-5 mb-6 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-1">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">Notificación Académica Automática</h4>
                        <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">
                          Se citará al apoderado de <strong className="font-black text-blue-700 dark:text-blue-400">{selectedAcademicStudent.name}</strong> por <strong>bajo rendimiento escolar</strong> en los últimos cursos.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      {citados.includes(selectedAcademicStudent.id + '-academico') ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-bold px-5 py-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                          <CheckCircle2 className="w-5 h-5" /> Notificación Enviada
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleCitar(selectedAcademicStudent.id + '-academico')}
                          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20"
                        >
                          <Mail className="w-5 h-5" />
                          Generar y Notificar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};`;

const match = content.match(regexComponent);

if (match) {
  const newContent = content.substring(0, match.index) + replacementBody + content.substring(match.index + match[0].length);
  fs.writeFileSync(file, newContent);
  console.log('Replaced component UI successfully');
} else {
  console.error('Pattern not found');
  process.exit(1);
}
