import twilio from 'twilio';

let debug = require('debug')('Extension:twilio');

export function register(app, config) {
  if (!config.sid || !config.token) {
    return Promise.resolve();
  }

  let callBackBaseUrl = `${app.config.clientConfig.siteHost}/api/twilio`;

  let twilioClient = twilio(config.sid, config.token);

  app.twilio = {
    client: twilioClient,
    registerNumberForUser: (user) => {
      //debug('registerNumberForUser', user);

      return new Promise((resolve, reject) => {
        let searchOpts = config.phoneNumbers.options || {};
        let numberType = 'local';
        // if (user._realPhoneNumberType) {
        //   numberType = user._realPhoneNumberType;
        // }
        let numberCountry = config.phoneNumbers.country;
        if (user.location && user.location.address.country) {
          numberCountry = user.location.address.country;
        }
        twilioClient.availablePhoneNumbers(numberCountry)[numberType].get(searchOpts)
        .then((searchResults) => {
          //debug('got search results', searchResults);
          if (searchResults.availablePhoneNumbers.length < 1) {
            return reject(new Error('No numbers found with given options'));
          }

          let voiceCallBackUrl = `${callBackBaseUrl}/request/${user.uuid}/voice`;
          let smsCallBackUrl = `${callBackBaseUrl}/request/${user.uuid}/sms`;

          let createDetails = {
            PhoneNumber: searchResults.availablePhoneNumbers[0].phoneNumber,
            VoiceUrl: voiceCallBackUrl,
            SmsUrl: smsCallBackUrl,
            FriendlyName: user.name
          };
          app.log.debug('Purchasing number with details', createDetails);
          return twilioClient.incomingPhoneNumbers.create(createDetails);
        })
        .then((number) => {
          debug('got number', number);
          resolve(number);
        })
        .catch((err) => {
          debug('got error', err);
          reject(err);
        });
      });
    },
    unregisterNumberForUser: (user) => {
      //debug('unregisterNumberForUser', user);
      return new Promise((resolve, reject) => {
        if (!user._contactNumberSid) {
          return resolve();
        }

        twilioClient.incomingPhoneNumbers(user._contactNumberSid)
        .delete()
        .then(() => {
          debug('removed number');
          resolve();
        })
        .catch((err) => {
          app.log.error('got error while removing number', err);
          reject(err);
        });
      });
    }
  };

  return Promise.resolve();
}
