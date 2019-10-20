/* eslint-disable no-undef*/
$(function () {
    var commentForm;
    var parentId;

    function removeErrors() {
        $(".comment-list p.error").remove();
        $(".comment textarea").removeClass("error");
    }

    $(".comment textarea").on("focus", function () {
        removeErrors();
    }); 

    // add comment
    $("#new, #reply").on("click", function () {
        if (commentForm) {
            commentForm.remove();
        }

        parentId = null;

        commentForm = $(".comment").clone(true, true); //клонуємо форму для коментаря

        if ($(this).attr('id') === "new") {
            commentForm.appendTo(".comment-list");
        } else {
            var parentComment = $(this).parent(); // parent() знаходить батьківський елемент
            parentId = parentComment.attr("id"); // беремо його id
            $(this).after(commentForm); // після батьківського комента вставляємо форму 
        }

        commentForm.css({ "display": "flex" });
    });

    // cancel
    $("form.comment .cancel").on("click", function () {
        e.preventDefault();
        commentForm.remove();
    });

    // publish
    $("form.comment .send").on("click", function (e) {
        e.preventDefault();
        removeErrors();

        var data = {
            advert: $(".comments").attr("id"), // беремо у блока comments id
            body: commentForm.find('textarea').val(), // беремо дані з клонованої форми
            parent: parentId // батьківський коментар,
        };

        $.ajax({
            type: "POST",
            data: JSON.stringify(data), // переводимо js в json формат - в стрічку
            contentType: 'application/json',
            url: "/comment/add"
        }).done(function (data) {
            console.log(data);
            if (!data.ok) {
                $('.comment-body').addClass("error");
                $(".comment").before("<p class='error'>" + data.error + "</p>");
            } else {
                location.reload();
            }
        });
    });
});
/* eslint-enable no-undef */