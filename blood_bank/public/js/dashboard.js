$(document).ready(function() {
    $.validator.setDefaults( {

        submitHandler: function () {     
            debugger
            $.post("/api/v1/login", {
                email: $("#email").val(),
                password: $("#password").val()
            }, function(response) {                                
                if (!response.success) alert('Email or Password was wrong!');
                else {
                    localStorage.setItem('token', response.token);
                    location.href="/dashboard";
                }
            })
            .fail(function (xhr, status, error) {
                alert("User name or Password is incorrect!");
            })
        }
    } );

   

    $( "#signinForm" ).validate( {
        rules: {
            password: {
                required: true,
                minlength: 5
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            },
            email: "Please enter a valid email address"            
        },
        errorElement: "em",
        errorPlacement: function ( error, element ) {
            // Add the `help-block` class to the error element
            error.addClass( "help-block" );
    
            if ( element.prop( "type" ) === "checkbox" ) {
                error.insertAfter( element.parent( "label" ) );
            } else {
                error.insertAfter( element );
            }
        },
        highlight: function ( element, errorClass, validClass ) {
            $( element ).parents( ".col-sm-5" ).addClass( "has-error" ).removeClass( "has-success" );
        },
        unhighlight: function (element, errorClass, validClass) {
            $( element ).parents( ".col-sm-5" ).addClass( "has-success" ).removeClass( "has-error" );
        }
    } );
})
