import { ApplicationConfig } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { provideStore } from "@ngxs/store";
import {
  API_BASE_URL,
  DEFAULT_API_BASE_URL,
  HEALTHLINK_API,
} from "./core/api/api.constants";
import { HealthLinkApiService } from "./core/api/healthlink-api.service";
import { ConsultationsState } from "./features/consultations/state/consultations.state";
import { DoctorsState } from "./features/doctors/state/doctors.state";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideStore([DoctorsState, ConsultationsState]),
    { provide: API_BASE_URL, useValue: DEFAULT_API_BASE_URL },
    { provide: HEALTHLINK_API, useExisting: HealthLinkApiService },
  ],
};
