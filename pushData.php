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

$query            = "INSERT INTO materialife (category, description, place, relation, title, bestbefore, borrowedfrom, subinfo, author, quantity) 
                VALUES ('$category', '$description', '$place', '$relation', '$title', '$bestbefore', '$borrowedfrom', '$subinfo', '$author', '$quantity')";

echo $sql;
// $sql="INSERT INTO users (first_name, last_name, sex, email, password, registration_date)
// VALUES ('$Fname', '$Lname', '$sex', '$email', SHA1('$password'), NOW())";

$host       = 'localhost';
$username   = 'root';
$pass       = 'newpassword';
$database   = 'materialife';
$table      = 'materialife';

$link = mysql_connect($host,$username,$pass) or die("Database Error!".mysql_error());
mysql_select_db($database, $link);
mysql_query("delete from materialife where id = ".$id);
$result = mysql_query($query) or trigger_error(mysql_error().". Qu´ery: ".$query);
echo $result;
mysql_close($link);

?>