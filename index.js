const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = new express();
const urlEncoded = bodyParser.json();

app.use(cors())
mongoose.connect('mongodb+srv://dbMark:kamisama21@cluster0-bxsxw.mongodb.net/test?retryWrites=true&w=majority', {useUnifiedTopology:true, useNewUrlParser:true});

const User = mongoose.model('User',{
    
        name: {
            type: String},
        age: {
            type: Number},
    })

app.use(express.static(__dirname + '/dist/app'));

app.get('/',(req, res)=>{
    res.sendFile(__dirname + 'dist/app/index.html')
});

app.get('/users',(req, res)=>{
     User.find({},(err, data)=>{
         if(err) throw err
         res.json(data)
     })   
})

app.get('/user/:id', (req, res)=>{
User.findOne({_id:req.params.id},(err, data)=>{
    if(err) throw err 
    res.json(data)
    })
})

app.post('/user',urlEncoded,(req, res)=>{
    var user = new User({
        name: req.body.name,
        age: req.body.age,
    })

user.save((err)=>{
    if(err)throw err
    res.json({msg:"Added!"})
    })
})

app.put('/user/:id', urlEncoded, (req, res)=>{
    User.updateOne({_id:req.params.id},{
        name: req.body.name,
        age:req.body.age
    },(err)=>{
        if(err)throw err
        res.json({msg:"Updated!"})
    })
})

app.delete('/user/:id', (req, res)=>{
    User.deleteOne({_id:req.params.id},(err)=>{
        if(err)throw err
        res.json({msg:"Deleted!"})
    })
})

const PORT = process.env.PORT || 80

app.listen(PORT,(err)=>{
    console.log(`Server running at localhost ${PORT}`);
})
