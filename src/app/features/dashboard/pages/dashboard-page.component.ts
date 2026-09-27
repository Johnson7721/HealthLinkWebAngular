import { AsyncPipe, DatePipe } from "@angular/common";
import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  type Observable,
} from "rxjs";
import { ConsultationCardComponent } from "../../consultations/components/consultation-card/consultation-card.component";
import type { BookingStatus } from "../../consultations/models/booking-status.model";
import {
  BOOKING_REASON_MAX_LENGTH,
  BOOKING_REASON_MIN_LENGTH,
} from "../../../shared/constants/booking.constants";
import { MESSAGES } from "../../../shared/messages/app.messages";
import type {
  Consultation,
  ConsultationType,
} from "../../../shared/models/consultation.model";
import type { CreateConsultationRequest } from "../../../shared/models/create-consultation-request.model";
import type { Doctor } from "../../../shared/models/doctor.model";
import type { DoctorFilters } from "../../../shared/models/doctor-query.model";
import type { PagingInfo } from "../../../shared/models/paging.model";
import { HealthLinkFacade } from "../../../facades/healthlink.facade";
import { DoctorCardComponent } from "../../doctors/components/doctor-card/doctor-card.component";
import { SearchFilterComponent } from "../../doctors/components/search-filter/search-filter.component";
import { PAGE_SIZE_OPTIONS } from "../../../shared/constants/paging.constants";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

interface DashboardViewModel {
  doctors: Doctor[];
  specialties: string[];
  paging: PagingInfo;
  filters: DoctorFilters;
  hasActiveFilters: boolean;
  doctorsLoading: boolean;
  selectedDoctorId: string;
  selectedDoctor: Doctor | undefined;
  scheduled: Consultation[];
  past: Consultation[];
  consultationsLoading: boolean;
  hasConsultations: boolean;
  pageLoadError: string;
  bookingStatus: BookingStatus;
  bookingMessage: string;
}

@Component({
  selector: "app-dashboard-page",
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    FormsModule,
    DoctorCardComponent,
    ConsultationCardComponent,
    PaginationComponent,
    SearchFilterComponent,
  ],
  templateUrl: "./dashboard-page.component.html",
  styleUrl: "./dashboard-page.component.scss",
})
export class DashboardPageComponent implements OnInit {
  private readonly facade = inject(HealthLinkFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly messages = MESSAGES;
  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  readonly reasonMaxLength = BOOKING_REASON_MAX_LENGTH;
  readonly reasonMinLength = BOOKING_REASON_MIN_LENGTH;

  readonly vm$: Observable<DashboardViewModel> = combineLatest({
    doctors: this.facade.doctors$,
    specialties: this.facade.specialties$,
    paging: this.facade.doctorPaging$,
    filters: this.facade.doctorFilters$,
    hasActiveFilters: this.facade.hasActiveDoctorFilters$,
    doctorsLoading: this.facade.doctorsLoading$,
    doctorsError: this.facade.doctorsError$,
    selectedDoctorId: this.facade.selectedDoctorId$,
    selectedDoctor: this.facade.selectedDoctor$,
    scheduled: this.facade.scheduledConsultations$,
    past: this.facade.pastConsultations$,
    consultations: this.facade.consultations$,
    consultationsLoading: this.facade.consultationsLoading$,
    consultationsError: this.facade.consultationsError$,
    bookingStatus: this.facade.bookingStatus$,
    bookingMessage: this.facade.bookingMessage$,
  }).pipe(
    map((state) => ({
      ...state,
      hasConsultations: state.consultations.length > 0,
      pageLoadError: state.doctorsError || state.consultationsError,
    })),
  );

  consultationType: ConsultationType = "Chat";
  preferredDateTime = "";
  reasonForVisit = "";
  bookingOpen = false;
  bookingFormError = "";

  ngOnInit(): void {
    this.facade.loadDoctors();
    this.facade.loadConsultations();

    this.facade.selectedDoctor$
      .pipe(
        map((doctor) => doctor?.availableSlots ?? []),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((slots) => {
        if (!slots.includes(this.preferredDateTime)) {
          this.preferredDateTime = slots[0] ?? "";
        }
      });

    this.facade.bookingStatus$
      .pipe(
        distinctUntilChanged(),
        filter((status) => status === "success"),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.reasonForVisit = "";
      });
  }

  onFiltersChange(filters: Partial<DoctorFilters>): void {
    this.facade.setDoctorFilters(filters);
  }

  onPageChange(page: number): void {
    this.facade.setDoctorPage(page);
  }

  onPageSizeChange(pageSize: number): void {
    this.facade.setDoctorPageSize(pageSize);
  }

  openBookingFormForDoctor(doctor: Doctor): void {
    this.facade.selectDoctor(doctor.id);
    this.facade.resetBookingStatus();
    this.bookingOpen = true;
    this.bookingFormError = "";
    document
      .getElementById("booking")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  submitBooking(selectedDoctor: Doctor | undefined): void {
    this.bookingFormError = "";
    this.facade.resetBookingStatus();
    const requestedDateTime = new Date(this.preferredDateTime);
    const trimmedReasonForVisit = this.reasonForVisit.trim();

    if (!selectedDoctor) {
      this.bookingFormError = MESSAGES.booking.errors.noDoctor;
      return;
    }
    if (
      !this.preferredDateTime ||
      !selectedDoctor.availableSlots.includes(this.preferredDateTime) ||
      Number.isNaN(requestedDateTime.getTime())
    ) {
      this.bookingFormError = MESSAGES.booking.errors.invalidSlot;
      return;
    }
    if (
      trimmedReasonForVisit.length < BOOKING_REASON_MIN_LENGTH ||
      trimmedReasonForVisit.length > BOOKING_REASON_MAX_LENGTH
    ) {
      this.bookingFormError = MESSAGES.booking.errors.invalidReason;
      return;
    }

    const bookingRequest: CreateConsultationRequest = {
      doctorId: selectedDoctor.id,
      consultationType: this.consultationType,
      preferredDateTime: requestedDateTime.toISOString(),
      reasonForVisit: trimmedReasonForVisit,
    };

    this.facade
      .bookConsultation(bookingRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: () => undefined });
  }
}
