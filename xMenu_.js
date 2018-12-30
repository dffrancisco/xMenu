$(function () {

    $(document).click(function () {
        $(".pop_up_btn_right").fadeOut("fast");
    });

});


//var menu = new xMenu({
//    id: '#pnLocal',
//    //  buttonRight: true,
//    open: function () {
//        //meuMenu.setHtml('segunda', meuMenu.callClick().html());
//    },
//    itens: {
//        segunda: {
//            disable: true,
//            html: 'Segunda',
//            icon: 'fa-binoculars',
//            click: function () {
//                console.log('Segunda ok');
//                console.log(meuMenu.callClick().attr('cod'));
//            }
//        },
//        'terca': {
//            cod: 123,
//            id: 'myIDAlves',
//            html: 'Terça',
//            icon: 'fa-money',
//            click: function () {
//                console.log($(this).attr('cod'), 'Quarta');
//            }
//        },
//        'quarta': {
//            icon: 'fa-bicycle',
//            html: 'Quarta',
//            click: function () {
//                console.log('clink do Quarta');
//            }
//        }
//    }
//
//});
// menu.enableItem('segunda');
// menu.disableItem('segunda');
// menu.setHtml('segunda', 'segunda nova');
// menu.setIcon('segunda', 'fa fa-fire');
// menu.itens retorna os itens
// menu.callClick() retona os dados do objeto que foi clicado para aparecer o xMenu


//para usar animate é necessario usar a biblioteca animate.css


var xMenu = function (param) {
    // var element = this;
    var count = 0;
    var idsClickOff = '';

    if (param.id == undefined) {
        alert('dont find id');
    }

    var argDefalt = {
        itens: {},
        buttonRight: false,
        icon: '',
        disable: false,
        click: {},
        animate: '',
        open: false,
        callClick: {}
    };

    var arg = $.extend(argDefalt, param);

    var idxMenu = arg.id.replace(/[#. ]/g, '');

    this.disableItem = function (item) {
        disableItem(item);
    }

    function disableItem(item) {
        var id_el = arg.itens[item].id;
        arg.itens[item].disable = true;


        if (!$('#' + id_el).hasClass('dis_ok')) {
            $('#' + id_el).attr('disable', true);
            $('#' + id_el).off('click');

            $('#' + id_el).addClass('dis_ok');
            $('#' + id_el).removeClass('ena_ok');
            $('#' + id_el + ' input[type="checkbox"]').attr('disabled', 'disabled');
        }
    }

    this.enableItem = function (item) {
        enableItem(item);
    }
    function enableItem(item) {
        var id_el = arg.itens[item].id;
        arg.itens[item].disable = false;

        if (!$('#' + id_el).hasClass('ena_ok')) {
            $('#' + id_el).attr('disable', false);
            $('#' + id_el).off('click');
            $('#' + id_el).on('click', arg.itens[item].click);

            $('#' + id_el).removeClass('dis_ok');
            $('#' + id_el).addClass('ena_ok');
            $('#' + id_el + ' input[type="checkbox"]').removeAttr('disabled');
        }
    }

    this.enable = function (item, boolean) {
        if (boolean)
            enableItem(item);
        else
            disableItem(item);
    }

    this.getChecked = function (item) {
        var id_el = arg.itens[item].id.replace('popUp_id_', '');
        return $('#sw' + id_el).prop('checked');
    }

    this.itens = arg.itens;

    this.setHtml = function (item, html) {
        var id_el = arg.itens[item].id;
        $('#' + id_el).find('span').html(html);
    }

    this.setIcon = function (item, nameClass) {
        var id_el = arg.itens[item].id;
        $('#' + id_el).find('i').removeClass();
        $('#' + id_el).find('i').addClass(nameClass);
    }

    this.callClick = function () {
        return arg.callClick;
    }

    var nameClass = arg.buttonRight == true ? 'xMenu' : 'xMenu pop_up_btn_right';

    var ul = $('<ul>', {class: nameClass, id: 'popup_' + idxMenu, hidden: 'hidden'});

    var shortKeyEnable = false;

    $.each(arg.itens, function (name, props) {
        var disable = '';
        count++;



        if (props.id == undefined)
            props['id'] = 'popUp_id_' + idxMenu + count;

        if (props.disable != undefined) {
            disable = 'disabled';
            idsClickOff = '#' + props['id'] + ', ';
        }



        var html = props.html == undefined ? name : props.html;
        props.html = '';

        var divCheckbox = '<div></div>';
        if (props.checkbox != undefined) {

            divCheckbox = '<div><input type="checkbox" ' + disable + ' class="xMenuCheckIn" id="sw' + idxMenu + count + '"/>' +
                    '<label class="xMenuCheckLa"></label></div>';
            var click = props.click;

            props.click = function (e) {
                click();
                var id = e.currentTarget == undefined ? e.replace('popUp_id_', '') : e.currentTarget.id.replace('popUp_id_', '');
                $('#sw' + id).prop('checked', !$('#sw' + id).is(':checked'));
            };
        }

        var li = $('<li>', props);

        li.append(divCheckbox);

        var divIcon = '<div></div>';
        divIcon = '<div><i class="fa ' + props.icon + '"></i></div>';
        li.append(divIcon);

        li.append('<div><span>' + html + '</span></div>');

        if (props.shortKey != undefined) {
            var short = '<div><span class="short">' + props.shortKey[0] + '</span></div>';
            shortKeyEnable = true;
            li.append(short);
        }


        // li.append(li);

        ul.append(li);
    });

    $('body').append(ul);

    if (shortKeyEnable)
        $(document).on("keydown", arg.id, function (e) {
            var ctrlKey = e.ctrlKey ? 'CTRL+' : '';
            var shiftKey = e.shiftKey ? 'SHIFT+' : '';
            var altKey = e.altKey ? 'ALT+' : '';
            var key = ctrlKey + shiftKey + altKey + e.keyCode;

            $.each(arg.itens, function (i, ln) {
                if (ln.disable != true)
                    if (ln.shortKey != undefined)
                        if (key == ln.shortKey[1]) {
                            ln.click(ln.id);
                            if (e.preventDefault)
                                e.preventDefault();
                            if (e.stopPropagation)
                                e.stopPropagation();
                            return false;
                        }
            });
        });


    $(idsClickOff.substr(0, idsClickOff.length - 2)).off('click');

    if (!arg.buttonRight) {
        $(document).on("contextmenu", arg.id, function (event) {
            arg.callClick = $(this);

            if (arg.open)
                arg.open();

            event.preventDefault();

            if (arg.animate != '')
                arg.animate = 'animated ' + arg.animate;

            var op = {
                top: event.pageY + 2,
                left: event.pageX + 2,
                heightMenu: parseInt($('#popup_' + idxMenu).height()),
                widthMenu: parseInt($('#popup_' + idxMenu).width()),
                innerHeight: window.innerHeight,
                innerWidth: window.innerWidth
            };

            if (op.innerHeight - (op.heightMenu + op.top) < 0)
                op.top = op.top - op.heightMenu - 2;

            if (op.innerWidth - (op.widthMenu + op.left) < 0)
                op.left = op.left - op.widthMenu - 2;

            $('#popup_' + idxMenu).show().css({top: op.top, left: op.left}).addClass(arg.animate);

        });
    }

//    botão esquerdo 
    if (arg.buttonRight) {
        //para abrir
        $(document).on('click', arg.id, function (event) {
            arg.callClick = $(this);
            if (arg.open)
                arg.open();

            if (arg.animate != '')
                arg.animate = 'animated ' + arg.animate;

            var op = {
                top: event.pageY + 2,
                left: event.pageX + 2,
                heightMenu: parseInt($('#popup_' + idxMenu).height()),
                widthMenu: parseInt($('#popup_' + idxMenu).width()),
                innerHeight: window.innerHeight,
                innerWidth: window.innerWidth
            };

            if (op.innerHeight - (op.heightMenu + op.top) < 0)
                op.top = op.top - op.heightMenu - 2;

            if (op.innerWidth - (op.widthMenu + op.left) < 0)
                op.left = op.left - op.widthMenu - 2;

            $('#popup_' + idxMenu).show().css({top: op.top, left: op.left}).addClass(arg.animate);

        });

//        para fechar
        $(document).on('click', function (e) {
            if ((!e.target.matches(arg.id)) && (!e.target.matches(arg.id + ' i')))
                $('#popup_' + idxMenu).hide('fast');

        });


    }
};

xMenuShortKey = {
    enter: [13, 13],
    ctrl: ['CTRL', 'Ctrl'],
    shift: ['SHIFT', 'Shit'],
    ALT: ['ALT', 'Alt'],
    ctrl_G: ['Ctrl+G', 'CTRL+71'],
    ctrl_B: ['Ctrl+B', 'CTRL+66'],
    ctrl_Z: ['Ctrl+Z', 'CTRL+90'],
    ctrl_p: ['Ctrl+P', 'CTRL+80'],
    F1: ['F1', 112],
    F2: ['F2', 113],
    F3: ['F3', 114],
    F4: ['F4', 115],
    F5: ['F5', 116],
    F6: ['F6', 117],
    F7: ['F7', 118],
    F8: ['F8', 119],
    F9: ['F9', 120],
    F10: ['F10', 121],
    F11: ['F11', 122],
    F12: ['F12', 123]

};