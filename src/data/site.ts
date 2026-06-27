// Central site + personal data. Edit here to update content across the site.

export const site = {
  name: "Amrutha Satishkumar",
  shortName: "Amrutha Satishkumar",
  role: "Data & AI Solution Engineer",
  company: "Microsoft",
  headline:
    "I help teams build AI-ready data platforms that are reliable, governed, and trusted.",
  tagline:
    "I work across both sides of modern AI: the data platforms that make it possible, and the AI and agentic systems built on top, with governance and trust at the core.",
  location: "San Jose, California",
  email: "amruthashetty299@gmail.com",
  linkedin: "https://www.linkedin.com/in/amrutha-satishkumar/",
  // Update this to your final domain before deploying.
  url: "https://buildwithamrutha.com",
  // Web3Forms access key. Create a free key at https://web3forms.com and paste it here.
  web3formsKey: "d89f7345-31db-4f2c-9345-5f759ba895a9",
  // Local avatar (downloaded during migration). Falls back gracefully if missing.
  avatar: "/images/amrutha.png",
} as const;

export const quickFacts: string[] = [
  "7+ years in Data & AI",
  "Agentic AI",
  "Microsoft Fabric",
  "Azure AI Foundry",
  "Data Warehouse Architecture",
  "Responsible AI",
];

export const nav: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Builds", href: "/builds" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
];

// Live projects and experiments (Try It Out page).
export type Project = {
  title: string;
  category: string;
  description: string;
  url: string;
  tags: string[];
  note?: string;
};

export const projects: Project[] = [
  {
    title: "UrbanPulse Data Lab",
    category: "Data Lab",
    description:
      "An interactive data lab that turns raw city data into clear, explorable insights. A hands-on playground for analytics, visualization, and finding the story inside urban patterns.",
    url: "https://amruthasatishkumar.github.io/urbanpulse-data-lab/",
    tags: ["Data Analytics", "Visualization", "Data Lab"],
    note: "Built for Microsoft, can be run on your own tenant using the Data Setup instructions.",
  },
  {
    title: "Self Chakra",
    category: "Web App",
    description:
      "A self-development and journaling web app built to make reflection a daily habit, with space to track growth, mood, and intentions over time.",
    url: "https://self-chakra.vercel.app/",
    tags: ["Web App", "Journaling", "Self-development"],
    note: "Work in progress, feel free to use it. Your data privacy is fully maintained.",
  },
];

export type FocusCard = { title: string; body: string };

export const focusCards: FocusCard[] = [
  {
    title: "AI-Ready Data Foundations",
    body: "Modern data warehouse architecture, estate modernization, and migration strategy that make enterprise data trustworthy enough for AI.",
  },
  {
    title: "Agentic AI in Production",
    body: "Designing and deploying agentic and generative AI systems that move beyond pilots to deliver measurable business outcomes.",
  },
  {
    title: "Governance & Responsible AI",
    body: "Security, lineage, access control, and evaluation engineered in from day one, not bolted on later.",
  },
  {
    title: "From Pilot to Production",
    body: "Performance, cost optimization, and maintainability so solutions scale and survive long past the demo.",
  },
];

// Headline stats band (Home + Experience).
export type Stat = { value: string; label: string };

export const stats: Stat[] = [
  { value: "7+", label: "Years across data & AI" },
  { value: "100+", label: "Enterprise customers" },
  { value: "35+", label: "Solutions shipped to production" },
  { value: "5+", label: "Years on Azure data & AI" },
];

// Personal principles (About page).
export const principles: FocusCard[] = [
  {
    title: "Customer obsessed",
    body: "I start from the outcome the customer needs and work backward, so the solution fits their reality, not just the slide.",
  },
  {
    title: "Curiosity over comfort",
    body: "I learn in the open, document what I figure out, and chase the why behind every system I touch.",
  },
  {
    title: "Substance over hype",
    body: "I care less about buzzwords and more about what actually ships, scales, and holds up in production.",
  },
  {
    title: "Trust by design",
    body: "Governance, security, and clarity are part of the build, never an afterthought bolted on later.",
  },
];

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  summary: string;
  highlights?: string[];
  stack?: string[];
};

export const experience: Experience[] = [
  {
    company: "Microsoft",
    role: "Data & AI Solution Engineer",
    start: "Dec 2025",
    end: "Present",
    location: "San Jose, California",
    summary:
      "Trusted technical advisor to state, local, education, and ISV customers across the data and AI lifecycle. I design secure, scalable Azure analytics solutions, lead modernization and migration planning, and translate customer requirements into production-ready architectures.",
    highlights: [
      "Guide adoption of Microsoft Fabric, Databricks, Synapse, Power BI, and Purview",
      "Lead technical presentations, live demos, and hands-on sessions for customers and universities",
      "Focus on governance, performance, cost optimization, and long-term maintainability",
      "Partner with sales, engineering, and product from envisioning to implementation readiness",
    ],
    stack: ["Microsoft Fabric", "Databricks", "Synapse", "Power BI", "Purview", "Azure"],
  },
  {
    company: "Lantern",
    role: "Associate Data Consultant, Data Platforms & AI",
    start: "May 2022",
    end: "Nov 2025",
    location: "Remote",
    summary:
      "Delivered agentic AI, NLP, and applied machine learning solutions end to end on Azure, from data pipelines to production deployment and dashboards.",
    highlights: [
      "Agentic AI document automation cut manual review time by 70%",
      "Attrition prediction model improved planning accuracy by 30%",
      "NLP litigation risk modeling reduced legal costs by 20%",
      "Azure Fabric pipelines reduced model training time by 25%",
      "Azure MLOps reduced deployment time by 30%",
      "Azure DevOps CI/CD reduced release errors by 40%",
    ],
    stack: ["Azure ML", "Azure OpenAI", "Microsoft Fabric", "Power BI", "MLOps", "Azure DevOps"],
  },
  {
    company: "Lantern",
    role: "Data Science Intern",
    start: "Jan 2022",
    end: "Apr 2022",
    location: "Dallas, Texas",
    summary:
      "Embedded with the data science team to build and validate ML models end to end, from feature engineering through evaluation and handoff to production pipelines.",
    highlights: [
      "Engineered features and ran model selection across classification and regression tasks for client analytics use cases",
      "Built and cleaned training datasets to improve signal quality and reduce downstream model noise",
      "Collaborated directly with senior data scientists, accelerating the path from experimentation to deployment",
    ],
    stack: ["Python", "Pandas", "Scikit-learn", "SQL"],
  },
  {
    company: "TXU Energy",
    role: "Data Analyst, Project",
    start: "Sep 2022",
    end: "Dec 2022",
    location: "Dallas, Texas",
    summary:
      "Delivered analytics for one of Texas's largest energy providers, translating raw subscription and customer data into executive-ready dashboards that drove commercial strategy.",
    highlights: [
      "Designed Tableau dashboards tracking KPIs for residential and commercial electricity-plan subscriptions",
      "Built and automated Alteryx data prep workflows to replace manual reporting and accelerate insight delivery",
      "Surfaced trends informing pricing and product decisions for business stakeholders",
    ],
    stack: ["Tableau", "Alteryx", "SQL"],
  },
  {
    company: "Hewlett Packard Enterprise",
    role: "Data Analyst Intern",
    start: "Jan 2021",
    end: "Jul 2021",
    location: "Remote",
    summary:
      "Worked within HPE's global analytics function to optimize BI infrastructure and improve the accuracy of ML models powering operational reporting for leadership.",
    highlights: [
      "Redesigned ETL pipelines, accelerating data delivery by 15% across reporting workflows",
      "Improved Qlik app reload performance by 20% through query and data model optimization",
      "Applied SVM feature engineering to boost predictive model performance by 20%",
      "Built dashboards enabling global leadership to track operational KPIs in real time",
    ],
    stack: ["Qlik", "Tableau", "Python", "SQL", "ETL"],
  },
  {
    company: "Center for Pattern Recognition & Machine Intelligence",
    role: "Data Science Developer",
    start: "Jan 2019",
    end: "Dec 2020",
    location: "Bengaluru, India",
    summary:
      "Researched and built deep learning and NLP systems across medical imaging and literary text analysis, delivering models that reached production-grade accuracy benchmarks.",
    highlights: [
      "Built a COVID-19 detection model using VGG16 and PyTorch on X-ray and EHR data, achieving 98% accuracy",
      "Developed NLP pipelines for persona and relationship extraction using NER and sentiment analysis, lifting reader engagement by 25%",
      "Designed full training pipelines from data ingestion through evaluation and results reporting",
    ],
    stack: ["PyTorch", "Python", "NLP", "Deep Learning", "VGG16"],
  },
  {
    company: "Center for Cloud Computing & Big Data, PES University",
    role: "Cloud Developer Intern",
    start: "Jun 2018",
    end: "Dec 2018",
    location: "Bangalore, India",
    summary:
      "Researched distributed resource allocation and built real-time big data ingestion prototypes.",
    highlights: [
      "Prototyped a decentralized, partition-based resource framework with Docker and Mesos APIs",
      "Designed a Spark Streaming and Hadoop model for live, parallel data processing",
    ],
    stack: ["Spark", "Hadoop", "Docker", "Mesos", "Kubernetes"],
  },
];

export type Impact = { metric: string; label: string; detail: string };

export const impact: Impact[] = [
  { metric: "100+", label: "Enterprise customers advised", detail: "Across education, ISVs, and universities" },
  { metric: "70%", label: "Less manual review", detail: "Agentic AI document automation" },
  { metric: "40%", label: "Fewer release errors", detail: "CI/CD automation on Azure DevOps" },
  { metric: "30%", label: "Faster deployments", detail: "MLOps on Azure Machine Learning" },
  { metric: "25%", label: "Faster model training", detail: "Scalable Microsoft Fabric pipelines" },
  { metric: "20%", label: "Lower legal costs", detail: "NLP litigation risk modeling" },
];

export type SkillGroup = { title: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Azure Data Platforms",
    skills: ["Microsoft Fabric", "Azure Databricks", "Synapse Analytics", "Azure Data Factory", "Delta Lake", "Data Warehouse Architecture", "Real-Time Analytics"],
  },
  {
    title: "AI & Agents",
    skills: ["Agentic AI", "Multi-Agent Orchestration", "Azure OpenAI", "Azure AI Foundry", "RAG & Vector Search", "Model Context Protocol (MCP)", "Copilot Studio", "Fine-Tuning & Evaluation"],
  },
  {
    title: "Analytics & BI",
    skills: ["Power BI", "Semantic Modeling", "DAX", "Embedded Analytics", "Executive Dashboards"],
  },
  {
    title: "Governance & Delivery",
    skills: ["Microsoft Purview", "Responsible AI", "Data Governance", "Security & Compliance", "MLOps", "FinOps & Cost Optimization"],
  },
];

export type Certification = { name: string; issuer: string };

export const certifications: Certification[] = [
  { name: "Azure Data Scientist Associate", issuer: "Microsoft Certified" },
  { name: "Fabric Analytics Engineer Associate", issuer: "Microsoft Certified" },
  { name: "Azure Data Engineer Associate", issuer: "Microsoft Certified" },
  { name: "Azure AI Fundamentals", issuer: "Microsoft Certified" },
  { name: "Azure Data Fundamentals", issuer: "Microsoft Certified" },
  { name: "Azure Fundamentals", issuer: "Microsoft Certified" },
];

export type Education = { school: string; degree: string; years: string };

export const education: Education[] = [
  {
    school: "Southern Methodist University, Cox School of Business",
    degree: "MS in Business Analytics, Specialization in Data Platforms & AI",
    years: "2021 to 2022",
  },
  {
    school: "PES University",
    degree: "BTech in Computer Science Engineering, Minor in Data Science",
    years: "2017 to 2021",
  },
];
