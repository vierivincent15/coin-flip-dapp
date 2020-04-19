pragma solidity ^0.4.21;

import "token.sol";

contract Crowdsale {
    
    uint256 private start_period;
    uint256 private end_period;
    uint256 private curr_balance;
    uint256 private token_price;
    Token private my_token;
    
    constructor(uint256 initialAmount, string tokenName, uint8 decimalUnits, string tokenSymbol) public {
        start_period = now;
        end_period = start_period + 30 days;
        my_token = new Token(initialAmount, tokenName, decimalUnits, tokenSymbol);
        curr_balance = my_token.totalSupply();
        token_price = 0.1 ether;
    }
    
    function getOwner() view public returns(address) {
        return my_token.me();
    }
    
    function buyToken(uint256 token_amount) public payable {
        require(token_amount*token_price == msg.value);
        address client = msg.sender;
        
        my_token.buy(client, token_amount);
        curr_balance -= token_amount;
        
    }
    
    function getStart() view public returns(uint256) {
        return start_period;
    }
    
    function getEnd() view public returns(uint256) {
        return end_period;
    }
    
    function getTokenName() view public returns(string) {
        return my_token.name();
    }
    
    function getTokenSymbol() view public returns(string) {
        return my_token.symbol();
    }
    
    function getTotalSupply() view public returns(uint256) {
        return my_token.totalSupply();
    }
    
    function getTokenPrice() view public returns(uint256) {
        return token_price;
    }
    
    function getCurrBalance() view public returns(uint256) {
        return curr_balance;
    }
    
    function getAccmFund() view public returns(uint256) {
        return address(this).balance;
    }
}