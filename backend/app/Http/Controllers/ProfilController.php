<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfilController extends Controller
{
    public function afficherProfil(Request $request)
    {
        return response()->json($request->user());
    }

    public function modifierProfil(Request $request)
    {
        $user = $request->user();
        $user->update($request->only('nom', 'prenom', 'email'));
        return response()->json(['message' => 'Profil mis à jour.']);
    }
}
