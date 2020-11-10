# Galleria

Simple image gallery created to upload an image and generate a thumbnail that is immediately rendered on screen. 

## Contents:

- The lambda_functions directory contains the various AWS lambda functions used and set up on AWS

- Designs directory with some AdobeXD sketches of how I was planning to design the application

- sample_images contains some sample images of various sizes to help test the application

- res7 contains the code for the front end portion

Tech Stack:

* Node.js
* React.js
* AWS
  * API Gateway
  * Lambda
  * S3 
  * CloudWatch (for debugging
  
  
  ## Setup
  
  ### Prereqs: 
  * Have Node.js installed on your computer. it can be downloaded from [Nodejs.org](https://nodejs.org/en/)
  * Make sure I have the AWS instances running and not shut down to ensure the backend of the application actually works!
  
  ### Installation
  
  Download this repository
  Navigate to the res7 directory within the repository.
  Run (in the terminal) in the directory to install all node dependencies
  ```bash
  npm install
  ``` 
  Run following command once all dependencies have been installed
  ```bash
  npm start
  ``` 
Enjoy!
 
  
  ### How to Use the Project
  
  ![](demo_gif.gif)
  
  Initally if any images are loaded, they are pulled from an S3 bucket that contains thumbnails of 250px width.
  
  1. On the Navbar, select "Choose File" to pick your file. Do not change the "Custom Files" dropdown to all files, as "Custom Files" displays all supported filetypes.
  1. Click "Upload"
  
  It's that easy!
  
  
  ## To Improve Upon
  1. Allow images to be sorted
  1. Clean up Upload Image Button
  1. Make errors more clear to the User (so they don't have to check console.log)
  1. Move thumbnail generator script to local instead of having a lambda function
  1. Make the app responsive for mobile
  1. Make the lamba functions give more error information
  1. Allow users to click image to expand and give Image information in a modal and allow them to 
  download thumbnail
  
