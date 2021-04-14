const {app,BrowserWindow,ipcMain} = require("electron");
const Discord = require("discord.js");
const electron = require("electron");
var discordclient = new Discord.Client();

let tokenwindow,mainwindow;

function createTokenWindow(){
    tokenwindow = new BrowserWindow({
        width:600,
        height:400,
        center:true,
        title:"token window",
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        }
    });
    tokenwindow.loadFile('src/tokenwindow.html');
    tokenwindow.webContents.openDevTools();
    tokenwindow.setMenuBarVisibility(false);
    tokenwindow.setResizable(false);
    tokenwindow.on("closed",()=>{
        tokenwindow=null;
    });
}

function createMainWindow(){
    mainwindow = new BrowserWindow({
        width:1000,
        height:750,
        title:"Main window",
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        }
    });
    mainwindow.loadFile("src/mainwindow.html");
    mainwindow.webContents.openDevTools();
    mainwindow.setMenuBarVisibility(false);
    //mainwindow.setResizable(false);
    mainwindow.on("closed",()=>{
        mainwindow=null;
    });
    mainwindow.once("ready-to-show",()=>{
        const guilds=discordclient.guilds.cache.map(guild => guild);
        mainwindow.webContents.send("mainwindow-ready",
            discordclient.user.tag);
        mainwindow.webContents.send("guilds-get-iconurl",
            discordclient.guilds.cache.map(guild => guild.iconURL()),
            discordclient.guilds.cache.map(guild => guild.id));
        const category_channels = guilds[0].channels.cache.filter(channel => channel.type==="category");
        const text_channels = guilds[0].channels.cache.filter(channel => channel.type==="text");
        const voice_channels = guilds[0].channels.cache.filter(channel => channel.type==="voice");
        mainwindow.webContents.send("get-channels",
            category_channels.map(channel => channel.id),
            category_channels.map(channel => channel.name),
            text_channels.map(channel => channel.id),
            text_channels.map(channel => channel.name),
            voice_channels.map(channel => channel.id),
            voice_channels.map(channel => channel.name));
    });
}

app.on("ready",()=>{
    createTokenWindow();
});

app.on("window-all-closed",()=>{
    discordclient.destroy();
    app.quit();
});


discordclient.on('ready',()=>{
    createMainWindow();
    tokenwindow.close();
});


ipcMain.on("discordlogin",async (event,arg)=>{
    const loginpromise = discordclient.login(arg);
    loginpromise.then(null,(err)=>{
        electron.dialog.showMessageBox(mainwindow,{
            type:'error',
            title:'An error ocurred',
            message:'An error occurred with bot login.\n(Error: '+err.message+')\n',
            buttons:['Disconnect','Continue'],
        },(response=>{
            if(response===0){
                createTokenWindow();
                mainwindow.close();
            }
        }));
    });
});
