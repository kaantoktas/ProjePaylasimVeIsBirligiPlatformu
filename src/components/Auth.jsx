import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate'ı ekledik

const Auth = ({ onLogin }) => {
  const navigate = useNavigate(); // useNavigate hook'unu tanımladık
  const [formType, setFormType] = useState("login");
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
    name: "",
    surname: "",
    username: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.surname ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = existingUsers.find(
      (u) => u.username === formData.username || u.email === formData.email
    );

    if (userExists) {
      alert("Bu kullanıcı adı veya e-posta zaten kayıtlı.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      surname: formData.surname,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("Kayıt başarılı! Giriş yapabilirsiniz.");
    setFormType("login");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = existingUsers.find(
      (u) =>
        (u.username === formData.usernameOrEmail ||
          u.email === formData.usernameOrEmail) &&
        u.password === formData.password
    );

    if (foundUser) {
      onLogin({
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        name: foundUser.name,
        surname: foundUser.surname,
      });
      alert("Giriş başarılı!");
      navigate("/"); // Giriş başarılıysa ana sayfaya yönlendirme
    } else {
      alert("Kullanıcı adı/e-posta veya şifre yanlış.");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-in-down transition-colors duration-300">
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-300 mb-6 text-center transition-colors duration-300">
          {formType === "login" ? "Giriş Yap" : "Kayıt Ol"}
        </h2>
        {formType === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Kullanıcı Adı veya E-posta"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-300"
            />
            <input
              type="password"
              name="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-300"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Giriş Yap
            </button>
          </form>
        )}
        {formType === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Ad"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-300"
            />
            <input
              type="text"
              name="surname"
              placeholder="Soyad"
              value={formData.surname}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-300"
            />
            <input
              type="text"
              name="username"
              placeholder="Kullanıcı Adı"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-300"
            />
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-300"
            />
            <input
              type="password"
              name="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-300"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Kayıt Ol
            </button>
          </form>
        )}
        <div className="mt-4 text-center text-gray-400">
          {formType === "login" ? (
            <span>
              Hesabın yok mu?{" "}
              <button
                onClick={() => setFormType("register")}
                className="text-pink-400 font-bold hover:underline transition-colors duration-200"
              >
                Kayıt ol
              </button>
            </span>
          ) : (
            <span>
              Zaten hesabın var mı?{" "}
              <button
                onClick={() => setFormType("login")}
                className="text-pink-400 font-bold hover:underline transition-colors duration-200"
              >
                Giriş yap
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
