<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\DB;


class UtilisateurController extends Controller
{
    public function index()

    {
        $adminRoleId = DB::table('roles')->where('libelle', 'admin')->value('id');

        $users = DB::table('utilisateurs')
                ->where('role_id', '!=', $adminRoleId)
                ->get();

    return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'genre' => 'required',
            'date_naissance' => 'required|date',
            'login' => 'required|string|unique:utilisateurs',
            'mdp' => 'required|string',
            'password' => 'required|string',
            'role_id' => 'required|exists:roles,id'
        ]);

        return User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'genre' => $request->genre,
            'date_naissance' => $request->date_naissance,
            'login' => $request->login,
            'mdp' => bcrypt($request->mdp),
            'password' => bcrypt($request->password),
            'role_id' => $request->role_id
        ]);
    }

    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
         $utilisateur = User::findOrFail($id);
        if ($utilisateur->role === 'admin') {
            return response()->json(['message' => 'Modification refusée.'], 403);
        }
        $utilisateur->update($request->only('nom', 'prenom', 'email'));
        return response()->json(['message' => 'Utilisateur mis à jour.']);



        if ($request->has('mdp')) {
            $data['mdp'] = bcrypt($request->mdp);
        }



        return $utilisateur;
    }

       public function bloquer($id)
    {
        $utilisateur = User::findOrFail($id);
        if ($utilisateur->role === 'admin') {
            return response()->json(['message' => 'Blocage refusé.'], 403);
        }
        $utilisateur->update(['bloque' => true]);
        return response()->json(['message' => 'Utilisateur bloqué.']);
    }

    public function destroy($id)
    {
        return User::destroy($id);
    }

    public function formateur()
    {
        return $this->hasOne(Formateur::class);
    }

    public function parent()
    {
        return $this->hasOne(Parents::class); // Renommer le modèle si besoin
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
    $utilisateur = User::findOrFail($id);
    $utilisateur->is_active = true;
    $utilisateur->save();

    return response()->json(['message' => 'Utilisateur activé avec succès.']);
}

public function desactiver($id)
{
    $utilisateur = User::findOrFail($id);
    $utilisateur->is_active = false;
    $utilisateur->save();

    return response()->json(['message' => 'Utilisateur désactivé avec succès.']);
}
}
