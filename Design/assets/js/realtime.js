
$(document).ready(function() {

    const socket = io()
    socket.on('frdreq', (data) => {
        if ($('.icon-dropdown:nth-child(1) .badge').length == 0) {
            $('.icon-dropdown:nth-child(1)').prepend('<div class="badge"></div>')
        }
        badge = $('.icon-dropdown:nth-child(1) .badge').html()
        if (badge === '') {
            badge = 0
        }
        badge = parseInt(badge) + 1
        $('.icon-dropdown:nth-child(1) .badge').html(badge)
        if ($('.icon-dropdown:nth-child(1) .dropdown ul').length == 0) {
            $('.icon-dropdown:nth-child(1) .dropdown p').after('<ul id="people"></ul>')
            $('.icon-dropdown:nth-child(1) .dropdown .empty').remove()
        }
        if ($('.icon-dropdown:nth-child(1) .dropdown ul').children().length > 3) {
            $('.icon-dropdown:nth-child(1) .dropdown ul li').last().remove()
        }
        $('.icon-dropdown:nth-child(1) .dropdown ul').prepend(data)
        acceptFriend()
    })

    socket.on('ownfrd', (data) => {
        if ($('#addfd').length) {
            const uid = $('#addfd').attr('data-uid')
            if (uid === data) {
                $('#control_block').html('<button id="accfd" type="button" data-uid="' + data + '">Accept Friend Request</button>')
                acceptFriend2()
            }
        }
    })

    socket.on('accfrd', (data) => {
        $('#control_block').html(data)
        removeFriend()
    })

    socket.on('rmfrd', (data) => {
        $('#control_block').html(data)
        addFriend()
    })

    socket.on('post', (data) => {
        $('li.status').after(data)
        const ts = $('li.status').next().find('.time1').attr('livestamp')
        $('li.status').next().find('.time1').on('change.livestamp', function(event, from, to) {
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

    // Functions
    
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

})
