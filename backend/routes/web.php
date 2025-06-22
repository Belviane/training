<?php

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Mail\EnvoiIdentifiants;

Route::get('/test-mail', function () {
    $user = \App\Models\User::first();
    Mail::to($user->email)->send(new EnvoiIdentifiants($user, 'MotDePasseTest123'));
    return 'Mail envoyé !';
});

Route::get('/', function () {
    return view('welcome');
});


