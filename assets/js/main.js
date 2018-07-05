$(document).ready ( function () {
	var _tokens = [
		{
			title : 'IDEX',
			capital : 3,
			icon : 'idex.png'
		},
		{
			title : 'OpenLadger',
			capital : 0.3,
			icon : 'openledger.png'
		},
		{
			title : 'AirSwap',
			capital : 18,
			icon : 'airswap.png'
		},
		{
			title : 'Waves Dex',
			capital : 270,
			icon : 'wavesplatform.png'
		},
		{
			title : 'LegolasExchange',
			capital : 23,
			icon : 'lgo_exchange.png'
		},
		{
			title : 'ConterParty',
			capital : 20.4,
			icon : 'counterparty.png'
		},
		{
			title : 'Enigma Catalyst',
			capital : 106.3,
			icon : 'enigma.png'
		},
		{
			title : 'CryptoBridge',
			capital : 24,
			icon : 'crypto-bridge.png'
		},
		{
			title : 'Bancor Network',
			capital : 141,
			icon : 'bancor.png'
		},
		{
			title : 'Kyber Network',
			capital : 107,
			icon : 'bancor_network.png'
		},
		{
			title : 'Mothership',
			capital : 16,
			icon : 'mothership.png'
		},
		{
			title : 'SingularX',
			capital : 19,
			icon : 'singularx.png'
		},
		{
			title : 'Heat',
			capital : 3,
			icon : 'heatwallet.png'
		},
		{
			title : 'Stellar Dex',
			capital : 3540,
			icon : 'stellar_dex.png'
		},
		{
			title : 'Lykke Exchange',
			capital : 18.9,
			icon : 'lykke.png'
		},
		{
			title : 'Aphelion',
			capital : 6,
			icon : 'aphelion.png'
		},
		{
			title : 'Republic Protocol',
			capital : 23.5,
			icon : 'republicprotocol.png'
		},
		{
			title : 'Omise Go',
			capital : 734,
			icon : 'omnise_go.png'
		}
	];
	( function () {
		$(document).delegate('#swap-online-form DIV.form-input-droplist LI','click', function (e) {
			e.preventDefault();
			var holder = $($(e.target).parents('DIV.form-input-droplist')[0]);
			holder.find('INPUT[type="text"]').val($(e.target).data('value'));
			holder.find('INPUT[type="checkbox"]')[0].checked = false;
		} );
	} )();
	( function () {
		
		/* Render Tokens */
		var _max_capital = 0;
		/* Сортируем по капиталу */
		_tokens.sort(function(a, b){return b.capital - a.capital});
		
		var _token_holder = $('#swap-online-form UL.other-capitalize');
		var _token_templ = $('#swap-online-form UL.other-capitalize LI.other-capitalize-templ');
		$.each(_tokens, function (i,token) {
			token.calced_capital = token.capital*10000000;
			var _token_row = _token_templ.clone().removeClass('other-capitalize-templ');
			if (token.icon) {
				$(_token_row.find('>U')).css( { 
					backgroundImage : 'url(./assets/img/tokens/'+token.icon+')'
				} );
			} else {
				_token_row.addClass('-no-icon');
			}
			$(_token_row.find('>STRONG')).html(token.title);
			$(_token_row.find('>SPAN')).html((token.calced_capital)+' $');
			$(_token_row).data('capital',token.calced_capital);
			_token_holder.append(_token_row);
		} );
	} )();
	/* TOKEN PRICE SCROLLER */
	var _scale = 1;
	var _has_scale = 0.65;
	var _cookie = {
		set : function(c_name, value, expiredays) {
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + expiredays);
			document.cookie = c_name + "=" + value + ";path=/" + ((expiredays ==null) ? "" : ";expires=" + exdate.toGMTString());
		},
		has : function get(name , defaultValue ) {
			var dc = document.cookie;
			var prefix = name +"=";
			var begin = dc.indexOf("; " + prefix);
			if (begin == -1) {
				begin = dc.indexOf(prefix);
				if (begin != 0) return false;
			};
			return true;
		},
		get : function get(name , defaultValue ) {
			var dc = document.cookie;
			var prefix = name +"=";
			var begin = dc.indexOf("; " + prefix);
			if (begin == -1) {
				begin = dc.indexOf(prefix);
				if (begin != 0) return defaultValue;
			} else {
				begin += 2;
			}
			var end = document.cookie.indexOf(";", begin);
			if (end == -1) {
				end = dc.length;
			}
			return unescape(dc.substring(begin + prefix.length, end));
		}
	};
	
	var _eth_helper = {
		isAddress : function (address) {
			if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
				// check if it has the basic requirements of an address
				return false;
			} else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
				// If it's all small caps or all all caps, return true
				return true;
			} else {
				// Otherwise check each case
				return this.isChecksumAddress(address);
			}
		},
		isChecksumAddress : function (address) {
			// Check each case
			address = address.replace('0x','');
			var addressHash = sha3(address.toLowerCase());
			for (var i = 0; i < 40; i++ ) {
				// the nth letter should be uppercase if the nth digit of casemap is 1
				if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
					return false;
				}
			}
			return true;
		}
	};
	
	var _round_float = function (value, precision) {
		var multiplier = Math.pow(10, precision || 0);
		return Math.round(value * multiplier) / multiplier;
	};
	( function () {
		var _is_rolling = false;
		var _min = 0.1;
		var _max = 4;
		var _init_value = 2;
		var _round = 2;
		var _token_count = 21000000;
		
		if ($('BODY').hasClass('has-form-scale')) {
			_scale = _has_scale;
		}
		
		var _scroller = $('DIV.form-input-roller-scroller');
		var _roller = $('DIV.form-input-roller-button');
		var _roller_info = $('DIV.form-input-roller-button>EM');
		var _roller_line = $('DIV.form-input-roller-scroller>EM');
		var _input = $('DIV.form-input-roller>INPUT');
		
		var _update_roller = function (new_offset) {
			_roller.css( { 
				left : new_offset
			} );
			_roller_line.css( {
				width : new_offset
			} );
			var _offset = _max - _min;
			var _per_pixel = _offset / _scroller.width();
			var _current = _per_pixel * new_offset;
			_current = parseFloat(_current.toFixed(_round));
			_input.val(_current);
			if (new_offset===0) _current = _min;
			if (new_offset===_scroller.width()) _current = _max;
			var _capitalize = Math.round(_token_count * _current);
			$('#swap-online-form EM.form-user-capitalize').html(_capitalize+' $');
			$('#swap-online-form SPAN.form-user-capitalize').html(_capitalize+' $');
			/* Перемещаем наш токен в списке конкурентов */
			var _sorted = false;
			$.each ( $('#swap-online-form UL.other-capitalize LI'), function (i,row) {
				if (!$(row).hasClass('swap-online') && !$(row).hasClass('other-capitalize-templ')) {
					if ($(row).data('capital')<_capitalize) {
						$(row).before($('#swap-online-form UL.other-capitalize LI.swap-online'));
						_sorted = true;
						return false;
					}
				}
			} );
			if (!_sorted) {
				$('#swap-online-form UL.other-capitalize').append($('#swap-online-form UL.other-capitalize LI.swap-online'));
			}
			
			_roller_info.html(_current+'$');
		};
		(function () {
			/* init defaults */
			$('SPAN.form-input-roller-min').html(_min+'$');
			$('SPAN.form-input-roller-max').html(_max+'$');
			var _roller_pos = _scroller.width() / (_max-_min) * _init_value;
			_update_roller(_roller_pos);
		})();
		_input[0].setRate = function (value) {
			var _roller_pos = _scroller.width() / (_max-_min) * value;
			_update_roller(_roller_pos);
		};
		_roller.bind('mousedown', function(e) {
			e.preventDefault();
			if ($('BODY').hasClass('has-form-scale')) {
				_scale = _has_scale;
			} else {
				_scale = 1;
			}
			_is_rolling = true;
		} );
		_scroller.bind('click', function (e) {
			if (!$(e.target).hasClass('form-input-roller-button')
				&& !$(e.target).parents('.form-input-roller-button').length
			) {
				_update_roller(e.offsetX);
			}
		} );
		$(document).bind('mousemove', function (e) {
			if (_is_rolling) {
				e.preventDefault();
				var _new_left = e.pageX - _scroller.offset().left
				if (_new_left<0) { _new_left = 0; };
				if (_new_left>_scroller.width()*_scale) { _new_left = _scroller.width()*_scale ; };
				_update_roller(_new_left/_scale);
			}
		} );
		$(document).bind('mouseup', function (e) {
			_is_rolling = false;
		} );
	} )();
	/* Scale height fix */
	var _scale_height_fix = function () {
		var active_section = $('SECTION#swap-online-form>ARTICLE.active');
		$('DIV#swap-online-form-holder').css( { height : active_section.height()*_scale } );
	}
	_scale_height_fix();
	$(window).bind('resize', _scale_height_fix );
	/* Добавление и удаление элементов в списке работ */
	( function () {
		$('#swap-online-form A.form-add-more-work').bind('click', function (e) {
			e.preventDefault();
			$('#swap-online-form UL.form-work-holder').append(
				$('#swap-online-form LI.form-work-input-templ').
					clone().
					removeClass('form-work-input-templ') 
				);
			$('#swap-online-form UL.form-work-holder').removeClass('form-work-one');
			_scale_height_fix();
		} );
		$(document).delegate('#swap-online-form LI A','click', function (e) {
			e.preventDefault();
			$(e.target).parent().remove();
			if ($('#swap-online-form LI.form-work-row').length===2) {
				$('#swap-online-form UL.form-work-holder').addClass('form-work-one');
			}
			_scale_height_fix();
		} );
	} )();
	/* ------------------------ END ------------------ */
	/* Получаем курс */
	var _eth_usd = 1;
	var _works_list = [];
	var _money_dollar = 0;
	var _money_eth = 0;
	var _token_percent = 10;
	var _token_price = _cookie.get("tokenPrice",2);
	var _token_count = 0;
	var _eth_after_count = 0;
	var _eth_address = "";
	/* Init Values from cookie */
	(function () {
		$('#input-token-percent').val(_cookie.get("tokenPercent",10)+'%');
		$('#form-input-fio').val(_cookie.get("fio"),"");
		$('#form-input-eth-address').val(_cookie.get("address",""));
	} )();
	/* End Init values from cookie */
	
	var _scroll_to_top = function () {
		$('html, body').animate({
			scrollTop: $("#swap-online-form").offset().top
		}, 500 );
	};
	var _filter_dot_number = function (e) {
		if ((e.charCode >= 48 && e.charCode <= 57) ||  
			e.charCode === 46 || e.charCode === 0 || e.charCode === 44 
		) { } else {
			e.preventDefault();
		}
	};
	var _fix_dot_number_and_check = function (e) {
		if (e.key === "," ) {
			e.target.value = e.target.value.split(',').join('.');
		};
		try {
			var test = parseFloat(e.target.value);
			if (test!=e.target.value) {
				$(e.target).addClass('has-error');
			} else {
				$(e.target).removeClass('has-error');
			}
		} catch (err) {
			$(e.target).addClass('has-error');
		}
	};
	var _convert_dollar_to_eth = function () {
		try {
			var _val = parseFloat($('#form-input-dollar').val())/_eth_usd;
			if (!isNaN(_val)) {
				$('#form-input-eth').val(_round_float(_val,2)).removeClass('has-error');
			}
		} catch (e) {}
	};
	var _convert_eth_to_dollar = function () {
		try {
			var _val = parseFloat($('#form-input-eth').val())*_eth_usd;
			if (!isNaN(_val)) {
				$('#form-input-dollar').val(_round_float(_val,2)).removeClass('has-error');
			}
		} catch (e) {}
	};
	var _corrent_double = function (val) {
		var test = '';
		try {
			test = parseFloat(val);
			if (test<=0) return false;
		} catch(e) {};
		return (test.toString()===val) ? true : false;
	};
	$.getJSON( 'https://api.coinbase.com/v2/exchange-rates?currency=ETH', function (rates) {
		_eth_usd = rates.data.rates.USD;
		$('#form-input-dollar').attr('disabled', false);
		$('#form-input-eth').attr('disabled', false);
	} );
	$(document).delegate('INPUT','focus', function (e) {
		$(e.target).removeClass('has-error');
	});
	$('#form-input-dollar').bind('keypress', _filter_dot_number );
	$('#form-input-dollar').bind('keyup', function (e) {
		_fix_dot_number_and_check(e);
		_convert_dollar_to_eth();
	});
	$('#form-input-eth').bind('keypress',_filter_dot_number);
	$('#form-input-eth').bind('keyup', function (e) {
		_fix_dot_number_and_check(e);
		_convert_eth_to_dollar();
	});
	$('#form-input-dollar').bind('change', function (e) {
		/* Расчитываем количество эфира */
		_convert_dollar_to_eth();
	} );
	$('#form-go-to-step-2').bind('click', function (e) {
		e.preventDefault();
		var _has_errors = false;
		if (!$('#form-input-fio').val().length) {
			$('#form-input-fio').addClass('has-error');
			_has_errors = true;
		};
		if (!$('#form-input-dollar').val().length
			|| $('#form-input-dollar').hasClass('has-error')
			|| !_corrent_double($('#form-input-dollar').val())
		) {
			$('#form-input-dollar').addClass('has-error');
			_has_errors = true;
		};
		if (!$('#form-input-eth').val().length
			|| $('#form-input-eth').hasClass('has-error')
			|| !_corrent_double($('#form-input-eth').val())
		) {
			$('#form-input-eth').addClass('has-error');
			_has_errors = true;
		};
		/* Проверяем заполненость работ */
		_works_list = [];
		$.each($('#form-works-holder INPUT'), function (index,input) {
			/* Пропускаем шаблон */
			if (!$(input).parent().hasClass('form-work-input-templ')) {
				if (!$(input).val().length) {
					_has_errors = true;
					$(input).addClass('has-error');
				} else {
					_works_list.push($(input).val());
				}
			}
		} );
		if (!_has_errors) {
			/* Запомним сумму в долларах и эфире */
			_money_dollar = _round_float(parseFloat($('#form-input-dollar').val()),2)
			_money_eth = _round_float(parseFloat($('#form-input-eth').val()),2)
			/* Заполним список выполненых работ */
			$('#form-preview-work LI:not(.result-work-templ)').remove();
			$.each(_works_list, function (i,info) {
				$('#form-preview-work').append(
					$('#form-preview-work LI.result-work-templ').clone().removeClass('result-work-templ').html(info)
				);
			} );
			/* Заполняем поля с данными результатов */
			$('[data-target="total-money"]').html('$'+_money_dollar);
			$('[data-target="eth-price"]').html('$'+_eth_usd);
			$('#form-step-1').removeClass('active');
			$('#form-step-2').addClass('active');
			$('BODY').attr('data-step','2');
			_scroll_to_top();
			_scale_height_fix();
			/* roller update */
			$('#input-token-price')[0].setRate(_token_price);
		}
	} );
	$('#go-to-step-3').bind('click', function (e) {
		e.preventDefault();
		/* Процентное соотношение токенов и его цена */
		_token_percent = parseInt($('#input-token-percent').val());
		_token_price = parseFloat($('#input-token-price').val());
		/* Процент суммы, которых хотим в токенах получить */
		var _token_percent_money = _round_float(_money_dollar / 100 * _token_percent,2);
		
		/* Вычисляем, сколько процентное соотношение токенов */
		_token_count = parseInt(_token_percent_money / _token_price);
		/* Сколько осталось денег, которые будут в эфире */
		var _eth_money = _round_float(_money_dollar - _token_percent_money,2);
		/* Сколько это будет в эфире */
		_eth_after_count = _round_float(_eth_money / _eth_usd,2);
		
		$('[data-target="token-percent"]').html(_token_percent+'%');
		$('[data-target="token-total"]').html('$'+_token_percent_money);
		$('[data-target="token-count"]').html(_token_count);
		$('[data-target="eth-total"]').html('$'+_eth_money);
		$('[data-target="eth-count"]').html(_eth_after_count);
		$('[data-target="token-price"]').html(_token_price);
		$('#form-step-2').removeClass('active');
		$('#form-step-3').addClass('active');
		$('BODY').attr('data-step','3');
		_scroll_to_top();
		_scale_height_fix();
	} );
	$('#go-to-step-1').bind('click', function (e) {
		e.preventDefault();
		$('#form-step-3').removeClass('active');
		$('#form-step-1').addClass('active');
		$('BODY').attr('data-step','1');
		_scale_height_fix();
	} );
	$('#go-to-finish').bind('click', function (e) {
		e.preventDefault();
		
		if (!_eth_helper.isAddress($('#form-input-eth-address').val())) {
			$('#form-input-eth-address').addClass('has-error');
			return;
		};
		_eth_address = $('#form-input-eth-address').val();
		$('#form-step-3').removeClass('active');
		$('#form-finish').addClass('active');
		$('BODY').attr('data-step','finish');
		_scale_height_fix();
		_scroll_to_top();
		/* Save cookie */
		_cookie.set("tokenPercent", _token_percent);
		_cookie.set("fio",$('#form-input-fio').val());
		_cookie.set("tokenPrice",_token_price);
		_cookie.set("address",_eth_address);
		/* End Save cookie */
		var _order_data = {
			fio : $('#form-input-fio').val(),
			address : _eth_address,
			works : _works_list,
			token_price : _token_price,
			token_percent : _token_percent,
			token_count : _token_count,
			eth_price : _eth_usd,
			eth_count : _eth_after_count,
			money : _money_dollar
		}
		$.ajax( {
			type : 'POST',
			url : './save.php',
			data : _order_data,
			complete : function (rv) {}
		});
	} );
} );