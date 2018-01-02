var express = require('express');
var app = express();

var path = require('path');                     // Modulo que me permite manejar las rutas
var mongoose = require('mongoose');             // Modulo que me permite conectarme a mongodb
var passport = require('passport');             // Modulo que me permite ver la forma en la que me conecto a la app
var flash = require('connect-flash');           // Modulo que me permite mandar mensajes al usuario
var morgan = require('morgan');                 // Modulo que me permite definir los métodos http y mostrarlos por consola
var cookieParser = require('cookie-parser');    // Modulo que me permite administrar las cookies
var bodyParser = require('body-parser');        // Modulo que me permite convertir el cuerpo del navegador al servidor
var session = require('express-session');       // Modulo que me permite manejar las sesiones

const { url } = require('./config/database.js');

mongoose.connect(url, {
        useMongoClient: true
});
require('./config/passport')(passport);


// ## SETTINGS ##
var port = process.env.PORT || 8081;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// ## MIDDLEWARES ##
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));  // El extended: false es porque quiero procesar datos y no imagenes

// ## Necesario para passport ##
app.use(session({ 
        secret: 'shhsecret', 
        resave: false,                  // No se guarde cada cierto tiempo
        saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// ## ROUTES ##
require('./app/routes.js')(app, passport);


// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// START SERVER
app.listen(port, () => {
        console.log("Servidor arrancado en puerto, ", port),
        console.log("Funcionando en, https://gco-alu0100851236.c9users.io");
});
