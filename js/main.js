var address = "https://yujinji.ml"


// cookie를 설정하는 setCookie 함수
function setCookie(cookie_name, value, mins) {
  var exdate = new Date();
  exdate.setDate(exdate.getMinutes() + mins);
  // 설정 일수만큼 현재시간에 만료값으로 지정 

  var cookie_value = escape(value) + ((mins == null) ? '' : '; expires=' + exdate.toUTCString());
  document.cookie = cookie_name + '=' + cookie_value;
}
// cookie를 가져오는 getCookie 함수
function getCookie(cookie_name) {
  var x, y;
  var val = document.cookie.split(';');

  for(var i = 0; i < val.length; i++) {
    x = val[i].substr(0, val[i].indexOf('='));
    y = val[i].substr(val[i].indexOf('=') +1);
    x = x.replace(/^\s+|\s+$/g, '');   // 앞과 뒤의 공백 제거하기
    if (x == cookie_name) {
      return unescape(y); // unescape로 디코딩 후 값 리턴
    }
  }
}
$(document).ready(() => {
  $("#login-btn").click(function() {
    // $(".form-container").css("display","inherit");
    $(".login-form-container").addClass("show");
  });
  $("#signup-btn").click(function() {
    $(".signup-form-container").addClass("show");
  });
  $("#login-close-btn").click(function() {
    $(".login-form-container").removeClass("show");
  });
  $("#signup-close-btn").click(function() {
    $(".signup-form-container").removeClass("show");
  });
  $("#go-signup").click(function() {
    $(".login-form-container").removeClass("show");
    $(".signup-form-container").addClass("show");
  });
  $("#go-login").click(function() {
    $(".signup-form-container").removeClass("show");
    $(".login-form-container").addClass("show");
  });
  // 'sign-up'라는 id를 가진 버튼 클릭 시 실행.
  $("#sign-up").click(function(){
    // json 형식으로 데이터 set
    var sendData = {
      username: $("#signup-id").val(),
      password: $("#signup-pw").val()
    }
    // ajax 통신
    $.ajax({
        type: "POST",            // HTTP method type(GET, POST) 형식이다.
        url: `${address}`+":5000/signup",      // 컨트롤러에서 대기중인 URL 주소이다.
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        data: JSON.stringify(sendData),            // Json 형식의 데이터이다.
        success: function(data){ // 비동기통신의 성공일경우 success콜백으로 들어옵니다. 'res'는 응답받은 데이터이다.
          jQuery("#message").html(JSON.stringify(data))
          $('.form-container').css("display","none");
        },
        error: function(data){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
          jQuery("#message").html(data.responseJSON.msg)
        }
    });
  });

  function toast(msg) {
    $('#toast').html(msg);
    $('#toast').addClass('show'); // toast 팝업 보이게 하기
    setTimeout(function() {
      $('#toast').removeClass('show');  // 일정 시간 지난 후 toast 팝업 사라지기
    }, 2200);
  }

  // 'sign-in'라는 id를 가진 버튼 클릭 시 실행.
  $("#login").click(function(){

    // json 형식으로 데이터 set
    var sendData = {
      username: $("#login-id").val(),
      password: $("#login-pw").val()
    }
        
    // ajax 통신
    $.ajax({
        type: "POST",            // HTTP method type(GET, POST) 형식이다.
        url: `${address}`+":5000/login",      // 컨트롤러에서 대기중인 URL 주소이다.
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        data: JSON.stringify(sendData),            // Json 형식의 데이터이다.
        success: function(data){ // 비동기통신의 성공일경우 success콜백으로 들어옵니다. 'res'는 응답받은 데이터이다.
          // jQuery("#message").html(JSON.stringify(data))
          // $('.form-container').css("display","none"); // 회원가입, 로그인 display=none;
          // 이 어플리케이션의 token
          setCookie('switch-app-token',data.token,'30');
          setCookie('switch-app-id',data.username,'30');
          $('.form-container').addClass('hidden');
          toast('로그인에 성공하였습니다!');
          setTimeout(function() {
            $(location).attr("href", "../html/mypage.html");
          }, 2200);
        },
        error: function(data){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
          jQuery("#message").html('📍'+data.responseJSON.msg)
        }
    });
  });

});