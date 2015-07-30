"use strict";

//import QueryBuilder from "../../lib/QueryBuilder";

exports.registerRoutes = (app) => {
  //const QB = new QueryBuilder(app);

  app.get("/api/home/:slug", function(req, res) {
    console.log("fetch home with slug", req.params.slug);
    console.log("req.query", req.query);
    res.json({
      status: "ok", home: {id: "123", slug: req.params.slug, title: `House ${req.params.slug}`}
    });

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
