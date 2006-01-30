#!/bin/sh
cd /d/LiveTree/src/rails/vendor/plugins/live_tree/doc
rsync -avz * eborsboom_epiphyte@ssh.phx.nearlyfreespeech.net:code/live_tree/doc/
