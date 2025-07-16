DROP DATABASE IF EXISTS imusa;

CREATE DATABASE imusa;

USE imusa;

CREATE TABLE especie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

INSERT INTO especie (id, nombre)
VALUES (1, 'Canino'), (2, 'Felino');

CREATE TABLE servicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

INSERT INTO servicio (nombre)
VALUES ('Esterilización');

CREATE TABLE insumo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tope_max INT NULL,
    tope_min INT NULL
);

INSERT INTO insumo (nombre)
VALUES
    ('Acepromacina'),
    ('Triancinolona'),
    ('Atropina'),
    ('Dexametasona'),
    ('Diazepan'),
    ('Antibiotico'),
    ('Doxapram'),
    ('Coagulante'),
    ('Ivermectina'),
    ('Complejo Vit. B'),
    ('Mezcla (keta-Diazep.) 2+1'),
    ('Dipirona'),
    ('Ketamina');

CREATE TABLE domicilio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calle VARCHAR(255) NOT NULL,
    codigo_calle INT NULL,
    altura INT NOT NULL,
    bis TINYINT (1) NOT NULL,
    letra CHAR(1) NULL,
    piso INT NULL,
    depto VARCHAR(10) NULL,
    monoblock INT NULL,
    barrio VARCHAR(255) NULL,
    vecinal VARCHAR(255) NULL,
    distrito VARCHAR(255) NULL,
    seccional_policial VARCHAR(255) NULL,
    localidad VARCHAR(255) NOT NULL,
    lineas_tup VARCHAR(500) NULL,
    coordenada_x VARCHAR(255) NULL,
    coordenada_y VARCHAR(255) NULL,
    fraccion_censal VARCHAR(255) NULL,
    radio_censal VARCHAR(255) NULL
);

INSERT INTO domicilio 
VALUES 
    (1,'CANDIA DOMINGO',5200,3040,0,NULL,NULL,NULL,NULL,'LA CERAMICA Y CUYO','Nuevo Alberdi Oeste','NORTE','Sub-comisaría 2','Rosario','102 Roja,107 Negra,107 Roja,153 Negra','5432003.114553048','6361745.114058092','03','0303'),
    (2,'MENA JUAN DE DIOS',67300,2200,0,NULL,NULL,NULL,NULL,'JOSE IGNACIO RUCCI','Barrio Rucci','NORTE','Sub-comisaría 23','Rosario','102 144 Negra,107 Negra,107 Roja,142 Roja,153 Negra','5433384.503594498','6361437.26126222','06','0602'),
    (3,'BRAILLE LUIS',31700,1205,0,NULL,NULL,NULL,NULL,'ALBERDI','La Florida','NORTE','Sub-comisaría 27','Rosario','102 144 Negra,153 Negra,153 Roja','5434439.89262797','6361959.681066714','04','0411'),
    (4,'CASAS CASIANO',37200,970,0,NULL,NULL,NULL,NULL,'SARMIENTO','Barrio Parque Casas','NORTE','Comisaría 10','Rosario','102 Roja,103 Roja,106 Ibarlucea,106 Municipal','5434885.266758','6359343.93953746','07','0709'),
    (5,'JUSTO JUAN B',60000,2083,0,NULL,NULL,NULL,NULL,'LISANDRO DE LA TORRE','Arroyito Oeste','NORTE','Sub-comisaría  24','Rosario','102 Roja,106 Ibarlucea,106 Municipal,110,129','5435125.946833984','6358490.47174003','08','0807'),
    (6,'SUINDA',13550,980,0,NULL,NULL,NULL,NULL,'ANTARTIDA ARGENTINA','Fisherton Sur','NOROESTE','Sub-comisaría 22','Rosario','116,142 Negra','5428921.500327924','6355548.03149602','32','8401'),
    (7,'INGENIEROS JOSE',58450,8590,0,NULL,NULL,NULL,NULL,'FISHERTON','Fisherton Norte','NOROESTE','Comisaría 17','Rosario','110,146 Negra','5429949.645962692','6358074.317947906','11','8211'),
    (8,'FRAGA CNEL. ROSENDO MARIA',51500,1093,1,NULL,NULL,NULL,NULL,'LARREA Y EMPALME GRANEROS','Empalme Graneros','NOROESTE','Comisaría 20','Rosario','110,141','5433420.892068608','6358306.69340829','10','1008'),
    (9,'HUMBERTO PRIMERO',57750,2033,0,NULL,NULL,NULL,NULL,'LUDUEÑA SUR Y NORTE','Ludueña Norte y Moreno','NOROESTE','Comisar¡a 12','Rosario','112 Roja','5435296.576513122','6356761.969584652','12','1217'),
    (10,'AGNETA TTE. ALFREDO',21100,1439,0,NULL,NULL,NULL,NULL,'AZCUENAGA','Azcuénaga','NOROESTE','Comisaría 14','Rosario',NULL,'5434587.781119116','6355140.737219792','30','8305'),
    (11,'COCHABAMBA',41000,5103,0,NULL,NULL,NULL,NULL,'URQUIZA','Azcuénaga Sur','OESTE','Comisaría 14','Rosario','120,153 Negra,153 Roja','5435153.707995838','6354614.890411678','30','3003'),
    (12,'ROUILLON ALFREDO',84250,2095,0,NULL,NULL,NULL,NULL,'URQUIZA','Azcuénaga Sur','OESTE','Comisaría 14','Rosario','121','5434399.109183386','6354220.169280446','30','3010'),
    (13,'FRAGA CNEL. ROSENDO MARIA',51500,2308,0,NULL,NULL,NULL,NULL,'URQUIZA','Juan Pablo II','OESTE','Comisaría 14','Rosario','101 Negra,120,121,122 Roja,145 133 Cabin 9,145 133 Soldini','5433635.745958276','6353899.173668034','30','3009'),
    (14,'OCAMPO',72400,5779,0,NULL,NULL,NULL,NULL,'URQUIZA','Villa Urquiza Oeste','OESTE','Comisaría 19','Rosario','121,123','5434426.022933534','6353671.37382908','33','3306'),
    (15,'RIVAROLA DR. RODOLFO',82900,7501,0,NULL,NULL,NULL,NULL,'GODOY','Rodolfo Rivarola','OESTE','Comisaría 32','Rosario','123,145 133 Cabin 9,145 133 Soldini','5432542.761376798','6352733.169783238','33','3316'),
    (16,'SEGUI JUAN FRANCISCO',87850,5305,0,NULL,NULL,NULL,NULL,'TRIANGULO Y MODERNO','Julio A. Roca','OESTE','Comisaría 19','Rosario','110,122 Verde,133 125 Negra,133 125 Verde','5435042.295778424','6352241.627364214','49','4904'),
    (17,'SEGUI JUAN FRANCISCO',87850,6550,0,NULL,NULL,NULL,NULL,'TRIANGULO Y MODERNO','Unión y Progreso','OESTE','Comisaría 19','Rosario','122 Verde,133 125 Negra,133 125 Verde','5433633.82480754','6352239.386433526','49','8610'),
    (18,'1739',16185,7691,0,NULL,NULL,NULL,NULL,'GODOY','Belgrano Sur','OESTE','Sub-comisaría 22','Rosario','153 Negra,Enlace Barrio Santa Lucia','5432071.41151111','6353919.469233154','32','8414'),
    (19,'CASTELLANOS AARON',37650,3935,0,NULL,NULL,NULL,NULL,'ALVEAR','17 de Noviembre','SUDOESTE','Comisaría 18','Rosario','110,126 Negra,126 Roja,128 Negra','5436051.83527585','6351635.231946682','47','4706'),
    (20,'LAMADRID GREGORIO ARAOZ D',60800,3307,0,NULL,NULL,NULL,NULL,'MERCEDES DE SAN MARTIN','Barrio Plata','SUDOESTE','Comisaría 18','Rosario','112 Negra,112 Roja','5436366.111908426','6349216.300773694','48','4808'),
    (21,'BOLONIA',31200,5350,0,NULL,NULL,NULL,NULL,'MERCEDES DE SAN MARTIN','Parque Sur','SUDOESTE','Comisaría 21','Rosario','135','5437510.104769904','6349008.199183374','50','8715'),
    (22,'CABRINI MADRE',33200,2717,0,'A',NULL,NULL,NULL,'MERCEDES DE SAN MARTIN','San Francisco Solano','SUDOESTE','Comisaría 21','Rosario','134,145 133 Cabin 9,145 133 Soldini,Ronda CUR Sur','5437259.748986502','6348373.106248294','50','5012'),
    (23,'PIEDRAS',77950,1469,0,NULL,NULL,NULL,NULL,'MERCEDES DE SAN MARTIN','San Martin A','SUDOESTE','Sub-comisaría 20','Rosario','143 136 137 Negra','5438878.391689356','6348226.46335587','50','5006'),
    (24,'FLOR DE NACAR',50750,6983,0,NULL,NULL,NULL,NULL,'LAS FLORES','Ntra. Señora de Itatí','SUDOESTE','Sub-comisaría 19','Rosario','140','5438299.422365828','6346973.404446662','52','5205'),
    (25,'PUNTA DEL INDIO',80400,7660,0,NULL,NULL,NULL,NULL,'MERCEDES DE SAN MARTIN','Sgto. Cabral y Pte Gallego','SUDOESTE','Comisaría 33','Rosario','131','5435775.264281902','6345983.93236671','48','4821'),
    (26,'GARIBALDI JOSE',53200,2502,0,NULL,NULL,NULL,NULL,'MATHEU','Villa 57 y 58','SUDOESTE','Comisaría 15','Rosario',NULL,'5437617.351266506','6350975.44262581','46','4615'),
    (27,'AYOLAS JUAN DE',27500,270,0,NULL,NULL,NULL,NULL,'GENERAL JOSE DE SAN MARTIN','Avrose','SUR','Comisaría 16','Rosario','107 Roja,122 Roja,122 Verde,145 133 Cabin 9,145 133 Soldini','5440720.59420291','6351399.535167606','41','4107'),
    (28,'CORRIENTES',43250,3880,0,NULL,NULL,NULL,NULL,'MATHEU','Domingo Matheu','SUR','Comisaría 15','Rosario','107 Negra,134,135,141','5439098.105657906','6351078.885023272','45','4502'),
    (29,'MARGIS JOSE',65730,5115,0,NULL,NULL,NULL,NULL,'TIRO SUIZO','Tiro Suizo','SUR','Comisaría 15','Rosario','138 139','5438535.021397356','6349312.682483642','51','5108'),
    (30,'SANCHEZ DE THOMPSON MARIQUITA',86050,9,1,NULL,NULL,NULL,NULL,'GENERAL LAS HERAS','Las Heras','SUR','Comisaría 11','Rosario','102 144 Negra,106 Ibarlucea,106 Municipal,107 Negra,107 Roja,113,122 Roja,122 Verde,146 Negra,146 Roja','5441158.163518718','6349851.915022432','53','5317'),
    (31,'AYACUCHO BATALLA DE',27350,6300,0,NULL,NULL,NULL,NULL,'ROQUE SAENZ PEÑA','Parque Regional Sur','SUR','Comisaría 11','Rosario','103 Negra,143 136 137 Negra','5440614.523672626','6347979.256004316','55','5515'),
    (32,'ROSA JOSE MARIA',93952,923,1,NULL,NULL,NULL,NULL,'FISHERTON','Vecinal Amiga','NOROESTE','Comisaría 17','Rosario','146 Negra,146 Roja','5432226.95451325','6358016.978757288','11','8213'),
    (33,'AVELLANEDA NICOLAS',27300,6900,0,NULL,NULL,NULL,NULL,'MERCEDES DE SAN MARTIN','Tío Rolo','SUDOESTE','Comisaría 33','Rosario','132','5435588.249303396','6346933.34573768','48','4821'),
    (34,'CASTELLANOS AARON',37650,3498,0,NULL,NULL,NULL,NULL,'BELLA VISTA','17 de Noviembre','SUDOESTE','Comisaría 18','Rosario','110,128 Negra','5436137.703726634','6352208.580141604','47','8516'),
    (35,'AVELLANEDA NICOLAS',27300,5625,0,NULL,NULL,NULL,NULL,'MERCEDES DE SAN MARTIN','Barrio Hume','SUDOESTE','Comisaría 33','Rosario','112 Negra,112 Roja','5435643.278089898','6348622.179160394','48','4811'),
    (36,'KHANTUTA',60200,1832,0,NULL,NULL,NULL,NULL,'17 DE AGOSTO','17 de Agosto','SUDOESTE','Sub-comisaría 19','Rosario','143 136 137 Negra','5438364.638107432','6347681.6655711','52','5202'),
    (37,'MANGRULLO EL',65100,5150,0,NULL,NULL,NULL,NULL,'SALADILLO SUR','Saladillo Sudeste','SUR','Comisaría 11','Rosario','142 Negra,142 Roja','5442530.894574324','6349255.32150482','54','5407'),
    (38,'TAREGUEC',90380,4320,0,NULL,NULL,NULL,NULL,'TRIANGULO Y MODERNO','Cacique Pedro Martínez','OESTE','Comisaría 19','Rosario','110,Enlace Avellaneda','5434432.619900852','6351216.49352729','49','4912'),
    (39,'TAREGUEC',90380,4355,0,NULL,NULL,NULL,NULL,'TRIANGULO Y MODERNO','Cacique Pedro Martínez','OESTE','Comisaría 19','Rosario','110,Enlace Avellaneda','5434464.57212868','6351167.290248972','49','4914'),
    (40,'DELIOT V',45900,5323,0,NULL,NULL,NULL,NULL,'TRIANGULO Y MODERNO','Julio A. Roca','OESTE','Comisaría 19','Rosario','122 Verde','5435039.307323186','6351761.69970598','49','4906'),
    (41,'SALVAT',85200,2421,0,NULL,NULL,NULL,NULL,'OLIMPICO','Sin Vecinal','NORTE','Sub-comisaría 23','Rosario','102 144 Negra','5433005.844949366','6361926.718186408','04','0421'),
    (42,'ECUADOR',47650,645,1,NULL,NULL,NULL,NULL,'LARREA Y EMPALME GRANEROS','20 de Junio','NOROESTE','Comisaría 20','Rosario','101 Negra,141,146 Negra,146 Roja','5433030.261874804','6357728.671582778','11','1105'),
    (43,'CISNERO MARIO ANTONIO',16800,5100,0,NULL,NULL,NULL,NULL,'TRIANGULO Y MODERNO','Julio A. Roca','OESTE','Comisaría 19','Rosario','Enlace Avellaneda','5435311.199105558','6351413.361635308','49','4913'),
    (44,'SAN LUIS',85750,2020,0,NULL,NULL,NULL,NULL,'CENTRO','Dr. Ernesto Sábato','CENTRO','Comisaría 2','Rosario','102 144 Negra,102 Roja,115,115 Aeropuerto,123,126 Negra,126 Roja,127,130,133 125 Negra,133 125 Verde,138 139,141,142 Negra,142 Roja,145 133 Cabin 9,145 133 Soldini,146 Negra,146 Roja,K','5439081.847419366','6354948.336701104','27','2709'),
    (45,'PELLEGRINI CARLOS',76650,3205,0,NULL,NULL,NULL,NULL,'CINCO ESQUINAS','Pellegrini','OESTE','Comisaría 13','Rosario','113,123,126 Negra,126 Roja,127,133 125 Negra,133 125 Verde,153 Negra,153 Roja','5437370.868869522','6354305.987419612','34','3409'),
    (46,'VIRASORO GRAL. BENJAMIN',95600,1855,0,NULL,NULL,NULL,NULL,'ESPAÑA Y HOSPITALES','Acera','CENTRO','Comisaría 5','Rosario','110,112 Negra,112 Roja,113,116,129,130,131,132','5438806.27829667','6352559.2599691','38','3813'),
    (47,'PUCCIO JOSE N',80050,575,0,NULL,NULL,NULL,NULL,'ALBERDI','Alberdi','NORTE','Comisaría 10','Rosario','102 144 Negra,103 Negra,107 Negra,107 Roja,143 136 137 Negra,153 Negra,153 Roja','5435384.948614178','6360694.005886088','05','0510'),
    (48,'LAPRIDA FRANCISCO NARCISO',61150,5381,0,NULL,NULL,NULL,NULL,'ROQUE SAENZ PEÑA','Saladillo Sud','SUR','Comisaría 11','Rosario','103 Negra,103 Roja,135,138 139,140,142 Negra,142 Roja,Ronda CUR Sur','5439539.87940466','6349076.33008973','54','5413'),
    (49,'AVELLANEDA NICOLAS',27300,1402,0,NULL,NULL,NULL,NULL,'ECHESORTU','La República','CENTRO','Comisaría 6','Rosario','121,128 Negra,140','5436293.597202092','6354938.720256824','81','8115'),
    (50,'OCAMPO',72400,1498,0,NULL,NULL,NULL,NULL,'DEL ABASTO','Solidaridad Social','CENTRO','Comisaría 5','Rosario','103 Negra,103 Roja,107 Negra,107 Roja,110,129,131,132,134,135','5439361.914897732','6352874.308771808','38','3805'),
    (51,'CORDOBA',43000,3650,0,NULL,NULL,NULL,NULL,'LUIS AGOTE','Sin Vecinal','CENTRO','Comisaría 6','Rosario','101 Negra,107 Negra,107 Roja,113,115,115 Aeropuerto,116,120,121,122 Roja,122 Verde,128 Negra,128 Roja,133 125 Negra,133 125 Verde,138 139,141,142 Negra,142 Roja,143 136 137 Negra,143 136 137 Roja,146 Negra,146 Roja,Linea de la Costa','5437060.521443062','6355667.397072268','80','8001'),
    (52,'ITALIA',59050,2941,0,NULL,NULL,NULL,NULL,'ESPAÑA Y HOSPITALES','Acera','CENTRO','Comisaría 5','Rosario','110,112 Negra,112 Roja,113,116,129,130,131,132','5438857.44368226','6352377.218597404','38','3814'),
    (53,'FUNES DEAN GREGORIO',52150,1350,0,NULL,NULL,NULL,NULL,'ESPAÑA Y HOSPITALES','Acera','SUR','Comisaría 15','Rosario','107 Negra,107 Roja,128 Negra,128 Roja,129,134,135,141','5439333.608039154','6351817.549122442','44','4407'),
    (54,'CAFFERATA JUAN MANUEL',33550,1477,0,NULL,NULL,NULL,NULL,'ECHESORTU','Sin Vecinal','CENTRO','Comisaría 6','Rosario','113,120,122 Roja,122 Verde,128 Roja,140','5437079.652968304','6354685.005921676','80','8017'),
    (55,'RIOJA',82650,814,0,NULL,NULL,NULL,NULL,'CENTRO','Monumento a la Bandera','CENTRO','Comisaría 1','Rosario','101 Negra,102 Roja,106 Ibarlucea,106 Municipal,110,112 Negra,112 Roja,115,115 Aeropuerto,116,121,122 Roja,122 Verde,126 Negra,126 Roja,127,128 Negra,128 Roja,130,131,132,138 139,140,142 Negra,142 Roja,143 136 137 Negra,143 136 137 Roja,145 133 Cabin 9,145 133 Soldini,146 Negra,146 Roja','5440680.337347484','6354763.51542913','22','2202'),
    (56,'RIOBAMBA',82600,2970,0,NULL,NULL,NULL,NULL,'CENTRO','Barrio Parque','CENTRO','Comisaría 5','Rosario','113,126 Negra,126 Roja,127,133 125 Negra,133 125 Verde','5437551.854452352','6353644.552463348','36','3602'),
    (57,'ESPAÑA',48450,2898,0,NULL,NULL,NULL,NULL,'ESPAÑA Y HOSPITALES','Acera','CENTRO','Comisaría 5','Rosario','110,112 Negra,112 Roja,113,116,129,130,131,132','5438969.186348738','6352421.728818798','38','3813'),
    (58,'PARANA',75000,1346,0,NULL,NULL,NULL,NULL,'ECHESORTU','Azcuénaga','NOROESTE','Comisaría 6','Rosario','138 139,140,142 Negra,142 Roja,145 133 Cabin 9,145 133 Soldini,K','5435232.581251632','6355233.326638974','81','8118'),
    (59,'FRANCIA',51650,1940,0,NULL,NULL,NULL,NULL,'CENTRO','Pellegrini','OESTE','Comisaría 13','Rosario','113,126 Negra,126 Roja,127,133 125 Negra,133 125 Verde','5437429.366418114','6354008.763397076','34','3409'),
    (60,'PASO JUAN JOSE',75550,5490,0,NULL,NULL,NULL,NULL,'LARREA Y EMPALME GRANEROS','Empalme Graneros','NOROESTE','Comisaría 20','Rosario','101 Negra,129,146 Negra,146 Roja','5434636.97298217','6357910.91715408','10','1014'),
    (61,'TALAMPAYA',8150,1940,1,NULL,NULL,NULL,NULL,'LARREA Y EMPALME GRANEROS','Hostal del Sol','NOROESTE','Sub-comisaría  21','Rosario',NULL,'5431125.203302916','6359611.550845522','11','8201'),
    (62,'TUCUMAN',92300,5650,0,NULL,NULL,NULL,NULL,'LUDUEÑA SUR Y NORTE','Ludueña Sur','NOROESTE','Comisar¡a 12','Rosario','141','5434453.392792388','6356532.573890266','13','1304'),
    (63,'PROVINCIAS UNIDAS',79900,150,1,NULL,NULL,NULL,NULL,'LARREA Y EMPALME GRANEROS','Ludueña Norte y Moreno','NOROESTE','Comisar¡a 12','Rosario','101 Negra,112 Negra,112 Roja,141','5433320.158413664','6356946.530327072','12','1210'),
    (64,'HUMBERTO PRIMERO',57750,2401,0,NULL,NULL,NULL,NULL,'LUDUEÑA SUR Y NORTE','Ludueña Norte y Moreno','NOROESTE',NULL,'Rosario',NULL,'5434865.76','6356744.02','12','1218'),
    (65,'SUINDA',13550,850,0,NULL,NULL,NULL,NULL,'ANTARTIDA ARGENTINA','Fisherton Sur','NOROESTE','Sub-comisaría 22','Rosario','116,142 Negra','5428916.04471775','6355706.025149984','32','8401'),
    (66,'GENOVA',53450,6113,0,NULL,NULL,NULL,NULL,'LARREA Y EMPALME GRANEROS','Empalme Graneros','NOROESTE','Comisaría 20','Rosario','110,129','5433908.493345232','6358318.16673988','10','1008'),
    (67,'ZUVIRIA',97500,6520,0,NULL,NULL,NULL,NULL,'BELGRANO','Barrio Belgrano','NOROESTE','Comisaría 14','Rosario','101 Negra','5433540.63865261','6356009.75810323','31','3103'),
    (68,'NICARAGUA',71500,1098,0,NULL,NULL,NULL,NULL,'BELGRANO','Barrio Belgrano','NOROESTE','Sub-comisaría 22','Rosario','142 Negra,142 Roja,153 Roja,K','5432586.446549338','6355609.819429658','32','3202'),
    (69,'DERQUI SANTIAGO',46050,7602,0,NULL,NULL,NULL,NULL,'ANTARTIDA ARGENTINA','María Duboe','NOROESTE','Sub-comisaría 22','Rosario','116,142 Roja','5432165.343378526','6355835.826010344','32','8409'),
    (70,'O HIGGINS GRAL. BERNARDO',72200,8959,0,NULL,NULL,NULL,NULL,'ANTARTIDA ARGENTINA','Fisherton R','NOROESTE','Comisaría 17','Rosario','133 125 Negra','5429064.051330734','6357038.62362288','11','1110'),
    (71,'MARADONA JOSE IGNACIO',65450,953,1,NULL,NULL,NULL,NULL,'FISHERTON','Stella Maris y Santa Rosa','NOROESTE','Comisaría 17','Rosario','110,146 Negra','5429714.835778028','6357992.242155828','11','8215'),
    (72,'AYALA GAUNA VELMIRO',27400,7951,0,NULL,NULL,NULL,NULL,'LARREA Y EMPALME GRANEROS','7 de Septiembre','NOROESTE','Sub-comisaría  21','Rosario','110,112 Negra,112 Roja,115,115 Aeropuerto,142 Roja,146 Negra,146 Roja','5431325.85434631','6358668.968476792','11','8208'),
    (73,'SORRENTO',88950,1293,0,NULL,NULL,NULL,NULL,'SARMIENTO','Barrio Parque Casas','NORTE','Comisaría 10','Rosario','102 Roja,103 Roja,106 Ibarlucea,106 Municipal','5434845.523212156','6359260.071813904','07','0709'),
    (74,'AGRELO DR. PEDRO JOSE',21150,2298,0,NULL,NULL,NULL,NULL,'ALBERDI','Alberdi','NORTE','Comisaría 10','Rosario','102 144 Negra,103 Negra,107 Negra,107 Roja,143 136 137 Negra,153 Negra,153 Roja','5435275.780377884','6361062.960788296','05','0507'),
    (75,'LARRECHEA PEDRO T DE',61350,775,0,NULL,NULL,NULL,NULL,'ALBERDI','Alberdi','NORTE','Comisaría 10','Rosario','102 144 Negra,103 Negra,107 Negra,107 Roja,143 136 137 Negra,153 Negra,153 Roja','5435165.633976332','6360457.050120472','05','0512'),
    (76,'DARREGUEIRA JOSE',45250,950,0,NULL,NULL,NULL,NULL,'SARMIENTO','Sarmiento','NORTE','Comisaría 10','Rosario','102 144 Negra,102 Roja,103 Negra,103 Roja,106 Ibarlucea,106 Municipal,107 Negra,107 Roja,143 136 137 Negra,143 136 137 Roja','5435320.096903424','6359414.101012166','07','0710'),
    (77,'TUELLA PEDRO',92350,952,1,NULL,NULL,NULL,NULL,'LISANDRO DE LA TORRE','Lisandro de la Torre','NORTE','Comisaría 9','Rosario','110,113,129,153 Negra,153 Roja,Linea de la Costa','5437102.053364454','6358327.204088542','09','0902'),
    (78,'BLANQUI ANDRES',30750,2120,0,NULL,NULL,NULL,NULL,'PARQUE FIELD','Barrio Parque Field','NORTE','Sub-comisaría 23','Rosario','102 144 Negra,153 Negra','5433640.634087266','6361067.552843998','06','0610'),
    (79,'BOEDO MARIANO',30900,2330,0,NULL,NULL,NULL,NULL,'PARQUE FIELD','Barrio Parque Field','NORTE','Comisaría 30','Rosario','102 Roja,107 Negra,107 Roja','5433915.66331635','6360823.20165985','06','0604');

CREATE TABLE tipo_efector (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

INSERT INTO tipo_efector (nombre)
VALUES
    ('Centro de Salud'),
    ('Hospital'),
    ('Centro Cultural'),
    ('Institución Deportiva y Social'),
    ('Veterinaria'),
    ('Vecinal'),
    ('Distrito'),
    ('Escuela'),
    ('Biblioteca');

CREATE TABLE efector (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    id_domicilio INT NOT NULL,
    id_tipo_efector INT NOT NULL,
    unidad_movil TINYINT (1) NOT NULL,
    FOREIGN KEY (id_domicilio) REFERENCES domicilio (id),
    FOREIGN KEY (id_tipo_efector) REFERENCES tipo_efector (id)
);

INSERT INTO
    efector (
        nombre,
        id_domicilio,
        id_tipo_efector,
        unidad_movil
    )
VALUES
    ('CS Alicia Moreau de Justo',1,1,1),
    ('CS 1º de Mayo',2,1,1),
    ('Vec. La Florida',3,1,1),
    ('CS Casiano Casas',4,1,1),
    ('CS Juan B. Justo',5,1,1),
    ('José Ugarte',6,1,1),
    ('Ceferino Namuncurá',7,1,1),
    ('Juana Azurduy',8,1,1),
    ('Roque Coulin',9,1,1),
    ('Jean Henry Dunant',10,1,1),
    ('Dr. Esteban Maradona',11,1,1),
    ('Eva Duarte',12,1,1),
    ('Vec. Juan Pablo II',13,6,1),
    ('Vec. Villa Urquiza',14,6,1),
    ('Sta. María Josefa Rossello',15,1,1),
    ('Mauricio Casals',16,1,1),
    ('Luchemos por la Vida',17,1,1),
    ('Santa Lucía',18,1,1),
    ('San Marcelino Champagnat',19,1,1),
    ('C.S. Barrio Plata',20,1,1),
    ('Vec. Parque Sur',21,6,0),
    ('Elena Bazet',22,1,1),
    ('Vec. San Martín A',23,6,1),
    ('Las Flores',24,1,1),
    ('San Vicente de Paul',25,1,1),
    ('Itati',26,1,1),
    ('Luis Pasteur',27,1,0),
    ('Vec. Domingo Matheu',28,6,1),
    ('20 de Junio',29,1,1),
    ('Rubén Naranjo',30,1,1),
    ('Sur',31,1,1),
    ('Dr Julio Maiztegui',32,1,1),
    ('Tío Rolo',33,1,1),
    ('Mazza',34,1,1),
    ('El Gaucho',35,1,1),
    ('Pocho Lepratti',36,1,1),
    ('El Mangrullo',37,1,1),
    ('Toba',38,1,1),
    ('Anexo del Toba',39,1,1),
    ('Vecinal Julio A Roca',40,6,1),
    ('Ena Richiger',41,1,1),
    ('Vecinal Angel Invaldi',42,6,1),
    ('Hermes Binner',43,1,1),
    ('CEMAR',44,2,1),
    ('HECA',45,2,1),
    ('Vilela',46,2,1),
    ('Hospital Alberdi',47,2,1),
    ('Hospital Roque Sáenz Peña',48,2,1),
    ('Hospital Carrasco',49,2,1),
    ('ILAR',50,2,1),
    ('Maternidad Martin',44,2,1),
    ('Casa LGBTIQ+',51,3,1),
    ('Club Atlético Belgrano',52,4,1),
    ('Club Hilarión',53,4,1),
    ('Club Social y Deportivo Cóndor',54,4,1),
    ('Compañía de Perros y Gatos',55,5,1),
    ('Club Social y Deportivo Nueva Aurora',56,4,1),
    ('Vecinal Acera',57,6,1),
    ('Vecinal La República',58,6,1),
    ('IMUSA',59,5,0),
    ('Anexo Vecinal Empalme',60,6,1),
    ('Vecinal Hostal del Sol',61,6,1),
    ('Club Atlético Tucumán',62,4,1),
    ('Distrito Noroeste',63,7,0),
    ('Escuela N° 1027',64,8,1),
    ('Estadio Mundialista de Hockey \"Luciana Aymar\"',65,4,1),
    ('Móvil Biblioteca Empalme Norte',66,9,1),
    ('Vecinal Belgrano',67,6,1),
    ('Vecinal Bicentenario',68,6,1),
    ('Vecinal María Duboe',69,6,1),
    ('Vecinal Fisherton R',70,6,1),
    ('Vecinal Stella Maris',71,6,1),
    ('Vecinal 7 de Septiembre',72,6,0),
    ('Vecinal Parque Casas',73,6,1),
    ('Club Atlético Sportivo Federal',74,4,1),
    ('Club Leña y Leña',75,4,1),
    ('Maciel Bochín Club',76,4,1),
    ('Club Náutico Sportivo Avellaneda',77,4,1),
    ('Club Residentes Parquefield',78,4,1),
    ('Club Atlético El Torito',79,4,1);

CREATE TABLE persona (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    dni INT NOT NULL,
    sexo CHAR(1) NOT NULL,
    fecha_nacimiento DATE NULL,
    id_domicilio_renaper INT NULL,
    id_domicilio_actual INT NOT NULL,
    telefono VARCHAR(15) NULL,
    mail VARCHAR(255) NULL,
    FOREIGN KEY (id_domicilio_renaper) REFERENCES domicilio (id),
    FOREIGN KEY (id_domicilio_actual) REFERENCES domicilio (id)
);

CREATE TABLE raza (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_especie INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_especie) REFERENCES especie (id)
);

INSERT INTO raza (id_especie, nombre)
VALUES
    (1, 'Caniche'),
    (1, 'Chihuahua'),
    (1, 'Cocker Spaniel Inglés'),
    (1, 'Beagle'),
    (1, 'Rottweiler'),
    (1, 'Golden Retriever'),
    (1, 'Gran Danés'),
    (1, 'Mastín Inglés'),
    (2, 'Singapura'),
    (2, 'Devon Rex'),
    (2,'Americano de pelo corto'),
    (2, 'Siamés'),
    (2, 'Grande de Noruega'),
    (2, 'Maine Coon'),
    (2, 'Savannah'),
    (2, 'Chausie'),
    (2, 'Burmés'),
    (2, 'Tonquinés'),
    (2, 'Manx'),
    (2,'Exótico de pelo corto'),
    (2, 'Abisinio'),
    (1, 'Yorkshire Terrier'),
    (1, 'Pomerania'),
    (1, 'Shih Tzu'),
    (1, 'Bichón Frisé'),
    (1, 'Dachshund Miniatura'),
    (2, 'Birmano'),
    (2, 'Russian Blue'),
    (2, 'Oriental de pelo corto'),
    (2, 'Bengala'),
    (2, 'British Shorthair'),
    (1, 'Bulldog Francés'),
    (1, 'Border Collie'),
    (1, 'Schnauzer Mediano'),
    (1, 'Basset Hound'),
    (1, 'Cocker Americano'),
    (2, 'Ragdoll'),
    (2, 'Selkirk Rex'),
    (2, 'Himalayo'),
    (2, 'Ragamuffin'),
    (2, 'Persa'),
    (1, 'Dálmata'),
    (1, 'Husky Siberiano'),
    (1, 'Doberman Pinscher'),
    (1, 'Setter Irlandés'),
    (1, 'Labrador Retriever'),
    (2, 'Bosque de Noruega'),
    (2, 'Maine Coon'),
    (2, 'Savannah'),
    (2, 'Pixie-Bob'),
    (2, 'Highlander'),
    (1, 'Mastín Napolitano'),
    (1, 'San Bernardo'),
    (1, 'Terranova'),
    (1, 'Leonberger'),
    (1, 'Mastín Tibetiano'),
    (1, 'Indefinida'),
    (2, 'Indefinida');

CREATE TABLE color (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

INSERT INTO color (nombre) 
VALUES ('Blanco'), ('Negro'), ('Gris'), ('Marrón'), ('Naranja'), ('Crema'), ('Atigrado');

CREATE TABLE tamaño (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

INSERT INTO tamaño (nombre)
VALUES ('Mini'), ('Pequeño'), ('Mediano'), ('Grande'), ('Gigante');

CREATE TABLE animal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    sexo CHAR(1) NOT NULL,
    fecha_nacimiento DATE NULL,
    id_tamaño INT NOT NULL,
    id_responsable INT NULL,
    id_especie INT NOT NULL,
    id_raza INT NOT NULL,
    fallecido TINYINT (1) NOT NULL,
    esterilizado TINYINT(1) NOT NULL,
    adoptado_imusa TINYINT(1) NOT NULL,
    FOREIGN KEY (id_tamaño) REFERENCES tamaño (id),
    FOREIGN KEY (id_especie) REFERENCES especie (id),
    FOREIGN KEY (id_raza) REFERENCES raza (id),
    FOREIGN KEY (id_responsable) REFERENCES persona (id)
);

CREATE TABLE animal_color (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_animal INT NOT NULL,
    id_color INT NOT NULL,
    FOREIGN KEY (id_animal) REFERENCES animal (id),
    FOREIGN KEY (id_color) REFERENCES color (id)
);

CREATE TABLE tipo_personal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

INSERT INTO tipo_personal (nombre)
VALUES ('Médico Veterinario'), ('Administrativo');

CREATE TABLE personal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT NOT NULL,
    user_id INT NULL,
    matricula VARCHAR(15) NOT NULL,
    legajo INT NOT NULL,
    estado TINYINT (1) NOT NULL,
    firma TEXT NULL,
    id_tipo_personal INT NOT NULL,
    FOREIGN KEY (id_persona) REFERENCES persona (id),
    FOREIGN KEY (id_tipo_personal) REFERENCES tipo_personal (id)
);

CREATE TABLE atencion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_efector INT NOT NULL,
    id_responsable INT NOT NULL,
    id_domicilio_responsable INT NULL,
    id_animal INT NOT NULL,
    id_servicio INT NOT NULL,
    id_personal INT NOT NULL,
    fecha_ingreso DATE NULL,
    hora_ingreso TIME NULL,
    firma_ingreso TEXT NULL,
    fecha_egreso DATE NULL,
    hora_egreso TIME NULL,
    firma_egreso TEXT NULL,
    observaciones VARCHAR(255) NULL,
    finalizada TINYINT (1) NOT NULL,
    FOREIGN KEY (id_efector) REFERENCES efector (id),
    FOREIGN KEY (id_responsable) REFERENCES persona (id),
    FOREIGN KEY (id_domicilio_responsable) REFERENCES domicilio (id),
    FOREIGN KEY (id_animal) REFERENCES animal (id),
    FOREIGN KEY (id_servicio) REFERENCES servicio (id),
    FOREIGN KEY (id_personal) REFERENCES personal (id)
);

CREATE TABLE atencion_insumo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_atencion INT NOT NULL,
    id_insumo INT NOT NULL,
    cant_ml INT NULL,
    cant_ml_prequirurgico INT NULL,
    cant_ml_induccion INT NULL,
    cant_ml_quirofano INT NULL,
    FOREIGN KEY (id_atencion) REFERENCES atencion (id),
    FOREIGN KEY (id_insumo) REFERENCES insumo (id)
);

CREATE TABLE personal_efector (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_personal INT NOT NULL,
    id_efector INT NOT NULL,
    estado TINYINT (1) NOT NULL,
    FOREIGN KEY (id_personal) REFERENCES personal (id),
    FOREIGN KEY (id_efector) REFERENCES efector (id)
);