module.exports = {
    db: {
        local: {
            host: 'localhost',
            port: 27017,
            dbName: 'fondoo'
        },
        remote: {
            host: 'test',
            port: 27017,
            dbName: 'test',
            options: {
                //TODO change credentials
                username: 'test',
                password: 'test'
            }
        }
    },
    security: {
        encryptions: {
            encrypt_type: 'sha256',
            encrypt_key: '4b 8?((~FKnpD))>8kb!B |#-uXIO24G3rc:&MG+FR{x;r#Uq4k{Ef@F4E9^-qS!', //change hash key
        },
        api: {
            appId: 'test-resty', 
            appSecret: 'pAoQWEiuy1!@', 
        },
        tokenLife: 3600
    },
    gcm: {
        apiKey: "AIzaSyBRH3MvZtxUA9ggmhpIMIvuE37s8f1d7Yk"
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