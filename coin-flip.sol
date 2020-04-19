pragma solidity ^0.4.21;

contract CoinFlip {
    
    struct creator {
        address addr;
        bytes32 commitment;
    }
    
    struct better {
        address addr;
        bool flip_result;
    }
    
    struct contract_info {
        uint256 bet_amount;
        uint256 expiration;
    }
    
    address private owner;
    
    creator private player1;
    better private player2;
    contract_info private info;
    
    event Status(string msg, address user, uint256 amount);
    event Comment(string msg);
    
    constructor() public {
        owner = msg.sender;
    }

    function getOwner() view public returns(address) {
        return owner;
    }
    
    function getCreator() view public returns(address) {
        return player1.addr;
    }
    
    function getBetter() view public returns(address) {
        return player2.addr;
    }
    
    function getAmount() view public returns(uint256) {
        return info.bet_amount;
    }
    
    function getBalance() view public returns(uint256) {
        return address(this).balance;
    }
    
    function createBet(bytes32 commitment) public payable {
        require(player1.addr == address(0));

        player1 = creator(msg.sender, commitment);
        info = contract_info(msg.value, 2**256-1);
        emit Status('Contract successfully created', msg.sender, msg.value);
    }
    
    function takeBet() public payable {
        require(player2.addr == address(0));
        require(player1.addr != address(0));
        require(msg.sender != player1.addr);
        require(msg.value == info.bet_amount);
        
        // randomly get choice here
        bool flip_result;
        flip_result = flip_coin();

        player2 = better(msg.sender, flip_result);
        info.expiration = now + 24 hours;
        emit Status('Someone joined the contract', msg.sender, msg.value);
    }
    
    function flip_coin() private view returns (bool flip_result) {
        if((now % 2) == 0) {
            flip_result = true;
        } else {
            flip_result = false;
        }
        
        return flip_result;
    }
    
    
    function reveal(uint256 nonce) public onlyCreator {
        require(player2.addr != address(0));
        require(now < info.expiration);
        
        
        if (keccak256(abi.encodePacked(player2.flip_result, nonce)) == player1.commitment) {
            emit Status('Better won the contract', player2.addr, address(this).balance);
            player2.addr.transfer(address(this).balance);
        } else {
            emit Status('Creator won the contract', player1.addr, address(this).balance);
            player1.addr.transfer(address(this).balance);
        }

        player1.addr = address(0);
        player2.addr = address(0);
        info.bet_amount = 0;
    }
    
    function cancel() public onlyCreator {
        require(player1.addr != address(0));
        require(player2.addr == address(0));

        info.bet_amount = 0;
        player1.addr.transfer(address(this).balance);
        player1.addr = address(0);
    }
    
    function withdraw() public onlyBetter {
        require(info.bet_amount != 0);
        require(player2.addr != address(0));
        
        uint256 initial = address(this).balance / 2;
        player1.addr.transfer(initial/2);
        player2.addr.transfer(initial/2);
        emit Status('Better has withdrawn, Creator re-opens contract', player1.addr, address(this).balance);
        player2.addr = address(0);
    }
    
    function claimTimeout() public onlyBetter {
        require(player1.addr != address(0));
        require(player2.addr != address(0));
        require(now >= info.expiration);
        
        player2.addr.transfer(address(this).balance);

        player1.addr = address(0);
        player2.addr = address(0);
        info.bet_amount = 0;
    }
    
    modifier onlyCreator {
        if (msg.sender != player1.addr) {
            revert();
        } else {
            _;
        }
        
    }
    
    modifier onlyBetter {
        if (msg.sender != player2.addr) {
            revert();
        } else {
            _;
        }
        
    }
    
    // Fallback Function
    function() public payable {
        emit Comment('This is a fallback function. It will be invoked when a contract receives only plain ether');
    }

}