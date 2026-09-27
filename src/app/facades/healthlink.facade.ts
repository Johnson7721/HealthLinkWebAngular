import { inject, Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { tap, type Observable } from "rxjs";
import type { Consultation } from "../shared/models/consultation.model";
import type { CreateConsultationRequest } from "../shared/models/create-consultation-request.model";
import type { Doctor } from "../shared/models/doctor.model";
import type { DoctorFilters } from "../shared/models/doctor-query.model";
import type { PagingInfo } from "../shared/models/paging.model";
import {
  BookConsultation,
  LoadConsultations,
  ResetBookingStatus,
} from "../features/consultations/state/consultations.actions";
import { ConsultationsState } from "../features/consultations/state/consultations.state";
import {
  LoadDoctors,
  SelectDoctor,
  SetDoctorFilters,
  SetDoctorPage,
  SetDoctorPageSize,
} from "../features/doctors/state/doctors.actions";
import { DoctorsState } from "../features/doctors/state/doctors.state";
import type { BookingStatus } from "../features/consultations/models/booking-status.model";

@Injectable({ providedIn: "root" })
export class HealthLinkFacade {
  private readonly store = inject(Store);

  readonly doctors$: Observable<Doctor[]> = this.store.select(
    DoctorsState.items,
  );
  readonly specialties$: Observable<string[]> = this.store.select(
    DoctorsState.specialties,
  );
  readonly doctorPaging$: Observable<PagingInfo> = this.store.select(
    DoctorsState.paging,
  );
  readonly doctorFilters$: Observable<DoctorFilters> = this.store.select(
    DoctorsState.filters,
  );
  readonly doctorsLoading$: Observable<boolean> = this.store.select(
    DoctorsState.loading,
  );
  readonly doctorsError$: Observable<string> = this.store.select(
    DoctorsState.error,
  );
  readonly hasActiveDoctorFilters$: Observable<boolean> = this.store.select(
    DoctorsState.hasActiveFilters,
  );
  readonly selectedDoctorId$: Observable<string> = this.store.select(
    DoctorsState.selectedDoctorId,
  );
  readonly selectedDoctor$: Observable<Doctor | undefined> = this.store.select(
    DoctorsState.selectedDoctor,
  );

  readonly consultations$: Observable<Consultation[]> = this.store.select(
    ConsultationsState.items,
  );
  readonly scheduledConsultations$: Observable<Consultation[]> =
    this.store.select(ConsultationsState.scheduled);
  readonly pastConsultations$: Observable<Consultation[]> = this.store.select(
    ConsultationsState.past,
  );
  readonly consultationsLoading$: Observable<boolean> = this.store.select(
    ConsultationsState.loading,
  );
  readonly consultationsError$: Observable<string> = this.store.select(
    ConsultationsState.error,
  );
  readonly bookingStatus$: Observable<BookingStatus> = this.store.select(
    ConsultationsState.bookingStatus,
  );
  readonly bookingMessage$: Observable<string> = this.store.select(
    ConsultationsState.bookingMessage,
  );

  loadDoctors(): void {
    this.store.dispatch(new LoadDoctors());
  }

  loadConsultations(): void {
    this.store.dispatch(new LoadConsultations());
  }

  setDoctorFilters(filters: Partial<DoctorFilters>): void {
    this.store.dispatch(new SetDoctorFilters(filters));
  }

  setDoctorPage(page: number): void {
    this.store.dispatch(new SetDoctorPage(page));
  }

  setDoctorPageSize(pageSize: number): void {
    this.store.dispatch(new SetDoctorPageSize(pageSize));
  }

  selectDoctor(doctorId: string): void {
    this.store.dispatch(new SelectDoctor(doctorId));
  }

  bookConsultation(request: CreateConsultationRequest): Observable<void> {
    return this.store
      .dispatch(new BookConsultation(request))
      .pipe(tap(() => this.store.dispatch(new LoadDoctors())));
  }

  resetBookingStatus(): void {
    this.store.dispatch(new ResetBookingStatus());
  }
}
