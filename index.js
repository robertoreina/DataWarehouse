const config = require('./config');

// *Cargamos el fichero app.js con la configuración de Express
var app = require('./app');

// Obtenemos conexion a base de datos
var connection = require('./connection');


// Levanta documentacion swagger en modo desarrollo
// if (config.env === 'development') {
//     const swaggerUi = require('swagger-ui-express');
//     const YAML = require('yamljs');
//     const swaggerDocument = YAML.load('./docs/spec.yaml');
//     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// }

// verificamos conexion
connection.authenticate()
    .then(res => {
        console.log('DB connected!');

        app.listen(config.port, () => {
            console.log(`server started on port ${config.port}`)
        });
    })
    .catch(err => {
        console.log(err);
    });


