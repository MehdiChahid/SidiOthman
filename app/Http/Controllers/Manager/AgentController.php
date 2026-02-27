<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Categor;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AgentController extends Controller
{
    /**
     * Liste des agents/techniciens
     */
    public function index()
    {
        $agents = User::where('role_id', 4)
            ->with(['categor', 'role'])
            ->latest()
            ->get();

        return Inertia::render('Manager/Agents/Index', [
            'agents' => $agents,
        ]);
    }

    /**
     * Formulaire de création d'un agent
     */
    public function create()
    {
        $categories = Categor::all();
        
        return Inertia::render('Manager/Agents/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Enregistrer un nouvel agent
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:255|unique:users',
            'password' => 'required|string|min:8',
            'categor_id' => 'required|exists:categors,id',
        ]);

        $agentRole = Role::where('name', 'agent')->orWhere('id', 4)->first();

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role_id' => $agentRole->id ?? 4,
            'categor_id' => $validated['categor_id'],
            'registration_completed' => true,
        ]);

        return redirect()->route('manager.agents.index')->with('success', 'Agent créé avec succès !');
    }

    /**
     * Afficher un agent
     */
    public function show(User $agent)
    {
        $agent->load(['categor', 'role', 'reserves_assignees.categor', 'reserves_assignees.suivi.statut']);

        return Inertia::render('Manager/Agents/Show', [
            'agent' => $agent,
        ]);
    }

    /**
     * Formulaire d'édition
     */
    public function edit(User $agent)
    {
        $categories = Categor::all();

        return Inertia::render('Manager/Agents/Edit', [
            'agent' => $agent->load('categor'),
            'categories' => $categories,
        ]);
    }

    /**
     * Mettre à jour un agent
     */
    public function update(Request $request, User $agent)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $agent->id,
            'phone' => 'nullable|string|max:255|unique:users,phone,' . $agent->id,
            'password' => 'nullable|string|min:8',
            'categor_id' => 'required|exists:categors,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'categor_id' => $validated['categor_id'],
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $agent->update($updateData);

        return redirect()->route('manager.agents.index')->with('success', 'Agent modifié avec succès !');
    }

    /**
     * Supprimer un agent
     */
    public function destroy(User $agent)
    {
        $agent->delete();

        return redirect()->route('manager.agents.index')->with('success', 'Agent supprimé avec succès !');
    }
}
