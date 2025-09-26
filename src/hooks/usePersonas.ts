import { useQuery } from '@tanstack/react-query';
import { personaApi, mediaApi } from '../services/api';
import { Persona, PersonaDetail } from '../types';

export const usePersonas = () => {
  return useQuery<Persona[], Error>({
    queryKey: ['personas'],
    queryFn: personaApi.getPersonas,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
};

export const usePersona = (personaId: string) => {
  return useQuery<PersonaDetail, Error>({
    queryKey: ['persona', personaId],
    queryFn: () => personaApi.getPersona(personaId),
    enabled: !!personaId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

export const usePersonaMedia = (personaId: string) => {
  return useQuery({
    queryKey: ['persona', personaId, 'media'],
    queryFn: () => mediaApi.getPersonaMedia(personaId),
    enabled: !!personaId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false
  });
};

