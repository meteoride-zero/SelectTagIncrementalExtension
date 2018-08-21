$(function () {
    chrome.tabs.getSelected(null, function(tab) {
        $('#title').text(tab);
        $('#url').text(tab.url);
    });
});