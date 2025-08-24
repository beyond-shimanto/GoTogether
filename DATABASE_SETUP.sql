CREATE TABLE user(
	username varchar(255) PRIMARY KEY,
	email varchar(255) NOT NULL UNIQUE,
	full_name varchar(255) NOT NULL,
	password_hash varchar(255) NOT NULL,
	registered_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	is_verified tinyint NOT NULL DEFAULT 0,
	is_under_review tinyint NOT NULL DEFAULT 0,
	date_of_birth date NOT NULL
);

CREATE TABLE route(
	id integer AUTO_INCREMENT PRIMARY KEY,
	route text NOT NULL
);


CREATE TABLE trip (
	id integer AUTO_INCREMENT,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	username varchar(255) NOT NULL,
	title varchar(255) NOT NULL,
	body text,
	tentative_route integer NOT NULL,
	tentative_time varchar(255) NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fk_trip_user
		FOREIGN KEY(username) REFERENCES user(username)
		ON DELETE CASCADE,
	CONSTRAINT fk_trip_route_id
		FOREIGN KEY(tentative_route) REFERENCES route(id)
		ON DELETE RESTRICT
	);


CREATE TABLE trip_reply(
	id integer AUTO_INCREMENT,
	parent_trip_id integer NOT NULL,
	username varchar(255) NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	title varchar(255) NOT NULL,
	body text,
	suggested_route integer,
	suggested_time varchar(255),
	PRIMARY KEY(id),
	CONSTRAINT fk_trip_reply_parent_trip
		FOREIGN KEY(parent_trip_id) REFERENCES trip(id)
		ON DELETE CASCADE,
	CONSTRAINT fk_trip_reply_user
		FOREIGN KEY(username) REFERENCES user(username)
		ON DELETE SET NULL,
	CONSTRAINT fk_trip_suggested_route_id
		FOREIGN KEY (suggested_route) REFERENCES route(id)
		ON DELETE RESTRICT
);

CREATE TABLE chat_enrollment(
	parent_trip_id integer NOT NULL,
	username varchar(255) NOT NULL,
	PRIMARY KEY(parent_trip_id, username),
	CONSTRAINT fk_chat_enrollment_trip
		FOREIGN KEY(parent_trip_id) REFERENCES trip(id)
		ON DELETE CASCADE,
	CONSTRAINT fk_chat_enrollment_user
		FOREIGN KEY(username) REFERENCES user(username)
		ON DELETE CASCADE

);

CREATE TABLE chat_text(
	id integer AUTO_INCREMENT,
	parent_trip_id integer NOT NULL,
	username varchar(255) NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	body text,
	PRIMARY KEY (id),
	CONSTRAINT fk_chat_text_trip
		FOREIGN KEY(parent_trip_id) REFERENCES trip(id)
		ON DELETE CASCADE,
	CONSTRAINT fk_chat_text_user
		FOREIGN KEY(username) REFERENCES user(username) 
		ON DELETE SET NULL
	
);


CREATE TABLE review (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id integer NOT NULL,
  reviewer_username VARCHAR(255) NULL,
  reviewee_username VARCHAR(255) NOT NULL,
  rating TINYINT NOT NULL,
  review text,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_trip
	FOREIGN KEY (trip_id) REFERENCES trip(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_review_reviewer
    FOREIGN KEY (reviewer_username) REFERENCES user(username)
    ON DELETE SET NULL,
  CONSTRAINT fk_review_reviewee
    FOREIGN KEY (reviewee_username) REFERENCES user(username)
    ON DELETE CASCADE,
	CHECK (rating BETWEEN 1 AND 5)
);

