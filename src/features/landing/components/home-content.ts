import {
  BookOpen,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const homeNavigation = [
  { label: "How it works", target: "how" },
  { label: "Features", target: "features" },
  { label: "About", target: "about" },
];

export const howItWorksSteps = [
  [
    "01",
    "Bring in what matters",
    "Upload PDFs, websites, notes, audio, and more.",
  ],
  [
    "02",
    "Explore without losing context",
    "Ask questions rooted in sources you trust.",
  ],
  [
    "03",
    "Move from insight to action",
    "Create summaries and shareable materials.",
  ],
] as const;

export const productFeatures: {
  icon: LucideIcon;
  title: string;
  copy: string;
}[] = [
  {
    icon: BookOpen,
    title: "Grounded in your sources",
    copy: "Every answer is supported by the material you choose, with citations that lead back to the moment.",
  },
  {
    icon: Sparkles,
    title: "Make connections faster",
    copy: "Turn a collection of documents into clear briefs, study guides, and fresh ideas.",
  },
  {
    icon: MessageCircle,
    title: "Ask better questions",
    copy: "Explore complex material through a conversation that keeps every detail in reach.",
  },
];
