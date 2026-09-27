import type { DoctorFilters } from "../../../shared/models/doctor-query.model";

export class LoadDoctors {
  static readonly type = "[Doctors] Load";
}

export class SetDoctorFilters {
  static readonly type = "[Doctors] Set Filters";
  constructor(public readonly filters: Partial<DoctorFilters>) {}
}

export class SetDoctorPage {
  static readonly type = "[Doctors] Set Page";
  constructor(public readonly page: number) {}
}

export class SetDoctorPageSize {
  static readonly type = "[Doctors] Set Page Size";
  constructor(public readonly pageSize: number) {}
}

export class SelectDoctor {
  static readonly type = "[Doctors] Select";
  constructor(public readonly doctorId: string) {}
}
