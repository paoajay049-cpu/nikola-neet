const courses = [
  {
    slug: "foundation-11th",
    number: "01",
    eyebrow: "CLASS 11",
    title: "Foundation 11th",
    copy: "Physics fundamentals से NEET level problem-solving तक एक मजबूत शुरुआत।",
    features: ["Live + recorded lectures", "Chapter-wise booklet PDFs", "DPPs & chapter tests"],
    validity: "1 year validity",
    price: "₹2,500",
    accent: "mint",
  },
  {
    slug: "foundation-12th",
    number: "02",
    eyebrow: "CLASS 12",
    title: "Foundation 12th",
    copy: "Boards और NEET—दोनों के लिए concept clarity और systematic practice।",
    features: ["Live + recorded lectures", "Chapter-wise booklet PDFs", "DPPs, PYQs & tests"],
    validity: "1 year validity",
    price: "₹2,500",
    accent: "blue",
  },
  {
    slug: "target-batch",
    number: "03",
    eyebrow: "NEET REPEATERS",
    title: "Target Batch",
    copy: "Focused revision, question practice और tests के साथ selection-oriented batch।",
    features: ["Live + recorded lectures", "Revision booklet PDFs", "DPPs & regular mock tests"],
    validity: "1 year validity",
    price: "₹2,500",
    accent: "lime",
  },
  {
    slug: "9th-pre-foundation",
    number: "04",
    eyebrow: "CLASS 9",
    title: "9th Pre-Foundation",
    copy: "Class 9 से 12 तक school Physics और future NEET preparation की complete foundation journey।",
    features: ["Live + recorded lectures", "Class-wise booklet PDFs", "DPPs & systematic tests"],
    validity: "4 year course · Class 9–12",
    price: "₹8,000",
    accent: "coral",
  },
  {
    slug: "10th-pre-foundation",
    number: "05",
    eyebrow: "CLASS 10",
    title: "10th Pre-Foundation",
    copy: "Class 10 से 12 तक concepts, problem-solving और NEET Physics की systematic तैयारी।",
    features: ["Live + recorded lectures", "Class-wise booklet PDFs", "DPPs & systematic tests"],
    validity: "3 year course · Class 10–12",
    price: "₹8,000",
    accent: "violet",
  },
];

const physicsFolders = [
  {
    number: "01",
    label: "NEET PHYSICS",
    title: "NEET Physics English Medium",
    copy: "Complete NEET Physics preparation in English Medium with structured study material and tests.",
    accent: "mint",
  },
  {
    number: "02",
    label: "NEET PHYSICS",
    title: "NEET Physics Hindi Medium",
    copy: "NEET Physics preparation in Hindi Medium with clear concepts, practice and exam-focused resources.",
    accent: "blue",
  },
  {
    number: "03",
    label: "JEE MAIN PHYSICS",
    title: "JEE Main Physics English Medium",
    copy: "JEE Main Physics resources in English Medium, organised for focused problem-solving practice.",
    accent: "lime",
  },
  {
    number: "04",
    label: "JEE MAIN PHYSICS",
    title: "JEE Main Physics Hindi Medium",
    copy: "JEE Main Physics resources in Hindi Medium, organised for concept clarity and practice.",
    accent: "violet",
  },
];

const materials = [
  { icon: "N", title: "Chapter Notes", copy: "Crisp theory, diagrams और classroom explanations—एक ही जगह।" },
  { icon: "D", title: "Daily Practice", copy: "हर lecture के बाद topic-wise DPP और selected questions।" },
  { icon: "P", title: "NEET PYQs", copy: "Previous year questions with step-by-step Physics solutions।" },
  { icon: "F", title: "Formula Sheets", copy: "Fast revision के लिए chapter-wise formulas और key results।" },
];

const tests = [
  { label: "Chapter Test", meta: "45 min · NEET pattern", value: "Topic mastery" },
  { label: "Part Syllabus Test", meta: "90 min · Mixed chapters", value: "Speed + accuracy" },
  { label: "Full Syllabus Mock", meta: "180 min · NTA pattern", value: "Exam simulation" },
];

const faqs = [
  {
    question: "क्या courses Hindi और English दोनों माध्यम में होंगे?",
    answer: "हाँ। Nikola NEET का लक्ष्य Physics को Hindi और English Medium—दोनों students के लिए सरल और exam-oriented बनाना है।",
  },
  {
    question: "Study material में क्या मिलेगा?",
    answer: "Chapter notes, lecture-wise DPP, selected NEET PYQs, formula sheets और practice assignments course plan के अनुसार दिए जाएंगे।",
  },
  {
    question: "Tests किस pattern पर होंगे?",
    answer: "Chapter, part-syllabus और full-syllabus tests NEET pattern तथा time-bound practice को ध्यान में रखकर बनाए जाएंगे।",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Nikola NEET home">
          <img className="brand-logo" src="/nikola-neet-logo.jpg" alt="" width="52" height="52" />
          <span>
            <strong>NIKOLA</strong>
            <small>NEET</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#courses">Courses</a>
          <a href="#material">Study Material</a>
          <a href="#tests">Test Papers</a>
          <a href="/learn">Student Portal</a>
          <a href="#about">About</a>
        </nav>
        <a className="header-cta" href="#enroll">Join a Batch <Arrow /></a>
        <details className="mobile-nav">
          <summary aria-label="Open navigation menu"><span /><span /><span /></summary>
          <div>
            <a href="#courses">Courses</a>
            <a href="#material">Study Material</a>
            <a href="#tests">Test Papers</a>
            <a href="/learn">Student Portal</a>
            <a href="#about">About Faculty</a>
          </div>
        </details>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span /> NEET PHYSICS · HINDI & ENGLISH</div>
            <h1>Physics समझो.<br /><em>Selection</em> के लिए<br />तैयार रहो.</h1>
            <p>
              Zero से NEET level तक—clear concepts, focused practice और
              structured tests के साथ Physics की पूरी तैयारी।
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#courses">Explore Courses <Arrow /></a>
              <a className="button secondary" href="#material"><span className="play">▶</span> Free Study Material</a>
            </div>
            <div className="trust-row">
              <div><strong>10+</strong><span>Years of<br />teaching</span></div>
              <div><strong>5</strong><span>Focused<br />programs</span></div>
              <div><strong>360°</strong><span>Learn, practise<br />& test</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Physics learning illustration">
            <div className="visual-glow" />
            <div className="orbit orbit-one"><span /></div>
            <div className="orbit orbit-two"><span /></div>
            <div className="orbit orbit-three"><span /></div>
            <div className="core logo-core">
              <img className="core-logo" src="/nikola-neet-logo.jpg" alt="Nikola NEET" width="166" height="166" />
            </div>
            <div className="formula-card formula-one"><small>Electrostatics</small><b>F = kq₁q₂/r²</b></div>
            <div className="formula-card formula-two"><small>Mechanics</small><b>F = ma</b></div>
            <div className="formula-card formula-three"><small>Modern Physics</small><b>E = hν</b></div>
            <div className="rank-card"><span>✓</span><div><small>Concept → Practice</small><strong>Test → Improve</strong></div></div>
          </div>
        </div>
        <div className="topic-rail" aria-label="Physics topics">
          <span>MECHANICS</span><i>✦</i><span>ELECTROSTATICS</span><i>✦</i><span>THERMODYNAMICS</span><i>✦</i><span>OPTICS</span><i>✦</i><span>MODERN PHYSICS</span>
        </div>
      </section>

      <section className="section physics-folders-section" id="physics-folders">
        <div className="section-heading split-heading">
          <div>
            <div className="eyebrow dark"><span /> PHYSICS FOLDERS</div>
            <h2>अपना exam और medium<br /><em>चुनें.</em></h2>
          </div>
          <p>NEET और JEE Main Physics resources को medium के अनुसार अलग-अलग folders में organised रखें।</p>
        </div>
        <div className="physics-folder-grid">
          {physicsFolders.map((folder) => (
            <a className={`physics-folder-card ${folder.accent}`} href="/learn" key={folder.title}>
              <div className="physics-folder-top">
                <span>{folder.label}</span>
                <b>{folder.number}</b>
              </div>
              <div className="physics-folder-icon" aria-hidden="true">PDF</div>
              <h3>{folder.title}</h3>
              <p>{folder.copy}</p>
              <span className="physics-folder-link">Open folder <Arrow /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="section courses-section" id="courses">
        <div className="section-heading split-heading">
          <div>
            <div className="eyebrow dark"><span /> CHOOSE YOUR PROGRAM</div>
            <h2>हर stage के लिए<br /><em>right Physics course.</em></h2>
          </div>
          <p>School foundation से NEET target तक—अपनी class और goal के अनुसार structured program चुनें।</p>
        </div>
        <div className="course-grid">
          {courses.map((course) => (
            <article className={`course-card ${course.accent}`} key={course.title}>
              <div className="course-top"><span>{course.eyebrow}</span><b>{course.number}</b></div>
              <h3>{course.title}</h3>
              <p>{course.copy}</p>
              <ul>
                {course.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}
              </ul>
              <div className="course-price"><span>{course.validity}</span><strong>{course.price}</strong></div>
              <a href={`/learn/${course.slug}`} aria-label={`Explore ${course.title}`}>Open complete course <Arrow /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="system-section">
        <div className="system-copy">
          <div className="eyebrow light"><span /> THE NIKOLA METHOD</div>
          <h2>सिर्फ lecture नहीं.<br /><em>Complete learning system.</em></h2>
          <p>हर chapter एक simple, repeatable cycle से complete होगा—ताकि concepts याद भी रहें और questions में apply भी हों।</p>
          <a href="#enroll" className="text-link">Start your preparation <Arrow /></a>
        </div>
        <div className="steps">
          <article><b>01</b><div><span>LEARN</span><h3>Concept Lecture</h3><p>Simple language, visual explanation और सही examples।</p></div></article>
          <article><b>02</b><div><span>PRACTISE</span><h3>DPP & Questions</h3><p>Lecture के तुरंत बाद graded practice questions।</p></div></article>
          <article><b>03</b><div><span>TEST</span><h3>Timed Assessment</h3><p>Chapter-wise NEET pattern test और self-check।</p></div></article>
          <article><b>04</b><div><span>IMPROVE</span><h3>Analysis & Revision</h3><p>Mistakes identify करें, revise करें और score बढ़ाएँ।</p></div></article>
        </div>
      </section>

      <section className="section material-section" id="material">
        <div className="section-heading centered">
          <div className="eyebrow dark"><span /> EVERYTHING YOU NEED</div>
          <h2>Study material जो पढ़ाई को<br /><em>simple और effective</em> बनाए.</h2>
        </div>
        <div className="material-grid">
          {materials.map((item) => (
            <article key={item.title}>
              <div className="material-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <a href="/learn" aria-label={`Explore ${item.title}`}>Explore <Arrow /></a>
            </article>
          ))}
        </div>
        <div className="material-banner">
          <div><span className="free-pill">FREE RESOURCE</span><h3>Physics Formula Revision Pack</h3><p>Important formulas, graphs और quick revision points—chapter-wise organised.</p></div>
          <a className="button light-button" href="/learn">Get access <Arrow /></a>
        </div>
      </section>

      <section className="test-section" id="tests">
        <div className="test-intro">
          <div className="eyebrow light"><span /> TEST. ANALYSE. IMPROVE.</div>
          <h2>Practice like the<br /><em>real NEET exam.</em></h2>
          <p>Regular tests आपकी speed, accuracy और exam temperament—तीनों को बेहतर बनाने के लिए designed हैं।</p>
          <div className="score-card">
            <div className="score-ring"><strong>92</strong><small>/100</small></div>
            <div><small>YOUR PROGRESS</small><strong>Strong concepts.<br />Better accuracy.</strong><span>Keep improving →</span></div>
          </div>
        </div>
        <div className="test-list">
          {tests.map((test, index) => (
            <article key={test.label}>
              <b>0{index + 1}</b>
              <div><h3>{test.label}</h3><p>{test.meta}</p></div>
              <span>{test.value}</span>
              <a href="mailto:hello@nikolaneet.com?subject=Nikola%20NEET%20Test%20Series" aria-label={`Request ${test.label}`}><Arrow /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="quote-mark">“</div>
        <blockquote>Physics कठिन नहीं है.<br />उसे <em>सही क्रम और सही भाषा</em> में<br />समझना जरूरी है.</blockquote>
        <div className="faculty">
          <div className="faculty-monogram">AY</div>
          <div><strong>Ajay Yadav</strong><span>Founder & Physics Faculty · Nikola NEET</span></div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="faq-title">
          <div className="eyebrow dark"><span /> QUICK ANSWERS</div>
          <h2>अक्सर पूछे जाने<br /><em>वाले सवाल.</em></h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary>{faq.question}<span>+</span></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="enroll-section" id="enroll">
        <div className="enroll-orbit orbit-a" />
        <div className="enroll-orbit orbit-b" />
        <div className="enroll-content">
          <span>ADMISSIONS OPENING SOON</span>
          <h2>अपनी NEET Physics<br />preparation <em>आज से शुरू करें.</em></h2>
          <p>Course launch, free classes और study material की updates सबसे पहले पाएँ।</p>
          <div className="enroll-actions">
            <a className="button white" href="mailto:hello@nikolaneet.com?subject=Nikola%20NEET%20Course%20Enquiry">Contact Nikola NEET <Arrow /></a>
            <a className="button outline-white" href="#courses">View all courses</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <a className="brand inverse" href="#top" aria-label="Nikola NEET home"><img className="brand-logo footer-logo" src="/nikola-neet-logo.jpg" alt="" width="62" height="62" /><span><strong>NIKOLA</strong><small>NEET</small></span></a>
          <p>Making Physics simple, structured and selection-focused.</p>
        </div>
        <div><strong>Explore</strong><a href="#courses">Courses</a><a href="/learn">Study Portal</a><a href="#tests">Test Papers</a></div>
        <div><strong>Programs</strong><a href="#courses">Class 11</a><a href="#courses">Class 12</a><a href="#courses">Target Batch</a><a href="#courses">Pre-Foundation</a></div>
        <div><strong>Connect</strong><a href="mailto:hello@nikolaneet.com">Email us</a><a href="#enroll">Admissions</a><a href="#about">About Faculty</a></div>
        <div className="footer-bottom"><span>© 2026 Nikola NEET. All rights reserved.</span><span>nikolaneet.com</span></div>
      </footer>
    </main>
  );
}
