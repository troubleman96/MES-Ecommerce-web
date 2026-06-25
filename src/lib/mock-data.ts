// Mock seed data for the MES app. Replace with API calls when backend lands.

export type EquipmentCategory =
  | "Diagnostic"
  | "ICU"
  | "Surgical"
  | "Rehabilitation"
  | "Monitoring"
  | "Imaging";

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  supplierId: string;
  supplierName: string;
  pricePerDay: number;
  rating: number;
  rentals: number;
  verified: boolean;
  isNew?: boolean;
  description: string;
  specs: { label: string; value: string }[];
  features: string[];
  tags: string[];
  availability: "available" | "in-use" | "maintenance";
  availableFrom?: string;
  condition: "New" | "Excellent" | "Good" | "Fair";
  image: string; // gradient seed
  city: string;
}

export interface Booking {
  id: string;
  ref: string;
  equipmentId: string;
  equipmentName: string;
  supplierName: string;
  facilityName: string;
  startDate: string;
  endDate: string;
  days: number;
  amount: number;
  status: "pending" | "active" | "completed" | "disputed" | "overdue" | "due-soon";
}

export interface Contract {
  id: string;
  equipmentName: string;
  supplierName: string;
  facilityName: string;
  signedAt?: string;
  status: "active" | "expired" | "pending";
  startDate: string;
  endDate: string;
  amount: number;
  signedBySupplier: boolean;
  signedByFacility: boolean;
}

export interface AppNotification {
  id: string;
  type: "booking" | "payment" | "return" | "system";
  title: string;
  body: string;
  time: string;
  unread: boolean;
  tone: "info" | "success" | "warning" | "danger";
}

export const equipment: Equipment[] = [
  {
    id: "eq_001",
    name: "Portable Ultrasound Machine",
    category: "Diagnostic",
    supplierId: "sup_001",
    supplierName: "MedEquip Tanzania",
    pricePerDay: 85000,
    rating: 4.9,
    rentals: 47,
    verified: true,
    description:
      "Compact diagnostic ultrasound with high-resolution imaging. Battery operated, ideal for bedside scans and rural outreach.",
    specs: [
      { label: "Brand", value: "Mindray" },
      { label: "Model", value: "DP-50" },
      { label: "Year", value: "2023" },
      { label: "Condition", value: "Excellent" },
      { label: "Weight", value: "6.2 kg" },
      { label: "Power", value: "Battery / AC 110-240V" },
      { label: "Certification", value: "ISO 13485, CE" },
    ],
    features: [
      "Includes 2 probes (convex + linear)",
      "Free delivery within Dar es Salaam",
      "Operator training provided",
      "24/7 supplier support",
    ],
    tags: ["Portable", "Battery", "ISO certified"],
    availability: "available",
    condition: "Excellent",
    image: "linear-gradient(135deg, #1D4ED8 0%, #0EA5E9 100%)",
    city: "Dar es Salaam",
  },
  {
    id: "eq_002",
    name: "ICU Ventilator (Hamilton-C1)",
    category: "ICU",
    supplierId: "sup_002",
    supplierName: "BioMed Solutions",
    pricePerDay: 120000,
    rating: 4.8,
    rentals: 32,
    verified: true,
    description:
      "Full-featured ICU ventilator for invasive and non-invasive ventilation. Adaptive Support Ventilation (ASV) mode included.",
    specs: [
      { label: "Brand", value: "Hamilton Medical" },
      { label: "Model", value: "C1" },
      { label: "Year", value: "2022" },
      { label: "Condition", value: "Excellent" },
      { label: "Weight", value: "9 kg" },
      { label: "Power", value: "AC + internal battery 4hr" },
      { label: "Certification", value: "FDA, CE" },
    ],
    features: [
      "Includes humidifier and circuit",
      "Adult + pediatric modes",
      "On-site setup by biomed engineer",
      "Maintenance covered",
    ],
    tags: ["ICU-grade", "ASV mode", "Pediatric ready"],
    availability: "in-use",
    availableFrom: "3 Jul",
    condition: "Excellent",
    image: "linear-gradient(135deg, #0F172A 0%, #1D4ED8 100%)",
    city: "Arusha",
  },
  {
    id: "eq_003",
    name: "Patient Monitor (5-parameter)",
    category: "Monitoring",
    supplierId: "sup_003",
    supplierName: "HealthTech TZ",
    pricePerDay: 35000,
    rating: 4.7,
    rentals: 64,
    verified: true,
    description:
      "Multi-parameter vital signs monitor: ECG, SpO2, NIBP, temperature, and respiration.",
    specs: [
      { label: "Brand", value: "Philips" },
      { label: "Model", value: "MX450" },
      { label: "Year", value: "2023" },
      { label: "Condition", value: "Excellent" },
      { label: "Weight", value: "4.5 kg" },
      { label: "Power", value: "AC + battery" },
      { label: "Certification", value: "CE" },
    ],
    features: [
      "All accessories included",
      "Touch screen interface",
      "Wireless central station ready",
      "Free training for ward staff",
    ],
    tags: ["5-parameter", "Touchscreen", "Wireless"],
    availability: "available",
    condition: "Excellent",
    image: "linear-gradient(135deg, #16A34A 0%, #0EA5E9 100%)",
    city: "Dodoma",
  },
  {
    id: "eq_004",
    name: "Infusion Pump (B. Braun)",
    category: "Surgical",
    supplierId: "sup_001",
    supplierName: "MedEquip Tanzania",
    pricePerDay: 25000,
    rating: 4.6,
    rentals: 28,
    verified: false,
    isNew: true,
    description:
      "Volumetric infusion pump for precise IV delivery. Includes drug library and air-in-line detection.",
    specs: [
      { label: "Brand", value: "B. Braun" },
      { label: "Model", value: "Infusomat Space" },
      { label: "Year", value: "2024" },
      { label: "Condition", value: "New" },
      { label: "Weight", value: "2.4 kg" },
      { label: "Power", value: "AC + 8hr battery" },
      { label: "Certification", value: "CE" },
    ],
    features: [
      "Drug library pre-loaded",
      "Air & occlusion alarms",
      "Single-use sets supplied",
      "Free operator training",
    ],
    tags: ["Lightweight", "Drug library", "Battery 8hr"],
    availability: "available",
    condition: "New",
    image: "linear-gradient(135deg, #D97706 0%, #0EA5E9 100%)",
    city: "Dar es Salaam",
  },
  {
    id: "eq_005",
    name: "Digital X-Ray System",
    category: "Imaging",
    supplierId: "sup_004",
    supplierName: "Radiomed Africa",
    pricePerDay: 200000,
    rating: 4.9,
    rentals: 18,
    verified: true,
    description:
      "Mobile digital radiography unit with flat-panel detector. Wireless DR for fast image acquisition.",
    specs: [
      { label: "Brand", value: "Carestream" },
      { label: "Model", value: "DRX-Revolution" },
      { label: "Year", value: "2022" },
      { label: "Condition", value: "Excellent" },
      { label: "Weight", value: "550 kg" },
      { label: "Power", value: "AC 220V dedicated" },
      { label: "Certification", value: "FDA, CE, ISO 13485" },
    ],
    features: [
      "Wireless flat-panel detector",
      "On-site radiographer (first day)",
      "Site preparation included",
      "Lead shielding consultation",
    ],
    tags: ["Mobile DR", "Wireless detector", "ISO certified"],
    availability: "available",
    condition: "Excellent",
    image: "linear-gradient(135deg, #475569 0%, #1D4ED8 100%)",
    city: "Dar es Salaam",
  },
  {
    id: "eq_006",
    name: "Physiotherapy Electrotherapy Unit",
    category: "Rehabilitation",
    supplierId: "sup_005",
    supplierName: "RehabPro TZ",
    pricePerDay: 30000,
    rating: 4.5,
    rentals: 41,
    verified: false,
    description:
      "Multi-modal electrotherapy: TENS, EMS, interferential and ultrasound therapy in one unit.",
    specs: [
      { label: "Brand", value: "Chattanooga" },
      { label: "Model", value: "Intelect Mobile 2" },
      { label: "Year", value: "2023" },
      { label: "Condition", value: "Good" },
      { label: "Weight", value: "3.1 kg" },
      { label: "Power", value: "AC + battery" },
      { label: "Certification", value: "CE" },
    ],
    features: [
      "4 channels",
      "Includes electrode pads",
      "Pre-set protocols",
      "Carry case",
    ],
    tags: ["TENS", "EMS", "Ultrasound therapy"],
    availability: "available",
    condition: "Good",
    image: "linear-gradient(135deg, #0EA5E9 0%, #16A34A 100%)",
    city: "Mwanza",
  },
  {
    id: "eq_007",
    name: "Anaesthesia Machine",
    category: "Surgical",
    supplierId: "sup_002",
    supplierName: "BioMed Solutions",
    pricePerDay: 150000,
    rating: 4.8,
    rentals: 22,
    verified: true,
    description:
      "Full anaesthesia workstation with integrated ventilator, vaporisers and gas monitoring.",
    specs: [
      { label: "Brand", value: "Drager" },
      { label: "Model", value: "Fabius Plus" },
      { label: "Year", value: "2022" },
      { label: "Condition", value: "Excellent" },
      { label: "Weight", value: "120 kg" },
      { label: "Power", value: "AC 220V" },
      { label: "Certification", value: "FDA, CE" },
    ],
    features: [
      "Sevoflurane + Isoflurane vaporisers",
      "Gas scavenging included",
      "Biomed setup",
      "Maintenance covered",
    ],
    tags: ["Workstation", "Dual vaporiser", "Gas monitoring"],
    availability: "in-use",
    availableFrom: "10 Jul",
    condition: "Excellent",
    image: "linear-gradient(135deg, #1D4ED8 0%, #475569 100%)",
    city: "Arusha",
  },
  {
    id: "eq_008",
    name: "Neonatal Incubator",
    category: "ICU",
    supplierId: "sup_003",
    supplierName: "HealthTech TZ",
    pricePerDay: 95000,
    rating: 4.9,
    rentals: 36,
    verified: true,
    description:
      "Servo-controlled neonatal incubator with humidity, oxygen and temperature control.",
    specs: [
      { label: "Brand", value: "GE Healthcare" },
      { label: "Model", value: "Giraffe OmniBed" },
      { label: "Year", value: "2023" },
      { label: "Condition", value: "Excellent" },
      { label: "Weight", value: "85 kg" },
      { label: "Power", value: "AC 220V" },
      { label: "Certification", value: "FDA, CE" },
    ],
    features: [
      "Servo temperature control",
      "Humidity 30-95%",
      "Built-in scale",
      "Phototherapy compatible",
    ],
    tags: ["Servo control", "Humidity", "Built-in scale"],
    availability: "available",
    condition: "Excellent",
    image: "linear-gradient(135deg, #DC2626 0%, #D97706 100%)",
    city: "Dodoma",
  },
];

export const bookings: Booking[] = [
  {
    id: "bk_001",
    ref: "MES-2025-00847",
    equipmentId: "eq_001",
    equipmentName: "Portable Ultrasound Machine",
    supplierName: "MedEquip Tanzania",
    facilityName: "St. Mary's Clinic",
    startDate: "12 Jun 2025",
    endDate: "30 Jun 2025",
    days: 18,
    amount: 1530000,
    status: "active",
  },
  {
    id: "bk_002",
    ref: "MES-2025-00832",
    equipmentId: "eq_003",
    equipmentName: "Patient Monitor (5-parameter)",
    supplierName: "HealthTech TZ",
    facilityName: "St. Mary's Clinic",
    startDate: "20 Jun 2025",
    endDate: "27 Jun 2025",
    days: 7,
    amount: 245000,
    status: "due-soon",
  },
  {
    id: "bk_003",
    ref: "MES-2025-00819",
    equipmentId: "eq_004",
    equipmentName: "Infusion Pump (B. Braun)",
    supplierName: "MedEquip Tanzania",
    facilityName: "St. Mary's Clinic",
    startDate: "1 Jun 2025",
    endDate: "22 Jun 2025",
    days: 21,
    amount: 525000,
    status: "overdue",
  },
  {
    id: "bk_004",
    ref: "MES-2025-00858",
    equipmentId: "eq_006",
    equipmentName: "Physiotherapy Electrotherapy Unit",
    supplierName: "RehabPro TZ",
    facilityName: "St. Mary's Clinic",
    startDate: "28 Jun 2025",
    endDate: "12 Jul 2025",
    days: 14,
    amount: 420000,
    status: "pending",
  },
  {
    id: "bk_005",
    ref: "MES-2025-00712",
    equipmentId: "eq_002",
    equipmentName: "ICU Ventilator (Hamilton-C1)",
    supplierName: "BioMed Solutions",
    facilityName: "Aga Khan Dispensary",
    startDate: "5 May 2025",
    endDate: "5 Jun 2025",
    days: 31,
    amount: 3720000,
    status: "completed",
  },
];

export const contracts: Contract[] = [
  {
    id: "MES-C-0042",
    equipmentName: "Portable Ultrasound Machine",
    supplierName: "MedEquip Tanzania",
    facilityName: "St. Mary's Clinic",
    signedAt: "14 Jun 2025",
    status: "active",
    startDate: "12 Jun 2025",
    endDate: "30 Jun 2025",
    amount: 1530000,
    signedBySupplier: true,
    signedByFacility: true,
  },
  {
    id: "MES-C-0041",
    equipmentName: "Patient Monitor (5-parameter)",
    supplierName: "HealthTech TZ",
    facilityName: "St. Mary's Clinic",
    signedAt: "19 Jun 2025",
    status: "active",
    startDate: "20 Jun 2025",
    endDate: "27 Jun 2025",
    amount: 245000,
    signedBySupplier: true,
    signedByFacility: true,
  },
  {
    id: "MES-C-0046",
    equipmentName: "Physiotherapy Electrotherapy Unit",
    supplierName: "RehabPro TZ",
    facilityName: "St. Mary's Clinic",
    status: "pending",
    startDate: "28 Jun 2025",
    endDate: "12 Jul 2025",
    amount: 420000,
    signedBySupplier: true,
    signedByFacility: false,
  },
  {
    id: "MES-C-0029",
    equipmentName: "ICU Ventilator (Hamilton-C1)",
    supplierName: "BioMed Solutions",
    facilityName: "Aga Khan Dispensary",
    signedAt: "5 May 2025",
    status: "expired",
    startDate: "5 May 2025",
    endDate: "5 Jun 2025",
    amount: 3720000,
    signedBySupplier: true,
    signedByFacility: true,
  },
];

export const notifications: AppNotification[] = [
  {
    id: "n1",
    type: "return",
    title: "Return due in 2 days",
    body: "Portable Ultrasound — please prepare for collection on 30 Jun.",
    time: "2h ago",
    unread: true,
    tone: "warning",
  },
  {
    id: "n2",
    type: "payment",
    title: "Payment confirmed",
    body: "TZS 245,000 received via M-Pesa for booking MES-2025-00832.",
    time: "5h ago",
    unread: true,
    tone: "success",
  },
  {
    id: "n3",
    type: "booking",
    title: "Booking confirmed",
    body: "Your rental request for Physiotherapy unit has been accepted.",
    time: "Yesterday",
    unread: false,
    tone: "info",
  },
  {
    id: "n4",
    type: "return",
    title: "Overdue return",
    body: "Infusion Pump return was due 22 Jun. Please contact supplier.",
    time: "2d ago",
    unread: false,
    tone: "danger",
  },
  {
    id: "n5",
    type: "system",
    title: "Verification complete",
    body: "Your facility documents have been verified.",
    time: "1w ago",
    unread: false,
    tone: "success",
  },
];

// Supplier dashboard charts
export const revenueSeries = [
  { day: "Mon", value: 120 },
  { day: "Tue", value: 180 },
  { day: "Wed", value: 145 },
  { day: "Thu", value: 220 },
  { day: "Fri", value: 285 },
  { day: "Sat", value: 195 },
  { day: "Sun", value: 240 },
];

export const supplierBookings = [
  {
    id: "sb1",
    facility: "St. Mary's Clinic",
    equipment: "Portable Ultrasound Machine",
    period: "12 Jun – 30 Jun",
    amount: 1530000,
    status: "active" as const,
  },
  {
    id: "sb2",
    facility: "Aga Khan Dispensary",
    equipment: "Infusion Pump (B. Braun)",
    period: "25 Jun – 5 Jul",
    amount: 250000,
    status: "pending" as const,
  },
  {
    id: "sb3",
    facility: "Muhimbili Hospital",
    equipment: "Patient Monitor (5-parameter)",
    period: "10 Jun – 24 Jun",
    amount: 490000,
    status: "completed" as const,
  },
];

export const earningsRows = [
  { equipment: "Portable Ultrasound", facility: "St. Mary's Clinic", period: "12-30 Jun", gross: 1530000, fee: 229500, net: 1300500 },
  { equipment: "Infusion Pump", facility: "Aga Khan Disp.", period: "1-22 Jun", gross: 525000, fee: 78750, net: 446250 },
  { equipment: "Patient Monitor", facility: "Muhimbili", period: "10-24 Jun", gross: 490000, fee: 73500, net: 416500 },
];

export const payoutHistory = [
  { date: "20 Jun", amount: 1200000, method: "M-Pesa", phone: "+255 754 ••• 321", status: "sent" as const, ref: "PO-2025-0142" },
  { date: "5 Jun", amount: 850000, method: "Airtel", phone: "+255 688 ••• 410", status: "sent" as const, ref: "PO-2025-0128" },
  { date: "22 May", amount: 640000, method: "M-Pesa", phone: "+255 754 ••• 321", status: "processing" as const, ref: "PO-2025-0115" },
];
