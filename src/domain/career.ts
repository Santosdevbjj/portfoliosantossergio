export enum CareerRole {
  DATA_SPECIALIST = 'data_specialist',
  SYSTEMS_EXPERT = 'systems_expert',
  STRATEGIC_LEAD = 'strategic_lead',
}

export interface CareerExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
}
