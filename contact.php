<?php
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Sanitize inputs
$name    = trim(htmlspecialchars($_POST['name']    ?? '', ENT_QUOTES, 'UTF-8'));
$email   = trim(filter_var($_POST['email']   ?? '', FILTER_SANITIZE_EMAIL));
$phone   = trim(htmlspecialchars($_POST['phone']   ?? '', ENT_QUOTES, 'UTF-8'));
$service = trim(htmlspecialchars($_POST['service'] ?? '', ENT_QUOTES, 'UTF-8'));
$website = trim(filter_var($_POST['website'] ?? '', FILTER_SANITIZE_URL));
$message = trim(htmlspecialchars($_POST['message'] ?? '', ENT_QUOTES, 'UTF-8'));

// Validate required fields
if (empty($name) || strlen($name) < 2) {
    echo json_encode(['success' => false, 'message' => 'Please enter your full name.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}
if (empty($message) || strlen($message) < 10) {
    echo json_encode(['success' => false, 'message' => 'Please enter a message (at least 10 characters).']);
    exit;
}

// Rate limiting — simple file-based (1 submission per IP per 5 minutes)
$ip       = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$lockFile = sys_get_temp_dir() . '/contact_' . md5($ip) . '.lock';
if (file_exists($lockFile) && (time() - filemtime($lockFile)) < 300) {
    echo json_encode(['success' => false, 'message' => 'Please wait a few minutes before sending another message.']);
    exit;
}
touch($lockFile);

// Build email
$to      = 'contact@vahidsediqi.com';
$subject = "New Contact Form Submission — $name";

$body  = "You have a new message from vahidsediqi.com\n\n";
$body .= "Name:    $name\n";
$body .= "Email:   $email\n";
$body .= "Phone:   " . ($phone ?: 'Not provided') . "\n";
$body .= "Service: " . ($service ?: 'Not specified') . "\n";
$body .= "Website: " . ($website ?: 'Not provided') . "\n\n";
$body .= "Message:\n$message\n\n";
$body .= "---\nSent from vahidsediqi.com contact form\nIP: $ip\nTime: " . date('Y-m-d H:i:s T');

$headers  = "From: noreply@vahidsediqi.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send email. Please contact me directly.']);
}
