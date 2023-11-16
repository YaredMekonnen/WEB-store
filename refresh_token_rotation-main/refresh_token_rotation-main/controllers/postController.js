const Post = require('../model/Post');
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require('crypto');
// const dotenv = requrie('dotenv');
const sharp = require('sharp')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// dotenv.config()

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const bucketNAME = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
     credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
     },
     region: bucketRegion

})
const getAllPosts = async (req, res) => {
    const posts = await Post.find();
    console.log(req.body);
    console.log(posts)
    for(const post of posts) {
        const getObjectParams = {
            Bucket: bucketNAME,
            Key: post.imageName,
            }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        post.imageUrl = url;
}
    if (!posts) return res.status(204).json({ 'message': 'No employees found.' });
    res.json(posts);
}
//
const createNewPost = async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    if (!req?.body?.username || !req?.body?.desc || !req.file) {
        return res.status(400).json({ 'message': 'First name, last name, and file are required' });
    }    
    const buffer = await sharp(req.file.buffer).resize({height: 1920, width: 1080, fit: 'contain'}).toBuffer();
    const imageName = randomImageName()
    const params = {
        Bucket: bucketNAME,
        Key: imageName,
        Body: buffer,
        ContentType: req.file.mimetype,
    }
    const command = new PutObjectCommand(params)
    await s3.send(command)
    try {
        const result = await Post.create({
            username: req.body.username,
            desc: req.body.desc,
            imageName: imageName, // Access the array of files using req.files
        });

        res.status(201).json(result);
    } catch (err) {
        if (err.name === 'ValidationError') {
            // Handle validation errors
            const validationErrors = Object.values(err.errors).map((error) => error.message);
            return res.status(400).json({ 'message': 'Validation failed', 'errors': validationErrors });
        }
    
        console.error(err);
        res.status(500).json({ 'message': 'Internal Server Error' });
    }
};



const updatePost = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const post = await Post.findOne({ _id: req.body.id }).exec();
    if (!post) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    if (req.body?.username) post.username = req.body.username;
    if (req.body?.desc) post.desc = req.body.desc;
    if (req.body?.image) post.image = req.body.image;
    const result = await post.save();
    res.json(result);
}

const deletePost = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const post = await Post.findOne({ _id: req.body.id }).exec();
    if (!post) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    const result = await post.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getPost = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const post = await Post.findOne({ _id: req.params.id }).exec();
    if (!post) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` });
    }
    res.json(post);
}

module.exports = {
    getAllPosts,
    createNewPost,
    updatePost,
    deletePost,
    getPost
}