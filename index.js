const express = require('express')
const nunjucks = require('nunjucks')

const app = express()

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'njk')

const checkAgeParamMiddleware = (req, res, next) => {
  if (req.query.age > 0) next()
  else return res.redirect('/?error=1')
}

app.get('/', (req, res) => {
  let error = req.query.error
  if (error === '1') error = 'Idade inválida ou não informada!'
  else error = ''
  return res.render('index', { error })
})

app.post('/check', (req, res) => {
  let age = req.body.age
  if (age >= 18) return res.redirect(`/major?age=${age}`)
  return res.redirect(`/minor?age=${age}`)
})

app.get('/major', checkAgeParamMiddleware, (req, res) => {
  return res.render('major', { age: req.query.age })
})

app.get('/minor', checkAgeParamMiddleware, (req, res) => {
  return res.render('minor', { age: req.query.age })
})

app.listen(3000)
