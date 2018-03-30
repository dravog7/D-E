//make context menu items encrypt,decrypt
//define encrypt(key,text) and decrypt(key,text) webCrypto API

//define encryptAES
function encryptAES(opt,tab)
{
    chrome.tabs.sendMessage(tab.id,{"id":"encrypt"},(reply)=>{
        return;
    });
}

function decryptAES(opt,tab)
{
    chrome.tabs.sendMessage(tab.id,{"id":"decrypt"},(reply)=>{
        return;
    });
}
encrypt={
    "title":"encrypt!",
    "onclick":encryptAES,
    "contexts":["editable"]
    };
decrypt={
    "title":"decrypt!",
    "onclick":decryptAES,
    "contexts":["editable"]
    };

//make menu items
chrome.contextMenus.create(encrypt);
chrome.contextMenus.create(decrypt);
