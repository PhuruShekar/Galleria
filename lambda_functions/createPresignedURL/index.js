const AWS = require('aws-sdk');
AWS.config.logger = console;

var s3 = new AWS.S3();

//presign url for image to upload
exports.handler = async (event) => {
    
    const imgName = event.queryStringParameters.fileName;
    
    //get image extension and validate
    var extension = imgName.substring(imgName.lastIndexOf('.')+1);
    console.log('extension:',extension);
    var mimetype = 'image/';
    
    switch(extension){
        case 'jpg':
            mimetype = mimetype.concat('jpeg');
             break;
        case 'tif':
            mimetype = mimetype.concat('tiff');
             break;
        default:
            mimetype = mimetype.concat(extension);
    }
    console.log('mimetype:', mimetype)
      
    //create presigned URL
    var params = {Bucket: 'res7ps', Key: imgName, ContentType: mimetype};
    var url = s3.getSignedUrl('putObject', params);

    //on success return URL
    const response = {
        statusCode: 200,
        body: url,
    };
    return response;
};