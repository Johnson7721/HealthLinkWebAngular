export type ConsultationType = 'Chat' | 'Video';
export type ConsultationStatus = 'Scheduled' | 'Completed';

export interface Consultation {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  consultationType: ConsultationType;
  preferredDateTime: string;
  reasonForVisit: string;
  status: ConsultationStatus;
  patientId: string;
}
