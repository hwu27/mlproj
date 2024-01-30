# MLProj Server Setup

This document provides instructions for setting up and running the server for MLProj, a Node.js application using Express, Multer, and Mongoose.

## Prerequisites

- Node.js installed on your machine.
- MongoDB account and a MongoDB Atlas cluster set up.

## Installation

1. **Clone the Repository**
   - Clone this repository to your local machine or download the source code.
   - Navigate to the directory where the repository is cloned.

2. **Install Node Modules**
   (Note: cd into the assets/js folder first)
   - Run the following command to install the necessary Node.js modules:
     ```sh
     npm install
     ```

3. **Configure MongoDB Connection**
   - Replace the MongoDB connection string in the server file (`server.js`) with your own. Make sure to use the correct username, password, and database name.

- Click Connect and then choose the VSCode option
![image](https://github.com/hwu27/mlproj/assets/130116077/e41ec684-e9e1-4854-b001-1d53a4e1e3ae)
![image](https://github.com/hwu27/mlproj/assets/130116077/83250814-6ad7-4279-a411-4b109ced97ed)

4. **Check Directory Paths for Static Files**
   - Ensure that the path in `express.static` is correctly set to point to your `mlproj` directory where your static files (HTML, CSS, JavaScript, etc.) are located.

## Running the Server

1. **Start the Server**
   - Run the following command in your terminal:
     ```sh
     node path/to/server.js
     ```
   - Replace `path/to/server.js` with the actual path to your `server.js` file.

2. **Accessing the Application**
   - Open a web browser and go to `http://localhost:3000`. This will load the application served by your Node.js server.

## Usage

- **Uploading Files**: Use the `/upload` endpoint to upload files. The files will be stored in the `uploads` directory.
- **Viewing Files**: Access uploaded files via the `/view/:fileId` endpoint.
- **Saving Annotations**: Use the `/save_annotation` endpoint to save annotations.
- **Loading Annotations**: Retrieve saved annotations using the `/load_annotations` endpoint.
- **Saving Highlights**: Save text highlights using the `/save_highlights` endpoint.
- **Loading Highlights**: Retrieve saved highlights via the `/load_highlights` endpoint.

## Notes

- Ensure that your MongoDB Atlas cluster is accessible from your IP address.
- For security reasons, avoid hardcoding sensitive information like database credentials directly in the code. Consider using environment variables.
