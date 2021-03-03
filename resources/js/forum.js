$(document).ready(function () {
    /*Generación de los temas del foro*/
    generarTemasForo(1);
    generarTemasForo(2);
    generarTemasForo(3);
    generarTemasForo(4);
    generarTemasForo(5);
});

function toggleTemaForo(topicID) {
    var dv_topicpostsmsgs = "#dv_topicpostsmsgs" + topicID;
    var dv_topicmsg = "#b_msgcount" + topicID;
    var msgcount = $(dv_topicmsg).text();
    msgcount.replace(/[^\d.]/g, '');
    msgcount = parseInt(msgcount, 10);
    if ($(dv_topicpostsmsgs).css("display") === "none") {
        scrollDown(msgcount, topicID);
    }
    $(dv_topicpostsmsgs).slideToggle();

}


function scrollDown(topicMsgs, topicID) {
    var scrollValue = $(window).scrollTop();
    var scrollValue = scrollValue + 100*topicMsgs + 50*topicID;
    $('body, html').animate({ scrollTop: scrollValue }, 1000);
}

function generarTemasForo(topicID) {

    var dir = './resources/JSON/forum/forum_post' + topicID + '.json';
    $.getJSON(dir, function (data) {
        var titulo = data.titulo;
        var p_topictitle = "#p_topictitle" + topicID;
        $(p_topictitle).text(titulo);

        var b_lastmsgauthor = "#b_lastmsgauthor" + topicID;
        $(b_lastmsgauthor).text(data.tema[data.tema.length - 1].name + " " + data.tema[data.tema.length - 1].surname);
        var b_lastmsgdate = "#b_lastmsgdate" + topicID;
        $(b_lastmsgdate).text(data.tema[data.tema.length - 1].date);
        var b_lastmsghour = "#b_lastmsghour" + topicID;
        $(b_lastmsghour).text(data.tema[data.tema.length - 1].hour);
    });

    $.getJSON(dir, function (data) {
        var html = '';
        var msgcount = 0;
        /*var temaForo = 'data.' + temaParaExtraer;*/

        $.each(data.tema, function (index, item) {
            /*Donde index es el número de mensaje e item es el objeto mensaje*/
            msgcount++;
            html +=
                '<div class="dv_topicmessage">' +
                '<div class="dv_topicusercontent">' +
                '<div class="dv_topicprofileimg">' +
                '<img src="./resources/images/profiles/' + item.profileimg + '.png" alt="Imagen del Post"/>' +
                '</div>' +
                '<div class="dv_topicusername">' +
                '<p class = "p_topicusername">'
                + item.name + " " + item.surname +
                '</p>' +
                '<p class = "p_topicemail">'
                + item.mail +
                '</p>' +
                '</div>' +
                '</div>' +
                '<div class="dv_usermsg">' +
                '<div class="dv_usermsgp">' +
                '<p>' + item.message + '</p>' +
                '</div>' +
                '</div>' +
                '<div class="dv_topicpostdate">' +
                '<p>' + item.date + ' a las ' + item.hour + '</p>' +
                '</div>' + '</div>';
        });

        /* html += '<div class = "dv_topicinput">' + 
         '<input type="text" id="inputNewMsg1">' +
         '<input type="button" onclick="saveNewMsg("inputNewMsg1")" value="enviar">' + '</div>'*/
        var dv_topicname = "#dv_topicposts" + topicID;
        var dv_topicmsg = "#b_msgcount" + topicID;
        $(dv_topicname).append(html);
        $(dv_topicmsg).text(msgcount);
    });
}



function saveNewMsg(textBox, topicID) {
    var newMsg = document.getElementById(textBox).value;
    if (newMsg.length === 0) {
        alert("Error: no puedes enviar un mensaje vacío");
        return false;
    } else if (newMsg.length < 4) {
        alert("Error: no puedes enviar un mensaje menor a 4 caracteres");
        return false;
    }
    var auxDate = new Date();

    /*Obtenemos la Fecha*/
    var dd = String(auxDate.getDate());
    if (dd < 10) dd = '0' + dd;
    var mm = String(auxDate.getMonth() + 1);
    if (mm < 10) mm = '0' + mm;
    var yyyy = String(auxDate.getFullYear());

    /*Hora*/
    var minutes = String(auxDate.getMinutes());
    if (minutes < 10) minutes = '0' + minutes;
    var hour = String(auxDate.getHours());
    if (hour < 10) hour = '0' + hour;

    var EMail = getCookie("login");
    var obtained_cookie = getCookie(EMail);
    var aux_array = JSON.parse(obtained_cookie);
    var name = aux_array[3];
    var surname = aux_array[4];
    var profile_image = aux_array[12];

    /*Creamos la estructura que se va a añadir al foro*/
    var html =
        '<div class="dv_topicmessage" style = "  background: rgb(255, 143, 51);">' +
        '<div class="dv_topicusercontent">' +
        '<div class="dv_topicprofileimg">' +
        '<img src="./resources/images/profiles/' + profile_image + '.png" alt="Imagen del Post"/>' +
        '</div>' +
        '<div class="dv_topicusername">' +
        '<p class = "p_topicusername">'
        + name + " " + surname +
        '</p>' +
        '<p class = "p_topicemail">'
        + EMail +
        '</p>' +
        '</div>' +
        '</div>' +
        '<div class="dv_usermsg">' +
        '<div class="dv_usermsgp">' +
        '<p>' + newMsg + '</p>' +
        '</div>' +
        '</div>' +
        '<div class="dv_topicpostdate">' +
        '<p>' + dd + '/' + mm + '/' + yyyy + ' a las ' + hour + ':' + minutes + '</p>' +
        '</div>' + '</div>';

    /*Añadimos el nuevo mensaje al foro*/
    var dv_topicname = "#dv_topicposts" + topicID;
    var dv_topicmsg = "#b_msgcount" + topicID;
    var msgcount = $(dv_topicmsg).text();
    msgcount.replace(/[^\d.]/g, '');
    msgcount = parseInt(msgcount, 10);
    msgcount++;
    $(dv_topicname).append(html);
    $(dv_topicmsg).text(msgcount);
    $(dv_topicmsg).parent().parent().css('background-color', 'rgb(240, 139, 11');

    var b_lastmsgauthor = "#b_lastmsgauthor" + topicID;
    $(b_lastmsgauthor).text(name + " " + surname);
    var b_lastmsgdate = "#b_lastmsgdate" + topicID;
    $(b_lastmsgdate).text(dd + "/" + mm + "/" + yyyy);
    var b_lastmsghour = "#b_lastmsghour" + topicID;
    $(b_lastmsghour).text(hour + ":" + minutes);



    /*Limpiamos la caja de Texto*/
    document.getElementById(textBox).value = '';
}