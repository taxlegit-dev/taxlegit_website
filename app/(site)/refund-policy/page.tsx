import LegalPage from "@/components/pages/legal/LegalPage";
import { refundPolicyData } from "@/components/pages/legal/refund-policy-data";
import Footer from "@/components/footer";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-[72px]"></div>
      <LegalPage {...refundPolicyData} />
      <Footer />
    </div>
  );
}
