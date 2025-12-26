import LegalPage from '@/components/pages/legal/LegalPage';
import { privacyPolicyData } from '@/components/pages/legal/privacy-policy-data';

export default function PrivacyPolicy() {
  return <LegalPage {...privacyPolicyData} />;
}
