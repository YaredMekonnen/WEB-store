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
            Key: post.images[0],
            }

        const getObjectParams1 = {
            Bucket: bucketNAME,
            Key: post.images[1],
            }

        const getObjectParams2 = {
            Bucket: bucketNAME,
            Key: post.images[2],
            }

        const getObjectParams3 = {
                Bucket: bucketNAME,
                Key: post.images[3],
                }
    
        const getObjectParams4 = {
                Bucket: bucketNAME,
                Key: post.images[4],
                }
    
        const getObjectParams5 = {
                Bucket: bucketNAME,
                Key: post.images[5],
                }
        const command = new GetObjectCommand(getObjectParams);
        const command1 = new GetObjectCommand(getObjectParams1);
        const command2 = new GetObjectCommand(getObjectParams2);
        const command3 = new GetObjectCommand(getObjectParams3);
        const command4 = new GetObjectCommand(getObjectParams4);
        const command5 = new GetObjectCommand(getObjectParams5);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        const url1 = await getSignedUrl(s3, command1, { expiresIn: 3600 });
        const url2 = await getSignedUrl(s3, command2, { expiresIn: 3600 });
        const url3 = await getSignedUrl(s3, command3, { expiresIn: 3600 });
        const url4 = await getSignedUrl(s3, command4, { expiresIn: 3600 });
        const url5 = await getSignedUrl(s3, command5, { expiresIn: 3600 });
        post.imageUrl = url;
        post.imageUrl1 = url1;
        post.imageUrl2 = url2;
        post.imageUrl3 = url3;
        post.imageUrl4 = url4;
        post.imageUrl5 = url5;
        console.log(post);
   }

    

    if (!posts) return res.status(204).json({ 'message': 'No employees found.' });
    res.json(posts);
}
//
const createNewPost = async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    if (!req?.body?.username || !req?.body?.desc) {
        return res.status(400).json({ 'message': 'First name, last name, and file are required' });
    }    
    const buffer = await sharp(req.files[0].buffer).resize({height: 1920, width: 1080, fit: 'contain'}).toBuffer();
    const buffer1 = await sharp(req.files[1].buffer).resize({height: 1920, width: 1080, fit: 'contain'}).toBuffer();
    const buffer2 = await sharp(req.files[2].buffer).resize({height: 1920, width: 1080, fit: 'contain'}).toBuffer();
    const buffer3 = await sharp(req.file[3].buffer).resize({height: 1920, width: 1080, fit: 'contain'}).toBuffer();
    const buffer4 = await sharp(req.file[4].buffer).resize({height: 1920, width: 1080, fit: 'contain'}).toBuffer();
    const buffer5 = await sharp(req.file[5].buffer).resize({height: 1920, width: 1080, fit: 'contain'}).toBuffer();

    const imageName = randomImageName()
    const imageName2 = randomImageName()
    const imageName3 = randomImageName()
    const imageName4 = randomImageName()
    const imageName5 = randomImageName()
    const imageName6 = randomImageName()
    const params = {
        Bucket: bucketNAME,
        Key: imageName,
        Body: buffer,
        ContentType: req.files[0].mimetype,
    }
    const command = new PutObjectCommand(params)

    const params2 = {
        Bucket: bucketNAME,
        Key: imageName2,
        Body: buffer1,
        ContentType: req.files[1].mimetype,
    }
    const command2 = new PutObjectCommand(params2)

    const params3 = {
        Bucket: bucketNAME,
        Key: imageName3,
        Body: buffer2,
        ContentType: req.files[2].mimetype,
    }

    const command3 = new PutObjectCommand(params3)

    const params4 = {
        Bucket: bucketNAME,
        Key: imageName4,
        Body: buffer3,
        ContentType: req.files[3].mimetype,
    }

    const command4 = new PutObjectCommand(params4)

    const params5 = {
        Bucket: bucketNAME,
        Key: imageName5,
        Body: buffer4,
        ContentType: req.files[4].mimetype,
    }

    const command5 = new PutObjectCommand(params5)

    const params6 = {
        Bucket: bucketNAME,
        Key: imageName6,
        Body: buffer5,
        ContentType: req.files[5].mimetype,
    }
    const command6 = new PutObjectCommand(params6)
    await s3.send(command)
    await s3.send(command2)
    await s3.send(command3)
    await s3.send(command4)
    await s3.send(command5)
    await s3.send(command6)
    try {
        const result = await Post.create({
            username: req.body.username,
            desc: req.body.desc,
            images: [imageName, imageName2, imageName3, imageName4, imageName5, imageName6], // Access the array of files using req.files
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