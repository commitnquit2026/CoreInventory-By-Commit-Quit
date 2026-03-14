import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Zap, BarChart3, Lock, Users, Headphones, ArrowRight, Boxes } from 'lucide-react'

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="CoreInventory" className="h-10 w-10" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                CoreInventory
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition">
                Features
              </a>
              <a href="#benefits" className="text-sm text-slate-600 hover:text-slate-900 transition">
                Benefits
              </a>
              <Link
                to="/login"
                className="px-6 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-200 mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-sm text-blue-700 font-medium">Trusted by 1000+ businesses</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Smart Inventory Management <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Made Easy</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Real-time inventory tracking, automated workflows, and powerful analytics. Transform your warehouse operations with CoreInventory.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-xl transition transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition">
                Watch Demo
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-8">
              <div>
                <p className="text-3xl font-bold text-slate-900">50%</p>
                <p className="text-sm text-slate-600">Faster Operations</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">99.9%</p>
                <p className="text-sm text-slate-600">Uptime SLA</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">24/7</p>
                <p className="text-sm text-slate-600">Support Available</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl blur-3xl opacity-60"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <p className="text-sm text-slate-600">Total Products</p>
                  <p className="text-2xl font-bold text-slate-900">2,847</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4">
                  <p className="text-sm text-slate-600">In Stock</p>
                  <p className="text-2xl font-bold text-slate-900">2,651</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
                  <p className="text-sm text-slate-600">Warehouses</p>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                  <p className="text-sm text-slate-600">Low Stock</p>
                  <p className="text-2xl font-bold text-slate-900">196</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Warehouse Capacity</span>
                  <span className="text-sm font-semibold text-slate-900">78%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to manage inventory efficiently and scale your operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Real-Time Analytics',
                description: 'Get instant insights into your inventory with comprehensive dashboards and detailed reports'
              },
              {
                icon: Zap,
                title: 'Automated Workflows',
                description: 'Streamline operations with intelligent automation that reduces manual work and errors'
              },
              {
                icon: Lock,
                title: 'Enterprise Security',
                description: 'Bank-level encryption and compliance with industry standards to protect your data'
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Enable your team to work together seamlessly with role-based access controls'
              },
              {
                icon: Headphones,
                title: '24/7 Support',
                description: 'Dedicated support team ready to help you succeed at any time'
              },
              {
                icon: CheckCircle2,
                title: 'Multi-Warehouse',
                description: 'Manage inventory across multiple warehouses from a single unified platform'
              },
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:bg-blue-50/30 transition">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-cyan-200 transition">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Choose CoreInventory?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join thousands of businesses that have transformed their inventory management
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              { title: 'Reduce Costs', desc: 'Save up to 40% on operational costs with optimized inventory management' },
              { title: 'Increase Efficiency', desc: 'Process inventory 3x faster with automated workflows and intelligent systems' },
              { title: 'Improve Accuracy', desc: 'Achieve 99.9% inventory accuracy with real-time tracking and validation' },
              { title: 'Better Decision Making', desc: 'Access actionable insights and analytics to make data-driven decisions' },
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Inventory Management?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your free trial today and experience the power of CoreInventory
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-xl transition"
            >
              Get Started Free
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Boxes className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  CoreInventory
                </span>
              </div>
              <p className="text-sm text-slate-600">Smart inventory management for modern businesses</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-slate-900 transition">Features</a></li>
                <li><a href="#" className="hover:text-slate-900 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-slate-900 transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-slate-900 transition">About</a></li>
                <li><a href="#" className="hover:text-slate-900 transition">Blog</a></li>
                <li><a href="#" className="hover:text-slate-900 transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-slate-900 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-slate-900 transition">Terms</a></li>
                <li><a href="#" className="hover:text-slate-900 transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200/50 pt-8 flex justify-between items-center">
            <p className="text-sm text-slate-600">© 2026 CoreInventory. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-slate-600 transition">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-slate-600 transition">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-slate-600 transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
