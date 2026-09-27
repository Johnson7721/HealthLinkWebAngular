import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { ALL_SPECIALTIES, SEARCH_DEBOUNCE_MS } from "../../doctors.constants";
import { MESSAGES } from "../../../../shared/messages/app.messages";
import type { DoctorFilters } from "../../../../shared/models/doctor-query.model";

@Component({
  selector: "app-search-filter",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./search-filter.component.html",
  styleUrl: "./search-filter.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFilterComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  @Input() specialties: string[] = [];
  @Input() debounceMs = SEARCH_DEBOUNCE_MS;
  @Input() showClear = false;
  @Input() set filters(value: DoctorFilters) {
    if (value.search !== this.searchControl.value) {
      this.searchControl.setValue(value.search, { emitEvent: false });
    }
    if (value.specialty !== this.specialtyControl.value) {
      this.specialtyControl.setValue(value.specialty, { emitEvent: false });
    }
  }

  @Output() readonly filtersChange = new EventEmitter<Partial<DoctorFilters>>();

  readonly messages = MESSAGES.search;
  readonly allSpecialties = ALL_SPECIALTIES;
  readonly searchControl = new FormControl("", { nonNullable: true });
  readonly specialtyControl = new FormControl(ALL_SPECIALTIES, {
    nonNullable: true,
  });

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounceMs),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((search) => this.filtersChange.emit({ search }));

    this.specialtyControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((specialty) => this.filtersChange.emit({ specialty }));
  }

  clear(): void {
    this.searchControl.setValue("", { emitEvent: false });
    this.specialtyControl.setValue(ALL_SPECIALTIES, { emitEvent: false });
    this.filtersChange.emit({ search: "", specialty: ALL_SPECIALTIES });
  }
}
