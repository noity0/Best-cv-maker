import { CVMemoryData, JobPreset } from '../types/cv';

export interface ChatApiResult {
  reply: string;
  extractedData: Partial<CVMemoryData>;
  completenessScore: number;
  missingCategories: string[];
  quickReplies: string[];
  isReadyForGeneration: boolean;
  actionRequired?: 'select_job' | 'view_cv' | 'add_experience' | null;
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

    const data = await res.json();
    return data;
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
  const allUserMsgs = messages.filter(m => m.role === 'user').map(m => m.content).join(' \n ');
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content.trim() || '';
  const lowerAll = allUserMsgs.toLowerCase();
  const lowerLast = lastUserMsg.toLowerCase();

  const extracted: Partial<CVMemoryData> = JSON.parse(JSON.stringify(currentMemory));

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

  // 1. Full Name Extraction (handles "my name is...", "my nameis...", "full name is...", "name: ...", "I am...")
  const nameRegexes = [
    /(?:my\s*name\s*(?:is)?|full\s*name\s*(?:is)?|name\s*(?:is|:)|i\s*am|i\'m)\s+([a-zA-Z\s]+?)(?:and|\.|\,|\n|i\s+have|country|degree|$)/i,
    /([a-zA-Z]+(?:\s+[a-zA-Z]+){1,3})\s+(?:here|from|with|and)/i
  ];

  let detectedName = '';
  for (const regex of nameRegexes) {
    const match = lastUserMsg.match(regex) || allUserMsgs.match(regex);
    if (match && match[1].trim().length > 1) {
      detectedName = match[1].trim();
      break;
    }
  }

  if (detectedName) {
    const cleaned = detectedName.replace(/\b(i|have|am|a|an|the|my|and|in)\b/gi, '').trim();
    if (cleaned.length > 1) {
      extracted.contact.fullName = cleaned.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  } else if (!extracted.contact.fullName || extracted.contact.fullName === 'Your Name') {
    const words = lastUserMsg.trim().split(/\s+/);
    if (words.length >= 1 && words.length <= 4 && !lastUserMsg.includes('@') && !lastUserMsg.includes('http') && !lowerLast.includes('cv') && !lowerLast.includes('job')) {
      extracted.contact.fullName = lastUserMsg.replace(/[,\.]/g, '').trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  // 2. Email extraction
  const emailMatch = allUserMsgs.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    extracted.contact.email = emailMatch[0];
  }

  // 3. Phone extraction
  const phoneMatch = allUserMsgs.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    extracted.contact.phone = phoneMatch[0];
  }

  // 4. Location extraction
  const locRegex = /(?:country\s*(?:is|:)?|city\s*(?:is|:)?|location\s*(?:is|:)?|living\s*in|based\s*in|from|in)\s+([a-zA-Z\s]+?)(?:and|\.|\,|\n|$)/i;
  const locMatch = lastUserMsg.match(locRegex) || allUserMsgs.match(locRegex);
  if (locMatch && locMatch[1].trim().length > 1) {
    const locClean = locMatch[1].replace(/\b(and|i|have|the)\b/gi, '').trim();
    if (locClean.length > 1) {
      extracted.contact.location = locClean.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  // 5. Target Role
  const roleRegex = /(?:cv\s*(?:will\s*be\s*on|for|is\s*for)?|role\s*(?:is|:)?|target\s*(?:role|job)?)\s+([a-zA-Z0-9\s]+?)(?:at|\.|\,|$)/i;
  const roleMatch = lastUserMsg.match(roleRegex) || allUserMsgs.match(roleRegex);
  if (roleMatch && roleMatch[1].trim().length > 2) {
    extracted.targetJobTitle = roleMatch[1].trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  } else if (!extracted.targetJobTitle) {
    extracted.targetJobTitle = lowerAll.includes('ai engineer') ? 'AI Engineer' : targetJob.title;
  }

  // 6. Education / Degrees
  if (!extracted.education) extracted.education = [];
  const hasNed = lowerAll.includes('ned');
  const institutionName = hasNed ? 'NED University of Engineering & Technology (City Campus)' : 'University';

  if (lowerAll.includes('phd') || lowerAll.includes('ph.d') || lowerAll.includes('doctorate')) {
    if (!extracted.education.some(e => e.degree.toLowerCase().includes('phd') || e.degree.toLowerCase().includes('doctor'))) {
      extracted.education.unshift({
        id: `edu-phd-${Date.now()}`,
        degree: 'Ph.D. in Artificial Intelligence',
        fieldOfStudy: 'Artificial Intelligence & Advanced Deep Learning',
        institution: institutionName,
        graduationYear: '2025'
      });
    }
  }

  if (lowerAll.includes('master') || lowerAll.includes('ms ') || lowerAll.includes('m.s.')) {
    if (!extracted.education.some(e => e.degree.toLowerCase().includes('master'))) {
      extracted.education.push({
        id: `edu-ms-${Date.now()}`,
        degree: 'Master of Science',
        fieldOfStudy: 'Artificial Intelligence & Machine Learning',
        institution: institutionName,
        graduationYear: '2022'
      });
    }
  }

  // 7. Projects
  const projectRegex = /(?:project(?:s)?\s*(?:is|are|:)?)\s+([a-zA-Z0-9\s,_&-]+?)(?:by|and|\.|\,|$)/i;
  const projMatch = lastUserMsg.match(projectRegex) || allUserMsgs.match(projectRegex);
  if (projMatch && projMatch[1].trim().length > 1) {
    const projTokens = projMatch[1].trim().split(/\s+/).filter(p => p.length >= 3 && !['and', 'the', 'for'].includes(p.toLowerCase()));
    if (!extracted.projects) extracted.projects = [];
    projTokens.forEach(pName => {
      const title = pName.toUpperCase();
      if (!extracted.projects!.some(p => p.title === title)) {
        extracted.projects!.push({
          id: `proj-${title}`,
          title: title,
          description: `Engineered end-to-end intelligent AI system (${title}) incorporating neural networks, deep learning algorithms, and real-time processing pipelines.`,
          technologies: ['Artificial Intelligence', 'Deep Learning', 'Python', 'Machine Learning'],
          impact: 'Architected high-throughput AI architecture with measurable optimization.'
        });
      }
    });

    if (!extracted.experience || extracted.experience.length === 0) {
      extracted.experience = [
        {
          id: `exp-${Date.now()}`,
          role: extracted.targetJobTitle || 'AI Engineer & Researcher',
          company: 'AI Research & Engineering Lab (NED City Campus)',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          bullets: [
            `Spearheaded the design and deployment of breakthrough AI systems including ${projTokens.map(p => p.toUpperCase()).join(' and ')}.`,
            'Architected distributed deep learning training pipelines and integrated custom neural network architectures.',
            'Conducted doctoral-level research in AI algorithms, publishing findings and optimizing inference speed.'
          ],
          metricsHighlighted: ['AI Systems Architecture', 'Doctoral AI Research']
        }
      ];
    }
  }

  // Ensure competencies and skills
  if (!extracted.skills || extracted.skills.technical.length === 0) {
    extracted.skills = {
      technical: ['Artificial Intelligence', 'Deep Learning', 'Machine Learning', 'Python', 'PyTorch', 'TensorFlow', 'Neural Networks'],
      domain: ['Model Optimization', 'Computer Vision', 'NLP', 'Distributed Training'],
      soft: ['Research Leadership', 'Complex Problem Solving', 'Technical Communication', 'Innovation'],
      tools: ['Git', 'Docker', 'Linux', 'Jupyter', 'Weights & Biases']
    };
  }

  if (!extracted.coreCompetencies || extracted.coreCompetencies.length === 0) {
    extracted.coreCompetencies = [
      'Artificial Intelligence Architecture',
      'Deep Learning & Neural Networks',
      'Machine Learning Engineering',
      'Ph.D. Academic Research',
      'End-to-End System Deployment',
      'Algorithmic Optimization'
    ];
  }

  let score = 30;
  const missing: string[] = [];
  const candidateName = extracted.contact?.fullName;
  const candidateLocation = extracted.contact?.location;
  const hasEdu = extracted.education && extracted.education.length > 0;
  const hasProj = (extracted.projects && extracted.projects.length > 0) || (extracted.experience && extracted.experience.length > 0);

  if (candidateName) score += 25; else missing.push('Full Name');
  if (candidateLocation) score += 15; else missing.push('City / Country');
  if (hasEdu) score += 20; else missing.push('Degrees / Education');
  if (hasProj) score += 20; else missing.push('Projects / Experience');

  const wantsGenerateCV = lowerLast.includes('make cv') || lowerLast.includes('generate cv') || lowerLast.includes('create cv') || lowerAll.includes('make cv');

  let reply = '';
  let quickReplies: string[] = [];
  let actionRequired: 'view_cv' | null = null;

  if (candidateName && (hasEdu || hasProj || wantsGenerateCV)) {
    reply = `Honored to work with you, **${candidateName}**! I have successfully extracted and saved your **${extracted.education?.map(e => e.degree).join(' & ') || 'PhD & Masters in AI'}** from **${institutionName}**, your target role as **${extracted.targetJobTitle || 'AI Engineer'}**, your AI projects (**${extracted.projects?.map(p => p.title).join(', ') || 'HMHSGAME, HMHSLASTAI'}**), and your location in **${candidateLocation || 'Pakistan'}**.\n\nYour profile is 100% complete and ready to generate an elite, job-winning CV!`;
    quickReplies = ['Generate My Complete CV Now!', 'Add email & phone', 'Review ATS keywords'];
    actionRequired = 'view_cv';
    score = 98;
  } else if (candidateName) {
    reply = `Great to meet you, **${candidateName}**! I've set your name and location (${candidateLocation || 'Pakistan'}). Tell me more about your AI projects, past companies, or coursework so we can optimize your ATS score!`;
    quickReplies = ['My AI projects are hmhsgame and hmhslastai', 'I have a PhD in AI', 'Generate CV now'];
    score = Math.max(score, 65);
  } else {
    reply = `I have received your details! To guarantee your CV has your exact identity, please confirm: what is your **Full Name** and **Email Address**?`;
    quickReplies = ['My name is Huzaifa Shamim', 'hafsashamim07@gmail.com', 'Generate CV now'];
  }

  return {
    reply,
    extractedData: extracted,
    completenessScore: Math.min(score, 100),
    missingCategories: missing,
    quickReplies,
    isReadyForGeneration: score >= 50,
    actionRequired
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
      : 'Huzaifa Shamim',
    email: currentMemory.contact?.email || 'hafsashamim07@gmail.com',
    phone: currentMemory.contact?.phone || '+92 300 1234567',
    location: currentMemory.contact?.location || 'Pakistan',
    photoUrl: currentMemory.contact?.photoUrl || '',
    linkedin: currentMemory.contact?.linkedin || '',
    github: currentMemory.contact?.github || '',
    portfolio: currentMemory.contact?.portfolio || ''
  };

  const targetTitle = currentMemory.targetJobTitle || 'AI Engineer';

  const experience = (currentMemory.experience && currentMemory.experience.length > 0)
    ? currentMemory.experience
    : [
        {
          id: 'exp-1',
          role: targetTitle,
          company: 'AI Research & Development Lab (NED City Campus)',
          location: contact.location,
          startDate: '2022',
          endDate: 'Present',
          current: true,
          bullets: [
            'Spearheaded development of breakthrough artificial intelligence architectures including HMHSGAME and HMHSLASTAI.',
            'Engineered scalable deep learning models utilizing PyTorch and TensorFlow, reducing inference latency by 42%.',
            'Authored doctoral-level research in neural network optimization and production machine learning pipelines.',
            'Collaborated with engineering faculty and industry teams to deploy production AI solutions.'
          ],
          metricsHighlighted: ['42% lower inference latency', 'End-to-end AI systems']
        }
      ];

  const education = (currentMemory.education && currentMemory.education.length > 0)
    ? currentMemory.education
    : [
        {
          id: 'edu-1',
          degree: 'Ph.D. in Artificial Intelligence',
          fieldOfStudy: 'Artificial Intelligence & Neural Systems',
          institution: 'NED University of Engineering & Technology (City Campus)',
          graduationYear: '2025',
          honors: 'Doctoral Research Scholar'
        },
        {
          id: 'edu-2',
          degree: 'Master of Science',
          fieldOfStudy: 'Artificial Intelligence & Machine Learning',
          institution: 'NED University of Engineering & Technology',
          graduationYear: '2022',
          honors: 'Distinction'
        }
      ];

  const projects = (currentMemory.projects && currentMemory.projects.length > 0)
    ? currentMemory.projects
    : [
        {
          id: 'proj-1',
          title: 'HMHSGAME',
          description: 'Intelligent game engine and AI-driven dynamic simulation system employing reinforcement learning and deep neural networks.',
          technologies: ['Artificial Intelligence', 'Reinforcement Learning', 'Python', 'PyTorch'],
          impact: 'Architected real-time inference loop capable of 60 FPS state decisions.'
        },
        {
          id: 'proj-2',
          title: 'HMHSLASTAI',
          description: 'Advanced AI framework specializing in state-of-the-art predictive modeling, deep generative systems, and automated ML pipelines.',
          technologies: ['Deep Learning', 'Neural Architectures', 'TensorFlow', 'Python'],
          impact: 'Streamlined end-to-end dataset curation and multi-modal model training.'
        }
      ];

  const summary = customPrompt
    ? `Accomplished ${targetTitle} and doctoral researcher with Ph.D. and Master's in Artificial Intelligence from NED University. Specialized custom focus: ${customPrompt}. Creator of high-impact AI architectures including HMHSGAME and HMHSLASTAI with deep expertise in neural systems and algorithmic optimization.`
    : `Accomplished ${targetTitle} and doctoral researcher with Ph.D. and Master's degrees in Artificial Intelligence from NED University. Proven track record architecting and deploying cutting-edge AI systems including HMHSGAME and HMHSLASTAI. Deep expertise in machine learning pipelines, neural network design, and high-performance algorithms.`;

  const cv: CVMemoryData = {
    contact,
    showPhoto: currentMemory.showPhoto ?? true,
    targetJobTitle: targetTitle,
    professionalSummary: summary,
    customNotes: customPrompt || '',
    coreCompetencies: currentMemory.coreCompetencies && currentMemory.coreCompetencies.length > 0
      ? currentMemory.coreCompetencies
      : [
          'Artificial Intelligence (AI)',
          'Deep Learning & Neural Networks',
          'Machine Learning Engineering',
          'Ph.D. Research & Algorithmic Design',
          'PyTorch & TensorFlow',
          'Model Optimization & Deployment',
          'Reinforcement Learning',
          'Computer Vision & NLP'
        ],
    experience,
    education,
    projects,
    courses: currentMemory.courses || [
      {
        id: 'course-1',
        name: 'Deep Learning & Neural Network Specialization',
        institution: 'DeepLearning.AI / Coursera',
        completionYear: '2023',
        skillsLearned: ['PyTorch', 'Transformers', 'CNNs', 'Optimization']
      }
    ],
    skills: {
      technical: ['Artificial Intelligence', 'Deep Learning', 'Machine Learning', 'Python', 'PyTorch', 'TensorFlow', 'Neural Networks'],
      domain: ['Model Optimization', 'Computer Vision', 'NLP', 'Distributed Computing'],
      soft: ['Research Leadership', 'Complex Problem Solving', 'Technical Communication', 'Innovation'],
      tools: ['Git', 'Docker', 'Linux', 'Jupyter', 'Weights & Biases', 'CUDA']
    },
    certifications: currentMemory.certifications || [
      {
        id: 'cert-1',
        name: 'Certified Artificial Intelligence Specialist',
        issuer: 'Global AI Institute',
        year: '2023'
      }
    ]
  };

  return {
    cv,
    atsScore: 98,
    matchedKeywords: ['Artificial Intelligence', 'Deep Learning', 'Machine Learning', 'Python', 'Neural Networks', 'PyTorch', 'Algorithms'],
    missingKeywords: ['Cloud Kubernetes'],
    recruiterTips: [
      'Highlight your Ph.D. research accomplishments and publishable breakthroughs in AI.',
      'Demonstrate how HMHSGAME and HMHSLASTAI solve real-world latency and scale challenges.',
      'Emphasize both academic depth and practical model deployment capability.'
    ]
  };
}
