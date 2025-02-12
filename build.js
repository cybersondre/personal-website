const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Function to convert a Markdown file to HTML with a basic template
const convertMarkdownToHTML = (inputPath, outputPath, title = 'Document') => {
    fs.readFile(inputPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${inputPath}:`, err);
            return;
        }
        // Convert Markdown content to HTML
        const content = marked(data);
        // Basic HTML template with a header and footer
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
  <header>
    <h1>${title}</h1>
    <nav>
      <ul>
        <li><a href="../index.html">Home</a></li>
        <li><a href="../about.html">About</a></li>
      </ul>
    </nav>
  </header>
  <main>
    ${content}
  </main>
  <footer>
    <p>&copy; 2025 Your Name</p>
  </footer>
</body>
</html>`;

        // Ensure the output directory exists
        const dir = path.dirname(outputPath);
        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) throw err;
            fs.writeFile(outputPath, html, (err) => {
                if (err) {
                    console.error(`Error writing ${outputPath}:`, err);
                } else {
                    console.log(`Converted ${inputPath} to ${outputPath}`);
                }
            });
        });
    });
};

// Function to process all Markdown files in a given folder
const processMarkdownFiles = (inputFolder, outputFolder) => {
    fs.readdir(inputFolder, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${inputFolder}:`, err);
            return;
        }
        files.forEach(file => {
            if (path.extname(file) === '.md') {
                const inputPath = path.join(inputFolder, file);
                // Use the same file name, changing the extension to .html
                const outputFilename = file.replace('.md', '.html');
                const outputPath = path.join(outputFolder, outputFilename);
                // For simplicity, using the file name (without extension) as the title
                const title = path.basename(file, '.md').replace(/-/g, ' ');
                convertMarkdownToHTML(inputPath, outputPath, title);
            }
        });
    });
};

// Define input and output folders for posts and projects
const postsInput = path.join(__dirname, 'src', 'posts');
const postsOutput = path.join(__dirname, 'dist', 'posts');

const projectsInput = path.join(__dirname, 'src', 'projects');
const projectsOutput = path.join(__dirname, 'dist', 'projects');

// Process the folders
processMarkdownFiles(postsInput, postsOutput);
processMarkdownFiles(projectsInput, projectsOutput);
