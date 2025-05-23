
import React, { useState } from 'react';
import { ArrowRight, BarChart3, Heart, BookOpen, Calendar, Shield, Zap, Star, Check, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Testimonial data
const testimonials = [
  {
    name: "Sarah M.",
    role: "Mahasiswa",
    content: "CalmSpace membantu saya memahami pola mood dan mengelola stres kuliah dengan lebih baik. Sangat mudah digunakan!",
    rating: 5
  },
  {
    name: "Andi K.",
    role: "Pekerja",
    content: "Fitur jurnal dan analisis sentimen benar-benar membantu saya untuk lebih mindful dengan perasaan sehari-hari.",
    rating: 5
  },
  {
    name: "Dewi L.",
    role: "Freelancer",
    content: "Aplikasi terbaik untuk tracking mood. Rekomendasi aktivitasnya juga sangat relevan dan helpful.",
    rating: 5
  }
];

// Features data
const features = [
  {
    icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
    title: "Pelacakan Mood Harian",
    description: "Catat dan pantau perubahan mood Anda dengan visualisasi yang mudah dipahami"
  },
  {
    icon: <BookOpen className="w-8 h-8 text-green-600" />,
    title: "Jurnal Pribadi",
    description: "Tulis refleksi harian dengan analisis sentimen berbasis AI untuk insight yang lebih dalam"
  },
  {
    icon: <Calendar className="w-8 h-8 text-purple-600" />,
    title: "Kalender Emosi",
    description: "Lihat pola mood Anda dalam tampilan kalender untuk memahami tren jangka panjang"
  },
  {
    icon: <Heart className="w-8 h-8 text-red-600" />,
    title: "Rekomendasi Personal",
    description: "Dapatkan saran aktivitas yang disesuaikan dengan kondisi emosi Anda saat ini"
  },
  {
    icon: <Shield className="w-8 h-8 text-yellow-600" />,
    title: "Privasi Terjamin",
    description: "Data Anda aman dan privat. Tidak ada yang bisa mengakses jurnal pribadi Anda"
  },
  {
    icon: <Zap className="w-8 h-8 text-indigo-600" />,
    title: "Analisis Cerdas",
    description: "Teknologi machine learning membantu mengidentifikasi pemicu stres dan pola emosi"
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">CalmSpace</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Fitur</a>
                <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">Tentang</a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimoni</a>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Masuk
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Daftar Gratis
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              <a href="#features" className="block text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium">Fitur</a>
              <a href="#about" className="block text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium">Tentang</a>
              <a href="#testimonials" className="block text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium">Testimoni</a>
              <div className="border-t border-gray-200 pt-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium"
                >
                  Masuk
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="block w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-base font-medium rounded-md mt-2"
                >
                  Daftar Gratis
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Kelola <span className="text-blue-600">Mood</span> & <span className="text-purple-600">Stres</span><br />
              Dengan Lebih Baik
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Platform digital yang membantu Anda memahami dan mengelola kondisi emosional secara mandiri 
              dengan teknologi AI dan pendekatan berbasis data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center"
              >
                Mulai Gratis Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                onClick={() => navigate('/demo')}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 hover:shadow-lg"
              >
                Lihat Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Lengkap untuk Kesehatan Mental Anda
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dapatkan insight mendalam tentang kondisi emosional Anda dengan fitur-fitur canggih yang mudah digunakan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Mengapa Memilih CalmSpace?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Kami memahami betapa pentingnya kesehatan mental di era digital ini. CalmSpace hadir sebagai 
                solusi teknologi yang membantu Anda untuk lebih memahami diri sendiri melalui pendekatan yang 
                ilmiah dan personal.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Check className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Berbasis Riset Ilmiah</h4>
                    <p className="text-gray-600">Dikembangkan berdasarkan penelitian psikologi dan teknologi terkini</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Mudah Digunakan</h4>
                    <p className="text-gray-600">Interface yang intuitif dan ramah pengguna untuk semua kalangan</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Data Aman & Pribadi</h4>
                    <p className="text-gray-600">Keamanan dan privasi data Anda adalah prioritas utama kami</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Untuk Siapa CalmSpace?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Mahasiswa yang mengalami tekanan akademik
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Pekerja muda dengan tingkat stres tinggi
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Siapa saja yang ingin lebih memahami diri sendiri
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Individu yang peduli dengan kesehatan mental
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Pengguna Kami?
            </h2>
            <p className="text-xl text-gray-600">
              Ribuan pengguna telah merasakan manfaat CalmSpace dalam perjalanan kesehatan mental mereka
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Mulai Perjalanan Kesehatan Mental Anda Hari Ini
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Bergabung dengan ribuan pengguna yang telah merasakan manfaatnya. Gratis dan mudah!
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            Daftar Sekarang - Gratis!
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">CalmSpace</h3>
              <p className="text-gray-300 mb-4">
                Platform digital untuk kesehatan mental yang membantu Anda memahami dan mengelola 
                kondisi emosional dengan teknologi AI dan pendekatan berbasis data.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Bantuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privasi</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2025 CalmSpace. Semua hak dilindungi. Dibuat dengan ❤️ untuk kesehatan mental yang lebih baik.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

