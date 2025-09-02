// avatarUtils.js

const getInitial = (str) => {
  return str ? str.charAt(0).toUpperCase() : "";
};

export const generateAvatarUrl = (name, surname) => {
  const nameInitial = getInitial(name);
  const surnameInitial = getInitial(surname);
  const initials = `${nameInitial}${surnameInitial}`.trim();
  const avatarText = encodeURIComponent(initials || "?");

  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const seed = `${name}-${surname}`;
  const colorIndex = Math.abs(hashCode(seed)) % 5;
  const colors = ["50C878", "ADD8E6", "FFD700", "FF6347", "9370DB"];
  const avatarColor = colors[colorIndex];

  return `https://ui-avatars.com/api/?background=${avatarColor}&color=fff&name=${avatarText}&size=128&bold=true`;
};
