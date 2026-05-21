#!/bin/bash

npm run build

pm2 stop umkm-ds-fe
pm2 delete umkm-ds-fe 
pm2 start npm --name "umkm-ds-fe" -- start -- --port 3099
pm2 save
