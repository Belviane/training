<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inscription;
use App\Models\User;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Apprenant;


class InscriptionController extends Controller
{

    public function inscrire(Request $request, $formationId)
    {
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Token manquant ou invalide',
                'solution' => [
                    '1. Vérifiez votre token dans Postman',
                    '2. Regénérez un token via /login',
                    '3. Vérifiez les headers de la requête'
                ]
            ], 401);
        }
        // Auth::user() est forcément un formateur ici car la policy l'a vérifié
        $request->validate([
            'apprenant_id' => 'required|exists:apprenants,id'
        ]);

        $apprenant = Apprenant::findOrFail($request->apprenant_id);

        if ($formation->apprenants()->where('apprenant_id', $apprenant->id)->exists()) {
            return response()->json(['message' => 'Cet apprenant est déjà inscrit'], 400);
        }

        $formation->apprenants()->attach($apprenant->id, [
            'formateur_id' => Auth::id(),
            'date_inscription' => now(),
            'statut' => 'actif'
        ]);

        return response()->json([
            'message' => 'Inscription réussie',
            'inscription' => [
                'formation' => $formation->nom,
                'apprenant' => $apprenant->utilisateur->nom_complet,
                'formateur' => Auth::user()->nom_complet,
                'date' => now()->toDateString()
            ]
        ], 201);
    }

    public function mesInscriptions()
    {
        // Récupère toutes les inscriptions faites par ce formateur
        $inscriptions = Formation::where('formateur_id', Auth::id())
            ->with(['apprenants.utilisateur'])
            ->get()
            ->map(function ($formation) {
                return [
                    'formation' => $formation->nom,
                    'apprenants' => $formation->apprenants->map(function ($apprenant) {
                        return [
                            'id' => $apprenant->id,
                            'nom' => $apprenant->utilisateur->nom,
                            'prenom' => $apprenant->utilisateur->prenom,
                            'matricule' => $apprenant->matricule,
                            'date_inscription' => $apprenant->pivot->date_inscription
                        ];
                    })
                ];
            });

        return response()->json($inscriptions);
    }

    public function desinscrire($formationId, $apprenantId)
    {
        $formation = Formation::findOrFail($formationId);

        if ($formation->formateur_id !== Auth::id()) {
            return response()->json(['message' => 'Action non autorisée'], 403);
        }

        $formation->apprenants()->detach($apprenantId);

        return response()->json(['message' => 'Désinscription réussie']);
    }
}
