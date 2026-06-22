export type RestaurantTable = {
  id: string;
  slug: string;
  label: string;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance';
  qrActive?: boolean;
  isActive?: boolean;
};

