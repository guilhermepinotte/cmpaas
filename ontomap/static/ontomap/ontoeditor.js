CMPAAS = {};


// MUDAR ISSO AQUI
// var customEditor = document.createElement("select");

var elemento;
var label;


CMPAAS.editor = function() {
  var public = {};

  public.init = function() { 
    var $$ = go.GraphObject.make;  // for conciseness in defining templates
    var yellowgrad = $$(go.Brush, go.Brush.Linear, { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" });
    var radgrad = $$(go.Brush, go.Brush.Radial, { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" });

    myDiagram =
      $$(go.Diagram, "myDiagram",  // must name or refer to the DIV HTML element
        { 
          initialContentAlignment: go.Spot.Center,
          // have mouse wheel events zoom in and out instead of scroll up and down
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
          // enable Ctrl-Z to undo and Ctrl-Y to redo
          "undoManager.isEnabled": true,
          "clickCreatingTool.archetypeNodeData": { text: "new node" }
        });

    
    // define the Node template
    myDiagram.nodeTemplate =
      $$(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // define the node's outer shape, which will surround the TextBlock
        $$(go.Shape, "RoundedRectangle",
          // { fill: yellowgrad, stroke: "black",
          { fill: "lightgray", stroke: "black",
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" }),
        $$(go.TextBlock,
          { font: "bold 10pt helvetica, bold arial, sans-serif",
            margin: 4,
            editable: true },
          new go.Binding("text", "text").makeTwoWay())
      );

    myDiagram.nodeTemplate.selectionAdornmentTemplate =
      $$(go.Adornment, "Spot",
        $$(go.Panel, "Auto",
          $$(go.Shape, { fill: null, stroke: "blue", strokeWidth: 2 }),
          $$(go.Placeholder)
        ),
        // the button to create a "next" node, at the top-right corner
        $$("Button",
          { alignment: go.Spot.TopRight,
            click: addNodeAndLink },  // this function is defined below
          $$(go.Shape, "PlusLine", { desiredSize: new go.Size(6, 6) })
        ) // end button
      ); // end Adornment

    // clicking the button inserts a new node to the right of the selected node,
    // and adds a link to that new node

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
      $$(go.Link,  // the whole link panel
        { 
          curve: go.Link.Bezier,
          adjusting: go.Link.Stretch,
          reshapable: true 
          //, routing: go.Link.AvoidsNodes
          //, corner: 1
        },
        //new go.Binding("points").makeTwoWay(),
        new go.Binding("curviness", "curviness"),
        $$(go.Shape,  // the link shape
          { 
            isPanelMain: true,
            stroke: "black", 
            strokeWidth: 1.5
          }),
        $$(go.Shape,  // the arrowhead
          { 
            toArrow: "standard",
            stroke: null 
          }),
        $$(go.Panel, "Auto",
          $$(go.Shape,  // the arrowhead
            { fill: radgrad, stroke: null, }),
          $$(go.TextBlock, "new relation",  // the label
            { 
              textAlign: "center",
              editable: true,
              font: "10pt helvetica, arial, sans-serif",
              stroke: "black",
              margin: 4 
            },
            new go.Binding("text", "text").makeTwoWay())
          // {
          //   click: 
          //     function(e, obj) {
          //       var list = ["are", "equivalent to", "cannot be", "exact opposite of", "is composed of", "is a", "same as", "different from", "is an attribute of", "that is"];

          //       for (var i = 0; i < list.length; i++) {
          //         op = document.createElement("option");
          //         op.text = list[i];
          //         op.value = list[i];
          //         customEditor.add(op, null);
          //       }
          //       myDiagram.toolManager.textEditingTool.defaultTextEditor = customEditor;
          //       myDiagram.toolManager.textEditingTool.starting = go.TextEditingTool.SingleClick;

          //       customEditor.onActivate = function () {
          //         customEditor.value = customEditor.textEditingTool.textBlock.text;
          //         var loc = customEditor.textEditingTool.textBlock.getDocumentPoint(go.Spot.TopLeft);
          //         var pos = customEditor.textEditingTool.diagram.transformDocToView(loc);
          //         customEditor.style.left = pos.x + "px";
          //         customEditor.style.top = pos.y + "px";
          //       }
          //     },
          // }
        )
      );   
  
    

    //MELHRAR ISSO AQUI********************************************************************************************************
    // var customEditor = document.createElement("datalist");
    // customEditor.id = "lista";

    // var list = ["are", "equivalent to", "cannot be", "exact opposite of", "is composed of", "is a", "same as", "different from", "is an attribute of", "that is"];

    // for (var i = 0; i < list.length; i++) {
    //   op = document.createElement("option");
    //   // op.text = list[i];
    //   op.value = list[i];
    //   customEditor.appendChild(op);
    // }

    // var textBox = document.createElement("input");
    // textBox.type = "text";
    // textBox.id = "entrada";
    // textBox.name = "stereotype";
    
    // textBox.setAttribute("list","lista");
   
    // elemento = document.createElement("div");
    // elemento.setAttribute("id","teste")
    // elemento.appendChild(textBox);
    // elemento.appendChild(customEditor); 
    //**************************************************************************************************************************



    myDiagram.addDiagramListener("ObjectSingleClicked", function(e) {
      console.log("entrou no evento ObjectSingleClicked");

      var part = e.subject.part;

      //Se clicar no No
      if (!(part instanceof go.Link)) {
        myDiagram.toolManager.textEditingTool.defaultTextEditor = null;

      } else {


        var customEditor = document.createElement("datalist");
        customEditor.id = "lista";

        var list = ["are", "equivalent to", "cannot be", "exact opposite of", "is composed of", "is a", "same as", "different from", "is an attribute of", "that is"];

        for (var i = 0; i < list.length; i++) {
          op = document.createElement("option");
          // op.text = list[i];
          op.value = list[i];
          customEditor.appendChild(op);
        }

        var textBox = document.createElement("input");
        textBox.type = "text";
        textBox.id = "entrada";
        textBox.name = "stereotype";
        
        textBox.setAttribute("list","lista");
       
        elemento = document.createElement("div");
        elemento.setAttribute("id","teste")
        elemento.appendChild(textBox);
        elemento.appendChild(customEditor);




        // myDiagram.toolManager.textEditingTool.starting = go.TextEditingTool.SingleClick;
        myDiagram.toolManager.textEditingTool.defaultTextEditor = elemento;
        // elemento.value = elemento.textEditingTool.textBlock.text;

        elemento.oninput = function () {
          console.log("entrou no evento de oninput do elemento");
          elemento.value = elemento.textEditingTool.textBlock.text;
        }

        elemento.onActivate = function () {
          console.log("entrou no evento de onActivate");
          // label = elemento.textEditingTool.textBlock.text;
          elemento.value = elemento.textEditingTool.textBlock.text;


          // Do a few different things when a user presses a key
          // elemento.addEventListener("keydown", function(e) {

          //   console.log("entrou no evento de keydown");
            
          //   var keynum = e.which;
          //   var tool = elemento.textEditingTool; 
          //   if (tool === null) return;
          //   if (keynum == 13) { // Accept on Enter
          //     tool.acceptText(go.TextEditingTool.Enter);
          //     console.log("apertou enter");
          //     return;
          //   } else if (keynum == 9) { // Accept on Tab
          //     tool.acceptText(go.TextEditingTool.Tab);
          //     e.preventDefault();
          //     console.log("apertou tab");
          //     return false;
          //   } else if (keynum === 27) { // Cancel on Esc
          //     tool.doCancel();
          //     console.log("apertou esc");
          //     if (tool.diagram) tool.diagram.focus();
          //   }
          // }, false);
         
          // elemento.value = elemento.textEditingTool.textBlock.text;

          // elemento.value = label;


          // console.log(elemento.textEditingTool.textBlock.text);
          // elemento.value = elemento.textEditingTool.textBlock.text;

          //console.log(elemento);
          
          // elemento.textEditingTool.textBlock.text = "teste";
          //console.log(elemento.textEditingTool.textBlock.text);
          var loc = elemento.textEditingTool.textBlock.getDocumentPoint(go.Spot.TopLeft);
          var pos = elemento.textEditingTool.diagram.transformDocToView(loc);
          elemento.style.left = pos.x + "px";
          elemento.style.top = pos.y + "px";
        };

        textBox.oninput = function () {
          // console.log(elemento.textEditingTool.textBlock.text);
          // console.log("imprimiou: "+ textBox.value + "--------");
          console.log("entrou no evento de oninput");
          elemento.textEditingTool.textBlock.text = textBox.value;
          // alert(myDiagram.toolManager.textEditingTool.textBlock.text);
        };


      }
    });

    myDiagram.addDiagramListener("Modified", function(e) {
      console.log("entrou no evento Modified");

      var button = document.getElementById("saveButton");
      if (button) button.disabled = !myDiagram.isModified;
      var idx = document.title.indexOf("*");
      if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx); 
      }


      //retornar com o textblock que foi alterado no evento de click
      myDiagram.toolManager.textEditingTool.defaultTextEditor = null;
    });

    myDiagram.addDiagramListener("BackgroundSingleClicked", function(e) {
      console.log("entrou no evento BackgroundSingleClicked");
      myDiagram.toolManager.textEditingTool.defaultTextEditor = null;
    });

  };

  //salva o mapa 
  public.save = function(){
    var map = serialize();
    console.log(map);
    $.post('/editor/save/', map, function(dados){
      console.log(dados);
    });
  };

  //carrega o mapa 
  public.load = function(){
    $.get('/editor/load/', function(dados){
      myDiagram.model = go.Model.fromJson(dados);
    });
  };

  //exporta o mapa para OWL
  // public.exportToOwl = function(){
  //   var map = myDiagram.model.toJson();

  //   console.log(map);
  //   $.post('http://127.0.0.1:8080/ontomap/ontomap/service', map, function(dados){
  //     console.log(dados);
  //   });
  // };

  //exporta o mapa para OWL
  public.exportToOwl = function(){
    var map = myDiagram.model.toJson();
    console.log(map);
    $.ajax({
      type: "POST",
      url: "http://localhost:8080/ontomap/ontomap/service",
      // dataType:"JSON",
      data: map,
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      headers: {
        // Set any custom headers here.
        // If you set any non-simple headers, your server must include these
        // headers in the 'Access-Control-Allow-Headers' response header.
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
        "Accept" : "*",
        "Content-Type": "application/json; charset=utf-8"
      },

      success: 
        function(data) {
          console.log(data);
          // var titleMap = $("#title").text();
          saveTextAsFile(data, $("#title").text());
        },
      error: 
        function(jqXHR, textStatus, errorMessage) {
          console.log(errorMessage + " - " + textStatus); // Optional
        }
    });
    return false;
  };

  // ################## PRIVATE ##################

  // função que serializa o JSON: apenas retira a propriedade 'class' do objeto
  function serialize(){
    var obj = myDiagram.model.toJson();
    obj = obj.replace("\"class\": \"go.GraphLinksModel\",",""); //verificar se há necessidade de retirar essa parte
    return obj;
  }

  function addNodeAndLink(e, obj) {
    var adorn = obj.part;
    if (adorn === null) return;
    e.handled = true;
    var diagram = adorn.diagram;
    diagram.startTransaction("Add State");
    // get the node data for which the user clicked the button
    var fromNode = adorn.adornedPart;
    var fromData = fromNode.data;
    // create a new "State" data object, positioned off to the right of the adorned Node
    var toData = { text: "new node" };
    var p = fromNode.location;
    toData.loc = p.x + 200 + " " + p.y;  // the "loc" property is a string, not a Point object
    // add the new node data to the model
    var model = diagram.model;
    model.addNodeData(toData);
    // create a link data from the old node data to the new node data
    var linkdata = {};
    linkdata[model.linkFromKeyProperty] = model.getKeyForNodeData(fromData);
    linkdata[model.linkToKeyProperty] = model.getKeyForNodeData(toData);
    // and add the link data to the model
    model.addLinkData(linkdata);
    // select the new Node
    var newnode = diagram.findNodeForData(toData);
    diagram.select(newnode);
    diagram.commitTransaction("Add State");
  }

  function criaDataList() {
    var customEditor = document.createElement("datalist");
    customEditor.id = "lista";

    var list = ["are", "equivalent to", "cannot be", "exact opposite of", "is composed of", "is a", "same as", "different from", "is an attribute of", "that is"];

    for (var i = 0; i < list.length; i++) {
      op = document.createElement("option");
      // op.text = list[i];
      op.value = list[i];
      customEditor.appendChild(op);
    }

    // console.log(customEditor);

    var textBox = document.createElement("input");
    textBox.type = "text";
    textBox.id = "entrada";
    textBox.name = "stereotype";
    
    textBox.setAttribute("list","lista");
    // textBox.list = customEditor;

    console.log(textBox);

    var elemento = document.createElement("div");
    elemento.appendChild(textBox);
    elemento.appendChild(customEditor);
  }

  return public;
};

  function saveTextAsFile(data, title) {
    // var textFileAsBlob = new Blob([data], {type:'text/xml'}); 

    // var xmlDoc = new DOMParser().parseFromString(data, "application/xml");
    var parserXML = new XMLSerializer().serializeToString(data);
    // var results = new XMLSerializer().serializeToString(xmlDoc);
    console.log(parserXML);

    var textFileAsBlob = new Blob([parserXML]); 

    var downloadLink = document.createElement("a");
    downloadLink.download = title + ".owl";
    // downloadLink.innerHTML = "Download File";
    if (window.URL != null)
    {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    }
    else
    {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  }


(function() {
  var editor = CMPAAS.editor();
  editor.init();


  $('#saveButton').click(function(){
    editor.save();
  });

  $('#loadButton').click(function(){
    editor.load();
  });

  $('#exportButton').click(function(){
    editor.exportToOwl();
  });
    
})();