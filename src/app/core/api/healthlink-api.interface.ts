import type { Observable } from "rxjs";
import type { Consultation } from "../../shared/models/consultation.model";
import type { CreateConsultationRequest } from "../../shared/models/create-consultation-request.model";
import type {
  DoctorPage,
  DoctorQuery,
} from "../../shared/models/doctor-query.model";

export interface HealthLinkApi {
  getDoctors(query: DoctorQuery): Observable<DoctorPage>;

  getConsultations(): Observable<Consultation[]>;

  createConsultation(
    bookingRequest: CreateConsultationRequest,
  ): Observable<Consultation>;
}
