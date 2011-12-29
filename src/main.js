var fakeFolder = {
        depths:{},
        prevDepths:{},
        xmlDoc:undefined,
        xmlLoaded:false,
        currentDepth:0,
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
                        fakeFolder.depths["depth"+depth] = new Array();;
                        depthArr = fakeFolder.depths["depth"+depth];
                    }
                    var items = new Array();
                    $(this).find("item").each(function(){
                        var o = $(this).attr("title");
                        items.push(o);
                    })
                    depthArr.push(items);
                })
                this.loadNextDepth();

        },

        loadPreviousDepth:function(){
              this.currentDepth-=2;
              if (this.currentDepth<0){
                  this.currentDepth = 0;
              }
              this.loadNextDepth(this.prevDepths[this.currentDepth]);
          },
        loadNextDepth:function(groupNumber){

              var depth = this.depths["depth"+this.currentDepth];
              console.log("loading depth "+depth);
              if (depth){
                  if (groupNumber==undefined)
                    groupNumber = Math.floor(Math.random()*depth.length);
                  var group = depth[groupNumber];
                  if (group){
                      this.clearTable();
                      this.prevDepths[this.currentDepth] =  groupNumber;
                      console.log($("#linkTable"));
                      $("#linkTable").delay(500).queue(function(){
                          console.log("creating depth "+this.currentDepth);
                          for each (o in group){
                              fakeFolder.appendTable(o, "javascript:fakeFolder.loadNextDepth()");
                              $("#linkTable").dequeue();
                          }
                      });
                      this.currentDepth++;
                  }
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