const { response } = require('express')
const express = require ('express')
const app = express()
const port = 3000
const {user_game, user_game_biodata} = require ('./models')

app.use(express.urlencoded({extended: true}))
app.use('/assets', express.static("./assets"))

app.set("view engine", "ejs")

app.get('/', (req,res) => {
    res.render('home')
})

app.get('/thegames', (req,res) => {
    res.render('thegames')
})

app.get('/features', (req,res) => {
    res.render('features')
})

app.get('/requirements', (req,res) => {
    res.render('requirements')
})

app.get('/topscore', (req,res) => {
    res.render('topscore')
})
app.get('/games', (req,res) => {
    res.render('games')
})

app.get ('/adduser', (req,res) => {
    res.render("adduser")
})

app.post('/user', (req,res) => {
    const {username,password,first_name,last_name,birthplace} = req.body
    user_game.create ({
        username,
        password,
        isSuperAdmin: false
    }).then(user_game => {
        user_game_biodata.create({
            id_user: user_game.id,
            first_name,
            last_name,
            birthplace
        }).then(response => {
            res.redirect('/dashboard')
        })
    })
})

app.get('/user/:id/delete', (req,res) => {
    const {id} = req.params
    user_game.destroy({
        where:{id}
    }).then(response => {
        res.redirect('/dashboard')
    })
})

app.get('/user/:id/edit', (req,res) => {
    const {id} = req.params
    

    user_game.findOne({
        where:{id},
        include: user_game_biodata
    }).then(user => {
        res.render('edit',{user})
    })
})

app.post('/user/:id/update', (req,res) => {
    const {id} = req.params
    const {username,password,first_name,last_name,birthplace} = req.body

    user_game.update({
        username,
        password
    },{where:{id}
    }).then(response => {
        user_game_biodata.update({
            first_name,
            last_name,
            birthplace
        },{where : {id_user:id}
    }).then(response => {
        res.redirect('/dashboard')
    })

    })
})

app.get ('/login', (req,res) => {
    res.render("login")
})
app.post ('/login', (req,res) => {
    const { username, password} = (req.body)

    user_game.findOne({
        where: {
            username: username,
            password: password 
        }
    }).then(response => {
        if(response !=null){
            res.redirect('dashboard')
        }else{ 
            res.render ('login')
        }
    })
})

app.get ('/dashboard', (req,res) => {
    user_game.findAll({
        include: user_game_biodata
    })
    .then( users => {
        res.render('dashboard',{
            users
        })
    })
})

app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
})