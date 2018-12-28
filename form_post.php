<?php

	$name = $_POST['name'];
	$email = $_POST['email'];
	$phone = $_POST['phone'];
	$message = $_POST['message'];
	if($message == "Your Message")
	{
		$message = "";
	}
	
	else
	{
		$message = $message;
	}
	
	
	
	$email_to = 'fabricterminal@gmail.com';

				
		$email_subject = 'Contact Form Details From Website';

		$email_message = "
		<html>
		<body>
			<div>Contact Form Details</br><br/>
			Name: {$name}<br/>
			Email: {$email}<br/>
			Contact Number: {$phone}<br/>
			Message: {$message}</br>
				
			</div>
		</body>
		</html>
		";
		

		// create email headers
		$headers  = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	
		// Additional headers
		$headers .= 'From: ' . $email . ' <'.$email.'>' . "\r\n" . 'Reply-To: ' . $email;
	
		$response = mail($email_to, $email_subject, $email_message, $headers);
		
		
		if($response)
		{
			echo "1";
		}
		
		else
		{
			echo "0";
		}


?>