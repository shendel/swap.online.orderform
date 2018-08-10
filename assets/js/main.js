$(document).ready ( function () {
	/* auto step */
	let _roller_max_value = 4;
	(function() {
		let _active_step = 0;
		var _allowed_step_jumps = [ 2 ];
		var _has_query = document.location.href.indexOf("?");
		var _active_step_ok = false;
		if (_has_query!==-1) {
			_active_step = document.location.href.split("?")[1];
			var _active_step_p = _active_step.lastIndexOf('step=');
			if (_active_step_p!==-1) {
				_active_step = _active_step.substr(("step=").length);
				try {
					var _active_step_ = parseInt(_active_step,10);
					if (_active_step_.toString()===_active_step) {
						if (_allowed_step_jumps.indexOf(_active_step_)!==-1) {
							$('.form-step').removeClass('active');
							$('.form-step-'+_active_step).addClass('active');
							$('BODY').addClass('one-step-view');
							_active_step_ok = true;
						}
					}
				} catch (e) { console.log(e)}
			};			
		}
		if (!_active_step_ok) {
			$('.form-step.form-step-1').addClass('active');
		} else {
			if (_active_step==2) {
				_roller_max_value = 40;
			}
		}
	})();
	/* end auto step */
	/* blink off */
	$('BODY').addClass('-loaded');
	/* ---------- */
	var _tokens = [
		{
			title : 'IDEX',
			capital : 3,
			icon : 'idex.png',
			desc : "No Bitcoin traiding pairs"
		},
		{
			title : 'OpenLadger',
			capital : 0.3,
			icon : 'openledger.png',
			desc : "Not fully decentralised. Withdrowal fee presented"
		},
		{
			title : 'AirSwap',
			capital : 18,
			icon : 'airswap.png',
			desc : "No Bitcoin traiding pairs"
		},
		{
			title : 'Waves Dex',
			capital : 270,
			icon : 'wavesplatform.png',
			desc : "Was hacked on launch"
		},
		{
			title : 'LegolasExchange',
			capital : 23,
			icon : 'lgo_exchange.png',
			desc : "Not a decentralised exchange"
		},
		{
			title : 'ConterParty',
			capital : 20.4,
			icon : 'counterparty.png',
			desc : "No ERC20 tokens pairs"
		},
		{
			title : 'Enigma Catalyst',
			capital : 106.3,
			icon : 'enigma.png',
			desc : "Software installation required"
		},
		{
			title : 'CryptoBridge',
			capital : 24,
			icon : 'crypto-bridge.png',
			desc : "No ERC20 tokens pairs"
		},
		{
			title : 'Bancor Network',
			capital : 141,
			icon : 'bancor.png',
			desc : "No Bitcoin traiding pairs"
		},
		{
			title : 'Kyber Network',
			capital : 107,
			icon : 'bancor_network.png',
			desc : "No Bitcoin traiding pairs"
		},
		{
			title : 'Mothership',
			capital : 16,
			icon : 'mothership.png',
			desc : "They are not sure about cross-chain transaction"
		},
		{
			title : 'SingularX',
			capital : 19,
			icon : 'singularx.png',
			desc : "No Bitcoin traiding pairs"
		},
		{
			title : 'Heat',
			capital : 3,
			icon : 'heatwallet.png',
			desc : "No ERC20 tokens pairs"
		},
		{
			title : 'Stellar Dex',
			capital : 3540,
			icon : 'stellar_dex.png',
			desc : "Trade pair with XLM only. Account verification required"
		},
		{
			title : 'Lykke Exchange',
			capital : 18.9,
			icon : 'lykke.png',
			desc : "Software installation required. Account verification required"
		},
		{
			title : 'Aphelion',
			capital : 6,
			icon : 'aphelion.png',
			desc : "Software installation required"
		},
		{
			title : 'Republic Protocol',
			capital : 23.5,
			icon : 'republicprotocol.png',
			desc : "Large order oriented only"
		},
		{
			title : 'Omise Go',
			capital : 734,
			icon : 'omnise_go.png',
			desc : "ERC20 tokens mostly"
		}
	];
	( function () {
		$(document).delegate('#swap-online-form DIV.form-input-droplist LI','click', function (e) {
			e.preventDefault();
			var holder = $($(e.target).parents('DIV.form-input-droplist')[0]);
			holder.find('INPUT[type="text"]').val($(e.target).data('value'));
			holder.find('INPUT[type="checkbox"]').prop('checked',false);
		} );
	} )();
	var numberWithSpaces = function(x) {
		var parts = x.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		return parts.join(".");
	};
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
			$(_token_row.find('>SPAN')).html((numberWithSpaces(token.calced_capital))+' $');
			$(_token_row.find('>DIV')).html(token.desc);
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
			try {
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
			} catch (e) { return true }
		}
	};
	
	var _round_float = function (value, precision) {
		var multiplier = Math.pow(10, precision || 0);
		return Math.round(value * multiplier) / multiplier;
	};
	var _scroll_to_swap = function () {
		var _real_offset = 0;
		$.each($('#swap-online-form UL.other-capitalize LI'), function (i,item) {
			var $item = $(item);
			if (!$(item).hasClass('swap-online')) {
				_real_offset = _real_offset + $(item).outerHeight(true);
			} else {
				_real_offset = _real_offset + $(item).outerHeight(true)*3;
				return false;
			}
		});
		
		$('#swap-online-form UL.other-capitalize').stop().animate({
			scrollTop: _real_offset*_scale
		}, 500 );
	};
	( function () {
		var _is_rolling = false;
		var _min = 0.1;
		var _max = _roller_max_value;
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
			if (_current<=1) {
				$('#we-can-buy-your-tokens').removeClass('-hidden');
			} else {
				$('#we-can-buy-your-tokens').addClass('-hidden');
			}
				
			_input.val(_current);
			if (new_offset===0) _current = _min;
			if (new_offset===_scroller.width()) _current = _max;
			var _capitalize = Math.round(_token_count * _current);
			$('#swap-online-form EM.form-user-capitalize').html(numberWithSpaces(_capitalize)+' $');
			$('#swap-online-form SPAN.form-user-capitalize').html(numberWithSpaces(_capitalize)+' $');
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
			/* Roll to swap.online */
			
			
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
		var _roller_mousedown = function(e) {
			
			if (e.type!="touchstart") e.preventDefault();
			if ($('BODY').hasClass('has-form-scale')) {
				_scale = _has_scale;
			} else {
				_scale = 1;
			}
			_is_rolling = true;
		};
		var _roller_click = function (e) {
			if (!$(e.target).hasClass('form-input-roller-button')
				&& !$(e.target).parents('.form-input-roller-button').length
			) {
				_update_roller(e.offsetX);
			}
		};
		var _roller_move = function (e) {
			
			if (_is_rolling) {
				if (e.type!="touchmove") e.preventDefault();
				var _new_left = ((e.type!="touchmove") ? e.pageX : e.touches[0].pageX ) - _scroller.offset().left
				if (_new_left<0) { _new_left = 0; };
				if (_new_left>_scroller.width()*_scale) { _new_left = _scroller.width()*_scale ; };
				_update_roller(_new_left/_scale);
			}
		};
		var _roller_mouseup = function (e) {
			if (_is_rolling) {
				_scroll_to_swap();
			};
			_is_rolling = false;
				
		};
		_roller.bind('mousedown', _roller_mousedown );
		_roller.bind('touchstart', _roller_mousedown );
		_scroller.bind('click', _roller_click );
		$(document).bind('mousemove', _roller_move );
		$(document).bind('touchmove', _roller_move );
		$(document).bind('mouseup', _roller_mouseup );
		$(document).bind('touchend', _roller_mouseup );
		$(document).bind('touchcancel', _roller_mouseup );
	} )();
	/* Checkbox */
	$(document).delegate('DIV.form-checkbox INPUT','change', function (e) {
		var $h = $(e.target).parent();
		if ($(e.target).prop('checked')) {
			$($h.find('LABEL[data-state="off"]')).hide();
			$($h.find('LABEL[data-state="on"]')).show();
		} else {
			$($h.find('LABEL[data-state="on"]')).hide();
			$($h.find('LABEL[data-state="off"]')).show();
		}
	} );
	$(document).delegate('DIV.form-checkbox LABEL','click', function (e) {
		var c = $($(e.target).parent().find('INPUT')[0]);
		c.prop('checked',!c.prop('checked'));
		c.trigger('change');
	} );
	/* - Checkbox */
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
	var _token_address = "";
	
	/* Init Values from cookie */
	(function () {
		$('#input-token-percent').val(_cookie.get("tokenPercent",10)+'%');
		$('#form-input-fio').val(_cookie.get("fio"),"");
		$('#form-input-eth-address').val(_cookie.get("address",""));
		$('#form-input-token-address').val(_cookie.get("tokenAddress",""));
		if ($('#form-input-eth-address').val()==$('#form-input-token-address').val()) {
			/* if ($('#form-input-eth-address').val().length) { */
				$('#form-input-eth-token-equal').prop('checked',true);
				$('#for-token-address').addClass('hidden');
			/* } */
		};
		$('#form-input-eth-token-equal').trigger('change');
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
	$('#form-input-eth-token-equal').bind('change', function (e) {
		if ($('#form-input-eth-token-equal').prop("checked")) {
			$('#for-token-address').addClass('hidden');
		} else {
			$('#for-token-address').removeClass('hidden');
		};
		_scale_height_fix();
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
			_scroll_to_swap();
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
		var has_error = false;
		if (!_eth_helper.isAddress($('#form-input-eth-address').val())) {
			$('#form-input-eth-address').addClass('has-error');
			has_error = true;
		};
		if ($('#form-input-eth-token-equal').val()=="off") {
			if(!_eth_helper.isAddress($('#form-input-token-address').val())) {
				$('#form-input-token-address').addClass('has-error');
				has_error = true;
			}
		};
		if (has_error) return;
		_eth_address = $('#form-input-eth-address').val();
		_token_address = $('#form-input-token-address').val();
		if (!_token_address.length) {
			_token_address = _eth_address;
		};
		if ($('#form-input-eth-token-equal').prop("checked")==true) {
			_token_address = _eth_address;
			if (!confirm($('P.confirm-answer').html())) {
				return;
			}
		}
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
		_cookie.set("tokenAddress",_token_address);
		/* End Save cookie */
		var _order_data = {
			fio : $('#form-input-fio').val(),
			address : _eth_address,
			tokenaddres : _token_address,
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