const ipcrender = require("electron").ipcRenderer;
const guildicon_noimage="./js/img/guildicon.jpg";

//サーバーのアイコンクリック時イベント
function iconimg_clickEvent(){
    console.log(this.id);
}

function categorybutton_clickEvent(){
    console.log(this.textContent);
    obj=document.getElementById(this.id+"_span").style;
    obj.display=(obj.display=='none')?'block':'none';
}

//メインウィンドウready時イベント
ipcrender.on("mainwindow-ready",(event, bottag)=>{
    var element1=document.getElementById("botinfo");
    var element2=document.createElement("h2");
    element2.id="botname";
    element2.textContent=bottag;
    //element1.appendChild(element2);
});

ipcrender.on("get-channels",(event,category_ids,category_names,text_ids,text_names,voice_ids,voice_names)=>{
    var i=0;
    var element_br=document.createElement("br");
    var element_channels=document.getElementById("guild_channels");
    for(category of category_ids){
        var element_newcategory=document.createElement("p");
        element_newcategory.className="categorychannel";
        element_newcategory.id=category;
        element_newcategory.textContent=category_names[i];
        element_channels.appendChild(element_newcategory);
        const element_created=document.getElementById(category);
        element_created.addEventListener("click",categorybutton_clickEvent,false);
        const element_span=document.createElement("span");
        element_span.id=category+"_span";
        element_span.className="span1";
        element_channels.appendChild(element_span);
        const element=document.createElement("p");
        element.textContent="aaaaaa";
        element_span.appendChild(element);
        element_channels.appendChild(element_br);
        i++;
    }
});


//mainwindow起動時にサーバーアイコン表示
ipcrender.on("guilds-get-iconurl",(event,urls,ids)=>{
    var i=0;
    var element_br=document.createElement("br");
    for(iconurl of urls){
        var element_icon=document.getElementById("icons");
        if(iconurl!=null){
            var element_newicon=document.createElement("img");
            element_newicon.className="iconimg";
            element_newicon.src=iconurl;
            element_newicon.id=ids[i];
            element_icon.appendChild(element_newicon);
            var imgbtn=document.getElementById(ids[i]);
            imgbtn.addEventListener("click",iconimg_clickEvent,false);
        }
        else{
            var element_newicon=document.createElement("img");
            element_newicon.className="iconimg";
            element_newicon.src=guildicon_noimage;
            element_newicon.id=ids[i];
            element_icon.appendChild(element_newicon);
            var imgbtn=document.getElementById(ids[i]);
            imgbtn.addEventListener("click",iconimg_clickEvent,false);

        }
        element_icon.appendChild(element_br);
        i++;
    }
});
