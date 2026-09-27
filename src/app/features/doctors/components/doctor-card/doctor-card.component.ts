import { Component, EventEmitter, Input, Output } from "@angular/core";
import type { Doctor } from "../../../../shared/models/doctor.model";

@Component({
  selector: "app-doctor-card",
  standalone: true,
  templateUrl: "./doctor-card.component.html",
  styleUrl: "./doctor-card.component.scss",
})
export class DoctorCardComponent {
  @Input({ required: true }) doctor!: Doctor;
  @Input() isSelected = false;
  @Output() bookRequested = new EventEmitter<Doctor>();

  get doctorInitials(): string {
    return this.doctor.name
      .replace("Dr. ", "")
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("");
  }
}
