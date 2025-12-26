import LegalPage from '@/components/pages/legal/LegalPage';
import { termsAndConditionsData } from '@/components/pages/legal/terms-and-conditions-data';

export default function TermsConditions() {
  return <LegalPage {...termsAndConditionsData} />;
}
