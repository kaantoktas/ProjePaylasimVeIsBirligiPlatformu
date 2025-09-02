import React, { useState } from "react";

const AddProjectForm = ({ onAddProject, onClose, user }) => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    status: "Planlama",
    image: "",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && newTag && !project.tags.includes(newTag)) {
      e.preventDefault();
      setProject((prevProject) => ({
        ...prevProject,
        tags: [...prevProject.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setProject((prevProject) => ({
      ...prevProject,
      tags: prevProject.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!project.title || !project.description) {
      alert("Lütfen başlık ve açıklama girin.");
      return;
    }

    // Check if the user is available before adding the project
    if (!user) {
      alert("Proje eklemek için giriş yapmalısınız.");
      return;
    }

    const newProjectWithId = {
      ...project,
      id: Date.now(),
      userId: user.id, // Assign the current user's ID
      date: new Date().toISOString(),
    };

    onAddProject(newProjectWithId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-2xl transform transition-transform duration-500 scale-100 animate-slide-up relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-6">
          Yeni Proje Ekle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="title" className="text-gray-300 font-semibold mb-2">
              Proje Başlığı
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={project.title}
              onChange={handleChange}
              placeholder="Projenize bir başlık verin..."
              className="p-4 rounded-xl bg-gray-700/50 text-gray-200 placeholder-gray-400 border border-purple-400/50 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-gray-300 font-semibold mb-2"
            >
              Proje Açıklaması
            </label>
            <textarea
              id="description"
              name="description"
              value={project.description}
              onChange={handleChange}
              rows="6"
              placeholder="Projenizi detaylı bir şekilde açıklayın..."
              className="p-4 rounded-xl bg-gray-700/50 text-gray-200 placeholder-gray-400 border border-purple-400/50 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300 resize-y"
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="status"
              className="text-gray-300 font-semibold mb-2"
            >
              Proje Durumu
            </label>
            <select
              id="status"
              name="status"
              value={project.status}
              onChange={handleChange}
              className="p-4 rounded-xl bg-gray-700/50 text-gray-200 border border-purple-400/50 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
            >
              <option>Planlama</option>
              <option>Devam Ediyor</option>
              <option>Tamamlandı</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="image" className="text-gray-300 font-semibold mb-2">
              Görsel URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={project.image}
              onChange={handleChange}
              placeholder="Görsel linki yapıştırın..."
              className="p-4 rounded-xl bg-gray-700/50 text-gray-200 placeholder-gray-400 border border-purple-400/50 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 font-semibold mb-2">
              Etiketler
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleTagAdd}
                placeholder="Etiket ekle..."
                className="flex-1 p-4 rounded-xl bg-gray-700/50 text-gray-200 placeholder-gray-400 border border-purple-400/50 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
              />
              <button
                type="button"
                onClick={() =>
                  handleTagAdd({
                    key: "Enter",
                    preventDefault: () => {},
                    target: { value: newTag },
                  })
                }
                className="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
              >
                Ekle
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-purple-600/50 text-white rounded-full text-sm font-semibold flex items-center space-x-2 border border-purple-400/50"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="text-white hover:text-gray-200 transition-colors duration-200 ml-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg shadow-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Proje Oluştur
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProjectForm;
