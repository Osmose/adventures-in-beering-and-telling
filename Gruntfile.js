module.exports = function(grunt) {
    var connect = require('connect');
    var path = require('path');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'gh-pages': {
            options: {
                base: 'src'
            },
            src: ['**']
        }
    });

    grunt.registerTask('runserver', 'Start the development server.', function(port) {
        this.async();
        port = port || 8000;

        connect()
            .use(connect.static('src'))
            .use(connect.directory('src', {icons: true}))
            .use(connect.logger())
            .listen(port)
            .on('listening', function() {
                grunt.log.writeln('Starting static web server on port ' + port + '.');
            })
            .on('error', function(err) {
                if (err.code === 'EADDRINUSE') {
                    grunt.fatal('Port ' + port + ' is already in use by another process.');
                } else {
                    grunt.fatal(err);
                }
            });
    });

    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.registerTask('deploy', ['gh-pages']);
    grunt.registerTask('default', ['runserver']);
};
