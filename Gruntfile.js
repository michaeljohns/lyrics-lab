module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      css: {
        files: ['style/**/*.less'],
        tasks: ['less']
      }
    },
    less: {
      development: {
        options: {
          paths: ['bower_components/bootstrap/less']
        },
        files: {
          'style/main.css': 'style/main.less'
        }
      }
    }
  });

  // Load the plugin that provides file watching.
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Load the plugin that provides the 'LESS' task.
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task(s).
  grunt.registerTask('default', ['less', 'watch']);

};
