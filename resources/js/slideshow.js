var actualImage = 0;
var changeTime = 5000;
var imageSource = "./resources/images/";
let imageFile = ["slider_1.jpg", "slider_2.jpg", "slider_3.jpg"];
let imageTitle = [
  "Bienvenid@ a la Plataforma Educativa Online de la uc3m.",
  "Publicadas las fechas de matriculación para alumnos de la universidad en el periodo del Segundo Cuatrimestre.",
  "Solicita las guias para docentes sobre enseñanza online: herramientas BlackBoard Collaborate y moodle plugins"
];

$(document).ready(function () {
  showSlide(0);
});

var interval = setInterval(function () {
  sliderNext();
}, changeTime);



function showSlide(number) {
  var imageUrl = imageSource + imageFile[number];
  $("#slider_images").css("background-image", "url(" + imageUrl + ")");
  actualImage = number;
  $("#imagetitle p").text(imageTitle[number]);
}

function sliderNext(number) {

  if (actualImage + 1 < imageFile.length) {
    actualImage++;
    showSlide(actualImage);
  } else {
    showSlide(0);
  }
}

function sliderPrev() {
  if (actualImage - 1 >= 0) {
    actualImage--;
    showSlide(actualImage);
  } else {
    showSlide(imageFile.length - 1);
  }
}
