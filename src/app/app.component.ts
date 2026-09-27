import { Component } from "@angular/core";
import { DashboardPageComponent } from "./features/dashboard/pages/dashboard-page.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [DashboardPageComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {}
