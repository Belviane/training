<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Mail\EnvoiIdentifiants;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Models\Formateur;
use App\Models\Parents;
use App\Models\Administrateur;
use App\Models\Superviseur;
use App\Models\Caissier;
use App\Models\Auditeur;
use App\Models\Vendeur;
use App\Models\Apprenant;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;


class UtilisateurController extends Controller
{
    // Liste utilisateurs hors administrateurs
    public function index(Request $request)
    {
        $adminRoleId = DB::table('roles')->where('libelle', 'administrateur')->value('id');

        $perPage = $request->input('per_page', 10);

        $query = User::with([
            'administrateur',
            'superviseur',
            'formateur',
            'apprenant',
            'parents',
            'caissier',
            'auditeur',
            'vendeur'
        ])->where('role_id', '!=', $adminRoleId);


        // $query = DB::table('utilisateurs')
        //     ->where('role_id', '!=', $adminRoleId);

        if ($request->filled('nom')) {
            $query->where('nom', 'like', '%' . $request->input('nom') . '%');
        }

        if ($request->filled('prenom')) {
            $query->where('prenom', 'like', '%' . $request->input('prenom') . '%');
        }

        if ($request->filled('is_active')) {
            $isActive = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($isActive !== null) {
                $query->where('is_active', $isActive);
            }
        }

        $users = $query->paginate($perPage);

        return response()->json($users);
    }

    // Création utilisateur avec envoi mail + génération identifiants + code vérif
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'genre' => 'required',
            'date_naissance' => 'required|date',
            'email' => 'required|email|unique:utilisateurs,email',
            'role_id' => 'required|exists:roles,id',
        ]);

        // Génération login unique (exemple simple)
        $login = Str::slug($request->prenom . '.' . $request->nom);
        // Assurez-vous que ce login est unique
        while (User::where('login', $login)->exists()) {
            $login = Str::slug($request->prenom . '.' . $request->nom) . rand(100, 999);
        }

        // Génération mot de passe temporaire aléatoire
        $motDePasse = Str::random(10);

        // Code de vérification à 6 chiffres
        $codeVerif = rand(100000, 999999);

        $utilisateur = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'genre' => $request->genre,
            'date_naissance' => $request->date_naissance,
            'login' => $login,
            'email' => $request->email,
            'password' => Hash::make($motDePasse),
            'role_id' => $request->role_id,
            'verification_code' => $codeVerif,
            'email_verified' => false,
            'doit_changer_mot_de_passe' => true,
            'is_active' => true,
        ]);

        // Envoi mail identifiants + code de vérification
        Mail::to($utilisateur->email)->send(new EnvoiIdentifiants($utilisateur, $motDePasse));

        return response()->json(['message' => 'Utilisateur créé avec succès. Identifiants envoyés par email.']);
    }

    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $utilisateur = User::findOrFail($id);
        if ($utilisateur->role === 'administrateur') {
            return response()->json(['message' => 'Modification refusée.'], 403);
        }
        $utilisateur->update($request->only('nom', 'prenom', 'email'));
        return response()->json(['message' => 'Utilisateur mis à jour.']);


        if ($request->has('password')) {
            $data['password'] = bcrypt($request->password);
        }

        return $utilisateur;
    }


    public function formateur()
    {
        return $this->hasOne(Formateur::class);
    }

    public function superviseur()
    {
        return $this->hasOne(Superviseur::class);
    }

    public function apprenant()
    {
        return $this->hasOne(Apprenant::class);
    }

    public function vendeur()
    {
        return $this->hasOne(Vendeur::class);
    }

    public function caissier()
    {
        return $this->hasOne(Caissier::class);
    }

    public function auditeur()
    {
        return $this->hasOne(Auditeur::class);
    }

    public function parent()
    {
        return $this->hasOne(Parents::class);
    }

    public function administrateur()
    {
        return $this->hasOne(Administrateur::class);
    }

    public function listerApprenants()
    {
        return User::where('role', 'apprenant')->get();
    }

    public function activer($id)
    {
        $user = auth()->user();
        if ($user->role->libelle !== 'administrateur') {
            return response()->json([
                'message' => 'Accès interdit : seuls les administrateurs peuvent ajouter les séances.'
            ], 403);
        }
        $utilisateur = User::findOrFail($id);
        $utilisateur->is_active = true;
        $utilisateur->save();

        return response()->json(['message' => 'Utilisateur activé avec succès.']);
    }

    public function desactiver($id)
    {
        $user = auth()->user();
        if ($user->role->libelle !== 'administrateur') {
            return response()->json([
                'message' => 'Accès interdit : seuls les administrateurs peuvent ajouter les séances.'
            ], 403);
        }
        $utilisateur = User::findOrFail($id);
        $utilisateur->is_active = false;
        $utilisateur->save();

        return response()->json(['message' => 'Utilisateur désactivé avec succès.']);
    }

    public function userInfo(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }

        return response()->json([
            'nom' => $user->nom,
            'prenom' => $user->prenom
        ]);
    }

    public function rechercher(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json([
                'message' => 'Veuillez entrer un terme de recherche.'
            ], 400);
        }

        $utilisateurs = User::with('role')
            ->where('nom', 'like', '%' . $query . '%')
            ->orWhere('prenom', 'like', '%' . $query . '%')
            ->orWhere('email', 'like', '%' . $query . '%')
            ->orWhereHas('role', function ($q) use ($query) {
                $q->where('libelle', 'like', '%' . $query . '%');
            })
            ->get();

        return response()->json($utilisateurs);
    }

    public function changerMotDePasse(Request $request)
    {
        $request->validate([
            'mot_de_passe_actuel' => 'required',
            'nouveau_mot_de_passe' => 'required|string|min:8|confirmed'
        ]);

        $user = auth()->user();

        if (!Hash::check($request->mot_de_passe_actuel, $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 403);
        }

        $user->password = Hash::make($request->nouveau_mot_de_passe);
        $user->doit_changer_mot_de_passe = false;
        $user->save();

        return response()->json(['message' => 'Mot de passe changé avec succès.']);
    }

    // Vérifier code email
    public function verifierEmailWeb($id, $code)
    {
        $user = User::findOrFail($id);

        if ($user->email_verified) {
            return redirect('http://localhost:4200/login'); // déjà vérifié
        }

        if ($user->verification_code == $code) {
            $user->email_verified = true;
            $user->save();

            return redirect('http://localhost:4200/login?verified=1'); // ou un toast sur le front
        }

        return redirect('http://localhost:4200/login?error=verification_failed');
    }
}
