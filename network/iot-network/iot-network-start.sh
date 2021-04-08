./network.sh down
./network.sh up -ca -s couchdb
./network.sh createChannel -c channel1
./network.sh deployCC -c channel1 -ccl javascript