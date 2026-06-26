export type Track = "art" | "facilitation" | "business" | "plenary" | "social" | "break";

export type Session = {
  id: string;
  day: string;
  time: string;
  title: string;
  presenter: string;
  track: Track;
};

export const sessions: Session[] = [
  // TUESDAY 6 OCTOBER
  { id: "tue-registration", day: "Tuesday, 6 October", time: "15:00", title: "Registration at Venue", presenter: "", track: "plenary" },
  { id: "tue-cocktail", day: "Tuesday, 6 October", time: "18:00–20:00", title: "Cocktail Evening – Two Oceans Aquarium, V&A Waterfront", presenter: "", track: "social" },

  // WEDNESDAY 7 OCTOBER
  { id: "wed-breakfast", day: "Wednesday, 7 October", time: "08:00–08:30", title: "Breakfast", presenter: "", track: "break" },
  { id: "wed-opening", day: "Wednesday, 7 October", time: "08:30–10:00", title: "Opening Address + Singers (30 min) + IFVP AGM", presenter: "", track: "plenary" },
  { id: "wed-break1", day: "Wednesday, 7 October", time: "10:00–10:30", title: "Break", presenter: "", track: "break" },
  { id: "wed-flare", day: "Wednesday, 7 October", time: "10:30–12:00", title: "Drawing Tricky Concepts More Creatively with FLARE", presenter: "Ben Crothers", track: "art" },
  { id: "wed-nnm", day: "Wednesday, 7 October", time: "10:30–12:00", title: "Neuro-Narrative Mapping", presenter: "Deon Hanns & Jo Hobson", track: "facilitation" },
  { id: "wed-ai-blueprint", day: "Wednesday, 7 October", time: "10:30–12:00", title: "Drawing the Line: A Privacy-First, Human-First AI Blueprint", presenter: "Matthias Weitbrecht", track: "business" },
  { id: "wed-lunch", day: "Wednesday, 7 October", time: "12:00–13:00", title: "Lunch + Open Space Setup", presenter: "", track: "break" },
  { id: "wed-symbol", day: "Wednesday, 7 October", time: "13:00–14:30", title: "Symbol Safari: Co-creating Meaning", presenter: "Gill Cromhout & Maaike Borsboom", track: "art" },
  { id: "wed-partnership", day: "Wednesday, 7 October", time: "13:00–14:30", title: "Leveraging the Facilitation & Graphic Recorder Partnership", presenter: "Nora Sheffe & James Durno", track: "facilitation" },
  { id: "wed-survival", day: "Wednesday, 7 October", time: "13:00–14:30", title: "Don't Panic! A Survival Guide for Recorders", presenter: "Jim Nuttle", track: "business" },
  { id: "wed-break2", day: "Wednesday, 7 October", time: "14:30–15:00", title: "Break", presenter: "", track: "break" },
  { id: "wed-ai-plenary", day: "Wednesday, 7 October", time: "15:00–16:30", title: "Plenary: The Ethical Use of AI in Visual Practice", presenter: "Panel discussion", track: "plenary" },
  { id: "wed-graphicjam", day: "Wednesday, 7 October", time: "16:30–17:00", title: "Graphic Jam with Drinks", presenter: "Donatella Pastorino & Jim Nuttle", track: "social" },
  { id: "wed-dinner", day: "Wednesday, 7 October", time: "19:00", title: "Dinner at V&A Waterfront (own transport, own account)", presenter: "", track: "social" },

  // THURSDAY 8 OCTOBER
  { id: "thu-breakfast", day: "Thursday, 8 October", time: "08:00–08:30", title: "Breakfast", presenter: "", track: "break" },
  { id: "thu-characters", day: "Thursday, 8 October", time: "08:30–10:00", title: "Drawing Characters that Speak", presenter: "Nick Walsh", track: "art" },
  { id: "thu-visual-tools", day: "Thursday, 8 October", time: "08:30–10:00", title: "Visual Tools to Change an Industry – Meeting by Meeting", presenter: "Axelle Vanquallie", track: "facilitation" },
  { id: "thu-tourism", day: "Thursday, 8 October", time: "08:30–10:00", title: "The Visual Journey: Transforming Tourism Experience", presenter: "", track: "business" },
  { id: "thu-break1", day: "Thursday, 8 October", time: "10:00–10:30", title: "Break", presenter: "", track: "break" },
  { id: "thu-soulcollage", day: "Thursday, 8 October", time: "10:30–12:00", title: "Soul Collage® as an Entry Point into Visual Thinking", presenter: "Adriana Contreras", track: "art" },
  { id: "thu-draw", day: "Thursday, 8 October", time: "10:30–12:00", title: "Draw from Everything", presenter: "Elise White", track: "facilitation" },
  { id: "thu-community", day: "Thursday, 8 October", time: "10:30–12:00", title: "From Idea to Impact: Building a Visual Practitioner's Community", presenter: "Dana Rulf", track: "business" },
  { id: "thu-lunch", day: "Thursday, 8 October", time: "12:00–13:00", title: "Lunch", presenter: "", track: "break" },
  { id: "thu-openspace-setup", day: "Thursday, 8 October", time: "13:00–13:45", title: "Open Space Setup", presenter: "Facilitated by Kati Orav", track: "plenary" },
  { id: "thu-openspace-1", day: "Thursday, 8 October", time: "13:45–14:30", title: "Open Space Session 1", presenter: "", track: "plenary" },
  { id: "thu-break2", day: "Thursday, 8 October", time: "14:30–15:00", title: "Break", presenter: "", track: "break" },
  { id: "thu-openspace-2", day: "Thursday, 8 October", time: "15:00–15:40", title: "Open Space Session 2", presenter: "", track: "plenary" },
  { id: "thu-openspace-3", day: "Thursday, 8 October", time: "15:50–16:30", title: "Open Space Session 3", presenter: "", track: "plenary" },
  { id: "thu-openspace-feedback", day: "Thursday, 8 October", time: "16:30–17:00", title: "Open Space Feedback Circle", presenter: "", track: "plenary" },
  { id: "thu-dinner", day: "Thursday, 8 October", time: "19:00", title: "Dinner at V&A Waterfront (own transport, own account)", presenter: "", track: "social" },

  // FRIDAY 9 OCTOBER
  { id: "fri-breakfast", day: "Friday, 9 October", time: "08:00–08:30", title: "Breakfast", presenter: "", track: "break" },
  { id: "fri-situating", day: "Friday, 9 October", time: "08:30–10:00", title: "Situating Graphic Recording within the Visual Arts", presenter: "Alice Edy", track: "art" },
  { id: "fri-scribe", day: "Friday, 9 October", time: "08:30–10:00", title: "From Scribe to Strategic Ally: Designing Partnership in Facilitation", presenter: "Erin Gordon", track: "facilitation" },
  { id: "fri-brazil", day: "Friday, 9 October", time: "08:30–10:00", title: "Drawing Voices: Graphic Facilitation with Traditional Peoples in Brazil", presenter: "Jess Tenorio", track: "business" },
  { id: "fri-visual-thinking", day: "Friday, 9 October", time: "08:30–10:00", title: "Through Visual Thinking", presenter: "Sonia Garcia Farina", track: "facilitation" },
  { id: "fri-break1", day: "Friday, 9 October", time: "10:00–10:30", title: "Break", presenter: "", track: "break" },
  { id: "fri-signature", day: "Friday, 9 October", time: "10:30–12:00", title: "The Signature Behind Your Sketch", presenter: "Ben Crothers & Axelle Vanquallie", track: "art" },
  { id: "fri-somatic", day: "Friday, 9 October", time: "10:30–12:00", title: "Embodying Change with the Somatic Scribing Lab", presenter: "Kate Morales", track: "facilitation" },
  { id: "fri-education", day: "Friday, 9 October", time: "10:30–12:00", title: "Bringing Visual Practices into Education: Beyond a Global Framework for Teachers", presenter: "Kati Orav", track: "business" },
  { id: "fri-lunch", day: "Friday, 9 October", time: "12:00–13:00", title: "Lunch", presenter: "", track: "break" },
  { id: "fri-gala", day: "Friday, 9 October", time: "19:00", title: "Gala Dinner – Drum Café", presenter: "", track: "social" },
];

export const trackConfig: Record<Exclude<Track, "break">, { label: string; bg: string; text: string; border: string }> = {
  art:          { label: "The Art of the Line",   bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  facilitation: { label: "Drawn to Facilitation", bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
  business:     { label: "Business Builders",      bg: "bg-blue-100",  text: "text-blue-800",  border: "border-blue-300"  },
  plenary:      { label: "Plenary",                bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" },
  social:       { label: "Social",                 bg: "bg-teal-100",  text: "text-teal-800",  border: "border-teal-300"  },
};

export const days = [
  "Tuesday, 6 October",
  "Wednesday, 7 October",
  "Thursday, 8 October",
  "Friday, 9 October",
];
