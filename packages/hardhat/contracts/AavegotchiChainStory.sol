//SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract AavegotchiChainStory {

    bytes32 constant AAVEGOTCHI_CHAIN_STORY_STORAGE_POSITION = keccak256("aavegotchi-chain-story.storage");

    struct StoryPart {
        address authorAddress;
        string authorName;
        string authorContact;
        string note;
        string storyPart;
        uint256 gltrAmount;
        uint256 vote;
    }

    struct Author {
        uint256 disregardedVotingPower;
    }

    struct AppStorage {
        address admin;
        StoryPart[] storyParts;
        uint16[][] submissions;
        uint16[] publishedStoryParts;
        mapping(address author => Author) authors;
        uint128 round;
        uint128 rountStart;
        uint256 sharedVotingPower;
        uint256 winningSubmission;
        uint256 winningSubmissionVote;
        uint256 gltrMinimum;
    }

    AppStorage internal s;

    error NotAdmin(address);
    error ExistingAuthor(address);
    error MissingAuthorInfo(address);
    error GltrMinimumTooLow(uint256);
    error GltrBelowMinimum(uint256);

    constructor() {
        s.gltrMinimum = 50_000_000;
    }

    

    function submitStoryPart(
        string calldata _authorName, 
        string calldata _authorContact, 
        string calldata _note, 
        string calldata _storyPart, 
        uint256 _gltrAmount
    ) external {
        if(s.authors[msg.sender].disregardedVotingPower != 0) {
            revert ExistingAuthor(msg.sender);
        }
        if(stringIsEmpty(_authorName) || stringIsEmpty(_authorContact)) {
            revert MissingAuthorInfo(msg.sender);
        }
        if(_gltrAmount < s.gltrMinimum) {
            revert GltrBelowMinimum(_gltrAmount);
        }
        uint256 storyId = s.storyParts.length;        
        s.storyParts.push(
            StoryPart({
                authorAddress: msg.sender,
                authorName: _authorContact,
                note: _note,
                storyPart: _storyPart,
                gltrAmount: _gltrAmount,
                vote: 0
            })
        );



    }

    function setGltrMinimum(uint256 _newGltrMinimum) external {
        if(msg.sender != s.admin) {
            revert NotAdmin(msg.sender);
        }
        if(_newGltrMinimum < 10_000) {
            revert GltrMinimumTooLow(_newGltrMinimum);
        }
    }
    function getGltrMinimum() external returns(uint256) {
        return s.gltrMinimum;
    }

    function stringIsEmpty(string calldata _string) internal returns (bool) {
        return 0 == bytes(_string).length;
    }

    


    // bytes32 constant AAVEGOTCHI_CHAIN_STORY_ADMIN_STORAGE_POSITION = keccak256("aavegotchi-chain-story.admin");

    // struct Admin {
    //     address owner;
    // }

    // function adminStorage() internal pure returns (Admin adminStoragePosition) {
    //     bytes32 position = AAVEGOTCHI_CHAIN_STORY_ADMIN_STORAGE_POSITION;
    //     assembly {
    //         adminStoragePosition.slot := position
    //     }
    // }


	// State Variables
	// address public immutable owner;
	// string public greeting = "Building Unstoppable Apps!!!";
	// bool public premium = false;
	// uint256 public totalCounter = 0;
	// mapping(address => uint) public userGreetingCounter;

	// // Events: a way to emit log statements from smart contract that can be listened to by external parties
	// event GreetingChange(
	// 	address indexed greetingSetter,
	// 	string newGreeting,
	// 	bool premium,
	// 	uint256 value
	// );

	// // Constructor: Called once on contract deployment
	// // Check packages/hardhat/deploy/00_deploy_your_contract.ts
	// constructor(address _owner) {
	// 	owner = _owner;
	// }

	// // Modifier: used to define a set of rules that must be met before or after a function is executed
	// // Check the withdraw() function
	// modifier isOwner() {
	// 	// msg.sender: predefined variable that represents address of the account that called the current function
	// 	require(msg.sender == owner, "Not the Owner");
	// 	_;
	// }

	// /**
	//  * Function that allows anyone to change the state variable "greeting" of the contract and increase the counters
	//  *
	//  * @param _newGreeting (string memory) - new greeting to save on the contract
	//  */
	// function setGreeting(string memory _newGreeting) public payable {
	// 	// Print data to the hardhat chain console. Remove when deploying to a live network.
	// 	console.log(
	// 		"Setting new greeting '%s' from %s",
	// 		_newGreeting,
	// 		msg.sender
	// 	);

	// 	// Change state variables
	// 	greeting = _newGreeting;
	// 	totalCounter += 1;
	// 	userGreetingCounter[msg.sender] += 1;

	// 	// msg.value: built-in global variable that represents the amount of ether sent with the transaction
	// 	if (msg.value > 0) {
	// 		premium = true;
	// 	} else {
	// 		premium = false;
	// 	}

	// 	// emit: keyword used to trigger an event
	// 	emit GreetingChange(msg.sender, _newGreeting, msg.value > 0, msg.value);
	// }

	// /**
	//  * Function that allows the owner to withdraw all the Ether in the contract
	//  * The function can only be called by the owner of the contract as defined by the isOwner modifier
	//  */
	// function withdraw() public isOwner {
	// 	(bool success, ) = owner.call{ value: address(this).balance }("");
	// 	require(success, "Failed to send Ether");
	// }

	// /**
	//  * Function that allows the contract to receive ETH
	//  */
	// receive() external payable {}
}
