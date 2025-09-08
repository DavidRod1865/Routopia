const AssignmentsPage = () => {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-6xl mb-6">📋</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Manage Assignments</h3>
        <p className="text-gray-600 mb-8">
          Assign routes to drivers, schedule jobs, track completion status, and optimize your team&apos;s daily workflow.
        </p>
        <div className="space-y-4">
          <button className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
            Create New Assignment
          </button>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          Coming soon - Full assignment management features
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;