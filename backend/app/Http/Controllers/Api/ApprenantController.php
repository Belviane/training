<?php

namespace App\Http\Controllers\Api;





use App\Http\Controllers\Controller;
use App\Models\Apprenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ApprenantController extends Controller
{
   // Lister tous les apprenants
    public function index()
    {
        $apprenants = Apprenant::with('utilisateur')->get();
        return response()->json($apprenants);
    }
    // Créer un apprenant
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'genre' => 'required',
            'date_naissance' => 'required|date',
            'login' => 'required|string|unique:utilisateurs',
            'email' => 'required|email|unique:utilisateurs',
            'password' => 'required|string',
            'role_id' => 'required|exists:roles,id',
        ]);

        // Création de l'utilisateur
        $utilisateur = User::create([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'genre' => $validated['genre'],
            'date_naissance' => $validated['date_naissance'],
            'email' => $validated['email'],
            'login' => $validated['login'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'is_active' => true
        ]);

        // Génération du matricule
        $matricule = Apprenant::genererMatricule(
            $validated['prenom'],
            $validated['nom']
        );

        // Création de l'apprenant
        $apprenant = Apprenant::create([
            'matricule' => $matricule,
            'utilisateur_id' => $utilisateur->id
        ]);

        return response()->json([
            'apprenant' => $apprenant,
            'utilisateur' => $utilisateur
        ], 201);
    }

    // Mettre à jour un apprenant
    public function update(Request $request, $id)
    {
        $apprenant = Apprenant::findOrFail($id);
        $utilisateur = $apprenant->utilisateur;

        $validated = $request->validate([
            'nom' => 'sometimes|string',
            'prenom' => 'sometimes|string',
            'genre' => 'sometimes',
            'date_naissance' => 'sometimes|date',
            'email' => 'sometimes|email',
            'login' => [
                'sometimes',
                'string',
                Rule::unique('utilisateurs')->ignore($utilisateur->id)
            ],
            'password' => 'sometimes|string',
            'role_id' => 'sometimes|exists:roles,id'
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $utilisateur->update($validated);

        return response()->json([
            'apprenant' => $apprenant->fresh(),
            'utilisateur' => $utilisateur->fresh(),


        ]);
    }

    // Activer/Désactiver
    public function activate($id)
    {
        $apprenant = Apprenant::findOrFail($id);
        $apprenant->utilisateur()->update(['is_active' => true]);
        return response()->json(['message' => 'Apprenant activé']);
    }

    public function deactivate($id)
    {
        $apprenant = Apprenant::findOrFail($id);
        $apprenant->utilisateur()->update(['is_active' => false]);
        return response()->json(['message' => 'Apprenant désactivé']);
    }

    // Afficher un apprenant
    public function show($id)
    {
        $apprenant = Apprenant::with('utilisateur')->findOrFail($id);
        return response()->json($apprenant);
    }
}
