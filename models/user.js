var mysql = require('mysql');
var md5 = require('MD5');

module.exports = {

  createToken: function(pws){

  },

  registerNewUser: function(req,res,connection) {
    return new Promise(function(resolve,reject){
      var query = "INSERT INTO ??(??,??) VALUES (?,?)";
      var table = ["user_login","user_email","user_password",req.body.email,md5(req.body.password)];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              reject({"error" : true, "message" : "Error executing MySQL query"});
          } else {
              resolve({"error" : false, "message" : "User Added !"});
          }
      });
    });
  },

  loginUser: function(req,res,connection) {
    return new Promise(function(resolve,reject){
      var query = "SELECT * FROM ?? WHERE ?? = ?"
      var table = ['user_login','user_email',req.body.email];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
        if(err) {
          reject({"error": true, "message" : "Error in MySQL query"});
        }else {
          if(md5(req.body.password) === rows[0].user_password) {
            var user = {}
            user.id = rows[0].user_id;
            user.email = rows[0].user_email;
            user.password = rows[0].user_password;
            resolve({"error": false, "data" : user});
          }else{
            reject({"error": true, "message": "Password Mismatch. Sorry Dawg"})
          }
        }
      })
    });
  },

  getUsers: function(req,res,connection) {
    return new Promise(function(resolve,reject){
      var query = "SELECT * FROM ??";
      var table = ["user_login"];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
            reject({"Error" : true, "Message" : "Error executing MySQL query"});
          } else {
            resolve({"Error" : false, "Message" : "Success", "Users" : rows});
          }
      });
    });
  },

  getUser: function(req,res,connection) {
    return new Promise(function(resolve,reject){
      var query = "SELECT * FROM ?? WHERE ??=?";
      var table = ["user_login","user_id",req.params.user_id];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              reject({"Error" : true, "Message" : "Error executing MySQL query"});
          } else {
              resolve({"Error" : false, "Message" : "Success", "Users" : rows});
          }
      });
    });
  },

  changePassword: function(req,res,connection) {
    return new Promise(function(resolve,reject){
      var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      var table = ["user_login","user_password",md5(req.body.password),"user_email",req.body.email];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Message" : "Error executing MySQL query"});
          } else {
              res.json({"Error" : false, "Message" : "Updated the password for email "+req.body.email});
          }
      });
    });
  },

  deleteUser: function(req,res,connection) {
    return new Promise(function(resolve,reject){
      var query = "DELETE from ?? WHERE ??=?";
      var table = ["user_login","user_email",req.params.email];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Message" : "Error executing MySQL query"});
          } else {
              res.json({"Error" : false, "Message" : "Deleted the user with email "+req.params.email});
          }
      });
    });
  }

}







