<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';


$phone = $_POST['phone'];
$name = $_POST['name'];
$tariff = $_POST['tariff'];


$mail = new PHPMailer();
$mail->CharSet = 'UTF-8';

$yourEmail = 'info@mponlinee.pro'; // ваш email на яндексе
$password = 'hvv385xV'; // ваш пароль к яндексу или пароль приложения

// настройки SMTP
$mail->Mailer = 'smtp';
$mail->Host = 'ssl://smtp.timeweb.ru';
$mail->Port = 465;
$mail->SMTPAuth = true;
$mail->Username = $yourEmail; // ваш email - тот же что и в поле From:
$mail->Password = $password; // ваш пароль;


// формируем письмо

// от кого: это поле должно быть равно вашему email иначе будет ошибка
$mail->setFrom($yourEmail, 'Новая заявка mponlinee.pro');

// кому - получатель письма
$mail->addAddress('ilya.feigin@yandex.ru');  // кому

$mail->Subject = 'Новая заявка MPOnlinee';  // тема письма

$mail->msgHTML("<html><body>
                    <h1>Новая заявка<br></h1>
                    <h4>Номер телефона: $phone</h4>
                    <h4>Имя клиента: $name</h4>
                    <p>Тариф: $tariff</p>
                    </html></body>");


if ($mail->send()) { // отправляем письмо
    echo 'Письмо отправлено!';
} else {
    echo 'Ошибка: ' . $mail->ErrorInfo;
}


$params = json_encode([
    'direction_id' => 6,
//    'offer_id' => 27,
    'branch_id' => 0,
    'phones' => [
        $phone,
    ],

    'is_pm' => false,
    //    'is_pm' => true,

    'name' => $name,  //  ФИО клиента (ОБЯЗАТЕЛЬНО)
//        'description' => 'Test order', //  Описание работ
]);
$idp = '6217158a-63ec-333b-0bea3b04c9cea778';

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://testapi.ru/lead?source=partner&idp=" . rawurlencode($idp),

    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => $params,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json"
    ],
]);

$response = curl_exec($curl);
$info = curl_getinfo($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    if (intval($info['http_code'] / 100) !== 2) {
        print "Error: ";
        print_r($response);
    }
}

?>

?>

