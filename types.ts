export enum Currency {
  COP = 'COP',
  USD = 'USD',
}

export enum RequirementStatus {
  YES = 'Sí',
  NO = 'No',
  PARTIALLY = 'Parcialmente',
}

export enum CallStatus {
  OPEN = 'Abierta',
  CLOSED = 'Cerrada',
  EVALUATING = 'En evaluación',
}

export enum USMStatus {
  PENDING = 'Pendiente de aplicar',
  APPLIED = 'Aplicada',
  REJECTED = 'Rechazada',
  APPROVED = 'Aprobada',
  NOT_APPLYING = 'No se aplica',
}

export enum Order {
  LOCAL = 'Local',
  NATIONAL = 'Nacional',
  INTERNATIONAL = 'Internacional',
}

export enum GrantType {
  SUBVENCION = 'Subvención',
  PREMIO = 'Premio',
  BECA = 'Beca',
  CONTRATO = 'Contrato',
  CONCURSO = 'Concurso',
  OTRO = 'Otro',
}

export interface Grant {
  id: string;
  name: string;
  entity: string;
  order: Order;
  type: GrantType;
  sector: string;
  components: string;
  amount: number;
  currency: Currency;
  meetsRequirements: RequirementStatus;
  missingRequirements: string;
  deadline: string;
  link: string;
  callStatus: CallStatus;
  usmStatus: USMStatus;
}

export type GrantFormData = Omit<Grant, 'id'>;