# res7

Simple image gallery created to upload an image and generate a thumbnail that is immediately rendered on screen. 

## Contents:

- The createThumbnail directory contains the lambda function to generate a thumbnail for an image that is uploaded by the user.

- Designs directory with some AdobeXD sketches of how I was planning to design the application

- res7 contains the code for the front end portion

Tech Stack:

* Node.js
* React.js
* AWS
  * API Gateway
  * Lambda
  * S3 
  * CloudWatch (for debugging
  
  
  ## How to Setup
  
  ### Prereqs: 
  * Have Node.js installed on your computer. it can be downloaded from [Nodejs.org](https://nodejs.org/en/)
  * Make sure I have the AWS instances running and not shut down to ensure the backend of the application actually works!
  
  ### How to Run it
  
  1. Download repository
  1. Navigate to the res7 directory within the res7 directory.
  1. run `npm install` (in the terminal) in the directory to install all node dependencies
  1. run `npm start` to start project
  1. enjoy!
  
  
  ### How to Use the Project
  
  Initally if any images are loaded, they are pulled from an S3 bucket that contains thumbnails of 250px width.
  
  1. On the Navbar, select "Choose File" to pick your file. Do not change the "Custom Files" dropdown to all files, as "Custom Files" displays all supported filetypes.
  1. Click "Upload"
  
  It's that easy!
  
  
  ## TODO:
  1. Allow images to be sorted
  1. Clean up Upload Image Button
  1. Make errors more clear to the User (so they don't have to check console.log)
  
  
