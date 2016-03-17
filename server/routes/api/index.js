import QueryBuilder from '../../lib/QueryBuilder';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);
  // Pre load QBs
  QB.forModel('Home');
  QB.forModel('Neighborhood');

  /**
   * @apiDefine MobileRequestHeaders
   * @apiVersion 1.0.1
   *
   * @apiHeader {String} X-Homehapp-Api-Key  Api key for this project
   * @apiHeader {String} X-Homehapp-Client   Client identifier. In format: platform/manufacturer;deviceType;model;OS version/deviceID/deviceLanguageCode
   * @apiHeader {String} [X-Homehapp-Auth-Token]  Unique session token for logged in user
   * @apiHeader {String} [X-Homehapp-Api-Version=0]  Version of the API in use
   *
   * @apiHeaderExample {json} Required headers with authentication:
   *     {
   *       "X-Homehapp-Api-Key": "API KEY",
   *       "X-Homehapp-Client": "IOS/Apple;iPhone Simulator;x86_64;8.4.0/C9853654-3EBF-4BB5-9039-23DD0404A968/en",
   *       "X-Homehapp-Auth-Token": "USER TOKEN (IF APPLICAPLE)"
   *     }
   *
   * @apiHeaderExample {json} Required headers without authentication:
   *     {
   *       "X-Homehapp-Api-Key": "API KEY",
   *       "X-Homehapp-Client": "IOS/Apple;iPhone Simulator;x86_64;8.4.0/C9853654-3EBF-4BB5-9039-23DD0404A968/en"
   *     }
   */

   /**
    * @apiDefine MobileRequestHeadersUnauthenticated
    * @apiVersion 1.0.1
    *
    * @apiHeader {String} X-Homehapp-Api-Key  Api key for this project
    * @apiHeader {String} X-Homehapp-Client   Client identifier. In format: platform/manufacturer;deviceType;model;OS version/deviceID/deviceLanguageCode
    * @apiHeader {String} [X-Homehapp-Api-Version=0]  Version of the API in use
    *
    * @apiHeaderExample {json} Required headers:
    *     {
    *       "X-Homehapp-Api-Key": "API KEY",
    *       "X-Homehapp-Client": "IOS/Apple;iPhone Simulator;x86_64;8.4.0/C9853654-3EBF-4BB5-9039-23DD0404A968/en"
    *     }
    */

  /**
   * @apiDefine MobileRequestHeadersAuthenticated
   * @apiVersion 1.0.1
   *
   * @apiHeader {String} X-Homehapp-Api-Key  Api key for this project
   * @apiHeader {String} X-Homehapp-Client   Client identifier. In format: platform/manufacturer;deviceType;model;OS version/deviceID/deviceLanguageCode
   * @apiHeader {String} X-Homehapp-Auth-Token  Unique session token for logged in user
   * @apiHeader {String} [X-Homehapp-Api-Version=0]  Version of the API in use
   *
   * @apiHeaderExample {json} Required headers:
   *     {
   *       "X-Homehapp-Api-Key": "API KEY",
   *       "X-Homehapp-Client": "IOS/Apple;iPhone Simulator;x86_64;8.4.0/C9853654-3EBF-4BB5-9039-23DD0404A968/en",
   *       "X-Homehapp-Auth-Token": "USER TOKEN (IF APPLICAPLE)"
   *     }
   */

  // perform device info logging
  app.all('/api/*', app.logDevices);

  app.get('/api/deleted/:model', app.authenticatedRoute, function(req, res, next) {
    let modelName = null;
    switch (req.params.model) {
      case 'home':
        modelName = 'Home';
        break;
      case 'neighborhood':
        modelName = 'Neighborhood';
        break;
      default:
        modelName = 'Home';
    }

    QB
    .forModel(modelName)
    .select('uuid')
    .findDeleted(req.query.since)
    .fetch()
    .then((result) => {
      let ids = result.models.map((model) => {
        return model.uuid;
      });
      res.json({
        status: 'ok',
        items: ids
      });
    })
    .catch(next);
  });
};
