league-tutorial
===============

A tutorial with rails and angularjs, building a CRUD application.

The tutorial instructions can be found at http://technpol.wordpress.com/2013/09/03/angularjs-and-rails-tutorial-index/.

The tutorial has branches for the position at the end of each tutorial page - you can use these either to see what the code should look like once created (and to copy and paste from if you don't like typing), or if you only want to do one page of the tutorial, to pull down a starting point from the previous page.

If you do pull down the code for the tutorial and want to run it, your general process assumes you already have node.js, npm, rails and the bundler installed.  If you don't look in tutorial 2 for instructions:

1.  git clone http://github.com/PaulL1/league-tutorial.git
2.  bundle install
3.  rake db:migrate
4.  npm install
5.  bower install
6.  grunt build
7.  rails server
8.  point your browser at localhost:3000/UI/index.html

 
