"use strict";

import QueryBuilder from "../lib/QueryBuilder";

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  app.get("/home/:slug", function(req, res, next) {
    console.log("show home with slug", req.params.slug);
    console.log("req.query", req.query);
    res.locals.data.HomeStore = {
      home: {id: "123", slug: req.params.slug, title: `House ${req.params.slug}`}
    };
    next();

    // QB
    // .query("User")
    // .findByIdOrUsername(req.params.idOrUsername)
    // .fetch()
    // .then((result) => {
    //   res.json({
    //     status: "ok", user: result.user
    //   });
    // })
    // .catch(next);

  });

};
