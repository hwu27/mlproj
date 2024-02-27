# The Website: (In Progress)

The website is meant to be a way to share and annotate code in a more intuitive way. People can easily teach their code to others or receive help from others. This could make project/team onboarding quicker as well as create a community of code exchange that is similar to GitHub and Notebooks.


## Landing Page:

![image](https://github.com/hwu27/mlproj/assets/130116077/f1c6a799-6bf5-4a0d-9d6f-a7086bb179c5)

![image](https://github.com/hwu27/mlproj/assets/130116077/10e8fe58-ddd0-4c73-ba95-5154eeb1d09a)


## Code Submission:

![image](https://github.com/hwu27/mlproj/assets/130116077/658a1bb9-0ffc-455c-9d55-e5cf6b774839)

## Annotation:

![image](https://github.com/hwu27/mlproj/assets/130116077/570bdf04-bd89-4f2b-8165-0ecb88a86a8d)


![image](https://github.com/hwu27/mlproj/assets/130116077/0c203665-cb9e-46f9-a609-9d119ba15d3d)


## Highlights: 

![image](https://github.com/hwu27/mlproj/assets/130116077/458eceac-b556-4b9a-b99c-0db7ab285e43)

## Hovering: 

![image](https://github.com/hwu27/mlproj/assets/130116077/47c6260e-8fee-4e35-8fa2-54b314c583fb)


# MLProj Server Setup

This document provides instructions for setting up and running the server for MLProj using Node.js  

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
   - Make a database (choose the free one)
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
