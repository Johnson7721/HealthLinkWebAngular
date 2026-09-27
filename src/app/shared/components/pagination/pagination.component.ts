import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import {
  MAX_VISIBLE_PAGE_BUTTONS,
  PAGE_SIZE_OPTIONS,
} from "../../constants/paging.constants";
import { MESSAGES } from "../../messages/app.messages";
import type { PagingInfo } from "../../models/paging.model";

@Component({
  selector: "app-pagination",
  standalone: true,
  templateUrl: "./pagination.component.html",
  styleUrl: "./pagination.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input({ required: true }) paging!: PagingInfo;
  @Input() pageSizeOptions: readonly number[] = PAGE_SIZE_OPTIONS;
  @Input() disabled = false;
  @Output() readonly pageChange = new EventEmitter<number>();
  @Output() readonly pageSizeChange = new EventEmitter<number>();

  readonly messages = MESSAGES.pagination;

  get pages(): number[] {
    const total = this.paging.totalPages;
    const windowSize = Math.min(MAX_VISIBLE_PAGE_BUTTONS, total);
    let start = Math.max(1, this.paging.page - Math.floor(windowSize / 2));
    start = Math.min(start, Math.max(1, total - windowSize + 1));
    return Array.from({ length: windowSize }, (_, index) => start + index);
  }

  get rangeStart(): number {
    return this.paging.totalCount === 0
      ? 0
      : (this.paging.page - 1) * this.paging.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(
      this.paging.page * this.paging.pageSize,
      this.paging.totalCount,
    );
  }

  get summary(): string {
    return this.messages.summary(
      this.rangeStart,
      this.rangeEnd,
      this.paging.totalCount,
    );
  }

  goToPage(page: number): void {
    if (
      this.disabled ||
      page < 1 ||
      page > this.paging.totalPages ||
      page === this.paging.page
    ) {
      return;
    }
    this.pageChange.emit(page);
  }

  onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (value && value !== this.paging.pageSize) {
      this.pageSizeChange.emit(value);
    }
  }
}
