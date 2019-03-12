$("#subnetAmount").on("change", function(){
    testValidity();
})


VLSM = {};
function testValidity() {
    console.log("Change")
    let subnets = document.getElementById("subnets").childElementCount;
    while (subnets.firstChild) {
        subnets.removeChild(subnets.firstChild);
    }
    console.log()
    if (!Number.isInteger(Number.parseInt(document.getElementById('subnetAmount').value))) {
        alert("Input is not a valid integer");
        return;
    } else {
        $("#subnets").empty();
        $("#ipTable").empty();
        $("#ipTable").append(`        <colgroup>
        <col style="width: 69px">
        <col style="width: 162px">
        <col style="width: 286px">
        </colgroup>
            <tr>
            <th class="tg-0lax">ID</th>
            <th class="tg-0lax">Host Range</th>
            <th class="tg-0lax">Broadcast</th>
            <th class="tg-0lax">/Subnet</th>
            </tr>`)
        VLSM = {};
        VLSM.size = Number.parseInt(document.getElementById('subnetAmount').value)
        createSubnetCreator(VLSM.size);
    
    }

}
// nearest power of 2
function createSubnetCreator(num) {
    let subnetContainer = $("#subnets");
    for (let i = 0; i < num; i++) {
        subnetContainer.append(`
        <label>Subnet #${(i + 1)}: Number of Hosts on Subnet</label> <input id="sn${(i + 1)}"></input><br>
        
        `)
    }
    subnetContainer.append(`<label>IP of your network ex (192.168.10.0) </label> <input id="networkIP"></input><br>`);
    subnetContainer.append("<button id='submitSubnetSizes'>Submit Subnet Sizes</button>")
    $("#submitSubnetSizes").click(validateSubnetSizes)
}
function validateSubnetSizes() {
    invalid = false;
    for (let i = 0; i < VLSM.size; i++) {
        let curSubnet = $("#sn" + (i+1)).val()
        if (Number.parseInt(curSubnet, 10) <= 0 || curSubnet.length == 0 || Math.pow(2, Math.ceil(Math.log(Number.parseInt(curSubnet, 10))/Math.log(2))) > 256) {
            $("#sn" + (i+1)).css("background-color", "#ff8484");
            invalid = true;
        } else {
            VLSM[i] = Math.pow(2, Math.ceil(Math.log(Number.parseInt(curSubnet, 10))/Math.log(2)));
            $("#sn" + (i+1)).css("background-color", "#8aff83");
    };
        }
        if (!validateIP($("#networkIP").val())) {
            $("#networkIP").css("background-color", "#ff8484");
            invalid = true;
        } else {
            $("#networkIP").css("background-color", "#8aff83");
        }
        if (invalid) {alert("You have something invalid to fix")} else {
            VLSM.ip = $("#networkIP").val();
            createNetworkTable()
            $("#ipTable").fadeIn();
        }
}

function createNetworkTable() {
    
    let idSplit = VLSM.ip.split(".");
    idSplit.pop();
    
    let temp = []
    for (let i = 0; i < VLSM.size; i++) {
        temp.push(VLSM[i]);
    }
    temp.sort(function(a, b){return b - a});
    var curID = 0;
    for (let i = 0; i < temp.length; i++) {
        let hostPortion = Math.log(temp[i]) / Math.log(2)
        let networkPortion = 8 - hostPortion;
        let sn = 24 + networkPortion;
        let snBinary = "";
        for (let j = 0;j < networkPortion; j++) {
            snBinary += 1;
        }
        for (let j = 0; j < hostPortion; j++) {
            snBinary += 0;
        }
        console.log(snBinary)
        snBinary = Number.parseInt(snBinary, 2);
        $("#ipTable").append(`            <tr>
        <td class="tg-0lax">${idSplit.join(".") + "." + curID}</td>
        <td class="tg-0lax">${idSplit.join(".") + "." + (curID + 1)} - ${idSplit.join(".") + "." +(curID + temp[i] - 2)}</td>
        <td class="tg-0lax">${idSplit.join(".") + "." +(curID + temp[i] - 1)}</td>
        <th class="tg-0lax">/${sn} or 255.255.255.${snBinary} </th>
        </tr>`)
        curID += temp[i];
    }

}

function Map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};
function validateIP(ipAdd) {
    let reg = /^([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ipAdd);
}