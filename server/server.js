const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const reviewRoutes = require('./src/routes/reviewRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public',express.static(path.join(__dirname,'./public')));



app.use('/api', reviewRoutes);

app.use(function(req, res, next) {
    res.status(404).send("404 Not Found");
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
