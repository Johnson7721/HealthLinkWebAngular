import {
  BOOKING_REASON_MAX_LENGTH,
  BOOKING_REASON_MIN_LENGTH,
} from "../constants/booking.constants";

export const MESSAGES = {
  brand: {
    name: "Health",
    accent: "Link",
    homeAriaLabel: "HealthLink home",
    navAriaLabel: "Primary navigation",
    navHome: "Home",
    navConsultations: "My Consultations",
    profileAriaLabel: "Signed in as John Patient",
    profileName: "John",
    profileRole: "Patient",
    profileInitials: "JP",
  },
  welcome: {
    eyebrow: "Welcome to HealthLink",
    title: "Consult a Doctor",
    subtitle:
      "Choose a doctor and an available appointment time for chat or video.",
  },
  doctors: {
    heading: "Available Doctors",
    subheading: "Find the right doctor for your needs.",
    online: "Online",
    loading: "Finding available doctors…",
    empty: "No doctors are available right now.",
    noMatches:
      "No doctors match those filters. Try a different search or specialty.",
    loadError:
      "We couldn’t load doctors. Please check that the HealthLink API is running and refresh.",
    availabilityNote:
      "Appointment times are demo slots shown in your local time zone.",
  },
  search: {
    label: "Search doctors",
    placeholder: "Search by doctor or specialty",
    specialtyLabel: "Filter by specialty",
    allSpecialties: "All specialties",
    clear: "Clear filters",
  },
  pagination: {
    navAriaLabel: "Doctor list pagination",
    previous: "Previous",
    next: "Next",
    pageAriaLabel: (page: number) => `Go to page ${page}`,
    perPageLabel: "Per page",
    summary: (from: number, to: number, total: number) =>
      total === 0 ? "No results" : `Showing ${from}–${to} of ${total}`,
  },
  consultations: {
    heading: "My Consultations",
    subheading: "Your upcoming and past sessions.",
    loading: "Loading your consultations…",
    empty: "Your booked consultations will appear here.",
    upcomingHeading: "Upcoming",
    upcomingEmpty: "No upcoming consultations.",
    pastHeading: "Past consultations",
    pastEmpty: "Completed consultations will appear here.",
    loadError:
      "We couldn’t load your consultations. Please check that the HealthLink API is running and refresh.",
    timezoneNote: "Times shown in your local time zone",
    upcomingCount: (count: number) =>
      `upcoming session${count === 1 ? "" : "s"}`,
  },
  booking: {
    eyebrow: "MAKE AN APPOINTMENT",
    heading: "Book Consultation",
    scheduleWith: (doctorName: string | undefined) =>
      `Schedule a session with ${doctorName || "your doctor"}`,
    closeAriaLabel: "Close booking form",
    doctorLabel: "Doctor",
    selectPlaceholder: "Select a doctor from the list to begin.",
    slotsAvailable: (count: number) => `${count} appointment times available`,
    stepType: "Consultation Type",
    chat: "Chat",
    chatDescription: "Text-based consultation",
    video: "Video Call",
    videoDescription: "Face-to-face consultation",
    stepTime: "Preferred Time",
    timeLabel: "Available appointment time (local time)",
    timePlaceholder: "Select an available time",
    slotHint: "Only available demo appointment times can be booked.",
    noSlots: "No times are currently available for this doctor.",
    stepReason: "Reason for Visit",
    required: "Required",
    reasonLabel: `Enter ${BOOKING_REASON_MIN_LENGTH}–${BOOKING_REASON_MAX_LENGTH} characters so your doctor can prepare`,
    reasonPlaceholder: "Tell us a little about how you're feeling…",
    submitting: "Booking…",
    submit: "Confirm Booking",
    demoNotice:
      "Fictional assessment demo. Do not enter real or sensitive health information.",
    closedHeading: "Ready when you are",
    closedBody: "Choose a doctor to schedule your online consultation.",
    reopen: "Open booking form",
    success: (consultationType: string, doctorName: string) =>
      `Your ${consultationType.toLowerCase()} consultation with ${doctorName} is booked.`,
    errors: {
      noDoctor: "Please choose a doctor before booking.",
      invalidSlot: "Choose one of the available appointment times.",
      invalidReason: `Enter a reason for your visit between ${BOOKING_REASON_MIN_LENGTH} and ${BOOKING_REASON_MAX_LENGTH} characters.`,
      slotTaken:
        "That appointment time is no longer available. Choose another time and try again.",
      generic:
        "We couldn’t confirm your booking. Please check your details and try again.",
    },
  },
  footer: {
    copyright: "© 2025 HealthLink · Fictional demo portal",
    demoData: "Demo data only. No real patient information is stored.",
  },
} as const;
