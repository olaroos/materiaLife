<?php 

header('Content-type: application/json');

$category       = $_POST["category"];
$description    = $_POST["description"];
$place          = $_POST["place"];
$relation       = $_POST["relation"];
$title          = $_POST["title"];
$bestbefore     = $_POST["bestbefore"];
$borrowedfrom   = $_POST["borrowedfrom"];
$subinfo        = $_POST["subinfo"];
$author         = $_POST["author"];
$quantity       = $_POST["quantity"];
$id             = $_POST["id"];

// if quantity == '' MySql sets it to 0 so default it to 1 before sending request
if ($quantity == '') { $quantity = 1; }

// don't add id to ($)query because MySql sets it to AUTO INCREMENT 
if ($bestbefore == '') {
	$query            = "INSERT INTO materialife (category, description, place, relation, title, borrowedfrom, subinfo, author, quantity) 
							VALUES ('$category', '$description', '$place', '$relation', '$title', '$borrowedfrom', '$subinfo', '$author', '$quantity')"; 
} 
else {
	$query            = "INSERT INTO materialife (category, description, place, relation, title, bestbefore, borrowedfrom, subinfo, author, quantity) 
							VALUES ('$category', '$description', '$place', '$relation', '$title', '$bestbefore', $'borrowedfrom', '$subinfo', '$author', '$quantity')"; 
}

$host       = 'localhost';
$username   = 'root';
$pass       = 'newpassword';
$database   = 'materialife';
$table      = 'materialife';

$link = mysql_connect($host,$username,$pass) or die("Database Error!".mysql_error());
mysql_select_db($database, $link);
$result = mysql_query($query) or trigger_error(mysql_error().". Query: ".$query);
echo $result;
mysql_close($link);

?>