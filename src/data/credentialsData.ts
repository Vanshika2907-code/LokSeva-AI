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
    badgeId: 'BESCOM-KA-3001',
    officerName: 'Nagaraj Suvarna',
    officialEmail: 'nagaraj.suvarna@bescom.karnataka.gov.in',
    designation: 'Superintendent Engineer (BESCOM - Power & Distribution)',
    state: 'Karnataka',
    city: 'Bengaluru',
    password: 'Volt@Power#3001',
    description: 'Transformers, power outages, electrical junction boxes - Karnataka',
  },
  {
    department: 'Electricity Supply Corporation',
    departmentCode: 'BESCOM-DL',
    badgeId: 'DEL-ELEC-902',
    officerName: 'Manoj Kumar',
    officialEmail: 'manoj.kumar@bescom.delhi.gov.in',
    designation: 'Superintendent Engineer (Power & Lighting)',
    state: 'Delhi NCR',
    city: 'New Delhi',
    password: 'Volt@Power$8831',
    description: 'Transformers, power outages, electrical junction boxes - Delhi',
  },
  {
    department: 'Solid Waste Management',
    departmentCode: 'BBMP-SWM',
    badgeId: 'BBMP-SWM-3002',
    officerName: 'Lakshmi Devi',
    officialEmail: 'lakshmi.devi@bbmp.swm.karnataka.gov.in',
    designation: 'Senior Sanitation Officer (BBMP SWM)',
    state: 'Karnataka',
    city: 'Bengaluru',
    password: 'Clean#Green#3002',
    description: 'Garbage collection, compactor trucks, landfill clearing - Karnataka',
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
    description: 'Garbage collection, compactor trucks, landfill clearing - Maharashtra',
  },
  {
    department: 'Sanitation & Health Division',
    departmentCode: 'SAN-KA',
    badgeId: 'SAN-KA-3003',
    officerName: 'Dr. Prakash Moger',
    officialEmail: 'prakash.moger@sanitation.karnataka.gov.in',
    designation: 'Divisional Health & Sanitation Officer (BBMP)',
    state: 'Karnataka',
    city: 'Bengaluru',
    password: 'Sanit@Safe#3003',
    description: 'Public toilet maintenance, street sweeping, disinfection - Karnataka',
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
    description: 'Public toilet maintenance, street sweeping, disinfection - Tamil Nadu',
  },
  {
    department: 'Street Lighting Division',
    departmentCode: 'ELEC-LT-KA',
    badgeId: 'BESCOM-LT-3004',
    officerName: 'Vinod Babu',
    officialEmail: 'vinod.babu@bescom.karnataka.gov.in',
    designation: 'Assistant Engineer (Electrical & Smart Lighting - BESCOM)',
    state: 'Karnataka',
    city: 'Bengaluru',
    password: 'Lumos#Glow#3004',
    description: 'Streetlight poles, LED lamps, automated timer pillars - Karnataka',
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
    description: 'Streetlight poles, LED lamps, automated timer pillars - Tamil Nadu',
  },
  {
    department: 'Metropolitan Transport Corporation',
    departmentCode: 'BMTC-KA',
    badgeId: 'BMTC-KA-3005',
    officerName: 'Shivanna Goudar',
    officialEmail: 'shivanna.goudar@bmTC.karnataka.gov.in',
    designation: 'Divisional Transport Officer (BMTC - Bengaluru)',
    state: 'Karnataka',
    city: 'Bengaluru',
    password: 'Transit@City#3005',
    description: 'City bus stops, transit corridors, traffic signals - Karnataka',
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
    description: 'City bus stops, transit corridors, traffic signals - Telangana',
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
    departmentCode: 'BBMP-SWD',
    badgeId: 'BBMP-SWD-3006',
    officerName: 'Mohan Kumar Jogi',
    officialEmail: 'mohan.jogi@bbmp.gov.in',
    designation: 'Executive Engineer (Stormwater Division - BBMP)',
    state: 'Karnataka',
    city: 'Bengaluru',
    password: 'Drain#Flow#3006',
    description: 'Stormwater drains, desilting, flood prevention, culverts - Karnataka',
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
    description: 'Stormwater drains, desilting, flood prevention, culverts - Maharashtra',
  },
  {
    department: 'Environmental Protection Cell',
    departmentCode: 'KSPCB',
    badgeId: 'KSPCB-KA-3007',
    officerName: 'Dr. Savita Kulkarni',
    officialEmail: 'savita.kulkarni@kspcb.karnataka.gov.in',
    designation: 'Environmental Control Officer (KSPCB)',
    state: 'Karnataka',
    city: 'Bengaluru',
    password: 'Eco#Shield#3007',
    description: 'Air quality, lake pollution, industrial effluent monitoring - Karnataka',
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
    description: 'Air quality, lake pollution, industrial effluent monitoring - Gujarat',
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
