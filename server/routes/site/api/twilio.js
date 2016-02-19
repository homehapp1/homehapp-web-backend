import twilio from 'twilio';
import QueryBuilder from '../../../lib/QueryBuilder';
import {BadRequest} from '../../../lib/Errors';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let logCallContact = function logCallContact(req, user, state) {
    app.log.debug('logCallContact', req.body);
    let data = {
      type: 'phone',
      subType: state,
      sender: {
        phone: req.body.Caller
      },
      recipient: {
        user: user._id,
        name: user.name,
        phone: user._realPhoneNumber
      },
      tags: [
        `CallSid:${req.body.CallSid}`
      ]
    };
    if (state === 'finished') {
      data.tags.push(`DialCallStatus:${req.body.DialCallStatus}`);
    }
    app.log.debug(`Creating Contact from call`, data);
    QB
    .forModel('Contact')
    .createNoMultiset(data)
    .then(() => {
      app.log.debug(`Successfully saved Contact row`);
    })
    .catch((err) => {
      app.log.error(`Error creating contact log: ${err.message}`, err);
    });
  };

  app.post('/api/twilio/request/:userId/voice', function(req, res, next) {
    if (!req.headers['x-twilio-signature']) {
      app.log.error('twilio api access without header');
      return next(new BadRequest('invalid request'));
    }

    app.log.debug(`Call started for user ${req.params.userId}`, req.body);

    let callBackBaseUrl = `${app.config.clientConfig.siteHost}/api/twilio/request`;

    QB
    .forModel('User')
    .findByUuid(req.params.userId)
    .fetch()
    .then((result) => {
      let resp = new twilio.TwimlResponse();

      if (!result.model._realPhoneNumber) {
        resp.say('Unfortunately the call has failed for the user.', {
          voice: 'woman',
          language: 'en-gb'
        });
      } else {
        logCallContact(req, result.model, 'start');

        resp.say('Connecting you to the user, please hold. All calls are recorded.', {
          voice: 'woman',
          language: 'en-gb'
        });

        resp.dial({
          record: true,
          timeout: 60,
          action: `${callBackBaseUrl}/${result.model.uuid}/voice/completed`
        }, (node) => {
          node.number(result.model._realPhoneNumber);
        });

        resp.say('Unfortunately the call has failed or the user hung up. Goodbye', {
          voice: 'woman',
          language: 'en-gb'
        });
      }

      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(resp.toString());
    })
    .catch(next);
  });

  app.post('/api/twilio/request/:userId/voice/completed', function(req, res, next) {
    if (!req.headers['x-twilio-signature']) {
      app.log.error('twilio api access without header');
      return next(new BadRequest('invalid request'));
    }
    app.log.debug(`Call complete callback for ${req.params.userId}`, req.body);

    QB
    .forModel('User')
    .findByUuid(req.params.userId)
    .fetch()
    .then((result) => {
      app.log.debug(`Call completed for user ${result.model.name}`);
      logCallContact(req, result.model, 'finished');

      let resp = new twilio.TwimlResponse();
      resp.say('Thank you for calling, goodbye!', {
        voice: 'woman',
        language: 'en-gb'
      });
      resp.hangup();

      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(resp.toString());
    })
    .catch(next);
  });

};
