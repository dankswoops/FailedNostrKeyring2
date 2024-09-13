console.log("Nostr Key Signer: Content script starting");const t=()=>{const r=document.createElement("script");r.textContent=`
    (function() {
      console.log('Nostr Key Signer: Injecting window.nostr object');
      window.nostr = {
        getPublicKey: () => {
          console.log('Nostr Key Signer: getPublicKey called');
          return new Promise((resolve, reject) => {
            window.postMessage({ type: 'NOSTR_GET_PUBLIC_KEY' }, '*');
            window.addEventListener('message', function listener(event) {
              if (event.data.type === 'NOSTR_PUBLIC_KEY_RESPONSE') {
                window.removeEventListener('message', listener);
                if (event.data.error) {
                  console.error('Nostr Key Signer: Error getting public key', event.data.error);
                  reject(new Error(event.data.error));
                } else {
                  console.log('Nostr Key Signer: Public key received', event.data.publicKey);
                  resolve(event.data.publicKey);
                }
              }
            });
          });
        },
        signEvent: (event) => {
          console.log('Nostr Key Signer: signEvent called', event);
          return new Promise((resolve, reject) => {
            window.postMessage({ type: 'NOSTR_SIGN_EVENT', event }, '*');
            window.addEventListener('message', function listener(event) {
              if (event.data.type === 'NOSTR_SIGNED_EVENT_RESPONSE') {
                window.removeEventListener('message', listener);
                if (event.data.error) {
                  console.error('Nostr Key Signer: Error signing event', event.data.error);
                  reject(new Error(event.data.error));
                } else {
                  console.log('Nostr Key Signer: Event signed', event.data.signedEvent);
                  resolve(event.data.signedEvent);
                }
              }
            });
          });
        },
        nip04: {
          encrypt: (recipientPubkey, plaintext) => {
            console.log('Nostr Key Signer: nip04.encrypt called');
            return new Promise((resolve, reject) => {
              window.postMessage({ type: 'NOSTR_ENCRYPT_MESSAGE_NIP04', recipientPubkey, plaintext }, '*');
              window.addEventListener('message', function listener(event) {
                if (event.data.type === 'NOSTR_ENCRYPTED_MESSAGE_RESPONSE_NIP04') {
                  window.removeEventListener('message', listener);
                  if (event.data.error) {
                    console.error('Nostr Key Signer: Error encrypting message (NIP-04)', event.data.error);
                    reject(new Error(event.data.error));
                  } else {
                    console.log('Nostr Key Signer: Message encrypted (NIP-04)', event.data.encryptedMessage);
                    resolve(event.data.encryptedMessage);
                  }
                }
              });
            });
          },
          decrypt: (senderPubkey, ciphertext) => {
            console.log('Nostr Key Signer: nip04.decrypt called');
            return new Promise((resolve, reject) => {
              window.postMessage({ type: 'NOSTR_DECRYPT_MESSAGE_NIP04', senderPubkey, ciphertext }, '*');
              window.addEventListener('message', function listener(event) {
                if (event.data.type === 'NOSTR_DECRYPTED_MESSAGE_RESPONSE_NIP04') {
                  window.removeEventListener('message', listener);
                  if (event.data.error) {
                    console.error('Nostr Key Signer: Error decrypting message (NIP-04)', event.data.error);
                    reject(new Error(event.data.error));
                  } else {
                    console.log('Nostr Key Signer: Message decrypted (NIP-04)', event.data.decryptedMessage);
                    resolve(event.data.decryptedMessage);
                  }
                }
              });
            });
          }
        },
        nip44: {
          encrypt: (recipientPubkey, plaintext) => {
            console.log('Nostr Key Signer: nip44.encrypt called');
            return new Promise((resolve, reject) => {
              window.postMessage({ type: 'NOSTR_ENCRYPT_MESSAGE_NIP44', recipientPubkey, plaintext }, '*');
              window.addEventListener('message', function listener(event) {
                if (event.data.type === 'NOSTR_ENCRYPTED_MESSAGE_RESPONSE_NIP44') {
                  window.removeEventListener('message', listener);
                  if (event.data.error) {
                    console.error('Nostr Key Signer: Error encrypting message (NIP-44)', event.data.error);
                    reject(new Error(event.data.error));
                  } else {
                    console.log('Nostr Key Signer: Message encrypted (NIP-44)', event.data.encryptedMessage);
                    resolve(event.data.encryptedMessage);
                  }
                }
              });
            });
          },
          decrypt: (senderPubkey, ciphertext) => {
            console.log('Nostr Key Signer: nip44.decrypt called');
            return new Promise((resolve, reject) => {
              window.postMessage({ type: 'NOSTR_DECRYPT_MESSAGE_NIP44', senderPubkey, ciphertext }, '*');
              window.addEventListener('message', function listener(event) {
                if (event.data.type === 'NOSTR_DECRYPTED_MESSAGE_RESPONSE_NIP44') {
                  window.removeEventListener('message', listener);
                  if (event.data.error) {
                    console.error('Nostr Key Signer: Error decrypting message (NIP-44)', event.data.error);
                    reject(new Error(event.data.error));
                  } else {
                    console.log('Nostr Key Signer: Message decrypted (NIP-44)', event.data.decryptedMessage);
                    resolve(event.data.decryptedMessage);
                  }
                }
              });
            });
          }
        }
      };
      console.log('Nostr Key Signer: window.nostr object injected');
      window.dispatchEvent(new Event('nostr:ready'));
    })();
  `,(document.head||document.documentElement).appendChild(r),console.log("Nostr Key Signer: Script injected into the page")};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",t):t();window.addEventListener("message",async r=>{if(r.source===window){if(r.data.type==="NOSTR_GET_PUBLIC_KEY"){console.log("Nostr Key Signer: Received request for public key");try{const e=await chrome.runtime.sendMessage({type:"getPublicKey"});console.log("Nostr Key Signer: Public key received from background",e),window.postMessage({type:"NOSTR_PUBLIC_KEY_RESPONSE",publicKey:e},"*")}catch(e){console.error("Nostr Key Signer: Error getting public key from background",e),window.postMessage({type:"NOSTR_PUBLIC_KEY_RESPONSE",error:e.message},"*")}}else if(r.data.type==="NOSTR_SIGN_EVENT"){console.log("Nostr Key Signer: Received request to sign event",r.data.event);try{const e=await chrome.runtime.sendMessage({type:"signEvent",event:r.data.event});console.log("Nostr Key Signer: Event signed by background",e),window.postMessage({type:"NOSTR_SIGNED_EVENT_RESPONSE",signedEvent:e},"*")}catch(e){console.error("Nostr Key Signer: Error signing event in background",e),window.postMessage({type:"NOSTR_SIGNED_EVENT_RESPONSE",error:e.message},"*")}}else if(r.data.type==="NOSTR_ENCRYPT_MESSAGE_NIP04"){console.log("Nostr Key Signer: Received request to encrypt message (NIP-04)");try{const e=await chrome.runtime.sendMessage({type:"encryptMessageNip04",recipientPubkey:r.data.recipientPubkey,content:r.data.plaintext});console.log("Nostr Key Signer: Message encrypted by background (NIP-04)",e),window.postMessage({type:"NOSTR_ENCRYPTED_MESSAGE_RESPONSE_NIP04",encryptedMessage:e},"*")}catch(e){console.error("Nostr Key Signer: Error encrypting message in background (NIP-04)",e),window.postMessage({type:"NOSTR_ENCRYPTED_MESSAGE_RESPONSE_NIP04",error:e.message},"*")}}else if(r.data.type==="NOSTR_DECRYPT_MESSAGE_NIP04"){console.log("Nostr Key Signer: Received request to decrypt message (NIP-04)");try{const e=await chrome.runtime.sendMessage({type:"decryptMessageNip04",senderPubkey:r.data.senderPubkey,encryptedContent:r.data.ciphertext});console.log("Nostr Key Signer: Message decrypted by background (NIP-04)",e),window.postMessage({type:"NOSTR_DECRYPTED_MESSAGE_RESPONSE_NIP04",decryptedMessage:e},"*")}catch(e){console.error("Nostr Key Signer: Error decrypting message in background (NIP-04)",e),window.postMessage({type:"NOSTR_DECRYPTED_MESSAGE_RESPONSE_NIP04",error:e.message},"*")}}else if(r.data.type==="NOSTR_ENCRYPT_MESSAGE_NIP44"){console.log("Nostr Key Signer: Received request to encrypt message (NIP-44)");try{const e=await chrome.runtime.sendMessage({type:"encryptMessageNip44",recipientPubkey:r.data.recipientPubkey,content:r.data.plaintext});console.log("Nostr Key Signer: Message encrypted by background (NIP-44)",e),window.postMessage({type:"NOSTR_ENCRYPTED_MESSAGE_RESPONSE_NIP44",encryptedMessage:e},"*")}catch(e){console.error("Nostr Key Signer: Error encrypting message in background (NIP-44)",e),window.postMessage({type:"NOSTR_ENCRYPTED_MESSAGE_RESPONSE_NIP44",error:e.message},"*")}}else if(r.data.type==="NOSTR_DECRYPT_MESSAGE_NIP44"){console.log("Nostr Key Signer: Received request to decrypt message (NIP-44)");try{const e=await chrome.runtime.sendMessage({type:"decryptMessageNip44",senderPubkey:r.data.senderPubkey,encryptedContent:r.data.ciphertext});console.log("Nostr Key Signer: Message decrypted by background (NIP-44)",e),window.postMessage({type:"NOSTR_DECRYPTED_MESSAGE_RESPONSE_NIP44",decryptedMessage:e},"*")}catch(e){console.error("Nostr Key Signer: Error decrypting message in background (NIP-44)",e),window.postMessage({type:"NOSTR_DECRYPTED_MESSAGE_RESPONSE_NIP44",error:e.message},"*")}}}});console.log("Nostr Key Signer: Content script loaded");
