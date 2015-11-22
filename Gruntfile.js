module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // uglify: {
    //   options: {
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n'
    //   },
    //   build: {
    //     src: 'src/<%= pkg.name %>.js',
    //     dest: 'build/<%= pkg.name %>.min.js'
    //   }
    // },
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

  // Load the plugin that provides the 'uglify' task.
  //grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the plugin that provides the 'LESS' task.
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task(s).
  grunt.registerTask('default', ['less']);

};
