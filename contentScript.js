chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.message === "get-problem-details") {
        let a = document.getElementById('breadcrumb').children;
        const problemCode = a[0].children[2].href.substring(34);
        const problemName = a[0].children[2].innerHTML;
        console.log(problemCode, problemName);
        sendResponse({problemCode, problemName});
    }
});