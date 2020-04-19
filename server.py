import json
import os
from flask import Flask, render_template

from web3.auto import w3
from solc import compile_source

app = Flask(__name__)

### Coin Flip Contract ###
contract_source_code = None
contract_source_code_file = 'coin-flip.sol'

with open(contract_source_code_file, 'r') as file:
    contract_source_code = file.read()

contract_compiled = compile_source(contract_source_code)
cf_contract_interface = contract_compiled['<stdin>:CoinFlip']
CoinFlip = w3.eth.contract(abi=cf_contract_interface['abi'], 
                          bytecode=cf_contract_interface['bin'])

# w3.personal.unlockAccount(w3.eth.accounts[0], '') #  Not needed with Ganache
tx_hash = CoinFlip.constructor().transact({'from':w3.eth.accounts[0]})
tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)

# Contract Object
coin_flip = w3.eth.contract(address=tx_receipt.contractAddress, abi=cf_contract_interface['abi'])


### Crowdsale Contract ###
contract_source_code = None
contract_source_code_file = 'crowdsale.sol'

with open(contract_source_code_file, 'r') as file:
    contract_source_code = file.read()

contract_compiled = compile_source(contract_source_code, import_remappings=['='+os.getcwd()+"/", '-'])
cs_contract_interface = contract_compiled['<stdin>:Crowdsale']
Crowdsale = w3.eth.contract(abi=cs_contract_interface['abi'], 
                          bytecode=cs_contract_interface['bin'])

# w3.personal.unlockAccount(w3.eth.accounts[0], '') #  Not needed with Ganache
initialAmount, tokenName, decimalUnits, tokenSymbol = 1000, "CFToken", 0, "CFT"
tx_hash = Crowdsale.constructor(initialAmount, tokenName, decimalUnits, tokenSymbol).transact({'from':w3.eth.accounts[0]})
tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)

# Contract Object
crowd_sale = w3.eth.contract(address=tx_receipt.contractAddress, abi=cs_contract_interface['abi'])


# Web service initialization
@app.route('/')
def hello():
    return render_template("index.html", contractAddress = coin_flip.address.lower(), contractABI = json.dumps(cf_contract_interface['abi']))

@app.route('/crowdsale')
def crowdsale():
    return render_template("crowdsale.html", contractAddress = crowd_sale.address.lower(), contractABI = json.dumps(cs_contract_interface['abi']))
    
if __name__ == '__main__':
    app.run(debug=True)
