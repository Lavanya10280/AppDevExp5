const http = require('http');
const fs = require('fs');
const path = require('path');


// Function to serve HTML files
function serveFile(filePath, contentType, response) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // If file is not found, serve 404 page
                fs.readFile(path.join(__dirname, '404.html'), (err, page404) => {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(page404, 'utf-8');
                });
            } else {
                // For any other errors, respond with a server error
                response.writeHead(500);
                response.end(`Server Error: ${err.code}`);
            }
        } else {
            // If no errors, serve the requested file
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}


// Create the server
http.createServer((req, res) => {
    // Parse the requested URL
    let urlPath = req.url;


    // Set the default file to index.html
    if (urlPath === '/' || urlPath === '/home') {
        urlPath = '/index.html';
    } else if (urlPath === '/about') {
        urlPath = '/about.html';
    } else if (urlPath === '/contact') {
        urlPath = '/contact.html';
    }


    // Get the file extension
    let extname = path.extname(urlPath);


    // Default to HTML content type
    let contentType = 'text/html';


    // Set the content type based on file extension
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }


    // Construct the full file path
    const filePath = path.join(__dirname, urlPath);


    // Serve the file
    serveFile(filePath, contentType, res);
}).listen(3001, () => {
    console.log('Server running on port 3001');
});
