import { Page, Download } from '@playwright/test';
import { WebActions } from '../../../../../core/webactions/webActions';

/**
 * PDF Download/Popup handler interface
 */
export interface PDFInteractionResult {
  download: Download | null;
  popup: Page | null;
}

/**
 * Handles PDF link clicks that may result in either a download or popup
 * Uses WebActions layer to maintain architectural consistency
 *
 * @param webActions - WebActions instance (not raw page)
 * @param clickAction - The async function that performs the click
 * @returns Object containing download or popup (one will be null)
 */
export async function handlePDFInteraction(
  webActions: WebActions,
  clickAction: () => Promise<void>
): Promise<PDFInteractionResult> {
  return await webActions.handlePDFInteraction(clickAction);
}
