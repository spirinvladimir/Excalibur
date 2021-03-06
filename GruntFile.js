/*********************************
/* Excalibur.js Grunt Build File
/*********************************/

/*global module:false*/
module.exports = function (grunt) {

   //
   // Project configuration
   //
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      //
      // Configure jasmine-node to run Jasmine specs
      //
      jasmine_node: {
         specNameMatcher: "Spec", // load only specs containing specNameMatcher
         projectRoot: "./src/spec",
         requirejs: false,
         forceExit: true,
         jUnit: {
            report: false,
            savePath: "./dist/reports/jasmine/",
            useDotNotation: true,
            consolidate: true
         }
      },

      //
      // Concatenate build files
      // Add banner to files
      //
      concat: {
         main: {
            src: ['dist/<%= pkg.name %>-<%= pkg.version %>.js', 'src/engine/Exports.js'],
            dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
         },
         minified: {
            src: ['dist/<%= pkg.name %>-<%= pkg.version %>.min.js', 'src/engine/Exports.js'],
            dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
         },
         options: {
            separator: '\n;\n',
            banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                    '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                    ' Licensed <%= pkg.licenses[0].type%>*/\n'
         }
      },

      //
      // Minify files
      //
      minified: {
         files: {
            src: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
            dest: 'dist/<%= pkg.name %>-<%= pkg.version %>'
         },
         options: {
            sourcemap: false,
            allinone: true,
            dest_filename: '.min.js'
         }
      },

      //
      // Watch files
      //
      watch: {
         scripts: {
            files: ['src/engine/*.ts', 'src/spec/*.ts'],
            tasks: ['shell:specs', 'jasmine_node'],
            options: {
               interrupt: true
            }
         }
      },

      //
      // Shell Commands
      //
      shell: {

         //
         // Execute TypeScript compiler against Excalibur core
         //
         tsc: {
            command: 'tsc --sourcemap --declaration "./src/engine/Engine.ts" --out "./dist/<%= pkg.name %>-<%= pkg.version %>.js"',               
            options: {
               stdout: true,
               failOnError: true
            }
         },

         //
         // Package up Nuget (Windows only)
         //
         nuget: {
            command: 'src\\tools\\nuget pack Excalibur.nuspec -version <%= pkg.version %> -OutputDirectory ./dist',
            options: {
               stdout: true
            }
         },         

         //
         // TypeScript Compile Jasmine specs
         // TODO: Simplify this so we don't have to always update it every time we add a spec
         //
         specs: {
            command: 'tsc ' + ["./src/spec/ActorSpec.ts",
             "./src/spec/ColorSpec.ts",
             "./src/spec/PromiseSpec.ts",
             "./src/spec/CollectionSpec.ts",
             "./src/spec/LogSpec.ts",
             "./src/spec/TimerSpec.ts",
             "./src/spec/ClassSpec.ts",
             "./src/spec/MathSpec.ts",
             "./src/spec/CollisionGroupSpec.ts",
             "./src/spec/CollisionSpec.ts",
             "./src/spec/BoundingBoxSpec.ts",
             "./src/spec/CameraSpec.ts"].join(' ') + ' --out ./src/spec/TestsSpec.js',
            options: {
               stdout: true,
               failOnError: true
            }
         },

         //
         // TypeScript Compile sample game
         //
         sample: {
            command: 'tsc ./sandbox/src/game.ts',
            options: {
               stdout: true,
               failOnError: true
            }
         },

         //
         // Build documentation site
         //
         docs: {
            command: 'yuidoc --helpers ./docs/strip.js --themedir ./docs/excalibur --norecurse --extension .ts --outdir ./docs/out ./src/engine',
            options: {
               stdout: true,
               failOnError: true
            }
         },

         //
         // Build docs data
         //
         docsData: {
            command: 'yuidoc --helpers ./docs/strip.js --norecurse --extension .ts --outdir ./docs/out --parse-only ./src/engine',
            options: {
               stdout: true,
               failOnError: true
            }
         }
      },

      //
      // Copy Files for sample game
      //
      copy: {
         main: {
            files: [
               {src: './dist/<%= pkg.name %>-<%= pkg.version %>.js', dest: './dist/<%= pkg.name %>.js'},
               {src: './dist/<%= pkg.name %>-<%= pkg.version %>.min.js', dest: './dist/<%= pkg.name %>.min.js'},
               {src: './dist/<%= pkg.name %>-<%= pkg.version %>.d.ts', dest: './dist/<%= pkg.name %>.d.ts'}
            ]
         }
      },

      //
      // UglifyJS configuration
      //
      uglify: {}
   });

   //
   // Load NPM Grunt tasks as dependencies
   //
   grunt.loadNpmTasks('grunt-shell');
   grunt.loadNpmTasks('grunt-minified');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-jasmine-node');
   grunt.loadNpmTasks('grunt-contrib-watch');

   //
   // Register available Grunt tasks
   //

   // Run tests
   grunt.registerTask('tests', ['shell:specs', 'jasmine_node']);

   // Compile sample game
   grunt.registerTask('sample', ['shell:sample']);

   // Default task - compile, test, build dists
   grunt.registerTask('default', ['tests', 'shell:tsc', 'minified', 'concat', 'copy', 'sample', 'shell:nuget']);

   grunt.registerTask('compile', ['shell:tsc', 'minified', 'concat', 'copy', 'shell:nuget'])

   // Travis task - for Travis CI
   grunt.registerTask('travis', 'default');

   // Generate documentation site
   grunt.registerTask('docs', 'shell:docs');

};