// NOCTA PEPTIDES — Partner Program Page

import { useState } from 'react';
import { CheckCircle, Users, TrendingUp, Award, Mail } from 'lucide-react';

const TIERS = [
  {
    name: 'Associate',
    commission: '10%',
    minVolume: '$0',
    perks: ['Custom referral link', 'Monthly payouts', 'Partner dashboard access', 'Email support'],
    color: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-600',
  },
  {
    name: 'Research Partner',
    commission: '15%',
    minVolume: '$1,000/mo',
    perks: ['Everything in Associate', 'Priority support', 'Exclusive product previews', 'Co-branded materials', 'Quarterly bonus'],
    color: 'border-[#1A3A4A]',
    badge: 'bg-[#1A3A4A] text-white',
    featured: true,
  },
  {
    name: 'Elite Partner',
    commission: '20%',
    minVolume: '$5,000/mo',
    perks: ['Everything in Research Partner', 'Dedicated account manager', 'Custom pricing', 'White-label options', 'Annual retreat invitation'],
    color: 'border-amber-300',
    badge: 'bg-amber-500 text-white',
  },
];

const BENEFITS = [
  {
    icon: <TrendingUp size={20} className="text-[#1A3A4A]" />,
    title: 'Competitive Commissions',
    desc: 'Earn 10–20% commission on every referred sale. Commissions are tracked in real-time and paid monthly.',
  },
  {
    icon: <Users size={20} className="text-[#1A3A4A]" />,
    title: 'Dedicated Support',
    desc: 'Research Partner and Elite tiers receive dedicated account managers and priority support.',
  },
  {
    icon: <Award size={20} className="text-[#1A3A4A]" />,
    title: 'Premium Materials',
    desc: 'Access to co-branded marketing materials, product photography, and educational content.',
  },
];

export default function Partner() {
  const [form, setForm] = useState({ name: '', email: '', institution: '', website: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Collaborate</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A3A4A] tracking-tight mb-4">Partner Program</h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            Join the Nocta Peptides partner network. Earn competitive commissions by referring
            qualified researchers and institutions to our premium compound catalog.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {BENEFITS.map(b => (
            <div key={b.title} className="bg-gray-50 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center mb-3 shadow-sm">
                {b.icon}
              </div>
              <h3 className="font-bold text-[#1A3A4A] text-sm mb-1">{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Tiers */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-[#1A3A4A] text-center mb-8">Partner Tiers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TIERS.map(tier => (
              <div key={tier.name} className={`border-2 ${tier.color} rounded-xl p-6 relative ${tier.featured ? 'shadow-lg' : ''}`}>
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A3A4A] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#1A3A4A] text-base">{tier.name}</h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tier.badge}`}>{tier.commission}</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">Min. volume: {tier.minVolume}</p>
                <ul className="space-y-2">
                  {tier.perks.map(perk => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-[#1A3A4A] mb-6 text-center">Apply to Partner</h2>
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1A3A4A] mb-2">Application Received!</h3>
              <p className="text-gray-500 text-sm">Our partner team will review your application and respond within 2–3 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Full Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors" placeholder="Dr. Jane Smith" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors" placeholder="jane@university.edu" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Institution / Organization</label>
                <input type="text" value={form.institution} onChange={e => setForm({...form, institution: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors" placeholder="University, lab, or organization name" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Website / Social Profile</label>
                <input type="url" value={form.website} onChange={e => setForm({...form, website: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors" placeholder="https://yoursite.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Tell Us About Your Research / Audience</label>
                <textarea rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors resize-none"
                  placeholder="Describe your research focus, audience size, and how you plan to promote Nocta Peptides..." />
              </div>
              <button type="submit" className="w-full btn-navy py-3 rounded-md text-sm font-semibold flex items-center justify-center gap-2">
                <Mail size={14} /> Submit Application
              </button>
              <p className="text-xs text-gray-400 text-center">
                Questions? Email <a href="mailto:partners@noctapeptides.com" className="text-[#1A3A4A] hover:underline">partners@noctapeptides.com</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
