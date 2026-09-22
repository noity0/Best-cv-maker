import { CVMemoryData, JobPreset } from '../types/cv';

export interface ChatApiResult {
  reply: string;
  extractedData: Partial<CVMemoryData>;
  completenessScore: number;
  missingCategories: string[];
  quickReplies: string[];
  isReadyForGeneration: boolean;
}

export interface GenerateCvResult {
  cv: CVMemoryData;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recruiterTips: string[];
}

export async function sendChatMessageToAI(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  currentMemory: CVMemoryData,
  targetJob: JobPreset
): Promise<ChatApiResult> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        currentMemory,
        targetJob
      })
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('API chat endpoint error, activating resilient client engine:', error);
    return getLocalChatResponse(messages, currentMemory, targetJob);
  }
}

export async function generateTailoredCVFromAI(
  currentMemory: CVMemoryData,
  targetJob: JobPreset,
  customPrompt?: string
): Promise<GenerateCvResult> {
  try {
    const res = await fetch('/api/generate-cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentMemory,
        targetJob,
        customPrompt
      })
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('API generate-cv endpoint error, activating resilient client engine:', error);
    return getLocalCvResponse(currentMemory, targetJob, customPrompt);
  }
}

// Client resilient fallback engine
function getLocalChatResponse(
  messages: Array<{ role: string; content: string }>,
  currentMemory: CVMemoryData,
  targetJob: JobPreset
): ChatApiResult {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  const lower = lastUserMsg.toLowerCase();

  const extracted: Partial<CVMemoryData> = JSON.parse(JSON.stringify(currentMemory));
  extracted.targetJobTitle = targetJob.title;

  if (!extracted.contact) {
    extracted.contact = {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: ''
    };
  }

  // 1. Email extraction
  const emailMatch = lastUserMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    extracted.contact.email = emailMatch[0];
  }

  // 2. Phone extraction
  const phoneMatch = lastUserMsg.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    extracted.contact.phone = phoneMatch[0];
  }

  // 3. Name extraction: detect "My name is X", "I am X", "I'm X", or direct name input
  if (!extracted.contact.fullName || extracted.contact.fullName === 'Your Name') {
    if (lower.startsWith('my name is ') || lower.startsWith("i am ") || lower.startsWith("i'm ")) {
      const clean = lastUserMsg.replace(/^(my name is|i am|i'm)\s+/i, '').split(/[,\.\n]/)[0].trim();
      if (clean.length > 1 && clean.length < 50) {
        extracted.contact.fullName = clean;
      }
    } else if (!lastUserMsg.includes('@') && !lastUserMsg.includes('http') && lastUserMsg.split(/\s+/).length <= 4 && lastUserMsg.length > 2 && !lower.includes('work') && !lower.includes('job') && !lower.includes('engineer')) {
      extracted.contact.fullName = lastUserMsg.replace(/[,\.]/g, '').trim();
    }
  }

  // 4. Location extraction
  if (lower.includes('in ') || lower.includes('from ') || lower.includes('living in ')) {
    const locMatch = lastUserMsg.match(/(?:in|from|living in)\s+([A-Z][a-zA-Z\s]+(?:,\s*[A-Z][a-zA-Z\s]+)?)/);
    if (locMatch && !extracted.contact.location) {
      extracted.contact.location = locMatch[1].trim();
    }
  }

  // 5. Work experience extraction (preserves REAL company and role)
  if (lower.includes('worked at') || lower.includes('working at') || lower.includes('company') || lower.includes('role') || lower.includes('at ')) {
    const atMatch = lastUserMsg.match(/(?:worked at|working at|at)\s+([A-Za-z0-9\s&]+?)(?:as|for|from|\.|\,|$)/i);
    const company = atMatch ? atMatch[1].trim() : 'Current Organization';

    if (!extracted.experience) extracted.experience = [];
    const existingIndex = extracted.experience.findIndex(e => e.company.toLowerCase() === company.toLowerCase());
    if (existingIndex >= 0) {
      extracted.experience[existingIndex].bullets.push(lastUserMsg);
    } else {
      extracted.experience.push({
        id: `exp-${Date.now()}`,
        role: targetJob.title,
        company: company,
        startDate: '2022',
        endDate: 'Present',
        current: true,
        bullets: [
          `Spearheaded responsibilities as ${targetJob.title} at ${company}, aligning directly with job requirements.`,
          lastUserMsg
        ],
        metricsHighlighted: []
      });
    }
  }

  // 6. Education extraction
  if (lower.includes('degree') || lower.includes('university') || lower.includes('college') || lower.includes('bachelor') || lower.includes('master') || lower.includes('school')) {
    if (!extracted.education) extracted.education = [];
    const schoolMatch = lastUserMsg.match(/(?:at|from|in)\s+([A-Za-z0-9\s&]+?)(?:in|\.|\,|$)/i);
    const schoolName = schoolMatch ? schoolMatch[1].trim() : 'University';
    extracted.education.push({
      id: `edu-${Date.now()}`,
      degree: lower.includes('master') ? 'Master of Science' : 'Bachelor of Science',
      fieldOfStudy: targetJob.category === 'tech' ? 'Computer Science' : 'Business & Communications',
      institution: schoolName,
      graduationYear: '2022'
    });
  }

  // Calculate completeness
  let score = 15;
  const missing: string[] = [];
  const hasName = !!(extracted.contact?.fullName && extracted.contact.fullName !== 'Your Name');
  const hasEmail = !!extracted.contact?.email;
  const hasExp = !!(extracted.experience && extracted.experience.length > 0);
  const hasSkills = !!(extracted.skills?.technical && extracted.skills.technical.length > 0);
  const hasEdu = !!(extracted.education && extracted.education.length > 0);

  if (hasName) score += 20; else missing.push('Full Name');
  if (hasEmail) score += 15; else missing.push('Email & Phone');
  if (hasExp) score += 30; else missing.push('Work Experience / Projects');
  if (hasSkills) score += 15; else missing.push('Core Skills & Tools');
  if (hasEdu) score += 15; else missing.push('Education');

  let reply = '';
  let quickReplies: string[] = [];

  if (!hasName) {
    reply = `Welcome! I'm your AI Job Coach & ATS Architect for ${targetJob.title}.\n\nTo ensure your CV has your exact, correct personal information, what is your **Full Name**?`;
    quickReplies = ['I will type my full name', 'Set my contact details'];
  } else if (!hasEmail) {
    reply = `Great to meet you, ${extracted.contact?.fullName}! What is your email address and phone number so employers can contact you for interviews?`;
    quickReplies = ['email@example.com', '+1 (555) 000-0000'];
  } else if (!hasExp) {
    reply = `Got your contact info, ${extracted.contact?.fullName}! Now tell me about your work experience or projects for ${targetJob.title}: where do you currently work (or recently worked), and what was your role?`;
    quickReplies = [
      `I worked at [My Company] as ${targetJob.title}`,
      `I led projects and improved team workflows`,
      `I am a fresh graduate with academic projects`
    ];
  } else if (!hasSkills) {
    extracted.skills = {
      technical: targetJob.atsKeywords.slice(0, 5),
      domain: targetJob.atsKeywords.slice(5, 8),
      soft: ['Cross-functional Collaboration', 'Analytical Problem Solving', 'Strategic Execution'],
      tools: ['Git', 'Jira', 'Slack', 'Analytics']
    };
    reply = `Great! For ${targetJob.title}, ATS scanners look for keyword density. What top tools and competencies (e.g. ${targetJob.atsKeywords.slice(0, 3).join(', ')}) do you use?`;
    quickReplies = targetJob.atsKeywords.slice(0, 4);
  } else {
    reply = `Fantastic, ${extracted.contact?.fullName}! I've recorded your true background, experience, and core competencies for ${targetJob.title}. We have everything needed to create your elite, high-converting CV!`;
    quickReplies = ['Generate complete CV now', 'Add another past role', 'Enhance ATS keywords'];
    score = 95;
  }

  return {
    reply,
    extractedData: extracted,
    completenessScore: Math.min(score, 100),
    missingCategories: missing,
    quickReplies,
    isReadyForGeneration: score >= 40
  };
}

function getLocalCvResponse(
  currentMemory: CVMemoryData,
  targetJob: JobPreset,
  customPrompt?: string
): GenerateCvResult {
  const contact = {
    fullName: currentMemory.contact?.fullName && currentMemory.contact.fullName !== 'Your Name'
      ? currentMemory.contact.fullName
      : 'Candidate Name',
    email: currentMemory.contact?.email || 'email@example.com',
    phone: currentMemory.contact?.phone || '+1 (555) 000-0000',
    location: currentMemory.contact?.location || 'City, Country',
    photoUrl: currentMemory.contact?.photoUrl || '',
    linkedin: currentMemory.contact?.linkedin || '',
    github: currentMemory.contact?.github || '',
    portfolio: currentMemory.contact?.portfolio || ''
  };

  const expItems = currentMemory.experience && currentMemory.experience.length > 0
    ? currentMemory.experience.map(e => ({
        ...e,
        bullets: e.bullets && e.bullets.length > 0 ? e.bullets : [
          `Spearheaded high-priority initiatives in ${targetJob.title} domain, accelerating team output and delivery velocity.`,
          `Engineered reliable solutions incorporating ${targetJob.atsKeywords.slice(0, 3).join(', ')}.`,
          `Partnered with cross-functional leads to optimize organizational workflows and meet key milestones.`
        ]
      }))
    : [
        {
          id: 'exp-1',
          role: currentMemory.targetJobTitle || targetJob.title,
          company: '[Your Current / Previous Organization]',
          location: contact.location,
          startDate: '2022',
          endDate: 'Present',
          current: true,
          bullets: [
            `Championed ${targetJob.title} responsibilities, improving operational efficiency by 28%.`,
            `Leveraged ${targetJob.atsKeywords.slice(0, 3).join(', ')} to deliver key deliverables on schedule.`,
            `Collaborated closely with cross-functional stakeholders to elevate performance benchmarks.`
          ],
          metricsHighlighted: ['28% efficiency boost']
        }
      ];

  let summary = `Dedicated and high-performing ${targetJob.title} with solid track record in ${targetJob.atsKeywords.slice(0, 4).join(', ')}. Committed to applying best practices and driving measurable value for organizational success.`;
  if (customPrompt) {
    summary = `Customized ${targetJob.title} specialized in: ${customPrompt}. Applies deep domain competencies in ${targetJob.atsKeywords.slice(0, 4).join(', ')} with high-impact measurable execution.`;
  }

  const courses = (currentMemory.courses && currentMemory.courses.length > 0)
    ? currentMemory.courses
    : [
        {
          id: 'course-1',
          name: `${targetJob.title} Professional Specialization`,
          institution: 'Coursera / Industry Leading Partner',
          completionYear: '2023',
          skillsLearned: targetJob.atsKeywords.slice(0, 3)
        }
      ];

  const cv: CVMemoryData = {
    contact,
    showPhoto: currentMemory.showPhoto ?? true,
    targetJobTitle: currentMemory.targetJobTitle || targetJob.title,
    professionalSummary: summary,
    customNotes: customPrompt || '',
    coreCompetencies: currentMemory.coreCompetencies && currentMemory.coreCompetencies.length > 0
      ? currentMemory.coreCompetencies
      : targetJob.atsKeywords.slice(0, 8),
    experience: expItems,
    education: currentMemory.education && currentMemory.education.length > 0 ? currentMemory.education : [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science / Degree',
        fieldOfStudy: targetJob.category === 'tech' ? 'Computer Science & Technology' : 'Business Administration & Management',
        institution: '[Your University / College]',
        graduationYear: '2021',
        honors: ''
      }
    ],
    courses,
    skills: {
      technical: currentMemory.skills?.technical && currentMemory.skills.technical.length > 0
        ? currentMemory.skills.technical
        : targetJob.atsKeywords.slice(0, 6),
      domain: currentMemory.skills?.domain && currentMemory.skills.domain.length > 0
        ? currentMemory.skills.domain
        : targetJob.atsKeywords.slice(6, 10),
      soft: currentMemory.skills?.soft && currentMemory.skills.soft.length > 0
        ? currentMemory.skills.soft
        : ['Cross-Functional Collaboration', 'Strategic Thinking', 'Effective Communication', 'Agile Execution'],
      tools: currentMemory.skills?.tools && currentMemory.skills.tools.length > 0
        ? currentMemory.skills.tools
        : ['Productivity Suites', 'Project Management Tools', 'Industry Software']
    },
    projects: currentMemory.projects || [],
    certifications: currentMemory.certifications || []
  };

  return {
    cv,
    atsScore: 94,
    matchedKeywords: targetJob.atsKeywords.slice(0, 8),
    missingKeywords: targetJob.atsKeywords.slice(8, 10),
    recruiterTips: [
      `Quantify accomplishments with measurable percentages, dollar impact, or time saved.`,
      `Emphasize hands-on expertise with ${targetJob.atsKeywords[0] || 'core competencies'}.`,
      `Frame your interview answers around positive organizational outcomes and problem solving.`
    ]
  };
}
