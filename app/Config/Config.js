module.exports = {
    db: {
        local: {
            host: 'localhost',
            port: 27017,
            dbName: 'fondoo'
        },
        remote: {
            host: 'apollo.modulusmongo.net',
            port: 27017,
            dbName: 'zopomU2s',
            options: {
                //TODO change credentials
                username: 'mitZXtrm',
                password: 'GodKcalB'
            }
        }
    },
    security: {
        encryptions: {
            encrypt_type: 'sha256',
            encrypt_key: '4b 8?((~FKnpD))>8kb!B |#-uXIO24G3rc:&MG+FR{x;r#Uq4k{Ef@F4E9^-qS!', //change hash key
        },
        api: {
            appId: 'fondoo-rest', 
            appSecret: 'pDblTMZaFam59d@F9c#V1G9UEL17)Odz', 
        },
        tokenLife: 3600
    },
    mailer: {
        auth: {
         user: 'test@example.com',
         pass: 'secret',
       },
       defaultFromAddress: 'First Last <test@examle.com>'
    },
    cloudinary: {
        //setttings for the multer options
        cloud_name: 'virgin-labs-inc', 
        api_key: '877858668556557', 
        api_secret: '9uRNZ-JFL79ApRgHnyBLQrCQwq0' 
    },
    "gcm": {
        "apiKey": "AIzaSyBRH3MvZtxUA9ggmhpIMIvuE37s8f1d7Yk"
    },

    "apn": {
        "connection": {
            "gateway": "gateway.push.apple.com",
            "cert": "./cert/pushcert.pem",
            "key": "./cert/pushcert.pem"
        },
        "feedback": {
            "address": "feedback.push.apple.com",
            "cert": "./cert/pushcert.pem",
            "key": "./cert/pushcert.pem",
            "interval": 43200,
            "batchFeedback": true
        }
    },
    debug         : false,
    apiVersion    : 'v1.0'
}