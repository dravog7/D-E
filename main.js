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
    "contexts":["editable"] //TODO: add support for selection contexts
    };

//make menu items
chrome.contextMenus.create(encrypt);//for encryption
chrome.contextMenus.create(decrypt);//for decryption
