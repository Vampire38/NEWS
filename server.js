const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 3000;

// ✅ Serve static files (HTML, CSS, Images)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',   // default XAMPP MySQL password
  database: 'blog_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL Connected...');
});

// ✅ Configure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // store in public/uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  }
});
const upload = multer({ storage });

// ✅ Handle blog post submission
app.post('/save-post', upload.single('thumbnail'), (req, res) => {
  const title = req.body['blog-title'];
  const content = req.body['blog-content'];
  const image = req.file.filename;

  const sql = 'INSERT INTO blogs (title, content, image) VALUES (?, ?, ?)';
  db.query(sql, [title, content, image], (err, result) => {
    if (err) throw err;
    res.send('<h2>✅ Blog Published Successfully!</h2><a href="/add.html">Back to Add Page</a>');
  });
});

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
