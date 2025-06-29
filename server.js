require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');

const campaignRoutes = require('./routes/campaign');
const frontendRoutes = require('./routes/frontend');
const startScheduler = require('./scheduler/campaignScheduler');

const app = express();
const hbs = exphbs.create({});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/', frontendRoutes);
app.use('/api', campaignRoutes);

startScheduler();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
