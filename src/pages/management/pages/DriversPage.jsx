const DriversPage = () => {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-6xl mb-6">👥</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Manage Your Drivers</h3>
        <p className="text-gray-600 mb-8">
          Organize your team, track their schedules, monitor performance, and manage driver assignments efficiently.
        </p>
        <div className="space-y-4">
          <button className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
            Add Your First Driver
          </button>
          <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Invite Team Members
          </button>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          Coming soon - Full driver management features
        </div>
      </div>
    </div>
  );
};

export default DriversPage;