CREATE DATABASE IF NOT EXISTS blog_api CHARACTER SET utf8mb4;
USE blog_api;

CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nom        VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  titre      VARCHAR(255) NOT NULL,
  contenu    TEXT NOT NULL,
  publie     BOOLEAN DEFAULT FALSE,
  user_id    INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  texte      TEXT NOT NULL,
  user_id    INT NOT NULL,
  post_id    INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

INSERT INTO users (nom, email) VALUES ('Aziz', 'aziz@test.ma'), ('Sara', 'sara@test.ma');
INSERT INTO posts (titre, contenu, publie, user_id) VALUES
  ('Intro Node.js', 'Contenu Node.js', TRUE, 1),
  ('Express.js', 'Contenu Express', TRUE, 1),
  ('Brouillon', 'Pas publié', FALSE, 2);
INSERT INTO comments (texte, user_id, post_id) VALUES
  ('Super article !', 2, 1), ('Merci !', 1, 1);