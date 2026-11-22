/**
 * Official NISB Roster and Institutional Metadata
 * Sourced directly from official NIE IEEE Student Branch records:
 * https://www.nisb.in/ and https://www.nisb.in/content.html
 *
 * IEEE Bangalore Section · The National Institute of Engineering, Mysuru
 */

export interface OfficialRosterMember {
  id: string; // Matches public.members seed UUID
  fullName: string;
  designation: string;
  category: "Executive Leadership" | "Coordination & Editorial" | "Society Officers";
  portfolio: string;
  societySlug?: "ieee-cs" | "ieee-wie" | "ieee-cass" | "ieee-ras" | "ieee-grss" | "ieee-ceda";
  societyName?: string;
  photoUrl: string;
  localPhotoUrl: string;
}

export const OFFICIAL_ROSTER_MEMBERS: OfficialRosterMember[] = [
  {
    id: "22222222-2222-4222-a222-000000000001",
    fullName: "Sagar Kumar Singh",
    designation: "Chairperson",
    category: "Executive Leadership",
    portfolio: "Branch Executive",
    photoUrl: "https://www.nisb.in/assets/cores25-26/SagarSingh.jpg",
    localPhotoUrl: "/assets/cores25-26/SagarSingh.jpg",
  },
  {
    id: "22222222-2222-4222-a222-000000000002",
    fullName: "Abhay Hegde",
    designation: "Vice Chairperson & Secretary (MP)",
    category: "Executive Leadership",
    portfolio: "Branch Executive · Media & Publicity",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Abhay.jpg",
    localPhotoUrl: "/assets/cores25-26/Abhay.jpg",
  },
  {
    id: "22222222-2222-4222-a222-000000000003",
    fullName: "Yogesh S",
    designation: "Treasurer",
    category: "Executive Leadership",
    portfolio: "Branch Executive · Finance",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Yogesh.jpg",
    localPhotoUrl: "/assets/cores25-26/Yogesh.jpg",
  },
  {
    id: "22222222-2222-4222-a222-000000000004",
    fullName: "Sakleshwar Hubli",
    designation: "Secretary (IA)",
    category: "Executive Leadership",
    portfolio: "Internal Affairs",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Saklesh.jpg",
    localPhotoUrl: "/assets/cores25-26/Saklesh.jpg",
  },
  {
    id: "22222222-2222-4222-a222-000000000005",
    fullName: "K Anantha Krishna Rao",
    designation: "Secretary (Events)",
    category: "Executive Leadership",
    portfolio: "Events Management",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Anantha.jpg",
    localPhotoUrl: "/assets/cores25-26/Anantha.jpg",
  },
  {
    id: "22222222-2222-4222-a222-000000000006",
    fullName: "Shreya P V",
    designation: "Secretary (Events)",
    category: "Executive Leadership",
    portfolio: "Events Management",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Shreya%20P%20V.jpg",
    localPhotoUrl: "/assets/cores25-26/Shreya P V.jpg",
  },
  {
    id: "22222222-2222-4222-a222-000000000007",
    fullName: "Aadya Sharma",
    designation: "Secretary (MP)",
    category: "Executive Leadership",
    portfolio: "Media & Publicity",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Aadya.jpeg",
    localPhotoUrl: "/assets/cores25-26/Aadya.jpeg",
  },
  {
    id: "22222222-2222-4222-a222-000000000008",
    fullName: "Sagar N Mutalik",
    designation: "Secretary (MD) & SAC Coordinator",
    category: "Coordination & Editorial",
    portfolio: "Membership Development & SAC",
    photoUrl: "https://www.nisb.in/assets/cores25-26/SagarNM.jpg",
    localPhotoUrl: "/assets/cores25-26/SagarNM.jpg",
  },
  {
    id: "22222222-2222-4222-a222-000000000009",
    fullName: "Pranav A Korlahalli",
    designation: "Technology Coordinator",
    category: "Coordination & Editorial",
    portfolio: "Technology & Web Operations",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Pranav.jpg",
    localPhotoUrl: "/assets/cores25-26/Pranav.jpg",
  },
  {
    id: "22222222-2222-4222-a222-000000000010",
    fullName: "Aashish Vatwani",
    designation: "Technology Coordinator",
    category: "Coordination & Editorial",
    portfolio: "Technology & Systems",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Aashish.jpg",
    localPhotoUrl: "/assets/cores25-26/Aashish.jpg",
  },
  {
    id: "22222222-2222-4222-a222-000000000011",
    fullName: "Rahul K",
    designation: "Editor-in-Chief",
    category: "Coordination & Editorial",
    portfolio: "Editorial & Publications",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Rahul.jpeg",
    localPhotoUrl: "/assets/cores25-26/Rahul.jpeg",
  },
  {
    id: "22222222-2222-4222-a222-000000000012",
    fullName: "Shresth S Juptimath",
    designation: "Sponsorship Coordinator",
    category: "Coordination & Editorial",
    portfolio: "Sponsorship & External Relations",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Shresht.JPG",
    localPhotoUrl: "/assets/cores25-26/Shresht.JPG",
  },
  {
    id: "22222222-2222-4222-a222-000000000013",
    fullName: "Priyanka Pramod Daivagna",
    designation: "CS Chairperson",
    category: "Society Officers",
    portfolio: "Computer Society Chapter",
    societySlug: "ieee-cs",
    societyName: "Computer Society",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Priyanka.jpeg",
    localPhotoUrl: "/assets/cores25-26/Priyanka.jpeg",
  },
  {
    id: "22222222-2222-4222-a222-000000000014",
    fullName: "Prerika P",
    designation: "CS Secretary",
    category: "Society Officers",
    portfolio: "Computer Society Chapter",
    societySlug: "ieee-cs",
    societyName: "Computer Society",
    photoUrl: "https://www.nisb.in/assets/cores25-26/PrerikaP.jpeg",
    localPhotoUrl: "/assets/cores25-26/PrerikaP.jpeg",
  },
  {
    id: "22222222-2222-4222-a222-000000000015",
    fullName: "Nikitha H S",
    designation: "CASS Chairperson & RAS Chairperson",
    category: "Society Officers",
    portfolio: "Circuits & Systems / Robotics & Automation",
    societySlug: "ieee-cass",
    societyName: "Circuits & Systems / RAS",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Nikitha.jpeg",
    localPhotoUrl: "/assets/cores25-26/Nikitha.jpeg",
  },
  {
    id: "22222222-2222-4222-a222-000000000016",
    fullName: "Suma Acharya",
    designation: "CASS Secretary",
    category: "Society Officers",
    portfolio: "Circuits and Systems Society",
    societySlug: "ieee-cass",
    societyName: "Circuits and Systems Society",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Suma.jpg",
    localPhotoUrl: "/assets/cores25-26/Suma.jpg",
  },
  {
    id: "22222222-2222-4222-a222-000000000017",
    fullName: "Sanjana S Shetty",
    designation: "WIE Chairperson",
    category: "Society Officers",
    portfolio: "Women in Engineering Affinity Group",
    societySlug: "ieee-wie",
    societyName: "Women in Engineering",
    photoUrl: "https://www.nisb.in/assets/cores25-26/SanjanaS.jpg",
    localPhotoUrl: "/assets/cores25-26/SanjanaS.jpg",
  },
  {
    id: "22222222-2222-4222-a222-000000000018",
    fullName: "Panchami Urs S",
    designation: "WIE Secretary",
    category: "Society Officers",
    portfolio: "Women in Engineering Affinity Group",
    societySlug: "ieee-wie",
    societyName: "Women in Engineering",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Panchami.jpg",
    localPhotoUrl: "/assets/cores25-26/Panchami.jpg",
  },
  {
    id: "22222222-2222-4222-a222-000000000019",
    fullName: "Rachit Kulkarni",
    designation: "RAS Secretary",
    category: "Society Officers",
    portfolio: "Robotics and Automation Society",
    societySlug: "ieee-ras",
    societyName: "Robotics and Automation Society",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Rachit.jpeg",
    localPhotoUrl: "/assets/cores25-26/Rachit.jpeg",
  },
  {
    id: "22222222-2222-4222-a222-000000000020",
    fullName: "Mohammed Mansooruddin",
    designation: "GRSS Chairperson",
    category: "Society Officers",
    portfolio: "Geoscience & Remote Sensing Society",
    societySlug: "ieee-grss",
    societyName: "Geoscience & Remote Sensing Society",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Mansoor.jpg",
    localPhotoUrl: "/assets/cores25-26/Mansoor.jpg",
  },
  {
    id: "22222222-2222-4222-a222-000000000021",
    fullName: "Amol S",
    designation: "GRSS Secretary",
    category: "Society Officers",
    portfolio: "Geoscience & Remote Sensing Society",
    societySlug: "ieee-grss",
    societyName: "Geoscience & Remote Sensing Society",
    photoUrl: "https://www.nisb.in/assets/cores25-26/Amol.jpg",
    localPhotoUrl: "/assets/cores25-26/Amol.jpg",
  },
];

export interface OfficialSocietyInfo {
  slug: string;
  name: string;
  shortName: string;
  establishedYear: string | null;
  websiteUrl: string;
  logoUrl: string;
  description: string;
  highlights: string[];
}

export const OFFICIAL_SOCIETIES: OfficialSocietyInfo[] = [
  {
    slug: "ieee-cs",
    name: "Computer Society",
    shortName: "CS",
    establishedYear: "2015",
    websiteUrl: "https://www.computer.org",
    logoUrl: "/assets/images/cs.png",
    description:
      "The IEEE Computer Society is a global community dedicated to advancing computing technology through research, education, and collaboration. It is one of IEEE's largest and most influential societies, shaping the future of software and hardware. The Computer Society, started in 2015, has grown to become one of the most active chapters at NISB. With over 50 members, it brings together tech enthusiasts through workshops, competitions, and seminars.",
    highlights: ["Over 50 Active Members", "Algorithmic Challenges", "Hands-on Computing Workshops"],
  },
  {
    slug: "ieee-wie",
    name: "Women in Engineering",
    shortName: "WIE",
    establishedYear: "2015",
    websiteUrl: "https://wie.ieee.org",
    logoUrl: "/assets/images/wie.png",
    description:
      "IEEE Women in Engineering (WIE) is one of the largest international professional organizations dedicated to promoting women engineers and scientists and inspiring girls around the world to follow their academic interests to a career in engineering. The IEEE Women in Engineering Student Branch Affinity Group at The National Institute of Engineering was formed on April 2015.",
    highlights: ["Formed April 2015", "Weekly Meetups", "Mentorship & Hands-on Projects"],
  },
  {
    slug: "ieee-cass",
    name: "Circuits and Systems Society",
    shortName: "CASS",
    establishedYear: null,
    websiteUrl: "https://ieee-cas.org",
    logoUrl: "/assets/images/cas.png",
    description:
      "The IEEE Circuits and Systems Society is the leading organization that promotes the advancement of the theory, analysis, design, tools, and implementation of circuits and systems. The field spans their theoretical foundations, applications, and architectures, as well as circuits and systems implementation of algorithms for signal and information processing.",
    highlights: ["Analog & Digital Systems", "VLSI Architecture", "Signal Processing Algorithms"],
  },
  {
    slug: "ieee-ras",
    name: "Robotics and Automation Society",
    shortName: "RAS",
    establishedYear: null,
    websiteUrl: "https://www.ieee-ras.org",
    logoUrl: "/assets/images/ras.png",
    description:
      "The IEEE Robotics and Automation Society's objectives are scientific, literary and educational in character. The Society strives for the advancement of the theory and practice of robotics and automation engineering and science and of the allied arts and sciences, and for the maintenance of high professional standards among its members.",
    highlights: ["Autonomous Robotics", "Embedded Control Systems", "Automation Engineering"],
  },
  {
    slug: "ieee-grss",
    name: "Geoscience and Remote Sensing Society",
    shortName: "GRSS",
    establishedYear: null,
    websiteUrl: "https://www.grss-ieee.org",
    logoUrl: "/assets/images/grss.png",
    description:
      "The IEEE Geoscience and Remote Sensing Society (GRSS) is a technical Society of the Institute of Electrical and Electronics Engineers (IEEE). GRSS fosters engagement of its members for the benefit of society through science, engineering, applications, and education as related to the development of the field of geoscience and remote sensing.",
    highlights: ["Satellite Earth Observation", "Spatial Data Analysis", "Remote Sensing Tech"],
  },
  {
    slug: "ieee-ceda",
    name: "Council on Electronic Design Automation",
    shortName: "CEDA",
    establishedYear: null,
    websiteUrl: "https://ieee-ceda.org/",
    logoUrl: "/assets/images/IEEE CEDA Logo.png",
    description:
      "The IEEE Council on Electronic Design Automation (CEDA) is the leading organization dedicated to the advancement of electronic design automation (EDA) theory, methodologies, tools, and practices for circuits and systems. CEDA fosters innovation by supporting the development and application of algorithms, software, and frameworks for the efficient design, verification, simulation, and implementation of modern electronic systems.",
    highlights: ["Electronic Design Automation", "Hardware Verification", "System-level Synthesis"],
  },
];

export interface OfficialActivity {
  title: string;
  badge: string;
  description: string;
  details: string;
}

export const OFFICIAL_ACTIVITIES: OfficialActivity[] = [
  {
    title: "Focus Groups",
    badge: "Technical Cohorts",
    description:
      "People with common technical interests form cohorts to study particular technologies and develop real-life engineering projects.",
    details:
      "Active cohorts in Microcontrollers (AVR Atmega), Deep Learning, Full-Stack Web Development, and Python Programming.",
  },
  {
    title: "WIE Weekly Meetups",
    badge: "Affinity Initiative",
    description:
      "Women in Engineering affinity group conducts weekly sessions focused on learning new technical concepts and implementing practical projects.",
    details:
      "Providing a supportive, collaborative forum for women in STEM to learn, experiment, and build engineering confidence.",
  },
  {
    title: "Industrial Visits",
    badge: "Industry Exposure",
    description:
      "Technical study tours designed to give students practical exposure to modern industrial engineering workflows every semester.",
    details:
      "Recent visits include ISRO Space Centre, Indian Institute of Science (IISc) Bangalore, NOKIA, Cisco, and Infosys.",
  },
  {
    title: "Social & Community Initiatives",
    badge: "Community Outreach",
    description:
      "Every year we conduct outreach to local organizations, including old age ashrams and Divya Deepa, with dedicated themes.",
    details:
      "Familiarizing children and senior citizens with basic everyday technology and its practical benefits for individuals.",
  },
];

export interface OfficialFest {
  name: string;
  timing: string;
  tagline: string;
  description: string;
}

export const OFFICIAL_FESTS: OfficialFest[] = [
  {
    name: "ANKURA",
    timing: "Odd Semester Flagship",
    tagline: "The Annual Technical Conclave",
    description:
      "NISB's premier odd-semester technical symposium, bringing together hundreds of student engineers for hackathons, paper presentations, and hardware challenges.",
  },
  {
    name: "ADROIT",
    timing: "Even Semester Flagship",
    tagline: "The Innovation & Engineering Festival",
    description:
      "The signature even-semester celebration of engineering ingenuity, featuring code sprints, robotics arenas, technical quizzes, and design summits.",
  },
  {
    name: "Electronika",
    timing: "Hardware Showcase",
    tagline: "Signature Circuit Design Competition",
    description:
      "A flagship electronics competition where participants design, debug, and prototype complex circuit systems against strict real-world constraints.",
  },
];

export interface OfficialPublication {
  title: string;
  type: string;
  periodicity: string;
  description: string;
  coverImage: string;
  externalLink?: string;
  downloadLink?: string;
}

export const OFFICIAL_PUBLICATIONS: OfficialPublication[] = [
  {
    title: "MANAS",
    type: "Newsletter",
    periodicity: "Half-Yearly Newsletter",
    description:
      "The official bi-annual chronicle of NISB, documenting workshops, project demonstrations, student achievements, and branch activities across each term.",
    coverImage: "/assets/images/Manas 26.png",
    externalLink: "https://drive.google.com/file/d/1IVuRX4ufSidQTY7JNqsXEw8h_bmfeoib/view?usp=drivesdk",
  },
  {
    title: "JIJNASA",
    type: "Magazine",
    periodicity: "Annual Flagship Magazine",
    description:
      "NISB's flagship annual print publication, featuring in-depth technical essays, interviews with distinguished alumni, student research papers, and IEEE society reviews.",
    coverImage: "/assets/images/JijnasaVol11frontcover.png",
    externalLink: "https://tinyurl.com/JIJNASA-2025",
    downloadLink: "https://drive.google.com/file/d/1TDvLes_1qqPScCuo4VGmWwccofT2bV3R/view?usp=sharing",
  },
];

export const OFFICIAL_CONTACT = {
  institution: "NIE IEEE Student Branch (NISB)",
  college: "The National Institute of Engineering",
  address: "Manandavadi Road, Mysuru - 570008, Karnataka, India",
  section: "IEEE Bangalore Section",
  subSection: "IEEE Mysuru Sub Section",
  region: "IEEE Region 10 (Asia-Pacific)",
  chairperson: "Sagar Kumar Singh",
  phone: "+91 86603 18339",
  email: "sagarks@ieee.org",
  socials: {
    instagram: "https://www.instagram.com/ieee_nie/",
    linkedin: "https://www.linkedin.com/company/nisb/",
    youtube: "https://www.youtube.com/channel/UCATF66mX12qcxEIA3lgSpaw",
    github: "https://github.com/nisbweb",
    discord: "https://dsc.gg/nisb",
    blog: "https://blog.nisb.in/",
    ieeeGlobal: "https://www.ieee.org/",
  },
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.471105659842!2d76.63895801453533!3d12.284028791309561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf65561e102919%3A0xf947b18cc5ad3d88!2sThe%20National%20Institute%20of%20Engineering!5e0!3m2!1sen!2sin!4v1608920087132!5m2!1sen!2sin",
};
