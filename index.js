var express = require('express')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var db = require('./models')
var cors = require('cors')
var app = express()
app.use(cors());
app.set('view engine', 'ejs')
app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({extended: false}))

app.get('/',function(req,res){
  res.render('index')
})

app.get('/articles',function(req,res){
  db.article.findAll({order: 'id DESC' }).then(function(articles) {
    res.json(articles)
  }).catch(function () {
      res.json({status: "failed"})
    });
})

app.post('/article/new',function(req,res){
  db.article.create({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    content: req.body.content,
    author: req.body.author
  }).then(function(data) {
    res.json({status: "created",
              data: data})
  }).catch(function () {
      res.json({status: "failed"})
    });

})


app.get('/article/:id',function(req,res){
  db.article.findById(req.params.id).then(function(article) {
    res.json({status: "found",
              data: article})
  }).catch(function () {
      res.json({status: "failed"})
    });
})


app.put('/article/:id/edit',function(req,res){
  db.article.update({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    content: req.body.content,
    author: req.body.author
  }, {
  where: {
    id: req.params.id
  }
}).then(function () {

  db.article.findById(req.params.id).then(function(article) {
    res.json({status: "updated",
              data: article})
  })

    // res.json({status: "updated",data: })
  }).catch(function () {
      res.json({status: "failed"})
    })
})


app.delete('/article/:id/delete',function(req,res){
  db.article.destroy({
    where: { id: req.params.id }
  }).then(function() {
    res.json({status: "deleted"})
  }).catch(function () {
      res.json({status: "failed"})
    });
})


var server = app.listen(process.env.PORT || 3000)

module.exports = server
