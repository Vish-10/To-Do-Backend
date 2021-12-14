var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../models/userModel');
const task = require('../models/taskModel');

router.post('/login', async function(req, res, next) {
  const body = req.body;
  user.findOne({userName: body.userName}, async (err, tempUser) => {
    if(err){
      console.log(err);
      res.send({msg: err})
    }
    else if(!tempUser){
      res.send({auth: false, msg: 'Invalid UserName'})
    }
    else if(tempUser){
      const validPassword = await bcrypt.compare(body.password, tempUser.password);
      if(validPassword){
        var resUser = {}
        resUser.userName = tempUser.userName;
        resUser.id = tempUser._id;
        res.send({auth: true, msg: 'Logged in', user: resUser});
      }
      else{
        res.send({auth: false, msg: 'Invalid Password'});
      }
    }
  })
});

router.post('/login/:userName', (req,res) => {
  user.findOne({userName: req.params.userName}, (err, tempUser) => {
    if(err){
      res.send({mmsg: err, ok: false})
    }
    else if(tempUser){
        var resUser = {}
        resUser.userName = tempUser.userName;
        resUser.id = tempUser._id;
        res.send({ok: true, msg: 'Logged in', user: resUser});
    }
  })
})

router.post('/signup', async (req, res) => {
  const body = req.body;
  const newUser = new user(body);
  user.findOne({userName: newUser.userName}, async (err, oldUser) => {
    if(err){
      return res.send({msg: err, ok: false});
    }
    else if(!oldUser){
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      newUser.save().then(doc => {
        res.status(201).send({msg: 'Successful', ok: true})
      })
    }
    else if(oldUser){
      res.send({msg: 'UserName already exists', ok: false})
    }
    else{
      res.send({msg: 'Something went wrong', ok: false})
    }
  })
})

router.post('/:userId/addTask', (req, res) => {
  userId = req.params.userId;
  newTask = req.body;
  newTask.user = userId;
  newTask = new task(newTask)
  task.find({taskName: newTask.taskName}, (err, task) => {
    if(err)
      return res.send({msg: 'Something went wrong!', tasks: [], ok: false})
    else if(task.length >= 1){
      return res.send({msg: 'Task name has to be unique', tasks: [], ok: false})
    }
    else{
      newTask.save().then(doc => {
        console.log(doc);
        return res.send({msg: 'Task Added', ok: true, task: newTask})
      })
    }
  })
})

router.get('/allTasks/:userId', (req, res) => {
  task.find({user: req.params.userId}, (err, tasks) => {
    if(err){
      return res.send({msg: 'Something went wrong!', tasks: [], ok: false})
    }
    else if(tasks.length > 0){
      res.send({msg: 'Successful', tasks: tasks, ok: true});
    }
  })
})

router.post('/:userId/updateTask/:taskId', (req,res) => {
  task.findOneAndUpdate({user: req.params.userId, _id: req.params.taskId},
    {taskStatus: req.body.taskStatus}, null, (err, docs) => {
      if(err){
        console.log(err);
      }
      else{
        console.log(docs)
      }
    })
})

router.post('/:userId/deleteTask/:taskId', (req,res) => {
  task.findOneAndDelete({user: req.params.userId, _id: req.params.taskId},
    (err, docs) => {
      if(err){
        console.log(err);
      }
      else{
        console.log(docs)
      }
    })
})

module.exports = router;
