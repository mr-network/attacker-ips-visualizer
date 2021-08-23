const date = findGetParameter('date') ?? undefined;
if (date !== undefined) {
    document.getElementById('date').value = date;
    getData(date);
}
else {
    $.ajax({
        type: "get",
        url: `https://cdn.jsdelivr.net/gh/mr-network/attacker-ips-report/latest`,
    }).then(function (data) {
        getData(data.trim('\n'));
    }, function () {
        document.getElementById('status').innerText = "Failed";
    });
}

const perCountryCount = 10;
const perASCount = 10;

function getData(targetdate) {
    document.getElementById('date').value = targetdate;
    $.ajax({
        type: "get",
        url: `https://cdn.jsdelivr.net/gh/mr-network/attacker-ips-report/${targetdate}.json`,
        dataType: "json",
    }).then(function (data) {
        drawGraph(data);
    }, function () {
        document.getElementById('status').innerText = "Failed";
    });
}

function drawGraph(data) {
    document.getElementById('ipcount').innerText = data.TotalIPs;

    const countryPieLabels = Object.keys(data.PerCountry).slice(0, perCountryCount).concat('Other')
    const countryPieDatasTop10 = Object.values(data.PerCountry).slice(0, perCountryCount);
    const countryPieDatas = countryPieDatasTop10.concat(data.TotalIPs - sumarray(countryPieDatasTop10));

    var countryPieChart = new Chart(
        document.getElementById('countryPieChart'),
        {
            type: 'doughnut',
            data: {
                labels: countryPieLabels,
                datasets: [{
                    data: countryPieDatas,
                    hoverOffset: 4
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Blocked IPs per Country'
                    },
                }
            }
        }
    );

    const asPieLabel = Object.keys(data.PerAS).slice(0, perASCount).concat('Other');
    const asPieDatasTop10 = Object.values(data.PerAS).slice(0, perASCount);
    const asPieDatas = asPieDatasTop10.concat(data.TotalIPs - sumarray(asPieDatasTop10));

    var asPieChart = new Chart(
        document.getElementById('asPieChart'),
        {
            type: 'doughnut',
            data: {
                labels: asPieLabel,
                datasets: [{
                    data: asPieDatas,
                    hoverOffset: 4
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Blocked IPs per AS'
                    },
                }
            }
        }
    );
}

function sumarray(a) {
    return a.reduce(function (s, e) { return s + e; });
}

// https://stackoverflow.com/a/5448595
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}