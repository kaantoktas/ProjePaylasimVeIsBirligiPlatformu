import React from "react";
import { Link } from "react-router-dom";

const ProjectOfTheDay = ({ project, onRefresh }) => {
  if (!project) {
    return (
      <div className="p-8 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl mb-8 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-300 mb-4">
          Günün Projesi
        </h2>
        <p className="text-gray-400 text-lg mb-4">
          Henüz seçilmiş bir günün projesi yok.
        </p>
        <button
          onClick={onRefresh}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          Başka Bir Proje Keşfet
        </button>
      </div>
    );
  }

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
    <div className="p-8 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl mb-8 relative overflow-hidden transition-colors duration-300 border border-purple-500/30">
      {/* Arka plan blur efektleri */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-60">
        <div className="absolute w-48 h-48 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse-slow top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-56 h-56 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse-slow bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 delay-300"></div>
      </div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-300 mb-4">
          Günün Projesi
        </h2>
        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              project.status
            )}`}
          >
            {project.status || "Durum Yok"}
          </span>
          {project.tags &&
            project.tags.length > 0 &&
            project.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-700/50 text-gray-300 text-xs font-medium px-3 py-1 rounded-full border border-gray-600"
              >
                {tag}
              </span>
            ))}
        </div>

        <div className="flex gap-4">
          <Link
            to={`/projects/${project.id}`}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Detayları İncele
          </Link>
          <button
            onClick={onRefresh}
            className="px-6 py-3 rounded-lg bg-gray-700 text-gray-200 font-bold hover:bg-gray-600 transition-colors duration-300 transform hover:scale-105"
          >
            Başka Bir Proje Keşfet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectOfTheDay;
