-- --------------------------------------------------------
-- 1. Insertar Usuarios
-- Contraseña para todos: "1234" (codificada con BCrypt)
-- --------------------------------------------------------

INSERT INTO usuario (username, password, email, rol) VALUES
                                                         ('admin_jefe', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'admin@empresa.com', 'ADMIN'),
                                                         ('luis_garcia', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'luis@empresa.com', 'USER'),
                                                         ('ana_perez', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'ana@empresa.com', 'USER'),
                                                         ('david_romero', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'david@empresa.com', 'USER');

-- --------------------------------------------------------
-- 2. Insertar Tareas
-- Asignadas a los IDs generados arriba (asumiendo IDs 1, 2, 3, 4)
-- --------------------------------------------------------

INSERT INTO tarea (titulo, descripcion, fecha_creacion, fecha_vencimiento, estado, id_usuario) VALUES
-- Tareas para el Admin (ID 1)
('Revisar logs del servidor', 'Comprobar accesos no autorizados del fin de semana', '2023-10-01', '2023-10-05', 'COMPLETADA', 1),
('Actualizar licencias', 'Renovar la licencia de IntelliJ para el equipo', '2023-10-10', '2023-10-20', 'PENDIENTE', 1),

-- Tareas para Luis (ID 2)
('Desarrollar Login', 'Implementar autenticación JWT en el backend', '2023-10-02', '2023-10-15', 'EN_PROGRESO', 2),
('Corregir bug #404', 'El usuario no puede subir avatares .png', '2023-10-11', '2023-10-12', 'PENDIENTE', 2),
('Reunión con cliente', 'Presentar avance del módulo de ventas', '2023-10-12', '2023-10-12', 'COMPLETADA', 2),

-- Tareas para Ana (ID 3)
('Diseñar BBDD', 'Crear diagrama ER para el nuevo microservicio', '2023-09-25', '2023-10-01', 'COMPLETADA', 3),
('Documentar API', 'Actualizar Swagger con los nuevos endpoints', '2023-10-05', '2023-10-25', 'EN_PROGRESO', 3),

-- Tareas para David (ID 4)
('Test unitarios', 'Aumentar cobertura de tests en el servicio de usuarios', '2023-10-08', '2023-10-18', 'PENDIENTE', 4),
('Optimizar consultas', 'Mejorar query de búsqueda de productos', '2023-10-09', '2023-10-15', 'PENDIENTE', 4),
('Maquetar Home', 'Aplicar nuevos estilos CSS recibidos de diseño', '2023-10-01', '2023-10-03', 'COMPLETADA', 4);