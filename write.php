<?php

$recieved 	= $_POST['key'];
$json 		= json_encode($recieved);
file_put_contents('./data/modified', $json);

?>