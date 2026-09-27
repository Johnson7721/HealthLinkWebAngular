import type { CreateConsultationRequest } from "../../../shared/models/create-consultation-request.model";

export class LoadConsultations {
  static readonly type = "[Consultations] Load";
}

export class BookConsultation {
  static readonly type = "[Consultations] Book";
  constructor(public readonly request: CreateConsultationRequest) {}
}

export class ResetBookingStatus {
  static readonly type = "[Consultations] Reset Booking Status";
}
