"use strict";
var selectedAllergens = [];
function initAllergens() {
    "use strict";
    /*---------------
    --------- Converting Options into list (own structure) -------- */
    var myUl = [];
    $(".allergens-select option").each(function () {
        var optionText = $(this).text();
        var optionValue = $(this).val();
        var thisList = $(this).parent();
        myUl.push('<li><label value=' + optionValue + '><input type="checkbox" />' + optionText + '</label></li>');
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
    $(".allergens-select").before(expendBefore);
    /*---------------
    --------- Toggle Multiselect list -------- */
    $(document).on("click", ".labelsContent .select", function () {
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
    $(document).on("click", '.labelsContent .filter_list input[type="checkbox"]', function () {
        var inputText = $(this).parent("label").text();
        var inputVal = $(this).parent("label").attr('value');
        var placeholderSpan = $(".labelsContent .placeHolder");
        var findVal = $(".labelsContent .select").find('span[data-title="' + inputText + '"]');
        if ($(this).is(":checked")) {
            placeholderSpan.remove();
            let span = $('<span/>', {
                'addClass': 'option',
                'html': pngs[Number(inputVal) - 1]
            });
            $(span).attr('data-title', inputText);
            $(".labelsContent .select").append(span);
            selectedAllergens.push(inputVal);
        }
        else {
            if ($(".labelsContent .select span").length >= 1) {
                findVal.remove();
                selectedAllergens.splice(selectedCategories.indexOf(inputText), 1);
            }
            if ($(".labelsContent .select span").length < 1) {
                $(".labelsContent .select").append('<span class="placeHolder">Select</span>');
            }
        }
    });
}
