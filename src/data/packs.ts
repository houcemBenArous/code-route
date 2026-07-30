import type { Question } from './questions';

export interface Pack {
  id:       string;
  name:     string;
  icon:     string;
  desc:     string;
  filter:   (q: Question) => boolean;
  limit:    number | null;
  featured?: boolean;
}

export const PACKS: Pack[] = [
  { id: 'all',        name: 'الحزمة الكاملة',           icon: '📚', desc: 'جميع الأسئلة من كل المحاور',                    filter: () => true,                                                                                         limit: null, featured: true },
  { id: 'random30',   name: '30 سؤال عشوائي',            icon: '🎲', desc: '30 سؤالاً مختلطاً من جميع المحاور',             filter: () => true,                                                                                         limit: 30 },
  { id: 'violations', name: 'المخالفات والعقوبات',       icon: '⚖️', desc: 'خصم النقاط، الغرامات، السجن',                  filter: q => q.cat === 'المخالفات',                                                                         limit: null },
  { id: 'mechanics',  name: 'الميكانيك والصيانة',        icon: '🔧', desc: 'البطارية، العجلات، الزيوت، الشمعات',            filter: q => q.cat === 'الميكانيك',                                                                         limit: null },
  { id: 'firstaid',   name: 'الإسعافات الأولية',         icon: '🚑', desc: 'التنفس الاصطناعي، النزيف، أرقام الطوارئ',      filter: q => q.cat === 'الإسعافات الأولية',                                                                 limit: null },
  { id: 'speed',      name: 'السرعة والمطر',              icon: '🚦', desc: 'حدود السرعة، مسافة التوقف والأمان، المطر',      filter: q => ['السرعة','المطر والأمان','مسافة التوقف والأمان'].includes(q.cat),                            limit: null },
  { id: 'parking',    name: 'الوقوف والتوقف',             icon: '🅿️', desc: 'المسافات، ألوان الأرصفة، الوقوف المفرط',       filter: q => q.cat === 'الوقوف والتوقف',                                                                    limit: null },
  { id: 'lights',     name: 'الأضواء',                    icon: '💡', desc: 'ضوء الطريق، المقاطعة، الوضعية',                filter: q => q.cat === 'الأضواء',                                                                           limit: null },
  { id: 'overtaking', name: 'المجاوزة وإشارات الطريق',   icon: '🛣️', desc: 'قواعد المجاوزة، الأولويات، الإشارات',          filter: q => q.cat === 'المجاوزة' || q.cat === 'إشارات الطريق',                                             limit: null },
  { id: 'license',    name: 'رخصة صنف ب وتجديدها',       icon: '🪪', desc: 'شروط الرخصة، الفحص الفني، التجديد',            filter: q => ['رخصة صنف ب','الفحص الفني','تجديد الرخصة'].includes(q.cat),                                  limit: null },
  { id: 'load',       name: 'الحمولة',                    icon: '📦', desc: 'قواعد الحمولة الأمامية والخلفية',               filter: q => q.cat === 'الحمولة',                                                                           limit: null },
];
