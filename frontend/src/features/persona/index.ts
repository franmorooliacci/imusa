export { default as SearchPersona } from './components/SearchPersona';
export { default as Responsable } from './components/Responsable';
export type { Persona, PersonaDTO, Domicilio, DomicilioDTO } from './types';
export { createEmptyPersona, createEmptyPersonaDTO,createEmptyDomicilio, domicilioToString } from './utils';
export { getResponsableById } from './api';