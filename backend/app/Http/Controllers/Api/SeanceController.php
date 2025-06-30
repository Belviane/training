<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;


use App\Models\Classe;
use App\Models\Formation;
use App\Models\Formateur;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SeanceController extends Controller
{
    private function checkAdminOrSuperviseur()
    {
        $user = auth()->user();
        if (!in_array($user->role->libelle, ['superviseur', 'administrateur'])) {
            // On renvoie directement une réponse et on arrête l'exécution
            abort(403, 'Accès non autorisé. Seuls les administrateurs ou superviseurs sont permis de gerer cet aspect.');
        }
    }




    public function annulerSeance(Request $request, $id)
    {
        $this->checkAdminOrSuperviseur();

        $seance = Seance::findOrFail($id);
        $seance->update(['statut' => 'Annulée']);
        return response()->json(['message' => 'Séance annulée']);
    }

    public function demarrerSeance($id)
    {

        $user = auth()->user();
        if ($user->role->libelle !== 'formateur') {
            return response()->json([
                'message' => 'Accès interdit : seuls les formateurs peuvent demarrer les séances.'
            ], 403);
        }

        $seance = Seance::findOrFail($id);
        $seance->update(['statut' => 'En cours']);
        return response()->json(['message' => 'Séance démarrée']);
    }

    public function terminerSeance($id)
    {

        $user = auth()->user();
        if ($user->role->libelle !== 'formateur') {
            return response()->json([
                'message' => 'Accès interdit : seuls les formateurs peuvent terminer les séances.'
            ], 403);
        }

        $seance = Seance::findOrFail($id);
        $seance->update(['statut' => 'Terminée']);
        return response()->json(['message' => 'Séance terminée']);
    }

    public function notifierParticipants(Request $request, $id)
    {
        $message = $request->input('message');
        // Simulation notification
        Log::info("Notification envoyée aux participants: $message");
        return response()->json(['message' => 'Participants notifiés']);
    }

    public function genererFeuillePresence($id)
    {
        $seance = Seance::findOrFail($id);
        $apprenants = $seance->formation->apprenants ?? [];
        return response()->json(['feuille_presence' => $apprenants]);
    }


    public function obtenirFormateur($id)
    {
        $this->checkAdminOrSuperviseur();

        $formateur = Seance::findOrFail($id)->formateur;
        return response()->json($formateur);
    }

    public function obtenirClasse($id)
    {
        $classe = Seance::findOrFail($id)->classe;
        return response()->json($classe);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Seance::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $this->checkAdminOrSuperviseur();
        $validated = Validator::make($request->all(), [
            'titre' => 'required|string',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
            'formateur_id' => 'required|exists:formateurs,id',
            'formation_id' => 'required|exists:formations,id',
            'classe_id' => 'nullable|exists:classes,id',
            'type_seance' => 'nullable|string',
            'statut' => 'nullable|in:Planifiée,Confirmée,Annulée,Terminée,En cours'
        ])->validate();

        $seance = Seance::create($validated);
        return response()->json($seance, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Seance $seance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Seance $seance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $this->checkAdminOrSuperviseur();
        $seance = Seance::findOrFail($id);
        $seance->update($request->all());
        return response()->json($seance);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Seance $seance)
    {
        //
    }
}
