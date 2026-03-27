// NOCTA PEPTIDES — Research Library Page
// Educational articles about research peptides, categories, and links to PubMed

import { useState } from 'react';
import { Link } from 'wouter';
import { BookOpen, ExternalLink, Search, FlaskConical } from 'lucide-react';

const ARTICLES = [
  {
    id: 'glp3-rt-overview',
    title: 'GLP-3 RT: Next-Generation Metabolic Research',
    category: 'Weight Loss',
    summary: 'An overview of GLP-3 RT\'s mechanism of action as a glucagon-like peptide receptor agonist and its implications for metabolic research and body composition studies.',
    readTime: '5 min',
    tags: ['GLP-3 RT', 'Metabolic', 'Weight Loss'],
  },
  {
    id: 'bpc157-tb500-synergy',
    title: 'BPC-157 & TB-500: Synergistic Recovery Mechanisms',
    category: 'Recovery',
    summary: 'Research examining the complementary mechanisms of BPC-157 and TB-500 in tissue repair, angiogenesis, and musculoskeletal recovery. The rationale behind the Wolverine Blend.',
    readTime: '7 min',
    tags: ['BPC-157', 'TB-500', 'Recovery', 'Wolverine Blend'],
  },
  {
    id: 'nad-plus-aging',
    title: 'NAD+ and the Hallmarks of Aging',
    category: 'Anti-Aging',
    summary: 'A comprehensive review of NAD+ biology, its decline with age, and the research evidence for NAD+ supplementation in cellular energy metabolism, DNA repair, and sirtuin activation.',
    readTime: '8 min',
    tags: ['NAD+', 'Anti-Aging', 'Longevity'],
  },
  {
    id: 'epithalon-telomeres',
    title: 'Epithalon and Telomere Biology',
    category: 'Anti-Aging',
    summary: 'Examining the research on Epithalon\'s telomerase-activating properties and its potential role in cellular aging, circadian rhythm regulation, and longevity research.',
    readTime: '6 min',
    tags: ['Epithalon', 'Telomeres', 'Anti-Aging'],
  },
  {
    id: 'semax-neuroprotection',
    title: 'Semax: Neuroprotection and Cognitive Enhancement Research',
    category: 'Cognitive',
    summary: 'A review of Semax\'s ACTH-derived structure, its effects on BDNF upregulation, neuroprotection, and the growing body of research on cognitive enhancement applications.',
    readTime: '6 min',
    tags: ['Semax', 'Cognitive', 'Neuroprotection'],
  },
  {
    id: 'ghk-cu-skin',
    title: 'GHK-Cu: Copper Peptide Research in Skin Biology',
    category: 'Anti-Aging',
    summary: 'An examination of GHK-Cu\'s role in collagen synthesis, wound healing, antioxidant activity, and its extensive research history in dermatology and anti-aging applications.',
    readTime: '5 min',
    tags: ['GHK-Cu', 'Skin', 'Anti-Aging'],
  },
  {
    id: 'peptide-storage',
    title: 'Peptide Storage and Reconstitution Guide',
    category: 'Technical',
    summary: 'Best practices for storing lyophilized peptides, proper reconstitution techniques using bacteriostatic water, and maintaining stability for research applications.',
    readTime: '4 min',
    tags: ['Storage', 'Reconstitution', 'BAC Water', 'Technical'],
  },
  {
    id: 'melanotan-photoprotection',
    title: 'Melanotan Peptides: Photoprotection Research',
    category: 'Sexual Health',
    summary: 'A comparative review of Melanotan I and II, their melanocortin receptor selectivity profiles, and the research evidence for photoprotective and other physiological effects.',
    readTime: '5 min',
    tags: ['Melanotan I', 'Melanotan II', 'Photoprotection'],
  },
  {
    id: 'cagrilintide-amylin',
    title: 'Cagrilintide: Long-Acting Amylin Analog Research',
    category: 'Weight Loss',
    summary: 'Research overview of Cagrilintide\'s amylin receptor agonism, its synergistic effects with GLP-1 receptor agonists, and implications for obesity and metabolic syndrome research.',
    readTime: '6 min',
    tags: ['Cagrilintide', 'Amylin', 'Weight Loss'],
  },
];

const CATEGORIES_FILTER = ['All', 'Weight Loss', 'Recovery', 'Anti-Aging', 'Cognitive', 'Sexual Health', 'Technical'];

export default function Research() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#1A3A4A]/5 flex items-center justify-center">
              <BookOpen size={20} className="text-[#1A3A4A]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Education</p>
              <h1 className="text-3xl font-extrabold text-[#1A3A4A] tracking-tight">Research Library</h1>
            </div>
          </div>
          <p className="text-gray-500 text-base max-w-2xl leading-relaxed">
            Educational resources on research peptides, mechanisms of action, and laboratory protocols.
            All content is for informational purposes only and does not constitute medical advice.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A3A4A] transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES_FILTER.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#1A3A4A] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(article => (
            <div key={article.id} className="bg-white border border-gray-100 rounded-xl p-6 hover:border-[#1A3A4A]/20 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#1A3A4A] bg-[#1A3A4A]/5 px-2.5 py-1 rounded-full">
                  {article.category}
                </span>
                <span className="text-xs text-gray-400">{article.readTime} read</span>
              </div>
              <h3 className="font-bold text-[#1A3A4A] text-base leading-tight mb-2">{article.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{article.summary}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {article.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <button
                  onClick={() => alert(`Full article on "${article.title}" coming soon. Check back for updates.`)}
                  className="text-sm text-[#1A3A4A] font-medium hover:underline flex items-center gap-1"
                >
                  Read Article <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">No articles found matching your search.</p>
          </div>
        )}

        {/* PubMed Banner */}
        <div className="mt-12 bg-[#1A3A4A] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <FlaskConical size={32} className="text-white/40 flex-shrink-0" />
            <div>
              <h3 className="text-white font-bold text-lg">Explore Primary Research</h3>
              <p className="text-white/60 text-sm mt-1">
                Access peer-reviewed studies on PubMed and Google Scholar for primary research literature.
              </p>
            </div>
          </div>
          <a
            href="https://pubmed.ncbi.nlm.nih.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#1A3A4A] font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            Visit PubMed <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
