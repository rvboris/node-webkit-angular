module.exports = function (grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var config = {
        app: require('./bower.json').appPath || 'app',
        version: grunt.file.readJSON('package.json').version,
        dist: '.dist',
        tmp: '.tmp',
        resources: 'resources',
        binaries: 'binaries'
    };

    grunt.initConfig({
        config: config,

        pkg: grunt.file.readJSON('package.json'),

        yeoman: config,

        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            }
        },

        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= config.tmp %>/*',
                            '<%= yeoman.dist %>/{,*/}*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            binaries: '<%= config.binaries %>/<%= config.version %>',
            nodebin: '<%= config.dist %>/node_modules/.bin'
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/scripts/{,*/}*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.tmp %>/styles/',
                        src: '{,*/}*.css',
                        dest: '<%= config.tmp %>/styles/'
                    }
                ]
            }
        },

        wiredep: {
            options: {
                cwd: '<%= yeoman.app %>'
            },
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath: /\.\.\//
            }
        },

        filerev: {
            dist: {
                src: [
                    '<%= yeoman.dist %>/scripts/{,*/}*.js',
                    '<%= yeoman.dist %>/styles/{,*/}*.css',
                    '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.dist %>/styles/fonts/*'
                ]
            }
        },

        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
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

        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images']
            }
        },

        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },

        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.svg',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.tmp %>/concat/scripts',
                        src: '*.js',
                        dest: '<%= config.tmp %>/concat/scripts',
                        extDot: 'last'
                    }
                ]
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
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['*.html', 'views/{,*/}*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            '*.html',
                            'package.json',
                            'views/{,*/}*.html',
                            'images/{,*/}*.{webp}',
                            'fonts/*',
                            'node_modules/**'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '<%= config.tmp %>/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: ['generated/*']
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '<%= config.tmp %>/styles/',
                src: '{,*/}*.css'
            },
            copyWinToTmp: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.resources %>/node-webkit/Windows/',
                        dest: '<%= config.tmp %>/build/',
                        src: '**'
                    }
                ]
            },
            binaries: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.tmp %>/build/',
                        dest: '<%= config.binaries %>/<%= config.version %>/',
                        src: '**'
                    }
                ]
            }
        },
        compress: {
            appToTmp: {
                options: {
                    archive: '<%= config.tmp %>/build/app.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.dist %>',
                        src: ['**']
                    }
                ]
            }
        },
        rename: {
            app: {
                files: [
                    {
                        src: '<%= config.binaries %>/node-webkit.app',
                        dest: '<%= config.binaries %>/app.app'
                    }
                ]
            },
            zipToApp: {
                files: [
                    {
                        src: '<%= config.tmp %>/build/app.zip',
                        dest: '<%= config.tmp %>/build/app.nw'
                    }
                ]
            }
        },
        concurrent: {
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json', 'app/package.json'],
                updateConfigs: [],
                commit: false,
                createTag: false,
                push: false
            }
        },
        stylus: {
            compile: {
                files: {
                    '<%= config.tmp %>/styles/app.css': ['<%= yeoman.app %>/stylus/{,*/}*.styl']
                }
            }
        },
        regenerator: {
            options: {
                includeRuntime: true
            },
            dist: {
                files: {
                    '<%= config.tmp %>/concat/scripts/app.js': '<%= config.tmp %>/concat/scripts/app.js'
                }
            }
        }
    });

    grunt.registerTask('app-build', [
        'jshint:all',
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'regenerator',
        'ngAnnotate',
        'copy:dist',
        'clean:nodebin',
        'stylus',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('createWindowsApp', 'Create windows distribution.', function () {
        var done = this.async();
        var concat = require('concat-files');

        concat([
            '.tmp/build/nw.exe',
            '.tmp/build/app.nw'
        ], '.tmp/build/app.exe', function () {
            var fs = require('fs');
            fs.unlink('.tmp/build/app.nw', function (error, stdout, stderr) {
                if (stdout) {
                    grunt.log.write(stdout);
                }
                if (stderr) {
                    grunt.log.write(stderr);
                }
                if (error !== null) {
                    grunt.log.error(error);
                    done(false);
                } else {
                    fs.unlink('.tmp/build/nw.exe', function (error, stdout, stderr) {
                        var result = true;
                        if (stdout) {
                            grunt.log.write(stdout);
                        }
                        if (stderr) {
                            grunt.log.write(stderr);
                        }
                        if (error !== null) {
                            grunt.log.error(error);
                            result = false;
                        }
                        done(result);
                    });
                }
            });
        });
    });

    grunt.registerTask('dist-win', [
        'app-build',
        'clean:binaries',
        'copy:copyWinToTmp',
        'compress:appToTmp',
        'rename:zipToApp',
        'createWindowsApp',
        'copy:binaries'
    ]);

    grunt.registerTask('check', [
        'jshint'
    ]);

    grunt.registerTask('default', ['dist-win']);
};
