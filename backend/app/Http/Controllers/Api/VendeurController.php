<?php

namespace App\Http\Controllers;

use App\Models\Vendeur;
use Illuminate\Http\Request;


use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Mail\EnvoiIdentifiants;
use App\Models\User;
use Illuminate\Validation\Rule;

class VendeurController extends Controller
{
    //lister tous les vendeurs
    public function index(Request $request)
    {
    
        

        $query = Vendeur::with('utilisateur');
        if ($request->filled('is_active')) {
            $query->whereHas('utilisateur', function ($q) use ($request) {
                $q->where('is_active', $request->is_active);
            });
        }

        if ($request->filled('nom')) {
            $query->whereHas('utilisateur', function ($q) use ($request) {
                $q->where('nom', 'like', '%' . $request->nom . '%');
            });
        }

        if ($request->filled('prenom')) {
            $query->whereHas('utilisateur', function ($q) use ($request) {
                $q->where('prenom', 'like', '%' . $request->prenom . '%');
            });
        }

        if ($request->filled('annee')) {
            $query->whereHas('utilisateur', function ($q) use ($request) {
                $q->whereYear('date_naissance', $request->annee);
            });
        }

        $vendeurs = $query->paginate($request->get('per_page', 10)); // 10 par défaut

        return response()->json($vendeurs);
    }

   
    public function create()
    {
        //
    }

    //ajouter un nouveau vendeur
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'genre' => 'required|string',
            'email' => 'required|email|unique:utilisateurs,email',
            'date_naissance' => 'required|date',
        ]);

        $login = strtolower(Str::slug($request->prenom)) . rand(100, 999);
        $passwordPlain = Str::random(10);
        $codeVerif = rand(100000, 999999);

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'login' => $login,
            'email' => $request->email,
            'genre' => $request->genre,
            'date_naissance' => $request->date_naissance,
            'password' => Hash::make($passwordPlain),
            'role_id' => 7,
            'verification_code' => $codeVerif,
            'email_verified' => false,
            'doit_changer_mot_de_passe' => true,
        ]);

        $vendeur = Vendeur::create([
            'utilisateur_id' => $user->id,
            'date_derniere_connexion' => now(),
        ]);

        Mail::to($user->email)->send(new EnvoiIdentifiants($user, $passwordPlain, $user->login));

        return response()->json([
            'message' => 'Vendeur créé avec succès.',
            'user' => $user,
            'vendeur' => $vendeur
        ]);
    }

    //afficher un vendeur specifique
    public function show( $id)
    {
        $vendeur = Vendeur::with('utilisateur')->findOrFail($id);

        return response()->json($vendeur);
    }

  
    public function edit(Vendeur $vendeur)
    {
        //
    }

    //mettre a jour un vendeur
    public function update(Request $request, $id)
    {
        $vendeur = Vendeur::with('utilisateur')->findOrFail($id);
        $user = auth()->user();

        // Vérification : seul admin ou le vendeur concerné peut modifier
        if ($user->role_id !== 1 && $user->id !== $vendeur->utilisateur_id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|string',
            'prenom' => 'sometimes|string',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('utilisateurs', 'email')->ignore($vendeur->utilisateur_id),
            ],
            'login' => [
                'sometimes',
                'string',
                Rule::unique('utilisateurs', 'login')->ignore($vendeur->utilisateur_id),
            ],
            'date_naissance' => 'sometimes|date',
            'genre' => 'sometimes|string',
            'password' => 'sometimes|string|min:6',
            'photo_profil' => 'sometimes|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Hash mot de passe si fourni
        if ($request->filled('password')) {
            $vendeur->utilisateur->password = bcrypt($request->password);
        }

        // Mise à jour photo
        if ($request->hasFile('photo_profil')) {
            if ($vendeur->utilisateur->photo_profil) {
                Storage::disk('public')->delete($vendeur->utilisateur->photo_profil);
            }
            $photoPath = $request->file('photo_profil')->store('photos', 'public');
            $vendeur->utilisateur->photo_profil = $photoPath;
        }

        // Mise à jour des autres champs utilisateur
        $vendeur->utilisateur->fill($request->only([
            'nom', 'prenom', 'login', 'email', 'genre', 'date_naissance'
        ]));
        $vendeur->utilisateur->save();

        // Mise à jour date dernière connexion vendeur
        $vendeur->date_derniere_connexion = now();
        $vendeur->save();

        return response()->json([
            'message' => 'Vendeur mis à jour avec succès.',
            'vendeur' => $vendeur->fresh()
        ]);
    }

    //exporter la liste des vendeurs en format pdf
    public function exportPDFVendeurs()
    {
        $vendeurs = Vendeur::with('utilisateur')->get();

        $html = '<h1>Liste des vendeurs</h1>';
        $html .= '<table border="1" cellspacing="0" cellpadding="5">';
        $html .= '<thead><tr><th>Nom</th><th>Prénom</th><th>Email</th></tr></thead><tbody>';

        foreach ($vendeurs as $vendeur) {
            $html .= '<tr>';
            $html .= '<td>' . htmlspecialchars($vendeur->utilisateur->nom ?? '') . '</td>';
            $html .= '<td>' . htmlspecialchars($vendeur->utilisateur->prenom ?? '') . '</td>';
            $html .= '<td>' . htmlspecialchars($vendeur->utilisateur->email ?? '') . '</td>';
            $html .= '</tr>';
        }

        $html .= '</tbody></table>';

        $pdf = Pdf::loadHTML($html);

        return $pdf->download('vendeurs.pdf');
    }

}
