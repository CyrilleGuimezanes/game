// Generated on 2014-10-26 using generator-angular 0.9.8
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  // Configurable paths for the application
  var appConfig = {
    src: 'src',
    dist: 'dist/src/',
    jellybean: 'dist/jellybean/',
    zip: 'dist/bin',
    fmk: 'src/www/scripts/libs/lt-fmk-client',
    pkg: grunt.file.readJSON("package.json")
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: appConfig,


    jsdoc : {
        dist : {
            src: ['<%= config.fmk %>/{service,controller,filter,directive}/*.js'],
            options: {
                destination: 'docs/jsdoc'
            }
        }
    },

    ngdocs: {
      all: ['<%= config.fmk %>/{service,controller,filter,directive}/*.js', '<%= config.src %>/www/scripts/{service,controller,filter,directive}/*.js'],
      options: {
        dest: 'docs/ngdoc',
        scripts: [
                    '<%= config.src %>/www/scripts/libs/angular/angular.js',
                    '<%= config.src %>/www/scripts/libs/angular-animate/angular-animate.js'
                 ],//load dependency for exemples
        html5Mode: true,
        startPage: '/api',
        title: 'Documentation for <%= config.pkg.name %>',
        image: '<%= config.src %>/www/images/ltlogo.png',
        imageLink: 'http://luditeam.com',
        titleLink: '/api',
        bestMatch: true
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9993,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.src)
            ];
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '<%= config.fmk %>/.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= config.fmk %>/**/*.js',
          '<%= config.src %>/www/scripts/**/*.js'
        ]
      },
      test: {
        options: {
          jshintrc: '<%= config.fmk %>/.jshintrc'
        },
        src: ['<%= config.fmk %>/test/**/*.js']//, '<%= config.src %>/www/test/**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/{,*/}*',
            '<%= config.jellybean %>/{,*/}*',
            '<%= config.zip %>/{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version'],
        diff: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.dist %>/www/styles/',
          src: '{,*/}*.css',
          dest: '<%= config.dist %>/www/styles/'
        }]
      }
    },


    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= config.dist %>/www/scripts/{,*/}*.js',
          '<%= config.dist %>/www/styles/{,*/}*.css'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= config.src %>/www/index.html',
      options: {
        dest: '<%= config.dist %>/www',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= config.dist %>/www/{,*/}*.html'],
      css: ['<%= config.dist %>/www/styles/{,*/}*.css'],
      options: {
        //TODO check this?!?
        assetsDirs: ['<%= config.dist %>/www','<%= config.dist %>/www/images']
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/<%= config.src %>/www/styles/app.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/scripts/app.js': [
    //         '<%= config.dist %>/scripts/app*.js'
    //       ]
    //     }
    //   }
    // },
    concat: {
      dist: {}
    },

    imagemin: {
      dist: {
        options: {                       // Target options
          optimizationLevel: 4
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>/www/images',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= config.dist %>/www/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.src %>/www/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/www/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: ['www/*.html', 'www/views/{,*/}*.html'],
          dest: '<%= config.dist %>'
        }]
      }
    },
    //TODO Check this!
    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    //TODO do not use flatten & dot!!!
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          //copie de tout les fichiers de l'application
          {
              expand: true,
              cwd: '<%= config.src %>/',
              dest: '<%= config.dist %>/',
              src: [
                '.cordova/*',
                'hooks/*',
                'www/images/**/*.{png,jpg,ico}',
                'www/sounds/**/*.{mp3,mp4,ogg}',
                'www/fonts/**/*.{woff,svg,ttf}',
                'www/.htaccess',
                'www/index.html',
                'www/robots.txt',
                'www/favicon.ico',
                'www/views/*.html',
                'config.xml'
              ]
          },
          //copie des fonts boostrap
           {
            expand: true,
            cwd: '<%= config.fmk %>/deps/bootstrap/dist',
            src: 'fonts/*',
            dest: '<%= config.dist %>/www/'
          }
        ]
      },
      styles: {
        expand: true,
        cwd: '<%= config.src %>/www/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },

      //for multiple APK and crosswalk
      jellybean: {
        expand: true,
        cwd: '<%= config.dist %>',
        dest: '<%= config.jellybean %>',
        src: [
              '**/*',
              '!www/images/icon/*',//on ne copie pas les images pour IOS
              '!www/images/splash/screen-225.png',
              '!www/images/splash/screen-ipad-landscape.png',
              '!www/images/splash/screen-ipad-portrait.png',
              '!www/images/splash/screen-iphone-portrait.png',
              '!www/images/splash/screen-iphone-portrait-2x.png',
              '!www/images/splash/screen-iphone-portrait-568h-2x.png',
              '!www/images/splash/screen-portrait.jpg'
             ]
      },
      jellybeanConfig: {
        expand: true,
        cwd: '<%= config.src %>/',
        dest: '<%= config.jellybean %>/',
        src: 'configJellyBean.xml'
      }
    },
    rename: {
      jellybean: {
        files: [{
          src: '<%= config.jellybean %>configJellyBean.xml',
          dest: '<%= config.jellybean %>config.xml',
        }]
      }
    },


    // Test settings
    karma: {
      unit: {
        configFile: './src/test/karma.conf.js',
        singleRun: true
      }
    },
    compress: {
      dist: {
        options: {
          archive: '<%= config.zip %>/build.zip'
        },
        files: [
          {src : "**/*", cwd : "<%= config.dist %>", expand: true}, // includes files in path and its subdirs
        ]
      },
      jellybean: {
        options: {
          archive: '<%= config.zip %>/build-jellybean.zip'
        },
        files: [
          {src : "**/*", cwd : "<%= config.jellybean %>", expand: true}, //for multiple APK and crosswalk
        ]
      }
    },
    xmlpoke: {
      version: {
        options: {
          namespaces: {'gap': "http://phonegap.com/ns/1.0"},
          replacements: [{
              xpath: '/widget/@versionCode',
              value: function(node){
                return (parseInt(node.value) + 1) + "";
              },
              //failIfMissing: true
            },
            {
              xpath: '/widget/gap:config-file/string',
              value: function(node){
                return (parseInt(node.childNodes[0].data) + 1) + "";
              },
              //failIfMissing: true
            }
          ]
        },
        files: {
          '<%= config.src %>/config.xml': '<%= config.src %>/config.xml',
          '<%= config.src %>/configJellyBean.xml': '<%= config.src %>/configJellyBean.xml',
        },
      },
    },
  });

  //keep, good to know (do function as grunt task)
  /*grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });*/


  grunt.registerTask('test', [
    'clean:server',
    'copy:styles',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('doc', [
    'ngdocs',
    //'jsdoc'
  ]);

  grunt.registerTask('release', [
    'xmlpoke:version',//augmente les versions de Android et IOS (pas la version du jeu)
  ]);

  grunt.registerTask('build', [

    'clean:dist',
    'useminPrepare',
    'copy:styles',
    //'ngdocs',
    //'jsdoc',
    'concat',
    'ngAnnotate',
    'copy:dist',
    //'imagemin:dist',
    'autoprefixer',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin',

    'copy:jellybean',//for multiple APK and crosswalk
    'copy:jellybeanConfig',//for multiple APK and crosswalk
    'rename:jellybean',//for multiple APK and crosswalk
    'compress:dist',
    'compress:jellybean'//for multiple APK and crosswalk

  ]);

  grunt.registerTask('default', [
    //'newer:jshint',
    //'test',
    'build'
  ]);
};
