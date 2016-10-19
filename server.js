var express = require("express");
var mysql = require("mysql");
var morgan = require('morgan');
var bodyParser = require("body-parser");
var md5 = require('MD5');
var jwt = require('jsonwebtoken');
var rest = require("./REST.js");
var app  = express();

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

//set Application Secret !IMPORTANT Change it so it is secret
app.set('superSecret', 'mydickhurts');

function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : 'food8wine',
        database : 'restful_api_demo',
        debug    :  false
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
}

REST.prototype.tokenHandler = {

  verifyToken: function(token, cb) {
    try {
      var decoded = jwt.verify(token, app.get('superSecret'));
    } catch(err) {
      return cb(new Error(err.message));
    }
    return cb(false, decoded);
  },

  createToken: function(user) {
    var token = jwt.sign(user, app.get('superSecret'));
    return token
  }
}

REST.prototype.configureExpress = function(connection) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      router.use(function(req, res, next) {
        var token = req.headers['x-access-token'];
        if (token) {
          self.tokenHandler.verifyToken(token,function(err, decoded){
            if(err){
              return res.json({"error": true, "message": err.message});
            }
            req.decoded = decoded
            next();
          });
        }else {
          return res.status(403).send({ 
              success: false, 
              message: 'No token provided.' 
          });
        }
      });
      app.use('/api', router);
      var rest_router = new rest(app,router,connection,md5,self.tokenHandler);
      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(3000,function(){
          console.log("All right ! I am alive at Port 3000.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();