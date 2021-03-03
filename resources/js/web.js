var showing = "default";
var responsiveMenuDown = 0;
var leftSubjectsDown = 0;
var leftOldSubjectsDown = 0;
var showingEditor = 0;

// Scripts de hover sobre elementos
$("#drop_exitcontent").hover(function () {
  $("#option_exit").attr("src", "./resources/icons/exit.gif");
});
$("#drop_exitcontent").mouseleave(function () {
  $("#option_exit").attr("src", "./resources/icons/exit.png");
});


// Scripts que ejecutan al cargar la página
$(document).ready(function () {
  updateUserFields();
  backToInit();
  loadCalendar();
  fillSubjects();
  //Títulos iniciales
  $(".options_text").text("PÁGINA PRINCIPAL");
  $("#changing_title").text("PÁGINA PRINCIPAL");
  $("#changing_info").text(
    "Bienvenid@ de nuevo a la Plataforma Educativa Virtual de la uc3m"
  );
});


function updateUserFields() {
  var obtained_cookie = getCookie("login");
  var user_cookie = getCookie(obtained_cookie);
  if (user_cookie != "") {
    var userFields = JSON.parse(user_cookie);
    $("#nav_studentname p").text(userFields[0]);
    var studentPic = "./resources/images/profiles/" + userFields[12] + ".png";
    $("#nav_studentpic img").attr("src", studentPic);
  }
}

function fillSubjects() {
  var dir = "";
  var obtained_cookie = getCookie("login");
  var user_cookie = getCookie(obtained_cookie);
  if (user_cookie != "") {
    var userFields = JSON.parse(user_cookie);
    var userRole = userFields[8];

    var oldSubjectsActive = 0;
    switch (userRole.toLowerCase()) {
      case "administrador":
        $("#topcat").text("Asignaturas en la Plataforma");
        $(".toggles_left span").text("Asignaturas en la plataforma ");
        $("#addsubj").show();
        $("#addprof").show();
        $(".editicon").show();
        $("#adminpanel").show();
        $(".subjects_title").css("background-color", "navy");
        $(".menus_hideable").hide();
        $("#menu_grades").hide();
        $("#menu_tasks").hide();
        $("#option_marks").hide();
        $("#option_tasks").hide();
        dir = "resources/JSON/subjects_admin.json";
        break;
      case "profesor":
        $("#topcat").text("Asignaturas Impartidas");
        $(".toggles_left span").text("Asignaturas Impartidas ");
        $(".menus_hideable").hide();
        dir = "resources/JSON/subjects_prof.json";
        $("#menu_grades").hide();
        $("#menu_tasks").hide();
        $("#option_marks").hide();
        $("#option_tasks").hide();
        break;
      default:
        var oldSubjectsActive = 1;
        dir = "resources/JSON/subjects.json";
        break;
    }
  } else {
    var oldSubjectsActive = 1;
    dir = "resources/JSON/subjects.json";
  }
  var htmlCS = "";
  var htmlOS = "";

  $.getJSON(dir, function (data) {
    $.each(data.currentSubjects, function (index, item) {
      htmlCS +=
        "<div  class='single_subject' id = 'asig_" +
        item.id +
        "' " +
        "onclick = \"showAsig('" +
        item.id +
        "','" +
        item.name +
        "','" +
        item.info +
        "','" +
        item.prof +
        "','" +
        item.profId +
        "','" +
        item.profEmail +
        "')\">" +
        "<div class='icon_single_subject'>" +
        "<img src = './resources/icons/asig.png'>" +
        "</div>" +
        "<div class='text_single_subject'>" +
        "<div class='subject_name'>" +
        "<p>" +
        item.name +
        "</p></div>" +
        "<div class='subject_group'><p>" +
        item.info +
        "</p></div></div></div>";
    });
    $(current_subject_menu).append(htmlCS);

    if (oldSubjectsActive == 1) {
      $.each(data.oldSubjects, function (index, item) {
        htmlOS +=
          "<a href = '" +
          item.url +
          "' target='_blank'>" +
          "<div  class='single_subject' id = 'asig_" +
          item.id +
          "' >" +
          "<div class='icon_single_subject'>" +
          "<img src = './resources/icons/asig.png'>" +
          "</div>" +
          "<div class='text_single_subject'>" +
          "<div class='subject_name'>" +
          "<p class='p_subject_name'>" +
          item.name +
          "</p></div>" +
          "<div class='subject_group'><p class='p_subject_group'>" +
          item.info +
          "</p></div></div></div></a>";
      });
      $(old_subject_menu).append(htmlOS);
    }
  });
}

function showAsig(id, name, info, prof, profId, profEmail) {
  if (showing != id) {
    $("#right_basic_menu").hide();
    $("#menu_init").hide();
    showing = id;
    var showingString = "#asig_" + showing;
    $(".single_subject").removeClass("hoverOption");
    $(".menu_option").removeClass("hoverMenuOpt");
    $("#menu_temario").addClass("hoverMenuOpt");
    $(".single_subject img").attr("src", "./resources/icons/asig.png");
    $(showingString).addClass("hoverOption");
    showingString += " img";
    $(showingString).attr("src", "./resources/icons/asigHover.png");

    //Mostramos los elementos necesarios
    $("#right_subject_menu").show();
    $("#menu_subjects").show();

    //Carga del título superior de la página
    $("#changing_title").text(name.toUpperCase());
    $("#changing_info").text(info);

    //Cambio del texto del menú derecho
    $(".options_text").text(name.toUpperCase());

    //Carga de los datos del profesor
    $("#professor_name").text(prof);
    $("#professor_title").text(profEmail);

    //Carga de la imagen del profesor
    var imageDir = "./resources/images/professors/" + profId + ".png";
    var image = '<img src="' + imageDir + '">';
    //Borramos la imagen anterior si la hubiera
    $("#professor_image").html(image);

    //Carga del contenido de la columna central
    var dir = "./resources/html/" + id + ".html";
    $("#container_changed").empty(dir);
    $("#container_changed").load(dir, function (response, status, xhr) {
      if (status == "error") {
        show404Error();
      }
    });

    var obtained_cookie = getCookie("login");
    var user_cookie = getCookie(obtained_cookie);
    if (user_cookie != "") {
      var userFields = JSON.parse(user_cookie);
      var userRole = userFields[8];
      var userName = userFields[3];
      var userSurname = userFields[4];
      var userImg = userFields[12];
      if (userRole.toLowerCase() == "profesor") {
        $("#professor_name").text(userName + " " + userSurname);
        $("#professor_title").text(obtained_cookie);
        var imageUsr =
          '<img src="./resources/images/profiles/' + userImg + '.png">';
        $("#professor_image").html(imageUsr);
      }
    }
  }
}

function show404Error() {
  $("#container_changed").load("./resources/html/404.html");
}

function showForum() {
  if (showing != "forum") {
    $(".option_content").removeClass("hoverOptionL");
    $("#option_forum").addClass("hoverOptionL");
    $(".menu_option").removeClass("hoverMenuOpt");
    $("#menu_forum").addClass("hoverMenuOpt");
    $("#temario").hide();
    $("#marks_global").hide();
    $("#tasks_global").hide();
    $("#workgroup").hide();
    $("#drag_and_drop").hide();
    $("#container_forum").show();
    $("#studentsview").hide();
    $("#globalgrades").hide();
    $("#globaltasks").hide();
    showing = "forum";
  }
}

function showTemario() {
  $(".option_content").removeClass("hoverOptionL");
  $("#option_temario").addClass("hoverOptionL");
  $(".menu_option").removeClass("hoverMenuOpt");
  $("#menu_temario").addClass("hoverMenuOpt");
  $("#temario").show();
  $("#marks_global").hide();
  $("#tasks_global").hide();
  $("#workgroup").hide();
  $("#drag_and_drop").hide();
  $("#container_forum").hide();
  $("#studentsview").hide();
  $("#globalgrades").hide();
  $("#globaltasks").hide();
  showing = "temario";
}

function showGrades() {
  $(".option_content").removeClass("hoverOptionL");
  $("#option_marks").addClass("hoverOptionL");
  $(".menu_option").removeClass("hoverMenuOpt");
  $("#menu_grades").addClass("hoverMenuOpt");
  $("#temario").hide();
  $("#marks_global").show();
  $("#tasks_global").hide();
  $("#workgroup").hide();
  $("#drag_and_drop").hide();
  $("#container_forum").hide();
  $("#studentsview").hide();
  $("#globalgrades").hide();
  $("#globaltasks").hide();
  showing = "grades";
}

function showTasks(option) {
  $(".option_content").removeClass("hoverOptionL");
  $("#option_tasks").addClass("hoverOptionL");
  $(".menu_option").removeClass("hoverMenuOpt");
  $("#menu_tasks").addClass("hoverMenuOpt");
  $("#temario").hide();
  $("#marks_global").hide();
  $("#drag_and_drop").hide();
  $("#container_forum").hide();
  $("#studentsview").hide();
  $("#globalgrades").hide();
  $("#workgroup").hide();
  $("#workgroup").hide();
  if (option === "professor") {
    $("#globaltasks").show();
  } else {
    $(".content_state").show();
    $("#tasks_global").show();
    showing = "tasks";
  }
}

function showGroup() {
  $("#temario").hide();
  $("#marks_global").hide();
  $("#tasks_global").hide();
  $("#workgroup").show();
  $("#drag_and_drop").hide();
  $("#container_forum").hide();
  $("#studentsview").hide();
  $("#globalgrades").hide();
  $("#globaltasks").hide();
}

function showSubmitBox() {
  $("#temario").hide();
  $("#marks_global").hide();
  $("#tasks_global").hide();
  $("#workgroup").hide();
  $("#drag_and_drop").show();
  $("#container_forum").hide();
  $("#studentsview").hide();
  $("#globalgrades").hide();
  $("#globaltasks").hide();
}

function showStudents() {
  $(".option_content").removeClass("hoverOptionL");
  $(".menu_option").removeClass("hoverMenuOpt");
  $("#temario").hide();
  $("#marks_global").hide();
  $("#tasks_global").hide();
  $("#workgroup").hide();
  $("#drag_and_drop").hide();
  $("#container_forum").hide();
  $("#studentsview").show();
  $("#globalgrades").hide();
  $("#globaltasks").hide();
}

function showGlobalGrades() {
  $(".option_content").removeClass("hoverOptionL");
  $(".menu_option").removeClass("hoverMenuOpt");
  $("#temario").hide();
  $("#marks_global").hide();
  $("#tasks_global").hide();
  $("#workgroup").hide();
  $("#drag_and_drop").hide();
  $("#container_forum").hide();
  $("#studentsview").hide();
  $("#globalgrades").show();
  $("#globaltasks").hide();
}

// Función de administador que permite añadir una nueva asignatura
function addSubject() {
  var name = prompt("Introduce el nombre de la asignatura");
  var info = prompt("Introduce 'Grupo XX Curso YY'");
  var html = "";
  html +=
    "<div  class='single_subject'>" +
    "<div class='icon_single_subject'>" +
    "<img src = './resources/icons/asig.png'>" +
    "</div>" +
    "<div class='text_single_subject'>" +
    "<div class='subject_name'>" +
    "<p>" +
    name +
    "</p></div>" +
    "<div class='subject_group'><p>" +
    info +
    "</p></div></div></div>";
  $("#current_subject_menu").append(html);
}

// Función de administador que permite editar títulos
function editTitle() {
  var name = prompt("Introduce el título nuevo");
  var info = prompt("Introduce la nueva descripción");
  $("#changing_title").text(name);
  $("#changing_info").text(info);
}

// Función de administador añadir profesor
function addProfessor() {
  alert("Esta asignatura ya tiene un profesor asignado");
}

// Función que comprueba el valor introducido en el cuadro de búsqueda de asignaturas y las filtra
$("#searchsubjinput").keyup(function () {
  var input = $("#searchsubjinput").val();
  $(".single_subject").hide();
  $('.single_subject:contains("' + input + '")').show();
});

function showContentEditor() {
  var iconosTemario = document.getElementsByClassName("icono_temario");
  var i = 0;
  if (showingEditor === 0) {
    alert("Se ha habilitado el modo edición.");
    for (i = 0; i < iconosTemario.length; i++) {
      showingEditor = 1;
      iconosTemario[i].src = "./resources/icons/edit.png";
      iconosTemario[i].classList.add("cursorPointer");
    }
  } else {
    alert("Se ha deshabilitado el modo edición.");
    for (i = 0; i < iconosTemario.length; i++) {
      showingEditor = 0;
      iconosTemario[i].src = "./resources/icons/asig3black.png";
      iconosTemario[i].classList.remove("cursorPointer");
    }
  }
}

function showCalendar() {
  $("html, body").animate(
    {
      scrollTop: $("#calendar_import").offset().top,
    },
    1000
  );
}

function checkUserInbox(inbox) {
  if (inbox === "msg") {
    alert("No tienes ningún mensaje");
  } else {
    alert("No tienes ninguna notificación");
  }
}

function backToInit() {
  if (showing != "inicio") {
    showing = "inicio";
    $(".option_content").removeClass("hoverOptionL");
    $(".single_subject").removeClass("hoverOption");
    $(".menu_option").removeClass("hoverMenuOpt");
    $(".single_subject img").attr("src", "./resources/icons/asig.png");
    $("#right_basic_menu").show();
    $("#menu_init").show();
    $("#container_changed").load("./resources/html/frontpage.html");

    //Títulos iniciales
    $(".options_text").text("PÁGINA PRINCIPAL");
    $("#changing_title").text("PÁGINA PRINCIPAL");
    $("#changing_info").text(
      "Bienvenid@ de nuevo a la Plataforma Educativa Virtual de la uc3m"
    );

    //Ocultamos los elementos de la asignatura
    $("#right_subject_menu").hide();
    $("#menu_subjects").hide();
  }
}

function closeSession() {
  $.when($("#dv_indexpopup").fadeIn("50ms")).done(function () {
    $.when($("#dv_indexpopupcontent").slideDown()).done(function () {
      $("#dv_indexpopupclose").fadeIn("fast");
    });
  });

  setTimeout(function () {
    document.cookie =
      "login= ; path=/; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.location.href = "./index.html";
  }, 1500);
}

function toggleResponsiveMenu() {
  $("#center_menucont").slideToggle();
  if (responsiveMenuDown === 1) {
    responsiveMenuDown = 0;
    $("#menu_toggleimg img").attr("src", "./resources/icons/arrowdown.png");
  } else {
    responsiveMenuDown = 1;
    $("#menu_toggleimg img").attr("src", "./resources/icons/arrowup.png");
  }
}

function toggleLeftSubjects(option) {
  if (option === 0) {
    $("#current_subject_menu").slideToggle();
    if (leftSubjectsDown === 1) {
      leftSubjectsDown = 0;
      $("#toggles_currentsubj").attr("src", "./resources/icons/arrowup.png");
    } else {
      leftSubjectsDown = 1;
      $("#toggles_currentsubj").attr("src", "./resources/icons/arrowdown.png");
    }
  }
  if (option === 1) {
    $("#old_subject_menu").slideToggle();
    if (leftOldSubjectsDown === 1) {
      leftOldSubjectsDown = 0;
      $("#toggles_oldsubj").attr("src", "./resources/icons/arrowdown.png");
    } else {
      leftOldSubjectsDown = 1;
      $("#toggles_oldsubj").attr("src", "./resources/icons/arrowup.png");
    }
  }
}

old_subject_menu;

function loadCalendar() {
  $("#calendar_import").simpleCalendar({
    fixedStartDay: 1,
    disableEmptyDetails: true,
    events: [
      {
        startDate: new Date(
          new Date().setHours(new Date().getHours() + 48)
        ).toDateString(),
        endDate: new Date(
          new Date().setHours(new Date().getHours() + 48)
        ).toISOString(),
        summary: "Práctica 1 - Voltajes",
      },
      {
        startDate: new Date(
          new Date().setHours(new Date().getHours() + 100)
        ).toDateString(),
        endDate: new Date(
          new Date().setHours(new Date().getHours() + 100)
        ).toISOString(),
        summary: "Examen 1 - Temas 1 y 2",
      },
      {
        startDate: new Date(
          new Date().setHours(new Date().getHours() + 118)
        ).toDateString(),
        endDate: new Date(
          new Date().setHours(new Date().getHours() + 118)
        ).toISOString(),
        summary: "Práctica 2 - Amperaje",
      },
      {
        startDate: new Date(
          new Date().setHours(new Date().getHours() + 300)
        ).toDateString(),
        endDate: new Date(
          new Date().setHours(new Date().getHours() + 300)
        ).toISOString(),
        summary: "Examen 2 - Temas 3 y 4",
      },
      {
        startDate: new Date(
          new Date().setHours(new Date().getHours() + 228)
        ).toDateString(),
        endDate: new Date(
          new Date().setHours(new Date().getHours() + 228)
        ).toISOString(),
        summary: "Práctica 3 - Resistores",
      },
      {
        startDate: new Date(
          new Date().setHours(new Date().getHours() + 300)
        ).toDateString(),
        endDate: new Date(
          new Date().setHours(new Date().getHours() + 300)
        ).toISOString(),
        summary: "Examen 3 - Temas 5 y 6",
      },
    ],
  });
}
