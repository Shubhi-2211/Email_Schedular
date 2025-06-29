const mongoose = require('mongoose');

const recipientStatusSchema = new mongoose.Schema({
  email: String,
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  error: String
});

const campaignSchema = new mongoose.Schema({
  title: String,
  message: String,
  recipients: [String],
  scheduledTime: Date,
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  logs: [recipientStatusSchema]
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
