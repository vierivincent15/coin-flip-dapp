$(document).ready(async function() {
    if (typeof web3 !== 'undefined') {
        await ethereum.enable();
        var sc_address = contractAddress_inp;
        var contractABI = web3.eth.contract(contractABI_inp);
        var contractInstance = contractABI.at(sc_address);

        function updateInfo() {
            $("p#change-alert").hide();
            contractInstance.getCreator(function(error, result){
                if (error) {
                    alert("Please, connect to the network");
                } else {
                    $("td#creator").text(result);
                }
            });
        
            contractInstance.getBetter(function(error, result){
                if (error) {
                    alert("Please, connect to the network");
                } else {
                    $("td#better").text(result);
                }
            });
        
            contractInstance.getAmount(function(error, result){
                if (error) {
                    alert("Please, connect to the network");
                } else {
                    $("td#amount").text(web3.fromWei(result, "ether"));
                }
            });

            contractInstance.getBalance(function(error, result){
                if (error) {
                    alert("Please, connect to the network");
                } else {
                    $("td#balance").text(web3.fromWei(result, "ether"));
                }
            });
        };

        updateInfo();

        $("button#call_createBet").click(function(){
            var commitment = $("input#commitment").val();
            $("input#commitment").val('');
            var creator_value = $("input#creator_value").val();
            $("input#creator_value").val('');
            contractInstance.createBet(commitment, {value:web3.toWei(creator_value), from:web3.eth.accounts[0]}, function(error, result){
                if (error) {
                    alert("Creating Bet Error! Certain requirements not met");
                } else {
                    $("p#change-alert").show();
                }
            })
        });

        $("button#call_reveal").click(function(){
            var nonce = $("input#nonce").val();
            $("input#nonce").val('');
            contractInstance.reveal(nonce, {from:web3.eth.accounts[0]}, function(error, result){
                if (error) {
                    alert("Reveal Error! Certain requirements not met");
                } else {
                    $("p#change-alert").show();
                    console.log(result)
                }
            });
        });

        $("button#call_cancel").click(function(){
            contractInstance.cancel({from:web3.eth.accounts[0]}, function(error, result){
                if (error) {
                    alert("Cancel Error! Certain requirements not met");
                } else {
                    $("p#change-alert").show();
                }
            });
        });

        $("button#call_takeBet").click(function(){
            var better_value = $("input#better_value").val();
            $("input#better_value").val('');
            contractInstance.takeBet({value:web3.toWei(better_value, "ether"), from:web3.eth.accounts[0]}, function(error, result){
                if (error) {
                    alert("Taking Bet Error! Certain requirements not met");
                } else {
                    $("p#change-alert").show();
                }
            });
        });
        
        $("button#call_claimTimeout").click(function(){
            contractInstance.claimTimeout({from:web3.eth.accounts[0]}, function(error, result){
                if (error) {
                    alert("Claim Timeout Error! Certain requirements not met");
                } else {
                    $("p#change-alert").show();
                }
            });
        });
        
        $("button#call_withdraw").click(function(){
            contractInstance.withdraw({from:web3.eth.accounts[0]}, function(error, result){
                if (error) {
                    alert("Withdraw Error! Certain requirements not met");
                } else {
                    $("p#change-alert").show();
                }
            });
        });

        $("button#refresh_info").click(function(){
            updateInfo();
        });
    }
    else {
        alert("Please, install Metamask!");
    }
});
