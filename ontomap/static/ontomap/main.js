
(function() {
  $('#title').on("click",function(){
    editar($(this));
  }).on("mouseover",function(){
    addIcon();
  }).on('mouseout',function(){
    $('#icone').remove();
  });
  
})();

function editar() {    
  var div = $("#title");
  var texto = div.html();
  $('#icone').remove();
  div.attr("contenteditable","true");    
  div.off('click');
  div.off('mouseover');
  // div.after("<a id='fechar' href='#'>Salvar</a>");
  div.after("<button id='salvar' type='submit' style='position: absolute;' class='btn btn-success'>Save</button>");
  div.after("<button id='cancel' type='submit' style='position: absolute; margin-left:60px;' class='btn btn-default'>Cancel</button>");
  $("#salvar").click(function () {
    div.attr("contenteditable","false");
    div.on("click",editar);
    div.on("mouseover",addIcon);
    $("#cancel").remove();
    $(this).remove();
  });
  $("#cancel").click(function () {
    div.attr("contenteditable","false");
    div.on("click",editar);
    div.on("mouseover",addIcon);
    div.html(texto);
    $("#salvar").remove();
    $('#icone').remove();
    $(this).remove();
  });
};

function addIcon(){
  var div = $("#title");
  div.append("<small><i style='margin-left:5px;' id='icone' class='fa fa-pencil'></i></small>")
};

function removeIcone(){
  var div = $("#title");
  div.append("<i class='fa fa-pencil'></i>)")
};