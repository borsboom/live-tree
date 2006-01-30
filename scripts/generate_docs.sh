#!/bin/sh
cd /d/LiveTree/src/rails/vendor/plugins/live_tree/lib
rm -rf ../doc
/d/ruby/bin/ruby 'D:\ruby\bin\rdoc' --op ../doc --main README README STATUS TODO LICENSE CHANGES LiveTreeClient LiveTreeProtocol live_tree.rb
