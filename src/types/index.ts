export type UserRole = 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  rating?: number;
  totalServices?: number;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export type PropertyType = 'APARTMENT' | 'HOUSE' | 'COMMERCIAL';
export type CleaningLevel = 'LIGHT' | 'MEDIUM' | 'HEAVY';

export interface ServiceDetails {
  propertyType: PropertyType;
  size: number; // m2
  rooms: number;
  bathrooms: number;
  cleaningLevel: CleaningLevel;
  hasPets: boolean;
  hasOutdoorArea: boolean;
  observations?: string;
  additionalServices: string[]; // 'washing', 'ironing', 'cooking', 'heavy', 'post_construction'
}

export type ServiceStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ServiceRequest {
  id: string;
  clientId: string;
  professionalId?: string;
  details: ServiceDetails;
  address: Address;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number; // hours
  estimatedValue: number; // BRL
  status: ServiceStatus;
  createdAt: string;
  checklist?: { item: string; completed: boolean }[];
  photos?: { before?: string; after?: string };
}

export interface Review {
  id: string;
  serviceId: string;
  fromId: string;
  toId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProfessionalProfile extends User {
  role: 'PROFESSIONAL';
  bio: string;
  specialties: string[];
  basePricePerHour: number;
  completedJobs: number;
  joinedAt: string;
  location: string; // Neighborhood/City
}
