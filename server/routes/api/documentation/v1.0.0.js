/**
 * @apiDefine AuthSuccessResponse
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object} session
 * @apiSuccess {String} session.token             Authentication token for the user
 * @apiSuccess {Number} session.expiresIn         Expiration time in seconds
 * @apiSuccess {Datetime} session.expiresAt       ISO-8601 Formatted Expiration Datetime
 * @apiSuccess {Object} session.user              <a href="#api-Users-UserData">User</a> object
 */
/**
 * @api {post} /api/auth/login Login the Mobile User
 * @apiVersion 1.0.0
 * @apiName UserLogin
 * @apiGroup Authentication
 *
 * @apiUse MobileRequestHeadersUnauthenticated
 * @apiParam {String} service     Name of the external service. Enum[facebook, google]
 * @apiParam {Object} user        Details of the user
 * @apiParam {String} user.id              User's Id from the service
 * @apiParam {String} user.email           User's email from the service
 * @apiParam {String} user.token           User's token from the service
 * @apiParam {String} [user.displayName]   User's full name from the service
 * @apiParam {String} [user.firstname]     User's first name from the service
 * @apiParam {String} [user.lastname]      User's last name from the service
 * @apiUse AuthSuccessResponse
 * @apiUse UserSuccessResponseJSON
 * @apiUse HomeSuccessResponseJSON
 *
 * @apiSuccessExample Success-Response
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "ok",
 *       "session": {
 *          "token": "...",
 *          "expiresIn": ...,
 *          "expiresAt": '...',
 *          "user": {...}
 *         }
 *       }
 *     }
 *
 * @apiError (400) BadRequest Invalid request body, missing parameters.
 * @apiError (403) Forbidden  User account has been disabled
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       'status': 'failed',
 *       'error': 'account disabled'
 *     }
 */
/**
 * @api {post} /api/auth/register/push Register/Unregister Mobile Client for Push
 * @apiVersion 1.0.0
 * @apiName PushRegister
 * @apiGroup Authentication
 *
 * @apiDescription When given a valid pushToken, registers the device to receive push notifications. Otherwise unregisters the device.
 *
 * @apiPermission authenticated
 * @apiUse MobileRequestHeadersAuthenticated
 * @apiParam {String} pushToken    Push token for mobile client
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       'status': 'ok'
 *     }
 *
 * @apiError (400) BadRequest Invalid request body, missing parameters.
 * @apiError (403) Forbidden  User account has been disabled
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       'status': 'failed',
 *       'error': 'account disabled'
 *     }
 */
/**
 * @api {get} /api/auth/check Check session validity
 * @apiVersion 1.0.0
 * @apiName CheckSessionValidity
 * @apiGroup Authentication
 *
 * @apiDescription Allows for checking if the session is valid
 *
 * @apiPermission authenticated
 * @apiUse MobileRequestHeadersAuthenticated
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       'status': 'ok'
 *     }
 *
 * @apiError (403) Forbidden  User account has been disabled
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       'status': 'failed',
 *       'error': 'account disabled'
 *     }
 */
/**
 * @apiDefine HomeSuccessResponse
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} id                Uuid of the home
 * @apiSuccess {String} slug              URL Slug of the Home
 * @apiSuccess {Boolean} enabled          Switch for enabling/disabling the public viewing of the home
 * @apiSuccess {String} title             Home title
 * @apiSuccess {String} announcementType  Home announcement type. Enum ['buy', 'rent', 'story']
 * @apiSuccess {String} description       Description of the Home
 * @apiSuccess {Object} details           Home details
 * @apiSuccess {Number} details.area      Area in square meters
 * @apiSuccess {String} details.freeform  Freeform description
 * @apiSuccess {Object} location                  Location details
 * @apiSuccess {Object} location.address          Location address details
 * @apiSuccess {String} location.address.street   Street address
 * @apiSuccess {String} location.address.apartment   Apartment
 * @apiSuccess {String} location.address.city     City
 * @apiSuccess {String} location.address.zipcode   zipcode
 * @apiSuccess {String} location.address.country   Country
 * @apiSuccess {Array}  location.coordinates   Map coordinates. [LAT, LON]
 * @apiSuccess {Object} location.neighborhood   Neighborhood object TODO: Define
 * @apiSuccess {Object} mainImage                Main <a href="#api-Shared-Images">Image</a> of the home
 * @apiSuccess {Array} epc                      EPC <a href="#api-Shared-Images">Image</a> or PDF
 * @apiSuccess {Array} images                    Home <a href="#api-Shared-Images">Images</a>
 * @apiSuccess {Array} floorplans               An array of <a href="#api-Shared-Images">Images</a>, dedicated to floorplans
 * @apiSuccess {Array} brochures                An array of <a href="#api-Shared-Images">Images</a>, dedicated to brochures
 * @apiSuccess {Object} story             Home story blocks
 * @apiSuccess {Boolean} story.enabled    Switch to determine if the story is public
 * @apiSuccess {Array} story.blocks       An array of <a href="#api-Shared-StoryBlock">StoryBlocks</a>
 * @apiSuccess {Object} neighborhoodStory             Neighborhood story blocks
 * @apiSuccess {Boolean} neighborhoodStory.enabled    Switch to determine if the story is public
 * @apiSuccess {Array} neighborhoodStory.blocks       An array of <a href="#api-Shared-StoryBlock">StoryBlocks</a>
 * @apiSuccess {String} createdBy         UUID of the <a href="#api-Users-UserData">User</a> that has created the home
 * @apiSuccess {String} updatedBy         UUID of the <a href="#api-Users-UserData">User</a> that has updated the home
 * @apiSuccess {Datetime} createdAt       ISO-8601 Formatted Creation Datetime
 * @apiSuccess {Datetime} updatedAt       ISO-8601 Formatted Updation Datetime
 * @apiSuccess {Integer} createdAtTS      EPOCH formatted timestamp of the creation time
 * @apiSuccess {Integer} updatedAtTS      EPOCH formatted timestamp of the updation time
 */
/**
 * @apiDefine HomeSuccessResponseJSON
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} JSON serialization of the home
 * {
 *   "id": "00000000-0000-0000-0000-000000000000",
 *   "slug": "...",
 *   "enabled": true,
 *   "title": "Home sweet home",
 *   "announcementType": "story",
 *   "description": "I am an example",
 *   "details": {
 *     "area": ...,
 *     "freeform": "...",
 *   },
 *   "location": {
 *     "address": "221B Baker Street",
 *     "city": "Exampleby",
 *     "country": "Great Britain",
 *     "coordinates": [
 *       51.4321,
 *       -0.1234
 *     ],
 *     "neighborhood": "00000000-0000-0000-0000-000000000000"
 *   },
 *   "mainImage": {
 *     "url": "https:*res.cloudinary.com/homehapp/.../example.jpg",
 *     "alt": "View towards the sunset",
 *     "width": 4200,
 *     "height": 2500
 *   },
 *   "images": [
 *     {
 *       "url": "https:*res.cloudinary.com/homehapp/.../example.jpg",
 *       "alt": "View towards the sunset",
 *       "width": 4200,
 *       "height": 2500
 *     },
 *     {
 *       ...
 *     }
 *   ],
 *   "epc": [
 *     {
 *       "url": "https:*res.cloudinary.com/homehapp/.../example.jpg",
 *       "alt": "View towards the sunset",
 *       "width": 4200,
 *       "height": 2500
 *     },
 *     {
 *       ...
 *     }
 *   ],
 *   "floorplans": [
 *     {
 *       "url": "https:*res.cloudinary.com/homehapp/.../example.jpg",
 *       "alt": "View towards the sunset",
 *       "width": 4200,
 *       "height": 2500
 *     },
 *     {
 *       ...
 *     }
 *   ],
 *   "brochures": [
 *     {
 *       "url": "https:*res.cloudinary.com/homehapp/.../example.jpg",
 *       "alt": "View towards the sunset",
 *       "width": 4200,
 *       "height": 2500
 *     },
 *     {
 *       ...
 *     }
 *   ],
 *   "story": {
 *     "enabled": true,
 *     "blocks": [
 *       {
 *         "template": "BigImage",
 *         "properties": {
 *           "image": {
 *             "url": "https:*res.cloudinary.com/homehapp/.../example.jpg",
 *             "alt": "View towards the sunset",
 *             "width": 4200,
 *             "height": 2500
 *           },
 *           "title": "A great spectacle",
 *           "description": "The evening routines of the Sun"
 *         }
 *       }
 *     ]
 *   },
 *   "neighborhoodStory": {
 *     "enabled": true,
 *     "blocks": [
 *       {
 *         "template": "BigImage",
 *         "properties": {
 *           "image": {
 *             "url": "https:*res.cloudinary.com/homehapp/.../example.jpg",
 *             "alt": "View towards the sunset",
 *             "width": 4200,
 *             "height": 2500
 *           },
 *           "title": "A great spectacle",
 *           "description": "The evening routines of the Sun"
 *         }
 *       }
 *     ]
 *   },
 *   "createdBy": "00000000-0000-0000-0000-000000000000",
 *   "updatedBy": "00000000-0000-0000-0000-000000000000",
 *   "createdAt": "2016-01-13T14:38:01.0000Z",
 *   "updatedAt": "2016-01-13T14:38:01.0000Z",
 *   "createdAtTS": 1452695955,
 *   "updatedAtTS": 1452695955
 * }
 */
/**
 * @apiDefine HomeBody
 * @apiVersion 1.0.0
 *
 * @apiParam {Object} home                     Home object
 * @apiParam {Boolean} [home.enabled]          Switch for enabling/disabling the public viewing of the home
 * @apiParam {String} [home.title]             Title of the Home
 * @apiParam {String} [home.announcementType]  Home announcement type. Enum ['buy', 'rent', 'story']
 * @apiParam {String} home.description         Textual description of the Home
 * @apiParam {Object} [home.details]           Location details
 * @apiParam {Number} [home.details.area]      Numeric surface area
 * @apiParam {Object} [home.location.address]            Location address details
 * @apiParam {String} [home.location.address.street]     Street address
 * @apiParam {String} [home.location.address.apartment]  Apartment
 * @apiParam {String} [home.location.address.city]       City
 * @apiParam {String} [home.location.address.zipcode]    zipcode
 * @apiParam {String} [home.location.address.country]    Country
 * @apiParam {Array}  [home.location.coordinates]        Map coordinates. [LAT, LON]
 * @apiParam {String} [home.location.neighborhood]       UUID of the Neighborhood
 * @apiParam {Object} [home.costs]                   Costs details
 * @apiParam {String} [home.properties]              Home properties, i.e. list of
 * @apiParam {String} [home.costs.currency='GBP']    Currency. Enum ['EUR', 'GBP', 'USD']
 * @apiParam {Number} [home.costs.sellingPrice]      Selling price
 * @apiParam {Number} [home.costs.rentalPrice]       Rental price
 * @apiParam {Number} [home.costs.councilTax]        Council tax
 * @apiParam {Array}  [home.images]                  An array of <a href="#api-Shared-Images">Images</a>
 * @apiParam {Array}  [home.epc]                     An array of <a href="#api-Shared-Images">Images</a>, dedicated to EPC
 * @apiParam {Array}  [home.floorplans]              An array of <a href="#api-Shared-Images">Images</a>, dedicated to floorplans. Set the floorplan name as image.alt for each image.
 * @apiParam {Array}  [home.brochures]               An array of <a href="#api-Shared-Images">Images</a>, dedicated to brochures. Set the printable brochure name as image.alt for each image.
 * @apiParam {Object} [home.story]                   Story block container object
 * @apiParam {Boolean} [home.story.enabled=false]    Switch to determine if the story is public
 * @apiParam {Array} [home.story.blocks]             An array of <a href="#api-Shared-StoryBlock">StoryBlocks</a>
 * @apiParam {Object} [home.neighborhoodStory]                   Story block container object
 * @apiParam {Boolean} [home.neighborhoodStory.enabled=false]    Switch to determine if the story is public
 * @apiParam {Array} [home.neighborhoodStory.blocks]             An array of <a href="#api-Shared-StoryBlock">StoryBlocks</a>
 */
/**
 * @api {any} /api/* Home Details
 * @apiVersion 1.0.0
 * @apiName Home details
 * @apiGroup Homes
 *
 * @apiDescription Data for each home object passed from the backend contains the same set of information
 *
 * @apiUse MobileRequestHeaders
 * @apiUse HomeSuccessResponse
 * @apiUse HomeSuccessResponseJSON
 */
/**
 * @api {get} /api/homes Fetch All Homes
 * @apiVersion 1.0.0
 * @apiName GetHomes
 * @apiGroup Homes
 *
 * @apiDescription Route for fetching Homes
 *
 * @apiUse MobileRequestHeaders
 * @apiUse HomeSuccessResponse
 * @apiUse HomeSuccessResponseJSON
 *
 * @apiParam (Query) {String} [sort=desc]          Sort order. Enum: ['asc', 'desc']
 * @apiParam (Query) {String} [sortBy=updatedAt]   Which field to use for sorting
 * @apiParam (Query) {Number} [limit=20]           How many items to fetch
 * @apiParam (Query) {Number} [skip]               How many items to skip
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "ok",
 *       "homes": [...]
 *     }
 *
 */
/**
 * @api {get} /api/homes/:uuid Get home by id
 * @apiVersion 1.0.0
 * @apiName GetHomeById
 * @apiGroup Homes
 * @apiDescription Fetch Single Home
 *
 * @apiParam {String} id Home's internal id
 *
 * @apiUse MobileRequestHeaders
 * @apiUse HomeSuccessResponse
 * @apiUse HomeSuccessResponseJSON
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "ok",
 *       "home": {...}
 *     }
 *
 * @apiError (404) NotFound   Home with given id was not found
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status": "failed",
 *       "error": "model not found"
 *     }
 */
/**
 * @api {put} /api/homes/:id Update home
 * @apiVersion 1.0.0
 * @apiName UpdateHome
 * @apiGroup Homes
 * @apiDescription Update home by uuid
 *
 * @apiUse MobileRequestHeaders
 * @apiUse HomeBody
 * @apiUse HomeSuccessResponse
 * @apiUse HomeSuccessResponseJSON
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "ok",
 *       "home": {...}
 *     }
 *
 */
/**
 * @api {post} /api/homes Create a home
 * @apiVersion 1.0.0
 * @apiName CreateHome
 * @apiGroup Homes
 *
 * @apiUse MobileRequestHeaders
 * @apiUse HomeBody
 * @apiUse HomeSuccessResponse
 * @apiUse HomeSuccessResponseJSON
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "ok",
 *       "home": {...}
 *     }
 */
/**
 * @api {delete} /api/homes/:id Delete home
 * @apiVersion 1.0.0
 * @apiName DeleteHome
 * @apiGroup Homes
 * @apiDescription Deletes the given home
 *
 * @apiParam {String} id Home's internal id
 *
 * @apiUse MobileRequestHeaders
 * @apiUse HomeSuccessResponse
 * @apiUse HomeSuccessResponseJSON
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "deleted",
 *       "home": {...}
 *     }
 */
/**
 * @apiDefine MobileRequestHeaders
 * @apiVersion 1.0.0
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
 * @apiVersion 1.0.0
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
 * @apiVersion 1.0.0
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
/**
 * @apiDefine NeighborhoodSuccessResponse
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} id                Uuid of the Neighborhood
 * @apiSuccess {String} title             Title of the Neighborhood
 * @apiSuccess {Datetime} createdAt       ISO-8601 Formatted Creation Datetime
 * @apiSuccess {Datetime} updatedAt       ISO-8601 Formatted Updation Datetime
 * @apiSuccess {Integer} createdAtTS      EPOCH formatted timestamp of the creation time
 * @apiSuccess {Integer} updatedAtTS      EPOCH formatted timestamp of the updation time
 *
 */
/**
 * @apiDefine NeighborhoodBody
 * @apiVersion 1.0.0
 *
 * @apiParam {Object} neighborhood           Neighborhood object
 * @apiParam {String} neighborhood.title     Title of the Neighborhood
 *
 */
/**
 * @api {get} /api/neighborhoods/:city Fetch All Neighborhood from city
 * @apiVersion 1.0.0
 * @apiName GetNeighborhoods
 * @apiGroup Neighborhoods
 *
 * @apiDescription Route for fetching Neighborhoods by city
 *
 * @apiUse MobileRequestHeaders
 * @apiUse NeighborhoodSuccessResponse
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "ok",
 *       "neighborhoods": [...]
 *     }
 *
 */
/**
 * @api {get} /api/neighborhoods/:city/:neighborhood Fetch City Neighborhood by slug
 * @apiVersion 1.0.0
 * @apiName GetNeighborhoodBySlug
 * @apiGroup Neighborhoods
 *
 * @apiDescription Route for fetching Neighborhood by city and slug
 *
 * @apiUse MobileRequestHeaders
 * @apiUse NeighborhoodSuccessResponse
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       'status': 'ok',
 *       'neighborhood': {...}
 *     }
 *
 */
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
/**
 * @apiDefine UserSuccessResponse
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object} user          User details
 * @apiSuccess {String} user.id        Internal Id of the user
 * @apiSuccess {String} user.email      User's email
 * @apiSuccess {String} user.displayName  User's fullname
 * @apiSuccess {String} user.firstname   User's firstname
 * @apiSuccess {String} user.lastname    User's lastname
 * @apiSuccess {Object} user.profileImage User's profile image as an <a href="#api-Shared-Images">Image</a> object
 * @apiSuccess {Object} user.contact                  User's contact information
 * @apiSuccess {Object} user.contact.address          Address information
 * @apiSuccess {String} user.contact.address.street   User's street address (only for the authenticated user)
 * @apiSuccess {String} user.contact.address.city     User's city
 * @apiSuccess {String} user.contact.address.zipcode  User's post office code
 * @apiSuccess {String} user.contact.address.country  User's country
 * @apiSuccess {String} user.contact.phone            User's phone number
 * @apiSuccess {Object} user.home                     User's <a href="#api-Homes-Home_details">Home</a>
 */
/**
 * @apiDefine UserSuccessResponseJSON
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} JSON serialization of the user
 *     "user": {
 *       "id": "...",
 *       "email": "...",
 *       "displayName": "...",
 *       "firstname": "...",
 *       "lastname": "...",
 *       "profileImage": {
 *         "url": "...",
 *         "alt": "...",
 *         "width": ...,
 *         "height": ...
 *       },
 *       "contact": {
 *         "address": {
 *           "street": "...",
 *           "city": "...",
 *           "zipcode": "...",
 *           "country": "..."
 *         },
 *         "phone": "..."
 *       },
 *       "home": {...}
 *     }
 */
/**
 * @apiDefine UserBody
 * @apiVersion 1.0.0
 *
 * @apiParam {String} [user.email]     User's email address
 * @apiParam {String} [user.firstname] User's firstname
 * @apiParam {String} [user.lastname]  User's lastname
 * @apiParam {Object} [user.profileImage] User's profile <a href="#api-Shared-Images">Image</a>
 * @apiParam {Object} [user.contact]   User's contact information
 * @apiParam {Object} [user.contact.address]          User's address information
 * @apiParam {String} [user.contact.address.street]   User's street address
 * @apiParam {String} [user.contact.address.city]   User's street address
 * @apiParam {String} [user.contact.address.zipcode]   User's street address
 * @apiParam {String} [user.contact.address.country]   User's street address
 * @apiParam {String} [user.contact.address]   User's street address
 */
/**
 * @api {any} /api/* User details
 * @apiVersion 1.0.0
 * @apiName UserData
 * @apiGroup Users
 *
 * @apiDescription User details for each response that has the user object contains the same set of data
 * @apiUse UserSuccessResponse
 * @apiUse UserSuccessResponseJSON
 */
/**
 * @api {put} /api/auth/user Update user details
 * @apiVersion 1.0.0
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiDescription Update user details
 *
 * @apiPermission authenticated
 * @apiUse MobileRequestHeadersAuthenticated
 * @apiUse UserSuccessResponse
 * @apiUse UserSuccessResponseJSON
 * @apiUse UserBody
 *
 * @apiError (400) BadRequest Invalid request body, missing parameters.
 * @apiError (403) Forbidden  User account has been disabled
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 403 Forbidden
 *    {
 *     "status": "failed",
 *     "error": "account disabled"
 *    }
 */
