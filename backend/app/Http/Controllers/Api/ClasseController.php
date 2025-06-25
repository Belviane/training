<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classe;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;


// use App\Models\Formation;
// use App\Models\Formateur;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ClasseController extends Controller
{


    public function verifierDisponibilite(Request $request, $id)
    {
        $classe = Classe::findOrFail($id);
        $request->validate([
            'date' => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i',
        ]);

        $conflict = $classe->seances()->where('date', $request->date)
            ->where(function ($query) use ($request) {
                $query->whereBetween('heure_debut', [$request->heure_debut, $request->heure_fin])
                      ->orWhereBetween('heure_fin', [$request->heure_debut, $request->heure_fin]);
            })->exists();

        return response()->json(['disponible' => !$conflict]);
    }



    public function getCapaciteRestante($id, Request $request)
    {
        return response()->json(['capacite_restante' => 10]); // à implémenter
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Classe::all());
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

        $user = auth()->user();
        if ($user->role->libelle !== 'superviseur') {
            return response()->json([
                'message' => 'Accès interdit : seuls les superviseurs peuvent gérer les classes.'
            ], 403);
        }
        
        $validated = $request->validate([
            'nom' => 'required|string',
            'capacite' => 'required|integer|min:1',
            'localisation' => 'nullable|string',
            'description' => 'nullable|string',
            'formation_id' => 'required|exists:formations,id'
        ]);

        $classe = Classe::create($validated);
        return response()->json($classe, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Classe $classe)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Classe $classe)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $classe = Classe::findOrFail($id);
        $classe->update($request->only(['nom', 'capacite', 'localisation', 'description']));
        return response()->json($classe);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Classe $classe)
    {
        //
    }
}
