<?php

namespace App\Http\Controllers;

use App\Models\Formation;

use Illuminate\Http\Request;

class FormationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Formation::all());
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


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $formation = Formation::findOrFail($id); // ← Recherche explicite
        return response()->json($formation);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
         $formation = Formation::findOrFail($id);
        $formation->delete();
        return response()->json(null, 204);
    }
}
