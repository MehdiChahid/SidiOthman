<?php

namespace App\Http\Controllers;

use App\Models\Reserve;
use App\Models\Categor;
use App\Models\Fichie;
use App\Models\Fichierdetail;
use App\Models\Suivi;
use App\Models\Statut;
use App\Models\ReserveExample;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReserveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        $reserves = Reserve::with([
            'user',
            'appartement',
            'immeuble',
            'secteur',
            'projet',
            'categor',
            'suivi.statut',
            'fichie.fichierdetails'
        ])
        ->where('user_id', $user->id)
        ->latest()
        ->get();

        return Inertia::render('Reserves/Index', [
            'reserves' => $reserves,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();
        
        $categories = Categor::all();
        $examples = ReserveExample::where('is_active', true)
            ->with('categor')
            ->orderBy('order')
            ->get();
        
        return Inertia::render('Reserves/Create', [
            'categories' => $categories,
            'examples' => $examples,
            'userInfo' => [
                'projet' => $user->projet,
                'secteur' => $user->secteur,
                'immeuble' => $user->immeuble,
                'appartement' => $user->appartement,
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'categor_id' => 'required|exists:categors,id',
            'priority' => 'required|in:basse,moyenne,haute',
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
        ]);

        DB::beginTransaction();
        try {
            $user = auth()->user();

            // Créer le fichie pour stocker les photos
            $fichie = Fichie::create([
                'user_id' => $user->id,
            ]);

            // Upload des photos
            if ($request->hasFile('photos')) {
                foreach ($request->file('photos') as $photo) {
                    $nomOriginal = $photo->getClientOriginalName();
                    $extension = $photo->getClientOriginalExtension();
                    $nomStockage = Str::uuid() . '.' . $extension;
                    
                    // Stocker le fichier
                    $chemin = $photo->storeAs('reserves', $nomStockage, 'public');
                    
                    Fichierdetail::create([
                        'fichie_id' => $fichie->id,
                        'nom_fichier' => $nomOriginal,
                        'nom_stockage' => $nomStockage,
                        'chemin_complet' => $chemin,
                        'taille_octets' => $photo->getSize(),
                        'type_mime' => $photo->getMimeType(),
                        'extension' => $extension,
                        'uploadeur_id' => $user->id,
                        'statut_id' => 1, // Actif
                        'storage_public' => true,
                    ]);
                }
            }

         


            // Créer la réserve
            $reserve = Reserve::create([
                'appartement_id' => $user->appartement_id,
                'immeuble_id' => $user->immeuble_id,
                'secteur_id' => $user->secteur_id,
                'projet_id' => $user->projet_id,
                'user_id' => $user->id,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'categor_id' => $validated['categor_id'],
                'priority' => $validated['priority'],
                'fichie_id' => $fichie->id,
                'reported_at' => now(),
            ]);

            Suivi::create([
                'date' => now(),
                'statut_id' => 1,
                'description' => 'Réserve créée par le client',
                'fichie_id' => $fichie->id,
                'reserve_id' => $reserve->id,
            ]);


            DB::commit();

            return redirect()->route('reserves.index')->with('success', 'Réserve créée avec succès !');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erreur lors de la création de la réserve: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Reserve $reserve)
    {
        // Vérifier que l'utilisateur a le droit de voir cette réserve
        if ($reserve->user_id !== auth()->id()) {
            abort(403);
        }

        $reserve->load([
            'user',
            'appartement',
            'immeuble',
            'secteur',
            'projet',
            'categor',
            'suivi.statut',
            'fichie.fichierdetails'
        ]);

        return Inertia::render('Reserves/Show', [
            'reserve' => $reserve,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reserve $reserve)
    {
        // Vérifier que l'utilisateur a le droit de modifier cette réserve
        if ($reserve->user_id !== auth()->id()) {
            abort(403);
        }

        $categories = Categor::all();

        return Inertia::render('Reserves/Edit', [
            'reserve' => $reserve->load('fichie.fichierdetails'),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reserve $reserve)
    {
        // Vérifier que l'utilisateur a le droit de modifier cette réserve
        if ($reserve->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'categor_id' => 'required|exists:categors,id',
            'priority' => 'required|in:basse,moyenne,haute',
        ]);

        $reserve->update($validated);

        return redirect()->route('reserves.index')->with('success', 'Réserve modifiée avec succès !');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reserve $reserve)
    {
        // Vérifier que l'utilisateur a le droit de supprimer cette réserve
        if ($reserve->user_id !== auth()->id()) {
            abort(403);
        }

        // Supprimer les fichiers
        foreach ($reserve->fichie->fichierdetails as $fichierdetail) {
            Storage::disk('public')->delete($fichierdetail->chemin_complet);
            $fichierdetail->delete();
        }

        $reserve->delete();

        return redirect()->route('reserves.index')->with('success', 'Réserve supprimée avec succès !');
    }
}
