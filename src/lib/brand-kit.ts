/**
 * Brand Kit v2 (SPEC §0.5) — design tokens for team workspaces.
 *
 * Each BrandKit encapsulates the identity a team applies across
 * every exported meme: fonts, colors, logo, watermark, footer text.
 */

export interface BrandKit {
  id: string;
  name: string;
  fonts: {
    heading: string;
    body: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    textOnImage: string;
    strokeOnImage: string;
  };
  logoDataUrl?: string;
  watermarkText?: string;
  footerText?: string;
}

export const DEFAULT_BRAND_KIT: BrandKit = {
  id: "default",
  name: "預設",
  fonts: {
    heading: "Geist Sans",
    body: "Geist Sans",
  },
  colors: {
    primary: "#A855F7",
    secondary: "#EC4899",
    accent: "#FFFFFF",
    textOnImage: "#FFFFFF",
    strokeOnImage: "#000000",
  },
  watermarkText: undefined,
  footerText: undefined,
};

export function createBrandKit(input: Partial<BrandKit> & { name: string }): BrandKit {
  return {
    id: input.id ?? `bk_${Date.now().toString(36)}`,
    name: input.name,
    fonts: input.fonts ?? DEFAULT_BRAND_KIT.fonts,
    colors: input.colors ?? DEFAULT_BRAND_KIT.colors,
    logoDataUrl: input.logoDataUrl,
    watermarkText: input.watermarkText,
    footerText: input.footerText,
  };
}

export function validateHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

export function mergeBrandKit(base: BrandKit, override: Partial<BrandKit>): BrandKit {
  return {
    id: override.id ?? base.id,
    name: override.name ?? base.name,
    fonts: { ...base.fonts, ...override.fonts },
    colors: { ...base.colors, ...override.colors },
    logoDataUrl: override.logoDataUrl ?? base.logoDataUrl,
    watermarkText: override.watermarkText ?? base.watermarkText,
    footerText: override.footerText ?? base.footerText,
  };
}

/**
 * Build a flat CSS custom-property map suitable for injecting into
 * a `<style>` tag or inline style on the export canvas.
 */
export function brandKitToCssVars(kit: BrandKit): Record<string, string> {
  return {
    "--bk-heading-font": kit.fonts.heading,
    "--bk-body-font": kit.fonts.body,
    "--bk-primary": kit.colors.primary,
    "--bk-secondary": kit.colors.secondary,
    "--bk-accent": kit.colors.accent,
    "--bk-text": kit.colors.textOnImage,
    "--bk-stroke": kit.colors.strokeOnImage,
  };
}
