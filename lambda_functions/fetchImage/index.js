const AWS = require('aws-sdk');
AWS.config.logger = console;

var s3 = new AWS.S3();

//get image presign URL
exports.handler = async (event) => {
    
    console.log(event);
    
    
    var imgName = event.queryStringParameters.img;
    var params = {Bucket: 'res7ps-resized', Key: imgName, Expires: 90000};
    var url = ''; 
    
    try {
        url = s3.getSignedUrl('getObject', params);
    }
    catch(err) {
        console.log(err);
    }
    
    // TODO implement
    const response = {
        statusCode: 200,
        body: url,
    };
    return response;
};
