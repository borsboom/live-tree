#!/bin/sh

ver=0.1.2
base_files="config/database.yml db/create_live_tree_demo.sql public/index.html"
areas_files="app/models/area.rb app/models/map.rb app/models/map_area.rb app/controllers/areas_controller.rb app/helpers/areas_helper.rb app/views/areas/index.rhtml app/views/areas/_map.rhtml public/images/area_maps/*.gif"
nested_set_files="app/models/nested_set_item.rb app/views/nested_set/index.rhtml app/controllers/nested_set_controller.rb app/helpers/nested_set_helper.rb"
other_column_names_files="app/views/other_column_names/index.rhtml app/controllers/other_column_names_controller.rb app/helpers/other_column_names_helper.rb app/models/other_column_names_item.rb"
custom_data_files="app/views/custom_data/index.rhtml app/controllers/custom_data_controller.rb app/helpers/custom_data_helper.rb"
non_model_data_files="app/views/non_model_data/index.rhtml app/controllers/non_model_data_controller.rb app/helpers/non_model_data_helper.rb"
readme_files="README.live_tree_demo"

files="$base_files $areas_files $nested_set_files $other_column_names_files $custom_data_files $non_model_data_files $readme_files"
cd "/d/LiveTree/src/rails"
rm ../../dists/live_tree_demo-$ver.tar.gz
tar czvf ../../dists/live_tree_demo-$ver.tar.gz --exclude=".svn" $files
rm ../../dists/live_tree_demo-$ver.zip
zip -r ../../dists/live_tree_demo-$ver.zip $files -x '*/.svn/*'
