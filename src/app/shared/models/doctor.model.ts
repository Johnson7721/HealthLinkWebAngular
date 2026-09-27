export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availability: string;
  imageUrl: string;
  isAvailable: boolean;
  availableSlots: string[];
}
