$(document).ready(async function() {
    if (typeof web3 !== 'undefined') {
        await ethereum.enable();
        var sc_address = contractAddress_inp;
        var contractABI = web3.eth.contract(contractABI_inp);
        var contractInstance = contractABI.at(sc_address);

        $("p#change-alert").hide();

        contractInstance.getStart(function(error, result){
            if (error) {
                alert("Please, connect to the network");
            } else {
                var start = new Date(result.toNumber()*1000).toLocaleDateString();
                $("td#start_period").text(start);
            }
        });

        contractInstance.getEnd(function(error, result){
            if (error) {
                alert("Please, connect to the network");
            } else {
                var end = new Date(result.toNumber()*1000).toLocaleDateString();
                $("td#end_period").text(end);
            }
        });

        contractInstance.getTokenName(function(error, result){
            if (error) {
                alert("Please, connect to the network");
            } else {
                $("td#token_name").text(result);
            }
        });

        contractInstance.getTokenSymbol(function(error, result){
            if (error) {
                alert("Please, connect to the network");
            } else {
                $("td#token_symbol").text(result);
            }
        });

        contractInstance.getOwner(function(error, result){
            if (error) {
                alert("Please, connect to the network");
            } else {
                $("td#token_addr").text(result);
            }
        });

        contractInstance.getTotalSupply(function(error, result){
            if (error) {
                alert("Please, connect to the network");
            } else {
                $("td#total_supply").text(result);
            }
        });

        contractInstance.getTokenPrice(function(error, result){
            if (error) {
                alert("Please, connect to the network");
            } else {
                $("td#token_price").text(web3.fromWei(result, "ether"));
            }
        });

        contractInstance.getCurrBalance(function(error, result){
            if (error) {
                alert("Please, connect to the network");
            } else {
                $("td#curr_balance").text(result);
            }
        });

        contractInstance.getAccmFund(function(error, result){
            if (error) {
                alert("Please, connect to the network");
            } else {
                $("td#accm_fund").text(web3.fromWei(result, "ether"));
            }
        });

        function updateInfoCrowdsale() {
            $("p#change-alert").hide();
            contractInstance.getCurrBalance(function(error, result){
                if (error) {
                    alert("Please, connect to the network");
                } else {
                    $("td#curr_balance").text(result);
                }
            });

            contractInstance.getAccmFund(function(error, result){
                if (error) {
                    alert("Please, connect to the network");
                } else {
                    $("td#accm_fund").text(web3.fromWei(result, "ether"));
                }
            });
        };

        $("button#call_buyToken").click(function(){
            var token_amount = $("input#token_amount").val();
            $("input#token_amount").val('');
            var token_price = $("td#token_price").text();
            var payable = token_amount*token_price
            console.log(web3.eth.accounts[0])
            contractInstance.buyToken(token_amount, {value:web3.toWei(payable), from:web3.eth.accounts[0]}, function(error, result){
                if (error) {
                    alert("Purchasing Token Error! Certain requirements not met");
                } else {
                    $("p#change-alert").show();
                }
            })
        });

        $("button#refresh_info").click(function(){
            updateInfoCrowdsale();
        });
    }
    else {
        alert("Please, install Metamask!");
    }
});