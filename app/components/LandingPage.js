'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  Users, 
  CheckCircle,
  ArrowRight,
  Star,
  Lock
} from 'lucide-react';
import AuthModal from './AuthModal';

export default function LandingPage({ onLogin }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Resume Analysis",
      description: "AI-based resume feedback and optimization",
      emoji: "📄"
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Job Recommendations",
      description: "Personalized job listings based on your profile",
      emoji: "💼"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Track your learning journey with detailed insights",
      emoji: "📊"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Mentor Connect",
      description: "Find experienced mentors and senior students",
      emoji: "🤝"
    }
  ];

  const benefits = [
    "Save time in job preparation with AI-powered tools",
    "Get personalized guidance from experienced mentors",
    "Track your growth with detailed analytics and insights",
    "Be placement-ready with comprehensive skill development"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "S3 Dashboard helped me improve my resume and land interviews at top tech companies!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Engineering Graduate",
      content: "The mentor connect feature was game-changing. I found my dream job within 3 months!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Business Student",
      content: "The progress tracking helped me stay motivated and focused on my career goals.",
      rating: 5
    }
  ];

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Rocket className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">S3 Dashboard</span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => handleAuthClick('login')}
            className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => handleAuthClick('signup')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Smart Path to
            <span className="text-blue-600"> Career Success</span>
            <span className="text-4xl ml-3">🚀</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your career journey with AI-powered resume analysis, personalized job recommendations, 
            and expert mentorship guidance - all in one intelligent platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleAuthClick('signup')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold flex items-center justify-center space-x-2"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleAuthClick('login')}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold"
            >
              Login to Dashboard
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Preview */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features to Accelerate Your Career
            </h2>
            <p className="text-xl text-gray-600">
              Discover what makes S3 Dashboard the ultimate career development platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-gray-50 rounded-xl p-6 h-full border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-blue-600">
                      {feature.icon}
                    </div>
                    <span className="text-2xl">{feature.emoji}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Lock className="w-4 h-4" />
                    <span>Login to Access</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why S3 Dashboard */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Why Choose S3 Dashboard?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-3 text-left"
                >
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-lg text-gray-700">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who have already accelerated their career journey
            </p>
            <button
              onClick={() => handleAuthClick('signup')}
              className="px-10 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-xl font-semibold flex items-center mx-auto space-x-2"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from students who transformed their careers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Rocket className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold">S3 Dashboard</span>
          </div>
          <p className="text-gray-400 mb-6">
            Your smart path to career success
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>© 2024 S3 Dashboard. All rights reserved.</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onLogin={onLogin}
          onModeChange={setAuthMode}
        />
      )}
    </div>
  );
}
