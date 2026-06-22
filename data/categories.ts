import { type Locale } from '@/i18n';

export type Category = {
  id: string;
  slug: string;
  name: Record<Locale, string>;
  description?: Record<Locale, string>;
  isActive: boolean;
  isFeatured?: boolean;
};

export const categories: Category[] = [
  {
    id: '1',
    slug: 'starters',
    name: {
      tr: 'Başlangıçlar',
      en: 'Starters',
      ru: 'Закуски',
    },
    description: {
      tr: 'Lezzetli başlangıç tabakları.',
      en: 'Delicious starter plates.',
      ru: 'Вкусные закуски.',
    },
    isActive: true,
  },
  {
    id: '2',
    slug: 'salads',
    name: {
      tr: 'Salatalar',
      en: 'Salads',
      ru: 'Салаты',
    },
    description: {
      tr: 'Taze ve hafif salata seçenekleri.',
      en: 'Fresh and light salad options.',
      ru: 'Свежие и легкие салаты.',
    },
    isActive: true,
  },
  {
    id: '3',
    slug: 'mains',
    name: {
      tr: 'Ana Yemekler',
      en: 'Main Courses',
      ru: 'Основные блюда',
    },
    description: {
      tr: 'Özenle hazırlanan ana yemekler.',
      en: 'Carefully prepared main courses.',
      ru: 'Основные блюда, приготовленные с заботой.',
    },
    isActive: true,
  },
  {
    id: '4',
    slug: 'burgers',
    name: {
      tr: 'Burgerler',
      en: 'Burgers',
      ru: 'Бургеры',
    },
    description: {
      tr: 'Özel soslarla hazırlanan burgerler.',
      en: 'Burgers prepared with special sauces.',
      ru: 'Бургеры с фирменными соусами.',
    },
    isActive: true,
  },
  {
    id: '5',
    slug: 'pasta',
    name: {
      tr: 'Makarnalar',
      en: 'Pasta',
      ru: 'Паста',
    },
    description: {
      tr: 'Klasik ve modern makarna lezzetleri.',
      en: 'Classic and modern pasta flavors.',
      ru: 'Классические и современные блюда из пасты.',
    },
    isActive: true,
  },
  {
    id: '6',
    slug: 'desserts',
    name: {
      tr: 'Tatlılar',
      en: 'Desserts',
      ru: 'Десерты',
    },
    description: {
      tr: 'Günün tatlı ve özel lezzetleri.',
      en: 'Sweet and special flavors of the day.',
      ru: 'Сладкие и особенные десерты дня.',
    },
    isActive: true,
  },
  {
    id: '7',
    slug: 'drinks',
    name: {
      tr: 'İçecekler',
      en: 'Drinks',
      ru: 'Напитки',
    },
    description: {
      tr: 'Sıcak, soğuk ve özel içecekler.',
      en: 'Hot, cold and signature drinks.',
      ru: 'Горячие, холодные и фирменные напитки.',
    },
    isActive: true,
  },
];