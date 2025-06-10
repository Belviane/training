<?php

namespace App\Http\Controllers\Api;


use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\Controller;

use App\Models\Formateur;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class FormateurController extends Controller
{
    protected $fillable = ['utilisateur_id', 'specialite'];

     public function utilisateur()
    {
        return $this->belongsTo(User::class);
    }


   // Lister tous les formateurs
    public function index()
    {
        $formateurs = Formateur::with('utilisateur')->get();
        return response()->json($formateurs);
    }

      // Créer un nouveau formateur
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'genre' => 'required',
            'date_naissance' => 'required|date',
            'email' => 'required|email|unique:utilisateurs',
            'login' => 'required|string|unique:utilisateurs',
            'password' => 'required|string',
            'role_id' => 'required|exists:roles,id',
            'specialite' => 'required|string'
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
            'is_active' => true // Actif par défaut
        ]);

        // Création du formateur
        $formateur = Formateur::create([
            'specialite' => $validated['specialite'],
            'utilisateur_id' => $utilisateur->id
        ]);

        return response()->json([
            'formateur' => $formateur,
            'utilisateur' => $utilisateur
        ], 201);
    }

    // Mettre à jour un formateur
    public function update(Request $request, $id)
    {
        $formateur = Formateur::findOrFail($id);
        $utilisateur = $formateur->utilisateur;

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
            'role_id' => 'sometimes|exists:roles,id',
            'specialite' => 'sometimes|string'
        ]);

        // Mise à jour de l'utilisateur
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $utilisateur->update($validated);

        // Mise à jour du formateur
        if (isset($validated['specialite'])) {
            $formateur->update(['specialite' => $validated['specialite']]);
        }

        return response()->json([
            'formateur' => $formateur->fresh(),
            'utilisateur' => $utilisateur->fresh()
        ]);
    }

    // Activer un formateur
    public function activate($id)
    {
        $formateur = Formateur::findOrFail($id);
        $formateur->utilisateur()->update(['is_active' => true]);

        return response()->json(['message' => 'Formateur activé avec succès']);
    }

    // Désactiver un formateur
    public function deactivate($id)
    {
        $formateur = Formateur::findOrFail($id);
        $formateur->utilisateur()->update(['is_active' => false]);

        return response()->json(['message' => 'Formateur désactivé avec succès']);
    }

    // Afficher un formateur spécifique
    public function show($id)
    {
        $formateur = Formateur::with('utilisateur')->findOrFail($id);
        return response()->json($formateur);
    }
}
