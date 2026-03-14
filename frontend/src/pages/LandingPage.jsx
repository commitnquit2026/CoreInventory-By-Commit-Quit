import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Zap, BarChart3, Lock, Users, ArrowRight, Boxes, TrendingUp, Rocket, Sparkles, Shield, Clock, Target, Play, Code2 } from 'lucide-react'

function LandingPage() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY)
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const stats = [
    { number: '50%', label: 'Faster Operations', icon: <TrendingUp className="w-5 h-5" /> },
    { number: '99.9%', label: 'Uptime SLA', icon: <Shield className="w-5 h-5" /> },
    { number: '24/7', label: 'Support', icon: <Clock className="w-5 h-5" /> },
    { number: '1000+', label: 'Happy Users', icon: <Users className="w-5 h-5" /> },
  ]

  const features = [
    { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Live dashboards with deep insights', color: 'from-blue-500 to-cyan-500' },
    { icon: Zap, title: 'Auto Workflows', desc: 'Eliminate manual work instantly', color: 'from-purple-500 to-pink-500' },
    { icon: Lock, title: 'Bank-Level Security', desc: 'Enterprise encryption & compliance', color: 'from-emerald-500 to-teal-500' },
    { icon: Rocket, title: 'Lightning Fast', desc: 'Sub-second response times', color: 'from-orange-500 to-red-500' },
    { icon: Users, title: 'Team Collab', desc: 'Seamless role-based access', color: 'from-indigo-500 to-blue-500' },
    { icon: Target, title: 'AI-Powered', desc: 'Smart recommendations built-in', color: 'from-yellow-500 to-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animation: 'float 8s infinite' }}></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animation: 'float 10s infinite reverse' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animation: 'float 12s infinite' }}></div>
      </div>

      {/* Navigation - Now Dark */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition duration-300">
                <Boxes className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                CoreInventory
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-300 hover:text-white transition relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#benefits" className="text-sm text-gray-300 hover:text-white transition relative group">
                Benefits
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#pricing" className="text-sm text-gray-300 hover:text-white transition relative group">
                Pricing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm text-gray-300 hover:text-white transition">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - DRASTIC */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
        }}></div>
        
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-blue-500/30 rounded-full backdrop-blur-sm hover:border-blue-500/60 transition">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-cyan-300">Trusted by 1000+ companies</span>
                </div>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl">
                  Inventory
                </span>
                <br />
                <span className="text-white">Reimagined</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 max-w-lg leading-relaxed font-light">
                The next-generation inventory management system with <span className="text-cyan-300 font-semibold">AI-powered insights</span>, real-time tracking, and automated workflows.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/40 transition duration-300 transform hover:scale-105 text-lg"
              >
                <Rocket className="w-5 h-5 group-hover:rotate-12 transition" />
                Launch Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-cyan-500/50 text-white font-bold rounded-xl hover:border-cyan-400 hover:bg-white/5 transition duration-300 text-lg">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="group p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 transition duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-cyan-400">{stat.icon}</div>
                    <p className="text-3xl font-black text-white">{stat.number}</p>
                  </div>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3D-like Hero Visual */}
          <div className="relative h-96 md:h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-3xl blur-3xl"></div>
            <div className="relative w-full h-full max-h-96 md:max-h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-cyan-900/20 rounded-3xl border border-cyan-500/30 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,.05)_25%,rgba(59,130,246,.05)_50%,transparent_50%,transparent_75%,rgba(59,130,246,.05)_75%,rgba(59,130,246,.05))] bg-[length:40px_40px] animate-pulse"></div>
              </div>
              
              <div className="relative h-full flex items-center justify-center p-8">
                <div className="space-y-6 w-full">
                  <div className="animate-bounce" style={{ animationDelay: '0s' }}>
                    <div className="p-4 bg-gradient-to-r from-blue-900/40 to-cyan-900/30 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                      <p className="text-xs text-gray-400 mb-2">LIVE INVENTORY</p>
                      <div className="flex items-end gap-2">
                        <div className="text-3xl font-bold text-blue-300">2,847</div>
                        <p className="text-sm text-green-400 font-semibold">+12% today</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>
                    <div className="p-4 bg-gradient-to-r from-purple-900/40 to-cyan-900/30 rounded-xl border border-purple-500/30 backdrop-blur-sm">
                      <p className="text-xs text-gray-400 mb-2">WAREHOUSES ACTIVE</p>
                      <div className="flex items-center gap-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>
                    <div className="p-4 bg-gradient-to-r from-emerald-900/40 to-cyan-900/30 rounded-xl border border-emerald-500/30 backdrop-blur-sm">
                      <p className="text-xs text-gray-400 mb-2">SYSTEM STATUS</p>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-green-400 font-semibold text-sm">All Systems Operational</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(20px); }
          }
        `}</style>
      </section>

      {/* Features Section - BOLD */}
      <section id="features" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Powerful Features
              </span>
              <br />
              <span className="text-white">That Scale With You</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Enterprise-grade tools designed for modern inventory operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`group relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm overflow-hidden transition duration-500 cursor-pointer hover:border-cyan-500/50 transform hover:scale-105 hover:-translate-y-2`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition duration-500`}></div>
                
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:shadow-lg transition duration-300 group-hover:shadow-current`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition">
                    {feature.desc}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition">
                    <span className="text-sm font-semibold">Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - IMPACT */}
      <section id="benefits" className="relative py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-20">
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Why Teams Choose Us
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: '50% Cost Reduction', desc: 'Cut operational expenses with smart automation' },
              { title: '3x Faster Processing', desc: 'Lightning-quick workflows that save hours daily' },
              { title: '99.9% Accuracy', desc: 'Real-time validation catches errors instantly' },
              { title: 'Data-Driven Decisions', desc: 'AI insights power your strategy' },
            ].map((benefit, idx) => (
              <div key={idx} className="group p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition duration-300 hover:border-cyan-500/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-gray-400 group-hover:text-gray-300">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - EXPLOSIVE */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Ready to Transform?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join 1000+ companies already managing inventory smarter
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition duration-300 transform hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 px-10 py-5 border-2 border-cyan-500/50 text-white font-bold text-lg rounded-xl hover:border-cyan-400 hover:bg-white/5 transition duration-300">
              <Code2 className="w-5 h-5" />
              Explore API
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Boxes className="w-5 h-5" />
                </div>
                <span className="text-lg font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  CoreInventory
                </span>
              </div>
              <p className="text-gray-400">Smart inventory for the modern era</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API', 'Security'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'Compliance'] },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, i) => (
                    <li key={i}><a href="#" className="text-gray-400 hover:text-cyan-400 transition">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2026 CoreInventory by Commit & Quit. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
