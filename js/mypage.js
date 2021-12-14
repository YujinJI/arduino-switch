// $(document).ready(() => {
//   document.write(getCookie('id'),'님!');
// })

var name = getCookie('switch-app-id');
var token = getCookie('switch-app-token');
var title = "<h1 class=\"h1\">Welcome, "+`${name}`+"</h1>";

var myDevicesInfo = "";
var sliderValue = "";
var switchTypeValue = "";

function toast(msg) {
  $('#toast').html(msg);
  $('#toast').addClass('show'); // toast 팝업 보이게 하기
  setTimeout(function() {
    $('#toast').removeClass('show');  // 일정 시간 지난 후 toast 팝업 사라지기
  }, 2200);
}

$("#my-title").append(title);

$(document).ready(() => {
  $("#devices").click(function() {
    var sendData = {username: name}
    $.ajax({
      type: "POST",
      url: `${address}`+":5000/devices",
      dataType: "json",
      data: JSON.stringify(sendData),
      contentType: 'application/json; charset=utf-8',
      headers: {
        "Authorization": "Bearer " + token
      },
      success: function(data) {
        $("#my-devices").empty();
        myDevicesInfo = data;
        var deviceNames = Object.keys(data);
        for (var i = 0; i < deviceNames.length; i++) {
          var deviceName = deviceNames[i];
          var deviceInfo = data[deviceName];
          // var myDevices = "<button id=\"device0"+`${i+1}`+">"+`${i+1} ${deviceName}`+"</button>";
          // var myDevices = "<button id=\"device0"+`${i+1}`+"\">"+`${deviceName}`+"</button>"
          var myDevices = "<div class=\"card-box\"><p class=\"device-id\">"+`${deviceName}`+"</p>";
          myDevices += "<p class=\"content\"><i class=\"fas fa-lightbulb\"></i>현재밝기: "+`${deviceInfo.cds}`+"</p>";
          myDevices += "<p class=\"content\"><i class=\"fas fa-user-circle\"></i>사용자: "+`${deviceInfo.occ}`+"</p>";
          if (deviceInfo.swi === 1) {
            myDevices += "<p class=\"content\"><i class=\"fas fa-toggle-on\"></i>스위치(켜짐): "+`${deviceInfo.swi}`+"</p>";  
          } else {
            myDevices += "<p class=\"content\"><i class=\"fas fa-toggle-off\"></i>스위치(꺼짐): "+`${deviceInfo.swi}`+"</p>";
          }
          myDevices += "<p class=\"content\"><i class=\"fas fa-tachometer-alt\"></i>기준값: "+`${deviceInfo.ths}`+"</p>";
          if (deviceInfo.typ === 1) {
            myDevices += "<p class=\"content\"><i class=\"fas fa-arrows-alt-h\"></i>양방향: "+`${deviceInfo.typ}`+"</p>";
          } else {
            myDevices += "<p class=\"content\"><i class=\"fas fa-long-arrow-alt-right\"></i>단방향: "+`${deviceInfo.typ}`+"</p>";
          }
          myDevices += "<button name=\""+`${deviceName}`+"\" class=\"modify-btn\">수정</button>";
          myDevices += "<button name=\""+`${deviceName}`+"\" class=\"delete-btn\">삭제</button>";
          myDevices += "</div>";
          $("#my-devices").append(myDevices);
        }

        $(".modify-btn").click(function(event) {
          var deviceName = event.target.getAttribute("name");
          $("#sliderText").html("슬라이더를 움직여 보세요!");
          sliderValue = myDevicesInfo[deviceName].ths;
          switchTypeValue = myDevicesInfo[deviceName].typ;
          $("#slider-ths").slider({
            range: 'value',
            min: 0,
            max: 1024,
            value: myDevicesInfo[deviceName].ths,
            step: 1,
            slide: function(event, ui) {
              sliderValue = ui.value;
              $("#sliderText").html("슬라이더 값: "+ui.value);
            }
          });
          if (switchTypeValue === 0) {
            $("#modify-typ-0").prop('checked', true);
            $("#modify-typ-1").prop('checked', false);
          } else {
            $("#modify-typ-0").prop('checked', false);
            $("#modify-typ-1").prop('checked', true);
          }
          $(".modify-form-container").addClass("show");
          $("#device-modify-btn").click(function() {
            var sendData = {
              username: name,
              device_id: deviceName,
              ths: sliderValue,
              typ: switchTypeValue
            }
            $.ajax({
              type: "POST",
              url: `${address}`+":5000/device-modify",
              dataType: "json",
              data: JSON.stringify(sendData),
              contentType: 'application/json; charset=utf-8',
              headers: {
                "Authorization": "Bearer " + token
              },
              success: function(data) {
                console.log(data);
                $(".modify-form-container").removeClass("show");
                // toast popup
                toast('성공적으로 수정되었습니다!');
                $("#devices").click();
              },
              error: function(data) {
                console.log("error");
              }
            })
          });
        });
        $("#modify-close-btn").click(function() {
          $(".modify-form-container").removeClass("show");
        });

        $(".delete-btn").click(function(event) {
          var deviceName = event.target.getAttribute("name");
          var sendData = {
            username: name,
            device_id: deviceName
          }
          $.ajax({
            type: "POST",
            url: `${address}`+":5000/device-delete",
            dataType: "json",
            data: JSON.stringify(sendData),
            contentType: 'application/json; charset=utf-8',
            headers: {
              "Authorization": "Bearer " + token
            },
            success: function(data) {
              console.log(data);
                // toast popup
                toast('성공적으로 삭제되었습니다!');
                $("#devices").click();
              },
              error: function(data) {
                console.log("error");
              }
          })
        });
      },
      error: function(data) {
        console.log(data);
        console.log("Status: " + data);
      }, timeout: 3000
    })
  });

  // device 등록하기

  $("#modify-typ-0").click(() => { switchTypeValue = 0 });
  $("#modify-typ-1").click(() => { switchTypeValue = 1 });
  $("#device-register").click(function() {
    $(".register-form-container").addClass("show");
  });
  $("#register-close-btn").click(function() {
    $(".register-form-container").removeClass("show");
  });
  $("#device-register-btn").click(function() {
    var sendData = {
      username: $("#register-id").val(),
      device_id: $("#device-id").val()
    }
    $.ajax({
      type: "POST",
      url: `${address}`+":5000/device-register",
      dataType: "json",
      data: JSON.stringify(sendData),
      contentType: 'application/json; charset=utf-8',
      headers: {
        "Authorization": "Bearer " + token
      },
      success: function(data) {
        console.log(data);
        $(".register-form-container").removeClass("show");
        // toast popup
        toast('성공적으로 등록되었습니다!');
        $("#devices").click();
      },
      error: function(data) {
        console.log("error");
      }  
    })
  })

  setInterval(() => {
    $("#devices").click();
  }, 5000);
});

