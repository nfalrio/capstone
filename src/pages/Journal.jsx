import React, { useState, useEffect } from "react";
import { Calendar, Clock, BarChart2, BookOpen, User, Settings, LogOut, Save, Edit3, Search, Filter, Heart, Smile, Frown, Meh, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy data untuk jurnal yang sudah ada
const existingJournals = [
  {
    id: 1,
    date: "2025-05-07",
    title: "Hari yang Produktif",
    content: "Hari ini saya berhasil menyelesaikan semua tugas kuliah. Merasa sangat puas dengan pencapaian hari ini. Tim project juga kompak dan saling mendukung.",
    sentiment: "positif",
    mood: 5,
    tags: ["kuliah", "produktif", "tim"],
  },
  {
    id: 2,
    date: "2025-05-06",
    title: "Sedikit Overwhelmed",
    content: "Banyak deadline yang menumpuk minggu ini. Merasa sedikit kewalahan tapi masih bisa diatur. Perlu lebih baik dalam time management.",
    sentiment: "netral",
    mood: 3,
    tags: ["deadline", "kuliah", "stress"],
  },
  {
    id: 3,
    date: "2025-05-05",
    title: "Hari yang Menantang",
    content: "Presentasi tidak berjalan sesuai rencana. Merasa kecewa dengan performa hari ini. Tapi ini adalah pembelajaran yang berharga.",
    sentiment: "negatif",
    mood: 2,
    tags: ["presentasi", "kecewa", "pembelajaran"],
  },
];

// Mood emoji mapping (sama seperti dashboard)
const moodEmojis = {
  1: { icon: <AlertCircle className="w-5 h-5 text-red-500" />, text: "Sangat Buruk", color: "text-red-500" },
  2: { icon: <Frown className="w-5 h-5 text-orange-500" />, text: "Buruk", color: "text-orange-500" },
  3: { icon: <Meh className="w-5 h-5 text-gray-500" />, text: "Biasa", color: "text-gray-500" },
  4: { icon: <Smile className="w-5 h-5 text-yellow-500" />, text: "Baik", color: "text-yellow-500" },
  5: { icon: <Heart className="w-5 h-5 text-green-500" />, text: "Sangat Baik", color: "text-green-500" },
};

// Sentiment color mapping
const sentimentColors = {
  positif: "text-green-500 bg-green-50 border-green-200",
  netral: "text-gray-500 bg-gray-50 border-gray-200",
  negatif: "text-red-500 bg-red-50 border-red-200",
};

export default function Journal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("write"); // 'write' atau 'history'
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalSentiment, setJournalSentiment] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalTags, setJournalTags] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [journals, setJournals] = useState(existingJournals);
  const [isLoading, setIsLoading] = useState(false);

  // Simulasi analisis sentimen
  useEffect(() => {
    if (journalContent.length > 20) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const randomSentiment = Math.random();
        if (randomSentiment > 0.6) setJournalSentiment("positif");
        else if (randomSentiment > 0.3) setJournalSentiment("netral");
        else setJournalSentiment("negatif");
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setJournalSentiment(null);
    }
  }, [journalContent]);

  // Filter jurnal berdasarkan pencarian dan sentimen
  const filteredJournals = journals.filter((journal) => {
    const matchesSearch = journal.title.toLowerCase().includes(searchTerm.toLowerCase()) || journal.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment = filterSentiment === "all" || journal.sentiment === filterSentiment;
    return matchesSearch && matchesSentiment;
  });

  // Fungsi untuk menyimpan jurnal
  const handleSaveJournal = () => {
    if (!journalTitle.trim() || !journalContent.trim() || !selectedMood) {
      alert("Mohon lengkapi semua field yang diperlukan");
      return;
    }

    const newJournal = {
      id: journals.length + 1,
      date: new Date().toISOString().split("T")[0],
      title: journalTitle,
      content: journalContent,
      sentiment: journalSentiment || "netral",
      mood: selectedMood,
      tags: journalTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    setJournals([newJournal, ...journals]);

    // Reset form
    setJournalTitle("");
    setJournalContent("");
    setJournalSentiment(null);
    setSelectedMood(null);
    setJournalTags("");

    alert("Jurnal berhasil disimpan!");
  };

  // Format tanggal
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - sama seperti dashboard */}
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
          <div className="px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/calendar")}>
            <Calendar className="w-5 h-5 mr-3" />
            <span>Kalender Mood</span>
          </div>
          <div className="px-4 py-3 bg-blue-50 text-blue-700 flex items-center">
            <BookOpen className="w-5 h-5 mr-3" />
            <span className="font-medium">Jurnal</span>
          </div>
          <div className="px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100" onClick={() => navigate("/profile")}>
            <User className="w-5 h-5 mr-3" />
            <span>Profil</span>
          </div>
          <div className="px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100">
            <Settings className="w-5 h-5 mr-3" />
            <span>Pengaturan</span>
          </div>
        </nav>
        <div className="absolute bottom-0 left-0 w-64 p-4">
          <button className="flex items-center text-gray-600 hover:text-gray-800">
            <LogOut className="w-5 h-5 mr-2" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Jurnal Harian</h2>
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDate(new Date().toISOString().split("T")[0])}</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <span className="font-medium">Total Jurnal: </span>
            <span className="text-blue-600 font-medium">{journals.length}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button className={`px-6 py-3 font-medium ${activeTab === "write" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("write")}>
              <Edit3 className="w-4 h-4 inline mr-2" />
              Tulis Jurnal
            </button>
            <button className={`px-6 py-3 font-medium ${activeTab === "history" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("history")}>
              <BookOpen className="w-4 h-4 inline mr-2" />
              Riwayat Jurnal
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "write" ? (
              // Form Tulis Jurnal
              <div className="space-y-6">
                {/* Judul Jurnal */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Judul Jurnal</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Berikan judul untuk jurnal hari ini..."
                    value={journalTitle}
                    onChange={(e) => setJournalTitle(e.target.value)}
                  />
                </div>

                {/* Mood Selection */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Bagaimana perasaan Anda hari ini?</label>
                  <div className="flex space-x-3">
                    {[1, 2, 3, 4, 5].map((mood) => (
                      <button
                        key={mood}
                        className={`flex flex-col items-center p-3 rounded-lg transition-all ${selectedMood === mood ? "bg-blue-50 border-2 border-blue-300" : "bg-gray-50 hover:bg-gray-100 border border-gray-200"}`}
                        onClick={() => setSelectedMood(mood)}
                      >
                        {moodEmojis[mood].icon}
                        <span className="mt-1 text-xs">{moodEmojis[mood].text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Konten Jurnal */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Ceritakan tentang hari Anda</label>
                  <textarea
                    className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                    rows="8"
                    placeholder="Tulis pengalaman, perasaan, atau refleksi Anda hari ini..."
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                  />

                  {/* Analisis Sentimen */}
                  {isLoading && <div className="mt-2 text-sm text-gray-500">Menganalisis sentimen...</div>}
                  {journalSentiment && !isLoading && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Analisis sentimen: </span>
                      <span className={`text-sm px-2 py-1 rounded-full border ${sentimentColors[journalSentiment]}`}>{journalSentiment}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Tag (opsional)</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Pisahkan dengan koma (contoh: kuliah, kerja, keluarga)"
                    value={journalTags}
                    onChange={(e) => setJournalTags(e.target.value)}
                  />
                </div>

                {/* Tombol Simpan */}
                <div className="flex justify-end">
                  <button
                    className={`px-6 py-3 rounded-lg font-medium flex items-center ${journalTitle && journalContent && selectedMood ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                    disabled={!journalTitle || !journalContent || !selectedMood}
                    onClick={handleSaveJournal}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Jurnal
                  </button>
                </div>
              </div>
            ) : (
              // Riwayat Jurnal
              <div className="space-y-6">
                {/* Filter dan Pencarian */}
                <div className="flex flex-col sm:flex-row mb-4">
                  <input
                    type="text"
                    className="w-full sm:w-1/2 p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 mb-2 sm:mb-0 sm:mr-2"
                    placeholder="Cari jurnal..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select className="w-full sm:w-1/4 p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" value={filterSentiment} onChange={(e) => setFilterSentiment(e.target.value)}>
                    <option value="all">Semua Sentimen</option>
                    <option value="positif">Positif</option>
                    <option value="netral">Netral</option>
                    <option value="negatif">Negatif</option>
                  </select>
                </div>

                {/* Daftar Jurnal */}
                <div className="space-y-4">
                  {filteredJournals.length > 0 ? (
                    filteredJournals.map((journal) => (
                      <div key={journal.id} className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-bold">{journal.title}</h3>
                        <p className="text-sm text-gray-500">{formatDate(journal.date)}</p>
                        <p className="mt-2">{journal.content}</p>
                        <div className="mt-2 flex items-center">
                          <span className={`text-sm font-medium ${sentimentColors[journal.sentiment]}`}>{journal.sentiment.charAt(0).toUpperCase() + journal.sentiment.slice(1)}</span>
                          <span className={`ml-2 ${moodEmojis[journal.mood].color}`}>
                            {moodEmojis[journal.mood].icon} {moodEmojis[journal.mood].text}
                          </span>
                        </div>
                        <div className="mt-2">
                          {journal.tags.map((tag, index) => (
                            <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-500">Tidak ada jurnal yang ditemukan.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
