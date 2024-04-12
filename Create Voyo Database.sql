DROP TABLE IF EXISTS typeRealEstate CASCADE;
CREATE TABLE typeRealEstate
(
    idTypeRealEstate SERIAL,
    label            VARCHAR(50),
    duration         TIME,
    PRIMARY KEY (idTypeRealEstate)
);

DROP TABLE IF EXISTS role CASCADE;
CREATE TABLE role
(
    idRole SERIAL,
    label  VARCHAR(50),
    PRIMARY KEY (idRole)
);

DROP TABLE IF EXISTS "user" CASCADE;
CREATE TABLE "user"
(
    phoneNumber       VARCHAR(13) NOT NULL,
    firstName         TEXT        NOT NULL,
    lastName          VARCHAR(50) NOT NULL,
    email             VARCHAR(50),
    password          TEXT        NOT NULL,
    passwordUpdatedAt TIMESTAMP
        CONSTRAINT passwordUpdatedAt DEFAULT CURRENT_TIMESTAMP,
    idRole            INTEGER     NOT NULL,
    biography         TEXT,
    profilePicture    TEXT,
    pricing           DECIMAL(10, 2),
    idAddressGMap     VARCHAR(200),
    radius            INTEGER,
    x                 DECIMAL(10, 8),
    y                 DECIMAL(11, 8),
    geom              GEOMETRY,
    status            VARCHAR(50) CHECK ( status IN ('VALIDATED', 'BANNED', 'PENDING_VALIDATION')),
    cniBack           VARCHAR,
    cniFront          VARCHAR,
    PRIMARY KEY (phoneNumber),
    FOREIGN KEY (idRole) REFERENCES Role (idRole)
);

DROP TABLE IF EXISTS availability CASCADE;
CREATE TABLE availability
(
    idAvailability SERIAL,
    phoneNumber    VARCHAR(13) NOT NULL,
    availability   TIMESTAMP,
    duration       TIME,
    repeat         VARCHAR(50) CHECK ( repeat IN ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', null)),
    PRIMARY KEY (idAvailability),
    FOREIGN KEY (phoneNumber) REFERENCES "user" (phoneNumber)
);

DROP TABLE IF EXISTS visit CASCADE;
CREATE TABLE visit
(
    idVisit             SERIAL,
    phoneNumberProspect VARCHAR(13),
    phoneNumberVisitor  VARCHAR(13),
    codeVerification    INT          NOT NULL,
    startTime           TIMESTAMP    NOT NULL,
    price               VARCHAR(50),
    status              VARCHAR(50) CHECK (status IN ('PENDING', 'ACCEPTED', 'REFUSED', 'CANCELED', 'DONE')),
    note                NUMERIC(8, 3) CHECK (note <= 5 AND note >= 0),
    idAddressGMap       VARCHAR(200) NOT NULL,
    idTypeRealEstate    INTEGER,
    x                   DECIMAL(10, 8),
    y                   DECIMAL(11, 8),
    PRIMARY KEY (idVisit),
    FOREIGN KEY (phoneNumberProspect) REFERENCES "user" (phoneNumber),
    FOREIGN KEY (phoneNumberVisitor) REFERENCES "user" (phoneNumber),
    FOREIGN KEY (idTypeRealEstate) REFERENCES typeRealEstate (idTypeRealEstate)
);

DROP TABLE IF EXISTS criteria CASCADE;
CREATE TABLE criteria
(
    idCriteria     SERIAL,
    criteria       VARCHAR(500),
    criteriaAnswer VARCHAR(500),
    photoRequired  BOOLEAN,
    photo          TEXT,
    videoRequired  BOOLEAN,
    video          TEXT,
    phoneNumber    VARCHAR(13),
    reusable       BOOLEAN,
    PRIMARY KEY (idCriteria),
    FOREIGN KEY (phoneNumber) REFERENCES "user" (phoneNumber)
);

DROP TABLE IF EXISTS linkCriteriaVisit CASCADE;
CREATE TABLE linkCriteriaVisit
(
    idCriteria INTEGER,
    idVisit    INTEGER,
    PRIMARY KEY (idCriteria, idVisit),
    FOREIGN KEY (idCriteria) REFERENCES criteria (idCriteria),
    FOREIGN KEY (idVisit) REFERENCES visit (idVisit)
);


-- Add the required data in the database

INSERT INTO typeRealEstate (idTypeRealEstate, label, duration)
VALUES (1, 'Studio, T1', '00:30:00'),
       (2, 'T2, T3, T4', '00:40:00'),
       (3, 'T5 et plus', '00:50:00'),
       (4, 'Maison', '01:00:00'),
       (5, 'Villa', '01:30:00');


INSERT INTO role (label)
VALUES ('VISITOR'),
       ('PROSPECT'),
       ('ADMIN'),
       ('BANNED'),
       ('PENDING_VALIDATION');

INSERT INTO "user" (phoneNumber, firstName, lastName, email, password, idRole, biography, profilePicture, status)
VALUES ('+33600000000', 'Admin', 'VOYO', 'admin@example.com', '$2a$10$n5oLi6In11LV3u8qhgRipugSOhSMXwVtXH/N74CxNUzGIYXlSh4sm', 3, 'I am the admin', 'https://www.hdwallpaper.nu/wp-content/uploads/2015/04/jesus_christ_the_lord-1448342.jpg', 'VALIDATED');