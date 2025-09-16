import { useState } from "react";
import PropTypes from "prop-types";

const RouteDetailPanel = ({ 
  route, 
  routeDetails, 
  onClose, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onStartRoute
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  if (!route) return null;

  const stopCount = route.route_data?.addresses?.length || 0;
  const details = routeDetails || {};

  return (
    <div className={`bg-white border-t border-gray-200 transition-all duration-300 ${
      isExpanded ? 'h-96' : 'h-16'
    }`}>
      
      {/* Drag Handle */}
      <div className="flex justify-center py-2 bg-gray-50 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          {isExpanded && (
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {route.name}
            </h2>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col h-full">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('stops')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'stops' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Stops ({stopCount})
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="p-4 space-y-6">
                {/* Route Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Stops</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{stopCount}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Duration</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">
                      {details.duration || 'Calculating...'}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 col-span-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Distance</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-1">
                      {details.distance || 'Calculating...'}
                    </p>
                  </div>
                </div>

                {/* Route Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Route Status</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                      Not Started
                    </span>
                  </div>
                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <button
                    onClick={onStartRoute}
                    className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 8h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Start Navigation</span>
                  </button>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={onEdit}
                      className="bg-gray-100 text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={onDuplicate}
                      className="bg-gray-100 text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Copy
                    </button>
                    <button
                      onClick={onDelete}
                      className="bg-red-100 text-red-700 font-medium py-2 px-3 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stops' && (
              <div className="p-4">
                <div className="space-y-3">
                  {route.route_data?.addresses?.map((address, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                              {index + 1}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              Stop {index + 1}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{address}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              ETA: --:--
                            </span>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                              Pending
                            </span>
                          </div>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <p className="text-sm">No stops added yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

RouteDetailPanel.propTypes = {
  route: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    route_data: PropTypes.shape({
      addresses: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  routeDetails: PropTypes.shape({
    duration: PropTypes.string,
    distance: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func,
  onStartRoute: PropTypes.func,
};

export default RouteDetailPanel;