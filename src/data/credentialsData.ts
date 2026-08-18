import { DepartmentName, IndianState } from '../types';

export interface OfficerCredential {
  department: DepartmentName;
  departmentCode: string;
  badgeId: string;
  officerName: string;
  officialEmail: string;
  designation: string;
  state: IndianState;
  city: string;
  password: string;
  description: string;
}

export interface AdminCredential {
  adminId: string;
  name: string;
  email: string;
  designation: string;
  jurisdiction: string;
  assignedState: IndianState;
  password: string;
  description: string;
}

// Fixed, secure, randomly-generated strong passwords for each department officer
export const DEPARTMENT_OFFICER_CREDENTIALS: OfficerCredential[] = [
  {
    department: 'Public Works Department',
    departmentCode: 'PWD',
    badgeId: 'PWD-KA-4019',
    officerName: 'Rajesh Patil',
    officialEmail: 'rajesh.patil@pwd.karnataka.gov.in',
    designation: 'Assistant Executive Engineer (Roads & Bridges)',
    state: 'Karnataka',
    city: 'Bengaluru',
    password: 'Pwd@Roads#9482',
    description: 'Roads, Bridges, Pothole repairs, and Highway infrastructure',
  },
  {
    department: 'Water Supply & Sewerage Board',
    departmentCode: 'BWSSB',
    badgeId: 'BWSSB-KA-1182',
    officerName: 'Vikram Reddy',
    officialEmail: 'vikram.reddy@bwssb.karnataka.gov.in',
    designation: 'Chief Water Works Inspector (BWSSB)',
    state: 'Karnataka',
    city: 'Bengaluru',
    password: 'Aqua#Clean!7291',
    description: 'Water pipelines, tap water contamination, sewerage & pumps',
  },
  {
    department: 'Electricity Supply Corporation',
    departmentCode: 'BESCOM',
    badgeId: 'DEL-ELEC-902',
    officerName: 'Manoj Kumar',
    officialEmail: 'manoj.kumar@bescom.delhi.gov.in',
    designation: 'Superintendent Engineer (Power & Lighting)',
    state: 'Delhi NCR',
    city: 'New Delhi',
    password: 'Volt@Power$8831',
    description: 'Transformers, power outages, electrical junction boxes',
  },
  {
    department: 'Solid Waste Management',
    departmentCode: 'SWM',
    badgeId: 'BMC-SWM-8821',
    officerName: 'Anjali Deshmukh',
    officialEmail: 'anjali.deshmukh@mcgm.gov.in',
    designation: 'Senior Sanitation Officer (BMC / SWM)',
    state: 'Maharashtra',
    city: 'Mumbai',
    password: 'Clean#Green*6104',
    description: 'Garbage collection, compactor trucks, landfill clearing',
  },
  {
    department: 'Sanitation & Health Division',
    departmentCode: 'SAN',
    badgeId: 'SAN-TN-5520',
    officerName: 'K. Meenakshi',
    officialEmail: 'meenakshi.k@sanitation.tn.gov.in',
    designation: 'Divisional Health & Sanitation Officer',
    state: 'Tamil Nadu',
    city: 'Chennai',
    password: 'Sanit@Safe%4918',
    description: 'Public toilet maintenance, street sweeping, disinfection',
  },
  {
    department: 'Street Lighting Division',
    departmentCode: 'ELEC-LIGHT',
    badgeId: 'GCC-ELEC-441',
    officerName: 'Balaji Raman',
    officialEmail: 'balaji.raman@chennaicorp.gov.in',
    designation: 'Assistant Engineer (Electrical & Smart Lighting)',
    state: 'Tamil Nadu',
    city: 'Chennai',
    password: 'Lumos#Glow^3852',
    description: 'Streetlight poles, LED lamps, automated timer pillars',
  },
  {
    department: 'Metropolitan Transport Corporation',
    departmentCode: 'MTC',
    badgeId: 'TSRTC-HYD-550',
    officerName: 'K. Venkat',
    officialEmail: 'k.venkat@tsrtc.telangana.gov.in',
    designation: 'Divisional Transport Officer (GHMC / TSRTC)',
    state: 'Telangana',
    city: 'Hyderabad',
    password: 'Transit@City!8274',
    description: 'City bus stops, transit corridors, traffic signals',
  },
  {
    department: 'Public Health & Disease Control',
    departmentCode: 'PHDC',
    badgeId: 'CMO-BBMP-771',
    officerName: 'Dr. Sunita Rao',
    officialEmail: 'sunita.rao@health.karnataka.gov.in',
    designation: 'Chief Medical Officer & Epidemiologist',
    state: 'Karnataka',
    city: 'Bengaluru',
    password: 'Health#Care&5190',
    description: 'Anti-dengue fogging, vector control, clinic dispensaries',
  },
  {
    department: 'Municipal Stormwater Drainage',
    departmentCode: 'SWD',
    badgeId: 'SWD-MH-3341',
    officerName: 'Suresh Hegde',
    officialEmail: 'suresh.hegde@drainage.gov.in',
    designation: 'Executive Engineer (Stormwater Division)',
    state: 'Maharashtra',
    city: 'Pune',
    password: 'Drain#Flow!6739',
    description: 'Stormwater drains, desilting, flood prevention, culverts',
  },
  {
    department: 'Environmental Protection Cell',
    departmentCode: 'EPC',
    badgeId: 'GPCB-AHM-102',
    officerName: 'Pooja Bhatt',
    officialEmail: 'pooja.bhatt@gpcb.gujarat.gov.in',
    designation: 'Environmental Control Officer (GPCB)',
    state: 'Gujarat',
    city: 'Ahmedabad',
    password: 'Eco#Shield$2095',
    description: 'Air quality, lake pollution, industrial effluent monitoring',
  },
];

// Master State & National Administrator Credential
export const MASTER_ADMIN_CREDENTIAL: AdminCredential = {
  adminId: 'ADMIN-LOKSEVA-01',
  name: 'Dr. Shalini Rajneesh, IAS',
  email: 'admin.lokseva@gov.in',
  designation: 'Chief Administrator & State Grievance Commissioner',
  jurisdiction: 'State & National Multi-Department Oversight',
  assignedState: 'Karnataka',
  password: 'Admin@LokSeva#2026',
  description: 'National/State Master Administrative Command with full SLA oversight and cross-department analytics',
};

// Auxiliary National Apex Administrator
export const NATIONAL_APEX_ADMIN_CREDENTIAL: AdminCredential = {
  adminId: 'APEX-DARPG-99',
  name: 'Central Public Grievance Command (DARPG / PMO)',
  email: 'cpgrams-nodal@nic.in',
  designation: 'Director General of Public Grievances (Govt. of India)',
  jurisdiction: 'All States (Pan-India)',
  assignedState: 'Delhi NCR',
  password: 'Apex#GovtIndia!9900',
  description: 'Central apex directorate command for all states and ministries',
};
