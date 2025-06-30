<?php

namespace App\Http\Controllers\Api;

use App\Models\Formation;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class FormationController extends Controller
{
    private function checkAdminOrSuperviseur()
    {
        $user = auth()->user();
        if (!in_array($user->role->libelle, ['superviseur', 'administrateur'])) {
            // On renvoie directement une réponse et on arrête l'exécution
            abort(403, 'Accès non autorisé. Seuls les administrateurs ou superviseurs sont permis.');
        }
    }

    private function checkSuperviseurOnly()
    {
        $user = auth()->user();
        if ($user->role->libelle !== 'superviseur') {
            abort(403, 'Accès non autorisé. Seuls les superviseurs sont permis.');
        }
    }
    //Display a listing of the resource.
    public function index(Request $request)
    {
        
        $this->checkAdminOrSuperviseur();
        $query = Formation::with('modules.lecons'); 
        $perPage = $request->input('per_page', 10); // Par défaut 10 par page

       $formations = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($formations);
    }

    public function assignFormateurs(Request $request, $formationId)
    {
        $this->checkAdminOrSuperviseur();

        $request->validate([
            'formateur_ids' => 'required|array|min:1',
            'formateur_ids.*' => 'exists:formateurs,id',
        ]);

        $formation = Formation::findOrFail($formationId);

        // Synchronise les formateurs (ajoute/supprime pour correspondre au tableau)
        $formation->formateurs()->sync($request->formateur_ids);

        return response()->json([
            'message' => 'Formateurs assignés avec succès.',
            'formation' => $formation->load('formateurs')
        ]);
    }

    public function mesFormations()
    {
        $user = auth()->user();  // Utilisateur connecté

        if ($user->role_id != 3) {
            return response()->json([
                'message' => 'Accès interdit : seuls les formateurs peuvent voir leurs formations.'
            ], 403);
        }

        // Charge uniquement les formations liées à cet utilisateur connecté
        $formations = $user->formations()->with('modules.lecons')->get();

        return response()->json($formations);
    }



    //Store a newly created resource in storage.
    public function store(Request $request)
    {

        $this->checkAdminOrSuperviseur();

        $validated = $request->validate([
            'nom_formation' => 'required|string|max:255',
            'libelle_formation' => 'required|string',
            'date_debutf' => 'required|date',
            'date_finf' => 'required|date|after_or_equal:date_debutf',
            'nombre_seancef' => 'required|integer|min:1',
            'volume_horaire' => 'required|integer|min:1',
            'certifiante' => 'boolean',
            'prix_certification' => 'nullable|numeric',
            'prix' => 'required|numeric',
            'statut' => 'nullable|string',
            'objectif' => 'nullable|string',

            // modules et leçons imbriqués
            'modules' => 'required|array|min:1',
            'modules.*.nom' => 'required|string|max:255',
            'modules.*.description' => 'nullable|string',
            'modules.*.lecons' => 'required|array|min:1',
            'modules.*.lecons.*.titre' => 'required|string|max:255',
            'modules.*.lecons.*.contenu' => 'nullable|string',
            'modules.*.lecons.*.duree_estimee' => 'nullable|integer|min:1',
            'modules.*.lecons.*.ordre' => 'nullable|integer|min:0',
        ]);

        try {
            \DB::beginTransaction();

            // Création de la formation
            $formation = Formation::create($validated);

            // Création des modules et leçons
            foreach ($validated['modules'] as $moduleData) {
                $module = $formation->modules()->create([
                    'nom' => $moduleData['nom'],
                    'description' => $moduleData['description'] ?? null,
                ]);

                foreach ($moduleData['lecons'] as $leconData) {
                    $module->lecons()->create([
                        'titre' => $leconData['titre'],
                        'contenu' => $leconData['contenu'] ?? null,
                        'duree_estimee' => $leconData['duree_estimee'] ?? null,
                        'ordre' => $leconData['ordre'] ?? 0,
                    ]);
                }
            }

            \DB::commit();

            return response()->json([
                'message' => 'Formation créée avec succès avec modules et leçons.',
                'formation' => $formation->load('modules.lecons'),
            ], 201);
        } catch (\Exception $e) {
            \DB::rollback();
            return response()->json([
                'message' => 'Erreur lors de la création de la formation.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Display the specified resource.
    public function show($id)
    {
        $this->checkAdminOrSuperviseur();

        $formation = Formation::findOrFail($id); // ← Recherche explicite
        return response()->json($formation);
    }


    //Update the specified resource in storage.
    public function update(Request $request, $id)
    {

        $this->checkAdminOrSuperviseur();

        try {
            \DB::beginTransaction();

            $formation = Formation::findOrFail($id);
            $formation->update($validated);

            $modulesInput = $request->input('modules', []);

            foreach ($modulesInput as $moduleData) {
                if (!empty($moduleData['id'])) {
                    $module = $formation->modules()->where('id', $moduleData['id'])->firstOrFail();
                    $module->update([
                        'nom' => $moduleData['nom'],
                        'description' => $moduleData['description'] ?? null,
                    ]);
                } else {
                    $module = $formation->modules()->create([
                        'nom' => $moduleData['nom'],
                        'description' => $moduleData['description'] ?? null,
                    ]);
                }

                $leconsInput = $moduleData['lecons'] ?? [];

                foreach ($leconsInput as $leconData) {
                    if (!empty($leconData['id'])) {
                        $lecon = $module->lecons()->where('id', $leconData['id'])->firstOrFail();
                        $lecon->update([
                            'titre' => $leconData['titre'],
                            'contenu' => $leconData['contenu'] ?? null,
                            'duree_estimee' => $leconData['duree_estimee'] ?? null,
                            'ordre' => $leconData['ordre'] ?? 0,
                        ]);
                    } else {
                        $module->lecons()->create([
                            'titre' => $leconData['titre'],
                            'contenu' => $leconData['contenu'] ?? null,
                            'duree_estimee' => $leconData['duree_estimee'] ?? null,
                            'ordre' => $leconData['ordre'] ?? 0,
                        ]);
                    }
                }
            }

            \DB::commit();

            return response()->json([
                'message' => 'Formation mise à jour avec succès.',
                'formation' => $formation->load('modules.lecons'),
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la mise à jour de la formation.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    //Remove the specified resource from storage.
    public function destroy($id)
    {
       $this->checkAdminOrSuperviseur();

        $formation = Formation::findOrFail($id);
        $formation->delete();
        return response()->json(null, 204);
    }

    public function getApprenants($id)
    {
        $this->checkAdminOrSuperviseur();
        // exemple : retourne tous les utilisateurs liés à une formation
        $apprenants = Formation::findOrFail($id)->apprenants; // ou une relation
        return response()->json($apprenants);
    }

    public function search(Request $request)
    {
        $query = Formation::query();

        // Recherche par mot-clé
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom_formation', 'like', "%$search%")
                ->orWhere('libelle_formation', 'like', "%$search%")
                ->orWhere('objectif', 'like', "%$search%");
            });
        }

        // Filtre par statut
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        // Filtre par formation certifiante
        if ($request->has('certifiante')) {
            $certifiante = filter_var($request->certifiante, FILTER_VALIDATE_BOOLEAN);
            $query->where('certifiante', $certifiante);
        }

        // Filtre par intervalle de dates
        if ($request->filled('date_debut')) {
            $query->whereDate('date_debutf', '>=', $request->date_debut);
        }
        if ($request->filled('date_fin')) {
            $query->whereDate('date_finf', '<=', $request->date_fin);
        }

        // Pagination
        $formations = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($formations);
    }


   public function exportPdf(Request $request)
    {
        $this->checkAdminOrSuperviseur();
        $formations = Formation::with('modules.lecons')->get();

        $html = '<h1 style="text-align: center;">Liste des formations</h1>';

        foreach ($formations as $formation) {
            $html .= "<div style='margin-bottom:20px;'>
                <h3>{$formation->nom_formation}</h3>
                <p><strong>Libellé :</strong> {$formation->libelle_formation}</p>
                <p><strong>Dates :</strong> {$formation->date_debutf} → {$formation->date_finf}</p>
                <p><strong>Objectif :</strong> {$formation->objectif}</p>";

            foreach ($formation->modules as $module) {
                $html .= "<div style='margin-left:15px;'>
                    <strong>Module :</strong> {$module->nom} <br/>
                    <em>{$module->description}</em><br/>";

                foreach ($module->lecons as $lecon) {
                    $html .= "<div style='margin-left:15px;'>- {$lecon->titre} ({$lecon->duree_estimee} min)</div>";
                }

                $html .= "</div>";
            }

            $html .= "</div><hr>";
        }

        $pdf = Pdf::loadHTML($html)->setPaper('A4', 'portrait');

        $action = $request->query('action', 'download'); // valeur par défaut : download

        if ($action === 'inline') {
            return $pdf->stream('formations.pdf'); // affiche dans le navigateur
        }

        return $pdf->download('formations.pdf'); // déclenche téléchargement
    }
}
