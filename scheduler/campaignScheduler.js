const cron = require('node-cron');
const Campaign = require('../models/campaign');
const transporter = require('../config/mailer');

function startScheduler() {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const campaigns = await Campaign.find({ status: 'pending', scheduledTime: { $lte: now } });

    for (const campaign of campaigns) {
      for (let log of campaign.logs) {
        if (log.status === 'pending') {
          try {
            await transporter.sendMail({
              from: process.env.SMTP_USER,
              to: log.email,
              subject: campaign.title,
              html: campaign.message
            });
            log.status = 'sent';
          } catch (err) {
            log.status = 'failed';
            log.error = err.message;
          }
        }
      }

      // Update campaign status if all sent
      const allSent = campaign.logs.every(l => l.status === 'sent');
      campaign.status = allSent ? 'sent' : 'failed';
      await campaign.save();
    }
  });
}

module.exports = startScheduler;
