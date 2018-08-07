(function($) {
    "use strict"; // Start of use strict   
    
    $("#bloodLink").click(function() {
        $("#donate #donateType").val("BL");
        $("#bloodModal").modal();
    });

    $("#organLink").click(function() {
        $("#donate #donateType").val("OG");
        $("#bloodModal").modal();
    });

    $("#tissueLink").click(function() {
        $("#donate #donateType").val("TI");
        $("#bloodModal").modal();
    });    

    $( "#donate" ).validate( {        
        errorElement: "em",
        errorPlacement: function ( error, element ) {
            // Add the `help-block` class to the error element
            error.addClass( "invalid-tooltip" );
    
            if ( element.prop( "type" ) === "checkbox" ) {
                error.insertAfter( element.parent( "label" ) );
            } else {
                error.insertAfter( element );
            }
        }
    });
    
    var el, newPoint, newPlace, offset;
 
// Select all range inputs, watch for change
    $("input[type='range']").change(function() {

        // Cache this for efficiency
        el = $(this);
        
        // Measure width of range input
        var width = el.width();
        newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
        var newVal = el.val();        
        var attr = el.attr('float');
        if (typeof attr !== typeof undefined && attr !== false) newVal=newVal/100;
        if (typeof el.attr('dec') !== typeof undefined && el.attr('dec') !== false) newVal=newVal/10;
        // Figure out placement percentage between left and right of input
        
        
        offset = -1;

        // Prevent bubble from going beyond left or right (unsupported browsers)
        if (newPoint < 0) { newPlace = 0; }
        else if (newPoint > 1) { newPlace = width; }
        else { newPlace = width * newPoint + offset; offset -= newPoint; }
        
        // Move bubble
        el
        .next("output")
        .css({
            left: newPlace,
            marginLeft: offset + "%"
        })
        .text(newVal);
    })
    // Fake a change to position bubble at page load
    .trigger('change');
    
})(jQuery);

function send(id) {
    $("#donate #appId").val(id);
    $("#doctorModal").modal();
}

function checkbody(id) {
    $("#checkbodyModal #appId").val(id);
    $("#checkbodyModal").modal();
}
