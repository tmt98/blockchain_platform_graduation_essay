function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

set -ev
set -o pipefail

./network.sh down
docker rm $(docker ps -aq)
