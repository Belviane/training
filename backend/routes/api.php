<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\FormateurController;
use App\Http\Controllers\Api\ApprenantController;
use App\Http\Controllers\Api\UtilisateurController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\ProfilController;
use App\Http\Controllers\Api\InscriptionController;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Activation/désactivation utilisateur (réservé aux admins)
    Route::middleware('role:admininistrateur')->group(function () {
        Route::put('/utilisateurs/{id}/activer', [UtilisateurController::class, 'activer']);
        Route::put('/utilisateurs/{id}/desactiver', [UtilisateurController::class, 'desactiver']);
    });

    //Formations
    Route::controller(FormationController::class)->group(function () {
        Route::get('/formations/{id}', 'show');
        Route::get('/formations', 'index');
        Route::delete('/formations/{id}', 'destroy');
        Route::put('/formations/{id}', 'update');
        Route::post('/formations', 'store');
    });

    // Utilisateurs
    Route::controller(UtilisateurController::class)->group(function () {
        Route::get('/utilisateurs', 'index');
        Route::get('/utilisateurs/{id}', 'show');
        Route::get('/utilisateurs/apprenants', 'listerApprenants');
        Route::delete('/utilisateurs/{id}', 'destroy');
        Route::patch('/utilisateurs/{id}/bloquer', 'bloquer');
        Route::put('/utilisateurs/{id}', 'update');
        Route::post('/utilisateurs', 'store');
    });

    // Formateurs
    Route::prefix('formateurs')->controller(FormateurController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store')->middleware('role:admin');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::patch('/{id}/activate', 'activate');
        Route::patch('/{id}/deactivate', 'deactivate');
    });

    // Apprenants
    // Route::prefix('apprenants')->controller(ApprenantController::class)->group(function () {
    //     Route::get('/', 'index');
    //     Route::post('/', 'store')->middleware('role:admin');
    //     Route::get('/{id}', 'show');
    //     Route::put('/{id}', 'update');
    //     Route::patch('/{id}/activate', 'activate');
    //     Route::patch('/{id}/deactivate', 'deactivate');
    // });
      // Apprenants
    Route::prefix('apprenants')->controller(ApprenantController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::patch('/{id}/activate', 'activate');
        Route::patch('/{id}/deactivate', 'deactivate');
    });


    // Formateur peut inscrire un apprenant
    Route::post('/formations/{formation}/inscrire', [InscriptionController::class, 'inscrire'])
       ;

    // Formateur peut voir ses inscriptions
    Route::get('/formateur/inscriptions', [InscriptionController::class, 'mesInscriptions'])
        ->middleware('role:formateur');

    // Profil utilisateur
    Route::get('/profil', [ProfilController::class, 'afficherProfil']);
    Route::put('/profil', [ProfilController::class, 'modifierProfil']);

    // // Inscriptions
    // Route::get('/inscriptions', [InscriptionController::class, 'index']);
    // Route::post('/inscriptions', [InscriptionController::class, 'inscrire']);
});


// Formateurs
Route::prefix('formateurs')->controller(FormateurController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('/{id}', 'show');
    Route::put('/{id}', 'update');
    Route::patch('/{id}/activate', 'activate');
    Route::patch('/{id}/deactivate', 'deactivate');
});
    // Formateurs
    // Route::prefix('formateurs')->controller(FormateurController::class)->group(function () {
    //     Route::get('/', 'index');
    //     Route::post('/', 'store');
    //     Route::get('/{id}', 'show');
    //     Route::put('/{id}', 'update');
    //     Route::patch('/{id}/activate', 'activate');
    //     Route::patch('/{id}/deactivate', 'deactivate');
    // });

//Apprenants
Route::prefix('apprenants')->controller(ApprenantController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('/{id}', 'show');
    Route::put('/{id}', 'update');
    Route::patch('/{id}/activate', 'activate');
    Route::patch('/{id}/deactivate', 'deactivate');
});
     //Apprenants
    // Route::prefix('apprenants')->controller(ApprenantController::class)->group(function () {
    //     Route::get('/', 'index');
    //     Route::post('/', 'store');
    //     Route::get('/{id}', 'show');
    //     Route::put('/{id}', 'update');
    //     Route::patch('/{id}/activate', 'activate');
    //     Route::patch('/{id}/deactivate', 'deactivate');
    // });

    // Route::controller(FormationController::class)->group(function () {
    //     Route::get('/formations/{id}', 'show');
    //     Route::get('/formations', 'index');
    //     Route::delete('/formations/{id}', 'destroy');
    //     Route::put('/formations/{id}', 'update');
    //     Route::post('/formations', 'store');
    // });

    Route::get('formations/{id}/apprenants', [FormationController::class, 'getApprenants']);
    Route::post('formations/{id}/apprenants', [FormationController::class, 'ajouterApprenant']);



// Roles (accessible selon vos besoins)
Route::apiResource('roles', RoleController::class)->middleware(['auth:sanctum', 'role:administrateur']);

// Routes avec contrôle de rôle
Route::middleware(['auth:sanctum', 'role:administrateur'])->group(function () {
    Route::get('/admin-only', function () {
        return response()->json(['message' => 'Bienvenue admin']);
    });
});

Route::middleware(['auth:sanctum', 'role:formateur,superviseur'])->group(function () {
    Route::get('/gestion-formations', function () {
        return response()->json(['message' => 'Accès formateur/superviseur']);
    });
});


Route::middleware('auth:sanctum')->get('/userinfo', function (Request $request) {
    return $request->user();
});



Route::controller(FormationController::class)->group(function () {
    Route::get('/formations/{id}', 'show');
    Route::get('/formations', 'index');
    Route::delete('/formations/{id}', 'destroy');
    Route::put('/formations/{id}', 'update');
    Route::post('/formations', 'store');
});

Route::middleware('auth:sanctum')->get('/user-info', [UtilisateurController::class, 'userInfo']);

Route::middleware('auth:sanctum')->get('/userinfo', function (Request $request) {
    return $request->user();
});



Route::controller(FormationController::class)->group(function () {
    Route::get('/formations/{id}', 'show');
    Route::get('/formations', 'index');
    Route::delete('/formations/{id}', 'destroy');
    Route::put('/formations/{id}', 'update');
    Route::post('/formations', 'store');
});
