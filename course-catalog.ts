export const courseCatalog = [
  {
    slug: "foundation-11th",
    title: "Foundation 11th",
    shortTitle: "Class 11",
    description: "Class 11 Physics की concept foundation से NEET-level problem solving तक पूरी journey।",
    validity: "1 year",
    price: "₹2,500",
    accent: "mint",
  },
  {
    slug: "foundation-12th",
    title: "Foundation 12th",
    shortTitle: "Class 12",
    description: "Boards और NEET—दोनों के लिए chapter-wise lectures, practice और tests।",
    validity: "1 year",
    price: "₹2,500",
    accent: "blue",
  },
  {
    slug: "target-batch",
    title: "Target Batch",
    shortTitle: "NEET Repeaters",
    description: "Complete syllabus revision, question practice और selection-focused test programme।",
    validity: "1 year",
    price: "₹2,500",
    accent: "lime",
  },
  {
    slug: "9th-pre-foundation",
    title: "9th Pre-Foundation",
    shortTitle: "Class 9–12",
    description: "Class 9 से 12 तक school Physics और future NEET preparation की complete foundation।",
    validity: "4 years · Class 9–12",
    price: "₹8,000",
    accent: "coral",
  },
  {
    slug: "10th-pre-foundation",
    title: "10th Pre-Foundation",
    shortTitle: "Class 10–12",
    description: "Class 10 से 12 तक concepts, boards और NEET Physics की systematic तैयारी।",
    validity: "3 years · Class 10–12",
    price: "₹8,000",
    accent: "violet",
  },
] as const;

export type Course = (typeof courseCatalog)[number];

export function getCourseBySlug(slug: string) {
  return courseCatalog.find((course) => course.slug === slug);
}

export function getCourseByTitle(title: string) {
  return courseCatalog.find((course) => course.title === title);
}

export const learningFolders = [
  { type: "live", label: "Live Classes", icon: "LIVE" },
  { type: "video", label: "Recorded Lectures", icon: "▶" },
  { type: "booklet", label: "Chapter Booklet", icon: "PDF" },
  { type: "dpp", label: "DPPs", icon: "DPP" },
  { type: "test", label: "Tests", icon: "TEST" },
] as const;
