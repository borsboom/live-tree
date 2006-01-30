#!/bin/sh

ver=0.1.2
files="vendor/plugins/live_tree public/images/live_tree* public/javascripts/live_tree* public/stylesheets/live_tree*"

cd /d/LiveTree/src/rails
rm ../../dists/live_tree-$ver.tar.gz
tar czvf ../../dists/live_tree-$ver.tar.gz --exclude=".svn" $files
rm ../../dists/live_tree-$ver.zip
zip -r ../../dists/live_tree-$ver.zip $files -x '*/.svn/*'
