var mysql = require("mysql");
var User = require('./models/user.js');
function REST_ROUTER(app,router,connection,md5,tokenHandler) {
    var self = this;
    self.handleRoutes(app,router,connection,md5,tokenHandler);
}

REST_ROUTER.prototype.handleRoutes= function(app,router,connection,md5,tokenHandler) {

    app.post("/authenticate",function(req,res){
      User.loginUser(req,res,connection)
        .then(function(rsp){
          rsp.token = tokenHandler.createToken(rsp.data);
          res.json(rsp);
        },function(err){
          res.json(err);
        });
    });

    app.post("/register",function(req,res){
        User.registerNewUser(req,res,connection)
          .then(function(rsp){
            res.json(rsp);
          },function(err){
            res.json(err);
          });
    });

    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });

    router.get("/users",function(req,res){
        User.getUsers(req,res,connection)
          .then(function(rsp){
            res.json(rsp);
          },function(err){
            res.json(err);
          });
    });

    router.get("/users/:user_id",function(req,res){
        User.getUser(req,res,connection)
          .then(function(rsp){
            res.json(rsp);
          },function(err){
            res.json(err);
          });
    });

    router.put("/users",function(req,res){
        User.changePassword(req,res,connection)
          .then(function(rsp){
            res.json(rsp);
          },function(err){
            res.json(err);
          });
    });

    router.delete("/users/:email",function(req,res){
        User.deleteUser(req,res,connection)
          .then(function(rsp){
            res.json(rsp);
          },function(err){
            res.json(err);
          });
    });
}

module.exports = REST_ROUTER;