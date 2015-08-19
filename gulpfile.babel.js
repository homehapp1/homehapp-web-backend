'use strict';

import fs from 'fs';
import path from 'path';

import gulp from 'gulp';
import gutil from 'gulp-util';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import livereload from 'gulp-livereload';
import nodemon from 'nodemon';
import webpack from 'webpack';
import minifyCss from 'gulp-minify-css';

import ProjectUploader from './support/cloudinaryUpload';

const g = gulpLoadPlugins();

let nodemonInstance = null;

let DEBUG = true;
if (process.env.NODE_ENV === 'production') {
  DEBUG = false;
}

let PROJECT_NAME = 'site';
if (process.env.PROJECT_NAME && process.env.PROJECT_NAME !== 'undefined') {
  PROJECT_NAME = process.env.PROJECT_NAME;
}

let extend = function extend(a, b) {
  a = require('util')._extend({}, a);
  return require('util')._extend(a, b);
};

const babelOptions = {
  optional: ['runtime', 'es7.classProperties', 'es7.classProperties'],
  stage: 0
};

/**
 * path globs / expressions for targets below
 */
const paths = {
  tests: 'test/**/*.js',
  server: {
    main: 'server/app.js',
    sources: ['**/*.js', '!node_modules/**', '!client/vendor/**', '!build/**', '!gulpfile.babel.js'],
    views: ['views/**/*.html'],
    viewsBase: 'views/',
    build: './build/server'
  },
  clients: {
    site: {
      root: './clients/site',
      entry: './clients/site/client.js',
      sources: ['clients/site/**/*.js', 'clients/common/**/*.js'],
      styles: [
        'assets/css/site/**/*.scss', 'assets/css/vendor/site/**/*.scss',
        'assets/css/shared/**/*.scss'
      ],
      images: ['assets/images/**/*'],
      fonts: 'assets/fonts/**/*',
      statics: './build/statics/site',
      distBase: './dist/site'
    },
    admin: {
      root: './clients/admin',
      entry: './clients/admin/client.js',
      sources: ['clients/admin/**/*.js', 'clients/common/**/*.js'],
      styles: [
        'assets/css/admin/**/*.scss', 'assets/css/vendor/admin/**/*.scss',
        'assets/css/shared/**/*.scss'
      ],
      images: ['assets/images/**/*'],
      fonts: 'assets/fonts/**/*',
      statics: './build/statics/admin',
      distBase: './dist/admin'
    },
    build: './build/clients'
  }
};

let webpackCommonConfig = {
  module: {
    loaders: [
      { test: /\.(js)$/, exclude: /node_modules|bower_components/, loader: 'babel', query: babelOptions }
      // ,{ test: /\.(otf|eot|svg|ttf|woff)/, loader: 'url-loader?limit=8192' }
      // ,{ test: /\.(js)$/, exclude: /node_modules/, loaders: ['eslint-loader'] }
    ]
  },
  watch: false,
  keepalive: false
};
if (DEBUG) {
  webpackCommonConfig.devtool = 'eval-source-map';
}

let getWebpackPlugins = (project_name) => {
  let plugins = [
    new webpack.DefinePlugin({
      'process': {
        env: {
          'DEBUG': DEBUG,
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }
      }
    }),
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
    ),
    new webpack.PrefetchPlugin('react'),
    new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment'),
    new webpack.optimize.CommonsChunkPlugin('vendor', DEBUG ? 'vendor.bundle.js' : 'vendor.bundle.min.js')
  ];

  if (!DEBUG) {
    plugins = plugins.concat([
      new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]);
  }

  return plugins;
};

const siteWebpackConfig = extend(webpackCommonConfig, {
  resolve: {
    root: paths.clients.site.root,
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'bower_components']
  },
  entry: {
    client: paths.clients.site.entry,
    vendor: [
      'react', 'react-router', 'superagent', 'alt', 'iso', 'jquery'
    ]
  },
  output: {
    path: paths.clients.site.statics + '/js',
    filename: DEBUG ? 'client.js' : 'client.min.js'
  },
  plugins: getWebpackPlugins('site')
});
const siteCompiler = webpack(siteWebpackConfig);

const adminWebpackConfig = extend(webpackCommonConfig, {
  resolve: {
    root: paths.clients.admin.root,
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'bower_components']
  },
  entry: {
    client: paths.clients.admin.entry,
    vendor: ['react', 'react-router', 'superagent', 'alt', 'iso', 'react-bootstrap']
  },
  output: {
    path: paths.clients.admin.statics + '/js',
    filename: DEBUG ? 'client.js' : 'client.min.js'
  },
  plugins: getWebpackPlugins('admin')
});
const adminCompiler = webpack(adminWebpackConfig);

gulp.task('lint', () => {
  return gulp.src(['server/**/*.js', 'clients/**/*.js'])
    .pipe(g.eslint())
    .pipe(g.eslint.format())
    //.pipe(eslint.failOnError());
});

gulp.task('copy-server-views', () => {
  var viewsPath = path.join(paths.server.viewsBase, PROJECT_NAME, '**');
  return gulp.src(viewsPath)
    .pipe(gulp.dest(path.join(paths.server.build, 'views')))
    .pipe(g.size({title: 'Server views'}));
});

gulp.task('build-server', ['lint', 'copy-server-views'], function () {
  return gulp.src(['./server/**/*.js', './config/**/*.js'], {base: 'server'})
    .pipe(g.sourcemaps.init())
    .pipe(g.babel(babelOptions))
    .pipe(g.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.server.build))
    .pipe(g.size({title: 'Server source'}));
});

gulp.task('compile-client-styles', () => {
  return gulp.src(paths.clients[PROJECT_NAME].styles)
    .pipe(g.sourcemaps.init())
    .pipe(g.sass())
    .pipe(g.sourcemaps.write())
    .pipe(gulp.dest(path.join(paths.clients[PROJECT_NAME].statics, 'css')))
    .pipe(g.size({title: 'Client styles'}));
});
gulp.task('minify-client-styles', () => {
  return gulp.src(path.join(paths.clients[PROJECT_NAME].statics, 'css', '*.css'))
    .pipe(g.concat('all.css'))
    .pipe(minifyCss({
      advanced: false
    }))
    .pipe(g.rename('all.min.css'))
    .pipe(gulp.dest(path.join(paths.clients[PROJECT_NAME].distBase, 'css')))
    .pipe(g.size({title: 'Minified Client styles'}));
});
gulp.task('copy-client-fonts', () => {
  if (!DEBUG) {
    return gulp.src(path.join(paths.clients[PROJECT_NAME].statics, 'fonts', '**/*'))
      .pipe(gulp.dest(path.join(paths.clients[PROJECT_NAME].distBase, 'fonts')));
  }

  return gulp.src(paths.clients[PROJECT_NAME].fonts)
    .pipe(gulp.dest(path.join(paths.clients[PROJECT_NAME].statics, 'fonts')))
    .pipe(g.size({title: 'Client fonts'}));
});
gulp.task('copy-client-images', () => {
  if (!DEBUG) {
    return gulp.src(path.join(paths.clients[PROJECT_NAME].statics, 'images', '**/*'))
      .pipe(gulp.dest(path.join(paths.clients[PROJECT_NAME].distBase, 'images')));
  }

  return gulp.src(paths.clients[PROJECT_NAME].images)
    .pipe(gulp.dest(path.join(paths.clients[PROJECT_NAME].statics, 'images')))
    .pipe(g.size({title: 'Client images'}));
});
gulp.task('copy-client-min-js', () => {
  return gulp.src(path.join(paths.clients[PROJECT_NAME].statics, 'js', '*.min.js'))
    .pipe(gulp.dest(path.join(paths.clients[PROJECT_NAME].distBase, 'js')));
});

gulp.task('webpack:build-site-client', function(callback) {
  // run webpack
  siteCompiler.run(function(err, stats) {
    if(err) throw new gutil.PluginError('webpack:build-site-client', err);
    gutil.log('[webpack:build-site-client]', stats.toString({
      colors: true
    }));
    callback();
  });
});
gulp.task('webpack:build-admin-client', (callback) => {
  // run webpack
  adminCompiler.run((err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack:build-admin-client', err);
    }
    gutil.log('[webpack:build-admin-client]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('compile-site', ['compile-client-styles', 'copy-client-fonts', 'copy-client-images', 'webpack:build-site-client']);

gulp.task('compile-admin', ['compile-client-styles', 'copy-client-fonts', 'copy-client-images', 'webpack:build-admin-client']);

gulp.task('copy-client-templates', () => {
  return gulp.src('./clients/**/*.html')
    .pipe(gulp.dest(path.join(paths.clients.build)))
    .pipe(g.size({title: 'Client templates'}));
});

var clientBuildDependencies = ['copy-client-templates'];
clientBuildDependencies.push('compile-' + PROJECT_NAME);

gulp.task('build-clients', clientBuildDependencies, () => {
  return gulp.src(['./clients/**/*.js'], {})
    .pipe(g.sourcemaps.init())
    .pipe(g.babel(babelOptions).on('error', gutil.log))
    .pipe(g.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.clients.build))
    .pipe(g.size({title: 'Clients'}));
});

gulp.task('minify-clients', ['minify-client-styles', 'copy-client-fonts', 'copy-client-images', 'copy-client-min-js'], () => {
});

gulp.task('clean-dist', cb => del(['dist/*', '!dist/.git'], {dot: true}, cb));

gulp.task('dist-clients', ['minify-clients'], (callback) => {
  let uploader = new ProjectUploader();
  uploader.upload(paths.clients[PROJECT_NAME].distBase, (err, status) => {
    if (err) {
      throw new gutil.PluginError('dist-client:ProjectUploader', err);
    }
    callback();
  });
});

gulp.task('watch', function(){
  livereload.listen({
    quiet: true
  });

  gulp.watch(paths.server.views, ['copy-server-views']);
  gulp.watch(paths.server.sources, ['lint']).on('error', function(err) {
    new gutil.PluginError('Watch', err, {showStack: true});
    this.emit('end');
  });

  gulp.watch(paths.clients[PROJECT_NAME].sources, ['build-clients', 'restart-dev']).on('error', gutil.log);
  gulp.watch(paths.clients[PROJECT_NAME].styles, ['build-clients']).on('error', gutil.log);

  gulp.watch('./server/**', g.batch(function(events, done) {
    //console.log('server changed', events);
    gulp.start('restart-dev', done);
  })).on('error', gutil.log);

  gulp.watch('./build/**', function(changed) {
    livereload.changed(changed);
  }).on('error', gutil.log);
});

gulp.task('restart-dev', () => {
  if (nodemonInstance) {
    nodemonInstance.once('restart', () => {
      livereload.changed();
    });
    nodemonInstance.emit('restart');
  }
});

gulp.task('dev', ['lint', 'build-server', 'build-clients', 'watch'], () => {
  nodemonInstance = nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, 'init.js'),
    env: {PROJECT_NAME: process.env.PROJECT_NAME || 'site'},
    //watch: ['./build/server'],
    // ignore: ['gulpfile.js'],
    // ext: 'js html'
    //script: path.join(paths.server.build, 'app.js'),
    ignore: ['*']
  }).on('restart', function() {
    console.log('Restarted!');
  }).on('error', gutil.log);
});
