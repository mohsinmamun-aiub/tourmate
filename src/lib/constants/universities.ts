export interface UniversityInfo {
  name: string;
  shortName: string;
  domains: string[];
}

export const BD_UNIVERSITIES: UniversityInfo[] = [
  { name: "University of Dhaka (DU)", shortName: "DU", domains: ["du.ac.bd"] },
  { name: "Bangladesh University of Engineering and Technology (BUET)", shortName: "BUET", domains: ["buet.ac.bd", "ug.buet.ac.bd"] },
  { name: "BRAC University", shortName: "BRACU", domains: ["g.bracu.ac.bd", "bracu.ac.bd"] },
  { name: "North South University (NSU)", shortName: "NSU", domains: ["northsouth.edu"] },
  { name: "American International University-Bangladesh (AIUB)", shortName: "AIUB", domains: ["aiub.edu"] },
  { name: "Islamic University of Technology (IUT)", shortName: "IUT", domains: ["iut-dhaka.edu"] },
  { name: "Shahjalal University of Science and Technology (SUST)", shortName: "SUST", domains: ["sust.edu"] },
  { name: "Jahangirnagar University (JU)", shortName: "JU", domains: ["juniv.edu"] },
  { name: "University of Rajshahi (RU)", shortName: "RU", domains: ["ru.ac.bd"] },
  { name: "University of Chittagong (CU)", shortName: "CU", domains: ["cu.ac.bd"] },
  { name: "Khulna University of Engineering & Technology (KUET)", shortName: "KUET", domains: ["kuet.ac.bd"] },
  { name: "Chittagong University of Engineering & Technology (CUET)", shortName: "CUET", domains: ["cuet.ac.bd"] },
  { name: "Rajshahi University of Engineering & Technology (RUET)", shortName: "RUET", domains: ["ruet.ac.bd"] },
  { name: "United International University (UIU)", shortName: "UIU", domains: ["uiu.ac.bd"] },
  { name: "East West University (EWU)", shortName: "EWU", domains: ["ewubd.edu"] },
  { name: "Independent University, Bangladesh (IUB)", shortName: "IUB", domains: ["iub.edu.bd"] },
  { name: "Daffodil International University (DIU)", shortName: "DIU", domains: ["diu.edu.bd"] },
  { name: "Ahsanullah University of Science and Technology (AUST)", shortName: "AUST", domains: ["aust.edu"] },
  { name: "National University / Affiliated Colleges", shortName: "NU", domains: [] },
  { name: "Other University / College", shortName: "Other", domains: [] }
];

export const POPULAR_DESTINATIONS = [
  "Sajek Valley",
  "Cox's Bazar",
  "Bandarban (Nilgiri & Nafakhum)",
  "Srimangal & Sylhet",
  "Saint Martin's Island",
  "Rangamati",
  "Tanguar Haor, Sunamganj",
  "Kuakata Sea Beach",
  "Sundarbans",
  "Kaptai Lake"
];

export function isEduEmail(email: string): boolean {
  if (!email) return false;
  const cleaned = email.trim().toLowerCase();
  const eduRegex = /(\.edu|\.edu\.bd|\.ac\.bd)$/i;
  return eduRegex.test(cleaned);
}
