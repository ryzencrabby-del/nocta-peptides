// NOCTA PEPTIDES — Contact Page

import { useState } from 'react';
import { Mail, Clock, MessageSquare, CheckCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Are your products safe for human use?',
    a: 'No. All Nocta Peptides products are strictly for in-vitro research and laboratory use only. They are not intended for human consumption, veterinary use, or any clinical application.',
  },
  {
    q: 'How do I request a Certificate of Analysis?',
    a: 'All COAs are available on our COA page. You can also email support@noctapeptides.com with your order number and the specific product batch number printed on your vial.',
  },
  {
    q: 'What is your shipping policy?',
    a: 'Orders are dispatched within 48 hours. We ship in temperature-controlled packaging to maintain product integrity. Free shipping on orders over $150. International shipping available to most countries.',
  },
  {
    q: 'How should I store my peptides?',
    a: 'Lyophilized peptides should be stored at -20°C in a freezer. Once reconstituted with BAC water, store at 2-8°C in a refrigerator and use within 30 days. Avoid repeated freeze-thaw cycles.',
  },
  {
    q: 'Do you offer bulk or wholesale pricing?',
    a: 'Yes. We offer volume discounts for qualified research institutions and licensed laboratories. Please contact orders@noctapeptides.com with your institution details and requirements.',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Get in Touch</p>
          <h1 className="text-3xl font-extrabold text-[#1A3A4A] tracking-tight">Contact Us</h1>
          <p className="text-gray-500 text-base mt-2 max-w-lg">
            Questions about products, orders, or research? Our team responds within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A3A4A]/5 flex items-center justify-center">
                  <Mail size={16} className="text-[#1A3A4A]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">General Support</p>
                  <a href="mailto:support@noctapeptides.com" className="text-sm font-semibold text-[#1A3A4A] hover:underline">
                    support@noctapeptides.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A3A4A]/5 flex items-center justify-center">
                  <Mail size={16} className="text-[#1A3A4A]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Orders & Shipping</p>
                  <a href="mailto:orders@noctapeptides.com" className="text-sm font-semibold text-[#1A3A4A] hover:underline">
                    orders@noctapeptides.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A3A4A]/5 flex items-center justify-center">
                  <Clock size={16} className="text-[#1A3A4A]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Response Time</p>
                  <p className="text-sm font-semibold text-[#1A3A4A]">Within 24 hours</p>
                  <p className="text-xs text-gray-400">Mon–Fri, 9am–6pm EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle size={48} className="text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-[#1A3A4A] mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-6 btn-navy px-5 py-2.5 rounded-md text-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors"
                    placeholder="Order inquiry, product question, etc."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <button type="submit" className="btn-navy px-6 py-3 rounded-md text-sm font-semibold flex items-center gap-2">
                  <MessageSquare size={14} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-[#1A3A4A] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#1A3A4A] text-sm">{faq.q}</span>
                  <span className="text-gray-400 ml-4 flex-shrink-0">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4">
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
