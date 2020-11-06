const AWS = require('aws-sdk');
AWS.config.logger = console;

var s3 = new AWS.S3();

//get list of images from s3 bucket

exports.handler = async (event) => {
    
  //create presigned URL for item
    var params = {Bucket: 'res7ps-resized', Expires: 90000};
    var url = s3.getSignedUrl('listObjects', params);
    

    //response
    const response = {
        statusCode: 200,
        body: url,
    };
    return response;
};
