//SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IERC20} from "./interfaces/IERC20.sol";

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

    IERC20 constant GLTR_ERC20_TOKEN = IERC20(0x3801C3B3B5c98F88a9c9005966AA96aa440B9Afc);

    bytes32 constant AAVEGOTCHI_CHAIN_STORY_STORAGE_POSITION = keccak256("aavegotchi-chain-story.storage");

    struct StoryPart {
        address authorAddress;
        string authorName;
        string authorContact;
        string note;
        string storyPart;
        uint104 gltrAmount;  //uint104 is 13 bytes
        uint104 voteScore;
        uint24 storyPartId;
        uint16 round;
        bool published;
    }

    struct Author {
        uint104 disregardedVotingPower;
        bool published;
        uint24 publishedStoryPartId;
        uint24[] storyPartIds;
        mapping(uint256 round => bool) roundsVoted;
    }

    struct RoundsNoVoteWon {
        uint16 round;
        uint104 voteScore;
    }

    struct AppStorage {
        address admin;
        StoryPart[] storyParts;
        mapping(uint256 round => uint24[] submissions) roundSubmissions;
        RoundsNoVoteWon[] roundsNoVoteWon; // must have had submissions
        uint24[] publishedStoryParts;
        mapping(address author => Author) authors;
        uint16 totalAuthorsVoted;
        uint40 submissionStartTime;
        uint16 round;
        bool newSubmissionInRound;
        uint104 sharedVotingPower;
        uint24 winningSubmissionStoryPartId;        
        uint104 noSubmissionVoteScore;
        uint104 gltrMinimum;
    }

    AppStorage internal s;

    error NotAdmin(address);
    error ExistingAuthor(address);
    error MissingAuthorInfo(address);
    error GltrMinimumTooLow(uint256 _newGltrMinimum);
    error GltrBelowMinimum(uint256 _gltrAmount);
    error MissingStoryPart();
    error NotStorySubmissionTimePeriod(uint256 _currentTime);
    error MaximumSubmissionsReached();
    error NotVotingTimePeriod(uint256 _currentTime);
    error CantVoteOnSubmissionFromEarlierRound(address _voter, uint256 _storyPartId);
    error AlreadyVotedInRound(address _voter, uint256 _round);
    error NoPowerToVote(address _person);

    event StoryPartSubmission(uint256 indexed _round, uint256 indexed _storyPartId, address indexed _authorAddress);
    event StoryPartPublished(uint256 indexed _round, uint256 indexed _storyPartId, address indexed _authorAddress);
    event NoVoteRound(uint256 indexed _round, uint256 _voteScore);
    event SubmissionVote(address indexed _voter, uint256 indexed _round, uint256 indexed _storyPartId);

    constructor(
        string memory _authorName, 
        string memory _authorContact, 
        string memory _note, 
        string memory _storyPart, 
        uint256 _gltrAmount
    ) {
        if(stringIsEmpty(_authorName) || stringIsEmpty(_authorContact)) {
            revert MissingAuthorInfo(msg.sender);
        }
        s.gltrMinimum = 50_000_000e18;
        if(_gltrAmount < s.gltrMinimum) {
            revert GltrBelowMinimum(_gltrAmount);
        }
        if(stringIsEmpty(_storyPart)) {
            revert MissingStoryPart();
        }
        uint24 storyPartId = uint24(s.storyParts.length); 
        s.storyParts.push(
            StoryPart({
                authorAddress: msg.sender,
                authorName: _authorName,
                authorContact: _authorContact,
                note: _note,
                storyPart: _storyPart,
                gltrAmount: uint104(_gltrAmount),
                voteScore: 0,
                storyPartId: storyPartId,
                round: 0,
                published: true
            })
        );
        s.sharedVotingPower = uint104(_gltrAmount);
        s.publishedStoryParts.push(storyPartId);
        s.submissionStartTime = uint40(block.timestamp);
        s.round = 1;
        Author storage author = s.authors[msg.sender];        
        author.published = true;
        author.publishedStoryPartId = storyPartId;
        author.storyPartIds.push(storyPartId);
        s.winningSubmissionStoryPartId = type(uint24).max;

        emit StoryPartPublished(0, storyPartId, msg.sender);
    }
    // Time rules
    // 1. Seven days to submit story parts.
    // 2. If one or more stories are submitted during the seven day submission period a voting period starts.
    // 3. If no stories are sumitted during seven day submission period the seven day submission period restarts.
    // 4. Voting period lasts seven days unless all authors vote. After voting period ends seven day submission period begins.

    function canSubmitStoryPartWithinSevenDays() internal view returns(bool can_) {
        return block.timestamp < s.submissionStartTime + 7 days;
    }

    function canSubmitStoryPartAfterSevenDays() internal view returns(bool can_) {
        return block.timestamp > s.submissionStartTime + 7 days && s.newSubmissionInRound == false;
    }

    function canSubmitStoryPartAfterFourteenDays() internal view returns(bool can_) {
        return block.timestamp > s.submissionStartTime + 14;
    }

    function internalCanSubmitStoryPart() internal view returns(bool can_) {
        return canSubmitStoryPartWithinSevenDays() || canSubmitStoryPartAfterFourteenDays() || canSubmitStoryPartAfterSevenDays();

    }

    function getCurrentRound() internal view returns(uint256 round_) {
        round_ = s.round;
        if(canSubmitStoryPartAfterFourteenDays()) {
            if(s.newSubmissionInRound) {
                round_ += ((block.timestamp - (s.submissionStartTime + 14 days)) / 7 days) + 1;  
            }
            else {
                round_ += ((block.timestamp - (s.submissionStartTime + 7 days)) / 7 days) + 1;
            }
        }
        else if(canSubmitStoryPartAfterSevenDays()) {
            round_++;
        }
    }

    function getRoundSubmissionData() 
        internal view returns(
            uint256 round_, 
            uint256 submissionStartTime_) {
        round_ = s.round;
        submissionStartTime_ = s.submissionStartTime;        
        uint256 newRounds = 0;
        if(canSubmitStoryPartAfterFourteenDays()) {
            if(s.newSubmissionInRound) {
                newRounds = (block.timestamp - (submissionStartTime_ + 14 days)) / 7 days;
                round_ += newRounds;
                submissionStartTime_ = block.timestamp + (submissionStartTime_ + 14 days) + (newRounds * 7 days);
            }
            else {
                newRounds = (block.timestamp - (submissionStartTime_ + 7 days)) / 7 days;
                round_ += newRounds;
                submissionStartTime_ = block.timestamp + (submissionStartTime_ + 7 days) + (newRounds * 7 days);
            }
            round_++;
        }
        else if(canSubmitStoryPartAfterSevenDays()) {            
            submissionStartTime_ += 7 days;
            round_++;
        }        
    }

    function getRoundData() 
        external view returns(
            uint256 round_, 
            uint256 submissionStartTime_, 
            uint256 submissionEndTime_,
            uint256 voteStartTime_,
            uint256 voteEndTime_) {
        (round_, submissionStartTime_) = getRoundSubmissionData();        
        submissionEndTime_ = submissionStartTime_ + 7 days;
        if(s.newSubmissionInRound) {
            voteStartTime_ + submissionEndTime_;
            voteEndTime_ = voteStartTime_ + 7 days;
        }
    }  



    function canSubmitStoryPart() external view returns(bool can_) {
        can_ = internalCanSubmitStoryPart();
    }
    

    function submitStoryPart(
        string calldata _authorName, 
        string calldata _authorContact, 
        string calldata _note, 
        string calldata _storyPart, 
        uint256 _gltrAmount
    ) external {
        uint256 round;        
        if(canSubmitStoryPartWithinSevenDays()) {
            round = s.round;
        }
        else {
            uint256 submissionStartTime;
            (round, submissionStartTime) = getRoundSubmissionData();
            if(canSubmitStoryPartAfterFourteenDays()) {                
                if(s.newSubmissionInRound) {
                    s.totalAuthorsVoted = 0;
                    uint256 winningStoryPartId = s.winningSubmissionStoryPartId;
                    StoryPart storage winningStoryPart = s.storyParts[winningStoryPartId];
                    if(winningStoryPart.voteScore > s.noSubmissionVoteScore) {
                        winningStoryPart.published = true;
                        s.publishedStoryParts.push(uint24(winningStoryPartId));
                        Author storage winningAuthor = s.authors[winningStoryPart.authorAddress];
                        winningAuthor.published = true;
                        winningAuthor.publishedStoryPartId = uint24(winningStoryPartId);
                        winningAuthor.disregardedVotingPower = s.sharedVotingPower;
                        emit StoryPartPublished(s.round, winningStoryPartId, winningStoryPart.authorAddress);
                        uint256 numPublishedAuthors = s.publishedStoryParts.length;
                        s.sharedVotingPower += uint104(winningStoryPart.gltrAmount / numPublishedAuthors);
                    } else {
                        s.roundsNoVoteWon.push(RoundsNoVoteWon({round: s.round, voteScore: s.noSubmissionVoteScore}));
                        emit NoVoteRound(s.round, s.noSubmissionVoteScore);
                    }                    
                    s.noSubmissionVoteScore = 0;
                    s.winningSubmissionStoryPartId = type(uint24).max;
                }
            } else if(canSubmitStoryPartAfterSevenDays() == false) {
                revert NotStorySubmissionTimePeriod(block.timestamp);
            }            
            s.round = uint16(round);
            s.submissionStartTime = uint40(submissionStartTime);                 
        }
        Author storage author = s.authors[msg.sender];        
        if(author.published) {
            revert ExistingAuthor(msg.sender);
        }
        if(stringIsEmpty(_authorName) || stringIsEmpty(_authorContact)) {
            revert MissingAuthorInfo(msg.sender);
        }
        if(_gltrAmount < s.gltrMinimum) {
            revert GltrBelowMinimum(_gltrAmount);
        }
        if(stringIsEmpty(_storyPart)) {
            revert MissingStoryPart();
        }
        uint24 storyPartId = uint24(s.storyParts.length);
        if(storyPartId == type(uint24).max - 1) {  // 16777215 - 1
            revert MaximumSubmissionsReached();
        }
        s.storyParts.push(
            StoryPart({
                authorAddress: msg.sender,
                authorName: _authorName,
                authorContact: _authorContact,
                note: _note,
                storyPart: _storyPart,
                gltrAmount: uint104(_gltrAmount),
                voteScore: 0,
                storyPartId: storyPartId,
                round: uint16(round),
                published: false
            })
        );        
        s.roundSubmissions[round].push(uint24(storyPartId));        
        author.storyPartIds.push(uint24(storyPartId));
        s.newSubmissionInRound = true;
        GLTR_ERC20_TOKEN.transferFrom(msg.sender, address(this), _gltrAmount);
        emit StoryPartSubmission(round, storyPartId, msg.sender);
    }
     

    function storyPartVote(uint256 _storyPartId) external {
        if(internalCanSubmitStoryPart()) {
            revert NotVotingTimePeriod(block.timestamp);
        }
        uint256 round = s.round;
        Author storage author = s.authors[msg.sender];
        if(author.published == false) {
            revert NoPowerToVote(msg.sender);
        }
        uint256 votingPower = s.sharedVotingPower - author.disregardedVotingPower;
        if(author.roundsVoted[round]) {
            revert AlreadyVotedInRound(msg.sender, round);
        }
        uint256 totalAuthorsVoted = s.totalAuthorsVoted;
        if(totalAuthorsVoted == 0) {
            s.winningSubmissionStoryPartId = uint24(_storyPartId);
        }        
        if(_storyPartId != type(uint24).max) { // 16777215
            StoryPart storage storyPart = s.storyParts[_storyPartId];
            if(round != storyPart.round) {
                revert CantVoteOnSubmissionFromEarlierRound(msg.sender, _storyPartId);
            }
            uint256 voteScore = storyPart.voteScore + votingPower;
            storyPart.voteScore = uint104(voteScore);            
            uint256 winningSubmissionStoryPartId = s.winningSubmissionStoryPartId;
            if(_storyPartId != winningSubmissionStoryPartId) {                
                if(voteScore > s.storyParts[winningSubmissionStoryPartId].voteScore) {
                    s.winningSubmissionStoryPartId = uint24(_storyPartId);
                }
            }            
        }
        else {
            s.noSubmissionVoteScore += uint104(votingPower);
        }
        emit SubmissionVote(msg.sender, round, _storyPartId);
        uint256 numPublishedAuthors = s.publishedStoryParts.length;
        totalAuthorsVoted++;
        s.totalAuthorsVoted = uint16(totalAuthorsVoted);
        if(numPublishedAuthors == totalAuthorsVoted) {            
            s.submissionStartTime = uint40(block.timestamp);
            s.totalAuthorsVoted = 0; 
            s.newSubmissionInRound = false;
            uint256 winningStoryPartId = s.winningSubmissionStoryPartId;
            StoryPart storage winningStoryPart = s.storyParts[winningStoryPartId];
            if(winningStoryPart.voteScore > s.noSubmissionVoteScore) {
                winningStoryPart.published = true;
                s.publishedStoryParts.push(uint24(winningStoryPartId));
                Author storage winningAuthor = s.authors[winningStoryPart.authorAddress];
                winningAuthor.published = true;
                winningAuthor.publishedStoryPartId = uint24(winningStoryPartId);
                winningAuthor.disregardedVotingPower = s.sharedVotingPower;
                emit StoryPartPublished(s.round, winningStoryPartId, winningStoryPart.authorAddress);                
                s.sharedVotingPower += uint104(winningStoryPart.gltrAmount / (numPublishedAuthors + 1));
            }
            else {
                s.roundsNoVoteWon.push(RoundsNoVoteWon({round: s.round, voteScore: s.noSubmissionVoteScore}));
                emit NoVoteRound(s.round, s.noSubmissionVoteScore);
            }
            s.round++;
            s.noSubmissionVoteScore = 0;
            s.winningSubmissionStoryPartId = type(uint24).max;
        }
    }

    function updateRound() external {
        if(canSubmitStoryPartAfterFourteenDays() && s.newSubmissionInRound) {            
            (uint256 round, uint256 submissionStartTime) = getRoundSubmissionData();
            uint104 noSubmissionVoteScore = s.noSubmissionVoteScore;
            s.totalAuthorsVoted = 0;
            uint256 winningStoryPartId = s.winningSubmissionStoryPartId;
            StoryPart storage winningStoryPart = s.storyParts[winningStoryPartId];
            // If there were no voes this is false
            if(winningStoryPart.voteScore > noSubmissionVoteScore) { 
                winningStoryPart.published = true;
                s.publishedStoryParts.push(uint24(winningStoryPartId));
                Author storage winningAuthor = s.authors[winningStoryPart.authorAddress];
                winningAuthor.published = true;
                winningAuthor.publishedStoryPartId = uint24(winningStoryPartId);
                winningAuthor.disregardedVotingPower = s.sharedVotingPower;
                emit StoryPartPublished(s.round, winningStoryPartId, winningStoryPart.authorAddress);
                uint256 numPublishedAuthors = s.publishedStoryParts.length;
                s.sharedVotingPower += uint104(winningStoryPart.gltrAmount / numPublishedAuthors);
            } else {
                s.roundsNoVoteWon.push(RoundsNoVoteWon({round: s.round, voteScore: noSubmissionVoteScore}));
                emit NoVoteRound(s.round, noSubmissionVoteScore);
            }               
            s.noSubmissionVoteScore = 0;
            s.winningSubmissionStoryPartId = type(uint24).max;
            s.round = uint16(round);
            s.submissionStartTime = uint40(submissionStartTime);
            s.newSubmissionInRound = false;
        }            
    }
    

    function getRoundSubmissionStoryIds(uint256 _round) external view returns(uint24[] memory storyPartIds_) {            
        storyPartIds_ = s.roundSubmissions[_round];

    }

    function getLastSubmissionStoryIds() external view returns(uint24[] memory storyPartIds_) {        
        uint256 round = getCurrentRound();    
        storyPartIds_ = s.roundSubmissions[round];

    }

    function internalGetRoundSubmissions(uint256 _round) internal view returns(StoryPart[] memory storyParts_) {
        uint24[] memory submissions = s.roundSubmissions[_round];
        uint256 storyPartLength = submissions.length;
        bool reportWinningStoryPart = false;
        uint256 winningStoryPartId;
        if(canSubmitStoryPartAfterFourteenDays() && _round == s.round && s.newSubmissionInRound) {
            winningStoryPartId = s.winningSubmissionStoryPartId;
            StoryPart storage winningStoryPart = s.storyParts[winningStoryPartId];
             // If there were no voes this is false
            if(winningStoryPart.voteScore > s.noSubmissionVoteScore) { 
                reportWinningStoryPart = true;
            }
        }
        if(reportWinningStoryPart) {
            for(uint256 i; i < storyPartLength; i++) {
                storyParts_[i] = s.storyParts[submissions[i]];
                if(storyParts_[i].storyPartId == winningStoryPartId) {
                    storyParts_[i].published = true;
                }
            }
        }
        else {
            for(uint256 i; i < storyPartLength; i++) {
                storyParts_[i] = s.storyParts[submissions[i]];             
            }
        }                        
    }

    function getRoundSubmissions(uint256 _round) external view returns(StoryPart[] memory storyParts_) {
        storyParts_ = internalGetRoundSubmissions(_round);
    }

    function getLastSubmissions() external view returns(StoryPart[] memory storyParts_) {
        uint256 round = s.round;
        if(s.roundSubmissions[round].length == 0) {
            round--;
        }        
        storyParts_ = internalGetRoundSubmissions(round);        
    }

    function getPublishedStoryParts() external view returns(StoryPart[] memory storyParts_) {
        uint256 storyPartsLength = s.publishedStoryParts.length;
        bool addNewStoryPart = false;
        uint256 winningStoryPartId;
        if(canSubmitStoryPartAfterFourteenDays() && s.newSubmissionInRound) {
            winningStoryPartId = s.winningSubmissionStoryPartId;
            StoryPart storage winningStoryPart = s.storyParts[winningStoryPartId];
             // If there were no votes this is false
            if(winningStoryPart.voteScore > s.noSubmissionVoteScore) {                 
                addNewStoryPart = true;
            }
        }
        if(addNewStoryPart) {
            storyParts_ = new StoryPart[](storyPartsLength + 1);
        }
        else {
            storyParts_ = new StoryPart[](storyPartsLength);
        }        
        for(uint256 i; i < storyPartsLength - 1; i++) {
            storyParts_[i] = s.storyParts[s.publishedStoryParts[i]];
        }
        if(addNewStoryPart) {
            storyParts_[storyPartsLength] = s.storyParts[winningStoryPartId];
        }

    }


    function setGltrMinimum(uint256 _newGltrMinimum) external {
        if(msg.sender != s.admin) {
            revert NotAdmin(msg.sender);
        }
        if(_newGltrMinimum < 10_000) {
            revert GltrMinimumTooLow(_newGltrMinimum);
        }
        s.gltrMinimum = uint104(_newGltrMinimum);
    }
    function getGltrMinimum() external view returns(uint256) {
        return s.gltrMinimum;
    }

    function stringIsEmpty(string memory _string) internal pure returns (bool) {
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
