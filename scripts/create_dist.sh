#!/bin/sh
files="vendor/plugins/live_tree public/images/live_tree* public/javascripts/live_tree* public/stylesheets/live_tree*"
ver=0.1.1
cd "/d/LiveTree/rails"
rm ../live_tree-$ver.tar.gz
tar czvf ../live_tree-$ver.tar.gz $files
rm ../live_tree-$ver.zip
zip -r ../live_tree-$ver.zip $files
