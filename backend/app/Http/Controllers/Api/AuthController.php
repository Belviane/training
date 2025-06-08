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
            'mdp' => 'required|string|min:6',
            'email' => 'required|email|unique:utilisateurs,email',
            'password' => 'required|string|min:6|confirmed',
            'genre' => 'required|string',
            'date_naissance' => 'required|date'


        ]);

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'login' => $request->login,
            'mdp' => bcrypt($request->mdp),
            'role_id' => $request->role_id,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'genre' => $request->genre,
            'date_naissance' => $request->date_naissance
        ]);

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|email',
            'mdp' => 'required|string',
        ]);

        $user = User::where('login', $request->login)->first();

        if (!$user || !Hash::check($request->mdp, $user->mdp)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Compte désactivé. Contactez un administrateur.'], 403);
        }

        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => $user,
        ]);
    }


    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}
