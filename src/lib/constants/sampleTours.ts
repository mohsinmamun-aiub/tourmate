import type { Tour } from "@/types";

export const SAMPLE_TOURS: Tour[] = [
  {
    id: "sample-1",
    creator_id: "demo-1",
    title: "Sajek Valley Cloud Chasing & Helipad Camping ☁️",
    destination: "Sajek Valley",
    departure_date: "2026-11-20",
    return_date: "2026-11-23",
    estimated_budget_bdt: 4500,
    max_members: 6,
    gender_preference: "any",
    description: `Day 1: Meet at Sayedabad or Arambagh bus counter at 9:00 PM. Direct overnight bus to Khagrachhari.
Day 2: Morning breakfast in Khagrachhari, take reserved Chander Gari with army escort to Sajek Valley. Check in at Konglak wooden eco-cottage. Sunset view at Helipad.
Day 3: Sunrise chasing from Konglak hill. Visit Ruilui Para, enjoy bamboo chicken lunch, and evening campfire.
Day 4: Return to Khagrachhari, visit Alutila Cave and Tareng. Night bus back to Dhaka.

Total cost includes: Chander Gari, Cottage stay, 3 meals a day, and cave entry tickets. Only verified campus students are welcome to join!`,
    whatsapp_group_link: "https://chat.whatsapp.com/demo-invite-link",
    status: "open",
    created_at: new Date().toISOString(),
    profiles: {
      id: "demo-1",
      full_name: "Mahir Faysal",
      university_name: "BUET",
      department: "Civil Engineering '22",
      is_verified: true,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "sample-2",
    creator_id: "demo-2",
    title: "Saint Martin Island Coral Beach & BBQ Night 🌊",
    destination: "Saint Martin's Island",
    departure_date: "2026-12-05",
    return_date: "2026-12-09",
    estimated_budget_bdt: 6200,
    max_members: 8,
    gender_preference: "any",
    description: `Day 1: AC Bus from Dhaka to Teknaf Ghat.
Day 2: Board ship to Saint Martin Island. Check in to beachfront resort. Coconut water & evening walk along West Beach.
Day 3: Renting bicycles to ride down to Chera Dwip. Fresh lobster & coral fish BBQ night by the beach under open stars!
Day 4: Free morning for swimming and photography. Afternoon ship back to Teknaf, night coach back to Dhaka.

Looking for chill campus friends who love coastal photography and stargazing!`,
    whatsapp_group_link: "https://chat.whatsapp.com/demo-invite-link",
    status: "open",
    created_at: new Date().toISOString(),
    profiles: {
      id: "demo-2",
      full_name: "Anika Tabassum",
      university_name: "University of Dhaka (DU)",
      department: "Economics '21",
      is_verified: true,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "sample-3",
    creator_id: "demo-3",
    title: "Girls-Only Hiking & Tea Garden Exploration in Srimangal 🍃",
    destination: "Srimangal & Sylhet",
    departure_date: "2026-11-27",
    return_date: "2026-11-29",
    estimated_budget_bdt: 3200,
    max_members: 5,
    gender_preference: "female_only",
    description: `Safe, girls-only weekend getaway by train!
- Morning Parabat Express train from Kamalapur to Srimangal.
- Staying in a secure family-run eco cottage inside the tea estate.
- Day trek to Lawachara Rain Forest and Madhabpur Lake.
- Seven Layer Tea tasting at Nilkantha Tea Cabin.

Strictly girls-only group for safety and comfort. Students from all universities welcome!`,
    whatsapp_group_link: "https://chat.whatsapp.com/demo-invite-link",
    status: "open",
    created_at: new Date().toISOString(),
    profiles: {
      id: "demo-3",
      full_name: "Sumaiya Rahman",
      university_name: "BRAC University",
      department: "CSE '23",
      is_verified: true,
      created_at: new Date().toISOString(),
    },
  },
];
