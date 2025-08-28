export interface PromoModalSelectors {
  modalContainer: string;
  overlay: string;
  modalContent: string;
  closeButton: string;
  title: string;
  ctaButton: string;
}

export const promoModalSelectors: PromoModalSelectors = {
  // Specific selectors for promotional modal based on real HTML
  modalContainer: 'section:has(div.fixed.w-full.h-full.z-50)',
  overlay: 'div.bg-blue-1\\/80.fixed.w-full.h-full.z-40',
  modalContent: 'div.fixed.z-50.top-1\\/2.left-1\\/2',
  closeButton:
    'section:has(h4:text("Prevendite aperte per Demon Slayer")) button.btn-rounded.size-10',
  title: 'h4:has-text("Prevendite aperte per Demon Slayer")',
  ctaButton: 'a.btn:has-text("Acquista")',
};
