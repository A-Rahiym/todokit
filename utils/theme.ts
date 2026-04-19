export const Colors = {
  bgPrimary: "#0D0F14",
  bgSecondary: "#13161E",
  bgCard: "#1A1D27",
  bgElevated: "#1F2230",

  accentPurple: "#A78BFA",
  accentMint: "#6EE7B7",
  accentAmber: "#FCD34D",
  accentRose: "#FB7185",
  accentBlue: "#60A5FA",

  surfacePurple: "#EDE9FE",
  surfaceMint: "#D1FAE5",
  surfaceAmber: "#FEF3C7",
  surfaceBlue: "#DBEAFE",

  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#475569",

  border: "#1E2336",
  borderSubtle: "#252A3A",
} as const;

export const Gradients = {
  purple: ["#C4B5FD", "#A78BFA", "#8B5CF6"] as const,
  mint: ["#A7F3D0", "#6EE7B7", "#34D399"] as const,
  amber: ["#FDE68A", "#FCD34D", "#FBBF24"] as const,
  blue: ["#BAE6FD", "#7DD3FC", "#38BDF8"] as const,
  dark: ["#1A1D27", "#13161E"] as const,
  card: ["#1F2230", "#1A1D27"] as const,
};

export const ToolCards = [
  {
    id: "converter",
    title: "Unit Converter",
    subtitle: "Convert units effortlessly",
    gradient: ["#C4B5FD", "#A78BFA"] as [string, string],
    icon: "🔄",
    route: "/(tabs)/converter",
  },
  {
    id: "calculator",
    title: "Calculator",
    subtitle: "Powerful arithmetic tools",
    gradient: ["#BAE6FD", "#93C5FD"] as [string, string],
    icon: "🧮",
    route: "/(tabs)/calculator",
  },
  {
    id: "notes",
    title: "Tasks",
    subtitle: "Track & complete your work",
    gradient: ["#D9F99D", "#BBF7D0"] as [string, string],
    icon: "✅",
    route: "/(tabs)/notes",
  },
];
