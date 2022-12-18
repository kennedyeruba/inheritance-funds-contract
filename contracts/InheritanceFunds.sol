//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
/*

    @author: Kennedy Eruba
    
    SELF-NOTE: 
    1) block.timestamp is a potential vulnerability since it can be maniplulated by the miner, potential solution would be to use an off-chain oracle(Think ChainLink).
*/

contract InheritanceFunds {
    address payable public owner;
    address payable public heir;
    uint public lockStartTime;
    uint public lockExpirationTime;
    uint public immutable ownershipIdleRange;

    modifier onlyBy(address _account, string memory message) {
        require(
            msg.sender == _account,
            message
        );
        _;
    }

    event HeirChanged(
        address oldOwner,
        address newOwner,
        address newHeir
    );

    event Withdrawal(
        uint amount,
        uint time
    );
    
    constructor(address payable _heir) payable {
        owner = payable(msg.sender);
        heir = _heir;
        ownershipIdleRange = 30 days;
        lockStartTime = block.timestamp;
        lockExpirationTime = lockStartTime + ownershipIdleRange;
    }

    function withdraw(uint _amount) 
        public 
        payable 
        onlyBy(owner, "Can only be called by owner")
    {
        require(
            _amount >= 0, 
            "Enter valid withdrawal amount"
        ); // Review significance
        require(
            _amount <= address(this).balance,
            "Insufficient inheritance funds"
        );
        
        if(_amount == 0) {
            lockStartTime = block.timestamp;
            lockExpirationTime = lockStartTime + ownershipIdleRange;
        } else {
            emit Withdrawal(_amount, block.timestamp);
            owner.transfer(_amount);
        }
    }

    function setNewHeir(address payable _newHeir) 
        public 
        onlyBy(heir, "Can only be called by heir")
    {
        require(
            lockExpirationTime < block.timestamp,
            "Heir can't be set"
        );

        address oldOwner = owner;
        owner = heir;
        heir = _newHeir;
        lockStartTime = block.timestamp;
        lockExpirationTime = lockStartTime + ownershipIdleRange;

        emit HeirChanged(oldOwner, owner, _newHeir);
        delete oldOwner; // Research on any solidity garbage collection related mechanism
    }
}