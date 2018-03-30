function digest(key,callback)
{
    crypto.subtle.digest({
        "name":"SHA-256"
    },key).then(callback);
}
let targetc=null;
let keys="";
document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) { 
        targetc=event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.id=="encrypt")
    {
        keys=prompt("Enter password:");
        keys=new TextEncoder().encode(keys).buffer;
        digest(keys,(hashed)=>
        {
            //make key for AES-GCM
            crypto.subtle.importKey(
                "raw",
                hashed,
                {
                    name:"AES-GCM"
                },
                false,
                ["encrypt","decrypt"]
            ).then((key)=>
            {
                crypto.subtle.encrypt(
                    {
                        name:"AES-GCM",
                        iv: new Uint8Array([1,2,3,4,5,6,7,8,9,0,11,12])
                    },
                    key,
                    new TextEncoder().encode(targetc.value).buffer
                ).then((encoded)=>
                {
                    targetc.value=btoa(new Uint8Array(encoded).toString());
                })
            })
        });
    }
    if(request.id=="decrypt")
    {
        keys=prompt("Enter password:");
        keys=new TextEncoder().encode(keys).buffer;
        digest(keys,(hashed)=>
        {
            //make key for AES-GCM
            crypto.subtle.importKey(
                "raw",
                hashed,
                {
                    name:"AES-GCM"
                },
                false,
                ["encrypt","decrypt"]
            ).then((key)=>
            {
                crypto.subtle.decrypt(
                    {
                        name:"AES-GCM",
                        iv: new Uint8Array([1,2,3,4,5,6,7,8,9,0,11,12])
                    },
                    key,
                    new Uint8Array(atob(targetc.value).split(",").map(Number))
                ).then((encoded)=>
                {
                    targetc.value=new TextDecoder().decode(encoded);
                })
            })
        });
    }
});