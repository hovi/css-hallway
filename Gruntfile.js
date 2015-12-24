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
                    {expand: true, src: ['bower_components/**'], dest: 'dist/'},                
                ],
            },
        },
	});
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ftp-deploy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('build',['sass', 'copy']);
    grunt.registerTask('deploy',['clean', 'build', 'ftp-deploy']);
	grunt.registerTask('develop',['build', 'watch']);
    grunt.registerTask('default',['develop']);
}
