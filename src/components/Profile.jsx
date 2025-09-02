import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { generateAvatarUrl } from "../utils/avatarUtils";

const Profile = ({ loggedInUser, users, projects, onUpdateUser, onLogout }) => {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const foundUser = users.find((u) => u.username === username);
    setProfileUser(foundUser);

    if (foundUser) {
      if (foundUser.image) {
        setPreview(foundUser.image);
      } else {
        setPreview(generateAvatarUrl(foundUser.username, ""));
      }
    }
  }, [username, users]);

  if (!profileUser) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-screen text-white">
        <h2 className="text-3xl font-bold text-red-500">
          Kullanıcı bulunamadı.
        </h2>
      </div>
    );
  }

  const isOwnProfile = loggedInUser && loggedInUser.id === profileUser.id;

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!isOwnProfile) {
      setMessage("Kendi şifrenizi değiştirebilirsiniz.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessage("Yeni şifreler eşleşmiyor.");
      return;
    }
    if (!currentPassword || !newPassword) {
      setMessage("Lütfen tüm şifre alanlarını doldurun.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("users")).find(
      (u) => u.id === loggedInUser.id
    );

    if (storedUser.password !== currentPassword) {
      setMessage("Mevcut şifreniz yanlış.");
      return;
    }

    const updatedUser = { ...loggedInUser, password: newPassword };
    onUpdateUser(updatedUser);
    setMessage("Şifreniz başarıyla değiştirildi.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleImageChange = (e) => {
    if (!isOwnProfile) {
      setMessage("Kendi profil fotoğrafınızı değiştirebilirsiniz.");
      return;
    }
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setMessage("Lütfen 2MB'dan küçük bir dosya seçin.");
    }
  };

  const handleImageUpload = () => {
    if (!isOwnProfile) {
      setMessage("Kendi profil fotoğrafınızı değiştirebilirsiniz.");
      return;
    }
    if (image) {
      const updatedUser = { ...loggedInUser, image: image };
      onUpdateUser(updatedUser);
      setMessage("Profil fotoğrafı başarıyla güncellendi.");
    }
  };

  const userProjects = projects.filter(
    (project) => project.userId === profileUser.id
  );
  const userProjectCount = userProjects.length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Planlama":
        return "bg-purple-600/30 text-purple-200 border border-purple-400/50";
      case "Devam Ediyor":
        return "bg-blue-600/30 text-blue-200 border border-blue-400/50";
      case "Tamamlandı":
        return "bg-pink-600/30 text-pink-200 border border-pink-400/50";
      default:
        return "bg-gray-600/30 text-gray-200 border border-gray-400/50";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 min-h-screen text-white">
      <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-2xl space-y-8 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <img
            src={preview}
            alt="Profil Fotoğrafı"
            className="w-40 h-40 rounded-full border-4 border-purple-500 mb-4 object-cover transition-transform duration-300 hover:scale-105"
          />
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 mb-2">
            {profileUser.username}
          </h2>
          <p className="text-gray-400 font-light text-sm">
            Toplam {userProjectCount} proje oluşturdu.
          </p>
        </div>

        {isOwnProfile && (
          <>
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-300">
                Profil Fotoğrafı Yükle
              </h3>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-colors duration-200"
                />
                <button
                  onClick={handleImageUpload}
                  className="px-6 py-2 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-colors duration-200"
                >
                  Yükle
                </button>
              </div>
            </div>

            <form
              onSubmit={handlePasswordChange}
              className="border-t border-gray-700 pt-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-300">
                Şifre Değiştir
              </h3>
              <div className="space-y-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Mevcut Şifre"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  required
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yeni Şifre"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  required
                />
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Yeni Şifreyi Onayla"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  required
                />
              </div>
              {message && (
                <p
                  className={`mt-4 text-center ${
                    message.includes("başarıyla")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}
              <button
                type="submit"
                className="w-full mt-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200"
              >
                Şifreyi Güncelle
              </button>
            </form>

            <div className="border-t border-gray-700 pt-6 text-center">
              <button
                onClick={onLogout}
                className="py-3 px-6 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
              >
                Çıkış Yap
              </button>
            </div>
          </>
        )}

        {/* Kullanıcının Projeleri */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-300 mb-4">
            {profileUser.username} Tarafından Oluşturulan Projeler
          </h3>
          {userProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {userProjects.map((proj) => (
                <Link
                  key={proj.id}
                  to={`/project/${proj.id}`}
                  className="block bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 shadow-md transition-all duration-300 hover:bg-gray-600/50 hover:scale-[1.02]"
                >
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {proj.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    {proj.description.substring(0, 100)}...
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      proj.status
                    )}`}
                  >
                    {proj.status || "Durum Yok"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 italic">
              Henüz proje oluşturulmadı.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
