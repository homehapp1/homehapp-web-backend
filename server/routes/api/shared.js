exports.registerRoutes = (app) => {
  /**
   * @apiDefine ImageSuccess
   * @apiVersion 1.0.1
   *
   * @apiSuccess {String} url     Image URL
   * @apiSuccess {String} alt     Brief image description
   * @apiSuccess {Number} width   Width of the image
   * @apiSuccess {Number} height  Height of the image
   * @apiSuccess {Number} aspectRatio Width/height ratio of the image
   */

  /**
   * @apiDefine ImageSuccessJSON
   * @apiVersion 1.0.1
   *
   * @apiSuccessExample {json} Image JSON
   *     {
   *       "url": "https://...",
   *       "alt": "...",
   *       "width": ...,
   *       "height": ...,
   *       "aspectRatio": ...,
   *       "align": "...",
   *       "valign": "...",
   *     }
   */

  /**
   * @apiDefine ImageRequestJSON
   * @apiVersion 1.0.1
   * @apiParamExample {json} Request-Example
   *    {
   *      "url": "https://...",
   *      "alt": "...",
   *      "width": 1920,
   *      "height": 1080,
   *      "fixed": false,
   *      "align": "center",
   *      "valign": "middle"
   *    }
   */

  /**
   * @api {any} /api/* Images
   * @apiVersion 1.0.1
   * @apiName  Images
   * @apiGroup Shared
   * @apiUse ImageSuccess
   * @apiUse ImageSuccessJSON
   * @apiUse ImageRequestJSON
   *
   * @apiDescription Every Image uses the following definition
   *
   * @apiParam {String} url        Image URL
   * @apiParam {String} [alt]        Alt text or brief description
   * @apiParam {Number} [width]      Image width
   * @apiParam {Number} [height]     Image height
   * @apiParam {Number} [aspectRatio]  Aspect ratio
   * @apiParam {Boolean} [fixed]     Flag for fixing the image position for parallax scrolling
   * @apiParam {String='left', 'center', 'right'} [align='center'] Horizontal position of the image
   * @apiParam {String='top', 'middle', 'bottom'} [valign='middle'] Vertical position of the image
   */

  /**
   * @apiDefine VideoSuccess
   * @apiVersion 1.0.1
   *
   * @apiSuccess {String} url     Video URL
   * @apiSuccess {String} alt     Brief video description
   * @apiSuccess {Number} width   Width of the video
   * @apiSuccess {Number} height  Height of the video
   * @apiSuccess {Array} derived  An array of derived video objects
   * @apiSuccess {Object} derived.0       An example of a derived video object
   * @apiSuccess {String} derived.0.url     Derived video URL
   * @apiSuccess {String} derived.0.format  Derived video format
   * @apiSuccess {Number} derived.0.width   Derived video width
   * @apiSuccess {Number} derived.0.height  Derived video height
   */

  /**
   * @apiDefine VideoSuccessJSON
   * @apiVersion 1.0.1
   *
   * @apiSuccessExample {json} Video JSON
   *     {
   *       "url": "https://...",
   *       "alt": "...",
   *       "width": ...,
   *       "height": ...,
   *       "derived": [
   *         {
   *           "url": "https://...",
   *           "width": ...,
   *           "height": ...,
   *           "format": "webm"
   *         },
   *         ...,
   *         {
   *           "url": "https://...",
   *           "width": ...,
   *           "height": ...,
   *           "format": "mp4"
   *         }
   *       ]
   *     }
   */

  /**
   * @apiDefine VideoRequestJSON
   * @apiVersion 1.0.1
   * @apiParamExample {json} Request-Example
   *    {
   *      "url": "https://...",
   *      "alt": "...",
   *      "width": 1920,
   *      "height": 1080,
   *      "fixed": false,
   *      "align": "center",
   *      "valign": "middle",
   *      "derived": [
   *         {
   *           "url": "https://...",
   *           "width": ...,
   *           "height": ...,
   *           "format": "webm"
   *         },
   *         {
   *           "url": "https://...",
   *           "width": ...,
   *           "height": ...,
   *           "format": "mp4"
   *      ]
   *    }
   */

  /**
   * @api {any} /api/* Videos
   * @apiVersion 1.0.1
   * @apiName Videos
   * @apiGroup Shared
   * @apiUse VideoSuccess
   * @apiUse VideoSuccessJSON
   * @apiUse VideoRequestJSON
   *
   * @apiDescription Every Video uses the following definition
   *
   * @apiParam {String} url         Video URL
   * @apiParam {String} [alt]       Alt text or brief description
   * @apiParam {Number} [width]     Video width
   * @apiParam {Number} [height]    Video height
   * @apiParam {boolean} [fixed]    Flag for fixing the video position for parallax scrolling
   * @apiParam {Array} [derived]        Derived videos
   * @apiParam {Object} [derived.0]     Derived video object, which - when presented - has to fulfill its required fields
   * @apiParam {String} derived.0.video.url         Derived video URL
   * @apiParam {String} derived.0.video.format      Derived video format
   * @apiParam {Number} [derived.0.video.width]     Derived video width
   * @apiParam {Number} [derived.0.video.height]    Derived video height
   */
};
