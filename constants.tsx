
import { ServiceItem, ProjectItem } from './types';

export const SERVICES: ServiceItem[] = [
  {
    id: 'automation',
    title: 'מערכות אוטונומיות',
    description: 'בניית זרימות עבודה ב-Make שמחברות את המייל, ה-CRM והנהלת החשבונות למכונה אחת משומנת.',
    icon: 'fa-microchip',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'ai',
    title: 'בינה מלאכולית יוצרת',
    description: 'הטמעת LLMs לניתוח מסמכים אוטומטי, סיכום שיחות ויצירת תוכן מותאם אישית לכל לקוח.',
    icon: 'fa-brain-circuit',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'api',
    title: 'צ׳אטבוטים מתקדמים',
    description: 'פיתוח סוכני שיחה מבוססי ידע ארגוני שנותנים מענה אנושי ומדויק 24/7 בוואטסאפ ובאתר.',
    icon: 'fa-comments-dots',
    color: 'from-purple-500 to-pink-500'
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    title: 'AI Blueprint Generator',
    category: 'Real-Time Strategy',
    image: 'https://images.unsplash.com/photo-1518186239717-2e9b136758e5?auto=format&fit=crop&q=80&w=1200',
    link: 'ai-audit'
  },
  {
    title: 'סוכן AI לניהול יומנים',
    category: 'AI Agents',
    image: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=800',
    link: 'https://form.fillout.com/t/hxPcTnn2CVus'
  },
  {
    title: 'אוטומציית גבייה וחשבוניות',
    category: 'FinTech Automation',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    link: 'https://form.fillout.com/t/3SJjK1C6dUus'
  },
  {
    title: 'דשבורד ניתוח נתונים חכם',
    category: 'Data Science',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    link: 'https://form.fillout.com/t/rfV33PGun3us'
  }
];
