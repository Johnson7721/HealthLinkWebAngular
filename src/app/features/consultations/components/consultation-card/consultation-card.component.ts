import { DatePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import type { Consultation } from "../../../../shared/models/consultation.model";

@Component({
  selector: "app-consultation-card",
  standalone: true,
  imports: [DatePipe],
  templateUrl: "./consultation-card.component.html",
  styleUrl: "./consultation-card.component.scss",
})
export class ConsultationCardComponent {
  @Input({ required: true }) consultation!: Consultation;
  @Input() isLast = false;
}
