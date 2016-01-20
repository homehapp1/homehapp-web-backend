exports.registerRoutes = (app) => {
  /**
   * @apiDefine ImageSuccessJSON
   * @apiVersion 1.0.1
   *
   * @apiSuccessExample {json} Image JSON
   *     {
   *       "url": "...",
   *       "alt": "...",
   *       "width": ...,
   *       "height": ...,
   *       "aspectRatio": ...,
   *       "align": "...",
   *       "valign": "...",
   *     }
   */

  /**
   * @api {any} /api/* Images
   * @apiVersion 1.0.1
   * @apiName  Images
   * @apiGroup Shared
   * @apiUse ImageSuccessJSON
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
   */

  /**
   * @apiDefine VideoSuccessJSON
   * @apiVersion 1.0.1
   *
   * @apiSuccessExample {json} Video JSON
   *     {
   *       "url": "...",
   *       "alt": "...",
   *       "width": ...,
   *       "height": ...,
   *       "derived": [
   *         {
   *           "url": "...",
   *           "width": ...,
   *           "height": ...
   *         },
   *         ...,
   *         {
   *           "url": "...",
   *           "width": ...,
   *           "height": ...
   *         }
   *       ]
   *     }
   */

  /**
   * @api {any} /api/* Videos
   * @apiVersion 1.0.1
   * @apiName Videos
   * @apiGroup Shared
   * @apiUse VideoSuccess
   * @apiUse VideoSuccessJSON
   *
   * @apiDescription Every Video uses the following definition
   *
   * @apiParam {String} url        Video URL
   * @apiParam {String} [alt]        Alt text or brief description
   * @apiParam {Number} [width]      Video width
   * @apiParam {Number} [height]     Video height
   * @apiParam {boolean} [fixed]     Flag for fixing the video position for parallax scrolling
   */
};
