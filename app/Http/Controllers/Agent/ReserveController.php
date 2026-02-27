<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Reserve;
use App\Models\Statut;
use App\Models\Suivi;
use App\Models\Fichie;
use App\Models\Fichierdetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ReserveController extends Controller
{
    /**
     * Afficher la liste des réserves assignées à l'agent
     */
    public function index(Request $request)
    {
        $agentId = auth()->user()->id;
        
        // Charger toutes les réserves assignées à l'agent (sans pagination pour filtrage côté client)
        $reserves = Reserve::where('agent_id', $agentId)
            ->with([
                'user:id,name,email,phone',
                'appartement:id,numero',
                'immeuble:id,name',
                'secteur:id,name',
                'projet:id,name',
                'categor:id,name',
                'suivi.statut:id,name',
                'fichie.fichierdetails:id,fichie_id,nom_fichier,nom_stockage,chemin_complet,extension'
            ])
            ->latest()
            ->get();

        return Inertia::render('Agent/Reserves/Index', [
            'reserves' => $reserves,
            'statuts' => Statut::all(),
            'categories' => \App\Models\Categor::all(),
        ]);
    }

    /**
     * Afficher les détails d'une réserve
     */
    public function show(Reserve $reserve)
    {
        // Vérifier que la réserve est assignée à cet agent
        if ($reserve->agent_id !== auth()->user()->id) {
            abort(403, 'Cette réserve ne vous est pas assignée.');
        }

        $reserve->load([
            'user:id,name,email,phone',
            'appartement:id,numero,etage',
            'immeuble:id,name',
            'secteur:id,name',
            'projet:id,name',
            'categor:id,name',
            'suivi.statut:id,name',
            'fichie.fichierdetails:id,fichie_id,nom_fichier,nom_stockage,chemin_complet,extension',
        ]);

   
        
        $historiqueSuivis = Suivi::where('reserve_id', $reserve->id)->get();
 
        $historiqueSuivis = $historiqueSuivis->sortByDesc('date')->sortByDesc('created_at')->values();

        return Inertia::render('Agent/Reserves/Show', [
            'reserve' => $reserve,
            'statuts' => Statut::all(),
            'historiqueSuivis' => $historiqueSuivis,
        ]);
    }

    /**
     * Mettre à jour le statut d'une réserve avec preuve
     */
    public function updateStatus(Request $request, Reserve $reserve)
    {
        // Vérifier que la réserve est assignée à cet agent
        if ($reserve->agent_id !== auth()->user()->id) {
            abort(403, 'Cette réserve ne vous est pas assignée.');
        }

        $validated = $request->validate([
            'statut_id' => 'required|exists:statuts,id',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|max:5120', // 5MB max
        ]);

        // Obtenir ou créer le fichier pour cette réserve
        $fichie = $reserve->fichie;
        if (!$fichie) {
            $fichie = Fichie::create([
                'user_id' => auth()->user()->id,
            ]);
            $reserve->update(['fichie_id' => $fichie->id]);
        }

        // Créer un nouveau fichie pour ce suivi (pour isoler les preuves de chaque changement de statut)
        $fichieSuivi = Fichie::create([
            'user_id' => auth()->user()->id,
        ]);

        // Gérer l'upload de la photo si présente
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $nomOriginal = $photo->getClientOriginalName();
            $extension = $photo->getClientOriginalExtension();
            $nomStockage = \Illuminate\Support\Str::uuid() . '.' . $extension;
            
            // Stocker le fichier
            $chemin = $photo->storeAs('preuves', $nomStockage, 'public');
            
            // Créer un fichierdetail pour la photo dans le fichie du suivi
            Fichierdetail::create([
                'fichie_id' => $fichieSuivi->id,
                'nom_fichier' => $nomOriginal,
                'nom_stockage' => $nomStockage,
                'chemin_complet' => $chemin,
                'taille_octets' => $photo->getSize(),
                'type_mime' => $photo->getMimeType(),
                'extension' => $extension,
                'uploadeur_id' => auth()->user()->id,
                'statut_id' => 1, // Actif
                'storage_public' => true,
            ]);
        }
        Suivi::create([
            'date' => now(),
            'statut_id' => $validated['statut_id'],
            'description' => $validated['description'] ?? null,
            'fichie_id' => $fichieSuivi->id,
            'reserve_id' => $reserve->id,
        ]);

 
        // Si le statut est "résolu" ou "fermé", mettre à jour closed_at
        $statut = Statut::find($validated['statut_id']);
        if (in_array(strtolower($statut->name), ['résolu', 'fermé', 'resolu', 'ferme', 'closed', 'resolved'])) {
            $reserve->update(['closed_at' => now()]);
        }

        return redirect()->back()->with('success', 'Statut mis à jour avec succès.');
    }
}

