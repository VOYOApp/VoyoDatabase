DROP TABLE IF EXISTS typeRealEstate CASCADE;
CREATE TABLE typeRealEstate
(
    idTypeRealEstate SERIAL,
    label            VARCHAR(50),
    duration         TIME,
    PRIMARY KEY (idTypeRealEstate)
);

DROP TABLE IF EXISTS realEstate CASCADE;
CREATE TABLE realEstate
(
    idRealEstate     SERIAL       NOT NULL,
    idAddressGMap    VARCHAR(200) NOT NULL,
    idTypeRealEstate INTEGER,
    PRIMARY KEY (idRealEstate),
    FOREIGN KEY (idTypeRealEstate) REFERENCES typeRealEstate (idTypeRealEstate)
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
    phoneNumber    VARCHAR(13) NOT NULL,
    firstName      TEXT        NOT NULL,
    lastName       VARCHAR(50) NOT NULL,
    email          VARCHAR(50),
    password       TEXT        NOT NULL,
    idRole         INTEGER     NOT NULL,
    biography      TEXT,
    profilePicture TEXT,
    pricing        DECIMAL(10, 2),
    idAddressGMap  VARCHAR(200),
    radius         BIGINT,
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
    repeat         VARCHAR(50) CHECK ( repeat IN ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')),
    PRIMARY KEY (idAvailability),
    FOREIGN KEY (phoneNumber) REFERENCES "user" (phoneNumber)
);

DROP TABLE IF EXISTS visit CASCADE;
CREATE TABLE visit
(
    idVisit             SERIAL,
    phoneNumberProspect VARCHAR(13),
    phoneNumberVisitor  VARCHAR(13),
    idRealEstate        INTEGER   NOT NULL,
    codeVerification    SMALLINT  NOT NULL,
    startTime           TIMESTAMP NOT NULL,
    price               VARCHAR(50),
    status              VARCHAR(50),
    note                NUMERIC(8, 3),
    PRIMARY KEY (idVisit),
    FOREIGN KEY (phoneNumberProspect) REFERENCES "user" (phoneNumber),
    FOREIGN KEY (phoneNumberVisitor) REFERENCES "user" (phoneNumber),
    FOREIGN KEY (idRealEstate) REFERENCES realEstate (idRealEstate)
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
