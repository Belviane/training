<?php

namespace App\Http\Controllers;

use App\Models\formateure;
use Illuminate\Http\Request;



use App\Models\Utilisateur;
use App\Http\Controllers\Controller;

class FormateureController extends Controller
{
    protected $fillable = ['utilisateur_id', 'specialite'];

     public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
            'utilisateur_id' => 'required|exists:utilisateurs,id',
            'specialite' => 'nullable|string'
        ]);

        $formateure = formateure::create([
            'utilisateur_id' => $request->utilisateur_id,
            'specialite' => $request->specialite,
        ]);

        return response()->json($formateure);
    }

    /**
     * Display the specified resource.
     */
    public function show(formateure $formateure)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(formateure $formateure)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, formateure $formateure)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(formateure $formateure)
    {
        //
    }
}
