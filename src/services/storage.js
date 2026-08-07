const USERS_KEY = "cineverse_users";
const SESSION_KEY = "cineverse_session";

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const getCurrentUser = () => read(SESSION_KEY, null);

export const registerUser = ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = read(USERS_KEY, []);

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("Já existe uma conta cadastrada com este e-mail.");
  }

  const user = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, password };
  users.push(user);
  write(USERS_KEY, users);
  const session = { id: user.id, name: user.name, email: user.email };
  write(SESSION_KEY, session);
  return session;
};

export const loginUser = ({ email, password }) => {
  const user = read(USERS_KEY, []).find(
    (item) => item.email === email.trim().toLowerCase() && item.password === password
  );

  if (!user) throw new Error("E-mail ou senha inválidos.");
  const session = { id: user.id, name: user.name, email: user.email };
  write(SESSION_KEY, session);
  return session;
};

export const logoutUser = () => localStorage.removeItem(SESSION_KEY);

const userKey = (userId, suffix) => `cineverse_${suffix}_${userId}`;

export const getFavorites = (userId) => read(userKey(userId, "favorites"), []);

export const toggleFavorite = (userId, movie) => {
  const favorites = getFavorites(userId);
  const exists = favorites.some((item) => item.id === movie.id);
  const next = exists
    ? favorites.filter((item) => item.id !== movie.id)
    : [{ id: movie.id, title: movie.title, poster_path: movie.poster_path, release_date: movie.release_date, vote_average: movie.vote_average }, ...favorites];
  write(userKey(userId, "favorites"), next);
  return next;
};

export const getComments = (movieId) => read(`cineverse_comments_${movieId}`, []);

export const addComment = (movieId, user, text) => {
  const comments = getComments(movieId);
  const comment = { id: crypto.randomUUID(), author: user.name, text: text.trim(), createdAt: new Date().toISOString() };
  const next = [comment, ...comments];
  write(`cineverse_comments_${movieId}`, next);
  return next;
};
