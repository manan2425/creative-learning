import { Product, RoboticsKit, PracticalExperiment, EngineeringProject, StoreSettings, QuoteItem } from '@/types';

// Zero dummy items - database starts 100% clean
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_KITS: RoboticsKit[] = [];
export const INITIAL_PRACTICALS: PracticalExperiment[] = [];
export const INITIAL_PROJECTS: EngineeringProject[] = [];
export const INITIAL_QUOTES: QuoteItem[] = [];

export const INITIAL_CATEGORIES: string[] = [
  'All',
  'Microcontrollers',
  'Sensors',
  'Motors & Drivers',
  'Power & Battery',
  'Displays',
  'IoT & Wireless',
  'Passives & ICs',
  'Robotics Chassis',
  'Tools & Accessories'
];

export const INITIAL_SETTINGS: StoreSettings = {
  whatsappNumber: '+919714045096',
  storeName: 'Creative Learning - Robotics & Electronics',
  logoUrl: '/logo-emblem.png',
  supportEmail: 'support@creativelearning.in',
  announcementText: '⚡ Welcome to Creative Learning! Direct WhatsApp Ordering • Pan-India Express Delivery',
  showAnnouncement: true,
  freeShippingThreshold: 999,
  defaultDeliveryFee: 60,
  currencySymbol: '₹',
  upiId: '9714045096@upi',
  categories: INITIAL_CATEGORIES,
  hero: {
    badgeText: 'GENUINE STEM HARDWARE & ROBOTICS LABS',
    headlinePrefix: 'Build The Future With',
    highlightWord: 'Next-Gen Robotics',
    headlineSuffix: '& Embedded Systems',
    subheadline: 'Industrial-grade microcontrollers, smart sensor arrays, autonomous rover kits, and open-source STEM blueprints with direct WhatsApp ordering and fast pan-India dispatch.',
    primaryCtaText: 'Explore Hardware Store',
    primaryCtaLink: '#products',
    secondaryCtaText: 'Launch Bot Builder',
    secondaryCtaLink: '#bot-builder',
    stat1Value: '100%',
    stat1Label: 'Pre-Tested Silicon',
    stat2Value: '48h',
    stat2Label: 'Pan-India Dispatch',
    stat3Value: '1-Click Direct',
    stat3Label: 'WhatsApp Dispatch & Support'
  },
  whyUs: {
    badge: 'HARDWARE QUALITY GUARANTEE',
    title: 'Why Creative Learning Leads In STEM Robotics',
    subtitle: 'Every microcontroller, sensor, and starter kit passes through our multi-stage hardware diagnostic pipeline before dispatch.',
    steps: [
      {
        stepNumber: '01',
        title: 'Rigorous Silicon Pre-Testing',
        subtitle: '100% of microcontrollers (ESP32, Arduino, Pico) are bench-flashed with test firmware to verify GPIO pins, ADC accuracy, and clock stability.',
        highlight: 'Zero DOA Guarantee'
      },
      {
        stepNumber: '02',
        title: 'Engineered For Students & Labs',
        subtitle: 'Our starter kits feature plug-and-play wiring guides, clear pinout labels, and verified sample code eliminating wiring mistakes.',
        highlight: 'Zero-Soldering Friendly'
      },
      {
        stepNumber: '03',
        title: 'Direct WhatsApp Support',
        subtitle: 'Get instant hardware troubleshooting, schematic reviews, and bulk lab quotations directly from engineers on WhatsApp.',
        highlight: 'Engineer on Chat'
      },
      {
        stepNumber: '04',
        title: 'Open Source Ecosystem',
        subtitle: 'Every practical and project includes complete wiring diagrams, bill of materials, and downloadable C++/MicroPython source code.',
        highlight: '100% Open Access'
      }
    ],
    guaranteeTitle: 'School, College & Maker Lab Package Consultation',
    guaranteeDesc: 'Equipping a robotics lab or organizing a STEM workshop? We provide custom hardware bundles with itemized GST invoices, curriculum manuals, and component replacement warranties.'
  },
  heroQuoteText: 'The future belongs to students and makers who build what they imagine with hands-on silicon.',
  heroQuoteAuthor: 'Creative Learning Engineering Lab',
  sectionQuotes: {
    globalQuoteText: 'The future belongs to students and makers who build what they imagine with hands-on silicon.',
    globalQuoteAuthor: 'Creative Learning Engineering Lab',
    productsQuoteText: 'Every great invention starts with a single semiconductor, a spark of curiosity, and the courage to build.',
    productsQuoteAuthor: 'Creative Learning Silicon Lab',
    kitsQuoteText: 'Robotics is not just about building machines; it is about building the creative minds that will shape tomorrow.',
    kitsQuoteAuthor: 'Creative Learning Robotics Team',
    practicalsQuoteText: 'True understanding comes from connecting the wires, measuring the signals, and watching theoretical formulas come alive on the breadboard.',
    practicalsQuoteAuthor: 'Creative Learning Practical Division',
    projectsQuoteText: 'When hardware blueprints and firmware are shared openly, human innovation accelerates for every student across the nation.',
    projectsQuoteAuthor: 'Creative Learning Open-Source Community',
  },
  quotes: [],
  footerBio: 'Creative Learning is your premier robotics and electronics supplier, empowering students, makers, and universities with precision STEM kits and embedded components.',
  footerAddress: 'Electronics & Robotics Innovation Hub, Ahmedabad, Gujarat, India',
  footerPhone: 'WhatsApp Direct Chat'
};

