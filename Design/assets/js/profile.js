
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

    $('#settings #pfpic button:nth-of-type(1)').click(function() {
        $('#settings #pfpic input').click()
    })

    $('#settings #pfpic input').change(function() {
        const file = this.files[0]
        const type = ["image/gif", "image/jpeg", "image/png"]
        if ($.inArray(file['type'], type) < 0) {
            $('#settings #pfpic p').text("Please Select an Image File").css("display", "block").css("color", "#F44336")
            $(this).val("")
            if ($('#settings #pfpic .cvcon').length) {
                $('#settings #pfpic img').attr('src', 'images/blank_cover.jpg')
            } else {
                $('#settings #pfpic img').attr('src', 'images/bdp.png')
            }
            $('#settings #pfpic button:nth-of-type(2)').css('display', 'none')
        } else {
            $('#settings #pfpic p').text("Showing Preview").css("display", "block").css("color", "#4CAF50")
            let r = new FileReader()
            r.onload = function(e) {
                $('#settings #pfpic img').attr('src', e.target.result)
            }
            r.readAsDataURL(file)
            $('#settings #pfpic button:nth-of-type(2)').css('display', 'inline-block').css('margin-left', '10px')
        }
    })

    $('#settings #pfpic button:nth-of-type(2)').click(function() {
        let file =  $('#settings #pfpic input')[0].files[0]
        let d = new FormData()
        d.append('pf', file)
        $.ajax({
            type: 'POST',
            data: d,
            contentType: false,
            cache: false,
            processData: false,
            beforeSend: function() {
                $('#settings #pfpic p').text("Uploading Please Wait...!!!")
                $('#settings #pfpic .progress').css('display', 'inline-block').css('margin-bottom', '30px')
                $('#settings #pfpic button').css('display', 'none')
            },
            xhr: function() {
                let xhr = new window.XMLHttpRequest()
                xhr.upload.addEventListener('progress', function(e) {
                    if (e.lengthComputable) {
                        let per = Math.round((e.loaded / e.total) * 100)
                        $('#settings #pfpic .curr').css('width', per + '%').text(per + '%')
                    }
                })
                return xhr
            },
            success: function(r) {
                $('#settings #pfpic p').text(r)
                $('#settings #pfpic input').val("")
                setTimeout(function() {
                    $('#settings #pfpic .progress').css('display', 'none')
                    $('#settings #pfpic button:nth-of-type(1)').css('display', 'inline-block')
                    location.reload(true)
                }, 2000)
            }
        })
    })

    $('.time').each(function() {
        const ts = $(this).attr('livestamp')
        $(this).on('change.livestamp', function(event, from, to) {
            event.preventDefault()
            const dt = moment()
            const delta = dt.diff(new Date(ts).getTime())
            if (delta < 86400000) {
                $(this).html(to)
            } else {
                $(this).html(moment(ts).format('Do MMM YYYY'))
            }
        }).livestamp(new Date(ts))
    })

    $('.time1').each(function() {
        const ts = $(this).attr('livestamp')
        $(this).on('change.livestamp', function(event, from, to) {
            event.preventDefault()
            const dt = moment()
            const delta = dt.diff(new Date(ts).getTime())
            if (delta < 86400000) {
                $(this).html(to)
            } else {
                $(this).html(moment(ts).format('Do MMM h:mm a'))
            }
        }).livestamp(new Date(ts))
    })

    const addFriend = () => {
        $('#addfd').click(function() {
            const uid = $(this).attr('data-uid')
            const el = $(this)
            $.ajax({
                url: '/friends/add',
                type: 'POST',
                data: { uid },
                beforeSend: function() {
                    el.hide()
                    el.parent().append('<button type="button">Sending...!!!</button>')
                },
                success: function(r) {
                    if (r.msg === 'unauthorized') {
                        location.reload(true)
                    } else if (r.msg === 'invalid') {
                        el.next().text('Error! Try Again Later!')
                        setTimeout(function() {
                            el.next().remove()
                            el.show()
                        }, 2000)
                    } else if (r.msg === 'success') {
                        el.next().text('Friend Request Sent')
                        el.remove()
                    }
                }
            })
        })
    }

    const removeFriend = () => {
        $('#rmfd').click(function() {
            const uid = $(this).attr('data-uid')
            const el = $(this)
            $.ajax({
                url: '/friends/remove',
                type: 'POST',
                data: { uid },
                beforeSend: function() {
                    el.hide()
                    el.next().hide()
                    el.prev().text('Removing, Please Wait...!!!')
                },
                success: function(r) {
                    if (r.msg === 'unauthorized') {
                        location.reload(true)
                    } else if (r.msg === 'invalid') {
                        el.prev().text('Error! Try Again Later!')
                        setTimeout(function() {
                            el.show()
                            el.next().show()
                            el.prev().text('Already Friends')
                        }, 2000)
                    } else if (r.msg === 'success') {
                        el.hide()
                        el.next().remove()
                        el.prev().text('Friend Removed')
                        setTimeout(function() {
                            el.prev().text('Add Friend').attr('id', 'addfd').attr('data-uid', uid)
                            addFriend()
                            el.remove()
                        }, 2000)
                    }
                }
            })
        })
    }

    const acceptFriend = () => {
        $('.accept-reject button:first-child').click(function() {
            const uid = $(this).attr('data-uid')
            const el = $(this)
            $.ajax({
                url: '/friends/accept',
                type: 'POST',
                data: { uid },
                beforeSend: function() {
                    el.hide()
                    el.parent().append('<button type="button">Please Wait</button>')
                    if ($('#accfd').length) {
                        $('#accfd').hide()
                        $('#accfd').before('<button type="button">Accepting Friend Request</button>')
                    }
                },
                success: function(r) {
                    if (r.msg === 'unauthorized') {
                        location.reload(true)
                    } else if (r.msg === 'invalid') {
                        el.next().text('Error!')
                        if ($('#accfd').length) {
                            $('#accfd').before('<button type="button">Error! Try Again!</button>')
                        }
                        setTimeout(function() {
                            el.next().remove()
                            el.show()
                            if ($('#accfd').length) {
                                $('#accfd').prev().remove()
                                $('#accfd').show()
                            }
                        }, 2000)
                    } else if (r.msg === 'success') {
                        el.parent().parent().hide()
                        el.parent().parent().after(r.code)
                        el.parent().parent().remove()
                        if ($('#accfd').length) {
                            $('#accfd').prev().text('Already Friends')
                            $('#accfd').after('<button id="rmfd" type="button" data-uid="' + uid + '">Remove Friend</button>')
                            $('#accfd').next().after('<a href="#">Message</a>')
                            $('#accfd').remove()
                            removeFriend()
                        }
                        setTimeout(function() {
                            $('.icon-dropdown:nth-child(1) .dropdown ul p').remove()
                            if ($('.icon-dropdown:nth-child(1) .badge').length == 0) {
                                $('.icon-dropdown:nth-child(1) .dropdown ul').after('<div class="empty"><p>No Pending Requests</p></div>')
                                $('.icon-dropdown:nth-child(1) .dropdown ul').remove()
                            }
                        }, 2000)
                        badge = $('.icon-dropdown:nth-child(1) .badge').html()
                        if (badge == 1) {
                            $('.icon-dropdown:nth-child(1) .badge').remove()
                        } else {
                            badge = badge - 1
                            $('.icon-dropdown:nth-child(1) .badge').html(badge)
                        }
                    }
                }
            })
        })
    }

    const acceptFriend2 = () => {
        $('#accfd').click(function() {
            const uid = $(this).attr('data-uid')
            const el = $(this)
            $.ajax({
                url: '/friends/accept',
                type: 'POST',
                data: { uid },
                beforeSend: function() {
                    el.hide()
                    el.before('<button type="button">Accepting Friend Request</button>')
                    if ($('#people button[data-uid=' + uid + ']').length) {
                        $('#people button[data-uid=' + uid + ']').text('Please Wait').attr('disabled', 'disabled')
                    }
                },
                success: function(r) {
                    if (r.msg === 'unauthorized') {
                        location.reload(true)
                    } else if (r.msg === 'invalid') {
                        el.prev().text('Error!')
                        if ($('#people button[data-uid=' + uid + ']').length) {
                            $('#people button[data-uid=' + uid + ']').text('Error')
                        }
                        setTimeout(function() {
                            el.prev().remove()
                            el.show()
                            if ($('#people button[data-uid=' + uid + ']').length) {
                                $('#people button[data-uid=' + uid + ']').text('Accept').removeAttr('disabled')
                            }
                        }, 2000)
                    } else if (r.msg === 'success') {
                        if ($('#people button[data-uid=' + uid + ']').length) {
                            $('#people button[data-uid=' + uid + ']').parent().parent().hide()
                            $('#people button[data-uid=' + uid + ']').parent().parent().after(r.code)
                            $('#people button[data-uid=' + uid + ']').parent().parent().remove()
                            setTimeout(function() {
                                $('.icon-dropdown:nth-child(1) .dropdown ul p').remove()
                            if ($('.icon-dropdown:nth-child(1) .badge').length == 0) {
                                $('.icon-dropdown:nth-child(1) .dropdown ul').after('<div class="empty"><p>No Pending Requests</p></div>')
                                $('.icon-dropdown:nth-child(1) .dropdown ul').remove()
                            }
                            }, 2000)
                        }
                        el.prev().text('Already Friends')
                        el.after('<button id="rmfd" type="button" data-uid="' + uid + '">Remove Friend</button>')
                        el.next().after('<a href="#">Message</a>')
                        el.remove()
                        removeFriend()
                        badge = $('.icon-dropdown:nth-child(1) .badge').html()
                        if (badge == 1) {
                            $('.icon-dropdown:nth-child(1) .badge').remove()
                        } else {
                            badge = badge - 1
                            $('.icon-dropdown:nth-child(1) .badge').html(badge)
                        }
                    }
                }
            })
        })
    }

    $('#postbtn span:nth-child(1)').click(function() {
        $('.status input').click()
    })

    $('.status input').change(function() {
        const file = this.files[0]
        const type = ["image/gif", "image/jpeg", "image/png"]
        if ($.inArray(file['type'], type) < 0) {
            $('#posterr').text("Please Select an Image File").css("display", "block").css("color", "#F44336")
            $(this).val("")
            $('.status .imgcon').css("display", "none")
            $('#postbtn span:nth-child(1)').html('<i class="material-icons">add_a_photo</i>Add Photo')
        } else {
            $('#postbtn span:nth-child(1)').html('<i class="material-icons">add_a_photo</i>Change Photo')
            $('#posterr').text("This Photo will be added to status").css("display", "block").css("color", "#4CAF50")
            let r = new FileReader()
            r.onload = function(e) {
                $('.status .imgcon img').attr('src', e.target.result)
            }
            r.readAsDataURL(file)
            $('.status .imgcon').css("display", "block")
        }
    })

    $('#postbtn span:nth-child(3)').click(function() {
        const file = $('.status input')[0].files[0]
        const text = $('#postarea textarea').val()
        if (file || text.trim() !== '') {
            let d = new FormData()
            if (file) {
                d.append('pic', file)
            }
            if (text) {
                d.append('msg', text)
            }
            $.ajax({
                url: '/posts/add',
                type: 'POST',
                data: d,
                contentType: false,
                cache: false,
                processData: false,
                beforeSend: function() {
                    $('#posterr').css("display", "block").text("Uploading Please Wait...!!!").css("color", "#4CAF50")
                    $('.status .imgcon').css("display", "none")
                    $('#postprogress').css('display', 'block')
                    $('#postbtn span:nth-child(3)').css('display', 'none')
                },
                xhr: function() {
                    let xhr = new window.XMLHttpRequest()
                    xhr.upload.addEventListener('progress', function(e) {
                        if (e.lengthComputable) {
                            let per = Math.round((e.loaded / e.total) * 100)
                            $('#postprogress .curr').css('width', per + '%').text(per + '%')
                        }
                    })
                    return xhr
                },
                success: function(r) {
                    $('#posterr').text(r)
                    $('.status input').val('')
                    $('#postarea textarea').val('')
                    setTimeout(function() {
                        $('#postprogress').css('display', 'none')
                        $('#posterr').css("display", "none")
                        $('#postbtn span:nth-child(3)').css('display', 'inline-block')
                    }, 2000)
                }
            })
        }
    })

    $('#fs').keypress(function(e) {
        if (e.which == 13) {
            const value = $(this).val().trim()
            if (value === '') {
                $(this).attr('placeholder', 'Enter a Name to Search')
            }
        }
    })

    $('#fs').parent().next().click(function() {
        const value = $('#fs').val().trim()
        if (value === '') {
            $('#fs').attr('placeholder', 'Enter a Name to Search')
        } else {
            $('#fs').parent().submit()
        }
    })

    $('.post .footer .item:nth-child(1) span').click(function() {
        const pid = $(this).parent().parent().parent().attr('post-id')
        const state = $(this).hasClass('filled')
        const el = $(this)
        $.ajax({
            url: '/posts/like',
            type: 'POST',
            data: { pid, state },
            beforeSend: function() {
                let count = parseInt(el.find('p.count').text())
                if (state) {
                    count = count - 1
                    el.find('p.count').text(count)
                    el.removeClass('filled').find('i').text('favorite_border')
                } else {
                    count = count + 1
                    el.find('p.count').text(count)
                    el.addClass('filled').find('i').text('favorite')
                }
            },
            success: function(r) {
                if (r.msg === 'invalid') {
                    const state = el.hasClass('filled')
                    let count = parseInt(el.find('p.count').text())
                    if (state) {
                        count = count - 1
                        el.find('p.count').text(count)
                        el.removeClass('filled').find('i').text('favorite_border')
                    } else {
                        count = count + 1
                        el.find('p.count').text(count)
                        el.addClass('filled').find('i').text('favorite')
                    }
                }
            }
        })
    })
    
    addFriend()
    acceptFriend()
    acceptFriend2()
    removeFriend()

})