$(document).ready(function() {
    
    $('.tabs').tabs()

    function errormsg(tag, msg) {
        $(tag).addClass('invalid')
        if (!$(tag).parent().find('span').length) {
            $(tag).after('<span class="helper-text" data-error="' + msg + '"></span>')
        } else {
            $(tag).parent().find('span').attr('data-error', msg)
        }
        return false
    }

    $('#reg').click(function(e) {
        let sub = true
        let emchk = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
        let fn = $('#fn').val().trim()
        let ln = $('#ln').val().trim()
        let em = $('#em').val().trim()
        let pw = $('#pw').val().trim()
        if (fn === "") {
            sub = errormsg('#fn', "Enter Your First Name")
        }
        if (ln === "") {
            sub = errormsg('#ln', "Enter Your Last Name")
        }
        if (em === "") {
            sub = errormsg('#em', "Enter Your Email Address")
        } else if (!emchk.test(em)) {
            sub = errormsg('#em', "Invalid Email Address")
        }
        if (pw === "") {
            sub = errormsg('#pw', "Enter Your Password")
        } else if (pw.length < 6) {
            sub = errormsg('#pw', "Password must be atleast 6 characters")
        }
        
        if (sub) {
            $('form').css("display", "none")
            $('.loader').css("display", "block")
            return true;
        }
        return false;
    })

    $('#log').click(() => {
        let sub = true
        let em = $('#lem').val().trim()
        let pw = $('#lpw').val().trim()
        if (em === "") {
            sub = errormsg('#lem', 'Enter Your User Name or Email Address')
        }
        if (pw === "") {
            sub = errormsg('#lpw', 'Enter Your Password')
        }

        if (sub) {
            $('form').css("display", "none")
            $('.loader').css("display", "block")
            return true;
        }
        return false;
    })

})