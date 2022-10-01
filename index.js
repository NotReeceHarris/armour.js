'use strict';

Object.size = function(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

module.exports = function(options = { "security": {}, "dashboard": {} }) {

    // Default options
    options = {
        "ignore": options.ignore != undefined ? options.ignore : [], // Ignore paths
        "spoof": options.spoof != undefined ? options.spoof : true, // spoof server information
        "security": {
            "hideHeaders": options.hasOwnProperty('security') ? options.security.hideHeaders != undefined ? options.security.hideHeaders : true : true, // Hide headers

            "xss": options.hasOwnProperty('security') ? options.security.xss != undefined ? options.security.xss : true : true, // XSS protection
            "honeypot": options.hasOwnProperty('security') ? options.security.honeypot != undefined ? options.security.honeypot : true : true, // Honeypot protection
            "rateLimit": options.hasOwnProperty('security') ? options.security.rateLimit != undefined ? options.security.rateLimit : true : true, // Rate limit protection
            "urlFuzzing": options.hasOwnProperty('security') ? options.security.urlFuzzing != undefined ? options.security.urlFuzzing : true : true, // URL fuzzing protection
            "sqlInjection": options.hasOwnProperty('security') ? options.security.sqlInjection != undefined ? options.security.sqlInjection : true : true, // SQL injection protection
        },
        "dashboard": {
            "enabled": options.hasOwnProperty('dashboard') ? options.dashboard.enabled != undefined ? options.dashboard.enabled : true : true, // Enable dashboard
            "path": options.hasOwnProperty('dashboard') ? options.dashboard.path != undefined ? options.dashboard.path : null : null, // Dashboard path
        }
    };

    return async function(req, res, next) {

        // Init dashboard
        if (options.dashboard.enabled) {
            // Create a path for dashboard
            if (options.dashboard.path == null) {
                options.dashboard.path = ''
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 64; i++) { options.dashboard.path += possible.charAt(Math.floor(Math.random() * possible.length)); }
                console.log('[armour.js] Tracking path: \t' + `${req.protocol}://${req.hostname}/${options.dashboard.path}`);
            }
            require('./lib/track')(req, res, next, options.dashboard.path);
        }

        // Check if the path is ignored
        if (options.ignore.includes(req.path)) {
            return next();
        }

        // Hide server headers
        if (options.security.hideHeaders) {
            if (options.spoof) {
                // Spoof server information
                const spoof = require('./lib/spoof.json');
                res.setHeader('Server', spoof.headers.server[Math.floor(Math.random() * spoof.headers.server.length)]);
                res.setHeader('X-Powered-By', spoof.headers.xPoweredBy[Math.floor(Math.random() * spoof.headers.xPoweredBy.length)]);
            } else {
                // Remove server information
                res.removeHeader('X-Powered-By');
                res.removeHeader('Server');
            }
        }

        // sqlInjection protection
        if (options.security.sqlInjection) {

            const formData = {}
            await req.on('data', data => {
                const parsedData = decodeURIComponent(data).split('&')
                for (let data of parsedData) {
                    let decodedData = decodeURIComponent(data.replace(/\+/g, '%20'))
                    const [key, value] = decodedData.split('=')
                    formData[key] = value
                }
            })

            if (Object.size(req.query) > 0 || Object.size(formData) > 0) {
                return res.status(403).send('Forbidden');
            }
        }



        next();

    };

};