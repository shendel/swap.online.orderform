﻿<?php
error_reporting(E_ALL);
	if (isset($_POST['fio'])
		and isset($_POST['address'])
		and isset($_POST['tokenaddres'])
		and isset($_POST['works'])
		and is_array($_POST['works'])
		and count($_POST['works'])
		and isset($_POST['token_price'])
		and isset($_POST['token_percent'])
		and isset($_POST['token_count'])
		and isset($_POST['eth_price'])
		and isset($_POST['eth_count'])
		and isset($_POST['money'])
	) {
		$new_order = "";
		$new_order.= "======================================================\r\n";
		$new_order.= date("Y-m-j H:i:s")." - ".$_SERVER['HTTP_X_FORWARDED_FOR']." - ".$_SERVER['REMOTE_ADDR']."\r\n";
		$new_order.= "Контакт (емейл, телеграм): ".$_POST['fio']."\r\n";
		$new_order.= "Eth Кошелек: ".$_POST['address']."\r\n";
		$new_order.= "Eth Кошелек для токенов: ".$_POST['tokenaddres']."\r\n";
		$new_order.= "Выполненные работы: \r\n";
		foreach ($_POST['works'] as $k=>&$work) {
			$new_order.= " - ".$work."\r\n";
		}
		$new_order.= "Цена выполненных работ: ".$_POST['money']."$\r\n";
		$new_order.= "Цена за токен: ".$_POST['token_price']."$ \r\n";
		$new_order.= "Количество токенов: ".$_POST['token_count']."\r\n";
		$new_order.= "Процент: ".$_POST['token_percent']."%\r\n";
		$new_order.= "Курс Eth: ".$_POST['eth_price']."$\r\n";
		$new_order.= "Количество Эфира: ".$_POST['eth_count']."\r\n";
		$new_order.= "\r\n";
		file_put_contents("./orders.txt",(file_exists("./orders.txt")) ? file_get_contents("./orders.txt").$new_order : $new_order);
		die("OK");
	} else {
		die("503");
	}