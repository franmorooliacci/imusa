CREATE TABLE
    candidato (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        apellido VARCHAR(255) NOT NULL,
        dni INT NOT NULL,
        sexo CHAR(1) NOT NULL,
        fecha_nacimiento DATE NULL,
        telefono VARCHAR(15) NULL,
        mail VARCHAR(255) NULL
        -- domicilio
    );

CREATE TABLE
    institucion (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL
    );

INSERT INTO
    institucion (nombre)
VALUES
    ('IMuSA');

CREATE TABLE
    peticion_adopcion (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_animal INT NOT NULL,
        id_candidato INT NOT NULL,
        fecha DATETIME NOT NULL,
        estado ENUM ('Pendiente', 'Aprobada', 'Rechazada') NOT NULL,
        FOREIGN KEY (id_animal) REFERENCES animal (id),
        FOREIGN KEY (id_candidato) REFERENCES candidato (id)
    );

CREATE TABLE
    institucion_animal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_institucion INT NOT NULL,
        id_animal INT NOT NULL,
        ingreso DATE NOT NULL,
        egreso DATE NULL,
        adopcion TINYINT (1) NOT NULL,
        descripcion_adopcion TEXT NULL,
        observaciones TEXT NULL,
        estado TINYINT (1) NOT NULL,
        FOREIGN KEY (id_institucion) REFERENCES institucion (id),
        FOREIGN KEY (id_animal) REFERENCES animal (id)
    );

CREATE TABLE
    adopcion_foto (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_institucion_animal INT NOT NULL,
        url VARCHAR(255) NOT NULL,
        descripcion VARCHAR(255) NULL,
        orden INT NOT NULL DEFAULT 0,
        FOREIGN KEY (id_institucion_animal) REFERENCES institucion_animal (id)
    );

CREATE TABLE
    adopcion (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_responsable INT NOT NULL,
        id_animal INT NOT NULL,
        id_institucion INT NOT NULL,
        fecha DATE NOT NULL,
        regreso DATE NULL,
        observaciones TEXT NULL,
        FOREIGN KEY (id_responsable) REFERENCES responsable (id),
        FOREIGN KEY (id_animal) REFERENCES animal (id),
        FOREIGN KEY (id_institucion) REFERENCES institucion (id)
    );