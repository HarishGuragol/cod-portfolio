// ============================================================
// ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ 
// ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ 
// ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
// ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
// ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
//  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝ 
// ============================================================
// Edit THIS FILE to customize your entire portfolio.
// Everything is driven from here — name, projects, skills, etc.
// ============================================================

const CONFIG = {
  // ── Player Identity ──────────────────────────────────────
  player: {
    callsign: "GHOST-X",
    realName: "Harish Guragol",
    rank: "ELITE OPERATIVE",
    title: "Cross-Platform Developer & ML Engineer",
    subtitle: "Flutter | React | Machine Learning | Robotics",
    location: "Bangalore, India",
    bio: `Elite operative specializing in cross-platform development and machine learning combat operations. Deployed across multiple theaters — from Flutter mobile reconnaissance to ReactJS frontend assaults, Python ML intelligence, and robotic warfare systems. Known for building intelligent systems that see, think, and act. Currently running freelance black-ops on Upwork and publishing intel reports on Medium. GitHub arsenal: github.com/HarishGuragol`,
    avatar: '/images/soldier.png',
  },

  // ── Player Stats (shown in HUD) ──────────────────────────
  stats: {
    level: 47,
    prestige: 5,
    xp: 91500,
    maxXp: 100000,
    kd: "∞",
    wins: 312,
    playtime: "3+ Years",
    accuracy: "98.7%",
  },

  // ── Skills (appear in Kill Feed & Armory) ─────────────────
  skills: [
    { name: "Flutter/Dart", category: "PRIMARY", proficiency: 95, icon: "💙" },
    { name: "ReactJS", category: "PRIMARY", proficiency: 88, icon: "⚛️" },
    { name: "Python", category: "PRIMARY", proficiency: 92, icon: "🐍" },
    { name: "Java", category: "PRIMARY", proficiency: 85, icon: "☕" },
    { name: "TensorFlow", category: "SECONDARY", proficiency: 88, icon: "🧠" },
    { name: "PyTorch", category: "SECONDARY", proficiency: 82, icon: "🔥" },
    { name: "Scikit-Learn", category: "SECONDARY", proficiency: 85, icon: "📊" },
    { name: "Keras", category: "SECONDARY", proficiency: 83, icon: "⚡" },
    { name: "Firebase", category: "TACTICAL", proficiency: 90, icon: "🔥" },
    { name: "MySQL", category: "TACTICAL", proficiency: 85, icon: "🐬" },
    { name: "Docker", category: "EQUIPMENT", proficiency: 80, icon: "🐳" },
    { name: "AWS", category: "EQUIPMENT", proficiency: 78, icon: "☁️" },
    { name: "Git/GitHub", category: "EQUIPMENT", proficiency: 95, icon: "📦" },
    { name: "Linux", category: "EQUIPMENT", proficiency: 88, icon: "🐧" },
    { name: "Figma", category: "EQUIPMENT", proficiency: 75, icon: "🎨" },
    { name: "Postman", category: "EQUIPMENT", proficiency: 82, icon: "📮" },
  ],

  // ── Projects (Mission Cards) ──────────────────────────────
  projects: [
    {
      codename: "OPERATION EYE BREAK",
      name: "Eye-Need-A-Break",
      description: "Advanced surveillance system — a web application that uses eye-tracking AI to assess user distraction levels in real-time. Deploys computer vision to monitor focus and displays engagement scores on a tactical dashboard.",
      tech: ["Python", "Computer Vision", "TensorFlow", "Web Dashboard"],
      status: "MISSION COMPLETE",
      difficulty: "LEGENDARY",
      link: "#",
      github: "https://github.com/HarishGuragol",
      image: '/images/tactical-bg.png',
    },
    {
      codename: "OPERATION RESCUE HAWK",
      name: "Survey-and-Rescue (eYRC)",
      description: "Tactical aerial reconnaissance — controlling autonomous drone motion for surveying disaster zones and delivering medical essentials to survivors. Built for the e-Yantra Robotics Competition by IIT Bombay.",
      tech: ["Python", "ROS", "Drone Control", "Path Planning"],
      status: "MISSION COMPLETE",
      difficulty: "LEGENDARY",
      link: "#",
      github: "https://github.com/HarishGuragol",
      image: '/images/warzone.png',
    },
    {
      codename: "PROJECT GROOT",
      name: "Voice-Controlled Robot",
      description: "Deployed an autonomous personal assistant robot with advanced voice recognition capabilities. Responds to voice commands, navigates terrain, and executes complex maneuvers — a true battlefield companion.",
      tech: ["Python", "NLP", "Robotics", "Arduino", "Speech Recognition"],
      status: "MISSION COMPLETE",
      difficulty: "VETERAN",
      link: "#",
      github: "https://github.com/HarishGuragol",
    },
    {
      codename: "OPERATION SERVBOT",
      name: "Restaurant Assistant Bot",
      description: "Autonomous field operative designed to take and deliver orders from assigned tables. Combines navigation AI with order management systems for seamless restaurant automation.",
      tech: ["Robotics", "Python", "Path Planning", "Embedded Systems"],
      status: "MISSION COMPLETE",
      difficulty: "HARDENED",
      link: "#",
      github: "https://github.com/HarishGuragol",
    },
    {
      codename: "OPERATION AGRIBOT",
      name: "Weed Removal Bot",
      description: "R&D black-ops mission — automated computer vision-based robotic system for precision agriculture. Uses ML models to identify and eliminate weeds with surgical accuracy.",
      tech: ["Computer Vision", "ML", "Robotics", "OpenCV", "Python"],
      status: "MISSION COMPLETE",
      difficulty: "VETERAN",
      link: "#",
      github: "https://github.com/HarishGuragol",
    },
    {
      codename: "GHOST PROTOCOL",
      name: "CSV-JSON Converter",
      description: "Tactical data conversion package — a Python utility for seamless conversion between CSV and JSON file formats. Published as a reusable package for rapid data handling in the field.",
      tech: ["Python", "PyPI", "Data Processing"],
      status: "MISSION COMPLETE",
      difficulty: "REGULAR",
      link: "#",
      github: "https://github.com/HarishGuragol",
    },
  ],

  // ── Experience (Campaign Missions) ─────────────────────────
  experience: [
    {
      operation: "OPERATION FREELANCE",
      role: "Freelance Developer",
      company: "Upwork & Independent Contracts",
      location: "Remote / Bangalore",
      period: "2023 — Present",
      description: "Running independent operations across multiple theaters. Building cross-platform applications with Flutter and React, delivering precision-crafted solutions to clients worldwide.",
      highlights: [
        "Delivered 15+ client missions with 100% satisfaction rating",
        "Specialized in Flutter mobile apps and React web applications",
        "Technical writer publishing intel reports on Medium",
      ],
    },
    {
      operation: "OPERATION STARTUP",
      role: "Cross-Platform Developer",
      company: "Startup (Flutter & React)",
      location: "Bangalore, India",
      period: "2022 — 2023",
      description: "10+ months of frontline development at a high-velocity startup. Specialized in cross-platform mobile and web development using Flutter and ReactJS.",
      highlights: [
        "Built production-grade cross-platform applications",
        "Implemented responsive UI/UX across mobile and web",
        "Integrated Firebase backend services and real-time databases",
      ],
    },
    {
      operation: "OPERATION eYRC",
      role: "Robotics Engineer",
      company: "e-Yantra Robotics Competition (IIT Bombay)",
      location: "India",
      period: "2021 — 2022",
      description: "Deployed in high-stakes robotics competition by IIT Bombay. Built autonomous drone systems and rescue robots under extreme pressure and tight deadlines.",
      highlights: [
        "Developed autonomous drone navigation system",
        "Implemented computer vision for survey and rescue operations",
        "Collaborated with multi-disciplinary team on embedded systems",
      ],
    },
  ],

  // ── Education (Training Records) ──────────────────────────
  education: [
    {
      program: "ADVANCED COMBAT TRAINING",
      degree: "Bachelor of Engineering / Technology",
      field: "Computer Science & Engineering",
      institution: "University (Bangalore)",
      period: "2019 — 2023",
      gpa: "Distinction",
    },
    {
      program: "SPECIALIST CERTIFICATIONS",
      certifications: [
        { name: "TensorFlow Developer", year: "2023", badge: "🧠" },
        { name: "Flutter Development", year: "2022", badge: "💙" },
        { name: "Python ML Specialist", year: "2022", badge: "🐍" },
        { name: "AWS Cloud Practitioner", year: "2023", badge: "☁️" },
      ],
    },
  ],

  // ── Contact (Comms Channel) ────────────────────────────────
  contact: {
    email: "harishguragol@gmail.com",
    github: "https://github.com/HarishGuragol",
    linkedin: "https://linkedin.com/in/harish-guragol",
    twitter: "https://twitter.com/HarishGuragol",
    medium: "https://medium.com/@harishguragol",
  },

  // ── Theme Configuration ────────────────────────────────────
  theme: {
    primary: "#00ff41",        // Military neon green
    primaryGlow: "#33ff66",
    primaryDim: "#00cc33",
    secondary: "#ff6a00",      // Tactical orange
    danger: "#ff0044",
    warning: "#ffaa00",
    dark: "#040804",           // Near-black with green tint
    darker: "#020402",
    surface: "#0a120a",        // Dark military green surface
    surfaceLight: "#0f1a0f",
    text: "#c8e6c9",           // Light green text
    textMuted: "#4a6a4a",
    textBright: "#e8ffe8",
    accent: "#00d4ff",         // Tactical blue
  },

  // ── Audio Settings ─────────────────────────────────────────
  audio: {
    enabled: true,
    volume: 0.3,
  },

  // ── Boot Screen Messages ───────────────────────────────────
  bootMessages: [
    "INITIALIZING COMBAT SYSTEMS v4.7.2...",
    "LOADING NEURAL INTERFACE... [OK]",
    "CALIBRATING TARGETING MATRIX... [OK]",
    "ESTABLISHING SECURE UPLINK TO HQ...",
    "DECRYPTING PERSONNEL FILES █████████",
    "LOADING WEAPON PROFILES... 16 WEAPONS CACHED",
    "SYNCING MISSION DATABASE... 6 OPERATIONS FOUND",
    "ACTIVATING THERMAL IMAGING OVERLAY...",
    "SCANNING PERIMETER... AREA SECURE",
    "RUNNING DIAGNOSTICS... ALL SYSTEMS GREEN ✓",
    "DEPLOYING OPERATIVE: GHOST-X...",
    ">>> WELCOME TO THE WARZONE, COMMANDER. <<<",
  ],
};

export default CONFIG;
