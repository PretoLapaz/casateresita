import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Eye, Home, BookOpen, Building2, 
  MessageCircle, Filter, RefreshCw, Award, Sparkles, 
  ChevronDown, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ==========================================
// 🎨 THEME & COLORS
// ==========================================

const COLORS = {
  primary: '#2D5A4A',
  secondary: '#A85C32',
  accent: '#C4A96A',
  success: '#10b981',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899'
};

const CHART_COLORS = [
  COLORS.primary, COLORS.secondary, COLORS.accent,
  COLORS.blue, COLORS.purple, COLORS.pink
];

// ==========================================
// 🔧 UTILITY FUNCTIONS
// ==========================================

function formatNumber(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

// ==========================================
// 📊 KPI CARD - RESPONSIVE
// ==========================================

const KPICard = ({ title, value, trend, icon: Icon, color = 'blue', subtitle, loading = false }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-200 rounded-lg"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 md:h-8 w-20 md:w-24 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-24 md:w-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-600 bg-green-100';
    if (trend < 0) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
        </div>
        {trend !== undefined && !isNaN(trend) && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getTrendColor()}`}>
            {trend > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};
// ==========================================
// 👥 USER ANALYTICS - RESPONSIVE
// ==========================================

const UserAnalytics = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-4 md:p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12 text-gray-500">No data available</div>
      </div>
    );
  }

  const devices = data.devices || [];
  const geographic = data.geographic || [];
  const trafficSources = data.trafficSources || [];
  const overview = data.overview || {};

  // Calculate device percentages
  const totalDeviceSessions = devices.reduce((sum, d) => sum + (d.sessions || 0), 0);
  const deviceData = devices.map(d => ({
    ...d,
    percentage: totalDeviceSessions > 0 ? ((d.sessions / totalDeviceSessions) * 100).toFixed(1) : 0
  }));

  // Top countries
  const topCountries = geographic.slice(0, 10);

  // Device icons
  const deviceIcons = {
    mobile: '📱',
    desktop: '💻',
    tablet: '📲'
  };

  return (
    <div className="space-y-6">
      {/* Device Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">📱</span>
          Device Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {deviceData.map((device, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{deviceIcons[device.device.toLowerCase()] || '📱'}</span>
                  <span className="font-semibold text-gray-900 capitalize">{device.device}</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{device.percentage}%</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Sessions: <span className="font-semibold">{formatNumber(device.sessions)}</span></div>
                <div>Users: <span className="font-semibold">{formatNumber(device.users)}</span></div>
                <div>Bounce: <span className={`font-semibold ${device.bounceRate > 70 ? 'text-red-600' : 'text-green-600'}`}>{device.bounceRate}%</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Visual device distribution */}
        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden flex">
          {deviceData.map((device, index) => (
            <div
              key={index}
              className="h-8 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
              style={{
                width: `${device.percentage}%`,
                backgroundColor: index === 0 ? COLORS.blue : index === 1 ? COLORS.purple : COLORS.pink
              }}
            >
              {device.percentage > 10 && `${device.percentage}%`}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Data */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            Top Countries
          </h3>

          <div className="space-y-3">
            {topCountries.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {location.country}
                    </div>
                    {location.city !== '(not set)' && (
                      <div className="text-xs text-gray-500 truncate">{location.city}</div>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-sm font-bold text-blue-600">{formatNumber(location.users)}</div>
                  <div className="text-xs text-gray-500">{formatNumber(location.sessions)} sessions</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Traffic Sources
          </h3>

          <div className="space-y-3">
            {trafficSources.slice(0, 8).map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {source.source}
                  </div>
                  <div className="text-xs text-gray-500">
                    {source.medium}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-sm font-bold text-purple-600">{formatNumber(source.sessions)}</div>
                  <div className="text-xs text-gray-500">{formatNumber(source.users)} users</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Avg Session</div>
          <div className="text-2xl font-bold">{Math.round(overview.avgSessionDuration || 0)}s</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Bounce Rate</div>
          <div className="text-2xl font-bold">{Math.round(overview.bounceRate || 0)}%</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Engagement</div>
          <div className="text-2xl font-bold">{Math.round(overview.engagementRate || 0)}%</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">New Users</div>
          <div className="text-2xl font-bold">{formatNumber(overview.newUsers || 0)}</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 📈 MAIN DASHBOARD - RESPONSIVE
// ==========================================

const CompleteDashboard = () => {
  const [data, setData] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [dateRange, setDateRange] = useState('last7Days');
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
    if (activeTab === 'content') {
      fetchContentData();
    }
  }, [dateRange, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/fetchGA4AnalyticsEnhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange, useCache: false })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📊 Analytics data received:', result);
        setData(result);
      } else {
        console.error('Failed to fetch analytics:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentData = async () => {
    setContentLoading(true);
    try {
      const response = await fetch('/.netlify/functions/fetchContentPerformance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange, useCache: false })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📰 Content data received:', result);
        setContentData(result);
      } else {
        console.error('Failed to fetch content data:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching content data:', error);
    } finally {
      setContentLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
    if (activeTab === 'content') fetchContentData();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24 pb-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header - RESPONSIVE */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">La Casa de Teresita</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-medium w-full sm:w-auto"
            >
              <option value="last7Days">Last 7 Days</option>
              <option value="last30Days">Last 30 Days</option>
              <option value="last90Days">Last 90 Days</option>
            </select>
            
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs md:text-sm font-medium w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* KPIs - RESPONSIVE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <KPICard
            title="Total Visits"
            value={formatNumber(data?.overview?.totalVisits)}
            trend={data?.overview?.trends?.totalVisits}
            icon={Users}
            color="blue"
            loading={loading}
          />
          <KPICard
            title="Room Views"
            value={formatNumber(data?.conversions?.roomViews)}
            icon={Home}
            color="purple"
            loading={loading}
          />
          <KPICard
            title="WhatsApp Clicks"
            value={formatNumber(data?.conversions?.whatsappClicks)}
            icon={MessageCircle}
            color="green"
            subtitle="From all sources"
            loading={loading}
          />
          <KPICard
            title="Conversion Rate"
            value={`${data?.overview?.conversionRate || 0}%`}
            icon={TrendingUp}
            color="orange"
            subtitle="To WhatsApp"
            loading={loading}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {['users', 'rooms', 'content'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-3 font-semibold capitalize transition-colors border-b-2 text-xs md:text-sm whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'users' && (
          <UserAnalytics data={data} loading={loading} />
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <RoomPerformance data={data} loading={loading} />
          </div>
        )}

        {activeTab === 'content' && (
          <ContentPerformance data={contentData} loading={contentLoading} />
        )}
      </div>
    </div>
  );
};

export default CompleteDashboard;
