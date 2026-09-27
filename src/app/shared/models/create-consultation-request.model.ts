import type { ConsultationType } from './consultation.model';

export interface CreateConsultationRequest {
  doctorId: string;
  consultationType: ConsultationType;
  preferredDateTime: string;
  reasonForVisit: string;
}
