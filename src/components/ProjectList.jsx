// src/components/ProjectList.jsx

import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import AddProjectForm from "./AddProjectForm";
import Auth from "./Auth";

const ProjectList = ({
  user,
  projects = [], // ✅ Default to empty array
  participants = [], // ✅ Default to empty array
  handleJoin,
  likes,
  handleLike,
  handleAddProject,
  handleUpdateProject,
  handleDeleteProject,
  handleClearParticipants,
  handleDeleteParticipant,
  onLogin,
  onRegister,
  users = [], // ✅ Default to empty array
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");

  const availableTags = [...new Set(projects.flatMap((p) => p.tags))];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => project.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOrder === "latest") {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    return 0;
  });

  const handleTagClick = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const randomProject =
    projects.length > 0
      ? projects[Math.floor(Math.random() * projects.length)]
      : null;

  const projectCreator = randomProject
    ? users.find((u) => u.id === randomProject.userId)
    : null;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {user ? (
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-purple-500/30 animate-fade-in lg:sticky lg:top-24">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 mb-6">
              Yeni Proje Ekle
            </h2>
            <AddProjectForm
              onAddProject={handleAddProject}
              onClose={() => {}}
              user={user}
            />
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-1/3">
          <Auth onLogin={onLogin} onRegister={onRegister} />
        </div>
      )}

      <div className="w-full lg:w-2/3">
        <div className="space-y-12">
          {randomProject && (
            <div className="relative bg-gradient-to-br from-purple-900 to-blue-900 rounded-3xl shadow-2xl p-8 flex flex-col justify-between overflow-hidden animate-fade-in-down">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
                Günün Projesi
              </h2>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-gray-100">
                  {randomProject.title}
                </h3>
                <p className="text-gray-300">{randomProject.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-600/30 text-purple-200 border border-purple-400/50">
                    {randomProject.status}
                  </span>
                  {randomProject.tags &&
                    randomProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-700/50 text-gray-300 text-xs font-medium px-3 py-1 rounded-full border border-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {}}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Detayları İncele
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 rounded-lg bg-gray-700 text-white font-semibold shadow-xl hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Başka Bir Proje Keşfet
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-pink-400/20 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">
              Mevcut Projeler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Proje ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-gray-700/50 text-gray-200 placeholder-gray-400 border border-purple-400/50 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
              />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-gray-700/50 text-gray-200 border border-purple-400/50 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-300"
              >
                <option value="latest">En Yeni</option>
              </select>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                    selectedTags.includes(tag)
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-gray-700/50 text-gray-300 border border-gray-600"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
            {sortedProjects.length === 0 ? (
              <p className="text-center text-gray-400 text-xl font-semibold mt-16 col-span-2">
                Aradığınız kriterlere uygun proje bulunamadı.
              </p>
            ) : (
              sortedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  participants={participants}
                  handleJoin={handleJoin}
                  handleLike={handleLike}
                  likes={likes}
                  handleDeleteProject={handleDeleteProject}
                  handleClearParticipants={handleClearParticipants}
                  handleDeleteParticipant={handleDeleteParticipant}
                  user={user}
                  projectCreator={
                    users.find((u) => u.id === project.userId) || null
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
