module.exports = {
  ng_appname: 'mosaink',

  build_dir: 'parse-code-dev/public',
  compile_dir: 'parse-code-prod/public',
  config_dir: './config/',

  config_files: {
    json: ['config/*.json']
  },
  app_files: {
    js: ['src/app/**/*.js'],

    atpl: [
      'src/app/**/*.html',
      'bower_components/angular-ui-bootstrap/**/*.html'
    ],

    less: 'src/less/themes/default/master.less'
  },

  test_files: {
    js: [
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/jquery-resize/jquery.ba-resize.min.js',
      'bower_components/showdown/compressed/showdown.js',
      'bower_components/respond/dest/respond.min.js',
      'bower_components/momentjs/moment.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-sanitize/angular-sanitize.js',

      'ui-bootstrap-modal/ui-bootstrap-custom-0.14.2.js',
      'ui-bootstrap-modal/ui-bootstrap-custom-tpls-0.14.2.js',

      'build/src/app/**/*.js',

      'bower_components/angular-mocks/angular-mocks.js',

      'src/test/data/**/*.js',
      'src/test/mocks/**/*.js',
      'src/test/unit/**/*.js',
      'src/test/integration/**/*.js'
    ]
  },

  vendor_files: {
    js: [
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-strap/dist/angular-strap.js',
      'bower_components/angular-strap/dist/angular-strap.tpl.js',
      'bower_components/angulartics/dist/angulartics.min.js',
      'bower_components/angulartics-mixpanel/dist/angulartics-mixpanel.min.js',
      'bower_components/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/jquery-resize/jquery.ba-resize.min.js',
      'bower_components/jquery-waypoints/waypoints.min.js',
      'bower_components/jquery.easing/js/jquery.easing.min.js',
      'bower_components/modernizr/modernizr.js',
      'bower_components/respond/dest/respond.min.js',
      'bower_components/underscore/underscore.js',
      'bower_components/html2canvas/build/html2canvas.js',
      'node_modules/dist/parse-latest.js',
      'ui-bootstrap-modal/ui-bootstrap-custom-0.14.2.js',
      'ui-bootstrap-modal/ui-bootstrap-custom-tpls-0.14.2.js'
    ],
    css: [
      // 'src/app/supersized-fsto/*.css',
      'bower_components/angular-motion/dist/modules/fade.min.css'
    ],
    assets: [

    ]
  }
};
