import React, { useState, useEffect } from "react";
import { Calendar, Clock, BarChart2, BookOpen, User, Settings, LogOut, Bell, Shield, Palette, Globe, Moon, Sun, Smartphone, Mail, Volume2, VolumeX, Eye, EyeOff, Download, Trash2, AlertTriangle, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import ApiService from "../utils/api";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      moodReminder: true,
      journalReminder: true,
      weeklyReport: true,
      goalReminder: true,
      reminderTime: "20:00",
      soundEnabled: true,
      pushNotifications: true,
      emailNotifications: false,
    },
    privacy: {
      profileVisibility: "private",
      dataSharing: false,
      analyticsTracking: true,
      twoFactorAuth: false,
      autoLogout: 30,
    },
    appearance: {
      theme: "light",
      language: "id",
      fontSize: "medium",
      colorScheme: "blue",
      compactMode: false,
    },
    data: {
      autoBackup: true,
      backupFrequency: "weekly",
      exportFormat: "json",
      dataRetention: 365,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reduceMotion: false,
      screenReader: false,
    },
  });
  const [activeTab, setActiveTab] = useState("notifications");
  const [saveStatus, setSaveStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage or backend on component mount
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      setLoading(false);
    };
    loadSettings();
  }, [user]);

  // Fungsi untuk update pengaturan
  const updateSetting = (category, key, value) => {
    const updatedSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    setSettings(updatedSettings);
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  // Fungsi untuk export data
  const handleExportData = () => {
    const dataToExport = {
      settings,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calmspace-settings-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fungsi untuk reset pengaturan
  const handleResetSettings = () => {
    const defaultSettings = {
      notifications: {
        moodReminder: true,
        journalReminder: true,
        weeklyReport: true,
        goalReminder: true,
        reminderTime: "20:00",
        soundEnabled: true,
        pushNotifications: true,
        emailNotifications: false,
      },
      privacy: {
        profileVisibility: "private",
        dataSharing: false,
        analyticsTracking: true,
        twoFactorAuth: false,
        autoLogout: 30,
      },
      appearance: {
        theme: "light",
        language: "id",
        fontSize: "medium",
        colorScheme: "blue",
        compactMode: false,
      },
      data: {
        autoBackup: true,
        backupFrequency: "weekly",
        exportFormat: "json",
        dataRetention: 365,
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        reduceMotion: false,
        screenReader: false,
      },
    };
    setSettings(defaultSettings);
    localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
    setSaveStatus("reset");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  const tabs = [
    { id: "notifications", name: "Notifikasi", icon: Bell },
    { id: "privacy", name: "Privasi & Keamanan", icon: Shield },
    { id: "appearance", name: "Tampilan", icon: Palette },
    { id: "data", name: "Data & Backup", icon: Download },
    { id: "accessibility", name: "Aksesibilitas", icon: Eye },
  ];

  const colorSchemes = [
    { name: "Biru", value: "blue", color: "bg-blue-500" },
    { name: "Hijau", value: "green", color: "bg-green-500" },
    { name: "Ungu", value: "purple", color: "bg-purple-500" },
    { name: "Merah Muda", value: "pink", color: "bg-pink-500" },
    { name: "Oranye", value: "orange", color: "bg-orange-500" },
  ];

  const languages = [
    { name: "Bahasa Indonesia", value: "id" },
    { name: "English", value: "en" },
    { name: "Español", value: "es" },
    { name: "Français", value: "fr" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
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
          <div className="px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/journal")}>
            <BookOpen className="w-5 h-5 mr-3" />
            <span>Jurnal</span>
          </div>
          <div className="px-4 py-3 text-gray-600 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/profile")}>
            <User className="w-5 h-5 mr-3" />
            <span>Profil</span>
          </div>
          <div className="px-4 py-3 bg-blue-50 text-blue-700 flex items-center">
            <Settings className="w-5 h-5 mr-3" />
            <span className="font-medium">Pengaturan</span>
          </div>
        </nav>
        <div className="absolute bottom-0 left-0 w-64 p-4">
          <button className="flex items-center text-gray-600 hover:text-gray-800" onClick={() => navigate("/landingpage")}>
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
            <h2 className="text-2xl font-bold text-gray-800">Pengaturan</h2>
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>Kelola preferensi dan pengaturan aplikasi</span>
            </div>
          </div>
          {saveStatus && (
            <div className={`flex items-center px-4 py-2 rounded-lg ${saveStatus === "saved" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
              <Check className="w-4 h-4 mr-2" />
              <span className="text-sm">{saveStatus === "saved" ? "Pengaturan disimpan" : "Pengaturan direset"}</span>
            </div>
          )}
        </div>

        {/* Settings Container */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`py-4 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Notifikasi Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Pengaturan Notifikasi</h3>
                <div className="space-y-4">
                  {/* Pengingat Mood */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Pengingat Mood Harian</h4>
                      <p className="text-sm text-gray-600">Ingatkan saya untuk mencatat mood setiap hari</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settings.notifications.moodReminder} onChange={(e) => updateSetting("notifications", "moodReminder", e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Pengingat Jurnal */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Pengingat Jurnal</h4>
                      <p className="text-sm text-gray-600">Ingatkan saya untuk menulis jurnal</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settings.notifications.journalReminder} onChange={(e) => updateSetting("notifications", "journalReminder", e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Reminder Time */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Waktu Pengingat</h4>
                    <input
                      type="time"
                      className="p-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                      value={settings.notifications.reminderTime}
                      onChange={(e) => updateSetting("notifications", "reminderTime", e.target.value)}
                    />
                  </div>

                  {/* Sound Notifications */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {settings.notifications.soundEnabled ? <Volume2 className="w-5 h-5 text-gray-400 mr-3" /> : <VolumeX className="w-5 h-5 text-gray-400 mr-3" />}
                      <div>
                        <h4 className="font-medium">Suara Notifikasi</h4>
                        <p className="text-sm text-gray-600">Putar suara saat ada notifikasi</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settings.notifications.soundEnabled} onChange={(e) => updateSetting("notifications", "soundEnabled", e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Privasi & Keamanan Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Privasi & Keamanan</h3>

                {/* Profile Visibility */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Visibilitas Profil</h4>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => updateSetting("privacy", "profileVisibility", e.target.value)}
                  >
                    <option value="private">Privat</option>
                    <option value="friends">Teman</option>
                    <option value="public">Publik</option>
                  </select>
                </div>

                {/* Data Sharing */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Berbagi Data dengan Pihak Ketiga</h4>
                    <p className="text-sm text-gray-600">Izinkan berbagi data anonim untuk peningkatan layanan</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.privacy.dataSharing} onChange={(e) => updateSetting("privacy", "dataSharing", e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Analytics Tracking */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Pelacakan Analytics</h4>
                    <p className="text-sm text-gray-600">Izinkan pengumpulan data untuk analitik aplikasi</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.privacy.analyticsTracking} onChange={(e) => updateSetting("privacy", "analyticsTracking", e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Two Factor Authentication */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Autentikasi Dua Faktor</h4>
                    <p className="text-sm text-gray-600">Aktifkan keamanan tambahan dengan 2FA</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.privacy.twoFactorAuth} onChange={(e) => updateSetting("privacy", "twoFactorAuth", e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Auto Logout */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Waktu Logout Otomatis (menit)</h4>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                    value={settings.privacy.autoLogout}
                    onChange={(e) => updateSetting("privacy", "autoLogout", parseInt(e.target.value) || 30)}
                  />
                </div>
              </div>
            )}

            {/* Tampilan Tab */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Tampilan</h3>

                {/* Tema */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Tema Aplikasi</h4>
                  <select className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" value={settings.appearance.theme} onChange={(e) => updateSetting("appearance", "theme", e.target.value)}>
                    <option value="light">Terang</option>
                    <option value="dark">Gelap</option>
                    <option value="auto">Otomatis (Sesuai Sistem)</option>
                  </select>
                </div>

                {/* Bahasa */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Bahasa</h4>
                  <select className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" value={settings.appearance.language} onChange={(e) => updateSetting("appearance", "language", e.target.value)}>
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ukuran Font */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Ukuran Font</h4>
                  <select className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" value={settings.appearance.fontSize} onChange={(e) => updateSetting("appearance", "fontSize", e.target.value)}>
                    <option value="small">Kecil</option>
                    <option value="medium">Sedang</option>
                    <option value="large">Besar</option>
                  </select>
                </div>

                {/* Skema Warna */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Skema Warna</h4>
                  <div className="flex space-x-3">
                    {colorSchemes.map((scheme) => (
                      <button
                        key={scheme.value}
                        className={`w-8 h-8 rounded-full ${scheme.color} flex items-center justify-center focus:outline-none border-2 ${settings.appearance.colorScheme === scheme.value ? "border-black" : "border-transparent"}`}
                        onClick={() => updateSetting("appearance", "colorScheme", scheme.value)}
                        aria-label={scheme.name}
                        type="button"
                      >
                        {settings.appearance.colorScheme === scheme.value && <Check className="w-5 h-5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode Compact */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Mode Compact</h4>
                    <p className="text-sm text-gray-600">Mengurangi jarak antar elemen untuk tampilan lebih padat</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.appearance.compactMode} onChange={(e) => updateSetting("appearance", "compactMode", e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Data & Backup Tab */}
            {activeTab === "data" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Data & Backup</h3>

                {/* Auto Backup */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Backup Otomatis</h4>
                    <p className="text-sm text-gray-600">Backup data secara otomatis sesuai jadwal</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.data.autoBackup} onChange={(e) => updateSetting("data", "autoBackup", e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Backup Frequency */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Frekuensi Backup Otomatis</h4>
                  <select className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" value={settings.data.backupFrequency} onChange={(e) => updateSetting("data", "backupFrequency", e.target.value)}>
                    <option value="daily">Harian</option>
                    <option value="weekly">Mingguan</option>
                    <option value="monthly">Bulanan</option>
                  </select>
                </div>

                {/* Export Format */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Format Ekspor Data</h4>
                  <select className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" value={settings.data.exportFormat} onChange={(e) => updateSetting("data", "exportFormat", e.target.value)}>
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="xml">XML</option>
                  </select>
                </div>

                {/* Data Retention */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Retensi Data (hari)</h4>
                  <input
                    type="number"
                    min={1}
                    max={3650}
                    className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                    value={settings.data.dataRetention}
                    onChange={(e) => updateSetting("data", "dataRetention", parseInt(e.target.value) || 365)}
                  />
                </div>

                {/* Export and Reset Buttons */}
                <div className="flex space-x-4 mt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center" onClick={handleExportData}>
                    <Download className="w-5 h-5 mr-2" />
                    Ekspor Data
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center" onClick={handleResetSettings}>
                    <Trash2 className="w-5 h-5 mr-2" />
                    Reset Pengaturan
                  </button>
                </div>
              </div>
            )}

            {/* Aksesibilitas Tab */}
            {activeTab === "accessibility" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Aksesibilitas</h3>

                {/* High Contrast */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Kontras Tinggi</h4>
                    <p className="text-sm text-gray-600">Tingkatkan kontras warna untuk visibilitas lebih baik</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.accessibility.highContrast} onChange={(e) => updateSetting("accessibility", "highContrast", e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Large Text */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Teks Besar</h4>
                    <p className="text-sm text-gray-600">Tampilkan teks dalam ukuran lebih besar</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.accessibility.largeText} onChange={(e) => updateSetting("accessibility", "largeText", e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Reduce Motion */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Kurangi Gerakan Animasi</h4>
                    <p className="text-sm text-gray-600">Batasi animasi untuk kenyamanan</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.accessibility.reduceMotion} onChange={(e) => updateSetting("accessibility", "reduceMotion", e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Screen Reader */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Mode Pembaca Layar</h4>
                    <p className="text-sm text-gray-600">Optimasi tampilan untuk screen reader</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.accessibility.screenReader} onChange={(e) => updateSetting("accessibility", "screenReader", e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
