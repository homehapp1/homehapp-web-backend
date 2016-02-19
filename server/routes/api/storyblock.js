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
   * @apiDescription          BigImage widget is for displaying a fullscreen image with optional text on top of it
   * @apiName BigImage
   * @apiGroup StoryBlocks
   *
   * @apiParam {string='BigImage'} template           Template name for big image widget
   * @apiParam {object} properties                    Story block properties
   * @apiParam {string} properties.title              Story block title
   * @apiParam {string} properties.description        Story block description
   * @apiParam {string='left', 'center', 'right'} [properties.align='center'] Horizontal position of the textual content
   * @apiParam {string='top', 'middle', 'bottom'} [properties.valign='middle'] Vertical position of the textual content
   * @apiParam {object} properties.image              <a href="#api-Shared-Images">Image object</a>
   *
   * @apiSuccess {String} template                    Template name, always BigImage
   * @apiSuccess {Object} properties                  Content control properties
   * @apiSuccess {Object} properties.image            <a href="#api-Shared-Images">Image</a> object
   * @apiSuccess {String} properties.align            Horizontal alignment of the text ('left', 'center', 'right')
   * @apiSuccess {String} properties.valign           Vertical alignment of the text ('top', 'middle', 'bottom')
   * @apiSuccess {String} properties.title            Block title
   * @apiSuccess {String} properties.description      Block content or description
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
   * @apiDescription          BigVideo widget is for displaying a fullscreen video with optional text on top of it
   * @apiName BigVideo
   * @apiGroup StoryBlocks
   *
   * @apiParam {string='BigVideo'} template           Template name for big video widget
   * @apiParam {object} properties                    Story block properties
   * @apiParam {string} properties.title              Story block title
   * @apiParam {string} properties.description        Story block description
   * @apiParam {string='left', 'center', 'right'} [properties.align='center'] Horizontal position of the textual content
   * @apiParam {string='top', 'middle', 'bottom'} [properties.valign='middle'] Vertical position of the textual content
   * @apiParam {object} properties.video              <a href="#api-Shared-Videos">Video object</a>
   *
   * @apiSuccess {String} template                    Template name, always BigVideo
   * @apiSuccess {Object} properties                  Content control properties
   * @apiSuccess {Object} properties.video            <a href="#api-Shared-Videos">Video</a> object
   * @apiSuccess {String} properties.align            Horizontal alignment of the text ('left', 'center', 'right')
   * @apiSuccess {String} properties.valign           Vertical alignment of the text ('top', 'middle', 'bottom')
   * @apiSuccess {String} properties.title            Block title
   * @apiSuccess {String} properties.description      Block content or description
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

  /**
   * @api {any} /api/* ContentBlock
   * @apiVersion 1.0.1
   * @apiDescription          ContentBlock is a basic text block in the content flow
   * @apiName ContentBlock
   * @apiGroup StoryBlocks
   *
   * @apiParam {string='ContentBlock'} template       Template name for ContentBlock widget
   * @apiParam {object} properties                    Story block properties
   * @apiParam {string} properties.title              Story block title
   * @apiParam {string} properties.content            Story block content
   * @apiParam {string='left', 'center', 'right'} [properties.align='left'] Horizontal position of the content
   *
   * @apiSuccess {String} template                    Template name, always ContentBlock
   * @apiSuccess {Object} properties                  Content control properties
   * @apiSuccess {String} properties.title            Block title
   * @apiSuccess {String} properties.description      Block content or description
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

  /**
   * @api {any} /api/* ContentImage
   * @apiVersion 1.0.1
   * @apiDescription          ContentImage displays an image in conjunction with text with a control parameter defining which comes first
   * @apiName ContentBlock
   * @apiGroup StoryBlocks
   *
   * @apiSuccess {String} template                    Template name, always ContentImage
   * @apiParam {object} properties                    Story block properties
   * @apiParam {string} properties.title              Story block title
   * @apiParam {string} properties.content            Story block content
   * @apiParam {object} properties.image              <a href="#api-Shared-Images">Image object</a>
   * @apiParam {string='left', 'right'} [properties.imageAlign='left'] Horizontal position of the content
   *
   * @apiSuccess {String} template                    Template name, always ContentImage
   * @apiSuccess {Object} properties                  Content control properties
   * @apiSuccess {Object} properties.image            <a href="#api-Shared-Images">Image</a> object
   * @apiSuccess {String} properties.title            Block title
   * @apiSuccess {String} properties.description      Block content or description
   * @apiSuccess {String} properties.imageAlign       Position of the image related to the text: "left" or "right"
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

  /**
   * @api {any} /api/* Gallery
   * @apiVersion 1.0.1
   * @apiDescription      Gallery widget
   * @apiName Gallery
   * @apiGroup StoryBlocks
   *
   * @apiParam {string='Gallery'} template            Template name for Gallery widget
   * @apiParam {object} properties                    Story block properties
   * @apiParam {Array} properties.images              An array of <a href="#api-Shared-Images">Images</a>
   */
};
