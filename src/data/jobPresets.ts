import { JobPreset } from '../types/cv';

export const JOB_PRESETS: JobPreset[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'tech',
    level: 'Mid-Level',
    description: 'Builds, maintains, and scales full-stack applications, APIs, and cloud microservices.',
    atsKeywords: [
      'Full-Stack Development',
      'System Architecture',
      'RESTful APIs',
      'Microservices',
      'CI/CD Pipelines',
      'Cloud (AWS/GCP)',
      'TypeScript/Python/Java',
      'SQL & NoSQL Databases',
      'Unit & Integration Testing',
      'Agile/Scrum',
      'Scalability & Performance'
    ],
    mustHaveMetrics: [
      '% reduction in API latency / load times',
      'Scale handled (e.g. 100K+ DAU, 1M+ req/sec)',
      '% code coverage or test automation rate',
      'Infrastructure cost savings ($ / %)',
      'Deployment frequency acceleration'
    ],
    recommendedCertifications: ['AWS Certified Solutions Architect', 'Google Cloud Certified Engineer', 'CKA (Kubernetes)'],
    sampleQuestions: [
      'What core programming languages and tech frameworks did you use most recently?',
      'Can you mention an engineering challenge where you improved performance, scale, or cut costs with specific % metrics?',
      'Have you designed or contributed to databases, APIs, or CI/CD pipelines?'
    ],
    iconName: 'Code'
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'tech',
    level: 'Mid-Level',
    description: 'Crafts responsive, accessible, high-performance web applications and design systems.',
    atsKeywords: [
      'React.js',
      'TypeScript',
      'Next.js',
      'Tailwind CSS',
      'State Management (Redux/Zustand)',
      'Responsive UI/UX',
      'Web Performance (Core Web Vitals)',
      'Accessibility (WCAG AA)',
      'Component Libraries',
      'REST & GraphQL APIs'
    ],
    mustHaveMetrics: [
      'Lighthouse score improvements (e.g., 65 to 98+)',
      '% boost in user engagement or conversion',
      '% reduction in page bundle size or load time',
      'Adoption of reusable design system across X teams'
    ],
    recommendedCertifications: ['Meta Front-End Developer Professional Certificate', 'AWS Cloud Practitioner'],
    sampleQuestions: [
      'What frontend frameworks and styling tools have you shipped production apps with?',
      'How have you optimized page speed, accessibility, or mobile responsiveness?',
      'Have you built custom reusable components or integrated complex APIs?'
    ],
    iconName: 'Layout'
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    category: 'business',
    level: 'Senior / Lead',
    description: 'Drives product strategy, roadmap execution, user discovery, and business outcome metrics.',
    atsKeywords: [
      'Product Strategy',
      'Roadmap Prioritization',
      'User Research & Discovery',
      'Agile & Scrum Methodologies',
      'A/B Testing & Experimentation',
      'Cross-Functional Leadership',
      'KPI & OKR Tracking',
      'Go-To-Market (GTM)',
      'Customer Journey Mapping'
    ],
    mustHaveMetrics: [
      '% increase in user retention or MAU',
      '$ Revenue or ARR generated / unlocked',
      '% boost in feature adoption rate',
      'Time-to-market reduction in sprints'
    ],
    recommendedCertifications: ['Product School PMC', 'CSPO (Certified Scrum Product Owner)', 'Reforge'],
    sampleQuestions: [
      'What product or key feature did you lead from 0 to 1 or scale significantly?',
      'What were the measurable business outcomes (revenue, retention, NPS, user growth)?',
      'How did you collaborate with engineering, design, and executive stakeholders?'
    ],
    iconName: 'Target'
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst / BI Specialist',
    category: 'tech',
    level: 'Mid-Level',
    description: 'Transforms raw business data into actionable dashboards, insights, and statistical models.',
    atsKeywords: [
      'SQL Query Optimization',
      'Tableau & Power BI',
      'Python (Pandas, NumPy)',
      'Data Modeling & Warehousing',
      'Statistical Analysis',
      'ETL Pipelines',
      'A/B Test Evaluation',
      'Executive Dashboards',
      'Data Governance'
    ],
    mustHaveMetrics: [
      'Hours saved per week via automated reporting',
      '$ in revenue opportunities or cost leakages uncovered',
      '% accuracy improvement in business forecasts',
      'Number of stakeholders/departments supported with daily BI'
    ],
    recommendedCertifications: ['Google Data Analytics Professional', 'Microsoft Certified: Power BI Data Analyst'],
    sampleQuestions: [
      'What SQL tools, Python libraries, and BI visualization platforms do you master?',
      'Describe a data insight you discovered that influenced an executive decision or saved costs.',
      'Have you built automated reporting pipelines or predictive models?'
    ],
    iconName: 'BarChart3'
  },
  {
    id: 'digital-marketing-specialist',
    title: 'Digital Marketing Specialist',
    category: 'marketing',
    level: 'Mid-Level',
    description: 'Executes high-ROI multi-channel campaigns across SEO, PPC, Email, and Social.',
    atsKeywords: [
      'SEO / SEM',
      'Google Ads & Paid Social (Meta/LinkedIn)',
      'Conversion Rate Optimization (CRO)',
      'Google Analytics 4 (GA4)',
      'Marketing Automation (HubSpot)',
      'Content Marketing Strategy',
      'Customer Acquisition Cost (CAC)',
      'Return on Ad Spend (ROAS)',
      'A/B Copy Testing'
    ],
    mustHaveMetrics: [
      'ROAS achieved (e.g. 4.2x ROAS on $50K spend)',
      '% increase in organic inbound search traffic',
      '% reduction in Customer Acquisition Cost (CAC)',
      '$ Pipeline or qualified leads generated'
    ],
    recommendedCertifications: ['Google Ads Search Certification', 'HubSpot Inbound Marketing', 'Meta Certified Digital Marketing Associate'],
    sampleQuestions: [
      'Which paid ad or organic acquisition channels have you managed?',
      'What was your best ROAS or campaign growth metric?',
      'What analytics, CRM, or marketing automation platforms do you use?'
    ],
    iconName: 'TrendingUp'
  },
  {
    id: 'registered-nurse',
    title: 'Registered Nurse (RN) / Healthcare',
    category: 'healthcare',
    level: 'Mid-Level',
    description: 'Delivers compassionate, clinical patient care, medication administration, and care coordination.',
    atsKeywords: [
      'Patient Assessment & Triage',
      'Electronic Health Records (EHR / Epic / Cerner)',
      'Medication Administration',
      'Acute & Critical Care',
      'Interdisciplinary Team Collaboration',
      'Infection Control Protocols',
      'Patient & Family Advocacy',
      'Emergency Preparedness (BLS/ACLS)',
      'Discharge Planning'
    ],
    mustHaveMetrics: [
      'Patient-to-nurse ratio handled safely (e.g., 1:5 acute or 1:2 ICU)',
      'HCAHPS patient satisfaction improvement score',
      'Zero medication error records maintained',
      'Rapid response interventions executed'
    ],
    recommendedCertifications: ['BLS (Basic Life Support)', 'ACLS (Advanced Cardiac Life Support)', 'PCCN / CCRN', 'State RN License'],
    sampleQuestions: [
      'What clinical unit or healthcare setting have you worked in (ICU, Med-Surg, ER, Clinic)?',
      'Which EHR systems (Epic, Cerner, Meditech) are you proficient in?',
      'What certifications (BLS, ACLS, state licenses) do you hold?'
    ],
    iconName: 'HeartPulse'
  },
  {
    id: 'financial-analyst',
    title: 'Financial Analyst',
    category: 'finance',
    level: 'Mid-Level',
    description: 'Prepares financial forecasting, variance analysis, valuations, and budgeting models.',
    atsKeywords: [
      'Financial Modeling (DCF, LBO)',
      'Variance Analysis',
      'Budgeting & Forecasting',
      'P&L Management',
      'Advanced Excel (VBA/Macros/PowerQuery)',
      'ERP Systems (SAP, NetSuite)',
      'Capital Expenditure (CapEx) Planning',
      'Variance Reporting',
      'GAAP / IFRS Compliance'
    ],
    mustHaveMetrics: [
      'Budget managed or audited ($10M - $100M+)',
      'Forecast accuracy maintained within ±2%',
      '$ Cost savings identified via variance audits',
      'Days reduced in month-end financial close cycle'
    ],
    recommendedCertifications: ['CFA (Chartered Financial Analyst)', 'FMVA (Financial Modeling & Valuation Analyst)', 'CPA'],
    sampleQuestions: [
      'What scale of budgets, revenue lines, or investment portfolios have you modeled?',
      'What ERP software (NetSuite, SAP) and advanced financial modeling tools do you use?',
      'Can you highlight a cost saving or strategic recommendation you provided to leadership?'
    ],
    iconName: 'DollarSign'
  },
  {
    id: 'customer-success-manager',
    title: 'Customer Success Manager',
    category: 'business',
    level: 'Mid-Level',
    description: 'Manages enterprise client retention, onboarding, renewals, and product adoption.',
    atsKeywords: [
      'Client Retention & Churn Reduction',
      'Net Retention Rate (NRR)',
      'Enterprise Onboarding',
      'Customer Health Scoring',
      'Salesforce & Gainsight',
      'Upsell & Cross-Sell Opportunities',
      'Quarterly Business Reviews (QBRs)',
      'Customer Advocacy & CSAT/NPS'
    ],
    mustHaveMetrics: [
      'Net Retention Rate (NRR) achieved (e.g. 115%+)',
      '% Gross churn reduction year-over-year',
      'Portfolio value managed ($ ARR)',
      'CSAT or NPS score maintained (e.g., 94%+ CSAT)'
    ],
    recommendedCertifications: ['Gainsight Certified Administrator', 'Salesforce Certified Administrator'],
    sampleQuestions: [
      'What total Annual Recurring Revenue (ARR) and client count have you managed?',
      'What was your renewal rate or Net Revenue Retention (NRR)?',
      'How do you manage at-risk client accounts and lead executive QBRs?'
    ],
    iconName: 'Headphones'
  },
  {
    id: 'project-operations-manager',
    title: 'Project & Operations Manager',
    category: 'operations',
    level: 'Senior / Lead',
    description: 'Oversees cross-functional workflows, operational efficiency, resource allocation, and timelines.',
    atsKeywords: [
      'Cross-Functional Project Management',
      'Agile / Waterfall / Scrum',
      'Process Optimization (Lean Six Sigma)',
      'Resource & Budget Allocation',
      'Risk Mitigation & Escalation',
      'Stakeholder Communication',
      'Jira / Asana / Monday.com',
      'Vendor & Contract Management',
      'KPI Dashboards'
    ],
    mustHaveMetrics: [
      '% On-time and on-budget project delivery rate',
      '% Efficiency gain or cycle-time reduction',
      '$ Project budgets handled',
      'Team members managed across departments'
    ],
    recommendedCertifications: ['PMP (Project Management Professional)', 'Certified ScrumMaster (CSM)', 'Six Sigma Green/Black Belt'],
    sampleQuestions: [
      'What large projects or operational workflows have you delivered from kick-off to completion?',
      'What project methodologies (Agile, Scrum, Lean) and tracking tools do you utilize?',
      'Can you share a specific operational bottleneck you resolved with measurable results?'
    ],
    iconName: 'Briefcase'
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Product Designer',
    category: 'design',
    level: 'Mid-Level',
    description: 'Designs intuitive user journeys, wireframes, design systems, and mobile/web prototypes.',
    atsKeywords: [
      'Figma & Design Systems',
      'User Research & Usability Testing',
      'Information Architecture',
      'Wireframing & Interactive Prototyping',
      'Mobile-First Responsive Design',
      'Accessibility Standards (WCAG)',
      'Design Tokens',
      'Cross-Functional Handoff',
      'User Journey Mapping'
    ],
    mustHaveMetrics: [
      '% Increase in task completion or checkout conversion',
      '% Reduction in usability test drop-off rates',
      'Design system adoption across X product lines',
      'User satisfaction / SUS score improvement'
    ],
    recommendedCertifications: ['Google UX Design Certificate', 'Nielsen Norman Group (NN/g) UX Master'],
    sampleQuestions: [
      'What is your design process for conducting user research and prototyping in Figma?',
      'Can you describe a key UI/UX revamp you led that significantly improved usability or conversion?',
      'How do you maintain design systems and hand off assets to engineers?'
    ],
    iconName: 'Palette'
  }
];

export const INITIAL_CV_MEMORY: { [key: string]: string } = {
  welcomeMessage: "Hi there! I'm your AI Job Coach & CV Architect. Let's build a standout, ATS-optimized CV tailored specifically to land interviews for your target job.\n\nFirst, let's start with your basics: What is your full name, email, phone, and current city?"
};
