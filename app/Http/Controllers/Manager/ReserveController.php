<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Reserve;
use App\Models\Categor;
use App\Models\Fichie;
use App\Models\Fichierdetail;
use App\Models\Suivi;
use App\Models\Statut;
use App\Models\User;
use App\Models\Projet;
use App\Models\Secteur;
use App\Models\Immeuble;
use App\Models\Appartement;
use App\Models\ReserveExample;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReserveController extends Controller
{

    public function index()
    {
        $reserves = Reserve::orderBy('created_at', 'asc')->get();


        $reserves->load(
            'user',
            'agent',
            'appartement',
            'immeuble',
            'secteur',
            'projet',
            'categor',
            'suivi.statut',
            'fichie.fichierdetails'
        );


        $categories = Categor::all();
        $statuts = Statut::all();
        $agents = User::where('role_id', 4)->with('categor')->get();
        $projets = Projet::all();

        return Inertia::render('Manager/Reserves/Index', [
            'reserves' => $reserves,
            'categories' => $categories,
            'statuts' => $statuts,
            'agents' => $agents,
            'projets' => $projets,
        ]);
    }

    /**
     * Afficher le formulaire de création de réserve pour un client
     */
    public function create()
    {
        $categories = Categor::all();
        $examples = ReserveExample::where('is_active', true)
            ->with('categor')
            ->orderBy('order')
            ->get();
        $projets = Projet::where('status', 'en_cours')->get();

        return Inertia::render('Manager/Reserves/Create', [
            'categories' => $categories,
            'examples' => $examples,
            'projets' => $projets,
        ]);
    }

    /**
     * Enregistrer une nouvelle réserve pour un client
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'categor_id' => 'required|exists:categors,id',
            'priority' => 'required|in:basse,moyenne,haute',
            'projet_id' => 'required|exists:projets,id',
            'secteur_id' => 'required|exists:secteurs,id',
            'immeuble_id' => 'required|exists:immeubles,id',
            'appartement_id' => 'required|exists:appartements,id',
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        DB::beginTransaction();
        try {
            // Créer le fichie pour stocker les photos
            $fichie = Fichie::create([
                'user_id' => $validated['user_id'],
            ]);

            // Upload des photos
            if ($request->hasFile('photos')) {
                foreach ($request->file('photos') as $photo) {
                    $nomOriginal = $photo->getClientOriginalName();
                    $extension = $photo->getClientOriginalExtension();
                    $nomStockage = Str::uuid() . '.' . $extension;
                        
                    $chemin = $photo->storeAs('reserves', $nomStockage, 'public');
                    
                    Fichierdetail::create([
                        'fichie_id' => $fichie->id,
                        'nom_fichier' => $nomOriginal,
                        'nom_stockage' => $nomStockage,
                        'chemin_complet' => $chemin,
                        'taille_octets' => $photo->getSize(),
                        'type_mime' => $photo->getMimeType(),
                        'extension' => $extension,
                        'uploadeur_id' => auth()->id(),
                        'statut_id' => 1,
                        'storage_public' => true,
                    ]);
                }
            }

            // Créer le statut initial "En attente"
            $statutEnAttente = Statut::firstOrCreate(['name' => 'En attente']);

            // Créer le suivi initial
 

            // Créer la réserve
            $reserve = Reserve::create([
                'appartement_id' => $validated['appartement_id'],
                'immeuble_id' => $validated['immeuble_id'],
                'secteur_id' => $validated['secteur_id'],
                'projet_id' => $validated['projet_id'],
                'user_id' => $validated['user_id'],
                'title' => $validated['title'],
                'description' => $validated['description'],
                'categor_id' => $validated['categor_id'],
                'priority' => $validated['priority'],
                'fichie_id' => $fichie->id,
                'reported_at' => now(),
            ]);
            
            Suivi::create([
                'date' => now(),
                'statut_id' => $statutEnAttente->id,
                'description' => 'Réserve créée par le manager',
                'fichie_id' => $fichie->id,
                'reserve_id' => $reserve->id,
            ]);

            DB::commit();

            return redirect()->route('manager.reserves.index')->with('success', 'Réserve créée avec succès !');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erreur lors de la création: ' . $e->getMessage()]);
        }
    }

    /**
     * Valider une réserve et éventuellement l'affecter à un agent
     */
    public function validateReserve(Request $request, Reserve $reserve)
    {
        $validated = $request->validate([
            'agent_id' => 'nullable|exists:users,id',
            'statut_id' => 'required|exists:statuts,id',
            'description' => 'nullable|string',
        ]);
        
        Suivi::create([
                'date' => now(),
                'statut_id' => 2,
                'description' => $validated['description'] ?? 'Mise à jour du statut par le manager',
                'fichie_id' => $reserve->fichie_id,
                'reserve_id' => $reserve->id,
            ]);

    }

    /**
     * Affecter une réserve à un agent
     */
    public function assignAgent(Request $request, Reserve $reserve)
    {
        $validated = $request->validate([
            'agent_id' => 'required|exists:users,id',
        ]);

        $reserve->update(['agent_id' => $validated['agent_id']]);

        Suivi::create([
            'date' => now(),
            'statut_id' => 4,
            'description' => 'Réserve affectée à un agent',
            'fichie_id' => $reserve->fichie_id,
            'reserve_id' => $reserve->id,
            'agent_id' => $validated['agent_id'],
        ]);


        return back()->with('success', 'Réserve affectée avec succès !');
    }

    /**
     * Afficher les détails d'une réserve
     */
    public function show(Reserve $reserve)
    {
        $reserve->load([
            'user',
            'agent.categor',
            'appartement',
            'immeuble',
            'secteur',
            'projet',
            'categor',
            'suivi.statut',
            'fichie.fichierdetails'
        ]);

        $agents = User::where('role_id', 4)
            ->where('categor_id', $reserve->categor_id)
            ->with('categor')
            ->get();
        $statuts = Statut::all();

        return Inertia::render('Manager/Reserves/Show', [
            'reserve' => $reserve,
            'agents' => $agents,
            'statuts' => $statuts,
        ]);
    }
}
