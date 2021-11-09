let submissionId = 0, token, result_code = "wait", time = 0.00, problemCode, problemName, id=1;
chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
    fetchProblemCode();
},
    { urls: ["https://www.codechef.com/submit/complete/*"] }
);
chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
    if (submissionId === 0) {
        submissionId = details.url.substring(47, 55);
        token = details.requestHeaders[2].value;
        fetchVerdict();
    }
},
    { urls: ["https://www.codechef.com/get_submission_status/*"] },
    ['requestHeaders']
);

const fetchProblemCode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs);
        if (tabs.length === 0) {
            problemCode = "UNKNOWN";
            problemName = "Last Problem Submitted"
        } else {
            chrome.tabs.sendMessage(tabs[0].id, { message: "get-problem-details" }, function (response) {
                console.log(response);
                problemCode = response.problemCode;
                problemName = response.problemName;
            });
        }
    });
}

const fetchVerdict = () => {

    var myVar = setInterval(() => {
        if (result_code === "wait") {
            try {
                axios.get(`https://www.codechef.com/get_submission_status/${submissionId}/`, {
                    headers: {
                        'x-csrf-token': token
                    }
                }).then((response) => {
                    result_code = response.data.result_code;
                    time = response.data.time;
                })
            } catch (error) {
                console.log(error);
            }
        } else {
            clearInterval(myVar);
            sendNotification();
            submissionId = 0;
            result_code = "wait";
        }
    }, 1000);
}

const sendNotification = () => {
    chrome.notifications.create(`test${id++}`, {
        type: 'basic',
        iconUrl: './icon_128.png',
        title: `Problem Code: ${problemCode}\nVerdict: ${result_code}`,
        message: `Name: ${problemName}\nTime: ${time}s`,
        priority: 1
    });
}

