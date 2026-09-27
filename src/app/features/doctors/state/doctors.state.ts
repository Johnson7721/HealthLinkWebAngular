import { inject, Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { catchError, of, switchMap, tap } from "rxjs";
import { HEALTHLINK_API } from "../../../core/api/api.constants";
import { ALL_SPECIALTIES } from "../doctors.constants";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "../../../shared/constants/paging.constants";
import { MESSAGES } from "../../../shared/messages/app.messages";
import type { Doctor } from "../../../shared/models/doctor.model";
import type {
  DoctorFilters,
  DoctorQuery,
} from "../../../shared/models/doctor-query.model";
import type { PagingInfo } from "../../../shared/models/paging.model";
import {
  LoadDoctors,
  SelectDoctor,
  SetDoctorFilters,
  SetDoctorPage,
  SetDoctorPageSize,
} from "./doctors.actions";

export interface DoctorsStateModel {
  items: Doctor[];
  specialties: string[];
  paging: PagingInfo;
  filters: DoctorFilters;
  selectedDoctorId: string;
  loading: boolean;
  error: string;
}

const initialState: DoctorsStateModel = {
  items: [],
  specialties: [],
  paging: {
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    totalCount: 0,
    totalPages: 0,
  },
  filters: { search: "", specialty: ALL_SPECIALTIES },
  selectedDoctorId: "",
  loading: false,
  error: "",
};

@State<DoctorsStateModel>({
  name: "doctors",
  defaults: initialState,
})
@Injectable()
export class DoctorsState {
  private readonly api = inject(HEALTHLINK_API);

  @Selector()
  static items(state: DoctorsStateModel): Doctor[] {
    return state.items;
  }

  @Selector()
  static specialties(state: DoctorsStateModel): string[] {
    return state.specialties;
  }

  @Selector()
  static paging(state: DoctorsStateModel): PagingInfo {
    return state.paging;
  }

  @Selector()
  static filters(state: DoctorsStateModel): DoctorFilters {
    return state.filters;
  }

  @Selector()
  static loading(state: DoctorsStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: DoctorsStateModel): string {
    return state.error;
  }

  @Selector()
  static selectedDoctorId(state: DoctorsStateModel): string {
    return state.selectedDoctorId;
  }

  @Selector()
  static selectedDoctor(state: DoctorsStateModel): Doctor | undefined {
    return state.items.find((doctor) => doctor.id === state.selectedDoctorId);
  }

  @Selector()
  static hasActiveFilters(state: DoctorsStateModel): boolean {
    return (
      state.filters.search.trim() !== "" ||
      state.filters.specialty !== ALL_SPECIALTIES
    );
  }

  @Action(LoadDoctors, { cancelUncompleted: true })
  loadDoctors(ctx: StateContext<DoctorsStateModel>) {
    const { paging, filters } = ctx.getState();
    const query: DoctorQuery = {
      page: paging.page,
      pageSize: paging.pageSize,
      ...filters,
    };
    ctx.patchState({ loading: true, error: "" });

    return of(query).pipe(
      switchMap((request) => this.api.getDoctors(request)),
      tap((result) => {
        const state = ctx.getState();
        const selectedStillVisible = result.items.some(
          (doctor) => doctor.id === state.selectedDoctorId,
        );
        ctx.patchState({
          items: result.items,
          specialties: result.specialties,
          paging: {
            page: result.page,
            pageSize: result.pageSize,
            totalCount: result.totalCount,
            totalPages: result.totalPages,
          },
          selectedDoctorId: selectedStillVisible
            ? state.selectedDoctorId
            : (result.items[0]?.id ?? ""),
          loading: false,
        });
      }),
      catchError(() => {
        ctx.patchState({ loading: false, error: MESSAGES.doctors.loadError });
        return of(null);
      }),
    );
  }

  @Action(SetDoctorFilters)
  setFilters(ctx: StateContext<DoctorsStateModel>, action: SetDoctorFilters) {
    const state = ctx.getState();
    ctx.patchState({
      filters: { ...state.filters, ...action.filters },
      paging: { ...state.paging, page: DEFAULT_PAGE },
    });
    return ctx.dispatch(new LoadDoctors());
  }

  @Action(SetDoctorPage)
  setPage(ctx: StateContext<DoctorsStateModel>, action: SetDoctorPage) {
    const state = ctx.getState();
    if (action.page === state.paging.page) {
      return;
    }
    ctx.patchState({ paging: { ...state.paging, page: action.page } });
    return ctx.dispatch(new LoadDoctors());
  }

  @Action(SetDoctorPageSize)
  setPageSize(ctx: StateContext<DoctorsStateModel>, action: SetDoctorPageSize) {
    const state = ctx.getState();
    ctx.patchState({
      paging: {
        ...state.paging,
        pageSize: action.pageSize,
        page: DEFAULT_PAGE,
      },
    });
    return ctx.dispatch(new LoadDoctors());
  }

  @Action(SelectDoctor)
  selectDoctor(ctx: StateContext<DoctorsStateModel>, action: SelectDoctor) {
    ctx.patchState({ selectedDoctorId: action.doctorId });
  }
}
