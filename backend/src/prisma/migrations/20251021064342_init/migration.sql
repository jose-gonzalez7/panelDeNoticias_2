/*
  Warnings:

  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Usuario";

-- CreateTable
CREATE TABLE "categoria" (
    "id_categoria" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "publicaciones" (
    "id_publicacion" VARCHAR(20) NOT NULL,
    "titulo" VARCHAR(30) NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "id_categoria" VARCHAR(20) NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "prioridad" VARCHAR(20) NOT NULL,
    "adjuntos" VARCHAR(20) NOT NULL,
    "etiquetas" VARCHAR(50),

    CONSTRAINT "publicaciones_pkey" PRIMARY KEY ("id_publicacion")
);

-- CreateTable
CREATE TABLE "notificacion" (
    "id_notificacion" VARCHAR(20) NOT NULL,
    "asunto" VARCHAR(50) NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "id_publicacion" VARCHAR(20) NOT NULL,

    CONSTRAINT "notificacion_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "rol" VARCHAR(13) NOT NULL,
    "password_hash" VARCHAR(100) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "pantallatv" (
    "id_pantalla" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "token_acceso" VARCHAR(1000) NOT NULL,
    "configuracion" VARCHAR(100) NOT NULL,
    "rotacion" VARCHAR(10) NOT NULL,
    "last_refresh" TIME NOT NULL,

    CONSTRAINT "pantallatv_pkey" PRIMARY KEY ("id_pantalla")
);

-- CreateTable
CREATE TABLE "salidaalumno" (
    "id_salida" VARCHAR(20) NOT NULL,
    "id_publicacion" VARCHAR(20) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "observaciones" VARCHAR(100),

    CONSTRAINT "salidaalumno_pkey" PRIMARY KEY ("id_salida")
);

-- CreateTable
CREATE TABLE "baja" (
    "id_baja" VARCHAR(20) NOT NULL,
    "id_publicacion" VARCHAR(20) NOT NULL,
    "profesor" VARCHAR(50) NOT NULL,
    "prioridad" VARCHAR(20) NOT NULL,

    CONSTRAINT "baja_pkey" PRIMARY KEY ("id_baja")
);

-- CreateTable
CREATE TABLE "guardia" (
    "id_guardia" VARCHAR(20) NOT NULL,
    "id_publicacion" VARCHAR(20) NOT NULL,
    "inicio_hora" TIME NOT NULL,
    "fin_hora" TIME NOT NULL,
    "aula_o_patio" VARCHAR(5) NOT NULL,
    "observaciones" VARCHAR(50),
    "profesor" VARCHAR(50),

    CONSTRAINT "guardia_pkey" PRIMARY KEY ("id_guardia")
);

-- CreateIndex
CREATE UNIQUE INDEX "notificacion_id_publicacion_key" ON "notificacion"("id_publicacion");

-- CreateIndex
CREATE UNIQUE INDEX "salidaalumno_id_publicacion_key" ON "salidaalumno"("id_publicacion");

-- CreateIndex
CREATE UNIQUE INDEX "baja_id_publicacion_key" ON "baja"("id_publicacion");

-- CreateIndex
CREATE UNIQUE INDEX "guardia_id_publicacion_key" ON "guardia"("id_publicacion");

-- AddForeignKey
ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacion" ADD CONSTRAINT "notificacion_id_publicacion_fkey" FOREIGN KEY ("id_publicacion") REFERENCES "publicaciones"("id_publicacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salidaalumno" ADD CONSTRAINT "salidaalumno_id_publicacion_fkey" FOREIGN KEY ("id_publicacion") REFERENCES "publicaciones"("id_publicacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baja" ADD CONSTRAINT "baja_id_publicacion_fkey" FOREIGN KEY ("id_publicacion") REFERENCES "publicaciones"("id_publicacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardia" ADD CONSTRAINT "guardia_id_publicacion_fkey" FOREIGN KEY ("id_publicacion") REFERENCES "publicaciones"("id_publicacion") ON DELETE RESTRICT ON UPDATE CASCADE;
