const usersDb = require('../models/userSchema')

module.exports = {
    validateRegister: async (req, res, next) => {
        const { username, pass1, pass2 } = req.body;
        const userExist = await usersDb.findOne({ username: username })
        if (pass1 !== pass2 || pass1.length < 5 || pass2.length > 20 || pass1.length < 3 || pass1.length > 20) {
            res.send({ error: "Password should be 5-20 symbols" })
        }
        else if (username.length < 5 || username.length > 20) {
            res.send({ error: "Username should be 5-20 symbols." })
        } else if (userExist) {
            res.send({ error: "Username is taken" })
        } else {
            next()
        }
    },
    validateLogin: async (req, res, next) => {
        const { username, password } = req.body
        console.log(username, "logine")
        const userExist = await usersDb.findOne({ username: username })
        if (!userExist) {
            res.send({ success: false, message: 'Wrong credentials' })
        } else {
            next()
        }
    },
    validateImage: (req, res, next) => {
        const { newImage } = req.body
        if (newImage.length < 5 || newImage.length > 400) {
            res.send({ success: false, message: "invalid URL" })
        } else {
            next()
        }
    },
    validateTopic: async (req, res, next) => {
        const { newTopic } = req.body
        if (newTopic.length < 5 || newTopic.length > 50) {
            res.send({ success: false, message: "Name has to be 5-20 charecters" })
        } else {
            next()
        }
    },
    validateComment: (req, res, next) => {
        const { text } = req.body
        if (text.length < 5 || text.length > 400) {
            res.send({ success: false, message: "length has to be from 5-400 characters" })
        } else {
            next()
        }
    }
}