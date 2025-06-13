import React, { useState, useEffect } from "react";
import { Calendar, Clock, BarChart2, BookOpen, User, Settings, LogOut, Edit, Save, X, Camera, Mail, Phone, MapPin, Briefcase, GraduationCap, Heart, Target, TrendingUp, Award, Shield } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  LineChart, Line } from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import ApiService from "../utils/api";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    occupation: "",
    education: "",
    joinDate: "",
    avatar: null,
    bio: "",
    goals: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    occupation: "",
    education: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userStats, setUserStats] = useState({
    totalJournals: 0,
    totalDays: 0,
    avgMood: 0,
    streakDays: 0,
    mostFrequentMood: 0,
    totalGoalsAchieved: 0,
  });

  // Data untuk chart mood distribution (akan diupdate dari backend)
  const [moodDistribution, setMoodDistribution] = useState([
    { name: "Sangat Baik", value: 0, color: "#10B981" },
    { name: "Baik", value: 0, color: "#3B82F6" },
    { name: "Biasa", value: 0, color: "#F59E0B" },
    { name: "Buruk", value: 0, color: "#F97316" },
    { name: "Sangat Buruk", value: 0, color: "#EF4444" },
  ]);

  // Data untuk aktivitas mingguan (akan diupdate dari backend)
  const [weeklyActivity, setWeeklyActivity] = useState([
    { day: "Sen", journals: 0, mood: 0 },
    { day: "Sel", journals: 0, mood: 0 },
    { day: "Rab", journals: 0, mood: 0 },
    { day: "Kam", journals: 0, mood: 0 },
    { day: "Jum", journals: 0, mood: 0 },
    { day: "Sab", journals: 0, mood: 0 },
    { day: "Min", journals: 0, mood: 0 },
  ]);

  // Data untuk tren mood bulanan (akan diupdate dari backend)
  const [monthlyMoodTrend, setMonthlyMoodTrend] = useState([
    { month: "Jan", avgMood: 0 },
    { month: "Feb", avgMood: 0 },
    { month: "Mar", avgMood: 0 },
    { month: "Apr", avgMood: 0 },
    { month: "Mei", avgMood: 0 },
  ]);

  // Dummy data pencapaian (bisa diperbarui dengan data dari backend)
  const achievements = [
    { title: "Penulis Konsisten", description: "30 hari berturut-turut menulis jurnal", icon: "📝", earned: false },
    { title: "Mood Tracker", description: "100 entri mood tercatat", icon: "😊", earned: false },
    { title: "Refleksi Master", description: "50 jurnal dengan insight mendalam", icon: "🧠", earned: false },
    { title: "Zen Mode", description: "7 hari berturut-turut mood positif", icon: "🧘", earned: false },
    { title: "Goal Crusher", description: "Menyelesaikan 20 target pribadi", icon: "🎯", earned: false },
    { title: "Mindful Journey", description: "365 hari menggunakan CalmSpace", icon: "🌟", earned: false },
  ];

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const userResponse = await ApiService.getUser(user.id);
        if (userResponse.success) {
          const fetchedProfile = userResponse.data;
          setUserProfile({
            id: fetchedProfile.id,
            name: fetchedProfile.name,
            email: fetchedProfile.email,
            phone: fetchedProfile.profile.phone || "",
            location: fetchedProfile.profile.location || "",
            occupation: fetchedProfile.profile.occupation || "",
            education: fetchedProfile.profile.education || "",
            joinDate: fetchedProfile.createdAt || new Date().toISOString(),
            avatar: null, // Tambahkan logika untuk avatar jika ada
            bio: fetchedProfile.profile.bio || "",
            goals: fetchedProfile.goals || [],
          });
          setEditForm({
            name: fetchedProfile.name,
            email: fetchedProfile.email,
            phone: fetchedProfile.profile.phone || "",
            location: fetchedProfile.profile.location || "",
            occupation: fetchedProfile.profile.occupation || "",
            education: fetchedProfile.profile.education || "",
            bio: fetchedProfile.profile.bio || "",
          });
        }

        // Fetch stats
        const moodStatsResponse = await ApiService.getMoodStats(user.id, 365);
        if (moodStatsResponse.success) {
          const stats = moodStatsResponse.data;
          setUserStats({
            totalJournals: 0, // Harus dihitung dari endpoint journals
            totalDays: stats.totalEntries,
            avgMood: stats.averageMood,
            streakDays: 0, // Tambahkan logika untuk streak
            mostFrequentMood: Object.keys(stats.moodDistribution).reduce((a, b) => stats.moodDistribution[a] > stats.moodDistribution[b] ? a : b),
            totalGoalsAchieved: 0, // Tambahkan logika untuk goals
          });

          // Update mood distribution
          const newDistribution = [
            { name: "Sangat Baik", value: stats.moodDistribution[5], color: "#10B981" },
            { name: "Baik", value: stats.moodDistribution[4], color: "#3B82F6" },
            { name: "Biasa", value: stats.moodDistribution[3], color: "#F59E0B" },
            { name: "Buruk", value: stats.moodDistribution[2], color: "#F97316" },
            { name: "Sangat Buruk", value: stats.moodDistribution[1], color: "#EF4444" },
          ];
          setMoodDistribution(newDistribution);
        }

        // Fetch journals for weekly stats (opsional, bisa diperluas)
        const journalsResponse = await ApiService.getJournals(user.id);
        if (journalsResponse.success) {
          // Hitung total jurnal
          const journals = journalsResponse.data;
          setUserStats(prev => ({ ...prev, totalJournals: journals.length }));

          // Hitung aktivitas mingguan (contoh sederhana)
          const now = new Date();
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 6);
          const weeklyJournals = journals.filter(j => new Date(j.createdAt) >= weekAgo);
          const weeklyMood = weeklyJournals.reduce((acc, j) => {
            acc[new Date(j.createdAt).getDay()] = (acc[new Date(j.createdAt).getDay()] || 0) + j.mood;
            return acc;
          }, Array(7).fill(0));
          const weeklyCount = weeklyJournals.reduce((acc, j) => {
            acc[new Date(j.createdAt).getDay()] = (acc[new Date(j.createdAt).getDay()] || 0) + 1;
            return acc;
          }, Array(7).fill(0));
          const newWeeklyActivity = weeklyActivity.map((day, index) => ({
            ...day,
            journals: weeklyCount[index],
            mood: weeklyMood[index] > 0 ? Math.round(weeklyMood[index] / weeklyCount[index]) : 0,
          }));
          setWeeklyActivity(newWeeklyActivity);
        }
      } catch (err) {
        setError("Gagal memuat data profil. Silakan coba lagi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await ApiService.updateUser(user.id, {
        name: editForm.name,
        email: editForm.email,
        profile: {
          phone: editForm.phone,
          location: editForm.location,
          occupation: editForm.occupation,
          education: editForm.education,
          bio: editForm.bio,
        },
      });
      setUserProfile({ ...userProfile, ...editForm });
      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Gagal memperbarui profil. Silakan coba lagi.");
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      location: userProfile.location,
      occupation: userProfile.occupation,
      education: userProfile.education,
      bio: userProfile.bio,
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">CalmSpace</h1>
          <p className="text-sm text-gray-500">Kelola mood & stres Anda</p>
        </div>
        <nav className="mt-6">
          <div className="w-full px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <BarChart2 className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </div>
          <div className="w-full px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/calendar")}>
            <Calendar className="w-5 h-5 mr-3" />
            <span>Kalender Mood</span>
          </div>
          <div className="w-full px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/journal")}>
            <BookOpen className="w-5 h-5 mr-3" />
            <span>Jurnal</span>
          </div>
          <div className="w-full px-4 py-3 bg-blue-50 text-blue-700 flex items-center cursor-pointer">
            <User className="w-5 h-5 mr-3" />
            <span className="font-medium">Profil</span>
          </div>
          <div className="w-full px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/settings")}>
            <Settings className="w-5 h-5 mr-3" />
            <span>Pengaturan</span>
          </div>
        </nav>
        <div className="absolute bottom-0 left-0 w-64 p-4">
          <button className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer" onClick={() => navigate("/landingpage")}>
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
            <h2 className="text-2xl font-bold text-gray-800">Profil Saya</h2>
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>Kelola informasi pribadi dan lihat statistik Anda</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    userProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-bold text-gray-800">{userProfile.name}</h3>
                <p className="text-gray-600 mb-2">{userProfile.occupation || "Belum diatur"}</p>
                <p className="text-gray-500 text-sm">Bergabung sejak {formatDate(userProfile.joinDate)}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Aktif hari ini</span>
                  </div>
                  <div className="flex items-center text-orange-600">
                    <Target className="w-4 h-4 mr-1" />
                    <span className="text-sm">{userStats.streakDays} hari berturut-turut</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profil
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "profile", name: "Informasi Pribadi", icon: User },
                { id: "stats", name: "Statistik", icon: BarChart2 },
                { id: "achievements", name: "Pencapaian", icon: Award },
                { id: "goals", name: "Target Pribadi", icon: Target },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`py-4 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Tab Content: Profile Information */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Nama Lengkap</label>
                        <input type="text" className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" value={editForm.name} onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                          value={editForm.email}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Nomor Telepon</label>
                        <input type="tel" className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" value={editForm.phone} onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Lokasi</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                          value={editForm.location}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Pekerjaan</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                          value={editForm.occupation}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, occupation: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Pendidikan</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                          value={editForm.education}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, education: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Bio</label>
                      <textarea className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" rows="4" value={editForm.bio} onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))} />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50" onClick={handleCancelEdit}>
                        <X className="w-4 h-4 mr-2 inline" />
                        Batal
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-2 inline" />
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{userProfile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Telepon</p>
                          <p className="font-medium">{userProfile.phone || "Belum diatur"}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Lokasi</p>
                          <p className="font-medium">{userProfile.location || "Belum diatur"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Pekerjaan</p>
                          <p className="font-medium">{userProfile.occupation || "Belum diatur"}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Pendidikan</p>
                          <p className="font-medium">{userProfile.education || "Belum diatur"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-2">Bio</p>
                      <p className="text-gray-700 leading-relaxed">{userProfile.bio || "Belum ada bio"}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Statistics */}
            {activeTab === "stats" && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                    <div className="text-2xl font-bold">{userStats.totalJournals}</div>
                    <div className="text-sm opacity-80">Total Jurnal</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                    <div className="text-2xl font-bold">{userStats.avgMood.toFixed(1)}</div>
                    <div className="text-sm opacity-80">Rata-rata Mood</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
                    <div className="text-2xl font-bold">{userStats.streakDays}</div>
                    <div className="text-sm opacity-80">Streak Hari</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                    <div className="text-2xl font-bold">{userStats.totalGoalsAchieved}</div>
                    <div className="text-sm opacity-80">Target Tercapai</div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Mood Distribution */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-4">Distribusi Mood</h4>
                    <div className="h-48">
                      {loading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={moodDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                              {moodDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Weekly Activity */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-4">Aktivitas Mingguan</h4>
                    <div className="h-48">
                      {loading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={weeklyActivity}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="journals" fill="#3B82F6" name="Jurnal" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Monthly Mood Trend */}
                  <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
                    <h4 className="font-medium mb-4">Tren Mood Bulanan</h4>
                    <div className="h-48">
                      {loading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={monthlyMoodTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={[0, 5]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="avgMood" stroke="#10B981" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Achievements */}
            {activeTab === "achievements" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${achievement.earned ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-60"}`}>
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <h4 className={`font-medium mb-1 ${achievement.earned ? "text-green-800" : "text-gray-600"}`}>{achievement.title}</h4>
                    <p className={`text-sm ${achievement.earned ? "text-green-600" : "text-gray-500"}`}>{achievement.description}</p>
                    {achievement.earned && (
                      <div className="flex items-center mt-2 text-green-600">
                        <Shield className="w-4 h-4 mr-1" />
                        <span className="text-xs font-medium">TERCAPAI</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab Content: Personal Goals */}
            {activeTab === "goals" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Target Pribadi Saya</h4>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">Tambah Target</button>
                </div>
                <div className="space-y-3">
                  {userProfile.goals.length > 0 ? (
                    userProfile.goals.map((goal, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Target className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-gray-700">{goal}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-green-600 font-medium">Aktif</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                      Belum ada target pribadi. Tambahkan target baru!
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
