export interface Project {
  id: string
  name: string
  year: number
  description: string
  category: string
  status: "active" | "archived" | "completed"
  ownership?: number
  website?: string
  location?: string
  impact?: string
  fundingRound?: string
  images?: string[]
}

export interface Site {
  id: string
  name: string
  title: string
  description: string
  theme: string
  primaryColor: string
  secondaryColor: string
}

// Site configurations
export const sites: Record<string, Site> = {
  srd: {
    id: "srd",
    name: "SRD Innovation Fund",
    title: "Investing in Tomorrow's Breakthroughs",
    description: "Private equity investments in innovation-focused startups and breakthrough technologies",
    theme: "Investments & Innovation",
    primaryColor: "blue",
    secondaryColor: "indigo",
  },
  sanskrut_corp: {
    id: "sanskrut_corp",
    name: "Sanskrut Corp",
    title: "Incubating the Future",
    description: "Supporting early-stage ventures and foundational business experiences",
    theme: "Incubation Platform",
    primaryColor: "green",
    secondaryColor: "emerald",
  },
  sanskrut_enterprises: {
    id: "sanskrut_enterprises",
    name: "Sanskrut Enterprises",
    title: "Hospitality & Real Estate Excellence",
    description: "Premium hospitality investments and strategic property portfolio",
    theme: "Hospitality & Real Estate",
    primaryColor: "purple",
    secondaryColor: "violet",
  },
  sandeep: {
    id: "sandeep",
    name: "Sandeep",
    title: "Technology Leader & Strategic Investor",
    description: "Bridging innovation, investment, and operational excellence",
    theme: "Personal Portfolio & Timeline",
    primaryColor: "orange",
    secondaryColor: "amber",
  },
}

// Project data for each site
export const srdProjects: Project[] = [
  {
    id: "spacex",
    name: "SpaceX",
    year: 2021,
    description:
      "Aerospace manufacturer and space transportation company developing reusable rockets and spacecraft for Mars colonization.",
    category: "Aerospace",
    status: "active",
    ownership: 0.1,
    website: "https://spacex.com",
    impact: "Revolutionizing space travel with reusable rocket technology",
    fundingRound: "Series C",
  },
  {
    id: "groq",
    name: "Groq",
    year: 2022,
    description: "AI hardware company developing Language Processing Units (LPUs) for ultra-fast AI inference.",
    category: "AI Hardware",
    status: "active",
    ownership: 2.5,
    website: "https://groq.com",
    impact: "Enabling real-time AI applications with breakthrough inference speeds",
    fundingRound: "Series A",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    year: 2023,
    description:
      "Conversational AI search engine providing accurate, real-time information with citations and sources.",
    category: "AI Search",
    status: "active",
    ownership: 1.8,
    website: "https://perplexity.ai",
    impact: "Transforming information discovery with AI-powered search",
    fundingRound: "Series B",
  },
  {
    id: "xai",
    name: "xAI",
    year: 2024,
    description: "AI safety company focused on developing safe artificial general intelligence systems.",
    category: "AI Safety",
    status: "active",
    ownership: 0.5,
    impact: "Advancing safe AGI development and AI alignment research",
    fundingRound: "Seed",
  },
  {
    id: "groq2",
    name: "Groq (Series B)",
    year: 2023,
    description: "Follow-on investment in Groq's Series B funding round to support scaling and product development.",
    category: "AI Hardware",
    status: "active",
    ownership: 1.2,
    website: "https://groq.com",
    impact: "Supporting continued innovation in AI inference technology",
    fundingRound: "Series B",
  },
]

export const sanskrutCorpProjects: Project[] = [
  {
    id: "internships",
    name: "Internships Program",
    year: 2007,
    description: "Foundational internship experiences that shaped early career development and business understanding.",
    category: "Career Development",
    status: "completed",
  },
  {
    id: "sampada",
    name: "Sampada",
    year: 2016,
    description: "Real estate development project focused on sustainable and community-oriented housing solutions.",
    category: "Real Estate",
    status: "completed",
    location: "Hyderabad, India",
  },
  {
    id: "manabadi",
    name: "Manabadi",
    year: 2015,
    description:
      "Educational technology initiative providing online learning resources and exam preparation materials.",
    category: "Education",
    status: "active",
    website: "https://manabadi.com",
    impact: "Democratizing education access through technology",
  },
]

export const sanskrutEnterprisesProjects: Project[] = [
  {
    id: "pride-elite-hyderabad",
    name: "Pride Elite Hyderabad",
    year: 2019,
    description: "Luxury hotel project offering premium hospitality services in Hyderabad's business district.",
    category: "Luxury Hotels",
    status: "active",
    ownership: 55,
    location: "Hyderabad, India",
  },
  {
    id: "zostel-hyderabad",
    name: "Zostel Hyderabad",
    year: 2017,
    description:
      "Majority stake in premium backpacker hostel providing affordable accommodation and community experiences.",
    category: "Hostels",
    status: "active",
    ownership: 90,
    location: "Hyderabad, India",
    website: "https://zostel.com",
  },
  {
    id: "zostel-chennai",
    name: "Zostel Chennai",
    year: 2018,
    description: "Strategic minority investment in Zostel's Chennai property expansion.",
    category: "Hostels",
    status: "active",
    ownership: 20,
    location: "Chennai, India",
    website: "https://zostel.com",
  },
  {
    id: "young-monk-dharamshala",
    name: "Young Monk Dharamshala",
    year: 2020,
    description: "Boutique property investment in the spiritual heart of Himachal Pradesh, offering wellness retreats.",
    category: "Boutique Hotels",
    status: "active",
    ownership: 40,
    location: "Dharamshala, India",
  },
]

export const sandeepExperience = [
  {
    id: "google",
    company: "Google",
    role: "Senior Software Engineer",
    period: "2009-2015",
    description: "Led development of large-scale distributed systems and machine learning infrastructure.",
    category: "Technology",
  },
  {
    id: "meta",
    company: "Meta",
    role: "Principal Engineer",
    period: "2016-2019",
    description: "Architected social media platforms and AI-driven recommendation systems.",
    category: "Technology",
  },
  {
    id: "roche",
    company: "Roche",
    role: "Head of Digital Innovation",
    period: "2020-2025",
    description: "Leading digital transformation initiatives in healthcare and pharmaceutical research.",
    category: "Healthcare",
  },
  {
    id: "atoks",
    company: "Atoks",
    role: "Co-founder & CTO",
    period: "2018-Present",
    description: "Building next-generation technology solutions and digital transformation services.",
    category: "Technology",
  },
  {
    id: "silicon-andhra",
    company: "SiliconAndhra",
    role: "Board Member",
    period: "2020-Present",
    description: "Supporting technology entrepreneurship and innovation in the Telugu community.",
    category: "Community",
  },
]
