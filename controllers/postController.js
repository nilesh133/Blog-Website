const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const Post = require("../models/postSchema");
const { body, validationResult } = require("express-validator");
const { htmlToText } = require("html-to-text");
const User = require("../models/userSchema");
module.exports.createPost = (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        const { title, category, description, id, slug, name } = fields;
        const errors = [];
        if (title === '') {
            errors.push({ msg: 'Please fill the title' });
        }
        if (category === '') {
            errors.push({ msg: 'Please select the category' });
        }
        if (description === '') {
            errors.push({ msg: 'Description is required' });
        }
        // if (body === '') {
        //     errors.push({ msg: 'Please fill the body' });
        // }
        if (slug === '') {
            errors.push({ msg: 'Please fill the slug' });
        }
        if (Object.keys(files).length === 0) {
            errors.push({ msg: 'Image is required' });
        }
        else {
            const { type } = files.image;
            console.log(type);
            const split = type.split('/');
            const extension = split[1].toLowerCase();
            if (extension !== 'jpg' && extension != 'png' && extension != 'jpeg') {
                errors.push({ msg: `.${extension} is not acceptable for image` })
            }
            else {
                files.image.name = uuidv4() + '.' + extension;
            }
        }
        const checkSlug = await Post.findOne({ slug });
        if (checkSlug) {
            errors.push({ msg: "Please write a unique slug" });
        }
        if (errors.length !== 0) {
            return res.status(400).json({ errors });
        }
        else {
            const newPath = __dirname + `/../build/public/images/${files.image.name}`;
            fs.copyFile(files.image.path, newPath, async (error) => {
                if (!error) {
                    try {
                        const response = await Post.create({
                            title,
                            category,
                            /*body,*/
                            image: files.image.name,
                            description,
                            slug,
                            userName: name,
                            userId: id
                        })
                        return res.status(200).json({ msg: "Post created successfully" });
                    } catch (error) {
                        console.log(error.message);
                        return res.status(500).json({ errors: error, msg: error.message });
                        
                    }
                }
            })
        }
    })
}

module.exports.fetchPosts = async (req, res) => {
    const id = req.params.id;
    const page = req.params.page;
    const perPage = 3;
    const skip = (page - 1) * perPage;
    try {
        const count = await Post.find({ userId: id }).countDocuments();
        const response = await Post.find({ userId: id }).skip(skip).limit(perPage).sort({ updatedAt: -1 });
        return res.status(200).json({ response: response, count, perPage });
    }
    catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.fetchPost = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Post.findOne({ _id: id });
        return res.status(200).json({ post });

    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.updateValidations = [
    body('title').notEmpty().trim().withMessage("Title is required"),
    // body('body').notEmpty().trim().custom(value => {
    //     let bodyValue = value.replace(/\n/g, '');
    //     if (htmlToText(bodyValue).trim().length === 0) {
    //         return false;
    //     }
    //     else {
    //         return true;
    //     }
    // }).withMessage("Body is required"),
    body('description').notEmpty().trim().withMessage("Description is required"),
]
module.exports.updatePost = async (req, res) => {
    const { title, /*body,*/ category, description, id } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    else {
        try {
            const response = await Post.findByIdAndUpdate(id, {
                title,
                /*body,*/
                category,
                description
            });
            return res.status(200).json({ msg: "Your post has been updated successfully" })
        } catch (error) {
            return res.status(500).json({ errors: error, msg: error.message });
        }
    }
}

module.exports.updateImage = async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, (errors, fields, files) => {
        const { id } = fields;
        const imageError = [];
        if (Object.keys(files).length === 0) {
            imageError.push({ msg: "Please choose image" });
            // console.log("Errorr...");
        }
        else {
            const { type } = files.image;
            const split = type.split('/');
            // console.log(split);
            // console.log(type);
            const extension = split[1].toLowerCase();
            if (extension !== 'jpg' && extension !== 'jpeg' && extension !== "png") {
                imageError.push({ msg: `${extension} is not allowed for image` });
            }
            else {
                files.image.name = uuidv4() + "." + extension;
            }
        }
        if (imageError.length !== 0) {
            console.log(errors);
            return res.status(400).json({ errors: imageError })
        }
        else {
            const newPath = __dirname + `/../build/public/images/${files.image.name}`;
            fs.copyFile(files.image.path, newPath, async (error) => {
                if (!error) {
                    try {
                        const response = await Post.findByIdAndUpdate(id, {
                            image: files.image.name
                        })
                        return res.status(200).json({ msg: "Image updated successfully" });
                    } catch (error) {
                        return res.status(500).json({ errors: error, msg: error.message });
                    }
                }
            })
        }
    })
}

module.exports.deletePost = async (req, res) => {
    const id = req.params.id;
    try {
        const response = await Post.findByIdAndRemove(id);
        return res.status(200).json({ msg: "Post deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

// module.exports.home = async (req, res) => {
//     const page = req.params.page;
//     const perPage = 3;
//     const skip = (page - 1) * perPage;
//     try {
//         const count = await Post.find({}).countDocuments();
//         const posts = await Post.find({}).skip(skip).limit(perPage).sort({ updatedAt: -1 });
//         return res.status(200).json({ response: posts, count, perPage });
//     } catch (error) {
//         console.log(error.message)
//         return res.status(500).json({ errors: error, msg: error.message });
//     }
// }

module.exports.homeTesting = async (req, res) => {
    try {
        const posts = await Post.find({});
        
        return res.status(200).json(posts)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.postDetail = async (req, res) => {
    const id = req.params.id;
    try{
        const post = await Post.findOne({_id: id});
        console.log(post);
        return res.status(200).json({post});
    }
    catch(error){
        return res.status(500).json({ errors: error, msg: error.message });
    }
}