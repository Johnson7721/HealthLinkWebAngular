import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { API_BASE_URL, API_ENDPOINTS } from "./api.constants";
import type { HealthLinkApi } from "./healthlink-api.interface";
import type { Consultation } from "../../shared/models/consultation.model";
import type { CreateConsultationRequest } from "../../shared/models/create-consultation-request.model";
import type {
  DoctorPage,
  DoctorQuery,
} from "../../shared/models/doctor-query.model";

@Injectable({ providedIn: "root" })
export class HealthLinkApiService implements HealthLinkApi {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getDoctors(query: DoctorQuery): Observable<DoctorPage> {
    let params = new HttpParams()
      .set("page", query.page)
      .set("pageSize", query.pageSize);
    if (query.search.trim()) {
      params = params.set("search", query.search.trim());
    }
    if (query.specialty) {
      params = params.set("specialty", query.specialty);
    }
    return this.http.get<DoctorPage>(
      `${this.apiBaseUrl}${API_ENDPOINTS.doctors}`,
      { params },
    );
  }

  getConsultations(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(
      `${this.apiBaseUrl}${API_ENDPOINTS.consultations}`,
    );
  }

  createConsultation(
    bookingRequest: CreateConsultationRequest,
  ): Observable<Consultation> {
    return this.http.post<Consultation>(
      `${this.apiBaseUrl}${API_ENDPOINTS.consultations}`,
      bookingRequest,
    );
  }
}
