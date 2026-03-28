import { colors } from "./tokens";

export const typography = {
  brand: {
    fontSize: 22,
    fontStyle: "italic" as const,
    fontWeight: "600" as const,
    color: colors.accentPrimary,
  },

  display: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },

  displayLarge: {
    fontSize: 42,
    lineHeight: 46,
    fontWeight: "600" as const,
    color: colors.textPrimary,
  },

  sectionTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },

  cardTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },

  cardTitleCompact: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },

  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },

  bodyCompact: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },

  meta: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textTertiary,
  },

  metaStrong: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600" as const,
    color: colors.textTertiary,
  },

  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700" as const,
    letterSpacing: 1.2,
    textTransform: "uppercase" as const,
    color: colors.textTertiary,
  },

  pill: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600" as const,
  },

  button: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700" as const,
    color: colors.textOnDark,
  },
} as const;