// NOCTA PEPTIDES — Legal Pages (Terms, Privacy, Disclaimer, Shipping)

import { useRoute } from 'wouter';

const BG = '#05080f';
const CARD = '#0c1228';
const BLUE = '#00b8ff';
const TEXT = '#dff0ff';
const MUTED = 'rgba(223, 240, 255, 0.55)';
const DIM = 'rgba(223, 240, 255, 0.35)';
const BORDER = 'rgba(0, 184, 255, 0.08)';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2
        className="text-base font-bold mb-3 pb-2"
        style={{ color: TEXT, fontFamily: "'Space Grotesk', sans-serif", borderBottom: `1px solid ${BORDER}` }}
      >
        {title}
      </h2>
      <div className="text-sm leading-relaxed space-y-3" style={{ color: MUTED }}>
        {children}
      </div>
    </section>
  );
}

const LEGAL_CONTENT: Record<string, { title: string; content: React.ReactNode }> = {
  terms: {
    title: 'Terms of Service',
    content: (
      <div className="space-y-8">
        <p className="text-xs" style={{ color: DIM }}>Last updated: April 2026</p>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using the Nocta Peptides website and purchasing our products, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        </Section>

        <Section title="2. Research Use Only">
          <p>All products sold by Nocta Peptides are strictly for in-vitro research and laboratory use by qualified researchers. These products are not approved by the FDA and are <strong style={{ color: TEXT }}>not intended for human consumption, veterinary use, food use, drug use, or any clinical, therapeutic, or diagnostic application</strong>.</p>
          <p>By purchasing, you confirm you are a qualified researcher and will use products solely for lawful research purposes in compliance with all applicable federal, state, and local laws and regulations.</p>
        </Section>

        <Section title="3. Age Requirement">
          <p>You must be at least <strong style={{ color: TEXT }}>18 years of age</strong> to purchase from Nocta Peptides. By placing an order, you confirm you meet this requirement. We reserve the right to cancel any order where we have reason to believe the purchaser is a minor.</p>
        </Section>

        <Section title="4. Buyer Legal Responsibility">
          <p>The buyer assumes full legal responsibility for compliance with all applicable local, state, federal, and international laws regarding the purchase, possession, and use of research compounds. Nocta Peptides makes no representation that these products are legal in any particular jurisdiction.</p>
          <p>It is the buyer's sole responsibility to verify the legality of purchasing these products in their jurisdiction before placing an order. By completing a purchase, you confirm that the purchase and receipt of these products is legal in your jurisdiction.</p>
        </Section>

        <Section title="5. Orders, Payment, and Returns">
          <p>All orders are subject to product availability. We reserve the right to refuse or cancel any order at our discretion. Prices are subject to change without notice. Payment is processed securely via SSL-encrypted connections.</p>
          <p><strong style={{ color: TEXT }}>All sales are final.</strong> Due to the nature of research compounds, we do not accept returns or issue refunds except in the following circumstances: (a) the product arrives damaged; (b) an incorrect product was shipped. Damaged or incorrect items must be reported with photographic evidence within 48 hours of receipt by emailing orders@noctapeptides.com.</p>
        </Section>

        <Section title="6. Shipping">
          <p>Orders are dispatched within 48 business hours of payment confirmation. International customers are responsible for any customs duties, taxes, or import fees. Nocta Peptides is not responsible for packages seized by customs authorities.</p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>Nocta Peptides shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the purchase, possession, or <strong style={{ color: TEXT }}>misuse</strong> of our products. By purchasing, you acknowledge that you are solely responsible for any harm resulting from improper use of these compounds.</p>
          <p>Our total liability in any circumstance is limited to the purchase price of the specific product giving rise to the claim.</p>
        </Section>

        <Section title="8. Contact">
          <p>For questions about these terms, contact us at{' '}
            <a href="mailto:support@noctapeptides.com" style={{ color: BLUE, textDecoration: 'underline' }}>support@noctapeptides.com</a>.
          </p>
        </Section>
      </div>
    ),
  },

  privacy: {
    title: 'Privacy Policy',
    content: (
      <div className="space-y-8">
        <p className="text-xs" style={{ color: DIM }}>Last updated: April 2026</p>

        <Section title="1. Information We Collect">
          <p>We collect the following categories of personal information when you place an order or interact with our website:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong style={{ color: TEXT }}>Identity data:</strong> full name</li>
            <li><strong style={{ color: TEXT }}>Contact data:</strong> email address, phone number</li>
            <li><strong style={{ color: TEXT }}>Shipping data:</strong> delivery address</li>
            <li><strong style={{ color: TEXT }}>Payment data:</strong> payment method information (processed by PCI-compliant processors; card details are never stored on our servers)</li>
            <li><strong style={{ color: TEXT }}>Technical data:</strong> IP address, browser type, pages visited, session duration</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>Your personal data is used exclusively for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Processing and fulfilling your order</li>
            <li>Sending order confirmations and shipping notifications</li>
            <li>Responding to customer service inquiries</li>
            <li>Complying with legal and regulatory obligations</li>
          </ul>
          <p className="mt-3"><strong style={{ color: TEXT }}>We do not sell, rent, or share your personal information with third parties</strong> for marketing purposes. Data is shared only with service providers necessary to fulfill your order (e.g., payment processors, shipping carriers).</p>
        </Section>

        <Section title="3. Data Security">
          <p>We implement industry-standard security measures including SSL/TLS encryption for all data transmissions. Payment card data is processed by PCI-DSS-compliant payment processors and is never stored on our servers.</p>
        </Section>

        <Section title="4. Cookie Usage">
          <p>We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Maintain your shopping cart state across sessions</li>
            <li>Remember your preferences</li>
            <li>Analyze site traffic and usage patterns (anonymized)</li>
          </ul>
          <p className="mt-3">You may disable cookies in your browser settings. Disabling cookies may affect cart functionality and site experience. We do not use cookies for targeted advertising.</p>
        </Section>

        <Section title="5. Your Rights (GDPR & CCPA)">
          <p><strong style={{ color: TEXT }}>GDPR (EU/EEA residents):</strong> You have the right to access, rectify, erase, restrict processing of, and port your personal data. You also have the right to object to processing and to withdraw consent at any time. To exercise these rights, contact us at support@noctapeptides.com.</p>
          <p><strong style={{ color: TEXT }}>CCPA (California residents):</strong> You have the right to know what personal information we collect and how it is used, the right to delete your personal information, and the right to opt out of the sale of personal information. We do not sell personal information. To submit a request, contact support@noctapeptides.com.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes. Order records are retained for a minimum of 7 years for tax and legal compliance.</p>
        </Section>

        <Section title="7. Contact">
          <p>For privacy inquiries or to exercise your rights, contact:{' '}
            <a href="mailto:support@noctapeptides.com" style={{ color: BLUE, textDecoration: 'underline' }}>support@noctapeptides.com</a>.
          </p>
        </Section>
      </div>
    ),
  },

  disclaimer: {
    title: 'Research Disclaimer',
    content: (
      <div className="space-y-8">
        <p className="text-xs" style={{ color: DIM }}>Last updated: April 2026</p>

        {/* Warning block */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'rgba(0, 184, 255, 0.05)', border: '1px solid rgba(0, 184, 255, 0.2)' }}
        >
          <p className="font-bold text-sm mb-2" style={{ color: BLUE, fontFamily: "'Space Grotesk', sans-serif" }}>Important Notice</p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(223, 240, 255, 0.65)' }}>
            All products sold by Nocta Peptides are for research use only. They are not drugs, supplements, food products, or approved for human use in any form.
          </p>
        </div>

        <Section title="FDA Statement">
          <p><strong style={{ color: TEXT }}>These products have not been evaluated by the Food and Drug Administration (FDA).</strong> These products are not intended to diagnose, treat, cure, or prevent any disease. No claims are made regarding the safety, efficacy, or therapeutic value of any compound sold by Nocta Peptides.</p>
        </Section>

        <Section title="Research Use Statement">
          <p>All peptides, compounds, and related products offered by Nocta Peptides are intended exclusively for <strong style={{ color: TEXT }}>in-vitro research and laboratory use</strong> by qualified scientists and researchers. These compounds must be handled in appropriate laboratory settings by personnel with relevant scientific training and equipment.</p>
          <p>Use outside of controlled laboratory research environments is strictly prohibited and may be illegal.</p>
        </Section>

        <Section title="Not for Human Consumption">
          <p>These products are <strong style={{ color: TEXT }}>NOT</strong> intended for:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Human consumption, injection, or any form of self-administration</li>
            <li>Veterinary use</li>
            <li>Use as dietary supplements, drugs, or medical devices</li>
            <li>Any clinical, therapeutic, or diagnostic application</li>
          </ul>
        </Section>

        <Section title="Laboratory Handling Requirements">
          <p>These compounds <strong style={{ color: TEXT }}>must be handled by qualified researchers</strong> in appropriate laboratory settings with suitable safety equipment and protocols. Proper PPE, containment, and disposal procedures must be followed in accordance with applicable laboratory safety regulations.</p>
        </Section>

        <Section title="Purchaser Acknowledgment">
          <p>By purchasing from Nocta Peptides, you explicitly acknowledge and confirm that:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>You are a qualified researcher with appropriate scientific knowledge and laboratory access</li>
            <li>You will use all products in compliance with all applicable local, state, federal, and international laws and regulations</li>
            <li>You accept full legal and personal responsibility for the safe, lawful, and appropriate use of these compounds</li>
            <li>You are 18 years of age or older</li>
            <li>The purchase and possession of these products is legal in your jurisdiction</li>
          </ul>
        </Section>

        <Section title="No Medical Advice">
          <p>Nothing on this website constitutes medical advice. All information provided is for educational and informational purposes only. Always consult a qualified healthcare professional for medical guidance.</p>
        </Section>

        <Section title="Contact">
          <p>For questions about this disclaimer, contact:{' '}
            <a href="mailto:support@noctapeptides.com" style={{ color: BLUE, textDecoration: 'underline' }}>support@noctapeptides.com</a>.
          </p>
        </Section>
      </div>
    ),
  },

  shipping: {
    title: 'Shipping Policy',
    content: (
      <div className="space-y-8">
        <p className="text-xs" style={{ color: DIM }}>Last updated: April 2026</p>

        <Section title="Processing Time">
          <p>Orders are processed and dispatched within 48 business hours of payment confirmation. Orders placed on weekends or public holidays are processed the next business day.</p>
        </Section>

        <Section title="Shipping Rates">
          <p>Standard shipping is $4.99 for orders under $150. Free shipping is available on all orders of $150 or more. Expedited and overnight shipping options are available at checkout.</p>
        </Section>

        <Section title="Packaging">
          <p>All orders are shipped in discreet, plain packaging with no indication of contents on the outside of the package. Products are shipped in temperature-controlled packaging to maintain compound integrity during transit.</p>
        </Section>

        <Section title="International Shipping">
          <p>We ship to most countries worldwide. International customers are responsible for any customs duties, taxes, or import fees. Delivery times vary by destination (typically 7–21 business days). Nocta Peptides is not responsible for packages seized by customs authorities.</p>
        </Section>

        <Section title="Tracking">
          <p>Tracking information is emailed upon dispatch. For shipping inquiries, contact{' '}
            <a href="mailto:orders@noctapeptides.com" style={{ color: BLUE, textDecoration: 'underline' }}>orders@noctapeptides.com</a>.
          </p>
        </Section>
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
    <div className="min-h-screen" style={{ background: BG }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'rgba(0, 184, 255, 0.5)', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Legal
          </p>
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: TEXT, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {page.title}
          </h1>
        </div>
        <div
          className="rounded-2xl p-8"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}
        >
          {page.content}
        </div>
      </div>
    </div>
  );
}
