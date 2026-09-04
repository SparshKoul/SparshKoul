import fs from 'fs';
import { format } from 'date-fns';
import * as simpleIcons from 'simple-icons';

const dayBubbleWidths = {
  Monday: 270,
  Tuesday: 275,
  Wednesday: 295,
  Thursday: 280,
  Friday: 260,
  Saturday: 280,
  Sunday: 270,
};

const customPaths = {
  java: 'M12 2a1 1 0 0 1 1 1v.5a.5.5 0 0 0 1 0V3a2 2 0 0 0-4 0v.5a.5.5 0 0 0 1 0V3a1 1 0 0 1 1-1zm-3 4a1 1 0 0 1 1 1v.5a.5.5 0 0 0 1 0V7a2 2 0 0 0-4 0v.5a.5.5 0 0 0 1 0V7a1 1 0 0 1 1-1zm6 0a1 1 0 0 1 1 1v.5a.5.5 0 0 0 1 0V7a2 2 0 0 0-4 0v.5a.5.5 0 0 0 1 0V7a1 1 0 0 1 1-1zM4 11a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-4zm15 1H5v3a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5v-3z',
  sql: 'M12 3c-4.97 0-9 1.79-9 4v10c0 2.21 4.03 4 9 4s9-1.79 9-4V7c0-2.21-4.03-4-9-4zm0 2c3.87 0 7 1.34 7 2s-3.13 2-7 2-7-1.34-7-2 3.13-2 7-2zm0 6c3.87 0 7-1.34 7-2v2.5c0 .66-3.13 2-7 2s-7-1.34-7-2V9c0 .66 3.13 2 7 2zm0 5c3.87 0 7-1.34 7-2v2.5c0 .66-3.13 2-7 2s-7-1.34-7-2V14c0 .66 3.13 2 7 2z',
  rest: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z',
  jwt: 'M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.3l7.6 3.8L12 11.9 4.4 8.1 12 4.3zM4 9.8l7 3.5v7.6l-7-3.5V9.8zm16 0v7.6l-7 3.5v-7.6l7-3.5z',
  oauth: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6a3 3 0 0 1 3 3c0 1.3-.84 2.4-2 2.82V16h-2v-3.18A3.001 3.001 0 0 1 9 10a3 3 0 0 1 3-3z',
  groq: 'M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2ZM17 13H12V17H10V11H17Z',
  windows: 'M2 3h9v9H2V3zm11 0h9v9h-9V3zM2 14h9v9H2v-9zm11 0h9v9h-9v-9z',
};

function getIconPath(key) {
  if (key.startsWith('custom:')) {
    return customPaths[key.split(':')[1]];
  }
  return simpleIcons[key] ? simpleIcons[key].path : '';
}

function generateSkillsSVG() {
  // Ordered strictly by categories: Languages -> Backend -> Frontend -> Databases -> Tools -> OS
  const allSkills = [
    // Languages
    { key: 'custom:java', name: 'Java', color: '#F89820' },
    { key: 'custom:sql', name: 'SQL', color: '#336791' },
    { key: 'siCplusplus', name: 'C++', color: '#00599C' },
    { key: 'siPython', name: 'Python', color: '#3776AB' },
    { key: 'siJavascript', name: 'JavaScript', color: '#F7DF1E' },
    
    // Backend
    { key: 'siNodedotjs', name: 'Node.js', color: '#5FA04E' },
    { key: 'siExpress', name: 'Express.js', color: '#ffffff' },
    { key: 'custom:rest', name: 'REST APIs', color: '#009688' },
    { key: 'custom:jwt', name: 'JWT', color: '#D63AFF' },
    { key: 'custom:oauth', name: 'OAuth 2.0', color: '#EA4335' },
    
    // Frontend
    { key: 'siReact', name: 'React.js', color: '#61DAFB' },
    { key: 'siNextdotjs', name: 'Next.js', color: '#ffffff' },
    { key: 'siTailwindcss', name: 'Tailwind CSS', color: '#06B6D4' },
    { key: 'siVite', name: 'Vite', color: '#9135FF' },
    { key: 'siFramer', name: 'Framer Motion', color: '#0055FF' },
    { key: 'siThreedotjs', name: 'Three.js', color: '#ffffff' },
    { key: 'siWebgl', name: 'WebGL', color: '#990000' },
    
    // Databases
    { key: 'siPostgresql', name: 'PostgreSQL', color: '#4169E1' },
    { key: 'siMysql', name: 'MySQL', color: '#4479A1' },
    { key: 'siMongodb', name: 'MongoDB', color: '#47A248' },
    
    // Tools & Platforms
    { key: 'siRazorpay', name: 'Razorpay', color: '#008CFF' },
    { key: 'siSupabase', name: 'Supabase', color: '#3FCF8E' },
    { key: 'custom:groq', name: 'Groq', color: '#F55036' },
    { key: 'siGooglegemini', name: 'Gemini API', color: '#8E75B2' },
    { key: 'siGit', name: 'Git', color: '#F03C2E' },
    { key: 'siGithub', name: 'GitHub', color: '#ffffff' },
    { key: 'siVercel', name: 'Vercel', color: '#ffffff' },
    
    // OS
    { key: 'siLinux', name: 'Linux', color: '#FCC624' },
    { key: 'custom:windows', name: 'Windows', color: '#0078D6' },
  ];

  const colsPerRow = 10;
  const cardSize = 40;
  const gapX = 8;
  const gapY = 8;
  const startX = 14;
  const startY = 158;

  let parts = [];

  allSkills.forEach((item, idx) => {
    const col = idx % colsPerRow;
    const row = Math.floor(idx / colsPerRow);
    const x = startX + col * (cardSize + gapX);
    const y = startY + row * (cardSize + gapY);
    const pathData = getIconPath(item.key);

    parts.push(`      <g transform="translate(${x}, ${y})">`);
    parts.push(`        <title>${item.name}</title>`);
    parts.push(`        <rect width="${cardSize}" height="${cardSize}" rx="10" fill="#22272e" stroke="#373e47" stroke-width="1" />`);
    parts.push(`        <g transform="translate(9, 9) scale(0.9167)">`);
    parts.push(`          <path fill="${item.color}" d="${pathData}" />`);
    parts.push(`        </g>`);
    parts.push(`      </g>`);
  });

  return parts.join('\n');
}

async function run() {
  const todayDay = format(new Date(), 'EEEE');
  const bubbleWidth = dayBubbleWidths[todayDay] || 280;

  let template = fs.readFileSync('template.svg', 'utf8');

  const skillsSVG = generateSkillsSVG();
  template = template.replace(
    '<g id="skills-badge-grid">\n      <!-- Skill badges injected here at build time -->\n    </g>',
    `<g id="skills-badge-grid">\n${skillsSVG}\n    </g>`
  );

  // Replace weekday placeholders & adjust bubble width
  let output = template
    .replace(/Have a great \w+!/g, `Have a great ${todayDay}!`)
    .replace(/\{todayDay\}/g, todayDay)
    .replace(
      /<rect width="\d+" height="42" rx="18" class="bubble" id="msg-6-bubble" \/>/,
      `<rect width="${bubbleWidth}" height="42" rx="18" class="bubble" id="msg-6-bubble" />`
    );

  fs.writeFileSync('chat.svg', output, 'utf8');
  console.log(`Successfully updated chat.svg with categorized skills order for ${todayDay}`);
}

run();
