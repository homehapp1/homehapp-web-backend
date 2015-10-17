

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
    registerNumberForAgent: (agent) => {
      //debug('registerNumberForAgent', agent);

      return new Promise((resolve, reject) => {
        let searchOpts = config.phoneNumbers.options || {};
        let numberType = 'local';
        // if (agent._realPhoneNumberType) {
        //   numberType = agent._realPhoneNumberType;
        // }
        let numberCountry = config.phoneNumbers.country;
        if (agent.location && agent.location.address.country) {
          numberCountry = agent.location.address.country;
        }
        twilioClient.availablePhoneNumbers(numberCountry)[numberType].get(searchOpts)
        .then((searchResults) => {
          //debug('got search results', searchResults);
          if (searchResults.availablePhoneNumbers.length < 1) {
            return reject(new Error('No numbers found with given options'));
          }

          let voiceCallBackUrl = `${callBackBaseUrl}/request/${agent.uuid}/voice`;
          let smsCallBackUrl = `${callBackBaseUrl}/request/${agent.uuid}/sms`;

          let createDetails = {
            PhoneNumber: searchResults.availablePhoneNumbers[0].phoneNumber,
            VoiceUrl: voiceCallBackUrl,
            SmsUrl: smsCallBackUrl,
            FriendlyName: agent.name
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
    unregisterNumberForAgent: (agent) => {
      //debug('unregisterNumberForAgent', agent);
      return new Promise((resolve, reject) => {
        if (!agent._contactNumberSid) {
          return resolve();
        }

        twilioClient.incomingPhoneNumbers(agent._contactNumberSid)
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
