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
      return Session.get("tasks");
    },
    addtask:function(){
      return Session.get("addTasks");
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
      Session.set("addTasks",false);
      Session.set("profile",false);
      Session.set("adduser",false);
      Session.set("tasks",false);
    },
    'click .adduser':function(event){
      Session.set("adduser",true);
      Session.set("addTasks",false);
      Session.set("listuser",false);
      Session.set("profile",false);
      Session.set("tasks",false);
    },
    'click .tasks':function(event){
      
      Session.set("tasks",true);
      Session.set("addTasks",false);
      Session.set("adduser",false);
      Session.set("listuser",false);
      Session.set("profile",false);
    },
    'click .addTasks':function(event){
      
      Session.set("addTasks",true);
      
      Session.set("tasks",false);
      
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
      
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if(re.test(email)==false){
        alert('This is not an email form');
        return false;
      }
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
    Completed: function(){
      var id = Session.get("clickedUser");
      var taskDetail= Task.find({assignedUser:id,completed:true});
      return taskDetail;
    },
    notCompleted: function(){
      var id = Session.get("clickedUser");
      var taskDetail= Task.find({assignedUser:id,completed:false});
      return taskDetail;
    }
  
  });
  
  
  
  Template.userProfile.events({
    
    'click .completedButton': function (event) {
      
      Task.update(event.target.id,{$set:{completed:true}});
    },
    'click .uncompletedButton': function (event) { 
      Task.update(event.target.id,{$set:{completed:false}});
    },
    'click .getCompleted':function(event){
      $('.completed').toggle();
    }
  
  });
  
  
  Template.addTask.events({
    
    "submit .new-task": function (event) {
      
      alert("clicked");
      var name = event.target.name.value;
      var description = event.target.Description.value;
      var deadline = $("#my-datepicker").val();
      var assignedUserName = event.target.assignedUser.value;
      alert(assignedUserName);
      var findeone = Users.findOne({name:assignedUserName},{fields:{_id:1}});
      alert(findeone);

      if(typeof findeone=='undefined'){ //checker for if assigned user exists
          alert("DNE");
          return false;
      }
      var assignedUser = findeone._id;
      
      Task.insert({
          name: name,
          description:description,
          deadline:deadline,
          assignedUserName:assignedUserName,
          completed:false,
          assignedUser:assignedUser,
          dateCreated: new Date() // current time
        });
      
        
        // Clear form
        event.target.text.value = "";

      return false;
      
      
      
      
    }
  
    
  });
  
  Template.Tasks.events({
  
  
  })
  
  Template.Tasks.helpers({
    
    getTasks: function(){
      return Task.find({});
    }
    
  });
  
  
  
  
  
  Template.userProfile.rendered=function(){
    $('.completed').hide();
   
  }
  
  Template.addTask.rendered=function() {
    
    $('#my-datepicker').datepicker();
  }
  


  
  
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.methods({
    
  });
}





/*var name = event.target.name.value;
      var description = event.target.Description.value;
      var deadline = event.taget.deadline.value;
      var assignedUser = event.target.assignedUser.value;
      
      var checker = Users.findOne({name:assignedUser});

      
      
      if(typeof checker=='undefined')
      {
        Task.insert({
          name: name,
          description:description,
          deadline:deadline,
          assignedUserName:assignedUser,
          dateCreated: new Date() // current time
        });
        // Clear form
        event.target.text.value = "";
      }
      else
        alert("email being used!!");
      // Prevent default form submit
      return false;
*/