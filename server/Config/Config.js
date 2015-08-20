module.exports = {
    db: {
        local: {
            host: 'localhost',
            port: 27017,
            dbName: 'resty'
        },
        remote: {
            host: 'ds059702.mongolab.com:59702',
            port: 59702,
            dbName: 'resty',
            options: {
                //TODO change credentials
                username: 'resty',
                password: 'resty'
            }
        }
    },
    security: {
        encryptions: {
            encrypt_type: 'sha256',
            encrypt_key: '4b 8?((~FKnpD))>8kb!B |#-uXIO24G3rc:&MG+FR{x;r#Uq4k{Ef@F4E9^-qS!', //change hash key
        },
        api: {
            appId: 'resty', 
            appSecret: 'resty', 
        },
        tokenLife: 3600
    },
    mailer: {
        auth: {
         user: 'test@example.com',
         pass: 'secret',
       },
       defaultFromAddress: 'Test <test@examle.com>'
    },
    cloudinary: {
        //setttings for the cloudinary options
        cloud_name: 'jumacro-software-systems-pvt-ltd', 
        api_key: '165614874531362', 
        api_secret: 'N5Vj6Fn5e_ADKau0XgHfqvXOg-g' 
    },
    gcm: {
        apiKey: "GCM-Api-key-here"
    },

    apn: {
        connection: {
            gateway: "gateway.push.apple.com",
            cert: "./cert/pushcert.pem",
            key: "./cert/pushcert.pem"
        },
        feedback: {
            address: "feedback.push.apple.com",
            cert: "./cert/pushcert.pem",
            key: "./cert/pushcert.pem",
            interval: 43200,
            batchFeedback: true
        }
    },
    debug         : false,
    apiVersion    : 'v1.0'
}