var selectedCategories = [];
$(document).ready(function () {
    "use strict";
    /*---------------
    --------- Converting Options into list (own structure) -------- */
    var myUl = [];
    $(".categories .custom-select option").each(function () {
        var optionText = $(this).text();
        var optionValue = $(this).val();
        var thisList = $(this).parent();
        myUl.push('<li><label><input type="checkbox"/>' + optionText + '</label></li>');
    });
    var $p = $("<p />", {
        class: "select",
        html: '<span class="placeHolder">Select</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="down-angle"><path d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"/></svg>'
    });
    var $ul = $("<ul/>", {
        class: "filter_list",
        html: myUl.join("")
    });
    var expendBefore = $("<div />", {
        class: "select_box_area",
        html: [$p, $ul]
    });
    $(".categories .custom-select").before(expendBefore);
    /*---------------
    --------- Toggle Multiselect list -------- */
    $(document).on("click", ".categories .select", function () {
        var filterList = $(this).next(".filter_list");
        if (filterList.is(":hidden")) {
            $(filterList).fadeIn();
            $(this).find("svg").addClass("angle-up");
        }
        else {
            $(filterList).fadeOut();
            $(this).find("svg").removeClass("angle-up");
        }
    });
    /*---------------
    --------- Check and uncheck Options from the list -------- */
    $(document).on("click", '.categories .filter_list input[type="checkbox"]', function () {
        var inputVal = $(this).parent("label").text();
        var placeholderSpan = $(".placeHolder");
        var findVal = $(".categories .select").find('span[data-title="' + inputVal + '"]');
        if ($(this).is(":checked")) {
            placeholderSpan.remove();
            $(".categories .select").append('<span data-title="' +
                inputVal +
                '" class="option">' +
                inputVal +
                "</span>");
            selectedCategories.push(inputVal);
        }
        else {
            if ($(".categories .select span").length >= 1) {
                findVal.remove();
                //TO FIX NOT WORKING RIGHT
                selectedCategories.splice(selectedCategories.indexOf(inputVal), 1);
            }
            if ($(".categories .select span").length < 1) {
                $(".categories .select").append('<span class="placeHolder">Select</span>');
            }
        }
    });
});
//tools
function resetCatnAll() {
    $('.filter_list input[type="checkbox"]').each(function () {
        if ($(this).is(":checked"))
            $(this).click();
    });
}
//# sourceMappingURL=categories.js.map