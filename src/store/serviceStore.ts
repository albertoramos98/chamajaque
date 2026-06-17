import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ServiceRequest, ServiceDetails, ServiceStatus, Address } from '@/types';

interface ServiceState {
  requests: ServiceRequest[];
  addRequest: (details: ServiceDetails, address: Address, scheduledDate: string, scheduledTime: string) => string;
  updateStatus: (id: string, status: ServiceStatus) => void;
  assignProfessional: (id: string, professionalId: string) => void;
  getRequestsByClient: (clientId: string) => ServiceRequest[];
  getRequestsByProfessional: (professionalId: string) => ServiceRequest[];
  getRequestById: (id: string) => ServiceRequest | undefined;
}

// Lógica de cálculo de preço e tempo
export const calculateServiceEstimate = (details: ServiceDetails) => {
  let baseHours = details.size / 30; // 1 hora a cada 30m2
  baseHours += details.rooms * 0.5; // +30 min por quarto
  baseHours += details.bathrooms * 0.7; // +42 min por banheiro

  const multiplier = {
    LIGHT: 1,
    MEDIUM: 1.3,
    HEAVY: 1.8,
  }[details.cleaningLevel];

  let estimatedDuration = baseHours * multiplier;
  
  // Adicionais
  estimatedDuration += details.additionalServices.length * 1; // +1h por adicional

  const baseRate = 35; // R$35 por hora
  const estimatedValue = Math.round(estimatedDuration * baseRate);

  return {
    duration: Math.max(2, Math.round(estimatedDuration)), // Mínimo 2h
    value: Math.max(100, estimatedValue), // Mínimo R$100
  };
};

export const useServiceStore = create<ServiceState>()(
  persist(
    (set, get) => ({
      requests: [],
      addRequest: (details, address, scheduledDate, scheduledTime) => {
        const { duration, value } = calculateServiceEstimate(details);
        const id = Math.random().toString(36).substring(7);
        const newRequest: ServiceRequest = {
          id,
          clientId: 'client-1', // Mock logado
          details,
          address,
          scheduledDate,
          scheduledTime,
          estimatedDuration: duration,
          estimatedValue: value,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          checklist: [
            { item: 'Limpeza de banheiros', completed: false },
            { item: 'Limpeza de cozinha', completed: false },
            { item: 'Aspiração/Varredura de pisos', completed: false },
            { item: 'Pano úmido no chão', completed: false },
            { item: 'Retirada de pó de superfícies', completed: false },
          ],
        };
        set((state) => ({ requests: [...state.requests, newRequest] }));
        return id;
      },
      updateStatus: (id, status) => {
        set((state) => ({
          requests: state.requests.map((r) => (r.id === id ? { ...r, status } : r)),
        }));
      },
      assignProfessional: (id, professionalId) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id ? { ...r, professionalId, status: 'ACCEPTED' } : r
          ),
        }));
      },
      getRequestsByClient: (clientId) => get().requests.filter((r) => r.clientId === clientId),
      getRequestsByProfessional: (professionalId) =>
        get().requests.filter((r) => r.professionalId === professionalId),
      getRequestById: (id) => get().requests.find((r) => r.id === id),
    }),
    {
      name: 'chama-jaque-services',
    }
  )
);
