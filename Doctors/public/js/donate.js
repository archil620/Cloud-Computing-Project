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

})(jQuery);

function approved(id) {
    debugger
    $.ajax({
        type: 'POST',
        url: '/api/approved',
        data: {id: id},
        success: function(data) {
            if (data.success) window.location.href='/finishing';
            else alert(data.message);
        }
    });
}

function checkbody(id) {
    $.ajax({
        type: 'POST',
        url: '/api/checkbody',
        data: {id: id},
        success: function(data) {
            if (data.success) window.location.href='/checking';
            else alert(data.message);
        }
    });
}

