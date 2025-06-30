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
use Barryvdh\DomPDF\Facade\Pdf;
use OpenApi\Annotations as OA;

class InscriptionController extends Controller
{

    private function checkAdminOrSuperviseur()
    {
        $user = auth()->user();
        if (!in_array($user->role->libelle, ['superviseur', 'administrateur'])) {
            // On renvoie directement une réponse et on arrête l'exécution
            abort(403, 'Accès non autorisé. Seuls les administrateurs ou superviseurs sont permis.');
        }
    }

    public function inscrire(Request $request, $formationId)
    {
        $formation = Formation::findOrFail($formationId);

        if (!auth()->check()) {
            return response()->json([
                'message' => 'Token invalide ou manquant',
            ], 401);
        }

       $this->checkAdminOrSuperviseur();

        $request->validate([
            'apprenant_id' => 'required|exists:apprenants,id'
        ]);

        $apprenant = Apprenant::findOrFail($request->apprenant_id);

        // Vérification double inscription
        if (Inscription::where('formation_id', $formation->id)
            ->where('apprenant_id', $apprenant->id)->exists()) {
            return response()->json(['message' => 'Cet apprenant est déjà inscrit.'], 400);
        }

        // Création de l’inscription
        $inscription = Inscription::create([
            'formation_id' => $formation->id,
            'apprenant_id' => $apprenant->id,
            'inscrit_par' => $user->id,
            'date_inscription' => now(),
            'statut' => 'en_attente',
            'paiement_effectue' => false
        ]);

        return response()->json([
            'message' => 'Inscription enregistrée avec succès.',
            'inscription' => $inscription
        ], 201);
    }


    public function mesInscriptions()
    {
        $user = auth()->user();

        // Vérifie si c’est bien un superviseur ou administrateur
        if (!in_array($user->role->libelle, ['superviseur', 'administrateur'])) {
            return response()->json([
                'message' => 'Accès refusé : seuls les superviseurs ou administrateurs peuvent voir leurs inscriptions.'
            ], 403);
        }

        // Récupère les inscriptions faites par cet utilisateur
        $inscriptions = \App\Models\Inscription::with([
                'formation',
                'apprenant.utilisateur'
            ])
            ->where('inscrit_par', $user->id)
            ->get()
            ->groupBy('formation.nom') // Groupe les inscriptions par nom de formation
            ->map(function ($grouped) {
                return $grouped->map(function ($inscription) {
                    return [
                        'id_apprenant' => $inscription->apprenant->id,
                        'nom' => $inscription->apprenant->utilisateur->nom,
                        'prenom' => $inscription->apprenant->utilisateur->prenom,
                        'matricule' => $inscription->apprenant->matricule,
                        'date_inscription' => $inscription->date_inscription,
                        'statut' => $inscription->statut,
                        'paiement' => $inscription->paiement_effectue ? 'payé' : 'non payé',
                    ];
                });
            });

        return response()->json($inscriptions);
    }

    public function inscriptionsApprenant()
    {
        $user = auth()->user();

        if ($user->role->libelle !== 'apprenant') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $apprenant = $user->apprenant;

        $inscriptions = Inscription::with('formation')
            ->where('apprenant_id', $apprenant->id)
            ->get();

        return response()->json($inscriptions);
    }

    public function inscriptionsParent()
    {
        $user = auth()->user();

        if ($user->role->libelle !== 'parent') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $parent = $user->parent;

        $inscriptions = Inscription::with(['formation', 'apprenant.utilisateur'])
            ->whereIn('apprenant_id', $parent->enfants->pluck('id'))
            ->get();

        return response()->json($inscriptions);
    }

    public function inscriptionsFormateur()
    {
        $user = auth()->user();

        if ($user->role->libelle !== 'formateur') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $inscriptions = Inscription::with(['formation', 'apprenant.utilisateur'])
            ->whereHas('formation', function ($query) use ($user) {
                $query->where('formateur_id', $user->id);
            })->get();

        return response()->json($inscriptions);
    }

    public function recherche(Request $request)
    {
       $this->checkAdminOrSuperviseur();

        $query = Inscription::with(['apprenant.utilisateur', 'formation']);

        // 🔍 Filtre par nom ou prénom apprenant
        if ($request->filled('nom_apprenant')) {
            $query->whereHas('apprenant.utilisateur', function ($q) use ($request) {
                $q->where('nom', 'like', '%' . $request->nom_apprenant . '%')
                ->orWhere('prenom', 'like', '%' . $request->nom_apprenant . '%');
            });
        }

        // 🔍 Filtre par formation
        if ($request->filled('formation_id')) {
            $query->where('formation_id', $request->formation_id);
        }

        // 🔍 Filtre par statut
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        // 🔍 Filtre par paiement
        if ($request->filled('paiement_effectue')) {
            $query->where('paiement_effectue', $request->paiement_effectue);
        }

        // 📄 Pagination (10 inscriptions par page par défaut)
        $inscriptions = $query->paginate(10);

        return response()->json($inscriptions);
    }



}
