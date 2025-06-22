<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Presence;
use Illuminate\Http\Request;


use App\Models\Seance;
use App\Models\Apprenant;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Barryvdh\DomPDF\Facade\Pdf;

class PresenceController extends Controller
{

    // Marquer la présence d’un apprenant à une séance.
    public function marquerPresence(Request $request)
    {
        $user = auth()->user();
        if ($user->role->libelle !== 'formateur') {
            return response()->json([
                'message' => 'Accès interdit : seuls les formateurs peuvent gérer les présences.'
            ], 403);
        }
        $validator = Validator::make($request->all(), [
            'apprenant_id' => 'required|exists:apprenants,id',
            'seance_id' => 'required|exists:seances,id',
            'est_present' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $presence = Presence::updateOrCreate(
            [
                'apprenant_id' => $request->apprenant_id,
                'seance_id' => $request->seance_id
            ],
            [
                'est_present' => $request->est_present
            ]
        );

        return response()->json($presence, 200);
    }

    //Justifier une absence avec un fichier ou un texte. 
    public function justifierAbsence(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'apprenant_id' => 'required|exists:apprenants,id',
            'seance_id' => 'required|exists:seances,id',
            'justificatif' => 'nullable|string',
            'remarque' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $presence = Presence::where('apprenant_id', $request->apprenant_id)
            ->where('seance_id', $request->seance_id)
            ->first();

        if (!$presence) {
            return response()->json(['message' => 'Présence non trouvée'], 404);
        }

        $presence->update([
            'justificatif' => $request->justificatif,
            'remarque' => $request->remarque
        ]);

        return response()->json($presence, 200);
    }

    //Liste des présences pour une séance.
    public function listePresenceParSeance($seance_id)
    {
        $presences = Presence::where('seance_id', $seance_id)->get();
        return response()->json($presences);
    }   

    //Liste des présences pour un apprenant.
    public function listePresenceParApprenant($apprenant_id)
    {
        $apprenant = Apprenant::with('seances')->findOrFail($apprenant_id);
        return response()->json($apprenant->seances);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Presence $presence)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Presence $presence)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Presence $presence)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Presence $presence)
    {
        //
    }

    public function presencesParDate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date'
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 400);

        $seances = Seance::whereDate('date', $request->date)->pluck('id');
        $presences = Presence::whereIn('seance_id', $seances)->with(['seance', 'apprenant'])->get();

        return response()->json($presences);
    }

    public function exporterCSV($seance_id)
    {
        $presences = Presence::with('apprenant')
            ->where('seance_id', $seance_id)
            ->get();

        $seance = Seance::findOrFail($seance_id);

        $csvData = "Nom,Prenom,Présence,Justification\n";
        foreach ($presences as $p) {
            $csvData .= $p->apprenant->nom . "," . $p->apprenant->prenom . "," . ($p->est_present ? "Oui" : "Non") . "," . ($p->justification ?? '') . "\n";
        }

        $fileName = 'presence_seance_' . $seance_id . '.csv';
        Storage::disk('local')->put($fileName, $csvData);

        return response()->download(storage_path("app/" . $fileName))->deleteFileAfterSend();
    }

    public function exporterPDF($seance_id)
    {
        $seance = Seance::with(['formation', 'classe', 'formateur', 'presences.apprenant'])->findOrFail($seance_id);
        
        $pdf = Pdf::loadView('pdf.presence', compact('seance'));
        return $pdf->download('feuille_presence_' . $seance->titre . '.pdf');
    }
}
