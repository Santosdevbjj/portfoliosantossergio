export type CareerLevel = 'lead' | 'staff' | 'principal';

export const careerCopy = {
  lead: {
    cta: {
      pt: 'Vamos liderar times e arquitetura',
      en: 'Let’s lead teams and architecture',
      es: 'Lideremos equipos y arquitectura',
    },
  },
  staff: {
    cta: {
      pt: 'Vamos escalar sistemas e decisões',
      en: 'Let’s scale systems and decisions',
      es: 'Escalemos sistemas y decisiones',
    },
  },
  principal: {
    cta: {
      pt: 'Vamos definir estratégia técnica',
      en: 'Let’s define technical strategy',
      es: 'Definamos estrategia técnica',
    },
  },
} satisfies Record<CareerLevel, any>;
