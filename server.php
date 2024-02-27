<?php
date_default_timezone_set("Asia/Manila");

$data = null;

if (!function_exists('getallheaders')) {

    function getallheaders() {
        $headers = [];
       foreach ($_SERVER as $name => $value) {
           if (substr($name, 0, 5) == 'HTTP_') {
               $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
           }
       }
       return $headers;
    }
}

function create_connection () {
	$connection = new mysqli(
		"localhost", 
		"root",
		"",
		"vueblog",


		 // "sql307.epizy.com",
   //      "epiz_32791845",
   //      "30x2FgPRxBTa",
   //      "epiz_32791845_vueblog"
	);
	

	if($connection->connect_error) {
		die("no database connection: ".$connection->connect_error);
	}

	return $connection;
}

function image_parse ($data) {
	$extension = explode("/", mime_content_type($data));
	$image = file_get_contents($data);
	$path = "img/image_".rand(10000,99999).".".$extension[1];
	file_put_contents($path, $image);

	return $path;
}

function execute ($data, $con) {

	$query = $con->prepare($data[0]);
	if($data[1] != "") $query->bind_param($data[1], ...$data[2]);
	$query->execute();
	return $query;
}

function query_statement () {

	$post_id = null;
	$path = null;
	$result = null;

	
	$connection = create_connection();
	mysqli_set_charset($connection, 'utf8');

	foreach ($_POST as $key => $value) {
		$new_value = json_decode($value, true);
		
		

		if ($key == "read2") {
			if (!isset($_POST["guest"])) authenticate();

			$data = $new_value[array_keys($new_value)[0]];

			$query = execute($data, $connection);
			$get_result = $query->get_result();
			while($row = $get_result->fetch_assoc()) {
				if(strpos($data[0], "admin")) {
					unset($row['admin_password']);
				}
				$result[] = $row;
			}
			echo json_encode($result);
			return;
		}
		else if ($key == "write2") {
			authenticate();
			$key2 = array_keys($new_value)[0];
			if($key2 == "file") {

				$file = $new_value["file"];
				$path = image_parse($file[0]);
				$file[3][0] = $path;
				execute([$file[1], $file[2], $file[3]], $connection);
				echo json_encode(["insert_id"=>$connection->insert_id]);
				return;
			}
			else {

				$data = $new_value[array_keys($new_value)[0]];		
				execute($data, $connection);
				echo json_encode(["insert_id"=>$connection->insert_id]);
				return;
			}
		}
		else if ($key == "edit") {
			authenticate();
			$key2 = array_keys($new_value)[0];
			if($key2 == "file") {
				$file = $new_value["file"];
				$path = image_parse($file[0]);
				$file[3][0] = $path;

				$query_image = execute([
					"select image_path from image where image_id = ?",
					"i",
					[$file[3][1]]
				], $connection);

				$results = $query_image->get_result();
				$old_path = $results->fetch_assoc()["image_path"];
				$query = execute([$file[1], $file[2], $file[3]], $connection);		
				if($query->affected_rows > 0) unlink($old_path);
				echo json_encode(["affected_rows"=>$query->affected_rows]);
				return;
				
			}
			else {
			
				$data = $new_value[array_keys($new_value)[0]];
				$query = execute($data, $connection);
				echo json_encode(["affected_rows"=>$query->affected_rows]);
				return;
			}
		
		}
		else if ($key == "delete") {
			authenticate();
			$data = $new_value[array_keys($new_value)[0]];

			if(array_keys($new_value)[0] == "image") {
				$query_image = execute([
					"select image_path from image where image_post_hash_id = ?",
					"s",
					[$data[2][0]]
				], $connection);
				$results = $query_image->get_result();
				$path = $results->fetch_assoc()["image_path"];
				if(file_exists($path)) unlink($path);
			}

			
			$query = execute($data, $connection);
			echo json_encode(["affected_rows"=>$query->affected_rows]);
			return;
		}
		
	}

}

function login () {
	
	if(isset($_POST['login'])) {

		$connection = create_connection();
		$login = json_decode($_POST['login']);

		$statement = "select * from admin_blog where admin_username = ? and admin_password = ?";
		$query = $connection->prepare($statement);
		$query->bind_param("ss", ...$login);
		$query->execute();

		$result = $query->get_result();
		$data = $result->fetch_assoc();
		// print_r($login);
		// return;
		if($result->num_rows > 0) {
			$random = substr(md5(mt_rand()), 0, 7);
			$expire = date('Y-m-d H:i:s', strtotime(date('Y-m-d H:i:s')) + 60*30);
			$statement2 = "update admin_blog set admin_token = '".
			$random."', admin_token_expire ='".$expire."' where admin_id = ".
			$data['admin_id'];

			$query2 = $connection->prepare($statement2);
			$query2->execute();
			
			$data['admin_token'] = $random;
			// $data['admin_token_expire'] = $expire;
			unset($data['admin_token_expire']);
			unset($data['admin_password']);
			echo json_encode($data);
			return;
		}
		else {
			echo "error_login";
			return;
		}
		
	}
	else {
		echo "error_received_data";
		return;
	}

}

function authenticate () {
	$connection = create_connection();
	$statement = "select * from admin_blog where admin_token = ? and admin_id =?";
	$query = $connection->prepare($statement);
	$query->bind_param("si", getallheaders()['token'],  getallheaders()['id']);
	$query->execute();
	$result = $query->get_result();
	if($result->num_rows > 0) {
		$data = $result->fetch_assoc();
		$date_expire = strtotime(date($data['admin_token_expire']));
		$date_now = strtotime(date('Y-m-d H:i:s'));
		
		if($date_expire > $date_now) {
			$new_expire = date('Y-m-d H:i:s',$date_now + 60*30);
			
			$query2 = $connection->prepare("update admin_blog set admin_token_expire = ? where admin_id = ?");
			$query2->bind_param("si", $new_expire, $data['admin_id']);
			$query2->execute();
			$connection->close();

			if(isset($_POST['auth'])) {
				unset($data['admin_token_expire']);
				unset($data['admin_password']);
				echo json_encode($data);
				return;
			}
		}
		else {
			echo "error_expired_token";
			die();
		}
	}
	else {
		echo "error_unauthorized";
		die();
	}

}

if(isset(getallheaders()['id'] ) && isset(getallheaders()['token'])) {

	$data['token'] = getallheaders()['token'];
	$data['id'] = getallheaders()['id'];
	if($data['token'] == "" || $data["id"] == ""){
		login();
		return;
	} 
	// query_statement();
	if(isset($_POST['auth'])) {
		// echo "test";
		authenticate();
	}
	else query_statement();
	
} 
else if (isset($_POST["guest"])) {
	
	query_statement();
}
else if (isset($_POST['view'])) {
	
	$data = json_decode($_POST['view'], true);

	execute($data, create_connection());
}
else {
	login();
}

?>