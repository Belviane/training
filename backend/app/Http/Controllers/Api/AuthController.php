<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Mail\EnvoiIdentifiants;
use Illuminate\Support\Facades\Mail;


class AuthController extends Controller
{
    public function register(Request $request)
    {
       $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:utilisateurs,email',
            'genre' => 'required|string',
            'date_naissance' => 'required|date',
            'role_id' => 'required|integer'
        ]);

        // Génération automatique du login et du mot de passe
        $login = strtolower(Str::slug($request->prenom)) . rand(100, 999);
        $passwordPlain = Str::random(10);
        $verificationCode = rand(100000, 999999);

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'login' => $login,
            'email' => $request->email,
            'password' => bcrypt($passwordPlain),
            'genre' => $request->genre,
            'date_naissance' => $request->date_naissance,
            'role_id' => $request->role_id,
            'email_verified' => false,
            'doit_changer_mot_de_passe' => true,
            'verification_code' => $verificationCode,
        ]);

        // Attendre que l'observer ait créé le matricule
        $user->refresh(); // Recharge les relations

        switch ($request->role_id) {
            case 1: // administrateur
                $matricule = optional($user->administrateur)->matriculeAD;
                break;
            case 2: // superviseur
                $matricule = optional($user->superviseur)->matriculeSU;
                break;
            case 3: // formateur
                $matricule = optional($user->formateur)->matriculeAD;
                break;
            case 4: // apprenant
                $matricule = optional($user->apprenant)->matriculeAP;
                break;
            case 5: // parent
                $matricule = optional($user->parents)->matriculePA;
                break;
            case 6: // caissier
                $matricule = optional($user->caissier)->matriculeCA;
                break;
            case 7: // auditeur
                $matricule = optional($user->auditeur)->matriculeAU;
                break;
            case 8: // vendeur
                $matricule = optional($user->vendeur)->matriculeVE;
                break;
            default:
                $matricule = 'N/A';
        }

        // Envoi de l’email
        Mail::to($user->email)->send(new EnvoiIdentifiants($user, $passwordPlain, $matricule));

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'message' => 'Utilisateur inscrit avec succès. Vérifiez votre email pour vos identifiants.',
            'user' => $user,
            'token' => $token
        ], 201);
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

        // Génération token (exemple avec Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        if ($user->doit_changer_mot_de_passe) {
            return response()->json([
                'message' => 'Mot de passe temporaire, changement obligatoire.',
                'changer_password' => true,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ], 200);  // code 200 ici, pour dire que c’est OK mais action attendue
        }

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




    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}
