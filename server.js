var express = require('express'),
    path = require('path'),
    routes = require('./server/routes'),
    exphbs = require('express-handlebars'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    moment = require('moment'),
    multer = require('multer'),
    mongoose = require('mongoose');

var app = express();

app.use(multer({ dest: path.join(__dirname, 'public/upload/temp')}));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser('some-secret-value-here'));
app.use('/public/', express.static(path.join(__dirname, '../public')));

var hbs = exphbs.create({
	defaultLayout: 'main',
        layoutsDir: app.get('views') + '/layouts',
        partialsDir: [app.get('views') + '/partials'],
    helpers: {
            timeago: function(timestamp) {
                console.log(timestamp);
                return moment(timestamp).startOf('minute').fromNow();
            }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

if ('development' === app.get('env')) {
	app.use(errorHandler());
}

routes(app);    

app.set('port', process.env.PORT || 3300);
app.set('views', __dirname + '/views');

mongoose.connect('mongodb://localhost/memesta');
mongoose.connection.on('open', function() {
	console.log('Mongoose connected!');
});



var server = app.listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});

