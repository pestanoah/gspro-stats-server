# GSPro stats server

### Description

This is the server used to serve my personal GSPro stats tracker. All this really does it take the csv file downloaded from the GSPro portal and dump it into a sqlite db. The data can then be served over a couple of API routes to make querying it a bit more performant on the FE

### Steps to run

1. Get your shot data from the GsPro portal
2. Use the build_db script in `/dev-scripts` to build the sqlite db
3. Run the server and point the FE at the backend
