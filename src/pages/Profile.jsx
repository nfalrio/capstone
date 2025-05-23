import React, { useState } from "react";
import { Calendar, Clock, BarChart2, BookOpen, User, Settings, LogOut, Edit, Save, X, Camera, Mail, Phone, MapPin, Briefcase, GraduationCap, Heart, Target, TrendingUp, Award, Shield } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useNavigate } from "react-router-dom";

// Data dummy untuk profil pengguna
const initialUserProfile = {
  id: 1,
  name: "username",
  email: "username@email.com",
  phone: "+62 812-3456-7890",
  location: "Malang, Indonesia",
  occupation: "Pelajar",
  education: "SMAN 1 Lawang",
  joinDate: "2024-01-15",
  avatar: null,
  bio: "Bio user",
  goals: ["Menulis jurnal setiap hari", "Olahraga setiap minggu", "Menjaga mood tetap positif", "Mengurangi tingkat stres"],
  preferences: {
    notifications: true,
    privateMode: false,
    weeklyReport: true,
    moodReminder: true,
    reminderTime: "20:00",
  },
};

// Data statistik pengguna
const userStats = {
  totalJournals: 45,
  totalDays: 90,
  avgMood: 3.8,
  streakDays: 12,
  mostFrequentMood: 4,
  totalGoalsAchieved: 28,
};

// Data untuk chart mood distribution
const moodDistribution = [
  { name: "Sangat Baik", value: 25, color: "#10B981" },
  { name: "Baik", value: 35, color: "#3B82F6" },
  { name: "Biasa", value: 20, color: "#F59E0B" },
  { name: "Buruk", value: 15, color: "#F97316" },
  { name: "Sangat Buruk", value: 5, color: "#EF4444" },
];

// Data untuk aktivitas mingguan
const weeklyActivity = [
  { day: "Sen", journals: 3, mood: 4 },
  { day: "Sel", journals: 2, mood: 3 },
  { day: "Rab", journals: 4, mood: 5 },
  { day: "Kam", journals: 1, mood: 3 },
  { day: "Jum", journals: 3, mood: 4 },
  { day: "Sab", journals: 2, mood: 4 },
  { day: "Min", journals: 5, mood: 5 },
];

// Data untuk tren mood bulanan
const monthlyMoodTrend = [
  { month: "Jan", avgMood: 3.2 },
  { month: "Feb", avgMood: 3.5 },
  { month: "Mar", avgMood: 3.8 },
  { month: "Apr", avgMood: 4.1 },
  { month: "Mei", avgMood: 3.9 },
];

const achievements = [
  { title: "Penulis Konsisten", description: "30 hari berturut-turut menulis jurnal", icon: "📝", earned: true },
  { title: "Mood Tracker", description: "100 entri mood tercatat", icon: "😊", earned: true },
  { title: "Refleksi Master", description: "50 jurnal dengan insight mendalam", icon: "🧠", earned: false },
  { title: "Zen Mode", description: "7 hari berturut-turut mood positif", icon: "🧘", earned: true },
  { title: "Goal Crusher", description: "Menyelesaikan 20 target pribadi", icon: "🎯", earned: false },
  { title: "Mindful Journey", description: "365 hari menggunakan CalmSpace", icon: "🌟", earned: false },
];

export default function Profile() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    location: userProfile.location,
    occupation: userProfile.occupation,
    education: userProfile.education,
    bio: userProfile.bio,
  });

  const handleSaveProfile = () => {
    setUserProfile({ ...userProfile, ...editForm });
    setIsEditing(false);
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

  const getMoodEmoji = (mood) => {
    const emojis = { 1: "😢", 2: "😔", 3: "😐", 4: "😊", 5: "😄" };
    return emojis[mood] || "😐";
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
            <h2 className="text-2xl font-bold text-gray-800">Profil Saya</h2>
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>Kelola informasi pribadi dan lihat statistik Anda</span>
            </div>
          </div>
        </div>

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
                <p className="text-gray-600 mb-2">{userProfile.occupation}</p>
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
                          <p className="font-medium">{userProfile.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Lokasi</p>
                          <p className="font-medium">{userProfile.location}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Pekerjaan</p>
                          <p className="font-medium">{userProfile.occupation}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Pendidikan</p>
                          <p className="font-medium">{userProfile.education}</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-2">Bio</p>
                      <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
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
                    </div>
                  </div>

                  {/* Weekly Activity */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-4">Aktivitas Mingguan</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyActivity}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="journals" fill="#3B82F6" name="Jurnal" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Monthly Mood Trend */}
                  <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
                    <h4 className="font-medium mb-4">Tren Mood Bulanan</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyMoodTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[0, 5]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="avgMood" stroke="#10B981" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
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
                  {userProfile.goals.map((goal, index) => (
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
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
