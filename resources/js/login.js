var stepCounter = 1;
var lastStep = 4;
//////////////////////////////////////////////////////////////
/////CLASE QUE MANEJA LA FUNCIONALIDAD DEL FORMULARIO/////////
//////////////////////////////////////////////////////////////
var loginEmail = document.getElementById("log_email");
var loginPassword = document.getElementById("log_password");
var capsAlertEmail = document.getElementById("caps_email");
var capsAlertPassword = document.getElementById("caps_password");

loginPassword.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("loginButton").click();
  }
  if (event.getModifierState("CapsLock")) {
    capsAlertPassword.style.display = "block";
  } else {
    capsAlertPassword.style.display = "none";
  }
});

loginEmail.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("loginButton").click();
  }
  if (event.getModifierState("CapsLock")) {
    capsAlertEmail.style.display = "block";
  } else {
    capsAlertEmail.style.display = "none";
  }
});

$(document).ready(function () {
  checkUserLogged();
});

// Únicamente una foto de perfil puede ser seleccionada
$(".profile_checkbox input").on("change", function() {
  $(".profile_checkbox input").not(this).prop("checked", false);
});

function showLogin() {
  $.when($("#f_login").show()).done(function () {
    $("#f_register").hide();
  });
  $("#messagetext").text(
    "Bienvenid@ a la Plataforma Educativa Online de la uc3m."
  );
  $("#title p").text("Inicio de Sesión");
  document.getElementById("aside_display").style.backgroundImage =
    "url('resources/images/log_display.jpg')";
}

function showRegister() {
  $.when($("#f_login").hide()).done(function () {
    $("#f_register").show();
  });
  $("#messagetext").text(
    "Registra una cuenta para acceder a los contenidos de la plataforma."
  );
  $("#title p").text("Registro");
  document.getElementById("aside_display").style.backgroundImage =
    "url('resources/images/log_display2.jpg')";
}

function goBack() {
  if (stepCounter === 1) {
    showLogin();
    resetFields();
  } else {
    if (stepCounter === 2) {
      document.getElementById("buttonBack").className = "buttonRed";
      document.getElementById("buttonBack").value = "Cancelar";
    } else {
      document.getElementById("buttonBack").className = "buttonGrey";
      document.getElementById("buttonBack").value = "Volver atrás";
      document.getElementById("buttonNext").className = "buttonBlack";
      document.getElementById("buttonNext").value = "Siguiente paso";
    }
    var stepString = ".step" + stepCounter.toString();
    $(stepString).hide();
    stepCounter--;
    stepString = ".step" + stepCounter.toString();
    $(stepString).show();
  }
}

function goNext() {
  checkRoleOptions();
  if (validateFields() != false) {
    document.getElementById("buttonBack").className = "buttonGrey";
    document.getElementById("buttonBack").value = "Volver atrás";
    if (stepCounter != lastStep) {
      var stepString = ".step" + stepCounter.toString();
      $(stepString).hide();
      stepCounter++;
      stepString = ".step" + stepCounter.toString();
      $(stepString).show();
    }
    if (stepCounter === lastStep) {
      document.getElementById("buttonNext").className = "buttonBlue";
      document.getElementById("buttonNext").value = "Completar";
    }
    if (document.getElementById("buttonNext").value === "Completar") {
      if (validate("checkbox") === true) {
        submitRegister();
      }
    }
  }
}

function submitLogin() {
  var email = document.getElementById("log_email");
  var password = document.getElementById("log_password");
  var obtained_cookie;

  if (email.value != "") {
    obtained_cookie = getCookie(email.value);
    resetInfo("passwordLogInfo");
    markError(password, 0);
  } else {
    if (password.value === "") {
      var info = "Los campos no pueden estar vacíos.";
      showInfo("passwordLogInfo", info);
      markError(email, 1);
      markError(password, 1);
      return false;
    } else {
      resetInfo("passwordLogInfo");
      markError(password, 0);
    }
  }

  if (obtained_cookie === "") {
    var info = "El email introducido no pertenece a ningún usuario.";
    showInfo("emailLogInfo", info);
    markError(email, 1);
  } else {
    resetInfo("emailLogInfo");
    markError(email, 0);
  }
  //Guardamos los datos extraidos y los cotejamos
  var aux_array = JSON.parse(obtained_cookie);
  var actualPassword = aux_array[2];
  var resultado = password.value.localeCompare(actualPassword);

  if (resultado === 0) {
    resetInfo("passwordLogInfo");
    markError(password, 0);
    createCookie("login", email.value);
    //Función que soluciona la carencia de javascript
    //para cambiar de página cuando se invoca desde un submit
    loginRedirect(email.value, password.value, 0);
  } else {
    var info = "La contraseña introducida es incorrecta.";
    showInfo("passwordLogInfo", info);
    markError(password, 1);
  }
}

function loginRedirect(email, password, type) {
  $("#loading #p_loadingmsg").text("Bienvenid@ de nuevo ");
  $("#loading #p_loadingemail").text(email);
  $("#form_bottom input").slideUp();
  $("#userlinks").slideUp();
  $("#loading p").slideDown();
  $("#loading img").slideDown();
  var emailField = document.getElementById("log_email");
  emailField.disabled = true;
  emailField.style.backgroundColor = "lightgrey";
  if (type === 1) {
    emailField.value = email;
  }
  var passwordField = document.getElementById("log_password");
  passwordField.disabled = true;
  passwordField.style.backgroundColor = "lightgrey";
  if (type === 1) {
    passwordField.value = password;
  }

  setTimeout(function () {
    document.location.href = "./web.html";
  }, 2000);
}

function checkUserLogged() {
  var obtained_cookie = getCookie("login");
  if (obtained_cookie != "") {
    var user_cookie = JSON.parse(getCookie(obtained_cookie));
    loginRedirect(user_cookie[5], user_cookie[2], 1);
  }
}

//REGISTER
function submitRegister() {
  var username = document.getElementById("reg_username").value;
  var nia = document.getElementById("reg_nia").value;
  var password = document.getElementById("reg_password").value;
  var name = document.getElementById("reg_name").value;
  var surname = document.getElementById("reg_surname").value;
  var email = document.getElementById("reg_email").value;
  var birthdate = document.getElementById("reg_birthday").value;
  var dni = document.getElementById("reg_dni").value;
  var roles = document.getElementById("reg_roles").value;
  var degrees = document.getElementById("reg_degrees").value;
  var university = document.getElementById("reg_university").value;
  var language = document.getElementById("reg_language").value;
  var campus = "Leganes";
  var profilepic = "student0";
  var profilePictures = document.querySelectorAll(".profile_checkbox input");
  for (var i = 0; i < profilePictures.length; i++) {
    if (profilePictures[i].checked) {
      profilepic = profilePictures[i].value;
    }
  }

  //Composición del array
  var newUser = new Array(
    username,
    nia,
    password,
    name,
    surname,
    email,
    birthdate,
    dni,
    roles,
    degrees,
    university + " (" + campus + ")",
    language,
    profilepic
  );
  var new_cookie_str = JSON.stringify(newUser);
  createCookie(email, new_cookie_str);
  alert("La cuenta " + email + " ha sido creada con éxito");
  window.location.href = "./index.html";
}

function validate(fieldType) {
  switch (fieldType) {
    case "username":
      var username = document.getElementById("reg_username");
      var usernameLength = 3;
      if (username.value.length <= usernameLength) {
        var info =
          "El nombre de usuario debe ser superior a " +
          usernameLength.toString() +
          " caracteres.";
        showInfo("usernameInfo", info);
        markError(username, 1);
      } else {
        resetInfo("usernameInfo");
        markError(username, 0);
      }
      break;
    case "email":
      var email = document.getElementById("reg_email");
      var MAILpattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (MAILpattern.test(email.value) == false) {
        var info = "El email debe cumplir el patrón nombre@web.dominio.";
        showInfo("emailInfo", info);
        markError(email, 1);
        return false;
      } else {
        resetInfo("emailInfo");
        markError(email, 0);
      }
      /////////////// PONER EN ROJO CUADNO EL EMAIL ES CORRECTO PERO YA EXISTE ///////////
      if (checkEmailAvailable(email.value) == false) {
        var info =
          "El email introducido está asociado a una cuenta de usuario.";
        showInfo("emailInfo", info);
        markError(email, 1);
        errorsFound++;
      } else {
        resetInfo("emailInfo");
        markError(email, 0);
      }
      break;
    case "password":
      if ((checkPasswordTyped(0) == false) | (checkPasswordTyped(1) == false)) {
        return false;
      }
      break;
    case "name":
      var name = document.getElementById("reg_name");
      var nameLength = 3;
      if (name.value.length <= nameLength) {
        var info =
          "El nombre debe ser superior a " +
          nameLength.toString() +
          " caracteres.";
        showInfo("nameInfo", info);
        markError(name, 1);
        return false;
      } else {
        resetInfo("nameInfo");
        markError(name, 0);
      }
      break;
    case "surname":
      var surname = document.getElementById("reg_surname");
      var surnameLength = 3;
      if (surname.value.length <= surnameLength) {
        var info =
          "Los apellidos del usuario deben ser superiores a " +
          surnameLength.toString() +
          " caracteres.";
        showInfo("surnameInfo", info);
        markError(surname, 1);
        return false;
      } else {
        resetInfo("surnameInfo");
        markError(surname, 0);
      }
      break;
    case "birthdate":
      var birthdate = document.getElementById("reg_birthday");
      if (birthdate.value == 0) {
        var info = "La fecha de nacimiento es obligatoria.";
        showInfo("birthdateInfo", info);
        markError(birthdate, 1);
        return false;
      } else {
        resetInfo("birthdateInfo");
        markError(birthdate, 0);
      }
      break;
    case "DNI":
      var DNI = document.getElementById("reg_dni");
      var DNIpattern = /^([0-9]{8}[A-Z]{1})$/;
      if (DNIpattern.test(DNI.value) == false) {
        var info = "El DNI debe estar formado por 8 dígitos y una letra.";
        showInfo("dniInfo", info);
        markError(DNI, 1);
        errorsFound++;
      } else {
        resetInfo("dniInfo");
        markError(DNI, 0);
      }
      break;
    case "NIA":
      var NIA = document.getElementById("reg_nia");
      var NIApattern = /^(((100))[0-9]{6})$/;
      if (NIApattern.test(NIA.value) == false) {
        var info = "El NIA debe cumplir el formato 100XYZTUV";
        showInfo("niaInfo", info);
        markError(NIA, 1);
        return false;
      } else {
        resetInfo("niaInfo");
        markError(NIA, 0);
      }
      break;
    case "roles":
      var roles = document.getElementById("reg_roles");
      if (document.getElementById("student").selected) {
        if (validate("NIA") === false) {
          return false;
        }
      }
      break;
    case "checkbox":
      var checkbox = document.getElementById("reg_conditions");
      if (checkbox.checked === false) {
        var info = "Debes aceptar las condiciones de uso para registrarte.";
        showInfo("conditionsInfo", info);
        markError(checkbox, 1);
        return false;
      } else {
        resetInfo("conditionsInfo");
        markError(checkbox, 0);
      }
      break;
  }
  return true;
}

function validateFields() {
  var errorsFound = 0;
  switch (stepCounter) {
    case 1:
      if (
        (validate("password") === false) |
        (validate("username") === false) |
        (validate("email") === false)
      ) {
        errorsFound++;
      }

      break;
    case 2:
      if (
        (validate("name") === false) |
        (validate("surname") === false) |
        (validate("birthdate") === false) |
        (validate("DNI") === false)
      ) {
        errorsFound++;
      }
      break;
    case 3:
      if (validate("roles") === false) {
        errorsFound++;
      }
      break;
    case 4:
      if (validate("checkbox") === false) {
        errorsFound++;
      }
      break;
  }
  if (errorsFound != 0) {
    return false;
  }
  return true;
}

function checkEmailAvailable(inputEmail) {
  var obtained_cookie = getCookie(inputEmail);
  if (obtained_cookie === "") {
    return true;
  } else {
    return false;
  }
}

function checkPasswordTyped(number) {
  var password = document.getElementById("reg_password");
  var passwordB = document.getElementById("reg_passwordB");
  var PWpattern = /[a-zA-Z0-9]{8,}/;
  if (number === 0) {
    if (passwordB.value !== password.value || passwordB.value == "") {
      var info = "Las contraseñas no coinciden.";
      showInfo("passwordBInfo", info);
      markError(passwordB, 1);
      return false;
    } else {
      resetInfo("passwordBInfo");
      markValid(passwordB, 1);
      return true;
    }
  }
  if (number === 1) {
    if (PWpattern.test(password.value) == false) {
      var info = "La contraseña debe ser mayor o igual a 8 caracteres.";
      showInfo("passwordInfo", info);
      markError(password, 1);
      return false;
    } else {
      resetInfo("passwordInfo");
      markValid(password, 1);
    }
    return true;
  }
}

function checkRoleOptions() {
  var roles = document.getElementById("reg_roles");
  if (document.getElementById("student").selected) {
    $(".field_degree").show();
    $(".field_NIA").show();
  } else {
    $(".field_degree").hide();
    $(".field_NIA").hide();
  }
}

function resetFields() {
  var i;
  var fields = document.querySelectorAll(".inputField input");
  for (i = 0; i < fields.length; i++) {
    if (fields[i].id != "reg_university") {
      fields[i].style.backgroundColor = "#ffffff";
      fields[i].value = "";
    }
  }
  var fieldInfos = document.querySelectorAll(".fieldInfo");
  for (i = 0; i < fieldInfos.length; i++) {
    fieldInfos[i].textContent = "";
  }
}

function resetStepField() {
  var i;
  var stepString = ".step" + stepCounter.toString() + " input";
  var fields = document.querySelectorAll(stepString);
  for (i = 0; i < fields.length; i++) {
    if (fields[i].id != "reg_university") {
      fields[i].style.backgroundColor = "#ffffff";
      fields[i].value = "";
    }
  }
  var stepStringB = ".step" + stepCounter.toString() + " .inputField p";
  var fieldInfos = document.querySelectorAll(stepStringB);
  for (i = 0; i < fieldInfos.length; i++) {
    fieldInfos[i].textContent = "";
  }
}

function showInfo(id, text) {
  document.getElementById(id).textContent = text;
}

function resetInfo(id) {
  document.getElementById(id).textContent = "";
}

function markError(field, option) {
  if (option == 1) {
    field.style.backgroundColor = "#ffb0b0";
  } else {
    field.style.backgroundColor = "#ffffff";
  }
}

function markValid(field, option) {
  if (option == 1) {
    field.style.backgroundColor = "#a8eea6";
  } else {
    field.style.backgroundColor = "#ffffff";
  }
}
