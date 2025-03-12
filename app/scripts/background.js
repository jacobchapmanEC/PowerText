"use strict";

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension Installed:", details.reason);

  if (details.reason === "install") {
    chrome.runtime.openOptionsPage();
  }

  if (details.reason === "update") {
    processVersionUpgrade(details.previousVersion);
  }
});

chrome.notifications.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

function processVersionUpgrade(oldVersion) {
  console.log("Upgrading from version:", oldVersion);
}
