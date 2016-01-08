// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-10-26 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // base path, that will be used to resolve files and exclude
    basePath: '../www/',
    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'expect'],

    // list of files / patterns to load in the browser
    files: [
      'scripts/libs/angular/angular.js',
      'scripts/libs/angular-mocks/angular-mocks.js',
      'scripts/libs/sizzle/dist/sizzle.js',
      'scripts/libs/angular-sizzle-standalone/angular-sizzle.js',
      'scripts/libs/angular-animate/angular-animate.js',
      'scripts/libs/angular-resource/angular-resource.js',
      'scripts/libs/angular-aria/angular-aria.js',
      'scripts/libs/angular-touch/angular-touch.js',
      'scripts/libs/angular-ui-router/release/angular-ui-router.js',
      'scripts/libs/angular-translate/angular-translate.min.js',
      'scripts/libs/angular-sanitize/angular-sanitize.js',
      //scripts/'libs/ua-parser-js/dist/ua-parser.min.js',
      'scripts/libs/createjs-soundjs/lib/soundjs-NEXT.combined.js',
      'scripts/libs/angular-material/angular-material.min.js',
      'scripts/libs/lt-fmk-client/soudjs-cordova-plugin-0.6.0.js',
      'scripts/libs/lt-fmk-client/app.js',
      'scripts/libs/lt-fmk-client/test/mock/*.js',
      'scripts/libs/lt-fmk-client/constant/default-config.js',
      'scripts/libs/lt-fmk-client/service/exception.handler.js',
      'scripts/libs/lt-fmk-client/service/config.handler.js',
      'scripts/libs/lt-fmk-client/service/log.handler.js',
      'scripts/libs/lt-fmk-client/service/route.handler.js',
      'scripts/libs/lt-fmk-client/service/session.handler.js',
      'scripts/libs/lt-fmk-client/service/service.handler.js',
      'scripts/libs/lt-fmk-client/service/social.handler.js',
      'scripts/libs/lt-fmk-client/service/purchase.handler.js',
      'scripts/libs/lt-fmk-client/service/phonegap.handler.js',
      'scripts/libs/lt-fmk-client/service/analytics.handler.js',
      'scripts/libs/lt-fmk-client/service/settings.handler.js',
      'scripts/libs/lt-fmk-client/service/tutorial.handler.js',
      'scripts/libs/lt-fmk-client/service/sound.handler.js',
      'scripts/libs/lt-fmk-client/service/help.handler.js',
      'scripts/libs/lt-fmk-client/service/responsive.handler.js',
      'scripts/libs/lt-fmk-client/service/asset.handler.js',
      'scripts/libs/lt-fmk-client/service/trophy.handler.js',
      'scripts/libs/lt-fmk-client/service/ad.handler.js',
      'scripts/libs/lt-fmk-client/service/translation.handler.js',
      'scripts/libs/lt-fmk-client/service/fmk.js',
      'scripts/libs/lt-fmk-client/controller/lt.controller.js',
      'scripts/libs/lt-fmk-client/kernel.js',
      'scripts/libs/lt-fmk-client/test/**/ad.handler.js',
      'scripts/libs/iscroll/build/iscroll.js',
      'scripts/libs/angular-iscroll/dist/lib/angular-iscroll.js',
      'scripts/app.js',
      'scripts/constant/app.config.js',
      'scripts/translate/**/*.js',
      'scripts/controllers/**/*.js',
      'scripts/services/**/*.js',
      'scripts/filters/**/*.js',
      'views/**/*.html',
      '../test/**/*.js',
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 9995,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-expect'
    ],
    browserNoActivityTimeout: 100000,
    captureTimeout: 100000,
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,
    /*proxies :  {
      '/views/': '/src/www/views/'
    },*/
    // Uncomment the following lines if you are using grunt's server to run the tests
     proxies: {
       '/': 'http://localhost:9000/'
     },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
