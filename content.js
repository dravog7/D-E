function digest(key,callback) 
//converts ArrayBuffer of any size to 256 bit by hashing SHA256
//generates the cryptoKey object using the 256 bit hashed
//calls the callback that contains the calls to AES encrypt/decrypt
{
    crypto.subtle.digest(
        {
        "name":"SHA-256"
        },
        key).then((hashed)=>
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
                ).then(callback);
            });
}

let targetc=null;
let keys="";

document.addEventListener("mousedown", function(event)
//stores which element was clicked last time
{
    //right click
    if(event.button == 2) { 
        targetc=event.target;
        targetc.val=(a=0)=>{
            //gmail uses editable div, as a fix uses this function
            if(a)
            {
                if(targetc.tagName=="DIV")
                    targetc.innerText=a;
                else
                    targetc.value=a;
            }
            else
            {
                if(targetc.tagName=="DIV")
                    return targetc.innerText;
                else
                    return targetc.value;
            }
        };
    }
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
//recieve the msg from main.js telling whether to encrypt/decrypt 
{
    if(request.id=="encrypt")
    {
        keys=prompt("Enter password:");//TODO: make it an htm prompt with input type password
        if(keys=="") //if password input step was cancelled
            return;
        keys=new TextEncoder().encode(keys).buffer; //convert text to ArrayBuffer
        digest(keys,(key)=>
            {
                crypto.subtle.encrypt(
                    {
                        name:"AES-GCM",
                        iv: new Uint8Array([1,2,3,4,5,6,7,8,9,0,11,12]) //SHOUlD be random. but cant be
                    },
                    key,
                    new TextEncoder().encode(targetc.val()).buffer //get data from editable as ArrayBuffer
                ).then((encoded)=>
                {
                    targetc.val(btoa(new Uint8Array(encoded).toString()));//convert the result to array and to base64
                })
            })
    }
    if(request.id=="decrypt")
    {
        keys=prompt("Enter password:");
        if(keys=="")
            return;
        keys=new TextEncoder().encode(keys).buffer;
        digest(keys,(key)=>
            {
                crypto.subtle.decrypt(
                    {
                        name:"AES-GCM",
                        iv: new Uint8Array([1,2,3,4,5,6,7,8,9,0,11,12])
                    },
                    key,
                    new Uint8Array(atob(targetc.val()).split(",").map(Number)) //decode base64, convert to unt8Array
                ).then((encoded)=>
                {
                    targetc.val(new TextDecoder().decode(encoded)); //decode the output
                })
            })
    }
});