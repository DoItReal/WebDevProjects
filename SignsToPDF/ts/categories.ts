var selectedCategories = [];
$(document).ready(function () {
    "use strict";
    /*---------------
    --------- Converting Options into list (own structure) -------- */

    var myUl = [];

    $(".custom-select option").each(function () {
        var optionText = $(this).text();
        var optionValue = $(this).val();
        var thisList = $(this).parent();

        myUl.push(
            '<li><label><input type="checkbox"/>' + optionText + '</label></li>'
        );
    });

    var $p = $("<p />", {
        class: "select",
        html:
            '<span class="placeHolder">Select</span>'
    });

    var $ul = $("<ul/>", {
        class: "filter_list",
        html: myUl.join("")
    });

    var expendBefore = $("<div />", {
        class: "select_box_area",
        html: [$p, $ul]
    });

    $(".custom-select").before(expendBefore);


    /*---------------
    --------- Toggle Multiselect list -------- */

    $(document).on("click", ".select", function () {
        var filterList = $(this).next(".filter_list");

        if (filterList.is(":hidden")) {
            $(filterList).fadeIn();
            $(this).find("em").addClass("angle-up");
        } else {
            $(filterList).fadeOut();
            $(this).find("em").removeClass("angle-up");
        }
    });

    /*---------------
    --------- Check and uncheck Options from the list -------- */

    $(document).on("click", '.filter_list input[type="checkbox"]', function () {
        var inputVal = $(this).parent("label").text();
        var placeholderSpan = $(".placeHolder");
        var findVal = $(".select").find('span[data-title="' + inputVal + '"]');

        if ($(this).is(":checked")) {
            placeholderSpan.remove();
            $(".select").append(
                '<span data-title="' +
                inputVal +
                '" class="option">' +
                inputVal +
                "</span>"
            );
            selectedCategories.push(inputVal);
        } else {
            if ($(".select span").length >= 1) {
                findVal.remove();
                //TO FIX NOT WORKING RIGHT
                selectedCategories.splice(selectedCategories.indexOf(inputVal),1);
            }
            if ($(".select span").length < 1) {
               
                $(".select").append('<span class="placeHolder">Select</span>');
            }
        }
    });


});
