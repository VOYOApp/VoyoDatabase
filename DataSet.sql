
INSERT INTO typeRealEstate (idTypeRealEstate, label, duration)
VALUES (1, 'Studio, T1', '00:30:00'),
       (2, 'T2, T3, T4', '00:40:00'),
       (3, 'T5 et plus', '00:50:00'),
       (4, 'Maison', '01:00:00'),
       (5, 'Villa', '01:30:00');

INSERT INTO realEstate (idRealEstate, idAddressGMap, idTypeRealEstate)
VALUES (1, 'Adresse1', 1),
       (2, 'Adresse2', 2),
       (3, 'Adresse3', 3),
       (4, 'Adresse4', 4),
       (5, 'Adresse5', 5),
       (6, 'Adresse6', 1),
       (7, 'Adresse7', 2),
       (8, 'Adresse8', 3),
       (9, 'Adresse9', 4),
       (10, 'Adresse10', 5);

INSERT INTO role (idRole, label)
VALUES (1, 'VISITOR'),
       (2, 'PROSPECT'),
       (3, 'ADMIN');

INSERT INTO "user" (phoneNumber, firstName, lastName, email, idRole, idAddressGMap, radius, password)
VALUES ('1234567890', 'Jean', 'Doe', 'jdoe@example.com', 1, 'Adresse1', 1000, 'password'),
       ('0987654321', 'Marie', 'Doe', 'mdoe@example.com', 2, 'Adresse2', 1500, 'password'),
       ('5678901234', 'Jacques', 'Smith', 'jsmith@example.com', 3, 'Adresse3', 2000, 'password'),
       ('2468135790', 'Isabelle', 'Johnson', 'ijohnson@example.com', 1, 'Adresse4', 2500, 'password'),
       ('1357902468', 'Jacques', 'Brown', 'jbrown@example.com', 1, 'Adresse5', 3000, 'password'),
       ('2468901357', 'Isabelle', 'White', 'iwhite@example.com', 2, 'Adresse6', 3500, 'password'),
       ('8901243687', 'Jean', 'Brown', 'jbrown@example.com', 1, 'Adresse7', 4000, 'password'),
       ('8901357690', 'Marie', 'White', 'mwhite@example.com', 2, 'Adresse8', 4500, 'password'),
       ('9013576902', 'Jacques', 'Johnson', 'jjohnson@example.com', 2, 'Adresse9', 5000, 'password'),
       ('3576901234', 'Isabelle', 'Brown', 'ibrown@example.com', 1, 'Adresse10', 5500, 'password');

INSERT INTO availability (idAvailability, phoneNumber, availability, duration, repeat)
VALUES (1, '1234567890', '2022-01-01 10:00:00', '04:00:00', 'DAILY'),
       (2, '0987654321', '2022-01-15 14:00:00', '02:00:00', 'WEEKLY'),
       (3, '5678901234', '2022-02-01 17:00:00', '06:00:00', 'MONTHLY'),
       (4, '2468135790', '2022-02-15 21:00:00', '08:00:00', 'YEARLY'),
       (5, '1357902468', '2022-03-01 23:00:00', '10:00:00', 'DAILY'),
       (6, '2468901357', '2022-03-16 01:00:00', '12:00:00', 'WEEKLY'),
       (7, '8901243687', '2022-04-01 03:00:00', '14:00:00', 'MONTHLY'),
       (8, '8901357690', '2022-04-16 05:00:00', '16:00:00', 'YEARLY'),
       (9, '9013576902', '2022-05-01 07:00:00', '18:00:00', 'DAILY'),
       (10, '3576901234', '2022-05-16 09:00:00', '20:00:00', 'WEEKLY');

INSERT INTO visit (phoneNumberProspect, phoneNumberVisitor, idRealEstate, codeVerification, startTime, price, status,
                   note)
VALUES ('1234567890', '0987654321', 1, 123, '2022-01-01 12:00:00', '1200.50', 'Confirmée', 5),
       ('5678901234', '2468135790', 2, 456, '2022-01-15 18:00:00', '1500.25', 'Annulée',
        5),
       ('2468135790', '8901357690', 3, 789, '2022-02-01 20:00:00', '1700.75', 'En attente', 3),
       ('8901357690', '9013576902', 4, 098, '2022-03-01 22:00:00', '2100.00', 'En cours', 4.5),
       ('9013576902', '3576901234', 5, 567, '2022-04-01 00:00:00', '2900.25', 'Terminée', 1);