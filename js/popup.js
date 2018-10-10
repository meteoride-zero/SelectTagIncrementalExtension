$("#rebind").click(function () {
    var query = {
        active: true,
        windowId: chrome.windows.WINDOW_ID_CURRENT
    };
    chrome.tabs.query(query, function (tabs) {
        var currentTab = tabs.shift();
        var message = {};
        chrome.tabs.sendMessage(currentTab.id, message, function () { });
    });
});