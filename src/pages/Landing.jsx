import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import AuthButtons from "../auth_components/AuthButtons";

const Landing = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-black">
              routopia<span className="text-green-600">+</span>
            </h1>
            <div className="hidden md:flex space-x-6">
              <button
                onClick={() => scrollToSection('product')}
                className="text-gray-600 hover:text-black transition-colors"
              >
                Product
              </button>
              <button
                onClick={() => scrollToSection('solutions')}
                className="text-gray-600 hover:text-black transition-colors"
              >
                Solutions
              </button>
              <button
                onClick={() => scrollToSection('customers')}
                className="text-gray-600 hover:text-black transition-colors"
              >
                Customers
              </button>
              <button
                onClick={() => scrollToSection('plans')}
                className="text-gray-600 hover:text-black transition-colors"
              >
                Plans
              </button>
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

      {/* Product Section */}
      <section id="product" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Powerful Product Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to streamline your route management and grow your landscaping business.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🗺️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Route Optimization</h3>
              <p className="text-gray-600">AI-powered route planning that saves time and fuel costs by optimizing stops and travel paths automatically.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Mobile App</h3>
              <p className="text-gray-600">Native mobile apps for drivers and managers with real-time updates, GPS tracking, and offline capabilities.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
              <p className="text-gray-600">Comprehensive analytics and reporting to track performance, identify trends, and make data-driven decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Solutions for Every Business</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">From small landscaping crews to large commercial operations, we have solutions that scale with your business.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Small Teams (1-5 drivers)</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Basic route planning</li>
                <li>• Client management</li>
                <li>• Mobile check-ins</li>
                <li>• Simple reporting</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Growing Business (5-20 drivers)</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Advanced route optimization</li>
                <li>• Team management tools</li>
                <li>• Customer communications</li>
                <li>• Performance analytics</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Enterprise (20+ drivers)</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Multi-location support</li>
                <li>• Advanced integrations</li>
                <li>• Custom workflows</li>
                <li>• Dedicated support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Customers Section */}
      <section id="customers" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Join thousands of landscaping professionals who trust Routopia+ to manage their daily operations.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">"Routopia+ has transformed how we manage our daily routes. We've reduced drive time by 25% and our customers love the real-time updates."</p>
              <div className="font-semibold">Sarah Johnson</div>
              <div className="text-sm text-gray-500">GreenScape Pro</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">"The mobile app is incredibly intuitive. Our drivers adapted to it immediately and productivity has increased significantly."</p>
              <div className="font-semibold">Mike Rodriguez</div>
              <div className="text-sm text-gray-500">Lawn Masters</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">"The analytics dashboard gives us insights we never had before. We can optimize our operations like never before."</p>
              <div className="font-semibold">Jennifer Chen</div>
              <div className="text-sm text-gray-500">TurfCare Elite</div>
            </div>
          </div>
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-4 bg-green-50 px-6 py-4 rounded-lg">
              <div className="text-3xl font-bold text-green-600">1,247+</div>
              <div className="text-gray-600">satisfied customers nationwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Choose Your Plan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Simple, transparent pricing that grows with your business. No hidden fees or long-term contracts.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <div className="text-3xl font-bold mb-4">$29<span className="text-lg text-gray-500">/month</span></div>
              <p className="text-gray-600 mb-6">Perfect for small teams getting started</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Up to 5 drivers</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Basic route planning</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Mobile app access</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Email support</li>
              </ul>
              <button className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">Get Started</button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border-2 border-green-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Most Popular</div>
              <h3 className="text-xl font-semibold mb-2">Professional</h3>
              <div className="text-3xl font-bold mb-4">$79<span className="text-lg text-gray-500">/month</span></div>
              <p className="text-gray-600 mb-6">Best for growing landscaping businesses</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Up to 20 drivers</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Advanced optimization</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Analytics dashboard</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Priority support</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Customer notifications</li>
              </ul>
              <button className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">Get Started</button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-4">Custom</div>
              <p className="text-gray-600 mb-6">For large operations with specific needs</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Unlimited drivers</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Custom integrations</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Multi-location support</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Dedicated support</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Custom training</li>
              </ul>
              <button className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold mb-4">
                routopia<span className="text-green-400">+</span>
              </h3>
              <p className="text-gray-300 mb-4">
                Streamlining route management for landscaping professionals nationwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Mobile Apps</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Training</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">System Status</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 Routopia+. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
