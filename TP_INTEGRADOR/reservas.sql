-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-11-2025 a las 12:56:26
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `reservas`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `obtenerDatosNotificacion` (IN `p_reserva_id` INT)   BEGIN
    -- Primer resultado: Datos de la reserva (para plantilla.hbs)
    SELECT 
        DATE_FORMAT(r.fecha_reserva, '%d/%m/%Y') AS fecha,
        s.titulo AS salon,
        CONCAT(t.hora_desde, ' a ', t.hora_hasta) AS turno
    FROM 
        reservas r
    JOIN 
        salones s ON r.salon_id = s.salon_id
    JOIN 
        turnos t ON r.turno_id = t.turno_id
    WHERE 
        r.reserva_id = p_reserva_id;

    -- Segundo resultado: Correos de los admins
    SELECT 
        u.nombre_usuario AS correoAdmin
    FROM 
        usuarios u
    WHERE 
        u.tipo_usuario = 1 AND u.activo = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `reporte_csv` ()   BEGIN
    SELECT 
        r.reserva_id,
        DATE_FORMAT(r.fecha_reserva, '%Y-%m-%d') AS fecha_reserva,
        CONCAT(u.nombre, ' ', u.apellido) AS nombre,
        s.titulo AS salon,  
        CONCAT(t.hora_desde, ' a ', t.hora_hasta) AS turno, 
        t.orden, 
        
        -- Aquí creamos la lista de servicios
        GROUP_CONCAT(serv.descripcion SEPARATOR ', ') AS servicios 
        
    FROM 
        reservas r
    JOIN 
        salones s ON r.salon_id = s.salon_id
    JOIN 
        turnos t ON r.turno_id = t.turno_id
    JOIN
        usuarios u ON r.usuario_id = u.usuario_id 
    -- Usamos LEFT JOIN por si una reserva no tiene servicios
    LEFT JOIN 
        reservas_servicios rs ON r.reserva_id = rs.reserva_id
    LEFT JOIN 
        servicios serv ON rs.servicio_id = serv.servicio_id
    WHERE
        r.activo = 1
    -- Agrupamos por reserva para que GROUP_CONCAT funcione
    GROUP BY
        r.reserva_id
    ORDER BY
        r.fecha_reserva, t.orden;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_estadistica_top_salones` ()   BEGIN
    SELECT 
        s.titulo AS salon,
        COUNT(r.reserva_id) AS total_reservas
    FROM 
        reservas r
    JOIN 
        salones s ON r.salon_id = s.salon_id
    WHERE 
        r.activo = 1
    GROUP BY 
        s.titulo
    ORDER BY 
        total_reservas DESC
    LIMIT 3;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `reserva_id` int(11) NOT NULL,
  `fecha_reserva` date NOT NULL,
  `salon_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `turno_id` int(11) NOT NULL,
  `foto_cumpleaniero` varchar(255) DEFAULT NULL,
  `tematica` varchar(255) DEFAULT NULL,
  `importe_salon` decimal(10,2) DEFAULT NULL,
  `importe_total` decimal(10,2) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado` timestamp NOT NULL DEFAULT current_timestamp(),
  `modificado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`reserva_id`, `fecha_reserva`, `salon_id`, `usuario_id`, `turno_id`, `foto_cumpleaniero`, `tematica`, `importe_salon`, `importe_total`, `activo`, `creado`, `modificado`) VALUES
(1, '2025-10-08', 1, 1, 1, NULL, 'Plim plim', NULL, 200000.00, 1, '2025-08-19 22:02:33', '2025-08-19 22:02:33'),
(2, '2025-10-08', 2, 1, 1, NULL, 'Messi', NULL, 100000.00, 1, '2025-08-19 22:03:45', '2025-08-19 22:03:45'),
(3, '2025-10-08', 2, 2, 1, NULL, 'Palermo', NULL, 500000.00, 1, '2025-08-19 22:03:45', '2025-08-19 22:03:45'),
(5, '2025-09-25', 6, 2, 3, NULL, 'Sirenita', 10000.00, 10000.00, 1, '2025-09-20 14:28:57', '2025-09-20 14:28:57'),
(7, '2025-12-20', 6, 9, 1, NULL, 'Superhéroes', 10000.00, 260000.00, 1, '2025-11-05 18:26:03', '2025-11-05 18:26:03'),
(8, '2025-12-20', 6, 9, 1, NULL, 'Superhéroes', 10000.00, 260000.00, 1, '2025-11-05 19:44:28', '2025-11-05 19:44:28'),
(9, '2025-12-20', 6, 9, 1, NULL, 'Superhéroes', 10000.00, 260000.00, 1, '2025-11-05 21:32:53', '2025-11-05 21:32:53'),
(10, '2025-12-20', 6, 9, 1, NULL, 'Superhéroes', 10000.00, 260000.00, 1, '2025-11-05 21:36:58', '2025-11-05 21:36:58'),
(11, '2025-12-20', 6, 9, 1, NULL, 'Superhéroes', 10000.00, 260000.00, 1, '2025-11-05 21:37:41', '2025-11-05 21:37:41'),
(12, '2025-12-20', 6, 9, 1, NULL, 'Superhéroes', 10000.00, 260000.00, 1, '2025-11-05 21:58:33', '2025-11-05 21:58:33'),
(13, '2025-12-20', 6, 9, 1, NULL, 'Superhéroes', 10000.00, 260000.00, 1, '2025-11-05 22:04:09', '2025-11-05 22:04:09'),
(14, '2025-12-20', 6, 9, 1, NULL, 'Superhéroes', 10000.00, 260000.00, 1, '2025-11-05 22:05:22', '2025-11-05 22:05:22'),
(15, '2025-12-20', 6, 9, 1, NULL, 'Superhéroes', 10000.00, 260000.00, 1, '2025-11-05 22:08:03', '2025-11-05 22:08:03'),
(16, '2025-12-20', 6, 9, 1, NULL, 'Superhéroes', 10000.00, 260000.00, 1, '2025-11-05 22:11:36', '2025-11-05 22:11:36'),
(17, '2025-12-20', 6, 9, 1, NULL, 'Superhéroes', 10000.00, 260000.00, 1, '2025-11-05 22:11:42', '2025-11-05 22:11:42'),
(18, '2025-12-20', 6, 9, 1, NULL, 'Superhéroes', 10000.00, 260000.00, 1, '2025-11-05 22:26:42', '2025-11-05 22:26:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas_servicios`
--

CREATE TABLE `reservas_servicios` (
  `reserva_servicio_id` int(11) NOT NULL,
  `reserva_id` int(11) NOT NULL,
  `servicio_id` int(11) NOT NULL,
  `importe` decimal(10,2) NOT NULL,
  `creado` timestamp NOT NULL DEFAULT current_timestamp(),
  `modificado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reservas_servicios`
--

INSERT INTO `reservas_servicios` (`reserva_servicio_id`, `reserva_id`, `servicio_id`, `importe`, `creado`, `modificado`) VALUES
(1, 1, 1, 50000.00, '2025-08-19 22:07:31', '2025-08-19 22:07:31'),
(2, 1, 2, 50000.00, '2025-08-19 22:07:31', '2025-08-19 22:07:31'),
(3, 1, 3, 50000.00, '2025-08-19 22:07:31', '2025-08-19 22:07:31'),
(4, 1, 4, 50000.00, '2025-08-19 22:07:31', '2025-08-19 22:07:31'),
(5, 2, 1, 50000.00, '2025-08-19 22:08:08', '2025-08-19 22:08:08'),
(6, 2, 2, 50000.00, '2025-08-19 22:08:08', '2025-08-19 22:08:08'),
(7, 3, 1, 100000.00, '2025-08-19 22:09:17', '2025-08-19 22:09:17'),
(8, 3, 2, 100000.00, '2025-08-19 22:09:17', '2025-08-19 22:09:17'),
(9, 3, 3, 100000.00, '2025-08-19 22:09:17', '2025-08-19 22:09:17'),
(10, 3, 4, 200000.00, '2025-08-19 22:09:17', '2025-08-19 22:09:17'),
(11, 7, 1, 15000.00, '2025-11-05 18:26:03', '2025-11-05 18:26:03'),
(12, 7, 8, 1000.00, '2025-11-05 18:26:03', '2025-11-05 18:26:03'),
(13, 8, 1, 15000.00, '2025-11-05 19:44:28', '2025-11-05 19:44:28'),
(14, 8, 8, 1000.00, '2025-11-05 19:44:28', '2025-11-05 19:44:28'),
(15, 9, 1, 15000.00, '2025-11-05 21:32:53', '2025-11-05 21:32:53'),
(16, 9, 8, 1000.00, '2025-11-05 21:32:53', '2025-11-05 21:32:53'),
(17, 10, 1, 15000.00, '2025-11-05 21:36:58', '2025-11-05 21:36:58'),
(18, 10, 8, 1000.00, '2025-11-05 21:36:58', '2025-11-05 21:36:58'),
(19, 11, 1, 15000.00, '2025-11-05 21:37:41', '2025-11-05 21:37:41'),
(20, 11, 8, 1000.00, '2025-11-05 21:37:41', '2025-11-05 21:37:41'),
(21, 12, 1, 15000.00, '2025-11-05 21:58:33', '2025-11-05 21:58:33'),
(22, 12, 8, 1000.00, '2025-11-05 21:58:33', '2025-11-05 21:58:33'),
(23, 13, 1, 15000.00, '2025-11-05 22:04:09', '2025-11-05 22:04:09'),
(24, 13, 8, 1000.00, '2025-11-05 22:04:09', '2025-11-05 22:04:09'),
(25, 14, 1, 15000.00, '2025-11-05 22:05:22', '2025-11-05 22:05:22'),
(26, 14, 8, 1000.00, '2025-11-05 22:05:22', '2025-11-05 22:05:22'),
(27, 15, 1, 15000.00, '2025-11-05 22:08:03', '2025-11-05 22:08:03'),
(28, 15, 8, 1000.00, '2025-11-05 22:08:03', '2025-11-05 22:08:03'),
(29, 16, 1, 15000.00, '2025-11-05 22:11:36', '2025-11-05 22:11:36'),
(30, 16, 8, 1000.00, '2025-11-05 22:11:36', '2025-11-05 22:11:36'),
(31, 17, 1, 15000.00, '2025-11-05 22:11:42', '2025-11-05 22:11:42'),
(32, 17, 8, 1000.00, '2025-11-05 22:11:42', '2025-11-05 22:11:42'),
(33, 18, 1, 15000.00, '2025-11-05 22:26:42', '2025-11-05 22:26:42'),
(34, 18, 8, 1000.00, '2025-11-05 22:26:42', '2025-11-05 22:26:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salones`
--

CREATE TABLE `salones` (
  `salon_id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `capacidad` int(11) DEFAULT NULL,
  `importe` decimal(10,2) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `creado` timestamp NOT NULL DEFAULT current_timestamp(),
  `modificado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `salones`
--

INSERT INTO `salones` (`salon_id`, `titulo`, `direccion`, `latitud`, `longitud`, `capacidad`, `importe`, `activo`, `creado`, `modificado`) VALUES
(1, 'Principal', 'San Lorenzo 1000', NULL, NULL, 200, 95000.00, 1, '2025-08-19 21:51:22', '2025-08-19 21:51:22'),
(2, 'Secundario', 'San Lorenzo 1000', NULL, NULL, 70, 7000.00, 1, '2025-08-19 21:51:22', '2025-08-19 21:51:22'),
(3, 'Cancha Fútbol 5', 'Alberdi 300', NULL, NULL, 50, 150000.00, 1, '2025-08-19 21:51:22', '2025-08-19 21:51:22'),
(4, 'Maquina de Jugar', 'Peru 50', NULL, NULL, 100, 95000.00, 1, '2025-08-19 21:51:22', '2025-08-19 21:51:22'),
(5, 'Trampolín Play', 'Belgrano 100', NULL, NULL, 70, 200000.00, 1, '2025-08-19 21:51:22', '2025-08-19 21:51:22'),
(6, 'Camping Sindicato de Empleados de Comercio', 'Juan Garrigó 4716', -31.78200000, -60.50800000, 500, 10000.00, 1, '2025-09-20 14:13:43', '2025-09-20 14:13:43'),
(7, 'Bosquesito', 'La Paz 166', -31.35000000, -58.05200000, 500, 600000.00, 1, '2025-09-24 20:16:41', '2025-09-24 20:16:41'),
(12, 'Salón de Fiestas Alegría', 'Calle Argentina 541', -31.73259224, -60.53065358, 100, 6500000.00, 0, '2025-10-15 13:34:09', '2025-10-15 13:34:09'),
(13, 'Salón de Prueba para Caché', 'Avenida Siempre Viva 742', NULL, NULL, 50, 12345.00, 1, '2025-10-15 14:02:52', '2025-10-15 14:02:52'),
(14, 'Salón Fiestas del Sol', 'Av. Rivadavia 123', -31.41700000, -64.18300000, 100, 55000.00, 0, '2025-11-05 17:21:43', '2025-11-05 17:21:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `servicio_id` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `importe` decimal(10,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado` timestamp NOT NULL DEFAULT current_timestamp(),
  `modificado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`servicio_id`, `descripcion`, `importe`, `activo`, `creado`, `modificado`) VALUES
(1, 'Sonido', 15000.00, 1, '2025-08-19 21:47:55', '2025-08-19 21:47:55'),
(2, 'Mesa dulce', 25000.00, 1, '2025-08-19 21:47:55', '2025-08-19 21:47:55'),
(3, 'Tarjetas de invitación', 5000.00, 1, '2025-08-19 21:47:55', '2025-08-19 21:47:55'),
(4, 'Mozos', 15000.00, 1, '2025-08-19 21:47:55', '2025-08-19 21:47:55'),
(5, 'Sala de video juegos', 15000.00, 1, '2025-08-19 21:47:55', '2025-08-19 21:47:55'),
(6, 'Mago', 25000.00, 1, '2025-08-20 21:31:00', '2025-08-20 21:31:00'),
(7, 'Cabezones', 80000.00, 1, '2025-08-20 21:31:00', '2025-08-20 21:31:00'),
(8, 'Maquillaje infantil', 1000.00, 1, '2025-08-20 21:31:00', '2025-08-20 21:31:00'),
(9, 'Fotografía', 160000.00, 1, '2025-09-20 13:59:03', '2025-09-20 13:59:03'),
(10, 'Fotografía instantanea', 220000.00, 1, '2025-09-24 20:16:41', '2025-09-24 20:16:41'),
(11, 'Servicio de Catering', 16000.00, 0, '2025-11-05 17:34:46', '2025-11-05 17:34:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `turno_id` int(11) NOT NULL,
  `orden` int(11) NOT NULL,
  `hora_desde` time NOT NULL,
  `hora_hasta` time NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado` timestamp NOT NULL DEFAULT current_timestamp(),
  `modificado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`turno_id`, `orden`, `hora_desde`, `hora_hasta`, `activo`, `creado`, `modificado`) VALUES
(1, 1, '12:00:00', '14:00:00', 1, '2025-08-19 21:44:19', '2025-08-19 21:44:19'),
(2, 2, '15:00:00', '17:00:00', 1, '2025-08-19 21:46:08', '2025-08-19 21:46:08'),
(3, 3, '18:00:00', '20:00:00', 1, '2025-08-19 21:46:08', '2025-08-19 21:46:08'),
(5, 10, '10:00:00', '12:00:00', 0, '2025-11-05 17:50:10', '2025-11-05 17:50:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usuario_id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  `tipo_usuario` tinyint(4) NOT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado` timestamp NOT NULL DEFAULT current_timestamp(),
  `modificado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuario_id`, `nombre`, `apellido`, `nombre_usuario`, `contrasenia`, `tipo_usuario`, `celular`, `foto`, `activo`, `creado`, `modificado`) VALUES
(1, 'Alberto', 'López', 'alblop@correo.com', 'cf584badd07d42dcb8506f8bae32aa96', 3, NULL, NULL, 1, '2025-08-19 21:37:51', '2025-08-19 21:37:51'),
(2, 'Pamela', 'Gómez', 'pamgom@correo.com', '709ee61c97fc261d35aa2295e109b3fb', 3, NULL, NULL, 1, '2025-08-19 21:39:45', '2025-08-19 21:39:45'),
(3, 'Esteban', 'Ciro', 'estcir@correo.com', 'da6541938e9afdcd420d1ccfc7cac2c7', 3, NULL, NULL, 1, '2025-08-19 21:41:50', '2025-08-19 21:41:50'),
(4, 'Oscar', 'Ramirez', 'oscram@correo.com', '0ac879e8785ea5b3da6ff1333d8b0cf2', 1, NULL, NULL, 1, '2025-08-19 21:41:50', '2025-08-19 21:41:50'),
(5, 'Claudia', 'Juárez', 'clajua@correo.com', '4f9dbdcf9259db3fa6a3f6164dd285de', 1, NULL, NULL, 1, '2025-08-19 21:41:50', '2025-08-19 21:41:50'),
(6, 'William', 'Corbalán', 'wilcor@correo.com', 'f68087e72fbdf81b4174fec3676c1790', 2, NULL, NULL, 1, '2025-08-19 21:41:50', '2025-08-19 21:41:50'),
(7, 'Anahí', 'Flores', 'anaflo@correo.com', 'd4e767c916b51b8cc5c909f5435119b1', 2, NULL, NULL, 1, '2025-08-19 21:41:50', '2025-08-19 21:41:50'),
(9, 'Eileen', 'Mernes', 'eileenmernes', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 1, NULL, NULL, 1, '2025-11-05 14:51:35', '2025-11-05 14:51:35'),
(10, 'Micaela', 'Gomez', 'micaelaG@example.com', 'db2e7f1bd5ab9968ae76199b7cc74795ca7404d5a08d78567715ce532f9d2669', 3, '111222333', NULL, 0, '2025-11-05 15:43:20', '2025-11-05 15:43:20'),
(18, 'Isabella', 'Mendez', 'isabellamendez4@example.com', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 3, '3439876543', NULL, 1, '2025-11-05 23:59:26', '2025-11-05 23:59:26');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`reserva_id`),
  ADD KEY `reservas_fk2` (`salon_id`),
  ADD KEY `reservas_fk3` (`usuario_id`),
  ADD KEY `reservas_fk4` (`turno_id`);

--
-- Indices de la tabla `reservas_servicios`
--
ALTER TABLE `reservas_servicios`
  ADD PRIMARY KEY (`reserva_servicio_id`),
  ADD KEY `reservas_servicios_fk1` (`reserva_id`),
  ADD KEY `reservas_servicios_fk2` (`servicio_id`);

--
-- Indices de la tabla `salones`
--
ALTER TABLE `salones`
  ADD PRIMARY KEY (`salon_id`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`servicio_id`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`turno_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usuario_id`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `reserva_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `reservas_servicios`
--
ALTER TABLE `reservas_servicios`
  MODIFY `reserva_servicio_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `salones`
--
ALTER TABLE `salones`
  MODIFY `salon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `servicio_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `turno_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_fk2` FOREIGN KEY (`salon_id`) REFERENCES `salones` (`salon_id`),
  ADD CONSTRAINT `reservas_fk3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`),
  ADD CONSTRAINT `reservas_fk4` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`turno_id`);

--
-- Filtros para la tabla `reservas_servicios`
--
ALTER TABLE `reservas_servicios`
  ADD CONSTRAINT `reservas_servicios_fk1` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`reserva_id`),
  ADD CONSTRAINT `reservas_servicios_fk2` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`servicio_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
