
INSERT INTO typeRealEstate (idTypeRealEstate, label, duration)
VALUES (1, 'Studio, T1', '00:30:00'),
       (2, 'T2, T3, T4', '00:40:00'),
       (3, 'T5 et plus', '00:50:00'),
       (4, 'Maison', '01:00:00'),
       (5, 'Villa', '01:30:00');


INSERT INTO role (idRole, label)
VALUES (1, 'VISITOR'),
       (2, 'PROSPECT'),
       (3, 'ADMIN');


-- INSERT INTO realEstate (idRealEstate, idAddressGMap, idTypeRealEstate)
-- VALUES (1, 'Adresse1', 1),
--        (2, 'Adresse2', 2),
--        (3, 'Adresse3', 3),
--        (4, 'Adresse4', 4),
--        (5, 'Adresse5', 5),
--        (6, 'Adresse6', 1),
--        (7, 'Adresse7', 2),
--        (8, 'Adresse8', 3),
--        (9, 'Adresse9', 4),
--        (10, 'Adresse10', 5);



-- INSERT INTO visit (phoneNumberProspect, phoneNumberVisitor, idRealEstate, codeVerification, startTime, price, status,
--                    note)
-- VALUES ('1234567890', '0987654321', 1, 123, '2022-01-01 12:00:00', '1200.50', 'Confirmée', 5),
--        ('5678901234', '2468135790', 2, 456, '2022-01-15 18:00:00', '1500.25', 'Annulée',
--         5),
--        ('2468135790', '8901357690', 3, 789, '2022-02-01 20:00:00', '1700.75', 'En attente', 3),
--        ('8901357690', '9013576902', 4, 098, '2022-03-01 22:00:00', '2100.00', 'En cours', 4.5),
--        ('9013576902', '3576901234', 5, 567, '2022-04-01 00:00:00', '2900.25', 'Terminée', 1);