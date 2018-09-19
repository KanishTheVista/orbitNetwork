const path = require('path');
const fs = require('fs');
const solc = require('solc');
const orbitPath = path.resolve(__dirname,'contract','orbitNetwork.sol'); //directory - folder name  - source code
const source = fs.readFileSync(orbitPath, 'utf8');

console.log(solc.compile(source, 1));

module.exports = solc.compile(source, 1).contracts[':Orbit'];
