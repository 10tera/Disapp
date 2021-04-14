const ipcrender = require('electron').ipcRenderer;

$("#tokenform").on("submit",()=>{
    let token=$("#token");
   ipcrender.send("discordlogin",token.val());
});