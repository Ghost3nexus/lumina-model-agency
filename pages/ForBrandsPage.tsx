/**
 * ForBrandsPage — LUMINA MODEL AGENCY B2B landing page.
 *
 * Conversion engine for brand inquiries. Multi-step form is the CVR heart.
 *
 * Spec: docs/design/MASTER-claude-design-prompt.md §4-4
 * Decision: Council 2026-04-19 (論点2: Campaign価格非表示, 論点8: form Phase1必須)
 * Phase 1 launch target: 2026-05-10
 *
 * Phase 1 scope:
 *   - All 9 sections UI
 *   - EN/JP bilingual via LanguageContext + localStorage persistence
 *   - Multi-step form with client-side validation + console.log submit
 *   - Phase 2: /api/inquiry + Supabase + Slack + Resend
 */

import { useCallback } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import LuminaHeader from '../components/lumina/LuminaHeader';
import LuminaFooter from '../components/lumina/LuminaFooter';
import ForBrandsHero from '../components/lumina/ForBrandsHero';
import ServicesSection from '../components/lumina/ServicesSection';
import HowItWorks from '../components/lumina/HowItWorks';
import CaseStudies from '../components/lumina/CaseStudies';
import PricingTable from '../components/lumina/PricingTable';
import MultiStepForm from '../components/lumina/MultiStepForm';
import FAQAccordion from '../components/lumina/FAQAccordion';
import TrustBar from '../components/lumina/TrustBar';
import FooterCTA from '../components/lumina/FooterCTA';

const FORM_ID = 'inquiry';

function ForBrandsContent() {
  const scrollToForm = useCallback(() => {
    document.getElementById(FORM_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToPricing = useCallback(() => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="min-h-screen bg-[#050508] text-[#FAFAFA] font-sans antialiased">
      <LuminaHeader onBookClick={scrollToForm} />

      <main>
        <ForBrandsHero
          onInquiryClick={scrollToForm}
          onPricingClick={scrollToPricing}
        />
        <ServicesSection onCampaignInquire={scrollToForm} />
        <HowItWorks />
        <CaseStudies />
        <PricingTable
          onInquiryClick={scrollToForm}
          onCampaignInquire={scrollToForm}
        />
        <MultiStepForm formId={FORM_ID} />
        <FAQAccordion />
        <TrustBar />
        <FooterCTA />
      </main>

      <LuminaFooter />
    </div>
  );
}

export default function ForBrandsPage() {
  return (
    <LanguageProvider>
      <ForBrandsContent />
    </LanguageProvider>
  );
}
