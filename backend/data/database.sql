
CREATE TABLE IF NOT EXISTS Document (

  id TEXT UNIQUE,

  user_id INTEGER,

  upload_date DATETIME,

  PRIMARY KEY (id),

  FOREIGN KEY (user_id) REFERENCES User(id)

);
CREATE TABLE IF NOT EXISTS Content (

  id TEXT UNIQUE,

  document_id TEXT,

  PRIMARY KEY (id),

  FOREIGN KEY (document_id) REFERENCES Document(id)

);
CREATE TABLE IF NOT EXISTS User (
	id	INTEGER UNIQUE,
	name	TEXT,
	email	TEXT UNIQUE,
	PRIMARY KEY(id AUTOINCREMENT)
);
