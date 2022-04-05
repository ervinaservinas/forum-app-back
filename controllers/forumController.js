const topicsDb = require('../models/topicSchema')
const commentsDb = require('../models/commentsSchema')
const usersDb = require('../models/userSchema')


const rowsInPage = 10;
let notifications = []


module.exports = {
    createTopic: async (req, res) => {
        const { username } = req.session;
        const { newTopic } = req.body;
        // console.log(newTopic, username)
        if (username) {
            const topic = new topicsDb();
            topic.owner = username
            topic.title = newTopic
            topic.createdTimestamp = Date.now()
            topic.save()
                .then(async () => {
                    return res.send({ success: true, message: 'Theme succesfull created', data: topic._id });
                })
                .catch((e) => {
                    return res.send({
                        success: false, message: 'failled to create theme',
                    });
                });
        }
    },
    getAllTopics: async (req, res) => {
        try {
            const topics = await topicsDb.find({})
            res.send({ success: true, data: topics });
        } catch (e) {
            return res.send({ success: false, message: 'No themes' })
        }
    },
    getMyTopics: async (req, res) => {
        const { username } = req.session;
        try {
            const topics = await topicsDb.find({ owner: username })
            const comments = await commentsDb.find({ owner: username })
            const topicsAll = await topicsDb.find({})
            res.send({ success: true, data: topics, data2: comments, data3: topicsAll });
        } catch (e) {
            return res.send({ success: false, message: 'No themes' })
        }
    },
    // Notification not working
    commentsByPage: async (req, res) => {
        const { username } = req.session;
        const { id, pageIndex } = req.params;
        let Index = 0;
        if (pageIndex > 1) {
            Index = (Number(pageIndex) - 1) * rowsInPage;
        }
        const comments = await commentsDb.find({ topicID: id }).skip(Index).limit(rowsInPage);

        const topic = await topicsDb.findOne({ _id: id })

        let user = await usersDb.findOne({ username: username })
        const searchNotification = notifications.find(x => x == id)
        const filteredArray = notifications.filter(x => x != id)


        if (username && searchNotification) {
            const topicOwner = await usersDb.updateOne({ username: username }, { $set: { notification: filteredArray } })
        }

        user = await usersDb.findOne({ username: username })
        const allCommentsCount = await commentsDb.find({ topicID: id }).count({});
        res.send({
            success: true,
            data: comments,
            data2: allCommentsCount,
            data3: user
        });
    },
    addComment: async (req, res) => {
        const { username } = req.session;
        const { id, text } = req.body;
        const user = await usersDb.findOne({ username: username })
        //console.log(user)
        const topic = await topicsDb.findOne({ _id: id })
        const topicOwnerUser = await usersDb.findOne({ username: topic.owner })
        if(topicOwnerUser){
            notifications = topicOwnerUser.notification;
        } else {
            notifications = []
        }

        const search = notifications.find(x => x == id)
        if (!search) {
            notifications.push(topic._id)
        }
        if (username) {
            const updatedUser = await usersDb.findOneAndUpdate({ username: username }, { $inc: { commentsAmount: 1 } })
            if (topic.owner !== username) {
                const topicOwner = await usersDb.findOneAndUpdate({ username: topic.owner }, { $set: { notification: notifications } })
            }
            const updateTopic = await topicsDb.findOneAndUpdate({ _id: id }, { $set: { lastCommentBy: username }, $inc: { commentsAmount: 1 } })

            const comment = new commentsDb();
            comment.owner = username
            comment.topicID = id
            comment.text = text
            comment.imageUser = user.image
            comment.registeredUserTime = user.registerTime
            comment.createdTimestamp = Date.now()
            comment.save()
                .then(async () => {
                    return res.send({ success: true, message: 'Comment is created' });
                })
                .catch((e) => {
                    return res.send({
                        success: false, message: 'fail to create a comment',
                    });
                });
        }
    },
    getFavorites: async (req, res) => {
        const { favoritesIndex } = req.body;
        try {
            const topics = await topicsDb.find({ _id: favoritesIndex })
            res.send({ success: true, data: topics });
        } catch (e) {
            return res.send({ success: false, message: 'can not fine themes' })
        }
    }
}