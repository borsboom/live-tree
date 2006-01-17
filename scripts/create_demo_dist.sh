#!/bin/sh
files="config/database.yml db/create_areas.sql app/models/area.rb test/unit/area_test.rb test/fixtures/areas.yml app/models/map.rb test/unit/map_test.rb test/fixtures/maps.yml app/models/map_area.rb test/unit/map_area_test.rb test/fixtures/map_areas.yml app/controllers/areas_controller.rb test/functional/areas_controller_test.rb app/helpers/areas_helper.rb app/views/areas/index.rhtml app/views/areas/_map.rhtml public/images/area_maps/*.gif README.live_tree_demo"
ver=0.1.1
cd "/d/LiveTree/rails"
rm ../live_tree_demo-$ver.tar.gz
tar czvf ../live_tree_demo-$ver.tar.gz $files
rm ../live_tree_demo-$ver.zip
zip -r ../live_tree_demo-$ver.zip $files
