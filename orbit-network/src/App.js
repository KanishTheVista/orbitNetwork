import React, { Component } from 'react';
import logo from './logo.svg';
import logo1 from './logo1.png';
import background from './imgx.jpg';
import './App.css';
import web3 from './web3';
import orbitnetwork from './orbitnetwork';
const { generateMnemonic, EthHdWallet } = require('eth-hd-wallet');
/*
const wallet = EthHdWallet.fromMnemonic(generateMnemonic())

console.log( wallet instanceof EthHdWallet );

generateAddresses(): Generating addresses

console.log( wallet.generateAddresses(2) )
*/

function getUniqueProductId(){
  return new Promise(function(resolve, reject) {
    var wallet =  EthHdWallet.fromMnemonic(generateMnemonic());
    resolve(wallet.generateAddresses(1));
  });
}

class App extends Component {
  state = {
    value : '',
    value1 : '',
    value2 : '',
    value3: '',
    value11 : '',
    value12 : '',
    value13 : '',
    value14: '',
    message : '',
    NetworkRegFee : '',
    PostLimit : '',
    getUniqueProductId : '',
    checkCompanyRegisterStatus: '',
    address1: '',
    status :'False',
    productUid: '',
    productData_name : '',
    productData_owner : '',
    productData_description : '',
    productData_registerTime : '',
    productData_owner_registerTime : '',
    renew_amount : '',
    owner_puid : '',
    new_owner : '',
    product_cnt : '',
    fund_to_address : '',
    auth_address : ''
  };
  async componentDidMount() {
    const NetworkRegFee = await orbitnetwork.methods.getCurrentFee().call();
    const PostLimit = await orbitnetwork.methods.currentLimit().call();
    this.setState({
      NetworkRegFee : NetworkRegFee/1000000000000000000,
    });
    this.setState({
      PostLimit : PostLimit,
    });

  }

  getUniqueProductID = async(event) => {
      let id = await getUniqueProductId();
      this.setState({getUniqueProductId :id[0]});
      console.log(id);
  }

  onSubmit1 = async(event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    try{
      this.setState({message : 'Waiting on transaction success...'});
      console.log(this.state.value1,this.state.value2);
      let newCompReg = await orbitnetwork.methods.NewCompanyRegistration(this.state.value1,this.state.value2).send({
        from : accounts[0],
        gasPrice: '9900000000',
        gasLimit: '2000000',
        value : web3.utils.toWei(this.state.value,'ether'),
        data : [this.state.value1,this.state.value2]
      });
      console.log(newCompReg);
      this.setState({message : 'Successfully Registered'});
  }catch(err){
    this.setState({message : 'Already Exit'});
  }

  };
//insertProductData(address pid, string pname, string description, address pOwner)
  onSubmit2 = async(event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    try{
      this.setState({message : 'Waiting on transaction success...'});
      console.log(this.state.value1,this.state.value2);
      let newCompReg = await orbitnetwork.methods.insertProductData(this.state.value11,this.state.value12,this.state.value13,this.state.value14).send({
        from : accounts[0],
        gasPrice: '9900000000',
        gasLimit: '2000000',
        data : [this.state.value11,this.state.value12,this.state.value13,this.state.value14]
      });
      console.log(newCompReg);
      this.setState({message : 'Successfully Registered'});
  }catch(err){
    this.setState({message : 'You Are Not Registered or Maybe your use limit exceeded'});
  }

  };

checkCompanyRegisterStat = async(event) => {
  event.preventDefault();
  console.log(this.state.address1);
  //console.log(web3.utils.toHex(this.state.address1));
  let status = await orbitnetwork.methods.checkCompanyRegisterStatus(this.state.address1).call();
  console.log(status);
  if(status == true){
    this.setState({status : 'True'});
  }
  else {
    this.setState({status : 'False'});
  }

};
//0xcc3a5781b59c292c3a60ad3c7ca849a4dffc9a6c
getProductDetails = async(event) => {
  event.preventDefault();
  let data = await orbitnetwork.methods.getProductData(this.state.productUid).call();
  let date  = new Date(data[3]*1000);
  let date1  = new Date(data[4]*1000);
      this.setState({productData_name : data[0]});
      this.setState({productData_owner : data[1]});
      this.setState({productData_description : data[2]});
      this.setState({productData_registerTime : date.toString()});//productData_owner_registerTime
      this.setState({productData_owner_registerTime : date1.toString()});//productData_owner_registerTime
      console.log(data);
      console.log(this.state.productData_name);
};

renewService = async(event) => {
  event.preventDefault();
  this.setState({message : 'Waiting on transaction success...'});
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
  await orbitnetwork.methods.renewService().send({
    from : accounts[0],
    gasPrice: '9900000000',
    gasLimit: '2000000',
    value : web3.utils.toWei(this.state.renew_amount,'ether')
  });
  this.setState({message : 'Successfully Renewed'});

}
changingProductOwner = async(event) => {
  event.preventDefault();
  try{
    this.setState({message : 'Waiting on transaction success...'});
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    await orbitnetwork.methods.updateProductOwnerShip(this.state.owner_puid,this.state.new_owner).send({
      from : accounts[0],
      data : [this.state.owner_puid,this.state.new_owner]
    });
    this.setState({message : 'Successfully Ownership Changed'});
  }catch(err){
    this.setState({message : 'Your are not the owner of this product'});
  }

};

getTotalProductCount = async(event) => {
  event.preventDefault();
  this.setState({message : 'Fetching Data...'});
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
  let data = await orbitnetwork.methods.checkHowMuchYouUsed().call({from : accounts[0]});
  console.log(data);
  this.setState({product_cnt : data});
  this.setState({message : 'Successfully Feteched'});

};
// <div className="auth_client">
//  Authenticate The Client ::
//  Enter Address :: <input value = {this.state.auth_address}
//                    onChange = {(event) => {
//                    this.setState({
//                    auth_address: event.target.value
//                    });
//                  }}
//                  />
//   <button onClick = {this.authorizeClient}> Click </button>(Only OrbitNetwork Owner)
// </div>
// <hr/>
authorizeClient = async(event) => {
  event.preventDefault();
  this.setState({message : 'Waiting on transaction success...'});
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
  console.log(this.state.auth_address);
  let data = await orbitnetwork.methods.ownerPayout(this.state.auth_address).send({
    from : accounts[0],
    data : [this.state.auth_address]
  });
  console.log(data);
  this.setState({message : 'Successfully Transaction Hash :: ' + data.transactionHash});
};

transferFund = async(event) => {
  event.preventDefault();
try{
  this.setState({message : 'Waiting on transaction success...'});
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
  let data = await orbitnetwork.methods.ownerPayout(this.state.fund_to_address).send({
    from : accounts[0],
    data : [this.state.fund_to_address]
  });
  console.log(data);
  this.setState({message : 'Successfully Transfered :: ' + data.transactionHash});
}catch(err){
  this.setState({message : 'You are not the owner of this Orbit Network'});
}
};

  render() {
    return (
      <div className="App" style={{height: 1200, backgroundImage : `url(${background})` }}>

        <header className="App-header">
          <img src={logo1} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to OrbitNetwork</h1>
          <pre>Current Registeration Fee {this.state.NetworkRegFee} Ether</pre>
          <pre>Allowed number Of product to register per renewal :: {this.state.PostLimit}</pre>
          <p id="p_wrap"></p>

        </header>
        <form onSubmit = {this.onSubmit1} className ="formid1">
          <div>

          <h3>Register Your Company</h3>
            Enter Company Name <input value = {this.state.value1}
                                     onChange = {(event) => {
                                      this.setState({
                                        value1: event.target.value
                                      });
                                    }} />
          Enter Company Id <input value = {this.state.value2}
                                    onChange = {(event) => {
                                    this.setState({
                                    value2: event.target.value
                                    });
                                  }} />

        Registeration Fee <input value = {this.state.value}
                                 onChange = {(event) => {
                                  this.setState({
                                    value: event.target.value
                                  });
                                }} />
            <button> Register </button>
          </div>
        </form>
        <hr/>

        <div className ="uniquepid">
          <button onClick = {this.getUniqueProductID}>getUniqueProductId</button>
          <pre>{this.state.getUniqueProductId}</pre>
        </div>
        <hr/>
        <form onSubmit = {this.onSubmit2} className ="formid2">
          <div>
              <h3>Enter Product Data</h3>
                  Product Unique ID <input value11 = {this.state.value11}
                                          onChange = {(event) => {
                                          this.setState({
                                          value11: event.target.value
                                          });
                                        }}
                                        />
                    Product Name<input value12 = {this.state.value12}
                                            onChange = {(event) => {
                                            this.setState({
                                            value12: event.target.value
                                            });
                                          }}
                                          />
                    Product Description<input value13 = {this.state.value13}
                                            onChange = {(event) => {
                                            this.setState({
                                            value13: event.target.value
                                            });
                                          }}
                                          />
                                          <p id="p_wrap"></p>
                    Product Owner Address<input value14 = {this.state.value14}
                                            onChange = {(event) => {
                                            this.setState({
                                            value14: event.target.value
                                            });
                                          }}
                                          />
                                          <p id="p_wrap"></p>
                              <button> Push Data </button>
          </div>
        </form>
        <hr/>

        <div className = "checkCompanyRegisterStatus_">
              <input value = {this.state.address1}
                                onChange = {(event) => {
                                this.setState({
                                address1: web3.utils.toHex(event.target.value)
                                });
                              }}
                              />
          <button onClick = {this.checkCompanyRegisterStat}>checkCompanyRegisterStatus</button>
          <pre>{this.state.status}</pre>
        </div>
        <hr/>

        <div className="productExplorer">
          <h3>Product Verification Explorer</h3>
                Enter Product Unique Id <input value = {this.state.productUid}
                                  onChange = {(event) => {
                                  this.setState({
                                  productUid: event.target.value
                                  });
                                }}
                                />
                <button onClick = {this.getProductDetails}>Click</button>
                <ul>
                  <li>Product Name :: {this.state.productData_name}</li>
                  <li>Product Owner :: {this.state.productData_owner}</li>
                  <li>Product Description :: {this.state.productData_description}</li>
                  <li>Product Register Time :: {this.state.productData_registerTime}</li>
                  <li>Last Ownership Time :: {this.state.productData_owner_registerTime}</li>
                </ul>
        </div>
        <hr/>

        <div className="renew">
          <h3>Renew Your Service</h3>
          Enter Amount <input value = {this.state.renew_amount}
                            onChange = {(event) => {
                            this.setState({
                            renew_amount: event.target.value
                            });
                          }}
                          />
            <button onClick = {this.renewService}> Renew </button>
        </div>
        <hr/>
        <div className="changeOwnership">
          <h3>Change OwnerShip</h3>
          Product Unique ID <input value = {this.state.owner_puid}
                            onChange = {(event) => {
                            this.setState({
                            owner_puid: event.target.value
                            });
                          }}
                          />
          New  Owner Address <input value = {this.state.new_owner}
                            onChange = {(event) => {
                            this.setState({
                            new_owner: event.target.value
                            });
                          }}
                          />
            <button onClick = {this.changingProductOwner}> ChangeOwnerShip </button>
        </div>
        <hr/>
        <div className="totalUsed">
         Total Product Data deployed ::
          {this.state.product_cnt}<button onClick = {this.getTotalProductCount}> Click </button>
        </div>
        <hr/>
        <div className="transferFund">
         Transfer Contract Funds ::
         Enter Address :: <input value = {this.state.fund_to_address}
                           onChange = {(event) => {
                           this.setState({
                           fund_to_address: event.target.value
                           });
                         }}
                         />
          <button onClick = {this.transferFund}> Click </button>(Only OrbitNetwork Owner)
        </div>
        <hr/>
        <h3> {this.state.message}</h3>
      </div>
    );
  }
}

export default App;
