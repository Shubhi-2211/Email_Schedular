const express = require('express');
const router = express.Router();
const Campaign = require('../models/campaign');
const multer = require('multer');
const upload = multer();
const scheduleEmail = require('../scheduler/campaignScheduler');

// 📌 Create Campaign
router.post('/create', upload.none(), async (req, res) => {
    try {
        const { title, message, recipients, scheduledTime } = req.body;

        if (!title || !message || !recipients || !scheduledTime) {
            return res.status(400).send('All fields are required.');
        }

        // Handle recipients as array
        const recipientsArray = recipients.split(',').map(email => email.trim());

        // Create new Campaign
        const newCampaign = new Campaign({
            title,
            message,
            recipients: recipientsArray,
            scheduledTime,
            status: 'pending',
            logs: recipientsArray.map(email => ({ email, status: 'pending' }))
        });

        await newCampaign.save();

        // Schedule the email
        scheduleEmail(newCampaign);

        res.redirect('/api/campaigns');
    } catch (err) {
        console.error('❌ Error creating campaign:', err);
        res.status(500).send('Error creating campaign');
    }
});

// 📌 List Campaigns
router.get('/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ scheduledTime: -1 });
        res.render('campaigns', { campaigns });
    } catch (err) {
        console.error('❌ Error fetching campaigns:', err);
        res.status(500).send('Error fetching campaigns');
    }
});

module.exports = router;
