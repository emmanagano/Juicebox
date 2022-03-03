

const express = require('express');
const { getAllTags, getPostsByTagName } = require('../db');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {

    console.log("A request is being made to /posts");

    next();
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {

    const {tagName} = req.params;

    try {

        const postByTag = await getPostsByTagName(tagName);
        const posts = postByTag.filter(post => {

            if(post.active){
                return true
            }

            if(req.user && post.author.id === req.user.id){
                return true
            }

            return false
        })
        res.send({posts: postByTag});

    } catch({name,message}) {

        next({
            name:"Get Tag Error",
            message: "There was an error requesting for tags"
        })
    }
    
})

module.exports = tagsRouter;