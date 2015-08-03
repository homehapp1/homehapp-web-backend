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
      styles: ['assets/css/site/**/*.scss', 'assets/css/vendor/site/**/*.scss', 'assets/css/shared/**/*.scss', ],
      images: ['assets/images/**/*'],
      statics: './build/statics/site',
      fonts: 'assets/fonts/**/*'
    },
    admin: {
      root: './clients/admin',
      entry: './clients/admin/client.js',
      sources: ['clients/admin/**/*.js', 'clients/common/**/*.js'],
      styles: ['assets/css/admin/**/*.scss', 'assets/css/vendor/admin/**/*.scss', 'assets/css/shared/**/*.scss', ],
      images: ['assets/images/**/*'],
      statics: './build/statics/admin',
      fonts: 'assets/fonts/**/*'
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
  devtool: 'eval-source-map',
  watch: false,
  keepalive: false
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
    filename: 'client.js'
  },
  plugins: [
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
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
  ]
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
    filename: 'client.js'
  },
  plugins: [
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
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
  ]
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

gulp.task('compile-site-styles', () => {
  return gulp.src(paths.clients.site.styles)
    .pipe(g.sourcemaps.init())
    .pipe(g.sass())
    .pipe(g.sourcemaps.write())
    .pipe(gulp.dest(path.join(paths.clients.site.statics, 'css')))
    .pipe(g.size({title: 'Site styles'}));
});
gulp.task('copy-site-fonts', () => {
  return gulp.src(paths.clients.site.fonts)
    .pipe(gulp.dest(path.join(paths.clients.site.statics, 'fonts')))
    .pipe(g.size({title: 'Site fonts'}));
});
gulp.task('copy-site-images', () => {
  return gulp.src(paths.clients.site.images)
    .pipe(gulp.dest(path.join(paths.clients.site.statics, 'images')))
    .pipe(g.size({title: 'Site images'}));
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
// gulp.task('uglify-site', function() {
//   return gulp.src(paths.clients.site.statics + '/js/*.js')
//     .pipe(concat('site.min.js'))
//     .pipe(uglify({
//       mangel: true,
//       compress: {},
//       preserveComments: ''
//     }))
//     .pipe(gulp.dest(paths.clients.site.statics + '/js'));
// });
gulp.task('compile-site', ['compile-site-styles', 'copy-site-fonts', 'copy-site-images', 'webpack:build-site-client']);

gulp.task('compile-admin-styles', () => {
  return gulp.src(paths.clients.admin.styles)
    .pipe(g.sass())
    .pipe(gulp.dest(path.join(paths.clients.admin.statics, 'css')))
    .pipe(g.size({title: 'Admin styles'}));
});
gulp.task('copy-admin-fonts', () => {
  return gulp.src(paths.clients.admin.fonts)
    .pipe(gulp.dest(path.join(paths.clients.admin.statics, 'fonts')))
    .pipe(g.size({title: 'Admin fonts'}));
});
gulp.task('copy-admin-images', () => {
  return gulp.src(paths.clients.admin.images)
    .pipe(gulp.dest(path.join(paths.clients.admin.statics, 'images')))
    .pipe(g.size({title: 'Admin images'}));
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
gulp.task('compile-admin', ['compile-admin-styles', 'copy-admin-fonts', 'copy-admin-images', 'webpack:build-admin-client']);

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

gulp.task('watch', function(){
  livereload.listen({
    quiet: true
  });

  gulp.watch(paths.server.views, ['copy-server-views']);
  gulp.watch(paths.server.sources, ['lint']).on('error', function(err) {
    new gutil.PluginError('Watch', err, {showStack: true});
    this.emit('end');
  });

  gulp.watch(paths.clients[PROJECT_NAME].sources, ['build-clients']).on('error', gutil.log);
  gulp.watch(paths.clients[PROJECT_NAME].styles, ['build-clients']).on('error', gutil.log);

  gulp.watch('./server/**', g.batch(function(events, done) {
    //console.log('server changed', events);
    gulp.start('restart-dev', done);
  })).on('error', gutil.log);

  gulp.watch('./build/**', function(changed) {
    //console.log('build changed', changed);
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
