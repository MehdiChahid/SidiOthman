<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Projet;
use App\Models\Secteur;
use App\Models\Immeuble;
use App\Models\Appartement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class RegistrationDataController extends Controller
{
    /**
     * Récupérer tous les projets
     */
    public function getProjets()
    {
        $projets = Projet::where('status', 'en_cours')
            ->select('id', 'name', 'description', 'location')
            ->get();
        
        return response()->json($projets);
    }

    /**
     * Récupérer les secteurs d'un projet
     */
    public function getSecteurs(Request $request)
    {
        $validated = $request->validate([
            'projet_id' => 'required|exists:projets,id'
        ]);

        $secteurs = Secteur::where('projet_id', $validated['projet_id'])
            ->select('id', 'name', 'description')
            ->get();
        
        return response()->json($secteurs);
    }

    /**
     * Récupérer les immeubles d'un secteur
     */
    public function getImmeubles(Request $request)
    {
        $validated = $request->validate([
            'secteur_id' => 'required|exists:secteurs,id'
        ]);

        $immeubles = Immeuble::where('secteur_id', $validated['secteur_id'])
            ->select('id', 'name')
            ->get();
        
        return response()->json($immeubles);
    }

    /**
     * Récupérer les appartements disponibles d'un immeuble (non affectés)
     */
    public function getAppartements(Request $request)
    {
        $validated = $request->validate([
            'immeuble_id' => 'required|exists:immeubles,id'
        ]);

        // Récupérer uniquement les appartements disponibles et non affectés (user_id est null)
        $appartements = Appartement::where('immeuble_id', $validated['immeuble_id'])
            ->where('status', 'disponible')
            ->whereNull('user_id') // Exclure les appartements déjà affectés à un utilisateur
            ->select('id', 'numero', 'etage', 'status', 'user_id')
            ->get();
        
        return response()->json($appartements);
    }

    /**
     * Récupérer TOUS les appartements d'un immeuble (pour le manager)
     * Y compris ceux déjà affectés avec leurs clients
     */
    public function getAppartementsAll(Request $request)
    {
        $validated = $request->validate([
            'immeuble_id' => 'required|exists:immeubles,id'
        ]);

        $appartements = Appartement::where('immeuble_id', $validated['immeuble_id'])
            ->with('user:id,name,email,phone')
            ->select('id', 'numero', 'etage', 'status', 'user_id')
            ->get();
        
        return response()->json($appartements);
    }

    /**
     * Récupérer le client d'un appartement
     */
    public function getClientByAppartement(Request $request, $appartementId)
    {
        $appartement = Appartement::with('user:id,name,email,phone')->find($appartementId);
        
        if (!$appartement) {
            return response()->json(['error' => 'Appartement non trouvé'], 404);
        }

        return response()->json([
            'appartement' => $appartement,
            'user' => $appartement->user
        ]);
    }

    /**
     * Créer un utilisateur et l'affecter à un appartement
     */
    public function createUserWithAppartement(Request $request)
    {
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:255|unique:users,phone',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'appartement_id' => 'required|exists:appartements,id',
            'projet_id' => 'nullable|exists:projets,id',
            'secteur_id' => 'nullable|exists:secteurs,id',
            'immeuble_id' => 'nullable|exists:immeubles,id',
        ]);

        // Vérifier que l'appartement n'est pas déjà affecté
        $appartement = Appartement::find($validated['appartement_id']);
        if ($appartement->user_id !== null) {
            return response()->json([
                'message' => 'Cet appartement est déjà affecté à un client.'
            ], 422);
        }

        // Créer l'utilisateur
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role_id' => 1, // Client
            'projet_id' => $validated['projet_id'] ?? null,
            'secteur_id' => $validated['secteur_id'] ?? null,
            'immeuble_id' => $validated['immeuble_id'] ?? null,
            'appartement_id' => $validated['appartement_id'],
            'registration_completed' => true,
        ]);

        // Affecter l'appartement à l'utilisateur
        $appartement->update(['user_id' => $user->id]);

        $userWithRelation = $user->load('appartement');
        
        // Retourner la réponse JSON avec l'utilisateur créé
        return response()->json([
            'message' => 'Client créé et appartement affecté avec succès',
            'user' => $userWithRelation
        ], 201);
    }
}
