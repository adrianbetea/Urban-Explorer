// backend/s3.js
require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const uploadToS3 = async (fileBuffer, mimetype) => {
    
    // 🔥 THE FIX: Just force the '.jpg' extension right here!
    const fileName = crypto.randomBytes(16).toString('hex') + '.jpg';
    
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimetype,
    });

    await s3.send(command);

    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

module.exports = { uploadToS3 };