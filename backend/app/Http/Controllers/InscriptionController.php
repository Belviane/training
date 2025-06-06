<?php

namespace App\Http\Controllers;

use App\Models\Inscription;
use App\Models\User;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class InscriptionController extends Controller
{

    // Liste des inscriptions
    public function index()
    {
        $inscriptions = Inscription::with(['apprenant', 'formation', 'date_inscription'])->get();
        return response()->json($inscriptions);
    }


        // Inscrire un apprenant à une formation
    public function inscrire(Request $request)
    {
        // Vérification du rôle
        $utilisateur = Auth::user();
        if (!in_array($utilisateur->role, ['admin', 'formateur', 'superviseur'])) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        // Validation
        $validator = Validator::make($request->all(), [
            'apprenant_id' => 'required|exists:utilisateurs,id',
            'formation_id' => 'required|exists:formations,id',
            'date_inscription' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Vérifier que l'utilisateur est bien un apprenant
        $apprenant = Utilisateur::find($request->apprenant_id);
        if ($apprenant->role !== 'apprenant') {
            return response()->json(['message' => 'L\'utilisateur sélectionné n\'est pas un apprenant.'], 400);
        }

        // Vérifier si l'apprenant est déjà inscrit
        $existe = Inscription::where('apprenant_id', $request->apprenant_id)
                             ->where('formation_id', $request->formation_id)
                             ->exists();

        if ($existe) {
            return response()->json(['message' => 'Cet apprenant est déjà inscrit à cette formation.'], 409);
        }

        // Création de l'inscription
        $inscription = Inscription::create([
            'apprenant_id' => $request->apprenant_id,
            'formation_id' => $request->formation_id,
             'date_inscription' => now(),
        ]);

        return response()->json(['message' => 'Inscription effectuée avec succès.', 'data' => $inscription], 201);
    }

    public function parFormation($id)
    {
        $formation = Formation::find($id);

        if (!$formation) {
            return response()->json(['message' => 'Formation non trouvée.'], 404);
        }

        $inscriptions = Inscription::with('apprenant.utilisateur') // Pour avoir les infos utilisateur liées à l’apprenant
            ->where('formation_id', $id)
            ->get();

        return response()->json([
            'formation' => $formation->titre ?? 'Formation',
            'inscrits' => $inscriptions
        ]);
    }
}
