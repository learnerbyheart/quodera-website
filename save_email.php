<?php

$new_email = $_POST["email"];
echo "Email: ".$new_email;
$file = "emails.txt";

// Write the contents back to the file
file_put_contents($file, $new_email."\n", FILE_APPEND);
header('Location: http://quodera.de/email_confirm.html', true, 303);
die();


 ?>
