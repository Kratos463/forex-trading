const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accessLogSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    activity: { type: String },
    ipAddress: { type: String },
    browserDetails: { type: String },
    country: { type: String }
});

// Static method to keep only the latest 5 access logs for each user
accessLogSchema.statics.keepLatestLogs = async function(userId) {
    try {
        const logsToDelete = await AccessLog
            .find({ user: userId })
            .sort({ timestamp: -1 }) // Sort by timestamp descending
            .skip(5) // Skip the latest 5 logs (these are the ones we want to keep)
            .exec();

        if (logsToDelete.length > 0) {
            const deletePromises = logsToDelete.map(log => log.remove());
            await Promise.all(deletePromises);
        }
    } catch (err) {
        console.error('Error cleaning up old access logs:', err);
        throw err;
    }
};

const AccessLog = mongoose.model('AccessLog', accessLogSchema);

module.exports = AccessLog;
