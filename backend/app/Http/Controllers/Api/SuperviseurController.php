<?php

namespace App\Http\Controllers\Api;

use App\Models\superviseure;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\SuperviseurExports;
use Maatwebsite\Excel\Facades\Excel;


class SuperviseurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Superviseur::with('utilisateurs');
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

        $superviseurs = $query->paginate($request->get('per_page', 10)); // 10 par défaut

        return response()->json($superviseurs);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'genre' => 'required|string',
            'email' => 'required|email|unique:utilisateurs,email',
            'password' => 'required|string|min:6',
            'date_naissance' => 'required|date',
        ]);

        $role = Role::where('libelle', 'superviseur')->first();

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'genre' => $request->genre,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'login' => strtolower($request->prenom . '.' . $request->nom),
            'date_naissance' => $request->date_naissance,
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        $superviseur = Superviseur::create([
            'utilisateur_id' => $user->id,
        ]);

        return response()->json([
            'message' => 'Superviseur créé avec succès.',
            'utilisateur' => $user,
            'superviseur' => $superviseur,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show( $id)
    {
         $superviseur = Superviseur::with('utilisateur')->findOrFail($id);

        return response()->json($superviseur);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(superviseure $superviseure)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $superviseur = Superviseur::with('utilisateurs')->findOrFail($id);
        $user = auth()->user();

        // Vérifie que l'utilisateur connecté est bien le propriétaire
        if ($user->id !== $superviseur->utilisateur_id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $request->validate([
            'nom' => 'sometimes|string',
            'prenom' => 'sometimes|string',
            'login' => 'sometimes|string|unique:utilisateurs,login,' . $user->id,
            'date_naissance' => 'sometimes|date',
            'password' => 'sometimes|string|min:6',
        ]);

        // Mise à jour des données utilisateur
        if ($request->has('password')) {
            $user->password = bcrypt($request->password);
        }

        $user->fill($request->only([
            'nom',
            'prenom',
            'login',
            'date_naissance'
        ]));

        $user->save();

        return response()->json([
            'message' => 'Informations mises à jour avec succès.',
            'utilisateur' => $user
        ]);
    }

    public function exportExcel()
    {
        return Excel::download(new SuperviseurExport, 'superviseurs.xlsx');
    }

    public function exportPDF()
    {
        $superviseurs = Superviseur::with('utilisateur')->get();

        $pdf = Pdf::loadView('exports.superviseurs_pdf', compact('superviseurs'));

        return $pdf->download('superviseurs.pdf');
    }
}
