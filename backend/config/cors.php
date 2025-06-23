<?php

return [
	'paths' => ['api/*', 'sanctum/csrf-cookie'],
	'allowed_origins' => ['https://classroom.beitafrica.com'],
	'allowed_methods' => ['*'],
	'allowed_headers' => ['*'],
	'supports_credentials' => true,
];
