const fs = require('fs');

const file = 'modules/UsersModule.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<table className="w-full text-left border-collapse">',
  '<table className="w-full text-left border-collapse table-fixed min-w-[800px]">'
);

content = content.replace(
  '<th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Usuario</th>',
  '<th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-[40%]">Usuario</th>'
);

content = content.replace(
  '<th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">\n                         <div className="flex items-center gap-2">\n                           <HierarchicalDropdownFilter',
  '<th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-[25%]">\n                         <div className="flex items-center gap-2">\n                           <HierarchicalDropdownFilter'
);

content = content.replace(
  '<th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">\n                         <div className="flex items-center gap-2">\n                           <DropdownFilter',
  '<th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-[20%]">\n                         <div className="flex items-center gap-2">\n                           <DropdownFilter'
);

content = content.replace(
  '<th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">Acciones</th>',
  '<th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right w-[15%]">Acciones</th>'
);

fs.writeFileSync(file, content);
console.log('Updated table widths');
