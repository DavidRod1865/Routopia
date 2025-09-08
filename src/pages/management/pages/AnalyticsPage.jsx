const AnalyticsPage = () => {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-6xl mb-6">📊</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Analytics</h3>
        <p className="text-gray-600 mb-8">
          Track your business performance with detailed analytics on routes, driver efficiency, client satisfaction, and revenue insights.
        </p>
        <div className="space-y-4">
          <button className="w-full px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors">
            Performance Dashboard Coming Soon
          </button>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          Coming soon - Full analytics and reporting features
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;