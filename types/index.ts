export type Locale = 'tr' | 'en' | 'ru';

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  is_active: boolean;
}
