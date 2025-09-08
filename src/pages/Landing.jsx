import AuthButtons from "../auth_components/AuthButtons";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-black">
              routopia<span className="text-green-600">+</span>
            </h1>
            <div className="hidden md:flex space-x-6">
              <a
                href="/product"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Product
              </a>
              <a
                href="#solutions"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Solutions
              </a>
              <a
                href="#customers"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Customers
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Plans
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <AuthButtons />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="px-6 pt-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-8 leading-tight">
              Route management made
              <br />
              <span className="underline decoration-green-600">
                simpler
              </span>{" "}
              and <em className="italic">smarter</em>
            </h1>
          </div>

          {/* Phone Mockup Section */}
          <div className="relative flex justify-center items-center min-h-600px]">
            {/* Floating Elements */}

            {/* Driver Profile Card - Top Left */}
            <div className="absolute top-0 left-4 md:left-20 lg:left-40 bg-white rounded-lg shadow-lg p-4 z-10 transform -rotate-6 hidden md:block">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  JT
                </div>
                <div>
                  <p className="font-semibold text-sm">John Thomas</p>
                  <p className="text-xs text-gray-500">Lead Landscaper</p>
                </div>
              </div>
            </div>

            {/* Arrival Notification - Top Right */}
            <div className="absolute top-8 right-4 md:right-20 lg:right-40 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium z-10 transform rotate-3 hidden md:block">
              🚗 On Schedule for Today
            </div>

            {/* Route Card - Left Side */}
            <div className="absolute left-0 md:left-16 lg:left-32 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 z-10 -rotate-12 hidden lg:block">
              <div className="text-xs text-gray-500 mb-1">Route Status</div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Smith Street → Sunrise Ave</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="text-xs text-gray-600 mb-1">
                8 stops completed
              </div>
                </div>  
              <button className="w-full mt-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                Confirm Arrival
              </button>
            </div>

            {/* Client Profile - Right Side */}
            <div className="absolute right-0 md:right-16 lg:right-32 top-1/3 bg-white rounded-lg shadow-lg p-4 z-10 transform rotate-6 hidden lg:block">
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  MA
                </div>
                <div>
                  <p className="font-semibold text-sm">Green Valley Homes</p>
                  <p className="text-sm text-gray-500">Matt Anderson</p>
                  <p className="text-xs text-gray-500">Operations Manager</p>
                </div>
              </div>
            </div>

            {/* Main Phone Mockup */}
            <div className="relative z-20 max-w-sm mx-auto">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=600&fit=crop&crop=faces,center"
                  alt="phone background"
                  className="w-80 h-96 object-cover rounded-3xl"
                />

                {/* Phone Screen Overlay */}
                <div className="absolute top-8 left-8 right-8 bottom-16 bg-white rounded-2xl shadow-inner overflow-hidden">
                  {/* Phone Status Bar */}
                  <div className="flex justify-between items-center px-4 py-2 bg-green-600 text-white text-xs">
                    <span>9:41 AM</span>
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 bg-white rounded-sm opacity-70"></div>
                      <div className="w-1 h-2 bg-white rounded-sm"></div>
                    </div>
                  </div>

                  {/* Example App Content */}
                  <div className="p-4 space-y-6 overflow-y-auto" style={{ maxHeight: '240px' }}>
                    <div>
                      <h3 className="text-lg font-semibold text-black">
                        Hello, Matt
                      </h3>
                      <p className="text-sm text-gray-600">What&apos;s on schedule for today?</p>
                    </div>

                    {/* Navigation Icons */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-green-600 text-lg">🏠</span>
                        </div>
                        <p className="text-xs text-gray-600">Routes</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-purple-600 text-lg">📱</span>
                        </div>
                        <p className="text-xs text-gray-600">Clients</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-orange-600 text-lg">🚗</span>
                        </div>
                        <p className="text-xs text-gray-600">Drivers</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <span className="text-blue-600 text-lg">📍</span>
                        </div>
                        <p className="text-xs text-gray-600">Progress</p>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h4 className="font-semibold text-sm mb-3">
                        Today&apos;s Schedule
                      </h4>
                      <div className="space-y-2">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">
                                Maplewood Ave
                              </p>
                              <p className="text-xs text-gray-600">
                                Lawn maintenance • 9:00 AM
                              </p>
                            </div>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">
                                Oak Street Gardens
                              </p>
                              <p className="text-xs text-gray-600">
                                Hedge trimming • 11:30 AM
                              </p>
                            </div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">
                                Sunrise Ave
                              </p>
                              <p className="text-xs text-gray-600">
                                Flower Bed Servicing • 1:30 PM
                              </p>
                            </div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center mt-20 mb-16">
            <p className="text-sm text-gray-600 mb-8">
              Trusted by landscaping companies nationwide
            </p>

            {/* Reviews */}
            <div className="flex justify-center items-center space-x-2 mb-8">
              <div className="flex text-yellow-400 text-xl">★★★★★</div>
              <span className="text-sm font-semibold text-black">4.8</span>
              <span className="text-sm text-gray-600">| 1,247 reviews</span>
            </div>

            {/* Company Logos Placeholder */}
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-lg font-semibold text-gray-400">
                GreenScape Pro
              </div>
              <div className="text-lg font-semibold text-gray-400">
                Lawn Masters
              </div>
              <div className="text-lg font-semibold text-gray-400">
                TurfCare Elite
              </div>
              <div className="text-lg font-semibold text-gray-400">
                Premier Grounds
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Create Routes
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Add Clients
            </button>
            <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
              Assign Routes
            </button>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Track Progress
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
