import LegalPage from '@/components/pages/legal/LegalPage';
import { refundPolicyData } from '@/components/pages/legal/refund-policy-data';

export default function RefundPolicy() {
  return <LegalPage {...refundPolicyData} />;
}
