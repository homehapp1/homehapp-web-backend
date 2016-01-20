exports.registerRoutes = (app) => {
  /**
   * @api {any} /api/* All story blocks
   * @apiVersion 1.0.1
   * @apiName All StoryBlocks
   * @apiGroup StoryBlocks
   * @apiUse StoryBlockSuccess
   * @apiUse StoryBlockSuccessJSON
   *
   * @apiDescription Story block definitions for both setting and getting
   *
   * @apiParam (ContentBlock) {string='ContentBlock'} template      Template name for ContentBlock widget
   * @apiParam (ContentBlock) {object} properties            Story block properties
   * @apiParam (ContentBlock) {string} properties.title        Story block title
   * @apiParam (ContentBlock) {string} properties.content       Story block content
   * @apiParam (ContentBlock) {string='left', 'center', 'right'} [properties.align='left'] Horizontal position of the content
   *
   * @apiParam (ContentImage) {string='ContentImage'} template      Template name for big image widget
   * @apiParam (ContentImage) {object} properties            Story block properties
   * @apiParam (ContentImage) {string} properties.title        Story block title
   * @apiParam (ContentImage) {string} properties.content       Story block content
   * @apiParam (ContentImage) {string='left', 'right'} [properties.imageAlign='left'] On which side the image should be related to the text
   *
   * @apiParam (Gallery) {string='Gallery'} template      Template name for Gallery widget
   * @apiParam (Gallery) {object} properties            Story block properties
   * @apiParam (Gallery) {Array} [properties.images]          An array of <a href="#api-Shared-Images">Images</a>
   */

  /**
   * @apiDefine StoryBlockSuccess
   * @apiVersion 1.0.1
   *
   * @apiSuccess {boolean} enabled      Switch to enable story block
   * @apiSuccess {Array} blocks         Story blocks as defined here
   */

  /**
   * @apiDefine StoryBlockSuccessJSON
   * @apiVersion 1.0.1
   *
   * @apiSuccessExample {json} Story block segment
   *     {
   *       "enabled": true,
   *       "blocks": [
   *         {
   *           "template": '...',
   *           "properties": {...}
   *         },
   *         ...,
   *         {
   *           "template": '...',
   *           "properties": {...}
   *         }
   *       ]
   *     }
   */

  /**
   * @api {any} /api/* BigImage
   * @apiVersion 1.0.1
   * @apiName BigImage
   * @apiGroup StoryBlocks
   *
   * @apiParam {string='BigImage'} template      Template name for big image widget
   * @apiParam {object} properties            Story block properties
   * @apiParam {string} properties.title        Story block title
   * @apiParam {string} properties.description    Story block description
   * @apiParam {string='left', 'center', 'right'} [properties.align='center'] Horizontal position of the textual content
   * @apiParam {string='top', 'middle', 'bottom'} [properties.valign='middle'] Vertical position of the textual content
   * @apiParam {object} properties.image           <a href="#">Image object</a>
   *
   * @apiSuccess {String} template            Template name, always BigImage
   * @apiSuccess {Object} properties          Content control properties
   * @apiSuccess {Object} properties.image    <a href="#api-Shared-Images">Image</a> object
   * @apiSuccess {String} align               Horizontal alignment of the text ('left', 'center', 'right')
   * @apiSuccess {String} valign              Vertical alignment of the text ('top', 'middle', 'bottom')
   * @apiSuccess {String} title               Block title
   * @apiSuccess {String} description         Block content or description
   *
   * @apiSuccessExample {json} Example
   *     {
   *       "template": 'BigImage',
   *       "properties": {
   *         "image": {...},
   *         "title": "...",
   *         "description": "...",
   *         "align": "center",
   *         "valign": "middle",
   *       }
   *     }
   * @apiUse ImageSuccessJSON
   */
  /**
   * @api {any} /api/* BigVideo
   * @apiVersion 1.0.1
   * @apiName BigVideo
   * @apiGroup StoryBlocks
   *
   * @apiParam {string='BigImage'} template      Template name for big video widget
   * @apiParam {object} properties            Story block properties
   * @apiParam {string} properties.title        Story block title
   * @apiParam {string} properties.description    Story block description
   * @apiParam {string='left', 'center', 'right'} [properties.align='center'] Horizontal position of the textual content
   * @apiParam {string='top', 'middle', 'bottom'} [properties.valign='middle'] Vertical position of the textual content
   * @apiParam {object} properties.video           <a href="#">Video object</a>
   *
   * @apiSuccess {String} template            Template name, always BigVideo
   * @apiSuccess {Object} properties          Content control properties
   * @apiSuccess {Object} properties.image    <a href="#api-Shared-Videos">Video</a> object
   * @apiSuccess {String} align               Horizontal alignment of the text ('left', 'center', 'right')
   * @apiSuccess {String} valign              Vertical alignment of the text ('top', 'middle', 'bottom')
   * @apiSuccess {String} title               Block title
   * @apiSuccess {String} description         Block content or description
   *
   * @apiSuccessExample {json} Example
   *     {
   *       "template": 'BigVideo',
   *       "properties": {
   *         "video": {...},
   *         "title": "...",
   *         "description": "...",
   *         "align": "center",
   *         "valign": "middle",
   *       }
   *     }
   * @apiUse VideoSuccessJSON
   */
};
