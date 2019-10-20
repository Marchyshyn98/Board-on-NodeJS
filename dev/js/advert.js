/* eslint-disable no-undef*/
$(function () {
    // маска для вводу телефона
    $('#advert-phone').inputmask("+380-999-99-99-99");

    // remove Errors
    function removeErrors() {
        $(".advert-form p.error").remove();
        $(".advert-form input, .advert-form textarea").removeClass("error");
    }

    //clear
    $(".advert-form input, .advert-form textarea").on("focus", function () {
        removeErrors();
    }); // коли переключаємось на інпут

    // publish
    $(".publish-button, .save-button").on("click", function (e) {
        e.preventDefault();
        removeErrors();

        var isDraft =
            $(this)
                .attr('class') // дивимось клас, розділяємо строку на 2 частини, беремо першу і перевіряємо чи це publish чи save
                .split(' ')[0] === 'save-button'; // якщо = save то буде true

        var data = {
            title: $("#advert-title").val(),
            body: $("#advert-body").val(),
            phone: $("#advert-phone").val(),
            isDraft: isDraft,
            advertId: $("#advert-id").val()
        };

        $.ajax({
            type: "POST",
            data: JSON.stringify(data), // переводимо js в json формат - в стрічку
            contentType: 'application/json',
            url: "/advert/add"
        }).done(function (data) {
            console.log(data);
            if (!data.ok) {
                $(".advert-form h2").after("<p class='error'>" + data.error + "</p>");
                if (data.fields) {
                    data.fields.forEach(function (item) {
                        $("#advert-" + item).addClass("error");
                    });
                }
            } else {
                if (isDraft) {
                    $(location).attr("href", "/");
                } else {
                    $(location).attr("href", "/");
                }
            }
        });
    });
});
/* eslint-enable no-undef */