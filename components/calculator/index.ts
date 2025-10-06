/**
 * Stella's Ink Chamber - Instant SMP Price Calculator
 * Canonical Public API
 * 
 * APPROVED IMPORTS ONLY
 * All calculator functionality must be imported from this file.
 * Direct imports from internal files are forbidden and will fail CI.
 * 
 * @see /outputs/calculator/component-inventory.md for full architecture
 */

// Main Calculator Component (use this for all embeddings)
export { default as InstantQuote } from './InstantQuote';
export type { InstantQuoteProps } from './InstantQuote';

// UI Components (for custom implementations only)
export { default as OptionCard } from './OptionCard';
export type { OptionCardProps } from './OptionCard';

export { default as ProgressBar } from './ProgressBar';
export type { ProgressBarProps } from './ProgressBar';

export { default as ResultPanel } from './ResultPanel';
export type { ResultPanelProps } from './ResultPanel';

export { default as StickyCTA } from './StickyCTA';
export type { StickyCTAProps } from './StickyCTA';

// Inline Embedding Wrapper
export { default as InlineBlock } from './InlineBlock';
export type { InlineBlockProps } from './InlineBlock';

// Step Components (INTERNAL USE ONLY - imported by InstantQuote.tsx)
// DO NOT IMPORT THESE DIRECTLY
// They are exported only for type checking and testing
export { default as Step1Gender } from './Step1Gender';
export { default as Step2HairSituation } from './Step2HairSituation';
export { default as Step3Coverage } from './Step3Coverage';
export { default as Step4Finish } from './Step4Finish';
export { default as Step5Timing } from './Step5Timing';
export { default as Step6Addons } from './Step6Addons';
export { default as Step7Contact } from './Step7Contact';

/**
 * Usage Examples:
 * 
 * // CORRECT - Use InstantQuote for all calculator embeds
 * import { InstantQuote } from '@/components/calculator';
 * 
 * <InstantQuote
 *   mode="inline"
 *   variant="guide"
 *   prefill={{ topic: 'women' }}
 *   onComplete={(estimate, inputs) => console.log(estimate)}
 * />
 * 
 * // WRONG - Do not import step components directly
 * import Step1Gender from '@/components/calculator/Step1Gender'; // ❌ CI will fail
 * 
 * // WRONG - Do not import from quarantined legacy files
 * import { OldStep } from '../legacy-folder/Step1'; // ❌ CI will fail
 */
