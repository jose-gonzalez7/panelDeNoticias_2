-- TABLA CATEGORIA

CREATE TABLE categoria (
    id_categoria varchar(20) PRIMARY KEY,
    nombre varchar(50) NOT NULL
);

-- INSERCIÓN DE CATEGORIAS

INSERT INTO categoria (id_categoria, nombre) VALUES
('cat_01', 'noticias'),
('cat_02', 'guardias'),
('cat_03', 'bajas'),
('cat_04', 'salidas'),
('cat_05', 'eventos'),
('cat_06', 'urgentes');

-- TABLA PUBLICACIONES

CREATE TABLE publicaciones (
    id_publicacion varchar(20) PRIMARY KEY,
    titulo varchar(30) NOT NULL,
    cuerpo text NOT NULL,
    id_categoria varchar(20) NOT NULL,
    CONSTRAINT fk_publicacion_categoria FOREIGN KEY(id_categoria) REFERENCES categoria(id_categoria),
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    prioridad varchar(20) NOT NULL,
    adjuntos varchar(20) NOT NULL,
    etiquetas varchar(50)
);

-- PUBLICACIÓN DE EJEMPLO

INSERT INTO PUBLICACIONES (id_publicacion, titulo, cuerpo, id_categoria, fecha_inicio, fecha_fin, prioridad, adjuntos, etiquetas) VALUES
('pub_01', 'noticia', 'este es el cuerpo de la noticia de ejemplo', 'cat_01', '2025-10-17', '2025-10-23', 'No urgente', 'adjunto1', 'noticiaEjemplo'),
('pub_02', 'noticia2', 'este es el cuerpo de la noticia de ejemplo 2', 'cat_01', '2025-10-17', '2025-10-23', 'Urgente', 'adjunto2', 'noticiaEjemplo2'),
('pub_03', 'guardia', 'esto es una publicacion de guardia', 'cat_02', '2025-10-17', '2025-10-23', 'No urgente', 'adjunto1', 'GuardiaEjemplo'),
('pub_04', 'baja', 'Esto es una publicacion de baja ', 'cat_03', '2025-10-17', '2025-10-23', 'Urgente', 'adjunto2', 'GuardiaEjemplo'),
('pub_05', 'salida', 'este es el cuerpo de la salida de ejemplo', 'cat_04', '2025-10-17', '2025-10-23', 'No urgente', 'adjunto1', 'SalidaEjemplo');


-- TABLA NOTIFICACION

CREATE TABLE notificacion (
    id_notificacion varchar(20) PRIMARY KEY,
    asunto varchar(50) NOT NULL,
    cuerpo text NOT NULL,
    id_publicacion varchar(20) NOT NULL,
    CONSTRAINT fk_notificacion_publicaciones FOREIGN KEY(id_publicacion) REFERENCES publicaciones(id_publicacion)
);

-- NOTIFICACIÓN DE EJEMPLO

INSERT INTO NOTIFICACION (id_notificacion, asunto, cuerpo, id_publicacion) VALUES
('noti_01', 'notificacion urgente 2', 'cuerpo notificacion publicacion 2', 'pub_02');

-- TABLA USUARIO

CREATE TABLE usuario (
    id_usuario varchar(20) PRIMARY KEY,
    nombre varchar(50) NOT NULL,
    email varchar(100) NOT NULL,
    rol varchar(13) NOT NULL,
    password_hash varchar(100) NOT NULL
);

-- USUARIO DE EJEMPLO (LA CONTRASEÑA NO ESTA EN HASH)

INSERT INTO usuario (id_usuario, nombre, email, rol, password_hash) VALUES
('admin_01', 'administrador_1', 'admin@gmail.com', 'administrador', '12345678'),
('editor_01', 'editor_1', 'editor@gmail.com', 'editor', '12345678'),
('profesor_01', 'profesor_1', 'profesor@gmail.com', 'profesor', '12345678');

-- TABLA PANTALLATV (TOKEN INVENTADO)

CREATE TABLE pantallatv (
    id_pantalla varchar(20) PRIMARY KEY,
    nombre varchar(50) NOT NULL,
    token_acceso varchar(1000) NOT NULL,
    configuracion varchar(100) NOT NULL,
    rotacion varchar(10) NOT NULL,
    last_refresh time NOT NULL
);

-- PANTALLA DE EJEMPLO 

INSERT INTO pantallatv (id_pantalla, nombre, token_acceso, configuracion, rotacion, last_refresh) VALUES
('pant_01', 'pantalla_1', 'token_1', 'monitor', 'horizontal', '00:00:00');

-- TABLA SALIDAALUMNO

CREATE TABLE salidaalumno (
    id_salida varchar(20) PRIMARY KEY,
    id_publicacion varchar(20) NOT NULL,
    CONSTRAINT fk_salidaalumno_publicaciones FOREIGN KEY(id_publicacion) REFERENCES publicaciones(id_publicacion),
    tipo varchar(20) NOT NULL,
    observaciones varchar(100)
);

-- SALIDA DE EJEMPLO

INSERT INTO salidaalumno (id_salida, id_publicacion, tipo, observaciones) VALUES
('sal_01','pub_05', 'excursion', 'Excursión a la Alhambra');

-- TABLA BAJA

CREATE TABLE baja (
    id_baja varchar(20) PRIMARY KEY,
    id_publicacion varchar(20) NOT NULL,
    CONSTRAINT fk_baja_publicaciones FOREIGN KEY(id_publicacion) REFERENCES publicaciones(id_publicacion),
    profesor varchar(50) NOT NULL,
    prioridad varchar(20) NOT NULL
);

-- BAJA DE EJEMPLO

INSERT INTO baja (id_baja, id_publicacion, profesor, prioridad) VALUES
('baja_01','pub_04', 'Sergio López Uceda', 'No urgente');

-- TABLA GUARDIA

CREATE TABLE guardia (
    id_guardia varchar(20) PRIMARY KEY,
    id_publicacion varchar(20) NOT NULL,
    CONSTRAINT fk_guardia_publicaciones FOREIGN KEY(id_publicacion) REFERENCES publicaciones(id_publicacion),
    inicio_hora time NOT NULL,
    fin_hora time NOT NULL,
    aula_o_patio varchar(5) NOT NULL,
    observaciones varchar(50),
    profesor varchar(50)
);

-- GUARDIA DE EJEMPLO

INSERT INTO guardia (id_guardia, id_publicacion, inicio_hora, fin_hora, aula_o_patio, observaciones, profesor) VALUES 
('guar_01', 'pub_03', '9:00', '10:00', 'aula', 'Guardia en 2º de DAW', 'Diego Alarcon García');