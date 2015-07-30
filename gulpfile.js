"use strict";

var gulp = require("gulp");
var gutil = require("gulp-util");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var eslint = require("gulp-eslint");
var sass = require("gulp-sass");
var minifyhtml = require("gulp-minify-html");
var livereload = require("gulp-livereload");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var batch = require("gulp-batch");

var path = require("path");
var fs = require("fs");
var nodemon = require("nodemon");
var webpack = require("webpack");

var nodemonInstance = null;

var DEBUG = true;
if (process.env.NODE_ENV === "production") {
  DEBUG = false;
}

var extend = function extend(a, b) {
  a = require("util")._extend({}, a);
  return require("util")._extend(a, b);
};

/**
 * path globs / expressions for targets below
 */
var paths = {
  tests: "test/**/*.js",
  server: {
    main: "server/app.js",
    sources: ["**/*.js", "!node_modules/**", "!client/vendor/**", "!build/**", "!gulpfile.js"],
    views: ["views/**/*.html"],
    build: "./build/server"
  },
  clients: {
    site: {
      root: "./clients/site",
      entry: "./clients/site/client.js",
      sources: ["clients/site/**/*.js", "clients/common/**/*.js"],
      styles: ["assets/css/site/**/*.scss", "assets/css/vendor/**/*.scss", "assets/css/shared/**/*.scss", ],
      images: ["assets/images/**/*"],
      statics: "./build/statics/site",
      fonts: "assets/fonts/**/*"
    }
  },
  client: {
    main: "client/js/app.js",
    sources: "clients/**/*.js",
    styles: "assets/css/**/*.scss",
    assets: ["assets/**/*", "!**/*.js", "!**/*.scss"],
    build: "./build/clients",
    statics: "./build/statics"
  }
};

var webpackCommonConfig = {
  module: {
    loaders: [
      { test: /\.(js)$/, exclude: /node_modules|bower_components/, loader: "babel", query: {optional: ["runtime"], stage: 0} }
      // ,{ test: /\.(otf|eot|svg|ttf|woff)/, loader: "url-loader?limit=8192" }
      // ,{ test: /\.(js)$/, exclude: /node_modules/, loaders: ["eslint-loader"] }
    ]
  },
  devtool: "eval-source-map",
  watch: false,
  keepalive: false
};

var siteWebpackConfig = extend(webpackCommonConfig, {
  resolve: {
    root: paths.clients.site.root,
    extensions: ["", ".js"],
    modulesDirectories: ["node_modules", "bower_components"]
  },
  entry: {
    client: paths.clients.site.entry,
    vendor: ["react", "react-router", "superagent", "alt", "iso", "jquery"]
  },
  output: {
    path: paths.clients.site.statics + "/js",
    filename: "client.js"
  },
  plugins: [
    new webpack.DefinePlugin({
      "__DEBUG__": DEBUG,
      "NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
    }),
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ),
    new webpack.PrefetchPlugin("react"),
    new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
  ]
});
var siteCompiler = webpack(siteWebpackConfig);

gulp.task("lint", function () {
  return gulp.src(["server/**/*.js", "client/**/*.js"])
    .pipe(eslint())
    .pipe(eslint.format())
    //.pipe(eslint.failOnError());
});

gulp.task("build-server", ["lint"], function () {
  return gulp.src(["./server/**/*.js", "./config/**/*.js"], {base: "server"})
    .pipe(sourcemaps.init())
    .pipe(babel({
      optional: ["runtime"],
      stage: 0
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.server.build));
});

gulp.task("compile-site-styles", function(){
  return gulp.src(paths.clients.site.styles)
    .pipe(sass())
    .pipe(gulp.dest(path.join(paths.clients.site.statics, "css")));
});
gulp.task("copy-site-fonts", function(){
  return gulp.src(paths.clients.site.fonts)
    .pipe(gulp.dest(path.join(paths.clients.site.statics, "fonts")));
});
gulp.task("copy-site-images", function(){
  return gulp.src(paths.clients.site.images)
    .pipe(gulp.dest(path.join(paths.clients.site.statics, "images")));
});
gulp.task("webpack:build-site-client", function(callback) {
  // run webpack
  siteCompiler.run(function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build-site-client", err);
    gutil.log("[webpack:build-site-client]", stats.toString({
      colors: true
    }));
    callback();
  });
});
// gulp.task("uglify-site", function() {
//   return gulp.src(paths.clients.site.statics + "/js/*.js")
//     .pipe(concat("site.min.js"))
//     .pipe(uglify({
//       mangel: true,
//       compress: {},
//       preserveComments: ""
//     }))
//     .pipe(gulp.dest(paths.clients.site.statics + "/js"));
// });
gulp.task("compile-site", ["compile-site-styles", "copy-site-fonts", "copy-site-images", "webpack:build-site-client"]);

// gulp.task("compile-admin-styles", function(){
//   return gulp.src(paths.clients.admin.styles)
//     .pipe(sass())
//     .pipe(gulp.dest(path.join(paths.clients.admin.statics, "css")));
// });

gulp.task("copy-client-templates", function () {
  return gulp.src("./clients/**/*.html")
    .pipe(gulp.dest(path.join(paths.client.build)));
});

gulp.task("build-clients", ["copy-client-templates", "compile-site"], function(){
  return gulp.src(["./clients/**/*.js"], {})
    .pipe(sourcemaps.init())
    .pipe(babel({
      optional: ["runtime"],
      stage: 0
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.client.build));
});

gulp.task("watch", function(){
  livereload.listen({
    quiet: true
  });
  //gulp.watch(paths.server.views, ["copy-server-views"]);
  gulp.watch(paths.server.sources, ["lint"]); //"lint", , "restart-dev"

  gulp.watch(paths.clients.site.sources, ["build-clients"]);
  gulp.watch(paths.clients.site.styles, ["build-clients"]);

  gulp.watch("./server/**", batch(function(events, done) {
    //console.log("server changed", events);
    gulp.start("restart-dev", done);
  }));

  gulp.watch("./build/**", function(changed) {
    //console.log("build changed", changed);
    livereload.changed(changed);
  });
});

gulp.task("restart-dev", function() {
  if (nodemonInstance) {
    nodemonInstance.once("restart", function() {
      livereload.changed();
    });
    nodemonInstance.emit("restart");
  }
});

var watchStarted = false;
gulp.task("dev", ["lint", "build-server", "build-clients", "watch"], function() {
  nodemonInstance = nodemon({
    execMap: {
      js: "node"
    },
    script: path.join(__dirname, "init.js"),
    //watch: ["./build/server"],
    // ignore: ["gulpfile.js"],
    // ext: "js html"
    //script: path.join(paths.server.build, "app.js"),
    ignore: ["*"]
  }).on("restart", function() {
    console.log("Restarted!");
  });
});
