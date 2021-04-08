function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}
set -ev
set -o pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cp "${DIR}/../network/iot-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml" "${DIR}/config/"
cp "${DIR}/../network/iot-network/organizations/peerOrganizations/org2.example.com/connection-org2.yaml" "${DIR}/config/"
cp "${DIR}/../network/iot-network/organizations/peerOrganizations/org1.example.com/connection-org1.json" "${DIR}/config/"
cp "${DIR}/../network/iot-network/organizations/peerOrganizations/org2.example.com/connection-org2.json" "${DIR}/config/"
docker-compose down
echo -e "Start deepstreamio Server"
docker-compose up -d
sleep 1
echo -e "Start API server"
npm run dev