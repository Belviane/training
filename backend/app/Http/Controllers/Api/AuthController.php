<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'login' => 'required|string|unique:utilisateurs',
            'email' => 'required|email|unique:utilisateurs,email',
            'password' => 'required|string|min:6|confirmed',
            'genre' => 'required|string',
            'date_naissance' => 'required|date'


        ]);

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'login' => $request->login,
            'password' => bcrypt($request->mdp),
            'role_id' => $request->role_id,
            'email' => $request->email,
            'genre' => $request->genre,
            'date_naissance' => $request->date_naissance
        ]);

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }


    // Connexion avec contrôle email vérifié + changement mot de passe forcé
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('login', $request->login)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants invalides.'], 401);
        }

        if (!$user->email_verified) {
            return response()->json([
                'message' => 'Veuillez vérifier votre adresse email avant de vous connecter.'
            ], 403);
        }

        if ($user->doit_changer_mot_de_passe) {
            return response()->json([
                'message' => 'Mot de passe temporaire, changement obligatoire.',
                'changer_password' => true
            ], 403);
        }

        // Génération token (exemple avec Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    // Modifier login et mot de passe (après première connexion)
    public function modifierIdentifiants(Request $request)
    {
        $request->validate([
            'login' => 'required|string|unique:utilisateurs,login,' . auth()->id(),
            'password' => 'required|string|confirmed|min:6',
        ]);

        $user = auth()->user();

        $user->login = $request->login;
        $user->password = Hash::make($request->password);
        $user->doit_changer_mot_de_passe = false;
        $user->save();

        return response()->json(['message' => 'Identifiants mis à jour avec succès.']);
    }

    // public function login(Request $request)
    // {
    //     $request->validate([
    //         'login' => 'required|string',
    //         'password' => 'required|string'
    //     ]);

    //     $user = \App\Models\User::where('login', $request->login)->first();

    //     if (!$user || !Hash::check($request->password, $user->password)) {
    //         return response()->json(['message' => 'Identifiants invalides.'], 401);
    //     }

    //     if (!$user->is_active) {
    //         return response()->json(['message' => 'Compte désactivé.'], 403);
    //     }

    //     // Connexion manuelle + génération du token
    //     Auth::login($user);
    //     $token = $user->createToken('API Token')->plainTextToken;

    //     // ✅ S'il doit changer le mot de passe, informer le front
    //     if ($user->doit_changer_mot_de_passe) {
    //         return response()->json([
    //             'message' => 'Mot de passe temporaire. Veuillez le modifier.',
    //             'changer_password' => true,
    //             'token' => $token,
    //             'user' => $user
    //         ], 200); // On retourne quand même le token
    //     }

    //     // Sinon, connexion normale
    //     return response()->json([
    //         'message' => 'Connexion réussie.',
    //         'token' => $token,
    //         'user' => $user
    //     ]);
    // }



    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}
