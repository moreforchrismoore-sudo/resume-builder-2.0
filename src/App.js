import { useState } from "react";

// ─── Google Font (Nunito for UI, resume uses Calibri stack) ───────────────────
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap";

const STEP_LABELS = ["Personal", "School", "Experience", "Skills & More"];

const INITIAL_FORM = {
  name: "", email: "", phone: "", city: "", state: "", targetRole: "",
  school: "", gradYear: "", gpa: "", coursework: "", honors: "",
  jobs: [{ title: "", company: "", dates: "", bullets: "" }],
  activities: "", sports: "", volunteering: "", skills: "", awards: "", certifications: "", languages: "",
};

// ─── Shared styles ────────────────────────────────────────────────────────────
const UI_FONT = "'Nunito', sans-serif";
const NAV = "#0f4c81";    // deep navy
const ACC = "#e8a020";    // warm amber
const LIGHT = "#f0f6ff";
const CARD_BG = "#ffffff";

const inputStyle = {
  width: "100%", padding: "10px 13px", border: "1.5px solid #d0dbe8",
  borderRadius: 8, fontFamily: UI_FONT, fontSize: 14,
  background: "#f8fbff", color: "#1a2a3a", outline: "none",
  boxSizing: "border-box", transition: "border-color 0.2s",
};
const taStyle = { ...inputStyle, minHeight: 84, resize: "vertical", lineHeight: 1.55 };

function Field({ label, hint, children, half }) {
  return (
    <div style={{ marginBottom: 18, ...(half && {}) }}>
      <label style={{ display: "block", fontFamily: UI_FONT, fontSize: 12, fontWeight: 700,
        color: NAV, marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </label>
      {hint && <div style={{ fontSize: 11.5, color: "#7a8fa6", marginBottom: 5, fontFamily: UI_FONT }}>{hint}</div>}
      {children}
    </div>
  );
}

function ProgressBar({ step }) {
  const steps = ["personal", "education", "experience", "extras"];
  const idx = steps.indexOf(step);
  if (idx === -1) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
            background: i < idx ? NAV : i === idx ? ACC : "#dde8f2",
            color: i <= idx ? (i < idx ? "#fff" : NAV) : "#8aa",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: UI_FONT, fontWeight: 800, fontSize: 13,
            border: i === idx ? `2.5px solid ${NAV}` : "2.5px solid transparent",
            transition: "all 0.3s",
          }}>
            {i < idx ? "✓" : i + 1}
          </div>
          <div style={{ fontSize: 11, color: i <= idx ? NAV : "#aabbc8", fontFamily: UI_FONT,
            marginLeft: 6, fontWeight: i === idx ? 800 : 500, flex: 1, whiteSpace: "nowrap" }}>
            {STEP_LABELS[i]}
          </div>
          {i < steps.length - 1 && (
            <div style={{ height: 2, flex: 1, background: i < idx ? NAV : "#dde8f2",
              margin: "0 8px", transition: "background 0.3s", minWidth: 16 }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Download as HTML page (prints/saves as clean 1-2 page PDF) ───────────────
function buildResumeHTML(name, resumeText) {
  // Convert plain-text resume to styled HTML
  const lines = resumeText.split("\n");
  let html = "";
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (i === 0 && trimmed) {
      html += `<div class="r-name">${trimmed}</div>`;
    } else if (i === 1 && trimmed) {
      html += `<div class="r-contact">${trimmed}</div>`;
    } else if (/^={3,}/.test(trimmed) || /^-{3,}/.test(trimmed)) {
      // skip underline chars
    } else if (trimmed && lines[i + 1] && /^[=-]{3,}/.test(lines[i + 1]?.trim())) {
      html += `<div class="r-section">${trimmed}</div>`;
    } else if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
      html += `<li class="r-bullet">${trimmed.replace(/^[•-]\s*/, "")}</li>`;
    } else if (trimmed === "") {
      html += `<div class="r-gap"></div>`;
    } else {
      html += `<div class="r-line">${trimmed}</div>`;
    }
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${name} - Resume</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Calibri:wght@400;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Calibri, 'Calibri', 'Gill Sans', 'Gill Sans MT', 'Trebuchet MS', sans-serif;
    font-size: 10.5pt;
    color: #1a1a1a;
    background: #fff;
    padding: 0.6in 0.65in 0.6in 0.65in;
    max-width: 8.5in;
    margin: 0 auto;
    line-height: 1.35;
  }
  .r-name {
    font-size: 22pt;
    font-weight: 700;
    color: #0f3a6b;
    text-align: center;
    margin-bottom: 3pt;
    letter-spacing: 0.02em;
  }
  .r-contact {
    text-align: center;
    font-size: 9.5pt;
    color: #444;
    margin-bottom: 10pt;
    letter-spacing: 0.01em;
  }
  .r-section {
    font-size: 11pt;
    font-weight: 700;
    color: #0f3a6b;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 1.5pt solid #0f3a6b;
    padding-bottom: 2pt;
    margin-top: 10pt;
    margin-bottom: 5pt;
  }
  .r-line {
    font-size: 10.5pt;
    margin-bottom: 1.5pt;
    color: #1a1a1a;
  }
  .r-bullet {
    margin-left: 18pt;
    margin-bottom: 1.5pt;
    font-size: 10.5pt;
    color: #1a1a1a;
    list-style: disc;
  }
  .r-gap { height: 3pt; }
  @media print {
    body { padding: 0.5in 0.6in; }
    @page { margin: 0.5in; size: letter; }
  }
</style>
</head>
<body>
${html}
<script>
  window.onload = function() {
    // Auto-trigger print dialog so user can Save as PDF
    setTimeout(() => window.print(), 400);
  };
</script>
</body>
</html>`;
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const [step, setStep] = useState("intro");
  const [form, setForm] = useState(INITIAL_FORM);
  const [resume, setResume] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const setJob = (i, field, val) => {
    const jobs = [...form.jobs];
    jobs[i] = { ...jobs[i], [field]: val };
    setForm(f => ({ ...f, jobs }));
  };
  const addJob = () => setForm(f => ({ ...f, jobs: [...f.jobs, { title: "", company: "", dates: "", bullets: "" }] }));
  const removeJob = (i) => setForm(f => ({ ...f, jobs: f.jobs.filter((_, j) => j !== i) }));

  const generateResume = async () => {
    setStep("generating");
    setError("");

    const hasJobs = form.jobs.some(j => j.title || j.company);

    const prompt = `You are a professional resume writer specializing in high school student resumes for summer jobs, part-time work, and entry-level positions.

Create a clean, professional, one-page resume for this high school student.

STUDENT INFO:
Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Location: ${form.city}${form.state ? `, ${form.state}` : ""}
Target Job/Role: ${form.targetRole}

EDUCATION:
School: ${form.school}
Expected Graduation: ${form.gradYear}
GPA: ${form.gpa || "not provided"}
Relevant Coursework: ${form.coursework || "none listed"}
Academic Honors: ${form.honors || "none listed"}

WORK EXPERIENCE:
${hasJobs ? form.jobs.map((j, i) => `Position ${i+1}: ${j.title} at ${j.company} (${j.dates})\nDetails: ${j.bullets}`).join("\n\n") : "No work experience — skip this section."}

ACTIVITIES & CLUBS: ${form.activities || "none"}
SPORTS & ATHLETICS: ${form.sports || "none"}
VOLUNTEERING & COMMUNITY SERVICE: ${form.volunteering || "none"}
SKILLS: ${form.skills || "none"}
AWARDS & HONORS: ${form.awards || "none"}
CERTIFICATIONS: ${form.certifications || "none"}
LANGUAGES: ${form.languages || "none"}

FORMATTING RULES (follow exactly):
1. Line 1: Full name ONLY
2. Line 2: Contact info separated by | symbols (phone | email | city, state)
3. Use section headers followed immediately by a line of === signs
4. Bullet points start with • character
5. Use strong action verbs for all bullets
6. For experience bullets, quantify results when possible (numbers, %, $)
7. Keep the entire resume to ONE tight page — be concise
8. Sections to include (only if content exists): OBJECTIVE, EDUCATION, WORK EXPERIENCE, ACTIVITIES & LEADERSHIP, VOLUNTEER & COMMUNITY SERVICE, SKILLS, AWARDS & HONORS
9. The Objective should be 1 sentence tailored to: ${form.targetRole}
10. For high school students, lead with Education (it's often the strongest section)
11. Omit LinkedIn unless provided
12. Do NOT include a photo, references, or "References available upon request"
13. Make it feel professional but age-appropriate — this is a high schooler, not a college grad

Return ONLY the resume text. No explanations, no markdown, no backticks.`;

    
    const API_KEY = process.env.REACT_APP_API_KEY;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(c => c.text || "").join("\n") || "";
      setResume(text);
      setStep("result");
    } catch (e) {
      setError("Something went wrong. Please try again.");
      setStep("extras");
    }
  };

  const copyResume = () => {
    navigator.clipboard.writeText(resume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    const html = buildResumeHTML(form.name, resume);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.name.replace(/ /g, "_")}_Resume.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Shared card & button styles ──────────────────────────────────────────
  const card = {
    background: CARD_BG, borderRadius: 16,
    boxShadow: "0 2px 32px rgba(15,76,129,0.10)",
    padding: "36px 40px", maxWidth: 640, margin: "0 auto",
  };
  const btnPrimary = {
    background: NAV, color: "#fff", border: "none", borderRadius: 9,
    padding: "12px 30px", fontFamily: UI_FONT, fontWeight: 800,
    fontSize: 14, cursor: "pointer", letterSpacing: "0.02em",
    transition: "opacity 0.2s, transform 0.1s",
  };
  const btnAccent = {
    ...btnPrimary, background: ACC, color: NAV,
  };
  const btnSecondary = {
    background: "transparent", color: NAV, border: `1.5px solid ${NAV}`,
    borderRadius: 9, padding: "11px 26px", fontFamily: UI_FONT,
    fontWeight: 700, fontSize: 14, cursor: "pointer",
  };

  // ─── Render resume preview ────────────────────────────────────────────────
  const renderResumePreview = () => {
    const lines = resume.split("\n");
    const els = [];
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (i === 0 && trimmed) {
        els.push(<div key={i} style={{ fontFamily: "Calibri, 'Gill Sans', sans-serif", fontSize: 20, fontWeight: 700, color: "#0f3a6b", textAlign: "center", marginBottom: 2 }}>{trimmed}</div>);
      } else if (i === 1 && trimmed) {
        els.push(<div key={i} style={{ fontFamily: "Calibri, 'Gill Sans', sans-serif", fontSize: 10, color: "#555", textAlign: "center", marginBottom: 8 }}>{trimmed}</div>);
      } else if (/^={3,}/.test(trimmed) || /^-{3,}/.test(trimmed)) {
        // skip
      } else if (trimmed && lines[i + 1] && /^[=-]{3,}/.test(lines[i + 1]?.trim())) {
        els.push(<div key={i} style={{ fontFamily: "Calibri, 'Gill Sans', sans-serif", fontSize: 11, fontWeight: 700, color: "#0f3a6b", textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1.5px solid #0f3a6b", paddingBottom: 2, marginTop: 10, marginBottom: 5 }}>{trimmed}</div>);
      } else if (trimmed.startsWith("•")) {
        els.push(<div key={i} style={{ fontFamily: "Calibri, 'Gill Sans', sans-serif", fontSize: 10.5, paddingLeft: 14, color: "#1a1a1a", marginBottom: 1.5, lineHeight: 1.35 }}>{trimmed}</div>);
      } else if (trimmed === "") {
        els.push(<div key={i} style={{ height: 3 }} />);
      } else {
        els.push(<div key={i} style={{ fontFamily: "Calibri, 'Gill Sans', sans-serif", fontSize: 10.5, color: "#1a1a1a", marginBottom: 1.5, lineHeight: 1.35 }}>{trimmed}</div>);
      }
    });
    return els;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${LIGHT} 0%, #e6f0ff 50%, #fef9ee 100%)`,
      padding: "36px 16px 60px",
      fontFamily: UI_FONT,
    }}>
      <link href={FONT_LINK} rel="stylesheet" />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: NAV, color: ACC, fontFamily: UI_FONT,
          fontSize: 11, fontWeight: 800, letterSpacing: "0.18em",
          textTransform: "uppercase", padding: "5px 16px", borderRadius: 99, marginBottom: 14,
        }}>
          🎓 AI-Powered
        </div>
        <h1 style={{
          fontFamily: UI_FONT, fontSize: "clamp(28px, 5vw, 46px)",
          fontWeight: 900, color: NAV, margin: 0, lineHeight: 1.1,
        }}>
          High School Resume<br />
          <span style={{ color: ACC }}>Builder</span>
        </h1>
        <p style={{ color: "#4a6080", marginTop: 10, fontSize: 14.5, maxWidth: 420, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
          Land your summer job, part-time gig, or school application with a polished, professional resume — built in minutes.
        </p>
      </div>

      {/* INTRO */}
      {step === "intro" && (
        <div style={card}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
            {[
              ["🏖️", "Summer Job Ready", "Perfect for lifeguard, retail, camp counselor, food service, and more."],
              ["⚡", "AI-Powered", "Just describe what you did — AI writes the professional bullet points."],
              ["📄", "1-Page Format", "Clean, properly formatted resume that fits on one page every time."],
              ["⬇️", "Download & Print", "Get a print-ready file you can open and save as PDF instantly."],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ background: LIGHT, borderRadius: 12, padding: "16px 14px", border: `1px solid #cfe0f5` }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: NAV, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12, color: "#5a7090", lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff8e8", border: `1px solid #f0d080`, borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 12.5, color: "#7a5500", lineHeight: 1.6 }}>
            💡 <strong>No work experience? No problem.</strong> We'll highlight your school, clubs, sports, and volunteering — employers love a well-rounded student.
          </div>
          <button style={{ ...btnAccent, width: "100%", padding: "15px", fontSize: 15 }} onClick={() => setStep("personal")}>
            Build My Resume →
          </button>
        </div>
      )}

      {/* PERSONAL */}
      {step === "personal" && (
        <div style={card}>
          <ProgressBar step="personal" />
          <h2 style={{ fontFamily: UI_FONT, fontSize: 22, fontWeight: 900, color: NAV, marginTop: 0, marginBottom: 4 }}>Your Info</h2>
          <p style={{ color: "#7a8fa6", fontSize: 13, marginBottom: 24 }}>How employers will reach you.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
            <Field label="Full Name *"><input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Alex Johnson" /></Field>
            <Field label="Phone"><input style={inputStyle} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(425) 555-0123" /></Field>
            <Field label="Email *"><input style={inputStyle} value={form.email} onChange={e => set("email", e.target.value)} placeholder="alex@gmail.com" /></Field>
            <Field label="City, State"><input style={inputStyle} value={form.city} onChange={e => set("city", e.target.value)} placeholder="Bellevue, WA" /></Field>
          </div>
          <Field label="Target Job or Role *" hint="Be specific — e.g. 'Lifeguard', 'Barista', 'Retail associate', 'Camp counselor'">
            <input style={inputStyle} value={form.targetRole} onChange={e => set("targetRole", e.target.value)} placeholder="What kind of job are you applying for?" />
          </Field>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <button style={btnPrimary} onClick={() => setStep("education")} disabled={!form.name || !form.email || !form.targetRole}>
              Next: School →
            </button>
          </div>
        </div>
      )}

      {/* EDUCATION */}
      {step === "education" && (
        <div style={card}>
          <ProgressBar step="education" />
          <h2 style={{ fontFamily: UI_FONT, fontSize: 22, fontWeight: 900, color: NAV, marginTop: 0, marginBottom: 4 }}>Your School</h2>
          <p style={{ color: "#7a8fa6", fontSize: 13, marginBottom: 24 }}>For high schoolers, your education section is front and center.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
            <Field label="High School Name *"><input style={inputStyle} value={form.school} onChange={e => set("school", e.target.value)} placeholder="Bellevue High School" /></Field>
            <Field label="Expected Graduation Year"><input style={inputStyle} value={form.gradYear} onChange={e => set("gradYear", e.target.value)} placeholder="June 2026" /></Field>
          </div>
          <Field label="GPA" hint="Include if 3.0+ — it's a positive signal for employers.">
            <input style={{ ...inputStyle, maxWidth: 160 }} value={form.gpa} onChange={e => set("gpa", e.target.value)} placeholder="3.8 / 4.0" />
          </Field>
          <Field label="Academic Honors" hint="Honor Roll, AP courses, IB, etc.">
            <input style={inputStyle} value={form.honors} onChange={e => set("honors", e.target.value)} placeholder="Honor Roll, 4 AP courses, National Honor Society..." />
          </Field>
          <Field label="Relevant Coursework" hint="List 3–5 classes relevant to the job — e.g. Business, Health, Computer Science.">
            <textarea style={taStyle} value={form.coursework} onChange={e => set("coursework", e.target.value)} placeholder="Business Fundamentals, AP Computer Science, Health & Safety, Personal Finance..." />
          </Field>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button style={btnSecondary} onClick={() => setStep("personal")}>← Back</button>
            <button style={btnPrimary} onClick={() => setStep("experience")} disabled={!form.school}>Next: Experience →</button>
          </div>
        </div>
      )}

      {/* EXPERIENCE */}
      {step === "experience" && (
        <div style={card}>
          <ProgressBar step="experience" />
          <h2 style={{ fontFamily: UI_FONT, fontSize: 22, fontWeight: 900, color: NAV, marginTop: 0, marginBottom: 4 }}>Work Experience</h2>
          <p style={{ color: "#7a8fa6", fontSize: 13, marginBottom: 24 }}>
            Jobs, babysitting, mowing lawns, family business help — it all counts! <strong>No experience? Just skip.</strong>
          </p>
          {form.jobs.map((job, i) => (
            <div key={i} style={{ background: LIGHT, borderRadius: 12, padding: "18px 18px 10px", marginBottom: 14, border: `1px solid #cfe0f5` }}>
              <div style={{ fontWeight: 800, fontSize: 12, color: NAV, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.07em", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Position {i + 1}</span>
                {form.jobs.length > 1 && (
                  <span onClick={() => removeJob(i)} style={{ cursor: "pointer", color: "#c0392b", fontWeight: 600, fontSize: 12, textTransform: "none", letterSpacing: 0 }}>✕ Remove</span>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
                <Field label="Job Title"><input style={inputStyle} value={job.title} onChange={e => setJob(i, "title", e.target.value)} placeholder="Babysitter, Cashier, Crew Member..." /></Field>
                <Field label="Employer / Where"><input style={inputStyle} value={job.company} onChange={e => setJob(i, "company", e.target.value)} placeholder="McDonald's, Private Family, Smith Farm..." /></Field>
              </div>
              <Field label="Dates"><input style={{ ...inputStyle, maxWidth: 220 }} value={job.dates} onChange={e => setJob(i, "dates", e.target.value)} placeholder="Jun 2024 – Aug 2024" /></Field>
              <Field label="What did you do?" hint="Write casually — AI will turn it into polished bullet points.">
                <textarea style={taStyle} value={job.bullets} onChange={e => setJob(i, "bullets", e.target.value)} placeholder="I watched 2 kids ages 4 and 7, made meals, drove them to activities. Parents trusted me every weekend for a year..." />
              </Field>
            </div>
          ))}
          <button onClick={addJob} style={{ ...btnSecondary, marginBottom: 22, fontSize: 13 }}>+ Add Another Position</button>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button style={btnSecondary} onClick={() => setStep("education")}>← Back</button>
            <button style={btnPrimary} onClick={() => setStep("extras")}>Next: Skills & More →</button>
          </div>
        </div>
      )}

      {/* EXTRAS */}
      {step === "extras" && (
        <div style={card}>
          <ProgressBar step="extras" />
          <h2 style={{ fontFamily: UI_FONT, fontSize: 22, fontWeight: 900, color: NAV, marginTop: 0, marginBottom: 4 }}>Skills & Activities</h2>
          <p style={{ color: "#7a8fa6", fontSize: 13, marginBottom: 24 }}>This is where high schoolers really stand out — don't skip it!</p>

          <Field label="Clubs & Activities" hint="Student government, drama, robotics, debate, NHS, etc.">
            <textarea style={taStyle} value={form.activities} onChange={e => set("activities", e.target.value)} placeholder="Key Club Treasurer (2023–present), Drama Club, Student Council Representative..." />
          </Field>
          <Field label="Sports & Athletics" hint="Varsity, JV, club teams, or individual sports.">
            <input style={inputStyle} value={form.sports} onChange={e => set("sports", e.target.value)} placeholder="Varsity Soccer (3 years), JV Basketball, Club Swim Team..." />
          </Field>
          <Field label="Volunteering & Community Service" hint="Church, local events, food banks, hospital, etc.">
            <textarea style={taStyle} value={form.volunteering} onChange={e => set("volunteering", e.target.value)} placeholder="Food bank volunteer (30+ hours), helped organize school charity drive, tutored younger students in math..." />
          </Field>
          <Field label="Skills" hint="Tools, software, languages, or anything relevant to the job.">
            <textarea style={{ ...taStyle, minHeight: 64 }} value={form.skills} onChange={e => set("skills", e.target.value)} placeholder="Microsoft Office, Google Workspace, Social Media, Cash Register, Customer Service, Spanish (conversational)..." />
          </Field>
          <Field label="Awards & Honors">
            <input style={inputStyle} value={form.awards} onChange={e => set("awards", e.target.value)} placeholder="1st place Science Fair, Academic Excellence Award, Eagle Scout..." />
          </Field>
          <Field label="Certifications" hint="CPR, Food Handler's Permit, Lifeguard, etc.">
            <input style={inputStyle} value={form.certifications} onChange={e => set("certifications", e.target.value)} placeholder="CPR & First Aid Certified, Food Handler's Permit, Lifeguard Certified..." />
          </Field>

          {error && (
            <div style={{ background: "#fdecea", border: "1px solid #f5c6c2", borderRadius: 8, padding: "11px 15px", color: "#b03020", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button style={btnSecondary} onClick={() => setStep("experience")}>← Back</button>
            <button style={{ ...btnAccent, fontSize: 15, padding: "13px 32px" }} onClick={generateResume}>
              ✨ Build My Resume
            </button>
          </div>
        </div>
      )}

      {/* GENERATING */}
      {step === "generating" && (
        <div style={{ ...card, textAlign: "center", padding: "56px 40px" }}>
          <div style={{ fontSize: 48, marginBottom: 18, display: "inline-block", animation: "pulse 1.4s ease-in-out infinite" }}>📄</div>
          <h2 style={{ fontFamily: UI_FONT, fontWeight: 900, fontSize: 24, color: NAV }}>Writing your resume…</h2>
          <p style={{ color: "#7a8fa6", fontSize: 14, marginTop: 8 }}>AI is crafting professional bullet points and formatting everything. Takes about 10 seconds.</p>
          <div style={{ marginTop: 28, display: "flex", gap: 8, justifyContent: "center" }}>
            {["Polishing language", "Formatting sections", "Adding action verbs"].map((t, i) => (
              <div key={t} style={{
                background: LIGHT, border: `1px solid #c0d8f0`, borderRadius: 99, padding: "5px 12px",
                fontSize: 12, color: NAV, fontWeight: 700, animation: `fadeIn 0.5s ease ${i * 0.3}s both`
              }}>{t}</div>
            ))}
          </div>
          <style>{`
            @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
            @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
          `}</style>
        </div>
      )}

      {/* RESULT */}
      {step === "result" && (
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Action bar */}
          <div style={{ ...card, marginBottom: 16, padding: "22px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: UI_FONT, fontWeight: 900, fontSize: 20, color: NAV, margin: 0 }}>Your Resume is Ready! 🎉</h2>
                <p style={{ color: "#7a8fa6", fontSize: 12.5, margin: "4px 0 0" }}>Preview below. Download to open and save as PDF.</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={btnSecondary} onClick={copyResume}>
                  {copied ? "✓ Copied!" : "📋 Copy Text"}
                </button>
                <button style={btnAccent} onClick={downloadPDF}>
                  ⬇ Download (PDF-Ready)
                </button>
              </div>
            </div>

            {/* Resume preview styled like real resume */}
            <div style={{
              background: "#fff", border: "1px solid #dde8f2", borderRadius: 10,
              padding: "28px 32px", maxHeight: 560, overflowY: "auto",
              boxShadow: "inset 0 1px 4px rgba(0,0,0,0.04)",
            }}>
              {renderResumePreview()}
            </div>
          </div>

          {/* Tips */}
          <div style={{ background: NAV, borderRadius: 14, padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
            {[
              ["⬇️", "How to save as PDF", "Open the downloaded file, press Ctrl+P (or Cmd+P on Mac), and choose 'Save as PDF'."],
              ["✏️", "Customize it", "Open in Word or Google Docs to adjust fonts, spacing, or add color."],
              ["🎯", "Tailor each job", "Change the Objective line to match each job you apply for."],
            ].map(([icon, title, tip]) => (
              <div key={title}>
                <div style={{ fontSize: 20, marginBottom: 5 }}>{icon}</div>
                <div style={{ color: ACC, fontWeight: 800, fontSize: 12.5, marginBottom: 4 }}>{title}</div>
                <div style={{ color: "#a0bcd0", fontSize: 11.5, lineHeight: 1.55 }}>{tip}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <button style={btnSecondary} onClick={() => { setStep("intro"); setResume(""); setForm(INITIAL_FORM); }}>
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
