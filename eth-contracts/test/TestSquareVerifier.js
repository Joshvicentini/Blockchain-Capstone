// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
let SquareVerifier = artifacts.require('SquareVerifier');
let Proof = require('../../zokrates/code/square/proof');

// Test verification with correct proof
// - use the contents from proof.json generated from zokrates steps

// Test verification with incorrect proof

contract('TestSquareVerifier', accounts => {

    const account_one = accounts[0];

    beforeEach(async function () {
        this.contract = await SquareVerifier.new({ from: account_one });
    });

    it('Test verification with correct proof', async function () {
        let result = await this.contract.verifyTx.call(
            Proof.proof.a,
            Proof.proof.b,
            Proof.proof.c,
            Proof.inputs,
            { from: account_one }
        );

        assert.equal(result, true, "Verification with correct proof failed!");
    })

    it('Test verification with incorrect proof', async function () {
        let result = await this.contract.verifyTx.call(
            Proof.proof.a,
            Proof.proof.b,
            Proof.proof.c,
            [10, 2],
            { from: account_one }
        );

        assert.equal(result, false, "Verification with incorrect proof failed!");
    })

});
