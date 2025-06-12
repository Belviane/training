<?php

namespace App\Http\Controllers\Api;

use App\Models\Formation;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FormationController extends Controller
{
    //Display a listing of the resource.
    public function index()
    {
        return response()->json(Formation::all());
    }

    //Show the form for creating a new resource.
    public function create()
    {}

    //Store a newly created resource in storage.
    public function store(Request $request)
    {
       try {
        $validated = $request->validate([
            'nom_formation' => 'required|string|max:255',
            'libelle_formation' => 'required|string',
            'date_debutf' => 'required|date',
            'date_finf' => 'required|date|after_or_equal:date_debutf',
            'nombre_seancef' => 'required|integer|min:1',
        ]);

        $formation = Formation::create($validated);

        return response()->json([
            'message' => 'Formation créée avec succès.',
            'formation' => $formation
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Erreur lors de la création: ' . $e->getMessage()
        ], 500);
    }
    }

    // Display the specified resource.
    public function show($id)
    {
        $formation = Formation::findOrFail($id); // ← Recherche explicite
        return response()->json($formation);
    }

    public function edit(string $id)
    {
        //
    }

    //Update the specified resource in storage.
    public function update(Request $request, $id)
    {
        $formation = Formation::findOrFail($id);
        $validated = $request->validate([
            'nom_formation' => 'sometimes|string|max:255',
            'libelle_formation' => 'sometimes|string',
            'date_debutf' => 'sometimes|date',
            'date_finf' => 'sometimes|date|after:date_debutf',
            'nombre_seancef' => 'sometimes|integer',
        ]);

        $formation->update($validated);
        return response()->json($formation);
    }

    //Remove the specified resource from storage.
    public function destroy($id)
    {
         $formation = Formation::findOrFail($id);
        $formation->delete();
        return response()->json(null, 204);
    }

    public function getApprenants($id)
    {
        // exemple : retourne tous les utilisateurs liés à une formation
        $apprenants = Formation::findOrFail($id)->apprenants; // ou une relation
        return response()->json($apprenants);
    }

    public function ajouterApprenant(Request $request, $id)
    {
         try {
            $formation = Formation::findOrFail($id);
            $request->validate([
                'utilisateur_id' => 'required|exists:utilisateurs,id'
            ]);

            $formation->apprenants()->attach($request->utilisateur_id, [
                'formateur_id' => auth()->id(), // ou un testeur
                'date_inscription' => now(),
                'statut' => 'inscrit'
            ]);

            return response()->json(['message' => 'Apprenant ajouté à la formation.']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
