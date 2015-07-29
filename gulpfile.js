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

var webpackCommonConfig = {
  module: {
    loaders: [
      { test: /\.(js)$/, exclude: /node_modules|bower_components/, loader: "babel", query: {optional: ["runtime"], stage: 0} }
      //,{ test: /\.(js)$/, exclude: /node_modules|bower_components|.spec.js/, loader: "uglify" }
      // ,{ test: /\.(otf|eot|svg|ttf|woff)/, loader: "url-loader?limit=8192" }
      // ,{ test: /\.(js)$/, exclude: /node_modules/, loaders: ["eslint-loader"] }
    ]
  },
  // stats: {
  //     colors: true
  // },
  devtool: "eval-source-map",
  watch: false,
  keepalive: false
};

var siteWebpackConfig = extend(webpackCommonConfig, {
  resolve: {
    root: "./clients/site",
    extensions: ["", ".js"],
    modulesDirectories: ["node_modules", "bower_components"]
  },
  entry: {
    client: "./clients/site/client.js",
    vendor: ["react", "react-router", "superagent", "alt", "iso", "jquery"]
  },
  output: {
    path: "./build/statics/site/js",
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

/**
 * path globs / expressions for targets below
 */
var paths = {
  tests: 'test/**/*.js',
  server: {
    main: 'server/app.js',
    sources: ['**/*.js', '!node_modules/**', '!client/vendor/**', '!build/**'],
    views: ["views/**/*.html"],
    build: './build/server'
  },
  clients: {
    site: {
      sources: ["clients/site/**/*.js", "clients/common/**/*.js"],
      styles: ["assets/css/site/*.scss", "assets/css/vendor/*.scss"],
      images: ["assets/images/**/*"],
      statics: "./build/statics/site",
      fonts: "assets/fonts/**/*"
    }
  },
  client: {
    main: 'client/js/app.js',
    sources: 'clients/**/*.js',
    styles: 'assets/css/**/*.scss',
    assets: ['assets/**/*', '!**/*.js', '!**/*.scss'],
    build: './build/clients',
    statics: './build/statics'
  }
};

gulp.task("lint", function () {
  return gulp.src(["server/**/*.js", "client/**/*.js"])
    .pipe(eslint())
    .pipe(eslint.format())
    //.pipe(eslint.failOnError());
});

// gulp.task("copy-server-images", function () {
//   return gulp.src("./public/images/**/*")
//     .pipe(gulp.dest(path.join(paths.server.build, "public/images")));
// });

// gulp.task("copy-server-views", function () {
//   return gulp.src("./views/**/*")
//     //.pipe(minifyhtml())
//     .pipe(gulp.dest(path.join(paths.server.build, "views")));
// });

//["copy-server-images", "copy-server-views"]
gulp.task("build-server", function () {
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
//     .pipe(concat('site.min.js'))
//     .pipe(uglify({
//       mangel: true,
//       compress: {},
//       preserveComments: ""
//     }))
//     .pipe(gulp.dest(paths.clients.site.statics + "/js"));
// });
gulp.task("compile-site", ["compile-site-styles", "copy-site-fonts", "copy-site-images", "webpack:build-site-client"]);

// gulp.task('compile-admin-styles', function(){
//   return gulp.src(paths.clients.admin.styles)
//     .pipe(sass())
//     .pipe(gulp.dest(path.join(paths.clients.admin.statics, "css")));
// });

gulp.task("copy-client-templates", function () {
  return gulp.src("./clients/**/*.html")
    .pipe(gulp.dest(path.join(paths.client.build)));
});

gulp.task('build-clients', ["copy-client-templates", "compile-site"], function(){
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
  gulp.watch(paths.server.sources, ["lint"]); //, "build-server"

  gulp.watch(paths.clients.site.sources, ["compile-site", "webpack:build-site-client"]);
  gulp.watch(paths.clients.site.styles, ["compile-site-styles"]);

  gulp.watch('./build/**').on('change', function() {
    livereload.changed.apply(null, arguments);
    // if (nodemonInstance) {
    //   nodemonInstance.emit("restart");
    // }
  });
});

gulp.task("dev", ["lint", "build-server", "build-clients", "watch"], function() {
  nodemonInstance = nodemon({
    execMap: {
      js: "node"
    },
    //script: path.join(__dirname, 'init.js'),
    // ignore: ['gulpfile.js'],
    // ext: 'js html'
    script: path.join(paths.server.build, "app.js"),
    ignore: ['*']
  }).on('restart', function() {
    console.log('Restarted!');
  });
});
