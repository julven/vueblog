
<?php
	$myfile = fopen('compiled.txt', "w");
	$compiled = "";
	$files = array_diff(scandir("components/"), [".", ".."]);

	// print_r($all_files);
	// return;
	$compiled .= file_get_contents("queries.js")."\n";
	$compiled .= file_get_contents("services.js")."\n";
	foreach ($files as $value) {
		$compiled .= file_get_contents("components/".$value)."\n";
	}
	$compiled .= file_get_contents("index.js")."\n";
	// print_r($compiled);
	// return;

	fwrite($myfile, $compiled);

	$script = "<script type='text/javascript'>".$compiled."</script>";


?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script src="https://unpkg.com/vue@3"></script>
	<script src="https://unpkg.com/vue-router@4.0.5/dist/vue-router.global.js"></script>
	<script src="https://unpkg.com/vuex@4.0.0/dist/vuex.global.js"></script>
	 <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
	 <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>
	 <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>
	 <link href="styles.css" rel="stylesheet"/>
	<title>vue 3 blog</title>
</head>
<body>
	<div id="app"></div>
	<?php echo $script; ?>
	<!-- <script type="text/javascript" src="index.js"></script> -->
</body>
</html>