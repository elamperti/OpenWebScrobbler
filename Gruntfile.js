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


        copy: {
            dist: {
                expand: true,
                cwd: 'src/',
                dot: true,
                src: ['**', '.htaccess', '!**/*.js', '!**/*.css', '!**/*.scss', '!css/bootstrap*'],
                dest: 'dist'
            },

            debug: {
                expand: true,
                cwd: 'src/',
                dot: true,
                files: {
                    'dist/js/main.min.js': ['src/js/main.js'],
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


        // uncss : {
        //     dist: {
        //         files: {
        //             'dist/css/style.min.css': ['**/*.twig', '**/*.php']
        //         }
        //     }
        // },


        uglify : {
            options: {
                preserveComments: false,
                mangle: true
            },
            main: {
                src:  'src/js/main.js',
                dest: 'dist/js/main.min.js',
            },
            bootstrap: {
                src:  'src/js/lib/bootstrap.js',
                dest: 'dist/js/lib/bootstrap.min.js',
            },
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
                tasks: ['uglify'],
                options: {
                    spawn : false,
                    interrupt: true,
                    livereload: true
                }
            },
            
            css: {
                files: ['src/css/*.scss'],
                tasks: ['sass', 'cmq', 'cssmin'],
                options: {
                    spawn : false,
                    interrupt: true,
                    livereload: true
                },
            },
            
            views: {
                files : ['src/**/*.twig'],
                tasks : [ 'copy' ],
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-combine-media-queries');
    grunt.loadNpmTasks("grunt-rsync");
    // grunt.loadNpmTasks('grunt-uncss');
    
    // Tasks
    grunt.registerTask(
        'default',
        [
            'clean:all',
            'copy:dist',
            'sass',
            // 'uncss',
            'cmq',
            'cssmin',
            'uglify',
        ]
    );

    grunt.registerTask(
        'debug',
        [
            'clean:all',
            'copy:dist',
            'copy:debug',
            'sass',
            // 'uncss',
            'cmq',
        ]
    );

    grunt.registerTask('upload', ['default', 'rsync']);

};
