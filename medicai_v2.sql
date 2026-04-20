-- Base de Datos Minimalista para MedicAI Chatbot
-- Incluye: usuarios, pacientes, conversaciones y mensajes.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `medicai`
--
CREATE DATABASE IF NOT EXISTS `medicai` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `medicai`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `rol` enum('admin','recepcion') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_usuarios_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--
INSERT INTO `usuarios` (`id`, `email`, `password_hash`, `nombre`, `rol`, `activo`) VALUES
(1, 'admin@medicai.com', '$2b$12$K.zQJ5d8E5wQ1G/sA2G7OO/mRzRz4v.5BqD4eGz1O6e.7S5D.q3wO', 'Administrador Principal', 'admin', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--
CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dni` varchar(20) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `sexo` enum('M','F','O') DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `tipo_sangre` varchar(5) DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  `antecedentes` text DEFAULT NULL,
  `medicamentos_actuales` text DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_pacientes_dni` (`dni`),
  KEY `ix_pacientes_apellidos` (`apellidos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--
INSERT INTO `pacientes` (`id`, `dni`, `nombres`, `apellidos`, `fecha_nacimiento`, `sexo`, `telefono`, `email`, `alergias`, `antecedentes`) VALUES
(1, '76543210', 'Carlos', 'Mendoza', '1985-04-12', 'M', '987654321', 'carlos.mendoza@email.com', 'Penicilina', 'Hipertensión controlada'),
(2, '12345678', 'Ana', 'García', '1992-08-25', 'F', '912345678', 'ana.garcia@email.com', 'Ninguna', 'Asma leve en la infancia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conversaciones`
--
CREATE TABLE `conversaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paciente_id` int(11) NOT NULL,
  `fecha_inicio` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ix_conversaciones_paciente_id` (`paciente_id`),
  CONSTRAINT `fk_conversacion_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--
CREATE TABLE `mensajes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversacion_id` int(11) NOT NULL,
  `rol` enum('user','assistant','system') NOT NULL,
  `contenido` text NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ix_mensajes_conversacion_id` (`conversacion_id`),
  CONSTRAINT `fk_mensaje_conversacion` FOREIGN KEY (`conversacion_id`) REFERENCES `conversaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
