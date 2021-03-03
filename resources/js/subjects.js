$(document).ready(function () {
  $("#container_forum").load("./resources/html/forum.html");
  $("#studentsview").load("./resources/html/students.html");
  $("#globalgrades").load("./resources/html/globalgrades.html")
  $("#globaltasks").load("./resources/html/globaltasks.html")
  $("#temario").show();
  $(".option_content").removeClass("hoverOptionL");
  $("#option_temario").addClass("hoverOptionL");
  var obtained_cookie = getCookie("login");
  var user_cookie = getCookie(obtained_cookie);
  var userFields = JSON.parse(user_cookie);
  var userRole = userFields[8];
  switch (userRole.toLowerCase()) {
    case "administrador":
      $("#extracontrols").show();
      break;
    case "profesor":
      $("#extracontrols").show();
      break;
  }
});

  /* Este script genera automáticamente un enlace mailto a través del div que contiene el email en la categoría de Estudiantes */
  function sendEmail(ele) {
    var mail = ele.parentElement.textContent.trim();
    if (confirm("¿Quieres enviar un email a " + mail + "?")) {
      window.location.href = "mailto:" + mail;
    }
  }
