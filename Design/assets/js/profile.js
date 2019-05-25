
$(document).ready(function() {
    
    $(function() {
        if ($('.sidebar').length) {
            const el = $('.inner')
            let sb = el.offset().top + el.height()
            let bound = $('.sidebar').offset().top
            let curr = $(window).scrollTop()
            $(window).scroll(function() {
                let st = $(window).scrollTop()
                let wb = st + $(window).height()
                if (st > curr) {
                    if (el.height() < $(window).height()) {
                        if (st > bound) {
                            let d = st - bound + $('nav').height()
                            el.css({
                                position: 'relative', top: d
                            })
                        }
                    } else {
                        if (wb > sb && wb < $('footer').offset().top) {
                            let d = wb - sb
                            el.css({
                                position: 'relative', top: d
                            })
                        }
                    }
                } else {
                    let it = el.offset().top
                    if (st < it && st > bound) {
                        let d = st - bound + $('nav').height()
                        el.css({
                            position: 'relative', top: d
                        })
                    }
                    if (st < bound) {
                        el.css({
                            position: 'relative', top: 0
                        })
                    }
                }
                curr = st;
            })
        }
    })

    function changeState($cs) {
        if ($cs.val().length > 0) {
            $cs.addClass('has-value')
        } else {
            $cs.removeClass('has-value')
        }
    }

    $('.form-control').each(function() {
        changeState($(this))
    })

    $('.form-control').on('focusout', function() {
        changeState($(this))
    })

    /* $('select').each(function() {
        const th = $(this)
        const op = $(this).children('option').length
        th.after('<div class="select-styled"></div>')
        th.addClass('select-hidden')
        th.wrap('<div class="select"></div>')
    
        const s = th.next('div.select-styled')
        s.text(th.children('option').eq(0).text())
      
        const l = $('<ul />', {
            'class': 'select-options'
        }).insertAfter(s)
      
        for (let i = 0; i < op; i++) {
            $('<li />', {
                text: th.children('option').eq(i).text(),
                rel: th.children('option').eq(i).val()
            }).appendTo(l)
        }
      
        let li = l.children('li')
      
        s.click(function(e) {
            e.stopPropagation()
            $('div.select-styled.active').not(this).each(function() {
                $(this).removeClass('active').next('ul.select-options').hide()
            })
            $(this).toggleClass('active').next('ul.select-options').toggle()
        });
      
        li.click(function(e) {
            e.stopPropagation()
            s.text($(this).text()).removeClass('active')
            th.val($(this).attr('rel'))
            l.hide()
        });
      
        $(document).click(function() {
            s.removeClass('active')
            l.hide()
        });
    
    }); */

    function errormsg(tag, val, msg) {
        if (val === "") {
            $(tag).parent().find('span').html(msg).css("display", "initial").css('color', '#F44336')
            return false
        } else {
            $(tag).parent().find('span').html("").css("display", "none")
            return true
        }
    }

    $('#normal button').click(function() {
        let fn = $('#normal input[name="fn"]').val().trim()
        let ln = $('#normal input[name="ln"]').val().trim()
        sub1 = errormsg('#normal input[name="fn"]', fn, "First Name is Required")
        sub2 = errormsg('#normal input[name="ln"]', ln, "Last Name is Required")
        if (sub1 && sub2) {
            return true
        }
        return false
    })

    $('#chem button').click(function() {
        let oem = $('#chem input[name="oem"]').val().trim()
        let nem = $('#chem input[name="nem"]').val().trim()
        let cem = $('#chem input[name="cem"]').val().trim()
        sub1 = errormsg('#chem input[name="oem"]', oem, "Old Email is Required")
        sub2 = errormsg('#chem input[name="nem"]', nem, "New Email is Required")
        sub3 = errormsg('#chem input[name="cem"]', cem, "Confirm Email is Required")
        if (sub1 && sub2 && sub3) {
            return true
        }
        return false
    })

    $('#chpw button').click(function() {
        let opw = $('#chpw input[name="opw"]').val().trim()
        let npw = $('#chpw input[name="npw"]').val().trim()
        let cpw = $('#chpw input[name="cpw"]').val().trim()
        sub1 = errormsg('#chpw input[name="opw"]', opw, "Old Password is Required")
        sub2 = errormsg('#chpw input[name="npw"]', npw, "New Password is Required")
        sub3 = errormsg('#chpw input[name="cpw"]', cpw, "Confirm Password is Required")
        if (sub1 && sub2 && sub3) {
            return true
        }
        return true
    })

    $('#settings .content form span').each(function() {
        if ($(this).html() !== '') {
            $(this).css('display', 'initial')
            if ($(this).html().indexOf('Required!') == -1 && $(this).html().indexOf('Invalid') == -1 && $(this).html().indexOf('Characters') == -1) {
                $(this).css('color', '#4CAF50')
                console.log($(this).html())
            } else {
                $(this).css('color', '#F44336')
            }
            setTimeout(function() {
                $('#settings .content form span').each(function() {
                    if ($(this).html().indexOf('Required!') == -1 && $(this).html().indexOf('Invalid') == -1 && $(this).html().indexOf('Characters') == -1) {
                        $(this).css('display', 'none')
                        $(this).html("")
                    }
                })
            }, 5000)
        }
    })

})