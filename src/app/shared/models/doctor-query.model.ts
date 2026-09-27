import type { Doctor } from "./doctor.model";
import type { PagedResult } from "./paging.model";

export interface DoctorFilters {
  search: string;
  specialty: string;
}

export interface DoctorQuery extends DoctorFilters {
  page: number;
  pageSize: number;
}

export interface DoctorPage extends PagedResult<Doctor> {
  specialties: string[];
}
