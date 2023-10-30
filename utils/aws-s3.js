import * as dotenv from 'dotenv'
dotenv.config();
import aws from 'aws-sdk';
import fs from 'fs';

// Configure AWS SDK
aws.config.update({
  accessKeyId: process.env.S3_API_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// const formS3Params = (file, folder) => ({
//   ACL: 'public-read',
//   Bucket: process.env.S3_BUCKET_NAME,
//   Body: fs.createReadStream(file.path),
//   Key: `${folder}/${Date.now()}-${file.originalname}`,
// });

const formS3Params = (file,folder) => ({
  ACL: 'public-read',
  Bucket: process.env.S3_BUCKET_NAME,
  Body: file.data, // Use file.data instead of createReadStream
  Key: `${folder}/${Date.now()}-${file.name}`, // Use file.name for the filename
});


export const uploadSingleFile = (file,folder) =>
new Promise((resolve, reject) => {
  if (!file) return resolve('');

  const s3 = new aws.S3();
  const params = formS3Params(file,folder);

  s3.upload(params, (err, data) => {
    if (err) {
      console.log('Error occurred while trying to upload to S3 bucket', err);
      return reject(err);
    }

    // fs.unlinkSync(file.path);
    return resolve(data.Location)
    // return resolve(`https://${formS3Params.Bucket}.s3.amazonaws.com/${formS3Params.Key}`);
  });
});

export const uploadMultipleFiles = (files, folder) =>
new Promise((resolve, reject) => {
  let uploadPromises = files.map((file) => uploadSingleFile(file, folder));
  Promise.all(uploadPromises)
    .then((locations) => {
      return resolve(locations);
    })
    .catch((err) => {
      return reject(err);
    });
});

// Export functions if needed
// module.exports = {
//   uploadSingleFile,
//   uploadMultipleFiles,
// };
