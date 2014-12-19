var fs = require('fs');
var http = require('http');

var server = http.createServer(function(request,response) {
  var path = request.url;
  console.log(path);
  var otherPath = request.url.slice(1);
  console.log(otherPath);
  var length = otherPath.length
  console.log(length);
  var fileType = otherPath.substring(length,length-3)
  // console.log(fileType);

  if(path === "/") {
    fs.readFile("index.html", function(err,data){
      var splashPage = data.toString();
      response.end(splashPage);
    })
  }else
    if(fileType === "jpg") {
      fs.readFile(otherPath,function(err,data) {
        // var image = data.toString();
        response.end(data);
      })
    }else
      if(fileType === "png") {
        fs.readFile(otherPath,function(err,data) {
          // var image = data.toString();
          response.end(data);
        })
    }else
    if(fileType === "css" ) {
      fs.readFile(otherPath,function(err,data) {
        var stylePage = data.toString();
        response.end(stylePage);
      })
  }else
    if(fileType === "txt") {
      var title =otherPath.substring(length-3,0);
      var titleFix = title.replace(/_/g, " ");
      var bookArray = [];
      var chapTitleIdArray = [];
      var chapterTitleArray = [];
      fs.readFile(otherPath, function(err, data) {
        var book= data.toString();
        var bookformat = book.split("\n");
        for (i=0; i<bookformat.length;i=i+2) {
          var currentLine = bookformat[i];
          var chapter = currentLine.charAt(0) + currentLine.charAt(1) + currentLine.charAt(2) + currentLine.charAt(3) + currentLine.charAt(4) + currentLine.charAt(5) + currentLine.charAt(6);
          var toCaps = chapter.toUpperCase();
          if (toCaps === "CHAPTER") {
            var lineArray = currentLine.split(" ");
            var test = lineArray[0] + " "+ lineArray[1];
            var str = test;
            chapterTitleArray.push(str);
            chapTitleIdArray.push("#"+str);
            var id = "</p><p class='chapters'><a id='chapter' name='" + str + "' href='#to the top'>";
            var newLine = id + currentLine;
            var index = bookformat.indexOf(currentLine);
            bookformat.splice(index,1,newLine);
          }
          bookformat.splice(i,0,"<br>")
        }

        var finalFormat = bookformat.join("");
        bookArray.push(finalFormat);
        fs.readFile("book.html", function(err,data){
          var str = data.toString();
          var indexArray = str.split("\n");
          indexArray.forEach(function(line){
            if(line === "TITLE") {
              var index = indexArray.indexOf(line);
              indexArray.splice(index,1,titleFix);
            }else
            if(line === "PLACECHAPTER") {
              var index = indexArray.indexOf(line);
              var strSideBar= "";
              for(j=0; j<chapterTitleArray.length; j++) {
                var link = "<a id='link' href='"+chapTitleIdArray[j]+ "'>"+chapterTitleArray[j]+"</a>";
                // console.log(link);
                strSideBar += link;
              }
              // console.log(strSideBar);
              indexArray.splice(index,1,strSideBar);
            }
            if (line === "REPLACEME") {
              var index = indexArray.indexOf(line);
              indexArray.splice(index, 1, bookArray[0])
            }
            var bookString = indexArray.join("\n");

            fs.writeFile("book2.html", bookString, function(err,data){

              fs.readFile("book2.html",function(err,data){
                var final = data.toString();
                response.end(final);
              })

            })
          })
        })
      })
    }
});
server.listen(2000);
