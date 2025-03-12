"use strict";

var ateJQ = jQuery.noConflict(true); // ✅ Define ateJQ globally

(function ($) {
  ////////////////////////
  // Setup editor buttons
  $("#convertHTMLButton").click(function () {
    console.log("convertHTMLButton clicked");
    var text = $("#demoDiv").get(0).innerHTML;
    console.log("HTML:", text);
    $("#demoDiv").text(text);
  });

  $("#demoDivButton").click(function () {
    $("#convertHTMLButton").addClass("active");
    $("#demoDiv").addClass("active");
    $("#demoTextArea").removeClass("active");
  });

  $("#demoTextareaButton").click(function () {
    $("#convertHTMLButton").removeClass("active");
    $("#demoTextArea").addClass("active");
    $("#demoDiv").removeClass("active");
  });
})(ateJQ);