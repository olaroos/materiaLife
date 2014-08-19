<?php 
	
header('Content-type: application/json');

function getMySQL($category){

	$host 		= 'localhost';
    $username 	= 'root';
    $pass 		= 'newpassword';
    $database 	= 'materialife';
	$table 	  	= 'materialife';

    $link = mysql_connect($host,$username,$pass) or die("Database Error!".mysql_error());
    mysql_select_db($database, $link);

    
    // $query =  'select * from '.$table.' where category = "'.$category.'"'; 
    $query = 'select * from materialife';
    $result = mysql_query($query) or trigger_error(mysql_error().". Query: ".$query);
    
    $all_recs = array();
    while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
    	$all_recs[] = $line;
    }

    // $row = mysql_fetch_assoc($result); 
    // if ($row == '') {
    // 	throw new Exception('no matching request found');
    // } else {
    // 	return $row['jsonFile'];	
    // }
    

    mysql_close($link);
    // return $all_recs;
    return json_encode($all_recs);
}

$category = $_POST["category"];
echo getMySQL($category);

?>