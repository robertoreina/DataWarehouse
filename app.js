const express = require('express');
const helmet = require('helmet');

// import routes 
var user_routes = require('./routes/user'); 
var login_routes = require('./routes/login'); 
var country_routes = require('./routes/country'); 
var region_routes = require('./routes/region'); 
var city_routes = require('./routes/city'); 
var company_routes = require('./routes/company'); 
var contact_routes = require('./routes/contact'); 
var preference_routes = require('./routes/preferences'); 
var contactChanel_routes = require('./routes/contactChanel'); 

// import middlewares
const ensureAuth = require('./middlewares/authenticated');

var app = express();

const apiPath = '/api';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());


app.use('/', express.static('./client'));

// login Route load
app.use(apiPath, login_routes);

// authentication middeleware 
app.use(apiPath, ensureAuth);

// routes load 
app.use(apiPath, user_routes);
app.use(apiPath, region_routes);
app.use(apiPath, country_routes);
app.use(apiPath, city_routes);
app.use(apiPath, company_routes);
app.use(apiPath, contact_routes);
app.use(apiPath, contactChanel_routes);
app.use(apiPath, preference_routes);


module.exports = app;