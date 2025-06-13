import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { Heart, BarChart3, BookOpen, Calendar, Shield, Sparkles, ArrowRight, User, Lock, Mail } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Password tidak cocok');
        }
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      } else {
        await login({
          email: formData.email,
          password: formData.password
        });
      }
      
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: "Tracking Mood Harian",
      description: "Pantau perubahan mood Anda setiap hari dengan visualisasi yang mudah dipahami"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      title: "Jurnal Digital",
      description: "Tulis perasaan dan pengalaman dengan fitur analisis sentimen berbasis AI"
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      title: "Kalender Emosi",
      description: "Lihat pola mood Anda dalam tampilan kalender yang informatif"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-yellow-600" />,
      title: "Analisis AI",
      description: "Dapatkan insight mendalam tentang emosi Anda dengan teknologi AI"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Rekomendasi Personal",
      description: "Saran aktivitas yang disesuaikan dengan kondisi mood Anda"
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: "Data Aman",
      description: "Privasi terjamin dengan enkripsi data tingkat enterprise"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-800">CalmSpace</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Fitur</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">Tentang</a>
              <a href="#auth" className="text-gray-700 hover:text-blue-600 transition-colors">Masuk</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
                Kelola <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Mood & Emosi</span> Anda dengan AI
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Platform digital yang membantu Anda memahami, melacak, dan meningkatkan kesehatan mental melalui teknologi kecerdasan buatan.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a 
                  href="#auth"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center"
                >
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
                <a 
                  href="#features"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 transition-colors flex items-center justify-center"
                >
                  Pelajari Lebih Lanjut
                </a>
              </div>
            </div>
            <div className="lg:pl-12">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Mood Hari Ini</h3>
                </div>
                <div className="flex justify-between items-center mb-6">
                  {[1,2,3,4,5].map((mood) => (
                    <button key={mood} className="w-12 h-12 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors flex items-center justify-center">
                      <span className="text-xl">
                        {mood === 1 ? '😢' : mood === 2 ? '😔' : mood === 3 ? '😐' : mood === 4 ? '😊' : '😄'}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Analisis AI:</p>
                  <p className="text-blue-600 font-medium">Mood positif terdeteksi! Hari yang baik untuk aktivitas produktif.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Fitur Lengkap untuk Kesehatan Mental
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kombinasi teknologi AI dan pendekatan psikologi untuk membantu Anda mencapai kesejahteraan mental yang optimal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section id="auth" className="py-20">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {authMode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
              </h2>
              <p className="text-gray-600 mt-2">
                {authMode === 'login' 
                  ? 'Selamat datang kembali!' 
                  : 'Mulai perjalanan kesehatan mental Anda'
                }
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {authMode === 'register' && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Konfirmasi Password</label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Konfirmasi password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Memproses...' : (authMode === 'login' ? 'Masuk' : 'Daftar')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setError('');
                  setFormData({email: '', password: '', name: '', confirmPassword: ''});
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                {authMode === 'login' 
                  ? 'Belum punya akun? Daftar disini' 
                  : 'Sudah punya akun? Masuk disini'
                }
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="ml-3 text-2xl font-bold">CalmSpace</h3>
            </div>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Platform kesehatan mental berbasis AI yang membantu Anda memahami dan mengelola emosi dengan lebih baik.
            </p>
            <div className="border-t border-gray-700 pt-8">
              <p className="text-gray-400">© 2025 CalmSpace. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
