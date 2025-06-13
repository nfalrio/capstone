import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, ArrowLeft, Plus, Sun, Cloud, CloudRain, CloudLightning, Moon, BarChart2, BookOpen, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import ApiService from "../utils/api";

// Mood configuration dengan icon dan warna
const moodConfig = {
  1: {
    icon: <CloudLightning className="w-4 h-4" />,
    color: "bg-red-500",
    text: "Sangat Buruk",
    bgColor: "bg-red-100",
  },
  2: {
    icon: <CloudRain className="w-4 h-4" />,
    color: "bg-orange-500",
    text: "Buruk",
    bgColor: "bg-orange-100",
  },
  3: {
    icon: <Cloud className="w-4 h-4" />,
    color: "bg-gray-500",
    text: "Biasa",
    bgColor: "bg-gray-100",
  },
  4: {
    icon: <Sun className="w-4 h-4" />,
    color: "bg-yellow-500",
    text: "Baik",
    bgColor: "bg-yellow-100",
  },
  5: {
    icon: <Sun className="w-4 h-4" />,
    color: "bg-green-500",
    text: "Sangat Baik",
    bgColor: "bg-green-100",
  },
};

// Helper functions
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

const formatDate = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function MoodCalendar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState("");
  const [moodData, setMoodData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Fetch mood data on component mount
  useEffect(() => {
    const fetchMoodData = async () => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const response = await ApiService.getMoods(user.id);
        if (response.success) {
          const moods = response.data;
          const moodMap = {};
          moods.forEach(mood => {
            const date = mood.date.split('T')[0]; // Format: YYYY-MM-DD
            moodMap[date] = { mood: mood.mood, note: mood.note || "" };
          });
          setMoodData(moodMap);
        }
      } catch (err) {
        setError("Gagal memuat data mood. Silakan coba lagi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [user]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateSelect = (day) => {
    const dateStr = formatDate(year, month, day);
    setSelectedDate(dateStr);
    setShowMoodInput(true);

    // Pre-fill if mood already exists
    if (moodData[dateStr]) {
      setSelectedMood(moodData[dateStr].mood);
      setMoodNote(moodData[dateStr].note);
    } else {
      setSelectedMood(null);
      setMoodNote("");
    }
  };

  const saveMood = async () => {
    if (selectedMood && selectedDate) {
      try {
        const moodEntry = {
          userId: user.id,
          mood: selectedMood,
          note: moodNote,
          date: selectedDate,
          stressLevel: 0,
          tags: [],
        };
        const response = await ApiService.createMood(moodEntry);
        if (response.success) {
          setMoodData(prev => ({
            ...prev,
            [selectedDate]: { mood: selectedMood, note: moodNote }
          }));
          setShowMoodInput(false);
          setSelectedDate(null);
          setSelectedMood(null);
          setMoodNote("");
          alert("Mood berhasil disimpan!");
        }
      } catch (err) {
        console.error("Error saving mood:", err);
        alert("Gagal menyimpan mood. Silakan coba lagi.");
      }
    }
  };

  const getMoodStats = () => {
    const moods = Object.values(moodData);
    if (moods.length === 0) return null;

    const average = moods.reduce((sum, data) => sum + data.mood, 0) / moods.length;
    const moodCounts = moods.reduce((acc, data) => {
      acc[data.mood] = (acc[data.mood] || 0) + 1;
      return acc;
    }, {});

    const mostCommon = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      average: average.toFixed(1),
      mostCommon: mostCommon ? parseInt(mostCommon[0]) : null,
      totalEntries: moods.length,
    };
  };

  const stats = getMoodStats();

  // Create calendar grid
  const calendarDays = [];

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-20"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(year, month, day);
    const hasMood = moodData[dateStr];
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

    calendarDays.push(
      <div
        key={day}
        className={`h-20 border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors relative ${isToday ? "ring-2 ring-blue-500" : ""} ${hasMood ? moodConfig[hasMood.mood].bgColor : ""}`}
        onClick={() => handleDateSelect(day)}
      >
        <div className="flex justify-between items-start h-full">
          <span className={`text-sm font-medium ${isToday ? "text-blue-600" : "text-gray-700"}`}>{day}</span>
          {hasMood && <div className={`w-6 h-6 rounded-full ${moodConfig[hasMood.mood].color} flex items-center justify-center text-white`}>{moodConfig[hasMood.mood].icon}</div>}
        </div>
        {!hasMood && (
          <div className="absolute bottom-1 right-1 opacity-30 hover:opacity-60">
            <Plus className="w-3 h-3 text-gray-400" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Same as Dashboard */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">CalmSpace</h1>
          <p className="text-sm text-gray-500">Kelola mood & stres Anda</p>
        </div>
        <nav className="mt-6">
          <div className="px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <BarChart2 className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </div>
          <div className="px-4 py-3 bg-blue-50 text-blue-700 flex items-center cursor-pointer" onClick={() => navigate("/calendar")}>
            <Calendar className="w-5 h-5 mr-3" />
            <span className="font-medium">Kalender Mood</span>
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
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kalender Mood</h2>
            <p className="text-gray-600">Lacak perjalanan emosional Anda setiap hari</p>
          </div>

          {/* Monthly Stats */}
          {stats && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{stats.average}</div>
                  <div className="text-xs text-gray-500">Rata-rata</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{stats.totalEntries}</div>
                  <div className="text-xs text-gray-500">Hari tercatat</div>
                </div>
                <div>
                  <div className="flex justify-center">
                    {stats.mostCommon && <div className={`w-6 h-6 rounded-full ${moodConfig[stats.mostCommon].color} flex items-center justify-center text-white`}>{moodConfig[stats.mostCommon].icon}</div>}
                  </div>
                  <div className="text-xs text-gray-500">Mood tersering</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Calendar Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={goToPreviousMonth} className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Sebelumnya
            </button>

            <h3 className="text-xl font-bold text-gray-800">
              {monthNames[month]} {year}
            </h3>

            <button onClick={goToNextMonth} className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
              Selanjutnya
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div key={day} className="h-10 flex items-center justify-center font-medium text-gray-600 bg-gray-50">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays}
          </div>
        </div>

        {/* Mood Legend */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-medium mb-4">Legenda Mood</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(moodConfig).map(([level, config]) => (
              <div key={level} className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full ${config.color} flex items-center justify-center text-white`}>{config.icon}</div>
                <span className="text-sm text-gray-700">{config.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mood Input Modal */}
      {showMoodInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Mood untuk {selectedDate && new Date(selectedDate).toLocaleDateString("id-ID")}</h3>
              <button onClick={() => setShowMoodInput(false)} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bagaimana perasaan Anda?</label>
              <div className="flex space-x-2">
                {Object.entries(moodConfig).map(([level, config]) => (
                  <button
                    key={level}
                    onClick={() => setSelectedMood(parseInt(level))}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${selectedMood === parseInt(level) ? "bg-blue-50 border-2 border-blue-300" : "bg-gray-50 hover:bg-gray-100"}`}
                  >
                    <div className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center text-white mb-1`}>{config.icon}</div>
                    <span className="text-xs text-center">{level}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (opsional)</label>
              <textarea value={moodNote} onChange={(e) => setMoodNote(e.target.value)} className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" rows="3" placeholder="Ceritakan tentang hari Anda..." />
            </div>

            <div className="flex space-x-3">
              <button onClick={() => setShowMoodInput(false)} className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Batal
              </button>
              <button onClick={                saveMood} disabled={!selectedMood} className={`flex-1 px-4 py-2 rounded-lg font-medium ${selectedMood ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
