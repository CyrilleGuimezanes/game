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
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-phonegap-build');
  // Configurable paths for the application
  var appConfig = {
    src: 'src',
    app: 'src/www',
    dist: 'dist',
    zip: 'dist/bin',
    fmk: 'src/www/scripts/libs/lt-fmk-client',
    pkg: grunt.file.readJSON("package.json")
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['<%= yeoman.fmk %>/bower.json', '<%= yeoman.app %>/bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.fmk %>/**/*.js', '<%= yeoman.app %>/**/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['<%= yeoman.fmk %>/test/spec/**/*.js', '<%= yeoman.app %>/test/spec/**/*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/views/**/*.html',
          '.tmp/styles/**/*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    jsdoc : {
        dist : {
            src: ['<%= yeoman.fmk %>/{service,controller,filter,directive}/*.js'],
            options: {
                destination: 'docs/jsdoc'
            }
        }
    },

    ngdocs: {
      all: ['<%= yeoman.fmk %>/{service,controller,filter,directive}/*.js', '<%= yeoman.app %>/scripts/{service,controller,filter,directive}/*.js'],
      options: {
        dest: 'docs/ngdoc',
        scripts: [
                    '<%= yeoman.app %>/scripts/libs/angular/angular.js',
                    '<%= yeoman.app %>/scripts/libs/angular-animate/angular-animate.js'
                 ],//load dependency for exemples
        html5Mode: true,
        startPage: '/api',
        title: 'Documentation for <%= yeoman.pkg.name %>',
        image: '<%= yeoman.app %>/images/ltlogo.png',
        imageLink: 'http://luditeam.com',
        titleLink: '/api',
        bestMatch: true,
        /*analytics: {
              account: 'UA-08150815-0',
              domainName: 'my-domain.com'
        },*/
        /*discussions: { ==> incldue of disqus
              shortName: 'my',
              url: 'http://my-domain.com',
              dev: false
        }*/
      },
      /*tutorial: {
        src: ['content/tutorial/*.ngdoc'],
        title: 'Tutorial'
      },
      api: {
        src: ['<%= yeoman.fmk %>/app.js','<%= yeoman.fmk %>/kernel.js', '<%= yeoman.fmk %>/service/config.handler.js'],
        title: 'API Documentation'
      }*/
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
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '<%= yeoman.fmk %>/.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.fmk %>/**/*.js',
          '<%= yeoman.app %>/scripts/**/*.js'
        ]
      },
      test: {
        options: {
          jshintrc: '<%= yeoman.fmk %>/.jshintrc'
        },
        src: ['<%= yeoman.fmk %>/test/**/*.js']//, '<%= yeoman.app %>/test/**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '<%= yeoman.zip %>/{,*/}*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/<%= yeoman.app %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/<%= yeoman.app %>/styles/{,*/}*.css',
          //'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          //'<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>/<%= yeoman.app %>',
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
      html: ['<%= yeoman.dist %>/<%= yeoman.app %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/<%= yeoman.app %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>/<%= yeoman.app %>','<%= yeoman.dist %>/<%= yeoman.app %>/images']
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/<%= yeoman.app %>/styles/app.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/app.js': [
    //         '<%= yeoman.dist %>/scripts/app*.js'
    //       ]
    //     }
    //   }
    // },
    concat: {
      dist: {}
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/<%= yeoman.app %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/<%= yeoman.app %>/images'
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
          cwd: '<%= yeoman.dist %>',
          src: ['<%= yeoman.app %>/*.html', '<%= yeoman.app %>/views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

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

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/<%= yeoman.app %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          {
              expand: true,
              dot: true,
              flatten: true,
              cwd: '<%= yeoman.app %>',
              dest: '<%= yeoman.dist %>/<%= yeoman.app %>/fonts',
              src: [
                '**/*.{woff,svg,ttf}'
              ]
          },

          {
              expand: true,
              dot: true,
              flatten: false,
              cwd: '<%= yeoman.src %>',
              dest: '<%= yeoman.dist %>/src',
              src: [
                'config.xml',
                '.cordova/**/*',
                'plugins/**/*',
                'hooks/**/*'
              ]
          },
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>/<%= yeoman.app %>',
            src: [
              '.htaccess',
              '*.html',
              'views/{,*/}*.html',
              '**/*.{png, jpg,ico,mp3,mp4,ogg,txt}'
            ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/<%= yeoman.app %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '<%= yeoman.fmk %>/deps/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>/<%= yeoman.app %>/'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: './src/test/karma.conf.js',
        singleRun: true
      }
    },
    compress: {
      main: {
        options: {
          archive: '<%= yeoman.zip %>/<%= yeoman.pkg.name %>-<%= yeoman.pkg.version %>.zip'
        },
        files: [
          {src : "**/*", cwd : "<%= yeoman.dist %>/src", expand: true}, // includes files in path and its subdirs
        ]
      }
    },
    "phonegap-build": {

      debug: {

        options: {
          download: {
            ios: '<%= yeoman.dist %>/ipa/<%= yeoman.pkg.name %>-<%= yeoman.pkg.version %>.ipa',
            android: '<%= yeoman.dist %>/apk/<%= yeoman.pkg.name %>-<%= yeoman.pkg.version %>.apk'
          },
          archive: "<%= yeoman.dist %>/bin/<%= yeoman.pkg.name %>-<%= yeoman.pkg.version %>.zip",
          "appId": "1555238",
          "timeout": 600000,
          "user": {
            email: 'tmpadresse42@gmail.com',
            password: 'Phonegap1234',
          }
        }
      }/*,
      release: {
        options: {
          "isRepository": "true",
          "appId": "1555238",
          "user": {
            "token": "ABCD123409876XYZ"
          }
        }
      }*/
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });


  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('doc', [
    'ngdocs',
    //'jsdoc'
  ]);

  grunt.registerTask('android', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'concat',
    'copy:dist',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin',
    'compress',
    'phonegap-build:debug'
    //'jsdoc'
  ]);
  grunt.registerTask('build', [
    'clean:dist',
    //'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'ngdocs',
    //'jsdoc',
    'concat',
    'ngAnnotate',
    'copy:dist',
    //'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin',
    'compress'
  ]);

  grunt.registerTask('default', [
    //'newer:jshint',
    'test',
    'build'
  ]);
};
