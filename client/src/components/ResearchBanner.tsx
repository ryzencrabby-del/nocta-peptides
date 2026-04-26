// NOCTA PEPTIDES — Research Warning Banner
// Dark styled, blue accent — shown at very top of every page

export default function ResearchBanner() {
  return (
    <div className="research-banner">
      <span style={{ color: '#00b8ff', fontWeight: 700 }}>⚠ Research Use Only</span>
      {' — Not for human consumption. '}
      <a href="/disclaimer" style={{ color: '#00b8ff', textDecoration: 'underline', fontWeight: 500 }}>Learn More</a>
    </div>
  );
}
