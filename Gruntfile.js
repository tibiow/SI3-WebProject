'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
  // if there's a "clean" task, add Meteor to it; otherwise, see meteor-cleanup below
    // clean: {
    //   meteor: ['.build.*', 'versions.json', 'package.js']
    // }

    grunt.initConfig({

    exec: {
      'meteor-init': {
        command: [
          //install the dependencies
          'npm install',

          // Make sure Meteor is installed, per https://meteor.com/install.
          // The curl'ed script is safe; takes 2 minutes to read source & check.
          'type meteor >/dev/null 2>&1 || { curl https://install.meteor.com/ | sh; }',
          // Meteor expects package.js to be in the root directory of
          // the checkout, so copy it there temporarily
          //'cp app/package.js .'
          //install the meteor dependencies
          'cd app',
          'npm install',
          'cd ..',
          'npm install -g karma-cli'
        ].join(';')
      },
      // !- only add this if there was no "clean" task
      'meteor-cleanup': {
        // remove build files and package.js
        command: 'rm -rf .build.* versions.json package.js'
      },
      'meteor-test': {
        command: 'karma start'
      },
      'meteor-publish': {
        command: 'cd app && meteor'
      }
    }
  });


  // !- add the line below ONLY if you see other grunt.loadNpmTasks() calls
  //grunt.loadNpmTasks('grunt-exec');
  // !- you DON'T need to add the line above if you see: require('load-grunt-tasks')(grunt);

  // Meteor tasks
  grunt.registerTask('test', ['exec:meteor-test']);
  grunt.registerTask('meteor-publish', ['exec:meteor-init', 'exec:meteor-publish', 'exec:meteor-cleanup']);
  grunt.registerTask('init', ['exec:meteor-init']);
  grunt.registerTask('serve', ['exec:meteor-publish']);

};
