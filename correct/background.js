const PUBKEY = '7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e';
const SECKEY = '67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa';





chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === 'getPublicKey') {
    sendResponse(PUBKEY);
    return true;
  } else if (message.type === 'signEvent') {
    signEvent(message.event).then(signedEvent => {
      sendResponse(signedEvent);
    }).catch(error => {
      sendResponse({ error: error.message });
    });
    return true;
  } else if (message.type === 'encryptMessageNip04') {
    encryptMessageNip04(message.recipientPubkey, message.content).then(encryptedMessage => {
      sendResponse(encryptedMessage);
    }).catch(error => {
      sendResponse({ error: error.message });
    });
    return true;
  } else if (message.type === 'decryptMessageNip04') {
    decryptMessageNip04(message.senderPubkey, message.encryptedContent).then(decryptedMessage => {
      sendResponse(decryptedMessage);
    }).catch(error => {
      sendResponse({ error: error.message });
    });
    return true;
  } else if (message.type === 'encryptMessageNip44') {
    encryptMessageNip44(message.recipientPubkey, message.content).then(encryptedMessage => {
      sendResponse(encryptedMessage);
    }).catch(error => {
      sendResponse({ error: error.message });
    });
    return true;
  } else if (message.type === 'decryptMessageNip44') {
    decryptMessageNip44(message.senderPubkey, message.encryptedContent).then(decryptedMessage => {
      sendResponse(decryptedMessage);
    }).catch(error => {
      sendResponse({ error: error.message });
    });
    return true;
  }
});
