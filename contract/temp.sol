pragma solidity ^0.4.17;
//Fee Class
contract FeeForClient{
   uint public fee;
   uint public currentLimit;

}

contract CompanyRegistration{
    address public Owner;
    string public companyName;
    uint public companyId;
     constructor(string companyname, uint companyid, address ownerAdrress) public{
        Owner = ownerAdrress;
        companyName = companyname;
        companyId = companyid;
    }

    function getCompanyInfo() public view returns(address,string,uint){
        return (Owner,companyName,companyId);
    }

}


//Owner
contract Orbit is FeeForClient{
    address owner;
    address[] public clientAddresses;
    address[] public clientContractAddresses;
    uint totalClients;
    uint [] public totalProductsPerCompany;

    struct productInfo{
        string name;
        address productId;
        string description;
        int authentication;
        uint timestamp;
        uint lastOwnerShipTimeStamp;
    }


      mapping(address => productInfo) productSearch; // it is accessble to every use//product id -> product info
      mapping(address => address) public clientAccountToClientContractAddess;
      mapping(address => address) public clientContractAddessToClientAccount;
      mapping(address => bool) public checkCompanyIsRegistered;
      mapping(address => uint) public indexForTotalProductsPerCompany;
      mapping(address => address) public productOwnerShip;
      mapping(address => bool) public isThisProductisRegistered;

    constructor(uint intialFee, uint limit) public{
        require(intialFee != 0);
        FeeForClient.fee = intialFee;
        owner = msg.sender;
        FeeForClient.currentLimit =  limit;

    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    modifier companyIsRegistered(){
        require(checkCompanyIsRegistered[msg.sender] == true);
        require(totalProductsPerCompany[indexForTotalProductsPerCompany[msg.sender]] <  FeeForClient.currentLimit);
        _;
    }
    function checkCompanyRegisterStatus(address add) public view returns(bool){
        return checkCompanyIsRegistered[add];
    }

    function setCurrentFee(uint seTFee) onlyOwner public{
        FeeForClient.fee = seTFee;
    }

    function getCurrentFee() public pure returns(uint){
        return FeeForClient.fee;
    }

    function changeOwner(address newOwner) onlyOwner public {
        owner = newOwner;
    }

    function NewCompanyRegistration(string companyname, uint companyid) public payable{
        require(msg.value >= fee);
        require(checkCompanyIsRegistered[msg.sender] == false);
        address newRegistration = new CompanyRegistration(companyname, companyid, msg.sender);
        if(totalClients == 0){
          totalProductsPerCompany.push(0);
        }
        totalClients++;
        indexForTotalProductsPerCompany[msg.sender] = totalClients;
        totalProductsPerCompany.push(0);
        clientAddresses.push(msg.sender);
        clientContractAddresses.push(newRegistration);
        checkCompanyIsRegistered[msg.sender] = true;
        clientContractAddessToClientAccount[newRegistration] = msg.sender;
        clientAccountToClientContractAddess[msg.sender] = newRegistration;

    }

    function insertProductData(address pid, string pname, string description, address pOwner) companyIsRegistered public{
        require(isThisProductisRegistered[pid] == false);
        totalProductsPerCompany[indexForTotalProductsPerCompany[msg.sender]]++;
        isThisProductisRegistered[pid] = true;
        uint  currentTime  = block.timestamp;
        productInfo memory newProductInfo = productInfo({
            name : pname,
            productId : pid,
            authentication : 1,
            description : description,
            timestamp : currentTime,
            lastOwnerShipTimeStamp : currentTime
        });

        productSearch[pid] = newProductInfo;
        productOwnerShip[pid] = pOwner;
    }


    // function batchInsertProductData(bytes32[1001][] names, address [] productIds, bytes32[1001][] descriptions) companyIsRegistered public{

    // }

    function getProductData(address pid)public view returns(string, address,string,uint,uint){
        if(productSearch[pid].authentication == 0){
            return ("error",0x00000000,"false",0,0);
        }else if(productSearch[pid].authentication == 2){
            return (productSearch[pid].name,productOwnerShip[pid],"false",0,0);
        }
        return (productSearch[pid].name, productOwnerShip[pid], productSearch[pid].description,productSearch[pid].timestamp,productSearch[pid].lastOwnerShipTimeStamp);
    }


    function updateProductOwnerShip(address pid, address pOwner) public{
        require(msg.sender == productOwnerShip[pid]);
        productOwnerShip[pid] = pOwner;
        uint currentTime = block.timestamp;
        productSearch[pid].lastOwnerShipTimeStamp = currentTime;
    }
    function updateProductStatus(address pid) public{
        require(productSearch[pid].authentication != 0);
        productSearch[pid].authentication = 2;
    }

    function checkHowMuchYouUsed() public view returns(uint){
        return totalProductsPerCompany[indexForTotalProductsPerCompany[msg.sender]];
    }

    function renewService() public payable{
        require(msg.value >= FeeForClient.fee);
        totalProductsPerCompany[indexForTotalProductsPerCompany[msg.sender]] = 0;
    }

    function ownerPayout(address to) onlyOwner public{
        to.transfer(this.balance);
    }
    // function authorizeClient(address clientaddresses) public onlyOwner{
    //     require(tempCheckCompanyIsRegistered[clientaddresses] == true);
    //     checkCompanyIsRegistered[clientaddresses] = true;
    //       auth(clientaddresses,checkCompanyIsRegistered[clientaddresses]);
    // }


}
