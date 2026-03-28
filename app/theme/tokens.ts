export const colors = {
  canvas: "#FCF9F4",
  surface: "#F1ECE5",
  surfaceSoft: "#EFE7DE",
  surfaceElevated: "#FFFFFF",
  heroDark: "#2C211C",
  heroSoft: "#B89D88",

  textPrimary: "#1C1C19",
  textSecondary: "#554339",
  textTertiary: "#7A675C",
  textOnDark: "#FFFFFF",

  accentPrimary: "#9A4600",
  accentDeep: "#7D3400",
  accentSoft: "#F0DED2",
  accentMuted: "#DCC1B4",

  successSoft: "#E4EBDD",
  successText: "#4C5A49",
  successBorder: "#6F7D57",

  borderSoft: "#E8DED3",
  borderMuted: "#C9B4A6",

  shadow: "#000000",
} as const;

export const spacing = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  section: 32,
  screen: 24,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  pill: 999,
} as const;

export const shadows = {
  soft: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  card: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
} as const;