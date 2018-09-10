const settings = {
  security: {
    encryptions: {
      encrypt_type: 'sha256',
      encrypt_key: '4b 8?((~FKnpD))>8kb!B |#-uXIO24G3rc:&MG+FR{x;r#Uq4k{Ef@F4E9^-qS!', //change hash key
    },
    api: {
      appId: 'easyappchat-rest',
      appSecret: 'pDblTMZaFam59d@F9c#V1G9UEL17)Odz',
    },
    tokenLife: 604800 // in seconds i.e 7 days
  },
  apiVersion: 'v2.0',
  appVersion: 4,
  domainUrl: 'https://yolo-html-yolotechnologies.c9users.io/',
  apiServer: 'https://yolo-api-yolotechnologies.c9users.io/api/v2.0/',
  onesignal: {
    key: '13daf6cc-984f-48ea-b3e2-6177c78e0cb8'
  },
  google: {
    key: 'AIzaSyB7zQNLBVa2WgWH8msTjPEHS2j9UO66848'
  },
  defaultAppClient: '5a58cc15f1849d1a105db530',
  defaultAppCity: '5a58b942f1849d1a105db50e'
};

export default settings;
