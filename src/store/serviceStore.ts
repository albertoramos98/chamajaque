import { create } from 'zustand';
import { ServiceRequest, ServiceDetails, ServiceStatus, Address } from '@/types';
import { createClient } from '@/lib/supabase';

interface ServiceState {
  requests: ServiceRequest[];
  isLoading: boolean;
  addRequest: (details: ServiceDetails, address: Address, scheduledDate: string, scheduledTime: string, clientId: string) => Promise<string | null>;
  updateStatus: (id: string, status: ServiceStatus) => Promise<void>;
  assignProfessional: (id: string, professionalId: string) => Promise<void>;
  fetchRequestsByClient: (clientId: string) => Promise<void>;
  fetchAvailableRequests: () => Promise<void>;
  fetchRequestById: (id: string) => Promise<ServiceRequest | null>;
}

// Lógica de cálculo de preço e tempo (Mantida igual, pois é lógica de negócio)
export const calculateServiceEstimate = (details: ServiceDetails) => {
  let baseHours = details.size / 30;
  baseHours += details.rooms * 0.5;
  baseHours += details.bathrooms * 0.7;

  const multiplier = {
    LIGHT: 1,
    MEDIUM: 1.3,
    HEAVY: 1.8,
  }[details.cleaningLevel];

  let estimatedDuration = baseHours * multiplier;
  estimatedDuration += details.additionalServices.length * 1;

  const baseRate = 35;
  const estimatedValue = Math.round(estimatedDuration * baseRate);

  return {
    duration: Math.max(2, Math.round(estimatedDuration)),
    value: Math.max(100, estimatedValue),
  };
};

export const useServiceStore = create<ServiceState>((set, get) => ({
  requests: [],
  isLoading: false,

  addRequest: async (details, address, scheduledDate, scheduledTime, clientId) => {
    const { duration, value } = calculateServiceEstimate(details);
    const supabase = createClient();

    const { data, error } = await supabase
      .from('service_requests')
      .insert([
        {
          client_id: clientId,
          property_type: details.propertyType,
          size: details.size,
          rooms: details.rooms,
          bathrooms: details.bathrooms,
          cleaning_level: details.cleaningLevel,
          has_pets: details.hasPets,
          has_outdoor_area: details.hasOutdoorArea,
          additional_services: details.additionalServices,
          observations: details.observations,
          address_street: address.street,
          address_number: address.number,
          address_complement: address.complement,
          address_neighborhood: address.neighborhood,
          address_city: address.city,
          address_state: address.state,
          address_zip_code: address.zipCode,
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          estimated_duration: duration,
          estimated_value: value,
          status: 'PENDING',
          checklist: [
            { item: 'Limpeza de banheiros', completed: false },
            { item: 'Limpeza de cozinha', completed: false },
            { item: 'Aspiração/Varredura de pisos', completed: false },
            { item: 'Pano úmido no chão', completed: false },
            { item: 'Retirada de pó de superfícies', completed: false },
          ],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding request:', error);
      return null;
    }

    return data.id;
  },

  updateStatus: async (id, status) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('service_requests')
      .update({ status })
      .eq('id', id);

    if (!error) {
      set((state) => ({
        requests: state.requests.map((r) => (r.id === id ? { ...r, status } : r)),
      }));
    }
  },

  assignProfessional: async (id, professionalId) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('service_requests')
      .update({ professional_id: professionalId, status: 'ACCEPTED' })
      .eq('id', id);

    if (!error) {
      set((state) => ({
        requests: state.requests.map((r) =>
          r.id === id ? { ...r, professionalId, status: 'ACCEPTED' } : r
        ),
      }));
    }
  },

  fetchRequestsByClient: async (clientId) => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Map database fields back to our frontend type if necessary
      const mapped = data.map(mapDbToRequest);
      set({ requests: mapped, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  fetchAvailableRequests: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .is('professional_id', null)
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mapped = data.map(mapDbToRequest);
      set({ requests: mapped, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  fetchRequestById: async (id) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (data && !error) {
      return mapDbToRequest(data);
    }
    return null;
  },
}));

// Helper to map DB snake_case to Frontend camelCase
function mapDbToRequest(db: any): ServiceRequest {
  return {
    id: db.id,
    clientId: db.client_id,
    professionalId: db.professional_id,
    details: {
      propertyType: db.property_type,
      size: db.size,
      rooms: db.rooms,
      bathrooms: db.bathrooms,
      cleaningLevel: db.cleaning_level,
      hasPets: db.has_pets,
      hasOutdoorArea: db.has_outdoor_area,
      additionalServices: db.additional_services,
      observations: db.observations,
    },
    address: {
      street: db.address_street,
      number: db.address_number,
      complement: db.address_complement,
      neighborhood: db.address_neighborhood,
      city: db.address_city,
      state: db.address_state,
      zipCode: db.address_zip_code,
    },
    scheduledDate: db.scheduled_date,
    scheduledTime: db.scheduled_time,
    estimatedDuration: db.estimated_duration,
    estimatedValue: db.estimated_value,
    status: db.status,
    createdAt: db.created_at,
    checklist: db.checklist,
  };
}
