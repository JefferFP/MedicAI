-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-04-2026 a las 23:44:19
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
-- Base de datos: `medicai`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `medico_id` int(11) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `duracion_min` int(11) NOT NULL DEFAULT 30,
  `motivo` text DEFAULT NULL,
  `estado` enum('pendiente','confirmada','atendida','cancelada','no_asistio') NOT NULL DEFAULT 'pendiente',
  `notas` text DEFAULT NULL,
  `creada_en` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id`, `paciente_id`, `medico_id`, `fecha_hora`, `duracion_min`, `motivo`, `estado`, `notas`, `creada_en`, `updated_at`) VALUES
(1, 1, 1, '2026-04-15 09:00:00', 30, 'Control de presión arterial', 'confirmada', NULL, '2026-04-13 21:42:28', '2026-04-13 21:42:28'),
(2, 2, 1, '2026-04-15 10:00:00', 30, 'Crisis asmática leve', 'pendiente', NULL, '2026-04-13 21:42:28', '2026-04-13 21:42:28'),
(3, 3, 2, '2026-04-16 15:00:00', 30, 'Control pediátrico anual', 'confirmada', NULL, '2026-04-13 21:42:28', '2026-04-13 21:42:28'),
(4, 4, 1, '2026-04-17 11:00:00', 30, 'Seguimiento diabetes', 'pendiente', NULL, '2026-04-13 21:42:28', '2026-04-13 21:42:28'),
(6, 1, 1, '2026-04-14 18:01:00', 30, NULL, 'pendiente', NULL, '2026-04-14 05:58:12', '2026-04-14 05:58:12'),
(7, 1, 1, '2026-04-14 14:00:00', 30, 'extraccion de yatusa', 'pendiente', NULL, '2026-04-14 05:58:40', '2026-04-14 05:58:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `consultas_triaje`
--

CREATE TABLE `consultas_triaje` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `mensaje_usuario` text NOT NULL,
  `sintomas_detectados` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sintomas_detectados`)),
  `nivel` enum('EMERGENCIA','URGENCIA','ESTABLE') NOT NULL,
  `resumen` text DEFAULT NULL,
  `accion_sugerida` text DEFAULT NULL,
  `especialidad_sugerida` varchar(100) DEFAULT NULL,
  `contexto_ia` text DEFAULT NULL,
  `derivada_a_cita_id` int(11) DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `consultas_triaje`
--

INSERT INTO `consultas_triaje` (`id`, `paciente_id`, `mensaje_usuario`, `sintomas_detectados`, `nivel`, `resumen`, `accion_sugerida`, `especialidad_sugerida`, `contexto_ia`, `derivada_a_cita_id`, `fecha_creacion`) VALUES
(1, 1, 'Me duele fuerte el pecho y me falta el aire', '[\"dolor torácico\",\"disnea\"]', 'EMERGENCIA', 'Posible evento cardiovascular en paciente hipertenso', 'Acudir INMEDIATAMENTE a emergencias', 'Cardiología', NULL, NULL, '2026-04-13 21:42:28'),
(2, 2, 'Tengo tos y silbido en el pecho desde ayer', '[\"tos\",\"sibilancias\"]', 'URGENCIA', 'Posible exacerbación asmática', 'Usar inhalador y acudir a consulta hoy', 'Neumología', NULL, NULL, '2026-04-13 21:42:28'),
(3, NULL, 'Tengo un poco de fiebre y dolor de cabeza', '[\"fiebre\",\"cefalea\"]', 'ESTABLE', 'Cuadro viral inespecífico', 'Hidratación, paracetamol y reposo', 'Medicina General', NULL, NULL, '2026-04-13 21:42:28'),
(4, NULL, 'hola', '[]', 'ESTABLE', 'Síntoma no especificado', 'Proporcionar más detalles sobre los síntomas', 'Medicina general', NULL, NULL, '2026-04-14 03:03:10'),
(5, NULL, 'me duele la cabeza', '[\"Dolor de cabeza\"]', 'ESTABLE', 'Dolor de cabeza leve', 'Tomar un analgésico y descansar', 'Medicina general', NULL, NULL, '2026-04-14 03:04:04'),
(6, NULL, 'hola', '[]', 'ESTABLE', 'Síntoma no especificado', 'Proporcionar más detalles sobre los síntomas', 'Medicina general', NULL, NULL, '2026-04-14 03:04:28'),
(7, 1, 'informame', '[\"dolor en el pecho\", \"falta de aliento\", \"mareo\"]', 'URGENCIA', 'Dolor en el pecho y falta de aliento', 'Acuda al servicio de urgencias más cercano', 'Cardiología', NULL, NULL, '2026-04-14 03:07:40'),
(8, 3, 'que datos tiene', '[]', 'ESTABLE', 'Paciente sano sin síntomas', 'Realizar chequeo médico de rutina', 'Pediatría', NULL, NULL, '2026-04-14 03:12:45'),
(9, 3, 'que sintomas tiene?', '[]', 'ESTABLE', 'Paciente sano sin síntomas', 'No requiere acción', 'Ninguna', NULL, NULL, '2026-04-14 03:13:09'),
(10, 1, 'informame lo de juan que tiene que sintomas tiene?', '[\"Dolor en el pecho\", \"Falta de aliento\"]', 'URGENCIA', 'Dolor en el pecho y falta de aliento', 'Acudir al servicio de emergencias para evaluación cardiológica', 'Cardiología', NULL, NULL, '2026-04-14 03:13:47'),
(11, 1, 'dame tus signos vitales de Juan', '[\"Hipertensi\\u00f3n\", \"Antecedentes de evento cardiovascular\"]', 'URGENCIA', 'Paciente con antecedentes de hipertensión', 'Realizar chequeo de signos vitales y evaluar síntomas', 'Cardiología', NULL, NULL, '2026-04-14 03:14:21'),
(12, 1, 'me duele el pecho y me falta el aire', '[\"dolor en el pecho\", \"falta de aliento\"]', 'EMERGENCIA', 'Dolor torácico y disnea en paciente hipertenso', 'Dado su antecedente de hipertensión y los síntomas actuales, acuda INMEDIATAMENTE a emergencias para evaluación cardiológica', 'Cardiología', NULL, NULL, '2026-04-14 03:19:11'),
(13, 1, 'Dime su diagnostico de Juan Perez Ramos', '[\"dolor tor\\u00e1cico\", \"disnea\"]', 'EMERGENCIA', 'Dolor torácico y disnea en paciente hipertenso', 'Dado su antecedente de hipertensión y los síntomas actuales, acuda INMEDIATAMENTE a emergencias para evaluación cardiológica', 'Cardiología', NULL, NULL, '2026-04-14 03:19:41'),
(14, 1, 'dame sus signos vitales', '[\"hipertensi\\u00f3n\", \"antecedentes de dolor tor\\u00e1cico\"]', 'URGENCIA', 'Paciente con hipertensión y antecedentes de dolor torácico', 'Dado su antecedente de hipertensión y los síntomas previos de dolor torácico, es importante que acuda a la cita programada para control de presión arterial y evalúe sus signos vitales actuales, como presión arterial, pulso y temperatura, y si presenta algún síntoma nuevo o empeoramiento, acuda al servicio de emergencias', 'Cardiología', NULL, NULL, '2026-04-14 03:20:17'),
(15, 1, 'que signos vitales tiene', '[\"hipertensi\\u00f3n\", \"antecedentes de dolor tor\\u00e1cico\"]', 'URGENCIA', 'Paciente hipertenso con antecedentes de dolor torácico', 'Dado su antecedente de hipertensión, es importante que acuda a la cita programada para control de presión arterial y evalúe sus signos vitales actuales, como presión arterial, pulso y temperatura', 'Cardiología', NULL, NULL, '2026-04-14 03:22:49'),
(16, 1, 'dame sus sintomas', '[]', 'URGENCIA', 'Hipertenso con antecedentes de dolor torácico', 'Dado su antecedente de hipertensión y los síntomas previos de dolor torácico, es importante que acuda a la cita programada para control de presión arterial y evalúe sus signos vitales actuales, como presión arterial, pulso y temperatura, y si presenta algún síntoma nuevo o empeoramiento, acuda al servicio de emergencias', 'Cardiología', NULL, NULL, '2026-04-14 03:25:40'),
(17, 1, 'cual es son sus medicamentos? ç', '[]', 'ESTABLE', 'Paciente hipertenso con medicación actual', 'Continuar con Enalapril 10mg/día como indicado, y asistir a la cita programada para control de presión arterial el 15/04/2026', 'Cardiología', NULL, NULL, '2026-04-14 03:27:13'),
(18, 5, 'dame sus datos', '[\"problemas de vista\", \"problemas de garganta\"]', 'ESTABLE', 'Paciente con antecedentes de problemas de vista y garganta', 'Considerar consulta con oftalmólogo y otorrinolaringólogo para evaluar problemas de vista y garganta, evitar el uso de toribio debido a alergia', 'Oftalmología y Otorrinolaringología', NULL, NULL, '2026-04-14 03:29:36'),
(19, NULL, 'hola hola hola hola Nero cabrón negro cabrón negro cabrón negro cabrón negro cabrón negro cabrón negro cabrón negro cabrón', '[]', 'ESTABLE', 'Comunicación confusa sin síntomas claros', 'Por favor, proporcione información clara y detallada sobre sus síntomas para una evaluación adecuada', 'Psiquiatría o Psicología', NULL, NULL, '2026-04-14 04:03:09'),
(20, NULL, 'Hola Me siento muy mal me duele la barriga qué hago', '[\"dolor abdominal\"]', 'URGENCIA', 'Dolor abdominal intenso', 'Acuda a un centro de salud para evaluación, considere hidratación y reposo', 'Gastroenterología', NULL, NULL, '2026-04-14 04:03:43'),
(21, 1, 'qué tiene Juan Pérez', '[\"dolor tor\\u00e1cico\", \"disnea\"]', 'URGENCIA', 'Hipertenso con antecedentes de dolor torácico', 'Dado su antecedente de hipertensión y los síntomas previos de dolor torácico, es importante que acuda a la cita programada para control de presión arterial y evalúe sus signos vitales actuales, como presión arterial, pulso y temperatura, y si presenta algún síntoma nuevo o empeoramiento, acuda al servicio de emergencias', 'Cardiología', NULL, NULL, '2026-04-14 04:03:58'),
(22, 1, 'hola', '[]', 'ESTABLE', 'Paciente hipertenso sin síntomas actuales', 'Continuar con Enalapril 10mg/día como indicado y asistir a la cita programada para control de presión arterial el 15/04/2026', 'Cardiología', NULL, NULL, '2026-04-14 05:51:24'),
(23, 1, 'cuales son suis sintomas', '[]', 'ESTABLE', 'Paciente hipertenso sin síntomas actuales', 'Continuar con Enalapril 10mg/día como indicado y asistir a la cita programada para control de presión arterial el 15/04/2026', 'Cardiología', NULL, NULL, '2026-04-14 05:51:41'),
(24, 1, 'tiene alergias?', '[]', 'ESTABLE', 'Paciente hipertenso sin síntomas actuales', 'Continuar con Enalapril 10mg/día como indicado y asistir a la cita programada para control de presión arterial el 15/04/2026', 'Cardiología', NULL, NULL, '2026-04-14 05:52:00'),
(25, 1, 'cual sus tratamiento', '[]', 'ESTABLE', 'Hipertenso controlado sin síntomas actuales', 'Continuar con Enalapril 10mg/día como indicado y asistir a la cita programada para control de presión arterial el 15/04/2026', 'Cardiología', NULL, NULL, '2026-04-14 05:52:55'),
(26, 1, 'cual es su resgo de vida', '[]', 'URGENCIA', 'Hipertenso controlado sin síntomas actuales', 'Dado su antecedente de hipertensión, es importante que acuda a la cita programada para control de presión arterial el 15/04/2026 y evalúe sus signos vitales actuales, como presión arterial, pulso y temperatura, y si presenta algún síntoma nuevo o empeoramiento, acuda al servicio de emergencias', 'Cardiología', NULL, NULL, '2026-04-14 05:56:40'),
(27, 1, 'sistomas', '[]', 'ESTABLE', 'Paciente hipertenso controlado sin síntomas actuales', 'Continuar con Enalapril 10mg/día como indicado y asistir a la cita programada para control de presión arterial el 15/04/2026. Dado su antecedente de hipertensión, es importante evaluar sus signos vitales actuales y reportar cualquier síntoma nuevo o empeoramiento', 'Cardiología', NULL, NULL, '2026-04-14 05:56:48'),
(28, 1, 'que enfermedad tiene', '[\"Hipertensi\\u00f3n\"]', 'ESTABLE', 'Paciente con hipertensión controlada', 'Continuar con Enalapril 10mg/día como indicado y asistir a la cita programada para control de presión arterial el 15/04/2026. Dado su antecedente de hipertensión, es importante evaluar sus signos vitales actuales y reportar cualquier síntoma nuevo o empeoramiento', 'Cardiología', NULL, NULL, '2026-04-14 05:58:58'),
(29, 1, 'riesgo', '[]', 'ESTABLE', 'Paciente hipertenso controlado sin síntomas nuevos', 'Continuar con Enalapril 10mg/día como indicado y asistir a la cita programada para control de presión arterial el 15/04/2026. Dado su antecedente de hipertensión, es importante evaluar sus signos vitales actuales y reportar cualquier síntoma nuevo o empeoramiento', 'Cardiología', NULL, NULL, '2026-04-14 05:59:08'),
(30, 1, 'diagnostico', '[]', 'ESTABLE', 'Paciente hipertenso controlado sin síntomas nuevos', 'Continuar con Enalapril 10mg/día como indicado y asistir a la cita programada para control de presión arterial el 15/04/2026. Dado su antecedente de hipertensión, es importante evaluar sus signos vitales actuales y reportar cualquier síntoma nuevo o empeoramiento', 'Cardiología', NULL, NULL, '2026-04-14 06:00:25'),
(31, 1, 'sintomas', '[]', 'ESTABLE', 'Paciente hipertenso controlado sin síntomas nuevos', 'Continuar con Enalapril 10mg/día como indicado y asistir a la cita programada para control de presión arterial el 15/04/2026. Dado su antecedente de hipertensión, es importante evaluar sus signos vitales actuales y reportar cualquier síntoma nuevo o empeoramiento', 'Cardiología', NULL, NULL, '2026-04-14 06:00:28'),
(32, 1, 'tratamient', '[]', 'ESTABLE', 'Paciente hipertenso controlado sin síntomas nuevos', 'Continuar con Enalapril 10mg/día como indicado y asistir a la cita programada para control de presión arterial el 15/04/2026. Dado su antecedente de hipertensión, es importante evaluar sus signos vitales actuales y reportar cualquier síntoma nuevo o empeoramiento', 'Cardiología', NULL, NULL, '2026-04-14 06:00:41'),
(33, 1, 'geyt', '[]', 'ESTABLE', 'Paciente con hipertensión controlada sin síntomas nuevos', 'Continuar con Enalapril 10mg/día como indicado y asistir a la cita programada para control de presión arterial el 15/04/2026. Dado su antecedente de hipertensión, es importante evaluar sus signos vitales actuales y reportar cualquier síntoma nuevo o empeoramiento', 'Cardiología', NULL, NULL, '2026-04-14 06:00:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_clinico`
--

CREATE TABLE `historial_clinico` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `medico_id` int(11) NOT NULL,
  `cita_id` int(11) DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `sintomas` text NOT NULL,
  `diagnostico` text NOT NULL,
  `tratamiento` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `signos_vitales` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`signos_vitales`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `historial_clinico`
--

INSERT INTO `historial_clinico` (`id`, `paciente_id`, `medico_id`, `cita_id`, `fecha`, `sintomas`, `diagnostico`, `tratamiento`, `observaciones`, `signos_vitales`) VALUES
(1, 1, 1, NULL, '2026-04-13 21:42:28', 'Cefalea ocasional, presión elevada en casa', 'Hipertensión arterial estadio 1 - controlada', 'Continuar Enalapril 10mg/día, dieta hiposódica', 'Paciente adherente al tratamiento', '{\"presion\":\"140/90\",\"pulso\":78,\"temp\":36.7,\"peso\":82}'),
(2, 4, 1, NULL, '2026-04-13 21:42:28', 'Fatiga, sed excesiva', 'Diabetes mellitus tipo 2 descompensada', 'Ajustar Metformina a 1000mg 2x/día, derivar a nutrición', 'Glicemia en ayunas: 180 mg/dL', '{\"presion\":\"130/85\",\"pulso\":82,\"temp\":36.5,\"glicemia\":180}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamentos_recetados`
--

CREATE TABLE `medicamentos_recetados` (
  `id` int(11) NOT NULL,
  `historial_id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `dosis` varchar(50) DEFAULT NULL,
  `frecuencia` varchar(100) DEFAULT NULL,
  `duracion_dias` int(11) DEFAULT NULL,
  `indicaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `medicamentos_recetados`
--

INSERT INTO `medicamentos_recetados` (`id`, `historial_id`, `nombre`, `dosis`, `frecuencia`, `duracion_dias`, `indicaciones`) VALUES
(1, 1, 'Enalapril', '10mg', '1 vez al día (mañana)', 30, 'Tomar con alimentos'),
(2, 2, 'Metformina', '1000mg', 'Cada 12 horas', 30, 'Tomar con las comidas principales'),
(3, 2, 'Atorvastatina', '20mg', '1 vez al día (noche)', 30, 'Tomar antes de dormir');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `cmp` varchar(20) NOT NULL,
  `especialidad` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `horario` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`id`, `usuario_id`, `cmp`, `especialidad`, `telefono`, `horario`) VALUES
(1, 2, 'CMP-12345', 'Medicina General', '999111222', 'Lun-Vie 08:00-14:00'),
(2, 3, 'CMP-67890', 'Pediatría', '999333444', 'Lun-Sab 14:00-20:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
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
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `dni`, `nombres`, `apellidos`, `fecha_nacimiento`, `sexo`, `telefono`, `email`, `direccion`, `tipo_sangre`, `alergias`, `antecedentes`, `medicamentos_actuales`, `fecha_registro`, `updated_at`, `activo`) VALUES
(1, '12345678', 'Juan', 'Pérez Ramos', '1985-03-15', 'M', '987654321', 'juan@mail.com', NULL, 'O+', 'Penicilina', 'Hipertensión diagnosticada 2020', 'Enalapril 10mg/día', '2026-04-13 21:42:28', '2026-04-13 21:42:28', 1),
(2, '87654321', 'María', 'Silva Gómez', '1990-07-22', 'F', '987111222', 'maria@mail.com', NULL, 'A+', 'Ninguna', 'Asma leve', 'Salbutamol inhalador PRN', '2026-04-13 21:42:28', '2026-04-13 21:42:28', 1),
(3, '11223344', 'Pedro', 'Castro Luna', '2015-11-05', 'M', '987333444', NULL, NULL, 'B+', 'Mariscos', 'Sano', NULL, '2026-04-13 21:42:28', '2026-04-13 21:42:28', 1),
(4, '55667788', 'Lucía', 'Fernández Rey', '1978-01-30', 'F', '987555666', 'lucia@mail.com', NULL, 'AB+', 'AINES', 'Diabetes tipo 2, sobrepeso', 'Metformina 850mg 2x/día', '2026-04-13 21:42:28', '2026-04-13 21:42:28', 1),
(5, '74883675', 'jean', 'chamorro', '2006-01-18', 'M', '946087675', 'chamorrocg021@gmai.com', 'Lima', 'A++', 'alergico a toribio', '1. estoy mal de la vista \n2. opercion de la hernia inguinal\n3. estoy mal de la garganta', 'pildoras de las buenas\nibuprofeno', '2026-04-14 03:29:23', '2026-04-14 03:29:23', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `rol` enum('admin','medico','recepcion') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `password_hash`, `nombre`, `rol`, `activo`, `fecha_registro`, `updated_at`) VALUES
(1, 'admin@medicai.com', '$2b$12$KIXoL6Jg3fEYI3p9wqZfUuqQ3vH0Jt5L8bN0aXqZzQYjR4q5a0p6S', 'Administrador', 'admin', 1, '2026-04-13 21:42:27', '2026-04-13 21:42:27'),
(2, 'dr.garcia@medicai.com', '$2b$12$KIXoL6Jg3fEYI3p9wqZfUuqQ3vH0Jt5L8bN0aXqZzQYjR4q5a0p6S', 'Dr. Carlos García', 'medico', 1, '2026-04-13 21:42:27', '2026-04-13 21:42:27'),
(3, 'dra.lopez@medicai.com', '$2b$12$KIXoL6Jg3fEYI3p9wqZfUuqQ3vH0Jt5L8bN0aXqZzQYjR4q5a0p6S', 'Dra. Ana López', 'medico', 1, '2026-04-13 21:42:27', '2026-04-13 21:42:27'),
(4, 'recepcion@medicai.com', '$2b$12$KIXoL6Jg3fEYI3p9wqZfUuqQ3vH0Jt5L8bN0aXqZzQYjR4q5a0p6S', 'María Torres', 'recepcion', 1, '2026-04-13 21:42:27', '2026-04-13 21:42:27');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_citas_paciente` (`paciente_id`),
  ADD KEY `idx_citas_medico` (`medico_id`),
  ADD KEY `idx_citas_fecha` (`fecha_hora`),
  ADD KEY `idx_citas_estado` (`estado`);

--
-- Indices de la tabla `consultas_triaje`
--
ALTER TABLE `consultas_triaje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_triaje_paciente` (`paciente_id`),
  ADD KEY `idx_triaje_nivel` (`nivel`),
  ADD KEY `idx_triaje_fecha` (`fecha_creacion`),
  ADD KEY `fk_triaje_cita` (`derivada_a_cita_id`);

--
-- Indices de la tabla `historial_clinico`
--
ALTER TABLE `historial_clinico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_historial_paciente` (`paciente_id`),
  ADD KEY `idx_historial_fecha` (`fecha`),
  ADD KEY `fk_historial_medico` (`medico_id`),
  ADD KEY `fk_historial_cita` (`cita_id`);

--
-- Indices de la tabla `medicamentos_recetados`
--
ALTER TABLE `medicamentos_recetados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_medicamentos_historial` (`historial_id`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`),
  ADD UNIQUE KEY `cmp` (`cmp`),
  ADD KEY `idx_medicos_especialidad` (`especialidad`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD KEY `idx_pacientes_dni` (`dni`),
  ADD KEY `idx_pacientes_apellidos` (`apellidos`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_usuarios_email` (`email`),
  ADD KEY `idx_usuarios_rol` (`rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `consultas_triaje`
--
ALTER TABLE `consultas_triaje`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `historial_clinico`
--
ALTER TABLE `historial_clinico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `medicamentos_recetados`
--
ALTER TABLE `medicamentos_recetados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `fk_citas_medico` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`),
  ADD CONSTRAINT `fk_citas_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `consultas_triaje`
--
ALTER TABLE `consultas_triaje`
  ADD CONSTRAINT `fk_triaje_cita` FOREIGN KEY (`derivada_a_cita_id`) REFERENCES `citas` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_triaje_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `historial_clinico`
--
ALTER TABLE `historial_clinico`
  ADD CONSTRAINT `fk_historial_cita` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_historial_medico` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`),
  ADD CONSTRAINT `fk_historial_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `medicamentos_recetados`
--
ALTER TABLE `medicamentos_recetados`
  ADD CONSTRAINT `fk_medicamentos_historial` FOREIGN KEY (`historial_id`) REFERENCES `historial_clinico` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `fk_medicos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
