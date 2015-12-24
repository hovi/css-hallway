module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
              files: [{
                expand: true,
                cwd: 'scss',
                src: ['*.scss'],
                dest: 'dist/css',
                ext: '.css'
              }]
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			}
		},
        'ftp-deploy': {
            build: {
                auth: {
                    host: 'xx.wz.sk',
                    port: 21,
                    authKey: 'key1'
                },
                src: 'dist/',
                dest: '/C/',
                forceVerbose: true,
                exclusions: ['dist/**/.DS_Store', 'dist/bower_components/**/src']
            }
        },
        clean: ["dist"],
        copy: {
            main: {
                files: [
                    {expand: true, src: ['*.html'], dest: 'dist/', filter: 'isFile'},
                    {expand: true, src: ['js/*.js'], dest: 'dist/'},
                    //{expand: true, src: ['css/*.*'], dest: 'dist/'},
                    {expand: true, src: ['bower_components/**'], dest: 'dist/'},
                     
                // includes files within path and its sub-directories
                //{expand: true, src: ['path/**'], dest: 'dest/'},

                // makes all src relative to cwd
                //{expand: true, cwd: 'i', src: ['**'], dest: 'dest/'},

                // flattens results to a single level
                
                ],
            },
        },
	});
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ftp-deploy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('deploy',['clean', 'sass', 'copy', 'ftp-deploy']);
	grunt.registerTask('default',['sass', 'watch']);
}
