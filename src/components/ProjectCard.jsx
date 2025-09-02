// src/components/ProjectCard.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { generateAvatarUrl } from "../utils/avatarUtils";
import { toast } from "react-toastify";

// localStorage'dan beğeni verilerini almak için yardımcı fonksiyonlar
const getLikesFromLocalStorage = () => {
  const likes = localStorage.getItem("projectLikes");
  return likes ? JSON.parse(likes) : {};
};

const setLikesToLocalStorage = (likes) => {
  localStorage.setItem("projectLikes", JSON.stringify(likes));
};

const ProjectCard = ({
  project,
  participants,
  handleDeleteParticipant,
  handleClearParticipants,
  handleJoin,
  handleEdit,
  handleDeleteProject,
  user,
}) => {
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [likes, setLikes] = useState({});
  const [userLikes, setUserLikes] = useState([]);
  const [replyForm, setReplyForm] = useState({
    comment: "",
  });

  useEffect(() => {
    setLikes(getLikesFromLocalStorage());
    if (user) {
      const storedLikes =
        JSON.parse(localStorage.getItem(`userLikes_${user.id}`)) || [];
      setUserLikes(storedLikes);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Katılmak için giriş yapmalısınız.");
      return;
    }

    if (handleJoin(project.id, { comment: comment.trim() }, null)) {
      setComment("");
      setReplyingTo(null);
      setReplyForm({ comment: "" });
    }
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Yorum yapmak için giriş yapmalısınız.");
      return;
    }

    if (
      handleJoin(project.id, { comment: replyForm.comment.trim() }, replyingTo)
    ) {
      setReplyForm({ comment: "" });
      setReplyingTo(null);
    }
  };

  const handleLikeClick = (projectId) => {
    if (!user) {
      toast.error("Beğenmek için giriş yapmalısınız.");
      return;
    }

    let updatedLikes = { ...likes };
    let updatedUserLikes = [...userLikes];

    if (userLikes.includes(projectId)) {
      updatedLikes[projectId] = (updatedLikes[projectId] || 1) - 1;
      updatedUserLikes = updatedUserLikes.filter((id) => id !== projectId);
      toast.info("Beğeniyi geri çektiniz.");
    } else {
      updatedLikes[projectId] = (updatedLikes[projectId] || 0) + 1;
      updatedUserLikes.push(projectId);
      toast.success("Projeyi beğendiniz!");
    }

    setLikes(updatedLikes);
    setLikesToLocalStorage(updatedLikes);
    setUserLikes(updatedUserLikes);
    localStorage.setItem(
      `userLikes_${user.id}`,
      JSON.stringify(updatedUserLikes)
    );
  };

  if (!project) {
    return null;
  }

  const projectLikes = likes[project.id] || 0;
  const projectComments = participants.filter(
    (p) => p.projectId === project.id
  );
  const participantCount = projectComments.length;

  const getNestedComments = (commentList, parentId = null) => {
    const nestedComments = commentList.filter(
      (comment) => comment.parentId === parentId
    );
    return nestedComments.map((comment) => ({
      ...comment,
      replies: getNestedComments(commentList, comment.id),
    }));
  };

  const commentTree = getNestedComments(projectComments);

  const renderComments = (comments) => {
    return (
      <ul className="space-y-4">
               {" "}
        {comments.map((comment) => (
          <li key={comment.id} className="animate-slide-up">
                       {" "}
            <div
              className={`relative bg-white/10 backdrop-blur-md border border-pink-400/20 p-4 rounded-xl shadow-lg text-sm text-gray-100 transition-colors duration-300 ${
                comment.parentId ? "ml-6" : ""
              }`}
            >
                           {" "}
              <div className="flex items-center mb-2">
                               {" "}
                <img
                  src={generateAvatarUrl(comment.name, comment.surname)}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                               {" "}
                <div className="flex-1">
                                   {" "}
                  <strong className="block text-purple-200">
                                        {comment.name} {comment.surname}       
                             {" "}
                  </strong>
                                   {" "}
                  {comment.comment && (
                    <p className="text-gray-200 italic">"{comment.comment}"</p>
                  )}
                                 {" "}
                </div>
                               {" "}
                {user &&
                  (project.userId === user.id || user.username === "admin") && (
                    <button
                      onClick={() => handleDeleteParticipant(comment.id)}
                      className="text-red-300 hover:text-red-500 transition-colors duration-200 ml-2 text-xs"
                    >
                                            Sil                    {" "}
                    </button>
                  )}
                             {" "}
              </div>
                           {" "}
              {user && (
                <button
                  onClick={() =>
                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                  }
                  className="text-pink-300 hover:text-pink-500 text-xs mt-2 transition-colors duration-200 font-semibold"
                >
                                   {" "}
                  {replyingTo === comment.id ? "Vazgeç" : "Cevapla"}           
                     {" "}
                </button>
              )}
                           {" "}
              {replyingTo === comment.id && (
                <form
                  onSubmit={handleReplySubmit}
                  className="mt-4 flex flex-col gap-2"
                >
                                   {" "}
                  <textarea
                    value={replyForm.comment}
                    onChange={(e) =>
                      setReplyForm({ ...replyForm, comment: e.target.value })
                    }
                    placeholder="Yorumun..."
                    rows="3"
                    className="p-2 text-sm rounded-lg border border-pink-300 bg-white/10 text-white placeholder-gray-300 focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition-colors duration-300 resize-y"
                  ></textarea>
                                   {" "}
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
                  >
                                        Gönder                  {" "}
                  </button>
                                 {" "}
                </form>
              )}
                         {" "}
            </div>
                       {" "}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2 pl-4 border-l-2 border-blue-400/50">
                                {renderComments(comment.replies)}             {" "}
              </div>
            )}
                     {" "}
          </li>
        ))}
             {" "}
      </ul>
    );
  };

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

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " yıl önce";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " ay önce";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " gün önce";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " saat önce";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " dakika önce";
    return "şimdi";
  };

  const lastActivity =
    projectComments.length > 0
      ? getRelativeTime(projectComments[projectComments.length - 1].id)
      : "Henüz aktivite yok";

  const isOwner = user && user.id === project.userId;
  const projectCreator = JSON.parse(localStorage.getItem("users"))?.find(
    (u) => u.id === project.userId
  );
  const creatorUsername = projectCreator?.username || "Bilinmiyor";

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-8 transform transition-transform duration-500 hover:scale-102 flex flex-col justify-between overflow-hidden">
            {/* Arka plan blur efektleri */}     {" "}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-60">
               {" "}
        <div className="absolute w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-30 animate-pulse-slow top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"></div>
               {" "}
        <div className="absolute w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse-slow bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 delay-300"></div>
             {" "}
      </div>
           {" "}
      <div className="relative z-10">
               {" "}
        <Link to={`/project/${project.id}`}>
                   {" "}
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-40 object-cover rounded-xl mb-4 shadow-lg transition-transform duration-300 hover:scale-105"
            />
          )}
                   {" "}
          <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-300 mb-2 hover:from-pink-400 hover:to-blue-400 transition-all duration-300">
                        {project.title}         {" "}
          </h3>
                 {" "}
        </Link>
               {" "}
        <p className="text-gray-400 text-sm mb-4">
                    Oluşturan:          {" "}
          <Link
            to={`/profile/${creatorUsername}`}
            className="text-purple-300 hover:underline hover:text-purple-400 transition-colors duration-300"
          >
                        {creatorUsername}         {" "}
          </Link>
                 {" "}
        </p>
               {" "}
        <div className="flex flex-wrap gap-2 mb-4">
                   {" "}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              project.status
            )}`}
          >
                        {project.status || "Durum Yok"}         {" "}
          </span>
                   {" "}
          {project.tags &&
            project.tags.length > 0 &&
            project.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-700/50 text-gray-300 text-xs font-medium px-3 py-1 rounded-full border border-gray-600 transition-colors duration-300"
              >
                                {tag}             {" "}
              </span>
            ))}
                 {" "}
        </div>
               {" "}
        <p className="text-gray-300 text-base mb-6 transition-colors duration-300 leading-relaxed">
                    {project.description}       {" "}
        </p>
             {" "}
      </div>
           {" "}
      <div className="flex justify-between items-center text-sm mb-4 border-t border-gray-700 pt-4 relative z-10">
               {" "}
        <span className="text-gray-400">
                    <strong className="text-white">{participantCount}</strong>{" "}
          katılımcı        {" "}
        </span>
               {" "}
        <span className="text-gray-400">Son aktivite: {lastActivity}</span>     {" "}
      </div>
           {" "}
      <div className="flex justify-between items-center mb-4 relative z-10">
               {" "}
        <button
          onClick={() => handleLikeClick(project.id)}
          className={`flex items-center space-x-1 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg ${
            userLikes.includes(project.id)
              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
              : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
          }`}
        >
                   {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
                       {" "}
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
                     {" "}
          </svg>
                   {" "}
          <span>
                       {" "}
            {userLikes.includes(project.id) ? "Beğeniyi Geri Çek" : "Beğen"}   
                 {" "}
          </span>
                 {" "}
        </button>
               {" "}
        <span className="text-lg font-bold text-gray-200">
                    {projectLikes} Beğeni        {" "}
        </span>
             {" "}
      </div>
           {" "}
      {user ? (
        <form onSubmit={handleSubmit} className="mt-auto relative z-10">
                   {" "}
          <div className="flex flex-col gap-3">
                       {" "}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Yorumun (isteğe bağlı)..."
              rows="4"
              className="p-3 rounded-lg border border-pink-300/50 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-blue-400 focus:ring-blue-200 transition-colors duration-300 resize-y"
            ></textarea>
                       {" "}
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
                            Katıl            {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </form>
      ) : (
        <p className="text-center text-gray-400 mt-4 relative z-10">
                    Katılmak için          {" "}
          <Link to="/auth" className="text-purple-400 hover:underline">
                        giriş yapmalısınız          {" "}
          </Link>
                    .        {" "}
        </p>
      )}
           {" "}
      <div className="mt-8 relative z-10">
               {" "}
        <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-300 border-b border-gray-700 pb-3 mb-4 transition-colors duration-300">
                    Katılımcılar        {" "}
        </h4>
               {" "}
        <div className="space-y-4">
                   {" "}
          {commentTree.length > 0 ? (
            renderComments(commentTree)
          ) : (
            <p className="text-center text-gray-500 text-sm italic">
                            Henüz katılımcı yok.            {" "}
            </p>
          )}
                 {" "}
        </div>
               {" "}
        {user && (project.userId === user.id || user.username === "admin") && (
          <button
            onClick={() => handleClearParticipants(project.id)}
            className="w-full mt-6 py-3 text-sm text-red-300 border border-red-500/50 rounded-lg hover:bg-red-900/30 transition-colors duration-200 font-semibold"
          >
                        Katılımcıları Temizle          {" "}
          </button>
        )}
             {" "}
      </div>
           {" "}
      {isOwner && (
        <div className="flex gap-4 mt-6 relative z-10">
                   {" "}
          <button
            onClick={() => handleEdit(project.id)}
            className="flex-1 py-3 text-sm text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-md hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
                        Düzenle          {" "}
          </button>
                   {" "}
          <button
            onClick={() => handleDeleteProject(project.id)}
            className="flex-1 py-3 text-sm text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-lg shadow-md hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
                        Sil          {" "}
          </button>
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
};

export default ProjectCard;
