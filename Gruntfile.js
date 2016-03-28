module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            all: {
                src: ['dist/*', '!dist/vendor/**']
            }
        },


        cmq : {
            dist: {
                files: [
                {
                    src:  'dist/css/style.min.css',
                    dest: 'dist/css/style.min.css'
                }
                ],
            }
        },


        concat : {
            css: {
                files: {
                    'dist/css/style.min.css': [
                        'dist/css/style.min.css',
                        'src/css/lib/bootstrap-clockpicker.min.css',
                        'src/css/lib/bootstrap-datepicker3.min.css',
                        'src/css/lib/lastfm-autocomplete.css',
                    ],
                }
            },
            js: {
                files: {
                    'dist/js/main.min.js': [
                        'src/js/lib/bootstrap-*',
                        'src/js/config.js',
                        'src/js/lib/lastfm-autocomplete.js',
                        'src/js/main.js',
                    ],
                }
            }
        },


        copy: {
            dist: {
                expand: true,
                cwd: 'src/',
                dot: true,
                src: [
                    '**',
                    '.htaccess',

                    '!**/*.js',
                    '!**/*.css',
                    '!**/*.scss',
                    '!css/bootstrap*',
                    '!css/bootstrap/**/*',
                    '!inc/config.sample.php'
                ],
                dest: 'dist'
            },

            debug: {
                expand: true,
                cwd: 'src/',
                dot: true,
                files: {
                    'dist/js/lib/bootstrap.min.js': ['src/js/lib/bootstrap.js'],
                }
            }
        },


        cssmin : {
            dist: {
                options: {
                    keepSpecialComments: 0,
                },
                files: [
                {
                    src:  'dist/css/style.min.css',
                    dest: 'dist/css/style.min.css'
                },
                ],
            }
        },


        hashres : {
            options: {
                encoding: 'utf8',
                fileNameFormat: '${name}.${hash}.${ext}',
                renameFiles: true
            },

            prod: {
                src: [
                    'dist/js/*.js',
                    'dist/css/*.css',
                ],
                dest: [
                    'dist/**/*.twig',
                ]
            }
        },


        htmlclean : {
            dist: {
                expand: true,
                cwd: 'dist/',
                src: ['**/*.twig'],
                dest: 'dist/',
                unprotect: /<script>[\s\S]+?<\/script>/ig
            }
        },


        sass : {
            dist: {
                options : {
                    style: 'expanded',
                    sourcemap: "none"
                },
                files : {
                    'dist/css/style.min.css': 'src/css/style.scss',
                }
            }
        },


        uglify : {
            options: {
                preserveComments: false,
                mangle: true
            },
            main: {
                src: [
                    'src/js/lib/bootstrap-*',
                    'src/js/config.js',
                    'src/js/lib/lastfm-autocomplete.js',
                    'src/js/main.js'
                ],
                dest: 'dist/js/main.min.js',
            },
            bootstrap: {
                src:  'src/js/lib/bootstrap.js',
                dest: 'dist/js/lib/bootstrap.min.js',
            }
        },


        uncss : { // If this gives you a weird error, try installing version 0.10.0
            dist: {
                options: {
                    csspath: '../../dist/css/',
                    stylesheets: ['style.min.css'],
                    //htmlroot: 'dist/',
                    ignore: [
                        /scrobble/,
                        /btn.*/,
                        /alert.*/,
                        /tooltip.*/,
                        /popover.*/,
                        '.dropdown-menu',
                        '.text-muted',
                        '.text-warning',
                        '.text-danger',
                        '.glyphicon-cd',
                        '.glyphicon-calendar',
                        '.glyphicon-ok',
                        '.glyphicon-remove',
                        '.glyphicon-repeat',
                        '.glyphicon-time',
                    ]
                },
                files: {
                    'dist/css/style.min.css': ['dist/views/**/*.twig'],
                }
            }
        },


        rsync : {
            options: {
                args: ["--chmod=u=rwX,go=rX"], // this is what works for my server, YMMV.
                exclude: ['.git*'], //, 'vendor/twig/twig/test/*', 'vendor/twig/twig/doc/*'],
                recursive: true
            },
            dist: {
                options: {
                    src: 'dist/',
                    dest: 'your-ows-server:path/to/ows/'
                }
            }
        },


        watch : {
            scripts: {
                files: ['src/js/*.js'],
                tasks: ['copy:debug'],
                options: {
                    spawn : false,
                    interrupt: true,
                    livereload: true
                }
            },

            css: {
                files: ['src/css/*.scss'],
                tasks: ['sass', 'uncss', 'cmq', 'cssmin'],
                options: {
                    spawn : false,
                    interrupt: true,
                    livereload: true
                },
            },

            views: {
                files : ['src/**/*.twig'],
                tasks : [ 'copy:dist', 'htmlclean' ],
                options : {
                    spawn : false,
                    interrupt: false,
                    livereload: true
                }
            },

            php: {
                files : ['src/**/*.php'],
                tasks : [ 'copy' ],
                options : {
                    spawn : false,
                    interrupt: false,
                    livereload: false
                }
            }
        },

    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-combine-media-queries');
    grunt.loadNpmTasks('grunt-hashres');
    grunt.loadNpmTasks('grunt-htmlclean');
    grunt.loadNpmTasks("grunt-rsync");
    grunt.loadNpmTasks('grunt-uncss');

    // Tasks
    grunt.registerTask(
        'default',
        [
            'clean:all',
            'copy:dist',
            'htmlclean',
            'sass',
            'uncss',
            'concat:css',
            'cmq',
            'cssmin',
            'uglify',
            'hashres'
        ]
    );

    grunt.registerTask(
        'debug',
        [
            'clean:all',
            'copy:dist',
            'copy:debug',
            'concat:js',
            'sass',
            'concat:css',
            // 'uncss',
            'cmq',
        ]
    );

    grunt.registerTask('upload', ['default', 'rsync']);

};
