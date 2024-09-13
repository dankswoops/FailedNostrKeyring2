import { finalizeEvent } from 'nostr-tools/pure'
import { nip04 } from 'nostr-tools'

console.log('Nostr Key Signer: Background script starting');

const PUBKEY = '7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e';
const SECKEY = '67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa';

async function signEvent(event) {
  console.log('Nostr Key Signer: signEvent called with', event);
  
  try {
    if (!event) throw new Error('Event object is undefined');

    // Ensure required fields are present
    event.kind = event.kind || 1;
    event.created_at = event.created_at || Math.floor(Date.now() / 1000);
    event.tags = event.tags || [];
    event.content = event.content || '';
    event.pubkey = PUBKEY;

    // Use finalizeEvent from nostr-tools/pure
    const finalizedEvent = finalizeEvent(event, SECKEY);

    console.log('Nostr Key Signer: Event signed', finalizedEvent);
    return finalizedEvent;
  } catch (error) {
    console.error('Nostr Key Signer: Error in signEvent function', error);
    throw error;
  }
}

async function encryptMessage(recipientPubkey, message) {
  console.log('Nostr Key Signer: encryptMessage called');
  try {
    const encryptedMessage = await nip04.encrypt(SECKEY, recipientPubkey, message);
    console.log('Nostr Key Signer: Message encrypted');
    return encryptedMessage;
  } catch (error) {
    console.error('Nostr Key Signer: Error in encryptMessage function', error);
    throw error;
  }
}

async function decryptMessage(senderPubkey, encryptedMessage) {
  console.log('Nostr Key Signer: decryptMessage called');
  try {
    const decryptedMessage = await nip04.decrypt(SECKEY, senderPubkey, encryptedMessage);
    console.log('Nostr Key Signer: Message decrypted');
    return decryptedMessage;
  } catch (error) {
    console.error('Nostr Key Signer: Error in decryptMessage function', error);
    throw error;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Nostr Key Signer: Received message', message);

  if (message.type === 'getPublicKey') {
    console.log('Nostr Key Signer: Returning public key', PUBKEY);
    sendResponse(PUBKEY);
    return true;
  } else if (message.type === 'signEvent') {
    console.log('Nostr Key Signer: Signing event', message.event);
    signEvent(message.event).then(signedEvent => {
      console.log('Nostr Key Signer: Event signed successfully', signedEvent);
      sendResponse(signedEvent);
    }).catch(error => {
      console.error('Nostr Key Signer: Error signing event', error);
      sendResponse({ error: error.message });
    });
    return true;
  } else if (message.type === 'encryptMessage') {
    console.log('Nostr Key Signer: Encrypting message');
    encryptMessage(message.recipientPubkey, message.content).then(encryptedMessage => {
      console.log('Nostr Key Signer: Message encrypted successfully');
      sendResponse(encryptedMessage);
    }).catch(error => {
      console.error('Nostr Key Signer: Error encrypting message', error);
      sendResponse({ error: error.message });
    });
    return true;
  } else if (message.type === 'decryptMessage') {
    console.log('Nostr Key Signer: Decrypting message');
    decryptMessage(message.senderPubkey, message.encryptedContent).then(decryptedMessage => {
      console.log('Nostr Key Signer: Message decrypted successfully');
      sendResponse(decryptedMessage);
    }).catch(error => {
      console.error('Nostr Key Signer: Error decrypting message', error);
      sendResponse({ error: error.message });
    });
    return true;
  }
});

console.log('Nostr Key Signer: Background script loaded');