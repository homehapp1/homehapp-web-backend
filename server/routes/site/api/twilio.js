'use strict';

import twilio from 'twilio';
import QueryBuilder from '../../../lib/QueryBuilder';
import {BadRequest} from '../../../lib/Errors';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  let logCallContact = function logCallContact(req, agent, state) {
    app.log.debug('logCallContact', req.body);
    let data = {
      type: 'phone',
      subType: state,
      sender: {
        phone: req.body.Caller
      },
      recipient: {
        agent: agent._id,
        name: agent.name,
        phone: agent._realPhoneNumber
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
    .then((model) => {
      app.log.debug(`Successfully saved Contact row`);
    })
    .catch((err) => {
      app.log.error(`Error creating contact log: ${err.message}`, err);
    });
  };

  app.post('/api/twilio/request/:agentId/voice', function(req, res, next) {
    // if (!req.headers['x-twilio-signature']) {
    //   app.log.error('twilio api access without header');
    //   return next(new BadRequest('invalid request'));
    // }

    app.log.debug(`Call started for agent ${req.params.agentId}`, req.body);

    let callBackBaseUrl = `${app.config.clientConfig.siteHost}/api/twilio/request`;

    QB
    .forModel('Agent')
    .findByUuid(req.params.agentId)
    .fetch()
    .then((result) => {
      let resp = new twilio.TwimlResponse();

      if (!result.model._realPhoneNumber) {
        resp.say('Unfortunately the call has failed for the agent.', {
          voice: 'woman',
          language: 'en-gb'
        });
      } else {
        resp.say('Connecting you to the agent, please hold.', {
          voice: 'woman',
          language: 'en-gb'
        });

        resp.dial({
          record: true,
          timeout: 60,
          action: `${callBackBaseUrl}/${result.model.uuid}/voice/completed`
        }, result.model._realPhoneNumber);

        resp.say('Unfortunately the call has failed or the agent hung up. Goodbye', {
          voice: 'woman',
          language: 'en-gb'
        });
        logCallContact(req, result.model, 'start');
      }

      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(resp.toString());
    })
    .catch(next);
  });

  app.post('/api/twilio/request/:agentId/voice/completed', function(req, res, next) {
    if (!req.headers['x-twilio-signature']) {
      app.log.error('twilio api access without header');
      return next(new BadRequest('invalid request'));
    }
    app.log.debug(`Call complete callback for ${req.params.agentId}`, req.body);

    QB
    .forModel('Agent')
    .findByUuid(req.params.agentId)
    .fetch()
    .then((result) => {
      app.log.debug(`Call completed for agent ${result.model.name}`);
      logCallContact(req, result.model, 'finished');
      res.json({
        status: 'ok'
      });
    })
    .catch(next);
  });

};
