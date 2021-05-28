let SquareVerifier = artifacts.require('SquareVerifier');
let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
let Proof = require('../../zokrates/code/square/proof');

// Test if a new solution can be added for contract - SolnSquareVerifier
// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

contract('TestSolnSquareVerifier', accounts => {
    const account_one = accounts[0]
    const account_two = accounts[1]

    beforeEach(async function () {
        const squareVerifier = await SquareVerifier.new({ from: account_one });
        this.contract = await SolnSquareVerifier.new(squareVerifier.address, {
            from: account_one
        });
    });

    it('Test if a new solution can be added for contract - SolnSquareVerifier', async function () {
        let result = await this.contract.mintToken(
            account_two,
            1,
            Proof.proof.a,
            Proof.proof.b,
            Proof.proof.c,
            Proof.inputs,
            { from: account_one }
        );

        assert.equal(result.logs[0].event, 'SolutionAdded', 'Solution not added!')
    })

    it('Test if an ERC721 token can be minted for contract - SolnSquareVerifier', async function () {
        let mint = true
        try {
            await this.contract.mintToken(
                account_two,
                1,
                Proof.proof.a,
                Proof.proof.b,
                Proof.proof.c,
                Proof.inputs,
                { from: account_one }
            );
        } catch (e) {
            mint = false
        }

        assert.equal(mint, true, "Token not minted!");
    })
});