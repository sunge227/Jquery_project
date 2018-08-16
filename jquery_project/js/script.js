$(function(){
	local = typeof(localStorage['page']) == "undefined" ? "" : localStorage['page'];

	if(local){
		$("#container").html(local);
	}	

	sort_ok();
	img_ok = true;
	color = "#ff0000";
	line_ok = false;
	pen_ok = false;
	$(".tour-wrap").eq(-2).hide();

	$(document).on("click",".btn-tour-add",function(){
		$(".tour-wrap").eq(-1).hide();
		$(".tour-wrap").eq(-2).show();
	});

	$(document).on("click",".last-form input",function(){
		if($(this).val() == "완료"){
			c_title = $(this).parent().parent().find(".form-control").val();

			if(c_title == ""){
				alert("관광지명을 입력해 주세요.");
				return false;
			}

			str = "";

			str +='<div class="tour-wrap">';
	        str +='    <div>';
	        str +='        <div class="w100">';
	        str +='            <span class="title tour-title">'+ c_title +'</span>';
	        str +='            <input type="button" value="X" id="t_del" class="btn btn-primary btn-delete">';
	        str +='        </div>';
	        str +='        <div class="w100">';
	        str +='            <input type="button" value="사진 이어보기" class="btn btn-tour-photoview" onclick="viewPhotoSlide();">';
	        str +='        </div>';
	        str +='        <div class="card_list" style="min-height:5px">';
	        str +='        </div>';
	        str +='        <input type="button" value="카드 추가" class="btn btn-primary btn-card-add" onclick="openPopupAddCard(this);">';
	        str +='    </div>';
	        str +='</div>';

	        $("#container").prepend(str);
			$(".tour-wrap").eq(0).hide().show('fade',1000,function(){
				save_local();
				sort_ok();
			});

		}

		$(this).parent().parent().find(".form-control").val('');
		$(".tour-wrap").eq(-2).hide();
		$(".tour-wrap").eq(-1).show();

	});

	$(document).on('click',"#image_area",function(){
		if(img_ok == true){
			$("#add_file").click();
		}
	});

	$(document).on("change","#add_file",function(e){
		if(img_ok == true){
			var file = e.target.files[0];
			upfile(file);
		}

	});

	document.body.ondragover=function(e){
		return false;
	}

	document.body.ondrop=function(e){

	if(img_ok == true){
		if(e.target.id == "image_area"){
			var file = e.dataTransfer.files[0];
			upfile(file);
		}
	}
		return false;
	}

	$(document).on("change","#sel_shape",function(){
		color = $(this).val();
	});

	$(document).on("click","#p_btn",function(){
		$("#line_size").val(parseInt($("#line_size").val())+1);
	});

	$(document).on("click","#m_btn",function(){
		if($("#line_size").val()==1){
			alert("선두께는 1px 이상이어야 합니다.");
			return false;
		}
		$("#line_size").val(parseInt($("#line_size").val())-1);
	});

	$(document).on("click","#brush",function(){
		if(img_ok == false){
			line_ok=true;
		}
	});

	$(document).on("mousedown","#can",function(e){
		if(line_ok == true){
			pen_ok = true;
			ctx.beginPath();
			ctx.lineWidth = $("#line_size").val();
			ctx.strokeStyle = color;
			ctx.moveTo(e.offsetX,e.offsetY);
		}
	});

	$(document).on("mousemove","#can",function(e){
		if(pen_ok == true){
			ctx.lineTo(e.offsetX,e.offsetY);
			ctx.stroke();
		}
	});

	$(document).on("mouseup mouseleave","#can",function(e){
		if(pen_ok == true){
			ctx.closePath();
			pen_ok = false;
		}
	});

	$(document).on("click",".card .btn-delete",function(){
		$(this).parent().parent().hide("fade",1000,function(){$(this).remove();save_local();});
	});

	$(document).on("click","#t_del",function(){
		$(this).parent().parent().parent().hide("fade",1000,function(){$(this).remove();save_local();});
	});


});

function sort_ok(){
	$(".card_list").sortable({
		connectWith:".card_list",
		cursor:'pointer',
		placeholder:"ui-state-highlight",
		revert:true,
		start: function(e,ui){ui.item.animate({backgroundColor:"rgba(0,255,255,.3);",borderRadius:"25px"},300)},
		stop: function(e,ui){ui.item.animate({backgroundColor:"rgba(255,255,255,1);",borderRadius:"5px"},300,function(){
			save_local();
		});},
	});

}

function save_local(){
	localStorage['page'] = $("#container").html();
}

function upfile(file){
	f_type = file.type;
	if(f_type != 'image/jpeg' && f_type != 'image/png' && f_type !='image/gif'){
		alert('JP(E)G, PNG, GIF 이미지 파일만 사용 가능합니다.');
		return false;
	}

	var fr = new FileReader();

	fr.readAsDataURL(file);

	fr.onload = function(e){
		img_data = e.target.result;

		var img = new Image();

		img.src = img_data;
		img.onload = function(){

			re = resize(img.width,img.height,500,300);
			re2 = resize(img.width,img.height,230,200);

			$("#image_area").css({"width":+re[0]+"px","height":+re[1]+"px","border":"none"});

			var add_div = "<canvas id='can' width='"+re[0]+"' height='"+re[1]+"' ></canvas>"
			$("#image_area").html(add_div);

			ctx = $('#can')[0].getContext("2d");

			ctx.drawImage(img,0,0,re[0],re[1]);

			img_ok = false;
		}

	}
}
function resize(w,h,ww,hh){
	var pw = w / ww;
	var ph = h / hh;
	if(pw > 1 || ph > 1){
		if(pw > ph){
			ph = ph / pw;
			pw = 1;

		}else {
			pw = pw/ ph;
			ph = 1;
		}
	}
	return [pw*ww,ph*hh];
}


function openPopupAddCard(th){
	var div = "<div title='카드 추가'>";

        div += "<div class='form-group'>";
            div += "<input type='text' class='form-control' placeholder='카드 제목' id='title'>";
        div += "</div>";

        div += "<div class='form-group'>";
            div += "<textarea class='form-control' placeholder='설명' rows='3' id='con'></textarea>";
        div += "</div>";

        div += "<div class='form-group'>";
            div += "<div id='image_area'>사진 영역</div>";
            div += "<input type='file' id='add_file' style='display:none'>";
        div += "</div>";

		div += "<div class='form-group'>";
			div += "<input type='button' value='브러시' class='btn active' id='brush'> &nbsp;&nbsp;&nbsp;";
			div += "<select id='sel_shape'>";
				div += "<option value='#ff0000'>RED</option>";
				div += "<option value='#00ff00'>GREEN</option>";
				div += "<option value='#0000ff'>BLUE</option>";
				div += "<option value='#ffff00'>YELLOW</option>";
				div += "<option value='#ff00f0'>PINK</option>";
				div += "<option value='#00fff0'>SKY BLUE</option>";
			div += "</select> &nbsp;&nbsp;&nbsp;";
			div += "<input type='text' size='3' value='1' readonly='readonly' id='line_size'> ";
			div += "<input type='button' value='+' class='btn' id='p_btn'> ";
			div += "<input type='button' value='-' class='btn' id='m_btn'> (px)";
		div += "</div>";

	div += "</div>";

    $(div).dialog({
      resizable: false,
      modal: true,
      width: 540,
      buttons: {
        "완료": function() {


          title = $("#title").val();
          con = $("#con").val();


          if(title == "" || con ==""){
          	alert("카드 제목과 내용을 입력해 주세요.");
          	return false;
          }

          img_data = $("canvas")[0].toDataURL();

          div = "";

          div += '<div class="card">';
          div += '      <div class="w100">';
          div += '      <span class="title">'+title+'</span>';
          div += '          <input type="button" value="X" class="btn btn-primary btn-delete">';
          div += '      </div>';
          div += '      <img src="'+img_data+'" width="'+re2[0]+'"height="'+re2[1]+'">';
          div += '      <p>';
          div += con;
          div += '      </p>';
          div += ' </div>';

		$( this ).remove();
          $(th).parent().find(".card_list").prepend(div).hide().show('fade',1000,function(){
          	save_local();
          });

          
			
          img_ok = true;
		  color = "#ff0000";
		  line_ok = false;
		  pen_ok = false;
        },
        "취소": function() {
          	$( this ).remove();

          	img_ok = true;
			color = "#ff0000";
			line_ok = false;
			pen_ok = false;
        }
      }
    });
}

function viewPhotoSlide(){
	var div = "<div id='photoViewBg'>";

		div += "<div id='photoViewImage'>";
			div += "<img src='images/1.jpg' alt='카드명' title='카드명'>";
		div += "</div>";

		div += "<select id='photoViewSel'>";
			div += "<option>Bounce</option>";
			div += "<option>Fade</option>";
			div += "<option>Flip</option>";
		div += "</select>";

		div += "<input type='button' value='X' class='btn btn-primary' id='close_btn'>";
		div += "<input type='button' value='<' class='' id='prev_btn'>";
		div += "<input type='button' value='>' class='' id='next_btn'>";

		div += "<ul id='photoViewPos'>";
			div += "<li class='active'></li>";
			div += "<li></li>";
			div += "<li></li>";
		div += "</ul>";

	div += "</div>";

	$("body").prepend($(div));

	$("#close_btn").on("click", function (){
		$("#photoViewBg").remove();
	});
}