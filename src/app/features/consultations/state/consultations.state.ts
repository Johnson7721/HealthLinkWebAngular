import { inject, Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, of, tap, throwError } from "rxjs";
import { HEALTHLINK_API } from "../../../core/api/api.constants";
import { MESSAGES } from "../../../shared/messages/app.messages";
import type { Consultation } from "../../../shared/models/consultation.model";
import type { BookingStatus } from "../models/booking-status.model";
import {
  BookConsultation,
  LoadConsultations,
  ResetBookingStatus,
} from "./consultations.actions";

export interface ConsultationsStateModel {
  items: Consultation[];
  loading: boolean;
  error: string;
  bookingStatus: BookingStatus;
  bookingMessage: string;
}

const initialState: ConsultationsStateModel = {
  items: [],
  loading: false,
  error: "",
  bookingStatus: "idle",
  bookingMessage: "",
};

const byDateDescending = (a: Consultation, b: Consultation): number =>
  new Date(b.preferredDateTime).getTime() -
  new Date(a.preferredDateTime).getTime();

@State<ConsultationsStateModel>({
  name: "consultations",
  defaults: initialState,
})
@Injectable()
export class ConsultationsState {
  private readonly api = inject(HEALTHLINK_API);

  @Selector()
  static items(state: ConsultationsStateModel): Consultation[] {
    return state.items;
  }

  @Selector()
  static scheduled(state: ConsultationsStateModel): Consultation[] {
    return state.items
      .filter((consultation) => consultation.status === "Scheduled")
      .sort((a, b) => byDateDescending(b, a));
  }

  @Selector()
  static past(state: ConsultationsStateModel): Consultation[] {
    return state.items
      .filter((consultation) => consultation.status !== "Scheduled")
      .sort(byDateDescending);
  }

  @Selector()
  static loading(state: ConsultationsStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: ConsultationsStateModel): string {
    return state.error;
  }

  @Selector()
  static bookingStatus(state: ConsultationsStateModel): BookingStatus {
    return state.bookingStatus;
  }

  @Selector()
  static bookingMessage(state: ConsultationsStateModel): string {
    return state.bookingMessage;
  }

  @Action(LoadConsultations, { cancelUncompleted: true })
  loadConsultations(ctx: StateContext<ConsultationsStateModel>) {
    ctx.patchState({ loading: true, error: "" });
    return this.api.getConsultations().pipe(
      tap((consultations) =>
        ctx.patchState({
          items: [...consultations].sort(byDateDescending),
          loading: false,
        }),
      ),
      catchError(() => {
        ctx.patchState({
          loading: false,
          error: MESSAGES.consultations.loadError,
        });
        return of(null);
      }),
    );
  }

  @Action(BookConsultation)
  bookConsultation(
    ctx: StateContext<ConsultationsStateModel>,
    action: BookConsultation,
  ) {
    ctx.patchState({ bookingStatus: "submitting", bookingMessage: "" });
    return this.api.createConsultation(action.request).pipe(
      tap((consultation) => {
        ctx.patchState({
          items: [consultation, ...ctx.getState().items].sort(byDateDescending),
          bookingStatus: "success",
          bookingMessage: MESSAGES.booking.success(
            consultation.consultationType,
            consultation.doctorName,
          ),
        });
      }),
      catchError((error: { status?: number }) => {
        ctx.patchState({
          bookingStatus: "error",
          bookingMessage:
            error.status === 404
              ? MESSAGES.booking.errors.slotTaken
              : MESSAGES.booking.errors.generic,
        });
        return throwError(() => error);
      }),
    );
  }

  @Action(ResetBookingStatus)
  resetBookingStatus(ctx: StateContext<ConsultationsStateModel>) {
    ctx.patchState({ bookingStatus: "idle", bookingMessage: "" });
  }
}
