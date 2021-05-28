var ERC721MintableComplete = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // mint multiple tokens
            await this.contract.mint(account_two, 1, { from: account_one });
            await this.contract.mint(account_three, 2, { from: account_one });
            await this.contract.mint(account_four, 3, { from: account_one });
        })

        it('should return total supply', async function () {
            let totalSupply = await this.contract.totalSupply.call();
            assert.equal(totalSupply.toNumber(), 3, 'Total supply is incorrect!');
        })

        it('should get token balance', async function () {
            let balance = await this.contract.balanceOf.call(account_two, { from: account_two })
            assert.equal(balance.toNumber(), 1, "Balance is incorrect!");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let tokenURI = await this.contract.tokenURI.call(1, { from: account_one });
            assert.equal(tokenURI, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1', "Token uri is incorrect");
        })

        it('should transfer token from one owner to another', async function () {
            let tokenId = 1;
            await this.contract.transferFrom(account_two, account_three, tokenId, { from: account_two });

            let newOwner = await this.contract.ownerOf.call(tokenId, {from: account_three});
            assert.equal(newOwner, account_three, "Transfer token failed!");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
            let success = true;
            try {
                await this.contract.mint(account_two, 4, { from: account_two });
            } catch (e) {
                success = false;
            }
            assert.equal(success, false, "Address is not contract owner");
        })

        it('should return contract owner', async function () {
            let owner = await this.contract.owner.call({ from: account_one });
            assert.equal(owner, account_one, "Invalid contract owner!");
        })

    });
})