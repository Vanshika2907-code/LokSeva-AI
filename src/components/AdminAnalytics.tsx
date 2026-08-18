import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  AreaChart, 
  Area,
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Star, 
  Download,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Complaint, LanguageCode } from '../types';
import { t, locNum, locCategory, locDepartment, locStatus } from '../utils/localization';

interface AdminAnalyticsProps {
  complaints: Complaint[];
  currentLanguage?: LanguageCode;
}

const COLORS = ['#0284c7', '#0f766e', '#d97706', '#be185d', '#6366f1', '#2563eb', '#dc2626', '#059669'];

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ complaints, currentLanguage = 'en' }) => {
  // 1. Data by Category
  const categoryMap: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, count]) => {
    const locName = locCategory(name, currentLanguage);
    return {
      name: locName.length > 15 ? locName.substring(0, 13) + '..' : locName,
      fullName: locName,
      count,
    };
  });

  // 2. Department Resolution Time & Performance
  const departmentPerformance = [
    { department: locDepartment('Public Works Department', currentLanguage), avgHours: 24.5, resolved: 88, slaCompliance: 96 },
    { department: locDepartment('Water Supply & Sewerage Board', currentLanguage), avgHours: 32.0, resolved: 82, slaCompliance: 91 },
    { department: locDepartment('Solid Waste Management', currentLanguage), avgHours: 14.2, resolved: 94, slaCompliance: 98 },
    { department: locDepartment('Street Lighting Division', currentLanguage), avgHours: 38.5, resolved: 79, slaCompliance: 89 },
    { department: locDepartment('Municipal Stormwater Drainage', currentLanguage), avgHours: 29.0, resolved: 85, slaCompliance: 93 },
    { department: locDepartment('Public Health & Disease Control', currentLanguage), avgHours: 18.0, resolved: 92, slaCompliance: 97 },
  ];

  // 3. Inflow vs Resolution Trend (Weekly)
  const trendData = [
    { day: 'Mon', inflow: 14, resolved: 12 },
    { day: 'Tue', inflow: 19, resolved: 17 },
    { day: 'Wed', inflow: 24, resolved: 21 },
    { day: 'Thu', inflow: 28, resolved: 25 },
    { day: 'Fri', inflow: 22, resolved: 24 },
    { day: 'Sat', inflow: 15, resolved: 18 },
    { day: 'Sun', inflow: 11, resolved: 14 },
  ];

  // 4. Citizen Satisfaction (CSAT) Breakdown
  const csatData = [
    { rating: `${locNum(5, currentLanguage)} Stars`, percentage: 72, count: 144 },
    { rating: `${locNum(4, currentLanguage)} Stars`, percentage: 18, count: 36 },
    { rating: `${locNum(3, currentLanguage)} Stars`, percentage: 6, count: 12 },
    { rating: `${locNum(2, currentLanguage)} Stars`, percentage: 3, count: 6 },
    { rating: `${locNum(1, currentLanguage)} Star`, percentage: 1, count: 2 },
  ];

  const totalGrievances = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const slaBreaches = complaints.filter((c) => c.isSlaBreached).length;
  const avgSatisfaction = 4.7;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Executive KPIs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                {t('adminAnalytics', currentLanguage)}
              </span>
              <span className="text-xs text-slate-500 font-medium">City-Wide Redressal Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2545] tracking-tight font-serif">
              {t('adminAnalytics', currentLanguage)} & SLA Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Real-time audit of departmental turnaround times, SLA compliance benchmarks, heat-clusters, and citizen satisfaction ratings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Official Report</span>
            </button>
          </div>
        </div>

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-slate-100">
          
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="text-xs text-slate-500 font-bold mb-1">{t('statsResolved', currentLanguage)} Rate</div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
              {locNum(Math.round((resolvedCount / (totalGrievances || 1)) * 100), currentLanguage)}%
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">Target &gt; {locNum(85, currentLanguage)}% SLA</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="text-xs text-blue-700 font-bold mb-1">Avg Turnaround Time</div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#0b2545]">{locNum(26.4, currentLanguage)}h</div>
            <div className="text-[10px] text-slate-500 font-medium">Target SLA: {locNum(48, currentLanguage)}h (High)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="text-xs text-amber-800 font-bold mb-1">Citizen Satisfaction</div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-600 flex items-center gap-1">
              <span>{locNum(avgSatisfaction, currentLanguage)}</span>
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Based on {locNum(200, currentLanguage)}+ verified ratings</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="text-xs text-indigo-800 font-bold mb-1">SLA Compliance Rate</div>
            <div className="text-xl sm:text-2xl font-extrabold text-blue-900">{locNum(94.8, currentLanguage)}%</div>
            <div className="text-[10px] text-slate-500 font-medium">{locNum(slaBreaches, currentLanguage)} active breach flags</div>
          </div>

        </div>
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Grievance Volume & Resolution Inflow Trend */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Weekly Grievance Inflow vs Resolved Tickets</span>
            </h2>
            <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Last 7 Days</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="inflow" name="New Reports" stroke="#0284c7" fillOpacity={1} fill="url(#inflowGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#059669" fillOpacity={1} fill="url(#resolvedGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Complaints by Controlled Category */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>{t('category', currentLanguage)} Volume Breakdown</span>
            </h2>
            <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Live Register</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="count" name="Complaints" fill="#0284c7" radius={[4, 4, 0, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Department Average Resolution Turnaround */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{t('department', currentLanguage)} Resolution Speed ({t('hours', currentLanguage)})</span>
            </h2>
            <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">SLA Target &lt; {locNum(48, currentLanguage)}h</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="department" type="category" stroke="#64748b" fontSize={10} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="avgHours" name="Avg Hours to Fix" fill="#d97706" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Citizen Satisfaction (CSAT) Distribution */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{t('rateResolution', currentLanguage)} (CSAT)</span>
            </h2>
            <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">{locStatus('Resolved', currentLanguage)}</span>
          </div>

          <div className="space-y-3 pt-4">
            {csatData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="font-semibold">{item.rating}</span>
                  <span className="font-mono text-slate-500">{locNum(item.percentage, currentLanguage)}% ({locNum(item.count, currentLanguage)} ratings)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      idx === 0
                        ? 'bg-emerald-600'
                        : idx === 1
                        ? 'bg-blue-600'
                        : idx === 2
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
