import React, { useState, useEffect } from "react";
import { Calendar, Clock, BarChart2, BookOpen, User, Settings, LogOut, Moon, Sun, Cloud, CloudRain, CloudLightning } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

// Dummy data for mood chart
const moodData = [
  { date: "1 Mei", mood: 3, stress: 4 },
  { date: "2 Mei", mood: 4, stress: 3 },
  { date: "3 Mei", mood: 2, stress: 5 },
  { date: "4 Mei", mood: 5, stress: 2 },
  { date: "5 Mei", mood: 4, stress: 3 },
  { date: "6 Mei", mood: 3, stress: 4 },
  { date: "7 Mei", mood: 5, stress: 1 },
];

// Dummy data for mood triggers
const moodTriggers = [
  { name: "Pekerjaan", count: 8 },
  { name: "Keluarga", count: 3 },
  { name: "Kuliah", count: 6 },
  { name: "Sosial", count: 2 },
  { name: "Kesehatan", count: 4 },
];

// Dummy recommendations based on mood
const recommendations = [
  { title: "Meditasi 5 Menit", description: "Latihan pernapasan sederhana untuk menenangkan pikiran" },
  { title: "Journaling Positif", description: "Tulis 3 hal yang membuat Anda bersyukur hari ini" },
  { title: "Jalan Santai", description: "Luangkan 15 menit untuk berjalan di luar ruangan" },
];

// Mood emoji mapping
const moodEmojis = {
  1: { icon: <CloudLightning className="w-10 h-10 text-gray-600" />, text: "Sangat Buruk" },
  2: { icon: <CloudRain className="w-10 h-10 text-blue-400" />, text: "Buruk" },
  3: { icon: <Cloud className="w-10 h-10 text-gray-400" />, text: "Biasa" },
  4: { icon: <Sun className="w-10 h-10 text-yellow-400" />, text: "Baik" },
  5: { icon: <Sun className="w-10 h-10 text-yellow-500" />, text: "Sangat Baik" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState(null);
  const [journalEntry, setJournalEntry] = useState("");
  const [journalSentiment, setJournalSentiment] = useState(null);

  // Simulate mood analysis from journal text
  useEffect(() => {
    if (journalEntry.length > 10) {
      // This would be replaced with actual ML model inference
      const randomSentiment = Math.random();
      if (randomSentiment > 0.7) setJournalSentiment("positif");
      else if (randomSentiment > 0.4) setJournalSentiment("netral");
      else setJournalSentiment("negatif");
    } else {
      setJournalSentiment(null);
    }
  }, [journalEntry]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">CalmSpace</h1>
          <p className="text-sm text-gray-500">Kelola mood & stres Anda</p>
        </div>
        <nav className="mt-6">
          <div className="px-4 py-3 bg-blue-50 text-blue-700 flex items-center">
            <BarChart2 className="w-5 h-5 mr-3" />
            <span className="font-medium">Dashboard</span>
          </div>
          <div className="px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/calendar")}>
            <Calendar className="w-5 h-5 mr-3" />
            <span>Kalender Mood</span>
          </div>
          <div className="px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/journal")}>
            <BookOpen className="w-5 h-5 mr-3" />
            <span>Jurnal</span>
          </div>
          <div className="px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/profile")}>
            <User className="w-5 h-5 mr-3" />
            <span>Profil</span>
          </div>
          <div className="px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/settings")}>
            <Settings className="w-5 h-5 mr-3" />
            <span>Pengaturan</span>
          </div>
        </nav>
        <div className="absolute bottom-0 left-0 w-64 p-4">
          <button className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer">
            <LogOut className="w-5 h-5 mr-2" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Selamat datang, Pengguna!</h2>
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>Senin, 5 Mei 2025</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <span className="font-medium">Mood Terakhir: </span>
            <span className="text-yellow-500 font-medium">Baik</span>
          </div>
        </div>

        {/* Mood Input */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-medium mb-4">Bagaimana perasaan Anda hari ini?</h3>
          <div className="flex space-x-4 mb-6">
            {[1, 2, 3, 4, 5].map((mood) => (
              <button
                key={mood}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${currentMood === mood ? "bg-blue-50 border-2 border-blue-300" : "bg-gray-50 hover:bg-gray-100"}`}
                onClick={() => setCurrentMood(mood)}
              >
                {moodEmojis[mood].icon}
                <span className="mt-2 text-sm">{moodEmojis[mood].text}</span>
              </button>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Ceritakan tentang hari Anda (opsional):</label>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              rows="3"
              placeholder="Tulis pengalaman atau perasaan Anda hari ini..."
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
            ></textarea>
            {journalSentiment && (
              <div className="mt-2 text-sm">
                Analisis teks: <span className={journalSentiment === "positif" ? "text-green-500" : journalSentiment === "negatif" ? "text-red-500" : "text-gray-500"}>{journalSentiment}</span>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${currentMood ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
              disabled={!currentMood}
            >
              Simpan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mood & Stress Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-medium mb-4">Tren Mood & Stres</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis domain={[0, 5]} stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line type="monotone" dataKey="mood" stroke="#4F46E5" strokeWidth={3} name="Mood" dot={{ fill: "#4F46E5", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: "#4F46E5", strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="stress" stroke="#F97316" strokeWidth={3} name="Tingkat Stres" dot={{ fill: "#F97316", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: "#F97316", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mood Triggers */}
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-medium mb-4">Pemicu Stres</h3>
            <div className="space-y-4">
              {moodTriggers.map((trigger, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <span className="text-gray-700 font-medium">{trigger.name}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(trigger.count / 10) * 100}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium min-w-[20px]">{trigger.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white p-6 rounded-lg shadow-sm mt-6 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-medium mb-6">rekomendasi untuk Anda</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-200 hover:scale-105 cursor-pointer">
                <h4 className="font-semibold text-blue-700 mb-2">{rec.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors duration-200">Mulai Sekarang →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
