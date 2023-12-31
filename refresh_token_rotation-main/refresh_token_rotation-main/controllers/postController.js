const Post = require('../model/Post');
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require('crypto');
const sharp = require('sharp')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


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
  // console.log(req.body)
   try {
     const posts = await Post.find();
     console.log(posts)
     if (!posts || posts.length === 0) {
       return res.status(204).json({ 'message': 'No posts found.' });
     }
 
     const removeOuterQuotes = (arrayWithQuotes) => {
       const arrayWithoutQuotes = arrayWithQuotes.map((str) => {
           // Use replace to remove only the outer single or double quotes
           return str.replace(/^['"]|['"]$/g, '');
       });
   
       return arrayWithoutQuotes;
   };

   for (let post of posts) {
    const arrayWithQuotes = post.images;
    const arrayWithoutQuotes = removeOuterQuotes(arrayWithQuotes);
    let arrayimages= []; 
    // Generate signed URLs for the images
    for (let i = 0; i < arrayWithoutQuotes.length; i++) {

      try {

        // const url = `imageUrl${i}`;
        url = await getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: bucketNAME,
            Key: arrayWithoutQuotes[i]
          }),
          { expiresIn: 3600 } // 1 hour
        );
        arrayimages.push(url);
      } catch (error) {
        console.error(`Error generating signed URL for image ${i}:`, error);
      }
    }
    post.images = arrayimages;
    console.log(post);
  }
     // Send the response after all posts have been processed
     console.log(posts)
     res.json(posts);
   } catch (error) {
     console.error('Error in getAllPosts:', error);
     res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
};

  

const createNewPost = async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    if (!req?.body?.username || !req?.body?.desc || !req?.body?.email || !req?.body?.phone || !req?.body?.idnumber) {
        return res.status(400).json({ 'message': 'First name, last name, and file are required' });
    }

    const imageNames = [];

    for (let i = 0; i < req.files.length; i++) {
        const imageName = randomImageName();
        imageNames.push(imageName);
        const buffer = await sharp(req.files[i].buffer).resize({height: 1024, width: 768, fit: 'contain'}).toBuffer()
        const params = {
            Bucket: bucketNAME,
            Key: imageName,
            Body: buffer,
            ContentType: req.files[i].mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);
    }

    try {
        const result = await Post.create({
            username: req.body.username,
            desc: req.body.desc,
            images: imageNames,
            email: req.body.email,
            phone: req.body.phone,
            idnumber: req.body.idnumber,
        });

        res.status(201).json(result);
    } catch (err) {
        if (err.name === 'ValidationError') {
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
      return res.status(204).json({ "message": `No post matches ID ${req.body.id}.` });
  }

  // if (req.body?.username) post.username = req.body.username;
  // if (req.body?.desc) post.desc = req.body.desc;
  // if (req.body?.image) post.image = req.body.image;

  // Increment the 'views' property
  post.views += 1;

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
    getPost,
}