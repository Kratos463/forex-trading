const geoip = require('geoip-lite');
const UAParser= require('ua-parser-js');
const AccessLog = require('../models/accesslog.model');
const { LRUCache  } = require('lru-cache');

// Example usage
const ipCache = new LRUCache({ max: 100 });


async function createAccessLog(userId, activity, req) {
    try {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        let country = ipCache.get(ipAddress);

        if (!country) {
            const geo = geoip.lookup(ipAddress);
            country = geo ? geo.country : 'Unknown';

            ipCache.set(ipAddress, country);
        }

        const userAgentString = req.headers['user-agent'] || '';
        const parsedUA = new UAParser(userAgentString);
        const browserDetails = `${parsedUA.browser?.name} ${parsedUA.browser?.major}`;

        const newAccessLog = new AccessLog({
            user: userId,
            activity,
            ipAddress,
            country,
            browserDetails,
        });

        // Save the access log to the database
        await newAccessLog.save();
        
    } catch (err) {
        console.error('Error saving access log:', err);
        throw err; // Throw error to handle it in the calling function
    }
}

module.exports = createAccessLog
