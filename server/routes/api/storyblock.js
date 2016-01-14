exports.registerRoutes = (app) => {
  /**
   * @api {any} /api/* Story blocks
   * @apiVersion 1.0.0
   * @apiName StoryBlock
   * @apiGroup Shared
   *
   * @apiDescription Story block definitions for both setting and getting
   *
   * @apiParam (BigImage) {string='BigImage'} template        Template name for big image widget
   * @apiParam (BigImage) {object} properties                 Story block properties
   * @apiParam (BigImage) {string} properties.title           Story block title
   * @apiParam (BigImage) {string} properties.description     Story block description
   * @apiParam (BigImage) {string='left', 'center', 'right'} [properties.align='center'] Horizontal position of the textual content
   * @apiParam (BigImage) {string='top', 'middle', 'bottom'} [properties.valign='middle'] Vertical position of the textual content
   * @apiParam (BigImage) {object} properties.image                <a href="#">Image object</a>
   *
   * @apiParam (BigVideo) {string='BigVideo'} template        Template name for BigVideo widget
   * @apiParam (BigVideo) {object} properties                 Story block properties
   * @apiParam (BigVideo) {string} properties.title                Story block title
   * @apiParam (BigVideo) {string} properties.description          Story block description
   * @apiParam (BigVideo) {string='left', 'center', 'right'} [properties.align='center'] Horizontal position of the textual content
   * @apiParam (BigVideo) {string='top', 'middle', 'bottom'} [properties.valign='middle'] Vertical position of the textual content
   * @apiParam (BigVideo) {object} properties.video                Video object
   * @apiParam (BigVideo) {string} properties.video.url            Video URL
   * @apiParam (BigVideo) {string} properties.video.alt            Alt text or brief description
   * @apiParam (BigVideo) {number} [properties.video.width]        Video width
   * @apiParam (BigVideo) {number} [properties.video.height]       Video height
   * @apiParam (BigVideo) {boolean} [properties.video.fixed]       Flag for fixing the video position for parallax scrolling
   * @apiParam (BigVideo) {string='left', 'center', 'right'} [properties.video.align='center'] Horizontal position of the video
   * @apiParam (BigVideo) {string='top', 'middle', 'bottom'} [properties.video.valign='middle'] Vertical position of the video
   *
   * @apiParam (ContentBlock) {string='ContentBlock'} template        Template name for ContentBlock widget
   * @apiParam (ContentBlock) {object} properties                 Story block properties
   * @apiParam (ContentBlock) {string} properties.title            Story block title
   * @apiParam (ContentBlock) {string} properties.content          Story block content
   * @apiParam (ContentBlock) {string='left', 'center', 'right'} [properties.align='left'] Horizontal position of the content
   *
   * @apiParam (ContentImage) {string='ContentImage'} template        Template name for big image widget
   * @apiParam (ContentImage) {object} properties                 Story block properties
   * @apiParam (ContentImage) {string} properties.title            Story block title
   * @apiParam (ContentImage) {string} properties.content          Story block content
   * @apiParam (ContentImage) {string='left', 'right'} [properties.imageAlign='left'] On which side the image should be related to the text
   *
   * @apiParam (Gallery) {string='Gallery'} template        Template name for Gallery widget
   * @apiParam (Gallery) {object} properties                 Story block properties
   * @apiParam (Gallery) {Array} [properties.images]               An array of <a href="#api-Shared-Images">Images</a>
   */

   /**
    * @api {any} /api/* Images
    * @apiVersion 1.0.0
    * @apiName  Images
    * @apiGroup Shared
    *
    * @apiDescription Every Image uses the following definition
    *
    * @apiParam {string} url            Image URL
    * @apiParam {string} alt            Alt text or brief description
    * @apiParam {number} [width]        Image width
    * @apiParam {number} [height]       Image height
    * @apiParam {number} [aspectRatio]  Aspect ratio
    * @apiParam {boolean} [fixed]       Flag for fixing the image position for parallax scrolling
    * @apiParam {string='left', 'center', 'right'} [align='center'] Horizontal position of the image
    * @apiParam {string='top', 'middle', 'bottom'} [valign='middle'] Vertical position of the image
    */
};
