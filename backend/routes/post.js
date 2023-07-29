const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { body, validationResult } = require("express-validator");
const getUser = require("../middleware/getUser")


router.get("/fetchallposts", getUser, async (req, res) => {
	try {
		const posts = await Post.find({ user: req.user.id });   // user.id is from getUser
		res.json(posts);

	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal Server Error");
	}
});


router.post("/addpost", getUser, [
	body('title', "invalid title").isLength({ min: 1 }),
	body('discription', "invalid discription").isLength({ min: 5 }),],
	async (req, res) => {
		// console.log(req.body.title);
		// console.log(req.body.discription);
		// console.log(req.body.tag);
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { title, discription, tag } = req.body;
		// console.log(req.user.id);
		const newpost = new Post({
			title,
			discription,
			tag,
			user: req.user.id
		});

		const savedpost = await newpost.save()
		res.json(savedpost)
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal Server Error");
	}
});


router.put("/updatepost/:id", getUser,async (req, res) => {
const {title, discription, tag} = req.body;

	try {
		const newpost = {};
		if(title){
			newpost.title = title
		}
		if(discription){
			newpost.discription = discription
		}
		if(tag){
			newpost.tag = tag
		}

		let post = await Post.findById(req.params.id);
		if(!post){
			return res.status(404).send("not found");
		}

		console.log(post)
		console.log(post.user)
		console.log(req.user.id)

		if(post.user.toString()  !== req.user.id){
			return res.status(401).send("not allowed");
		}

		post = await Post.findByIdAndUpdate(req.params.id, {$set : newpost}, {new : true});
		res.json({post});

	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal Server Error");
	}

});



router.delete("/deletepost/:id", getUser, async (req, res) => {

	try {
		let post = await Post.findById(req.params.id);
		if(!post){
			return res.status(404).send("not found");
		}

		if(post.user.toString()  !== req.user.id){
			return res.status(401).send("not allowed");
		}

		post = await Post.findByIdAndDelete(req.params.id, );
		res.json({"Success": "post has been deleted", post : post});

	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal Server Error");
	}
});



module.exports = router;
