Users = new Mongo.Collection("users");
Task = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  
  
  // This code only runs on the client
  Template.body.helpers({
    
    showUser:function(){
      return Session.get("listuser");
    },
    addUser:function(){
      return Session.get("adduser");
    },
    profile:function(){
      return Session.get("profile");
    },
    task:function(){
      return Session.get("addtask");
    }
 
  });
  
  Template.UsersList.helpers({
    users: function () {
      return Users.find({});
    }

  });
  
  
  
  Template.body.events({
    
    'click .listuser':function(event){
      Session.set("listuser",true);
      Session.set("profile",false);
      Session.set("adduser",false);
      Session.set("addtask",false);
    },
    'click .adduser':function(event){
      Session.set("adduser",true);
      Session.set("listuser",false);
      Session.set("profile",false);
      Session.set("addtask",false);
    },
    'click .addtask':function(event){
      
      Session.set("addtask",true);
      Session.set("adduser",false);
      Session.set("listuser",false);
      Session.set("profile",false);
      $("#datepicker").datepicker();
    }
    
    
    
  });
  
  Template.user.events({
    
    'click a': function (event) {
      Session.set("profile",true);
      Session.set("adduser",false);
      Session.set("listuser",false);
      Session.set("clickedUser",event.target.id);
      //var profile = Users.findOne({_id:event.target.id});
    },
    
    'click .delete': function (event) { 
      Users.remove({_id:event.target.id});
    }
  
  
  });
  
  
  Template.createUser.events({
    
    "submit .new-user": function (event) {
      var name = event.target.name.value;
      var email = event.target.email.value;
      var checker = Users.findOne({email:email});
      if(typeof checker=='undefined')
      {
        Users.insert({
          name: name,
          email:email,
          pendingTasks:[],
          createdAt: new Date() // current time
        });
        // Clear form
        event.target.text.value = "";
      }
      else
        alert("email being used!!");
      // Prevent default form submit
      return false;
    }
  
    
  });
 
  
  Template.userProfile.helpers({
    details: function(){
        var id = Session.get("clickedUser");
        return Users.find({_id:id});
      },
    taskDetails: function(){
      var id = Session.get("clickedUser");
      return Tasks.find({assignedUser:id});
    }
  });
  
  Template.addTask.rendered=function() {
    $('#my-datepicker').datepicker();
  }
  
  Template.getTask.helpers({
  
  });

  
  
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


