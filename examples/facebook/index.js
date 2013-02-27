var Hapi = require('hapi');
var Travelogue = require('../../');
var Passport = require('passport-debug');


var config = require('./config.json');
var server = new Hapi.Server('localhost', config.port, config);
Travelogue.configure(server, Passport, config);


Passport.use(new FacebookStrategy(config.passport.facebook, function (accessToken, refreshToken, profile, done) {

    return done(null, profile);
}));
Passport.serializeUser(function(user, done) {

    done(null, user);
});
Passport.deserializeUser(function(obj, done) {

    done(null, obj);
});


// addRoutes
server.addRoute({
    method: 'GET',
    path: '/',
    config: {
        handler: Travelogue.ensureAuthenticated(function (request) {

            // If logged in already, redirect to /home
            // else to /login
            request.reply.redirect('/home').send();
        })
    }
});

server.addRoute({
    method: 'GET',
    path: '/auth/facebook',
    config: {
        // can use either passport.X or Travelogue.passport.X
        handler: Passport.authenticate('facebook')
    }
});
server.addRoute({
    method: 'GET',
    path: '/auth/facebook/callback',
    config: {
        handler: Travelogue.passport.authenticate('facebook', function (request) {

            request.reply.redirect('/').send();
        })
    }
});

server.start(function () {

    console.log('server started on port ' + config.port);
})