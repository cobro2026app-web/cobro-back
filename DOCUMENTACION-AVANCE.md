# Documentación del avance del backend de Cobro

## 1. Resumen general

Este proyecto es un backend en NestJS para una aplicación de gestión con usuarios, roles, permisos, credenciales y autenticación. La estructura base ya está montada y se han implementado varios módulos y relaciones de negocio.

Actualmente el proyecto está organizado en módulos por dominio:

- Usuario
- Rol
- Permiso
- RolPermiso
- Credencial
- Configuración global
- Base de datos

## 2. Stack tecnológico

El backend usa principalmente:

- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT para autenticación
- Class Validator / Class Transformer
- Passport y Passport JWT
- ConfigModule para variables de entorno

Dependencias relevantes del proyecto:

- @nestjs/config
- @nestjs/typeorm
- typeorm
- mysql2 / mariadb
- @nestjs/jwt
- @nestjs/passport
- passport-jwt
- argon2
- class-validator

## 3. Estructura principal del proyecto

La organización actual es la siguiente:

- src/app.module.ts: módulo raíz que importa todos los módulos principales
- src/config/config.module.ts: configuración global de variables de entorno
- src/database/database.module.ts: conexión a MySQL con TypeORM
- src/usuario/: módulo de usuarios
- src/rol/: módulo de roles
- src/permiso/: módulo de permisos
- src/rol-permiso/: módulo de relación rol-permiso
- src/credencial/: módulo de autenticación y login

## 4. Configuración de la aplicación

La configuración global de variables de entorno está definida en:

- src/config/config.module.ts

Se carga un objeto de configuración para la base de datos desde variables de entorno:

- DB_HOST
- DB_PORT
- DB_USERNAME
- DB_PASSWORD
- DB_DATABASE

Además, en la conexión a la base de datos se configura:

- type: mysql
- autoLoadEntities: true
- synchronize: true en entorno de desarrollo
- logging: true en entorno de desarrollo

Esto está en:

- src/database/database.config.ts
- src/database/database.module.ts

## 5. Módulos ya creados

### 5.1 AppModule

En src/app.module.ts se registran todos los módulos principales:

- AppConfigModule
- DatabaseModule
- UsuariosModule
- RolModule
- PermisoModule
- CredencialModule
- RolPermisoModule

Esto indica que la aplicación ya está preparada para arrancar con la estructura de dominio completa.

### 5.2 Módulo de usuarios

La base del módulo de usuarios ya está creada en:

- src/usuario/usuario.module.ts
- src/usuario/usuario.controller.ts
- src/usuario/usuario.service.ts

Lo más importante implementado hasta ahora:

- endPoint: POST /usuario/admin
- validación con DTO
- chequeo de documento duplicado
- chequeo de email duplicado
- búsqueda del rol ADMIN
- creación del usuario en una transacción
- creación de la credencial asociada en la misma transacción

La lógica principal está en UsuarioService.crearAdmin().

#### Flujo actual de creación de administrador

1. Verifica si el documento ya existe.
2. Verifica si el correo ya existe.
3. Busca un rol con código ADMIN.
4. Crea el usuario con estado ACTIVO.
5. Crea la credencial con username y password.
6. Retorna un mensaje de éxito si todo fue correcto.

### 5.3 Módulo de credenciales

El módulo de credenciales ya incluye:

- src/credencial/credencial.controller.ts
- src/credencial/credencial.service.ts
- src/credencial/entities/credencial.entity.ts

#### Endpoints implementados

- POST /credencial/login

#### Funcionalidad actual del login

- Busca la credencial por username
- carga el usuario y su rol
- valida que la credencial esté ACTIVA
- valida que el usuario esté ACTIVO
- compara la contraseña recibida con la contraseña almacenada en passwordHash
- actualiza ultimoLogin
- genera un JWT con payload que incluye:
  - sub
  - username
  - rol
- retorna accessToken y datos básicos del usuario

## 6. Entidades principales

### Usuario
Archivo: src/usuario/entities/usuario.entity.ts

Campos principales:

- id: uuid
- nombre
- apellido
- documento (único)
- telefono (opcional)
- email (único, opcional)
- rolId
- rol: relación con Rol
- estado: ACTIVO / INACTIVO
- createdById / createdBy: relación con otro usuario
- createdAt
- updatedAt

### Credencial
Archivo: src/credencial/entities/credencial.entity.ts

Campos principales:

- id: uuid
- username (único)
- passwordHash
- ultimoLogin
- estado
- usuarioId
- usuario: relación 1:1 con Usuario
- createdAt
- updatedAt

### Rol
Archivo: src/rol/entities/rol.entity.ts

Campos principales:

- id
- codigo (único)
- nombre (único)
- descripcion
- estado
- relación con usuarios
- relación con permisos

## 7. Endpoints y controladores actuales

### Usuario

- POST /usuario/admin

### Credencial

- POST /credencial/login

### Resto de módulos

Los controladores de rol, permiso y rol-permiso ya están creados, pero sus servicios siguen como placeholders generados por NestJS:

- create()
- findAll()
- findOne()
- update()
- remove()

Esto indica que la estructura de API existe, pero aún no está implementada la lógica real de negocio.

## 8. Lo que ya está funcionando conceptualmente

Hasta este momento, la base del backend tiene estas piezas construidas:

- proyecto NestJS arrancable en estructura
- módulos separados por dominio
- conexión con base de datos MySQL
- configuración global por entorno
- validación de DTOs
- transacción para creación de usuario + credencial
- identidad y login básico con JWT
- relaciones entre entidades clave

## 9. Observaciones importantes del estado actual

### 9.1 Inseguridad en contraseña

Actualmente la comparación del login no usa hash seguro. La app ya incluye la dependencia argon2, pero en el código actual se compara directamente:

- dto.password === credencial.passwordHash

Esto significa que la contraseña se está manejando como texto plano en la lógica actual y no está hasheada ni verificada con una librería de hashing segura.

### 9.2 Servicios de rol y permiso no están finalizados

Los módulos de rol, permiso y rol-permiso tienen controladores y servicios creados, pero aún no tienen lógica real de CRUD ni integración con la base de datos.

### 9.3 Estado de ejecución

La última ejecución conocida fue:

- npm run start:dev
- resultado: exit code 1

Esto indica que el proyecto aún requiere revisión para dejarlo completamente funcionando en ejecución local.

## 10. Siguientes pasos recomendados

1. Corregir la conexión y arranque de la aplicación
2. Completar CRUD de roles, permisos y relación rol-permiso
3. Implementar hash seguro con argon2 para passwords
4. Añadir guards y estrategia JWT para proteger rutas
5. Configurar variables de entorno reales (.env)
6. Reforzar validaciones y manejo de errores
7. Crear pruebas unitarias para usuarios y credenciales
8. Definir roles y permisos reales del negocio

## 11. Estado final del avance

El proyecto ya tiene una base sólida en NestJS con arquitectura modular, entidades principales, conexión a base de datos, lógica de alta de administrador y autenticación básica con JWT. El siguiente paso importante es dejarlo funcionando completamente en ejecución y terminar la lógica de autorización y administración de roles/permisos.
