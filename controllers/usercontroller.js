const bcrypt = require('bcrypt')
const usersDb = require('../models/userSchema')





module.exports = {

    login: async (req, res) => {
        const { username, password } = req.body
        const userExist = await usersDb.findOne({ username: username })
        console.log(userExist)
        const compareFor = await bcrypt.compare(password, userExist.password)
        if (username === userExist.username && compareFor) {
            req.session.username = username
            return res.send({ success: true, data: userExist })
        } else {
            res.send({ success: false, message: 'wrong information' })
        }
    },

    register: async (req, res) => {
        const { username, pass1, pass2 } = req.body
        const hash = await bcrypt.hash(pass1, 10)
        const user = new usersDb()

        user.registerTimestamp = Date.now()
        user.commentsAmount = 0
        user.username = username
        user.password = hash
        user.image = "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
        user.save()
            .then(async () => {
                return res.send({ success: true, message: 'User is created' });
            })
            .catch((e) => {
                return res.send({
                    success: false,
                    message: 'failled to create a user',
                });
            });
    },

    getUser:async (req, res) => {
        const { username } = req.session
        const userExist = await usersDb.findOne({ username: username })
        if (userExist) {
            return res.send({ success: true, data: userExist })
        } else {
            res.send({ success: false, message: 'wrong information' })
        }
    },

    changeImage: async (req, res) => {
        const { username } = req.session
        const { newImage, user } = req.body
        if (username) {
            const newUserData = await usersDb.findOneAndUpdate({ username: user }, { image: newImage }, { new: true })
            return res.send({ success: true, data: newUserData })
        } else {
            res.send({ success: false, message: 'wrong information' })
        }
    },

    logout: (req, res) => {
        req.session.username = null
        res.send({ success: true })
    }
}