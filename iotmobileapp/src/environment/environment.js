const ip = '192.168.43.210';
const ip1 = '10.42.0.1';
const url = `http://${ip}:9999`;
const urlP9997 = `http://${ip}:9997`;
var _Environments = {
  production: {BASE_URL: url, PORT_9997: urlP9997, IPLOCAL: ip, IPORTHER: ip1},
  development: {BASE_URL: url, PORT_9997: urlP9997, IPLOCAL: ip, IPORTHER: ip1},
};

const getEnvironment = () => {
  return _Environments['development'];
};

var Environment = getEnvironment();
module.exports = Environment;
