import { Event, finalizeEvent } from 'nostr-tools'
import { nip04, nip44 } from 'nostr-tools'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'

console.log('Nostr Key Signer: Background script starting');

const PUBKEY: string = '7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e';
const SECKEY: string = '67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa';

async function signEvent(event: Partial<Event>): Promise<Event> {
  console.log('Nostr Key Signer: signEvent called with', event);
  
  try {
    if (!event) throw new Error('Event object is undefined');

    // Ensure required fields are present
    const completeEvent: Event = {
      kind: event.kind || 1,
      created_at: event.created_at || Math.floor(Date.now() / 1000),
      tags: event.tags || [],
      content: event.content || '',
      pubkey: PUBKEY,
      id: '',
      sig: ''
    };

    // Use finalizeEvent from nostr-tools
    const finalizedEvent = finalizeEvent(completeEvent, hexToBytes(SECKEY));

    console.log('Nostr Key Signer: Event signed', finalizedEvent);
    return finalizedEvent;
  } catch (error) {
    console.error('Nostr Key Signer: Error in signEvent function', error);
    throw error;
  }
}

async function encryptMessageNip04(recipientPubkey: string, message: string): Promise<string> {
  console.log('Nostr Key Signer: encryptMessageNip04 called');
  try {
    const encryptedMessage = await nip04.encrypt(SECKEY, recipientPubkey, message);
    console.log('Nostr Key Signer: Message encrypted (NIP-04)');
    return encryptedMessage;
  } catch (error) {
    console.error('Nostr Key Signer: Error in encryptMessageNip04 function', error);
    throw error;
  }
}

async function decryptMessageNip04(senderPubkey: string, encryptedMessage: string): Promise<string> {
  console.log('Nostr Key Signer: decryptMessageNip04 called');
  try {
    const decryptedMessage = await nip04.decrypt(SECKEY, senderPubkey, encryptedMessage);
    console.log('Nostr Key Signer: Message decrypted (NIP-04)');
    return decryptedMessage;
  } catch (error) {
    console.error('Nostr Key Signer: Error in decryptMessageNip04 function', error);
    throw error;
  }
}

async function encryptMessageNip44(recipientPubkey: string, message: string): Promise<string> {
  console.log('Nostr Key Signer: encryptMessageNip44 called');
  try {
    const conversationKey = nip44.v2.utils.getConversationKey(hexToBytes(SECKEY), recipientPubkey);
    const encryptedMessage = nip44.v2.encrypt(message, conversationKey);
    console.log('Nostr Key Signer: Message encrypted (NIP-44)');
    return encryptedMessage;
  } catch (error) {
    console.error('Nostr Key Signer: Error in encryptMessageNip44 function', error);
    throw error;
  }
}

async function decryptMessageNip44(senderPubkey: string, encryptedMessage: string): Promise<string> {
  console.log('Nostr Key Signer: decryptMessageNip44 called');
  try {
    const conversationKey = nip44.v2.utils.getConversationKey(hexToBytes(SECKEY), senderPubkey);
    const decryptedMessage = nip44.v2.decrypt(encryptedMessage, conversationKey);
    console.log('Nostr Key Signer: Message decrypted (NIP-44)');
    return decryptedMessage;
  } catch (error) {
    console.error('Nostr Key Signer: Error in decryptMessageNip44 function', error);
    throw error;
  }
}

interface Message {
  type: string;
  event?: Partial<Event>;
  recipientPubkey?: string;
  content?: string;
  senderPubkey?: string;
  encryptedContent?: string;
}

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  console.log('Nostr Key Signer: Received message', message);

  if (message.type === 'getPublicKey') {
    console.log('Nostr Key Signer: Returning public key', PUBKEY);
    sendResponse(PUBKEY);
    return true;
  } else if (message.type === 'signEvent' && message.event) {
    console.log('Nostr Key Signer: Signing event', message.event);
    signEvent(message.event).then(signedEvent => {
      console.log('Nostr Key Signer: Event signed successfully', signedEvent);
      sendResponse(signedEvent);
    }).catch(error => {
      console.error('Nostr Key Signer: Error signing event', error);
      sendResponse({ error: error.message });
    });
    return true;
  } else if (message.type === 'encryptMessageNip04' && message.recipientPubkey && message.content) {
    console.log('Nostr Key Signer: Encrypting message (NIP-04)');
    encryptMessageNip04(message.recipientPubkey, message.content).then(encryptedMessage => {
      console.log('Nostr Key Signer: Message encrypted successfully (NIP-04)');
      sendResponse(encryptedMessage);
    }).catch(error => {
      console.error('Nostr Key Signer: Error encrypting message (NIP-04)', error);
      sendResponse({ error: error.message });
    });
    return true;
  } else if (message.type === 'decryptMessageNip04' && message.senderPubkey && message.encryptedContent) {
    console.log('Nostr Key Signer: Decrypting message (NIP-04)');
    decryptMessageNip04(message.senderPubkey, message.encryptedContent).then(decryptedMessage => {
      console.log('Nostr Key Signer: Message decrypted successfully (NIP-04)');
      sendResponse(decryptedMessage);
    }).catch(error => {
      console.error('Nostr Key Signer: Error decrypting message (NIP-04)', error);
      sendResponse({ error: error.message });
    });
    return true;
  } else if (message.type === 'encryptMessageNip44' && message.recipientPubkey && message.content) {
    console.log('Nostr Key Signer: Encrypting message (NIP-44)');
    encryptMessageNip44(message.recipientPubkey, message.content).then(encryptedMessage => {
      console.log('Nostr Key Signer: Message encrypted successfully (NIP-44)');
      sendResponse(encryptedMessage);
    }).catch(error => {
      console.error('Nostr Key Signer: Error encrypting message (NIP-44)', error);
      sendResponse({ error: error.message });
    });
    return true;
  } else if (message.type === 'decryptMessageNip44' && message.senderPubkey && message.encryptedContent) {
    console.log('Nostr Key Signer: Decrypting message (NIP-44)');
    decryptMessageNip44(message.senderPubkey, message.encryptedContent).then(decryptedMessage => {
      console.log('Nostr Key Signer: Message decrypted successfully (NIP-44)');
      sendResponse(decryptedMessage);
    }).catch(error => {
      console.error('Nostr Key Signer: Error decrypting message (NIP-44)', error);
      sendResponse({ error: error.message });
    });
    return true;
  }
});

console.log('Nostr Key Signer: Background script loaded');