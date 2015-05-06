Users = new Meteor.Collection("users");
Task = new Meteor.Collection("tasks");

var count = 0;

if (Meteor.isClient) {
  
  
  
  // This code only runs on the client
  Template.body.helpers({
    
    showUser:function(){
      return Session.get("listuser");
    },
    profile:function(){
      return Session.get("profile");
    },
    task:function(){
      return Session.get("tasks");
    },
    addtask:function(){
      return Session.get("addTasks");
    },
    taskDetails:function(){
      return Session.get("clickedTask");
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
      Session.set("clickedTask",false);
      Session.set("profile",false);
      Session.set("tasks",false);
    },
    'click .tasks':function(event){
      Session.set("tasks",true);
      Session.set("clickedTask",false);
      Session.set("listuser",false);
      Session.set("profile",false);
      Session.set("clickedTask",false);
      
    }
    
    
    
    
  });
  
  Template.user.events({
    
    'click a': function (event) {
      Session.set("profile",true);
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
  
  
  Template.taskDetail.events({
    'click .next': function (event) {
      //alert(event.target.id);
    },
    'click .previous': function (event) {
      //alert(event.target.id);
    }
  
  });
 
  Template.taskDetail.helpers({
  
    taskDetail:function(){
      var id = Session.get("clickedTaskId");
      return Task.find({_id:id});
    },
    Users: function () {
      return Users.find({});
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
  
  Template.addTask.helpers({
    Users: function(){
      return Users.find({});
    }
  
  
  });
  
  
  Template.addTask.events({
    
    "submit .new-task": function (event) {
      
      var name = event.target.name.value;
      var description = event.target.Description.value;
      var deadline = $("#my-datepicker").val();
      var assignedUserName = event.target.assignedUser.value;
      if(name==''){
        $(".errorname").css('visibility', 'visible');
        return false;
      }
      
      $(".errorname").css('visibility', 'hidden');
      
      
      if(deadline=='')
      {
        $(".deadline").css('visibility', 'visible');
        return false;
      }
      
      $(".deadline").css('visibility', 'hidden');

      var findeone = Users.findOne({name:assignedUserName},{fields:{_id:1}});

      if(typeof findeone=='undefined'){ //checker for if assigned user exists
          alert("User does not exist!!");
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
  
  
  
  Template.updateTask.events({
    
    "submit .update-task": function (event) {
      var id = event.target.id.value;
      var name = event.target.name.value;
      var description = event.target.Description.value;
      var deadline = $("#my-datepicker").val();
      var completion = event.target.completion.value;
      var assignedUserName = event.target.assignedUser.value;
      
      if(completion=="true")
        completion=true;
      else completion=false;
      
      alert(completion);
      
      if(name==''){
        $(".errorname").css('visibility', 'visible');
        return false;
      }
      
      $(".errorname").css('visibility', 'hidden');
      
      
      if(deadline=='')
      {
        $(".deadline").css('visibility', 'visible');
        return false;
      }
      
      $(".deadline").css('visibility', 'hidden');

      var findeone = Users.findOne({name:assignedUserName},{fields:{_id:1}});

      if(typeof findeone=='undefined'){ //checker for if assigned user exists
          alert("User does not exist!!");
          return false;
      }
      var assignedUser = findeone._id;
      Task.update(this._id, {$set:{
          name: name,
          description:description,
          deadline:deadline,
          completed:completion,
          assignedUserName:assignedUserName,
          assignedUser:assignedUser}
        });
      
        
        // Clear form
        event.target.text.value = "";

      return false;
    }
  
    
  });
  
  Template.updateTask.helpers({
    currentTask:function(){
      var id = Session.get("clickedTaskId");
      return Task.find({_id:id});
    },
    Users: function(){
        return Users.find({});
    }
  
  });
  
  
  
  Template.Tasks.events({
    
    'click .delete':function(event){
      Task.remove({_id:event.target.id});
    },
    
    'click .next':function(event){
      
      
      if(Session.get("count")==null)
        Session.set("count",0);
      
      count=Session.get("count")+10;
      Session.set("count",count);
    
    },
    'click .previous':function(event){
      
      if(Session.get("count")==null)
        Session.set("count",0);
      
      if(Session.get("count")-10<0){
        Session.set("count",0);
        count=0;
      }
      else
        count=Session.get("count")-10;
      
      Session.set("count",count);
    
    },
    
    
    'click a': function (event) {
      Session.set("clickedTask",true);
      Session.set("profile",false);
      Session.set("adduser",false);
      Session.set("listuser",false);
      Session.set("tasks",false);
      Session.set("clickedTaskId",event.target.id);
      

    },
    
    "click .asc": function(event){
        Session.set("order","asc");
    },
    "click .desc": function(event){
        Session.set("order","desc");
    },
    
    "click .pending": function(event){
        Session.set("status",false);
    },
    "click .completed": function(event){
        Session.set("status",true);
    },
    "click .all": function(event){
        Session.set("status","all");
    },
    
    
    
    "change .orderin":function(event){
        Session.set("orderby",$(event.currentTarget).find(':selected').data("id"));
    }
  
  });
  
  Template.Tasks.helpers({
    //DO I REALLY CREATE THIS SHITTY CODE FOR EACH CASE FOR ASC AND DESC?? THIS WOULD BE INSANE.
    //.RATHER USE ANGULAR IF THIS IS TRUE
    
    
    getTasksAsc: function(){
      
      var status = Session.get("status");
      
      if(Session.get("order")=="asc")
      {
        return sortByAsc(Session.get("orderby"),status);
      }
      else if(Session.get("order")=="desc")
      {
        return sortByDesc(Session.get("orderby"),status);
      }
      else
        return sortByDesc(Session.get("orderby"),status);
    }
    
  });
  
  sortByAsc = function(orderby,status){
    
    
    var sort_order = {};
    
    sort_order[orderby] = 0;
    
    var checker= Task.findOne({},{sort:sort_order,skip:Session.get("count"),limit:10});
    
    if(typeof checker=='undefined')
      Session.set("count",0);
    
    if(status==undefined||status=="all")
    {
      var result = Task.find({},{sort:sort_order,skip:Session.get("count"),limit:10});

    }
    else{
      var result = Task.find({completed:status},{sort:sort_order,skip:Session.get("count"),limit:10});
    }
    return result;
    
  }
  sortByDesc = function(orderby,status){
    
    var sort_order = {};
    
    sort_order[orderby] = -1;
    
    var checker= Task.findOne({},{sort:sort_order,skip:Session.get("count"),limit:10});
    
    if(typeof checker=='undefined')
      Session.set("count",0);
    if(status==undefined||status=="all")
    {
      var result = Task.find({},{sort:sort_order,skip:Session.get("count"),limit:10});

    }
   
    else{
      var result = Task.find({completed:status},{sort:sort_order,skip:Session.get("count"),limit:10});
    }
    
    return result;
  }
  
  
  
  Template.userProfile.rendered=function(){
    $('.completed').hide();
   
  }
  
  Template.addTask.rendered=function() {
    
    $('#my-datepicker').datepicker();
  }
  
  Template.updateTask.rendered=function() {
    
    $('#my-datepicker').datepicker();
  }
  
Template.UsersList.rendered=function() {
    $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').focus()
    })
  }

Template.Tasks.rendered=function() {
    $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').focus()
    })
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


