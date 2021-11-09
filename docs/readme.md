# DataWarehouse
## Proyecto Final - ACAMICA

### Descripcion del proyecto:
Sitio web que permita realizar operaciones CRUD a una base de datos de contactos que incluyen sus datos personales, sus preferencias, datos de contacto, lugar donde trabajan, y lugar donde viven.

### Requisitos para arrancar aplicacion
    - Node JS
    - MariaBD o MySQL
    - NPM

### Dependencias utilizadas:

    - mariaDB
    - express
    - dotenv
    - helmet
    - jsonwebtoken
    - mysql2
    - sequelize
    - bcrypt

### Instalacion de Dependencias:

```
$ npm install
```

### Configuracion de Servidor y Base de Dato


Seguido de instalar la dependencias de requeridas, se debe crear la base de datos a traves de alguna herramienta de administracion de base de datos, ejecutando el siguiente comando:

```
CREATE DATABASE warehouse;
```

Luego para la creacion del modelo de tablas, registros generales y usuario ADMIN del sistema, se deben ejecutar todas las sentencias SQL que se encuentran en archivo *warehouse.sql*, a traves de una herramienta de administracion de base de datos.


Por ultimo se deben agregar los valores de los parametros de la base de datos y datos de configuracion del servidor en el archivo *.env*:

- PORT (Puerto del servidor)
- JWT_SECRET (password para verificar token)
- NODE_ENV (ambiente del entorno)
- **USER_ADMIN (Email del Administrador Inicial, el mismo que se encuentra en la sentencia insert dentro del archivo warehouse.sql)**
- DB_HOST  (Host donde esta localizada la DB)
- DB_PORT  (Puerto donde esta localizada la DB)
- DB_USER  (Usuario de la DB)
- DB_PASSWORD (Password de la DB)
- DB_NAME  (Nombre con la que fue creada la base de dato)

**ejemplo:**
```
PORT=3000
JWT_SECRET=s1da0spqxAws3adfAdWxP4aQ3s9
NODE_ENV=development
USER_ADMIN=admin@datawarehouse.com

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=0000
DB_NAME=warehouse

```

### Instrucciones de iniciar servidor

Para iniciar el servidor, ubicarse en la raiz del repositorio y ejecutar el siguiente comando desde la consola:

```
$ npm run dev
```

### Ingresar al sitio web

Ingresar al sitio web en la ruta /index.html dentro del servidor:puerto que fueron configurados previamente.

Ejemplo: http://localhost:3000/index.html

Realizar login con las siguientes credenciales:
```
email: admin@datawarehouse.com
contraseña: 12345678
```


 