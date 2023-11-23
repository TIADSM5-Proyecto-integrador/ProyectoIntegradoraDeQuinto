const express = require('express');
const path = require('path');
const methodOverrride = require('method-override');
const session = require('express-session');
let exphbs = require('express-handlebars');
let flash = require('connect-flash');
let passport = require('passport');

//initialization
const app = express();
require('./database');
require('./config/passport');

//Settins
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, "views"));
app.engine('hbs', exphbs.engine({
    defaultLayout:__dirname + '/views/layout/main',

    layoutDir: "views/layout",
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}));

app.set('view engine', 'hbs');

//middlewares

app.use(express.urlencoded({extended: false}));
app.use(methodOverrride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//global variables

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//routes
app.use(require('./routes/index.js'));
app.use(require('./routes/notes.js'));
app.use(require('./routes/users.js'));

//static files
app.use(express.static(path.join(__dirname, 'public')))


//server is listenning
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});