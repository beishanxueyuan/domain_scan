let currentURL = window.location.href
function getQueryVariable(variable) {
  var query = window.location.search.substring(1)
  var vars = query.split("&")
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=")
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return false
}
let page_number = getQueryVariable("page_number") || "1"
let page_size = getQueryVariable("page_size") || "100"

function loadNextPage() {
  page_number++ // 增加页数
  updateURLParams() // 更新URL参数
}

function loadPrePage() {
  page_number-- // 增加页数
  updateURLParams() // 更新URL参数
}

function updateURLParams() {
  location = "?page_number=" + page_number
}

function show_js_table() {
  $.ajax({
    url: "/query_all_js?page_number=" + page_number + "&page_size=" + page_size,
    type: "GET",
    success: function (response) {
      var resultDiv = $("#js_resultDiv")
      resultDiv.empty()
      // 检查响应是否是一个包含数组的数组
      var response = response.data
      if (
        Array.isArray(response) &&
        response.length > 0 &&
        Array.isArray(response[0])
      ) {
        var data = response // 直接使用响应数据

        if (data.length > 0) {
          var table = $("<table>")
          var headerRow = $("<tr>").append(
            $("<th>").text("id"),
            $("<th>").text("host"),
            $("<th>").text("js url"),
            $("<th>").text("length"),
            $("<th>").text("选项"),
          )
          table.append(headerRow)
          for (var i = 0; i < data.length; i++) {
            var rowData = data[i]
            if (rowData.length >= 2) {
              var id = '<span>' + rowData[0] + '</span>'
              var host = '<span>' + rowData[1] + '</span>'
              var js_url = '<span>' + rowData[2] + '</span>'
              var length = '<span>' + rowData[3] + '</span>'
              var is_changed = rowData[4]
              if (is_changed) {
                showMessage('监控到JS变化');
                id = '<span style="color: red;">' + rowData[0] + '</span>'
                length = '<span style="color: red;">' + rowData[3] + '</span>'
              }
              var row = $("<tr>").append(
                $("<td>").append(id),
                $("<td>").html($("<a href='//" + rowData[1] + "'" + "target=_blank>" + host + "</a>")),
                $("<td>").html($("<a href='" + rowData[2] + "'" + "target=_blank>" + js_url + "</a>")),
                $("<td>").html(length),
                $("<td>").append($("<button>").addClass("delete_jsBtn").text("删除"), $("</br></br>"), $("<button>").addClass("slovedBtn").text("解决")),
              )
              table.append(row)
            }
          }
          resultDiv.append(table)
        }
      }
    },
    error: function () {
      alert("获取数据失败！")
    },
  })
}

function show_host_table() {
  $.ajax({
    url: "/query_len",
    type: "GET",
    success: function (response) {
      $(".top-left-number").text(response)
    },
  })

  $.ajax({
    url: "/query_all?page_number=" + page_number + "&page_size=" + page_size,
    type: "GET",
    success: function (response) {
      var resultDiv = $("#resultDiv")
      resultDiv.empty()
      // 检查响应是否是一个包含数组的数组
      var response = response.data
      if (
        Array.isArray(response) &&
        response.length > 0 &&
        Array.isArray(response[0])
      ) {
        var data = response // 直接使用响应数据

        if (data.length > 0) {
          var table = $("<table>")
          var headerRow = $("<tr>").append(
            $("<th>").text("id"),
            $("<th>").text("host"),
            $("<th>").text("截图"),
            $("<th>").text("必应截图"),
            $("<th>").text("Google")
          )
          table.append(headerRow)
          for (var i = 0; i < data.length; i++) {
            var rowData = data[i]
            if (rowData.length >= 2) {
              var id = rowData[0]
              var host = rowData[1]
              screenshot = $("<img>").attr(
                "src",
                "https://s0.wp.com/mshots/v1/https://" + host + "/?w=600&h=400"
              )
              var hostLink = $("<a>")
                .attr("href", "https://" + host)
                .attr("target", "_blank")
                .text(host)
              var row = $("<tr>").append(
                $("<td>").append(id),
                $("<td>").append(hostLink),
                $("<td>").append(screenshot),
                $("<td>").html('<a target=_blank href=https://cn.bing.com/search?q=site:' + host + '><img src="https://s0.wp.com/mshots/v1/https://cn.bing.com/search%3fq=site%3A' + host + '"></a>'),
                $("<td>").html('<a target=_blank href=https://www.google.com/search?q=site%3A' + host + '><img src="https://s0.wp.com/mshots/v1/https://www.google.com//search%3fq=site%3A' + host + '"></a>'),
                $("<td>").append($("<button>").addClass("deleteBtn").text("删除"), $("</br></br>"), $("<button>").addClass("delete_listBtn").text("删除前面域名"))
              )
              table.append(row)
            }
          }
          resultDiv.append(table)
        }
      }
    },
    error: function () {
      alert("获取数据失败！")
    },
  })
}



if (window.location.pathname == "/") {
  show_host_table()
}

//监控js
else if (window.location.pathname == "/lookjs") {
  show_js_table();
}

$(document).ready(function () {
  //模糊删除
  $(document).on("click", "#delte_likeBtn", function () {
    var host = $("#inputField").val()
    $.ajax({
      url: "/delete_like", // 替换为你的服务器端处理删除请求的 URL
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ keyword: host }),
      success: function () {
        // 处理成功响应
        show_host_table();
      },
      error: function () {
        // 处理错误响应
        alert("删除失败！")
      },
    })
  })
  //删除
  $(document).on("click", ".deleteBtn", function () {
    var id = $(this).closest("tr").find("td")[0].innerHTML;
    openModal();
    $(document).on("click", ".yesBtn", function () {
      $.ajax({
        url: "/delete", // 替换为你的服务器端处理删除请求的 URL
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ id: id }),
        success: function () {
          // 处理成功响应
          show_host_table();
        },
        error: function () {
          // 处理错误响应
          alert("删除失败！")
        },
      })
      closeModal();
    })
    $(document).on("click", ".noBtn", function () {
      closeModal();
    })
  })
  //删除之前
  $(document).on("click", ".delete_listBtn", function () {
    var id = $(this).closest("tr").find("td")[0].innerHTML;
    openModal();
    $(document).on("click", ".yesBtn", function () {
      $.ajax({
        url: "/delete_list", // 替换为你的服务器端处理删除请求的 URL
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ id: id }),
        success: function () {
          // 处理成功响应
          show_host_table();
        },
        error: function () {
          // 处理错误响应
          alert("删除失败！")
        },
      })
      closeModal();
    })
    $(document).on("click", ".noBtn", function () {
      closeModal();
    })
  })
  //删除所有
  $("#deleteallBtn").click(function () {
    var confirmation = prompt('请输入 "yes" 以确认删除操作:')

    // 检查用户输入是否为 "yes"
    if (confirmation === "yes") {
      // 用户确认删除操作
      $.ajax({
        url: "/delete_all", // 替换为你的服务器端处理删除请求的 URL
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function (response) {
          // 处理成功响应
          show_host_table();
        },
        error: function () {
          // 处理错误响应
          alert("删除失败！")
        },
      })
    }
  })
  //插入
  $("#insertBtn").click(function () {
    var host = $("#inputField").val()
    $.ajax({
      url: "/insert", // 替换为你的服务器端处理删除请求的 URL
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ host: host }),
      success: function (response) {
        // 处理成功响应
        show_host_table();
      },
      error: function () {
        // 处理错误响应
        alert("插入失败！")
      },
    })
  })
  //监控js
  $("#insert_jsBtn").click(function () {
    var js_url = $("#inputField").val()
    var host = $("#inputField2").val()
    $.ajax({
      url: "/insert_js", // 替换为你的服务器端处理删除请求的 URL
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ js_url: js_url, host: host }),
      success: function (response) {
        // 处理成功响应
        show_js_table();
      },
      error: function () {
        // 处理错误响应
        alert("插入失败！")
      },
    })
  })
  $(document).on("click", ".delete_jsBtn", function () {
    var id = $(this).closest("tr").find("td").find("span")[0].innerHTML;
    $.ajax({
      url: "/delete_js", // 替换为你的服务器端处理删除请求的 URL
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id: id }),
      success: function () {
        // 处理成功响应
        show_js_table();
      },
      error: function () {
        // 处理错误响应
        alert("删除失败！")
      },
    })
  });
  $(document).on("click", ".slovedBtn", function () {
    var id = $(this).closest("tr").find("td").find("span")[0].innerHTML;
    $.ajax({
      url: "/sloved", // 替换为你的服务器端处理删除请求的 URL
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id: id }),
      success: function () {
        // 处理成功响应
        show_js_table();
      },
      error: function () {
        // 处理错误响应
        alert("删除失败！")
      },
    })
  });
})
