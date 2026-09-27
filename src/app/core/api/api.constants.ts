import { InjectionToken } from "@angular/core";
import type { HealthLinkApi } from "./healthlink-api.interface";

export const API_BASE_URL = new InjectionToken<string>("API_BASE_URL");
export const HEALTHLINK_API = new InjectionToken<HealthLinkApi>(
  "HEALTHLINK_API",
);
export const DEFAULT_API_BASE_URL = "https://localhost:7101";

export const API_ENDPOINTS = {
  doctors: "/doctors",
  consultations: "/consultations",
} as const;
