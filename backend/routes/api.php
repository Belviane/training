<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Log;

use App\Http\Controllers\Controller;

use App\Http\Controllers\Api\FormationController;

use App\Http\Controllers\Api\FormateurController;

use App\Http\Controllers\Api\SuperviseurController;

use App\Http\Controllers\Api\ApprenantController;

use App\Http\Controllers\Api\UtilisateurController;

use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\Api\RoleController;

use App\Http\Controllers\Api\ProfilController;

use App\Http\Controllers\Api\InscriptionController;

use App\Http\Controllers\Api\ClasseController;

use App\Http\Controllers\Api\SeanceController;

use App\Http\Controllers\Api\PresenceController;

use App\Http\Controllers\Api\AuditeurController;

use App\Http\Controllers\Api\CaissierController;

use App\Http\Controllers\Api\VendeurController;

use App\Http\Controllers\Api\AdministrateurController;

use App\Http\Controllers\Api\ExamenController;

// Routes publiques
//Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/utilisateurs', [UtilisateurController::class, 'store']);
//Route::post('/email/verify', [UtilisateurController::class, 'verifierEmail']);
Route::put('/modifier-identifiants', [AuthController::class, 'modifierIdentifiants']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    //deconnexion des utilisateur
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/modifier-identifiants', [AuthController::class, 'modifierIdentifiants']);

    // Utilisateurs
    Route::controller(UtilisateurController::class)->group(function () {
        Route::post('/utilisateurs/changer', 'changerMotDePasse');
        Route::get('/utilisateurs', 'index');
        Route::get('/utilisateurs/apprenants', 'listerApprenants');
        Route::put('/utilisateurs/{id}', 'update');
        Route::post('/utilisateurs', 'store');

        // Activation/désactivation utilisateur (réservé aux admins)
        Route::patch('/utilisateurs/{id}/activer', 'activer');
        Route::patch('/utilisateurs/{id}/desactiver', 'desactiver');

        //recherche
        Route::get('/utilisateurs/rechercher',  'rechercher');
        Route::get('/utilisateurs/{id}', 'show');

        Route::get('/export/excel', 'exportExcel');
        Route::get('/export/pdf', 'exportPDFUtilisateurs');
    });

    // Administrateurs
    Route::prefix('administrateurs')->controller(AdministrateurController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::get('/export/excel', 'exportExcel');
        Route::get('/export/pdf', 'exportPDFAdministrateurs');

    });


    // Superviseurs
    Route::prefix('superviseurs')->controller(SuperviseurController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::get('/export/excel', 'exportExcel');
        Route::get('/export/pdf', 'exportPDFSuperviseurs');

    });

    // Formateurs
    Route::prefix('formateurs')->controller(FormateurController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::get('/export/excel', 'exportExcel');
        Route::get('/export/pdf', 'exportPDFformateurs');

    });

    // Apprenants
    Route::prefix('apprenants')->controller(ApprenantController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::get('/export/excel', 'exportExcel');
        Route::get('/export/pdf', 'exportPDFApprenants');

    });

    // Parents
    Route::prefix('parents')->controller(ParenteController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::get('/export/excel', 'exportExcel');
        Route::get('/export/pdf', 'exportPDFParents');

    });

    // Caissiers
    Route::prefix('caissierss')->controller(CaissierController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::get('/export/excel', 'exportExcel');
        Route::get('/export/pdf', 'exportPDFCaissiers');

    });

    // Auditeurs
    Route::prefix('auditeurs')->controller(AuditeurController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::get('/export/excel', 'exportExcel');
        Route::get('/export/pdf', 'exportPDFAuditeurs');

    });

    // Vendeurs
    Route::prefix('vendeurs')->controller(VendeurController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::get('/export/excel', 'exportExcel');
        Route::get('/export/pdf', 'exportPDFVendeurs');

    });


    //Formations
    Route::controller(FormationController::class)->group(function () {
        Route::get('/mes-formations', 'mesFormations');
        Route::get('/formations/pdf',  'exportPdf');
        Route::get('/formations/search', 'search');
        Route::post('/formations/{id}/assign-formateurs', 'assignFormateurs');
        Route::get('/formations/{id}', 'show');
        Route::get('/formations', 'index');
        Route::delete('/formations/{id}', 'destroy');
        Route::put('/formations/{id}', 'update');
        Route::post('/formations', 'store');
       
    });

    //Classes
    Route::controller(ClasseController::class)->group(function () {
        Route::get('/classes/{id}', 'show');
        Route::get('/classes', 'index');
        Route::put('/classes/{id}', 'update');
        Route::post('/classes', 'store');

        Route::post('/classes/{id}/verifier-disponibilite', 'verifierDisponibilite');
        Route::get('/classes/{id}/capacite-restante', 'getCapaciteRestante');
    });

    //Seances
    Route::controller(SeanceController::class)->group(function () {
        Route::get('/classes/{id}', 'show');
        Route::get('/seances', 'index');
        Route::put('/seances/{id}', 'update');
        Route::post('/seances', 'store');

        Route::post('/seances/{id}/annuler', 'annulerSeance');
        Route::post('/seances/{id}/demarrer', 'demarrerSeance');
        Route::post('/seances/{id}/terminer', 'terminerSeance');
        Route::post('/seances/{id}/notifier', 'notifierParticipants');
        Route::get('/seances/{id}/feuille-presence', 'genererFeuillePresence');
        Route::get('/seances/{id}/formateur', 'obtenirFormateur');
        Route::get('/seances/{id}/classe', 'obtenirClasse');

    });







    //Presences
    Route::controller(PresenceController::class)->group(function () {
        Route::get('/seance/{seance_id}', 'listePresenceParSeance');
        Route::get('/presence/date', 'presencesParDate');
        Route::get('/apprenant/{apprenant_id}', 'listePresenceParApprenant');
        Route::post('/marquer', 'marquerPresence');
        Route::post('/justifier', 'justifierAbsence');
        Route::get('/pdf/{seance_id}', 'exporterPDF');
        Route::get('/csv/{seance_id}', 'exporterCSV');
    });







    Route::controller(InscriptionController::class)->group(function () {
        Route::get('/inscriptions/recherche',  'recherche');
        Route::get('/mes-inscriptions', 'mesInscriptions');
        Route::get('/mes-enfants/inscriptions', 'inscriptionsParent');
        Route::get('/mes-formations',  'inscriptionsApprenant');
        Route::post('/formations/{id}/inscrire', 'inscrire');
    });
    // Profil utilisateur
    Route::get('/profil', [ProfilController::class, 'afficherProfil']);
    Route::put('/profil', [ProfilController::class, 'modifierProfil']);

    Route::post('modules/{module}/examens', [ExamenController::class, 'storeForModule']);



});
