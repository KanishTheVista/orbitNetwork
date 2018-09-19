const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface,  bytecode } = require('./compile');
// ABI <=> interface
// infura api key => gktsmW0m
// metamask mnemonic =>  you chat chief lottery private oil blade
// metamask account1 address => 0x2cde3fceDe63909Be5B1416352fBF996eB13d3
// Attempting to deploy from account ::  0x2cde3fceD639096Be5B1416352fBF996eB13d3
// Contract deployed to ::  0x5dD22054e2489833A5Fb7CA652623C2bA2cB3dDC

const provider = new HDWalletProvider(
	' you chat chief lottery private oil blade',
	'https://rinkeby.infura.io/gktsmW0m7'
);

const web3 = new Web3(provider);

const deploy = async () => {

	const accounts = await web3.eth.getAccounts();

	console.log('Attempting to deploy from account :: ', accounts[0]);

	const result = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({
			data: bytecode,
			arguments: [5000000000000000,3]
		})
		.send({
			gas: '5000000',
			from: accounts[0]
		});

	console.log('Contract deployed to :: ', result.options.address);

};

deploy();




/*

npm uninstall truffle-hdwallet-provider
npm install --save truffle-hdwallet-provider@0.0.3


*/
