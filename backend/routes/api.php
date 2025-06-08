<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\FormationController;
use App\Http\Controllers\FormateureController;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\ProfilController;
use App\Http\Controllers\Api\InscriptionController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->put('/utilisateurs/{id}/activer', [UtilisateurController::class, 'activer']);
Route::middleware('auth:sanctum')->put('/utilisateurs/{id}/desactiver', [UtilisateurController::class, 'desactiver']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);


    //Route pour le controlleur Formation
    Route::controller(FormationController::class)->group(function () {
        Route::get('/formations/{id}', 'show');
        Route::delete('/formations/{id}', 'destroy');
        Route::put('/formations/{id}', 'update');
        Route::post('/formations', 'store');
    });


    //Routes pour le controlleur Utilisateur
    Route::controller(UtilisateurController::class)->group(function () {
        Route::get('/utilisateurs/{id}', 'show');
       // Route::get('/utilisateurs', 'index');
        Route::get('/utilisateurs/apprenants', 'listerApprenants');
        Route::delete('/utilisateurs/{id}', 'destroy');
        Route::delete('/utilisateurs/{id}/bloquer', 'bloquer');
        Route::put('/utilisateurs/{id}', 'update');
        Route::post('/utilisateurs', 'store');
    });

    // Profil utilisateur
    Route::get('/profil', [ProfilController::class, 'afficherProfil']);
    Route::put('/profil', [ProfilController::class, 'modifierProfil']);




    // Inscriptions
    Route::get('/inscriptions', [InscriptionController::class, 'index']);
    Route::post('/inscriptions', [InscriptionController::class, 'inscrire']);

});


  //Routes pour le controlleur Utilisateur
    Route::controller(UtilisateurController::class)->group(function () {
        // Route::get('/utilisateurs/{id}', 'show');
        Route::get('/utilisateurs', 'index');
        // Route::get('/utilisateurs/apprenants', 'listerApprenants');
        // Route::delete('/utilisateurs/{id}', 'destroy');
        // Route::delete('/utilisateurs/{id}/bloquer', 'bloquer');
        // Route::put('/utilisateurs/{id}', 'update');
        // Route::post('/utilisateurs', 'store');
    });




//Routes pour le controlleur des roles
Route::apiResource('roles', RoleController::class);


// Accessible uniquement aux administrateurs
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin-only', function () {
        return response()->json(['message' => 'Bienvenue admin']);
    });
});

// Accessible aux formateurs ou superviseurs
Route::middleware(['auth:sanctum', 'role:formateur,superviseur'])->group(function () {
    Route::get('/gestion-formations', function () {
        return response()->json(['message' => 'Accès formateur/superviseur']);
    });
});

Route::post('/formateurs', [FormateureController::class, 'store'])->middleware(['auth:sanctum', 'role:admin']);


