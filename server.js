const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
// const authMiddleware = require('./middlerwares/auth.moddleware');
const handlebars = require("handlebars");
const app = express();

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
handlebars.registerHelper("inc", function(value, options) {
    return parseInt(value) + 1;
});

handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));
//handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

// Body Parser
app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

//CORS Middleware
app.use(function(req, res, next) {
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin,Accept, Content-Type, Authorization, x-id, Content-Length, X-Requested-with');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    next();
});

// Index route
app.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "This is index page!"
    });
});

// app.use('/auth', require('./routes/user/auth.route'));
//app.use('/api', authMiddleware.checkToken, require('./routes/index'));
app.use('/api', require('./routes/index'));

const PORT = process.env.PORT || 8008;

app.listen(PORT, console.log(`Server started on port ${PORT}`));