pragma solidity ^0.5.0;

import "./ERC721Mintable.sol";
import "./verifier.sol";

// define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {

}


// define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Mintable {

    SquareVerifier public _squareVerifier;

    // define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address to;
    }

    // define an array of the above struct
    Solution[] _solutions;

    // define a mapping to store unique solutions submitted
    mapping(bytes32 => bool) private _uniqueSolutions;

    // Create an event to emit when a solution is added
    event SolutionAdded(address to, uint256 index);

    constructor( address verifier) public {
        _squareVerifier = SquareVerifier(verifier);
    }

    // Create a function to add the solutions to the array and emit the event
    function addSolution(address to, uint256 index) internal {
        Solution memory solution = Solution({index : index, to : to});
        _solutions.push(solution);
        emit SolutionAdded(to, index);
    }

    // Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintToken(
        address to,
        uint256 tokenId,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) public {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input, to, tokenId));
        require(_uniqueSolutions[key] == false, "Solution has already been used!");
        require(_squareVerifier.verifyTx(a, b, c, input) == true, "Solution is not valid!");
        _uniqueSolutions[key] = true;
        addSolution(to, tokenId);
        super.mint(to, tokenId);
    }
}
