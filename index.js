var json = {};
var start = 0;
var count = 100;
var totalItems = 0;

var parse = function(){
    console.log(start);
    if (start > totalItems){
        alert("?");
    }
    // alert(totalItems + "個のうち" + start+"番目から" + (start+count)+"番目まで");
    console.log(start + " " + count);
    document.getElementById('list').innerHTML = "<thead><tr><th>Count</th><th>Type</th><th>Published</th><th>Content</th></tr></thead> <tbody>";
    var c ="";
    var f = 0;
    if (start + count < totalItems){
        f = start + count;
    } else {
        f = totalItems;
    }
    for (var i = start; i < f; i++){
        console.log(i + "/" + totalItems);
        if (json.orderedItems[i].type === "Create") {
            c = json.orderedItems[i].object.content;
        } else {
            c = json.orderedItems[i].object;
        }
        document.getElementById('list').innerHTML += "<tr><td><a target=\"_blank\" href='"+json.orderedItems[i].object.id+ "'>" + i +"</a></td><td>"+json.orderedItems[i].type+"</td><td>"+ json.orderedItems[i].published + "</td><td>"+c +"</td></tr>";
    }
    document.getElementById('list').innerHTML += "</tbody>";
    update_selector();
    return 0;
};

var load_json = function() {
    // 選択されたファイル情報を取得
    var file = document.getElementById('files').files[0];

    // readerのresultプロパティに、データURLとしてエンコードされたファイルデータを格納
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function() {
        var result = decodeURIComponent(escape(atob(reader.result.replace(/data:application\/json;base64,/,''))));
        json = JSON.parse(result);
        totalItems = json.totalItems;
        console.log(json);

        document.getElementById('ButtonParse').classList.remove("pure-button-disabled");
        update_selector();
        parse();
    }
};

var update_selector = function () {
    console.log(start);
    var s,f;
    if (start < 5*count) {
        s = 0;
        f = s + 10*count;
    } else if(start >= totalItems - totalItems%count-5*count){
        s = totalItems - totalItems%count - 9*count;
        f = json.totalItems;
    } else {
        s = start-5*count;
        f = s + 10*count;
    }
    var innerHTML = "";
    innerHTML += "<button class=\"pure-button\" onclick='start=0;parse()'> ⇐ </button>";
    for (var i = s; i < f; i = i+count){
        if (i === start) {
            innerHTML += "<button class=\"pure-button pure-button-active\">" + i + "</button>";
        } else {
            innerHTML += "<button class=\"pure-button\" onclick='start="+i+";parse()'>"+ i +"</button>";
        }
    }
    innerHTML += "<button class=\"pure-button\" onclick='start="+(totalItems-totalItems%count)+";parse()'> ⇒ </button>";
    innerHTML += "<span><input id=\"jump\" type=\"number\" name=\"count\">に\n" +
        "        <button type=\"button\"  class=\"pure-button pure-button-primary\" onclick=\"start=parseInt(document.getElementById('jump').value);parse()\">ジャンプ</button></span>"
    document.getElementById('selector').innerHTML = innerHTML;
};