var fakeFolder = {
    depths:{},
    backStack:new Array(),
    xmlDoc:undefined,
    xmlLoaded:false,
    currentGroup:undefined,
    currentDepth:0,
    pathTree:{},
    importXML:function(xmlfile)
    {
        try
        {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", xmlfile, false);
        }
        catch (Exception)
        {
            var ie = (typeof window.ActiveXObject != 'undefined');

            if (ie)
            {
                this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                this.xmlDoc.async = false;
                while(this.xmlDoc.readyState != 4) {};
                this.xmlDoc.load(xmlfile);
                this.xmlloaded = true;
                this.parseXML();
            }
            else
            {
                this.xmlDoc = document.implementation.createDocument("", "", null);
                this.xmlDoc.onload = readXML;
                this.xmlDoc.load(xmlfile);
                this.xmlloaded = true;
                this.parseXML();
            }
        }

        if (this.xmlLoaded===false)
        {
            xmlhttp.setRequestHeader('Content-Type', 'text/xml')
            xmlhttp.send("");
            this.xmlDoc = xmlhttp.responseXML;
            this.xmlLoaded = true;
            this.parseXML();
        }
    },

    parseXML:function(){
        console.log($(this.xmlDoc).find("depth") )
        $(this.xmlDoc).find("children").each(function()
        {
            var depth = $(this).attr("depth");
            var depthArr = fakeFolder.depths["depth"+depth];
            if (depthArr==undefined){
                fakeFolder.depths["depth"+depth] = new Array();
                depthArr = fakeFolder.depths["depth"+depth];
            }
            var items = {arr:new Array(), viewed:false, parent:undefined, depth:depth}
            $(this).find("item").each(function(){
                var o ={title: $(this).attr("title"), child:undefined};
                items.arr.push(o);
            })
            depthArr.push(items);
        })
        this.loadNextDepth();

    },

    loadPreviousDepth:function(){
        if (this.currentGroup!=undefined && this.currentGroup.parent!=undefined){
            this.loadGroup(this.currentGroup.parent, 0, false);
        }
    },
    loadNextDepth:function(itemNumber){

        var depth = this.depths["depth"+this.currentDepth];
        var group;
        var done = false;
        var count = 0;
        var groupNumber;

        if (this.currentGroup!=undefined && itemNumber!=undefined && this.currentGroup.arr[itemNumber].child!=undefined){
            this.loadGroup(this.currentGroup.arr[itemNumber].child, false);
        }
        else{
            if (depth){
                groupNumber = Math.floor(Math.random()*depth.length);

                while (done===false){
                    group = depth[groupNumber]
                    if (group && group.viewed===false){
                        done = true;
                        break;
                    }
                    groupNumber++;
                    groupNumber = groupNumber%depth.length;
                    count++;
                    if (count===depth.length){
                        done = true;
                        this.currentDepth++;
                        this.loadNextDepth(itemNumber);
                        return;
                    }
                }
                this.loadGroup(group, itemNumber, true);
            }
        }


    },

    loadGroup:function(group, itemNumber, saveTree){
        var i=0;
        if (group){
            console.log("Loading group. Depth:"+group.depth);
            if (saveTree===true && this.currentGroup!=undefined){
                console.log("  Saving to tree")
                this.currentGroup.arr[itemNumber].child = group;
                group.parent = this.currentGroup;
            }

            this.currentGroup = group;
            this.currentDepth = group.depth;
            group.viewed = true;
            this.clearTable();
            console.log($("#linkTable"));
            $("#linkTable").delay(500).queue(function(){
                for each (o in group.arr){
                    fakeFolder.appendTable(o.title, "javascript:fakeFolder.loadNextDepth("+i+")");
                    i++;
                    $("#linkTable").dequeue();
                }
            });
        }

    },

    appendTable:function(title, url){
        var code = '<tr ><td><img src="assets/blank.gif"><img src="assets/folder.jpg" alt="[   ]"> <a href="'+url+'">'+title+'</a></td></tr>';
        $("#linkTable > tbody:last").append(code);;
    },

    clearTable:function(){
        $("#linkTable tr").remove().fadeOut(500);
    }

};