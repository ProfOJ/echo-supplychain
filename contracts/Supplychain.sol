// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChainFinancing {
    address public owner;
    mapping(address => uint) public balances;
    mapping(address => bool) public isBuyer;
    mapping(address => bool) public isSupplier;
    mapping(address => bool) public isLender;

    struct PurchaseOrder {
        address buyer;
        address supplier;
        uint amount;
        bool financed;
        bool paid;
    }

    PurchaseOrder[] public purchaseOrders;

    struct Supplier {
        string name;
        address supplierAddress;
        string products;
        string TIN;
        string operatingArea;
        string businessRegistrationNumber;
        bool approvalStatus;
    }

    Supplier[] public suppliers;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function.");
        _;
    }

    modifier onlyBuyer() {
        require(isBuyer[msg.sender], "Only authorized buyers can call this function.");
        _;
    }

    modifier onlySupplier() {
        require(isSupplier[msg.sender], "Only authorized suppliers can call this function.");
        _;
    }

    modifier onlyLender() {
        require(isLender[msg.sender], "Only authorized lenders can call this function.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addBuyer(address _buyer) public onlyOwner {
        isBuyer[_buyer] = true;
    }

    function addSupplier(
        string memory _name,
        address _supplierAddress,
        string memory _products,
        string memory _TIN,
        string memory _operatingArea,
        string memory _businessRegistrationNumber,
        bool _approvalStatus
    ) public onlyOwner {
        Supplier memory newSupplier = Supplier({
            name: _name,
            supplierAddress: _supplierAddress,
            products: _products,
            TIN: _TIN,
            operatingArea: _operatingArea,
            businessRegistrationNumber: _businessRegistrationNumber,
            approvalStatus: _approvalStatus
        });
        suppliers.push(newSupplier);
        isSupplier[_supplierAddress] = true;
    }

    function addLender(address _lender) public onlyOwner {
        isLender[_lender] = true;
    }

    function bypassAddBuyer(address _buyer) public {
        isBuyer[_buyer] = true;
    }

    function bypassCreatePurchaseOrder(address _supplier, uint _amount) public {
        PurchaseOrder memory newOrder = PurchaseOrder({
            buyer: msg.sender,
            supplier: _supplier,
            amount: _amount,
            financed: false,
            paid: false
        });
        purchaseOrders.push(newOrder);
    }

    function bypassFinancePurchaseOrder(uint _index) public {
        require(_index < purchaseOrders.length, "Invalid index.");
        require(!purchaseOrders[_index].financed, "Purchase order is already financed.");
        address supplier = purchaseOrders[_index].supplier;
        balances[supplier] += purchaseOrders[_index].amount;
        purchaseOrders[_index].financed = true;
    }

    function bypassPaySupplier(uint _index) public {
        require(_index < purchaseOrders.length, "Invalid index.");
        require(purchaseOrders[_index].financed, "Purchase order is not yet financed.");
        require(!purchaseOrders[_index].paid, "Payment already made.");
        address supplier = purchaseOrders[_index].supplier;
        require(balances[supplier] >= purchaseOrders[_index].amount, "Insufficient balance.");
        balances[supplier] -= purchaseOrders[_index].amount;
        purchaseOrders[_index].paid = true;
    }

    function getPurchaseOrdersLength() public view returns (uint) {
        return purchaseOrders.length;
    }
}
