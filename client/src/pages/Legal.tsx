// NOCTA PEPTIDES — Legal Pages (Terms, Privacy, Disclaimer, Shipping)

import { useRoute } from 'wouter';

const LEGAL_CONTENT: Record<string, { title: string; content: React.ReactNode }> = {
  terms: {
    title: 'Terms of Service',
    content: (
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p className="text-gray-400 text-xs">Last updated: January 2026</p>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using the Nocta Peptides website and purchasing our products, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">2. Research Use Only</h2>
          <p>All products sold by Nocta Peptides are strictly for in-vitro research and laboratory use by qualified researchers. These products are not approved by the FDA and are not intended for human consumption, veterinary use, or any clinical, therapeutic, or diagnostic application. By purchasing, you confirm you are a qualified researcher and will use products solely for lawful research purposes.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">3. Age Requirement</h2>
          <p>You must be at least 18 years of age to purchase from Nocta Peptides. By placing an order, you confirm you meet this requirement.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">4. Orders and Payment</h2>
          <p>All orders are subject to product availability. We reserve the right to refuse or cancel any order at our discretion. Prices are subject to change without notice. Payment is processed securely via SSL-encrypted connections.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">5. Shipping and Returns</h2>
          <p>Orders are dispatched within 48 hours of payment confirmation. Due to the nature of research compounds, we do not accept returns on opened products. Damaged or incorrect items must be reported within 48 hours of receipt.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">6. Limitation of Liability</h2>
          <p>Nocta Peptides shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or misuse of our products. Our liability is limited to the purchase price of the product.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">7. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:support@noctapeptides.com" className="text-[#1A3A4A] underline">support@noctapeptides.com</a>.</p>
        </section>
      </div>
    ),
  },
  privacy: {
    title: 'Privacy Policy',
    content: (
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p className="text-gray-400 text-xs">Last updated: January 2026</p>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly, including name, email address, shipping address, and payment information. We also collect usage data such as pages visited, browser type, and IP address.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">2. How We Use Your Information</h2>
          <p>We use your information to process orders, communicate about your purchases, improve our services, and comply with legal obligations. We do not sell your personal information to third parties.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">3. Data Security</h2>
          <p>We implement industry-standard security measures including SSL encryption for all transactions. Payment card data is processed by PCI-compliant payment processors and is never stored on our servers.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">4. Cookies</h2>
          <p>We use cookies to maintain cart state and improve user experience. You may disable cookies in your browser settings, though this may affect site functionality.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:support@noctapeptides.com" className="text-[#1A3A4A] underline">support@noctapeptides.com</a> to exercise these rights.</p>
        </section>
      </div>
    ),
  },
  disclaimer: {
    title: 'Research Disclaimer',
    content: (
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p className="text-gray-400 text-xs">Last updated: January 2026</p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 font-semibold text-sm">Important Notice</p>
          <p className="text-amber-700 text-sm mt-1">All products sold by Nocta Peptides are for research use only. They are not drugs, supplements, or approved for human use.</p>
        </div>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">Research Use Statement</h2>
          <p>All peptides, compounds, and related products offered by Nocta Peptides are intended exclusively for in-vitro research and laboratory use by qualified scientists and researchers. These products have not been evaluated by the Food and Drug Administration (FDA) or any other regulatory body.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">Not for Human Consumption</h2>
          <p>These products are NOT intended for human consumption, injection, or any form of self-administration. They are NOT intended for veterinary use. They are NOT dietary supplements, drugs, or medical devices. Any use outside of controlled laboratory research is strictly prohibited and may be illegal.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">Purchaser Responsibility</h2>
          <p>By purchasing from Nocta Peptides, you acknowledge that you are a qualified researcher, that you will comply with all applicable laws and regulations, and that you accept full responsibility for the safe and lawful use of these compounds.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">No Medical Advice</h2>
          <p>Nothing on this website constitutes medical advice. The information provided is for educational purposes only. Always consult a qualified healthcare professional for medical guidance.</p>
        </section>
      </div>
    ),
  },
  shipping: {
    title: 'Shipping Policy',
    content: (
      <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
        <p className="text-gray-400 text-xs">Last updated: January 2026</p>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">Processing Time</h2>
          <p>Orders are processed and dispatched within 48 business hours of payment confirmation. Orders placed on weekends or holidays are processed the next business day.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">Shipping Rates</h2>
          <p>Standard shipping is $12.99 for orders under $150. Free shipping is available on all orders of $150 or more. Expedited shipping options are available at checkout.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">Packaging</h2>
          <p>All orders are shipped in discreet, plain packaging with no indication of contents on the outside. Products are shipped in temperature-controlled packaging to maintain integrity during transit.</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">International Shipping</h2>
          <p>We ship to most countries worldwide. International customers are responsible for any customs duties, taxes, or import fees. Delivery times vary by destination (typically 7–21 business days).</p>
        </section>
        <section>
          <h2 className="text-[#1A3A4A] font-bold text-base mb-2">Tracking</h2>
          <p>Tracking information is emailed upon dispatch. Contact <a href="mailto:orders@noctapeptides.com" className="text-[#1A3A4A] underline">orders@noctapeptides.com</a> for shipping inquiries.</p>
        </section>
      </div>
    ),
  },
};

export default function Legal() {
  const [matchTerms] = useRoute('/terms');
  const [matchPrivacy] = useRoute('/privacy');
  const [matchDisclaimer] = useRoute('/disclaimer');
  const [matchShipping] = useRoute('/shipping');

  const key = matchTerms ? 'terms' : matchPrivacy ? 'privacy' : matchDisclaimer ? 'disclaimer' : matchShipping ? 'shipping' : 'terms';
  const page = LEGAL_CONTENT[key];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Legal</p>
          <h1 className="text-3xl font-extrabold text-[#1A3A4A] tracking-tight">{page.title}</h1>
        </div>
        {page.content}
      </div>
    </div>
  );
}
