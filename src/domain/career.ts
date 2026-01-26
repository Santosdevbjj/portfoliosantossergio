/**
 * DOMAIN: Career
 * -----------------------------------------------------------------------------
 * Fonte Única de Verdade (SSOT) para o posicionamento profissional.
 * Define como sua senioridade e especialidades são estruturadas.
 */

/* -------------------------------------------------------------------------- */
/* CAREER ROLES / LEVELS                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Representa os pilares da sua atuação profissional.
 * Essas chaves devem ser refletidas nos dicionários para tradução.
 */
export enum CareerRole {
  DATA_SPECIALIST = 'data_specialist',   // Foco em Ciência/Engenharia de Dados
  SYSTEMS_EXPERT = 'systems_expert',     // Foco em Missão Crítica/Legado
  STRATEGIC_LEAD = 'strategic_lead',      // Foco em Governança/Tomada de Decisão
}

/* -------------------------------------------------------------------------- */
/* CANONICAL ORDER                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Ordem de prioridade para exibição de competências e SEO.
 */
export const CAREER_ROLE_ORDER: readonly CareerRole[] = [
  CareerRole.DATA_SPECIALIST,
  CareerRole.SYSTEMS_EXPERT,
  CareerRole.STRATEGIC_LEAD,
] as const;

/* -------------------------------------------------------------------------- */
/* DOMAIN MODELS                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Interface para os itens de experiência profissional (Career Path).
 * Garante que cada entrada de trabalho tenha os campos necessários para 
 * exibir os "Resultados" (Regra de Mariana Torres).
 */
export interface CareerExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[]; // Lista de resultados mensuráveis
}

/**
 * Contrato para dicionários de carreira.
 * Permite que cada papel tenha um título e um CTA personalizado.
 */
export type CareerDictionary = {
  roles: Record<CareerRole, {
    title: string;
    description: string;
  }>;
  cta: string;
};

/* -------------------------------------------------------------------------- */
/* HELPERS & VALIDATION                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Type guard para validar papéis de carreira.
 */
export const isCareerRole = (value: unknown): value is CareerRole =>
  typeof value === 'string' &&
  (Object.values(CareerRole) as string[]).includes(value);

/**
 * Retorna o papel seguro com fallback para o perfil principal (Dados).
 */
export const getSafeCareerRole = (
  role: unknown,
  fallback: CareerRole = CareerRole.DATA_SPECIALIST,
): CareerRole => (isCareerRole(role) ? role : fallback);
