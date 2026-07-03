// PRISM prompt templates — server-side source of truth.
// Auto-extracted verbatim from the client (diligence-rubric.html) on 2026-07-03.
// The two builders are pure functions of (text, FRAMEWORKS). Do not hand-edit; regenerate from the client if the rubric changes.

export const FRAMEWORKS = {
  "prl": {
    "title": "Prototype Readiness",
    "sub": "PRL · 9 levels · prototype maturity",
    "color": "#4362D0",
    "maxLvl": 9,
    "levels": [
      {
        "num": 1,
        "name": "Basic Research",
        "desc": "Idea grounded in research; no prototype yet.",
        "qs": [
          "Is the idea grounded in specific, citable research from learning science, cognitive science, or a related field?",
          "Can the team articulate the mechanism by which the idea is expected to improve a specific learner or educator outcome?",
          "Has the team documented the prior research that supports their theory of change, even informally?"
        ]
      },
      {
        "num": 2,
        "name": "Applied Research",
        "desc": "Specific application concept formulated; still speculative.",
        "qs": [
          "Has the team translated their research grounding into a specific, concrete application concept?",
          "Can the team describe the specific educational activity their application is intended to enhance or replace?",
          "Has the team identified, at least on paper, which components would need to exist for it to work?"
        ]
      },
      {
        "num": 3,
        "name": "Proof of Application Concept",
        "desc": "Components tested in isolation; feasibility study completed.",
        "qs": [
          "Have individual components of the application been tested in isolation (not yet integrated)?",
          "Has the team completed a feasibility study showing the concept could plausibly work?",
          "Is there a detailed characterization of the user process the application supports, including baseline performance before the application?"
        ]
      },
      {
        "num": 4,
        "name": "Initial Prototype & Verification",
        "desc": "Low-fidelity integrated prototype, lab-like testing.",
        "qs": [
          "Has the team built an integrated prototype (even low-fidelity) where components work together?",
          "Has the prototype been demonstrated in a lab-like environment (not yet a real classroom)?",
          "Has the team identified the organizational and human-process issues a real deployment will need to address?"
        ]
      },
      {
        "num": 5,
        "name": "Validation in Relevant Environment",
        "desc": "Medium-fidelity prototype, simulated classroom validation.",
        "qs": [
          "Has a medium-fidelity prototype been tested in a simulated or closely-approximating classroom environment?",
          "Can the team articulate, with evidence, the specific performance improvement the application could achieve?",
          "Has the team defined what scaling would require (technical, operational, data)?"
        ]
      },
      {
        "num": 6,
        "name": "Demonstration in Relevant Environment",
        "desc": "High-fidelity prototype, simulated operational env.",
        "qs": [
          "Has the high-fidelity prototype been beta-tested in a simulated operational environment?",
          "Has the team demonstrated (not merely projected) performance improvements in that environment?",
          "Are any components already running in end-user environments?"
        ]
      },
      {
        "num": 7,
        "name": "Application Prototype in Operational Environment",
        "desc": "Real classroom integration with school systems.",
        "qs": [
          "Is the prototype running in a real classroom, integrated with the actual systems and workflows of the school?",
          "Has functionality been demonstrated to educators and students using it (not just promised)?",
          "Has the team worked out most of the major bugs and integration issues that surfaced during deployment?"
        ]
      },
      {
        "num": 8,
        "name": "Application Completed & Qualified",
        "desc": "Product fully built; qualified by school partners.",
        "qs": [
          "Is the product fully built in its intended final form, with user / training / maintenance documentation?",
          "Has a school partner formally qualified or approved the product for ongoing use?",
          "Has V&V testing been completed against target outcomes?"
        ]
      },
      {
        "num": 9,
        "name": "Sustained, Scaled Use",
        "desc": "Sustained scaled use across many real classrooms.",
        "qs": [
          "Is the product in sustained, repeated use across multiple schools and classrooms over time?",
          "Is use occurring in schools serving priority student populations, with outcome data being collected?",
          "Is there sustaining engineering, customer support, and continuous improvement infrastructure in place?"
        ]
      }
    ]
  },
  "peoml": {
    "title": "People Readiness",
    "sub": "PeoML · 5 levels · team & community",
    "color": "#12A08A",
    "maxLvl": 5,
    "levels": [
      {
        "num": 1,
        "name": "Equity stated",
        "desc": "Equity named as a value but not yet operationalized in team/consultation.",
        "qs": [
          "Is equity (including the priority population) named explicitly in the mission, theory of change, or external materials?",
          "Can the team articulate, beyond marketing language, what equity means for their specific R&D project?",
          "Is at least one team member explicitly responsible for equity (not as a side role, but as an accountable function)?"
        ]
      },
      {
        "num": 2,
        "name": "Community informed",
        "desc": "Community consulted at key R&D moments, but consultation is one-directional.",
        "qs": [
          "Have community members from the priority population been consulted on concept and approach (not just user-tested)?",
          "Have those consultations shaped at least one substantive design decision in a way that can be documented?",
          "Is there a documented mechanism for ongoing community consultation, not just one-time interviews?"
        ]
      },
      {
        "num": 3,
        "name": "Community present",
        "desc": "Community members in formal R&D and team functions.",
        "qs": [
          "Do community members from the priority population hold formal, paid roles on team or advisory structure?",
          "Are community members present in defined R&D moments (prototype review, evidence interpretation, roadmap planning)?",
          "Does the team's composition itself (not just advisors) reflect the population, including in technical and decision-making roles?"
        ]
      },
      {
        "num": 4,
        "name": "Community partnership",
        "desc": "Community as co-leaders with documented decision rights.",
        "qs": [
          "Are community members co-leaders on substantive R&D decisions, with documented decision rights (not just \"input\")?",
          "Is community accountability symmetric: community partners accountable for outcomes alongside founders, with shared metrics?",
          "Are community partners compensated commensurate with their decision-making role (not at consultant or honorarium rates)?"
        ]
      },
      {
        "num": 5,
        "name": "Community co-ownership",
        "desc": "Community holds decision-making power and equity in outcomes.",
        "qs": [
          "Do governance documents (bylaws, board composition, equity arrangements) reflect community standing as co-owners?",
          "Is decision-making power shared on the most consequential decisions (pivots, scale, monetization, IP)?",
          "Is there a revenue / equity / asset-sharing arrangement that gives the community a stake in long-term value?"
        ]
      }
    ]
  },
  "proml": {
    "title": "Process Readiness",
    "sub": "ProML · 5 levels · R&D-cycle equity",
    "color": "#E0A129",
    "maxLvl": 5,
    "levels": [
      {
        "num": 1,
        "name": "Equity defined",
        "desc": "Equity goals explicit, measurable, tied to specific population.",
        "qs": [
          "Are equity goals explicit and measurable (specific subgroups, outcomes, decisions they should shape)?",
          "Can the team articulate which subgroup-level outcomes the project is responsible for (not just population averages)?",
          "Is at least one team member accountable for keeping equity goals visible across phases (not just at concept stage)?"
        ]
      },
      {
        "num": 2,
        "name": "Equity in design",
        "desc": "Design choices systematically reflect equity goals.",
        "qs": [
          "Have design choices in at least one current phase been visibly shaped by equity considerations, with a documented decision trail?",
          "Does the R&D plan explicitly address how design choices serve—or fail to serve—the priority subgroups?",
          "Are equity-relevant tensions named explicitly in design decisions, rather than glossed over?"
        ]
      },
      {
        "num": 3,
        "name": "Equity in data",
        "desc": "Data designed for disaggregation and subgroup learning.",
        "qs": [
          "Is data collection designed from the start to support disaggregation by all priority subgroups?",
          "Are sample sizes and recruitment plans powered for subgroup analysis (not just average effects)?",
          "Does the analysis plan pre-specify subgroup questions before data collection?"
        ]
      },
      {
        "num": 4,
        "name": "Equity in iteration",
        "desc": "Iteration cycles use subgroup evidence to improve the prototype.",
        "qs": [
          "When subgroup analysis reveals differential effects, does the R&D process respond with documented design or measurement changes?",
          "Are iteration decisions adjudicated against equity criteria, not just average performance?",
          "Is there a mechanism for community partners and team members to raise equity concerns mid-cycle and have them acted on?"
        ]
      },
      {
        "num": 5,
        "name": "Equity in dissemination & governance",
        "desc": "Findings and decision rights flow to communities served.",
        "qs": [
          "Are findings disseminated to communities in formats and languages they can use (not only to funders/academia)?",
          "Do decisions about scaling, monetization, and continued use reflect input or shared decision rights with the population served?",
          "Is there a governance mechanism (board representation, community standing) that gives the community continuing standing?"
        ]
      }
    ]
  }
};

export function buildAnalysisPrompt(text) {
  // Build per-framework question structure for the model
  const rubric = {};
  Object.keys(FRAMEWORKS).forEach(fw => {
    rubric[fw] = {};
    FRAMEWORKS[fw].levels.forEach(l => {
      rubric[fw][l.num] = {
        name: l.name,
        questions: l.qs,
      };
    });
  });

  return `You are executing the SETA-ED PRISM Analysis on a grant proposal from an education R&D venture. The methodology is defined by SETA-ED (Scientific and Engineering Technical Assistance for Education) and adapted from the R&D portfolio practices of DARPA, ARPA-E, and other Advanced Research Project Agencies. The framework has three dimensions, each with multiple levels:

- Prototype Readiness Levels (PRL): 9 levels of prototype maturity
- People Readiness Levels (PeoML): 5 levels of team and community readiness
- Process Readiness Levels (ProML): 5 levels of R&D-cycle equity discipline

Score the proposal HONESTLY. The framework is designed to surface aspirational language vs. operational reality. Most ventures overstate their readiness; the framework's value is in catching that. When the proposal mentions something only briefly or aspirationally, score "weak" not "strong." Reserve "yes" for cases where the proposal cites specific artifacts, named partners, or documented processes.

For each rubric question, return:
- score: 0 (no evidence in proposal), 1 (weak — mentioned but not at the level the question asks), 2 (strong — clear evidence at the level), 3 (yes — documented evidence with specific citation/artifact)
- evidence: a brief quote OR paraphrase from the proposal supporting your score (max 200 chars). If no evidence, use empty string.

Return ONLY valid JSON in EXACTLY this structure (no prose before or after, no markdown fencing):

{
  "summary": "2-3 sentence overall readiness assessment across the three dimensions, highlighting the strongest and weakest dimensions",
  "prl": {
    "1": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "2": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "3": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "4": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "5": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "6": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "7": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "8": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "9": { "scores": [N,N,N], "evidence": ["...","...","..."] }
  },
  "peoml": {
    "1": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "2": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "3": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "4": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "5": { "scores": [N,N,N], "evidence": ["...","...","..."] }
  },
  "proml": {
    "1": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "2": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "3": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "4": { "scores": [N,N,N], "evidence": ["...","...","..."] },
    "5": { "scores": [N,N,N], "evidence": ["...","...","..."] }
  }
}

Each "scores" array must have exactly 3 integers (one per question at that level). Each "evidence" array must have exactly 3 strings.

The rubric questions are:
${JSON.stringify(rubric, null, 2)}

PROPOSAL TEXT TO EVALUATE:
"""
${text}
"""

Return only the JSON object, with no surrounding prose or markdown.`;
}

export function buildRiskPrompt(text) {
  return `You are executing the second pass of the SETA-ED PRISM Analysis on a grant proposal from an education R&D venture. This pass identifies the key risks the funder should consider when supporting this venture, structured according to DARPA's R&D risk-management methodology.

DARPA risk methodology has three steps: (1) identify the categories of risk inherent in the project; (2) determine which categories the funder is willing to accept; (3) for accepted categories, articulate explicit short-term and long-term mitigation strategies.

Identify 4–7 risks based on what is (and what is not) addressed in the proposal. Use the standard categories below where they fit; create new categories only when a risk doesn't map cleanly to one of these:

Standard categories:
- "Evidence development" — risk that the venture can produce credible evidence of impact in the engagement window
- "School access / district recruitment" — risk that the venture can secure the school partnerships its evidence work requires
- "AI deployment (model drift, bias, privacy)" — risk specific to AI-powered solutions
- "Adoption / district purchase" — risk that districts will actually buy and deploy the product
- "Team continuity / key-person dependency" — risk that the venture's capacity rests on a single founder or critical role
- "Equity-execution risk" — risk that inequitable outcomes emerge despite stated equity goals
- "Methodological dependency" — risk that the R&D plan depends on infrastructure or partners not yet in place
- "Operational scale" — risk that the venture cannot operate at the scope and pace the proposal commits to

For each risk:
- category: short label (max 80 chars), preferring standard categories above
- shortTerm: what the venture is currently doing (or NOT doing) to address the risk, paraphrased from the proposal (max 250 chars). If the proposal is silent, say so explicitly: "Not addressed in proposal."
- longTerm: what the venture's plan is over the engagement horizon, paraphrased from the proposal (max 250 chars). If the proposal is silent, say "No long-term plan stated."
- confidence: "low" / "medium" / "high" — your confidence in the strength of the venture's mitigation plan (NOT in the severity of the risk). Lean conservative: "low" if the proposal lacks specifics; "high" only if the proposal cites concrete actions, named partners, or documented processes.
- status: "review" by default. Mark "rejected" only if the risk is so unaddressed it is genuinely blocking. Do not mark "accepted" — that's a funder decision.

Be conservative. If a proposal does not address a risk that any reasonable evaluator would expect it to address, surface that explicitly with confidence "low."

Return ONLY valid JSON in EXACTLY this structure:

{
  "risks": [
    { "category": "...", "shortTerm": "...", "longTerm": "...", "confidence": "low|medium|high", "status": "review|rejected" }
  ]
}

PROPOSAL TEXT:
"""
${text}
"""

Return only the JSON object, no surrounding prose.`;
}

export function buildPrompt(pass, text) {
  if (pass === 'scoring') return buildAnalysisPrompt(text);
  if (pass === 'risk') return buildRiskPrompt(text);
  throw new Error('unknown pass: ' + pass);
}
