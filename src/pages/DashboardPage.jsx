import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Eye, Home, BookOpen, Building2, 
  MessageCircle, Filter, RefreshCw, Award, Sparkles, 
  ChevronDown, ArrowUp, ArrowDown, AlertCircle
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
// 🚨 ERROR STATE
// ==========================================

const ErrorState = ({ message, onRetry }) => (
  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
    <h3 className="text-xl font-bold text-red-900 mb-2">Unable to Load Data</h3>
    <p className="text-red-700 mb-6">{message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
    >
      Retry
    </button>
  </div>
);

// ==========================================
// 🔀 USER FLOW DIAGRAM - RESPONSIVE
// ==========================================

const UserFlowDiagram = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="h-64 md:h-96 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="text-center py-12 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const totalVisits = data.totalVisits || 0;
  const roomViews = data.conversions?.roomViews || 0;
  const dateSelections = data.conversions?.dateSelections || 0;
  const priceChecks = data.conversions?.priceChecks || 0;
  const whatsappClicks = data.conversions?.whatsappClicks || 0;

  const funnelData = [
    { name: 'Visits', value: totalVisits, fill: COLORS.blue },
    { name: 'Room Views', value: roomViews, fill: COLORS.purple },
    { name: 'Date Selection', value: dateSelections, fill: COLORS.pink },
    { name: 'Price Check', value: priceChecks, fill: '#f59e0b' },
    { name: 'WhatsApp', value: whatsappClicks, fill: COLORS.success }
  ];

  const maxValue = totalVisits || 1;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
          <Eye className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
          <span className="text-base md:text-xl">User Journey Flow</span>
        </h3>
        <div className="text-xs md:text-sm text-gray-600">
          Conversion: {totalVisits > 0 ? ((whatsappClicks / totalVisits) * 100).toFixed(1) : '0'}%
        </div>
      </div>

      <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
        {funnelData.map((step, index) => {
          const percentage = maxValue > 0 ? (step.value / maxValue) * 100 : 0;
          const nextStep = funnelData[index + 1];
          const dropoff = nextStep && step.value > 0 ? ((step.value - nextStep.value) / step.value) * 100 : 0;

          return (
            <div key={index}>
              <div className="flex items-center gap-2 md:gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <span className="text-xs md:text-sm font-semibold text-gray-900">{step.name}</span>
                    <span className="text-xs md:text-sm font-bold" style={{ color: step.fill }}>
                      {formatNumber(step.value)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6 md:h-8 overflow-hidden">
                    <div
                      className="h-6 md:h-8 rounded-full transition-all duration-500 flex items-center justify-center text-white font-bold text-xs md:text-sm"
                      style={{ width: `${percentage}%`, backgroundColor: step.fill }}
                    >
                      {percentage > 15 && `${percentage.toFixed(0)}%`}
                    </div>
                  </div>
                </div>
              </div>
              
              {nextStep && dropoff > 0 && (
                <div className="flex items-center justify-center py-2">
                  <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                    <ArrowDown className="h-3 w-3" />
                    {dropoff.toFixed(1)}% drop-off
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <div className="text-center p-2 md:p-3 bg-blue-50 rounded-lg">
          <div className="text-lg md:text-2xl font-bold text-blue-600">{formatNumber(totalVisits)}</div>
          <div className="text-xs text-gray-600">Total Visits</div>
        </div>
        <div className="text-center p-2 md:p-3 bg-purple-50 rounded-lg">
          <div className="text-lg md:text-2xl font-bold text-purple-600">{formatNumber(roomViews)}</div>
          <div className="text-xs text-gray-600">Room Views</div>
        </div>
        <div className="text-center p-2 md:p-3 bg-orange-50 rounded-lg">
          <div className="text-lg md:text-2xl font-bold text-orange-600">{formatNumber(dateSelections)}</div>
          <div className="text-xs text-gray-600">Date Selections</div>
        </div>
        <div className="text-center p-2 md:p-3 bg-green-50 rounded-lg">
          <div className="text-lg md:text-2xl font-bold text-green-600">{formatNumber(whatsappClicks)}</div>
          <div className="text-xs text-gray-600">WhatsApp Clicks</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🏨 ROOM PERFORMANCE - RESPONSIVE
// ==========================================

const RoomPerformance = ({ data, loading }) => {
  const [sortBy, setSortBy] = useState('views');
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const rooms = data?.rooms || [];
  
  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="text-center py-12 text-gray-500">
          No room data available
        </div>
      </div>
    );
  }

  const enrichedRooms = rooms.map(room => {
    const views = room.views || 0;
    const avgDuration = room.avgDuration || 0;
    const bounceRate = room.bounceRate || 0;
    const avgTimeMinutes = Math.round(avgDuration / 60);
    
    return {
      ...room,
      avgTimeMinutes: isNaN(avgTimeMinutes) ? 0 : avgTimeMinutes,
      views,
      bounceRate
    };
  });

  const sortedRooms = [...enrichedRooms].sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views;
    return 0;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
          <Home className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
          Room Performance
        </h3>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm w-full sm:w-auto"
        >
          <option value="views">Sort by Views</option>
        </select>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 md:px-4 text-xs font-semibold text-gray-600 uppercase">Room</th>
                <th className="text-center py-3 px-2 md:px-4 text-xs font-semibold text-gray-600 uppercase">Views</th>
                <th className="text-center py-3 px-2 md:px-4 text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">Time</th>
                <th className="text-center py-3 px-2 md:px-4 text-xs font-semibold text-gray-600 uppercase">Bounce</th>
              </tr>
            </thead>
            <tbody>
              {sortedRooms.map((room, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2 md:px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-8 rounded ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'}`}></div>
                      <span className="text-xs md:text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">{room.roomSlug || room.path}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 md:px-4 text-center">
                    <span className="text-xs md:text-sm font-bold text-blue-600">{formatNumber(room.views)}</span>
                  </td>
                  <td className="py-3 px-2 md:px-4 text-center hidden sm:table-cell">
                    <span className="text-xs md:text-sm text-gray-700">{room.avgTimeMinutes}m</span>
                  </td>
                  <td className="py-3 px-2 md:px-4 text-center">
                    <span className={`text-xs md:text-sm font-medium ${
                      room.bounceRate > 70 ? 'text-red-600' : 
                      room.bounceRate > 50 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {room.bounceRate.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t">
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-gray-900">
            {formatNumber(enrichedRooms.reduce((sum, r) => sum + r.views, 0))}
          </div>
          <div className="text-xs text-gray-600">Total Views</div>
        </div>
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-purple-600">
            {enrichedRooms.length}
          </div>
          <div className="text-xs text-gray-600">Rooms Tracked</div>
        </div>
        <div className="text-center col-span-2 md:col-span-1">
          <div className="text-xl md:text-2xl font-bold text-green-600">
            {enrichedRooms.length > 0 ? (enrichedRooms.reduce((sum, r) => sum + (r.bounceRate || 0), 0) / enrichedRooms.length).toFixed(1) : '0'}%
          </div>
          <div className="text-xs text-gray-600">Avg Bounce</div>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('last7Days');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching GA4 data...');
      
      const response = await fetch('/.netlify/functions/fetchGA4AnalyticsEnhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange, useCache: false })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      console.log('✅ GA4 data received:', result);
      
      // Vérifier que les données sont valides
      if (!result || !result.overview) {
        throw new Error('Invalid data structure received from API');
      }
      
      setData(result);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-24 pb-8 px-3 sm:px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <ErrorState message={error} onRetry={handleRefresh} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24 pb-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header - RESPONSIVE */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
              La Casa de Teresita
              {data?.metadata && (
                <span className="ml-2 text-xs text-gray-500">
                  • {data.metadata.startDate} to {data.metadata.endDate}
                </span>
              )}
            </p>
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
              disabled={loading}
              className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs md:text-sm font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
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
          {['overview', 'rooms'].map((tab) => (
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <UserFlowDiagram data={data?.overview} loading={loading} />
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <RoomPerformance data={data} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompleteDashboard;
