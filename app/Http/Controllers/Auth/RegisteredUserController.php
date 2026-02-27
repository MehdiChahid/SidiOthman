<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Appartement;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'projet_id' => 'nullable|exists:projets,id',
            'secteur_id' => 'nullable|exists:secteurs,id',
            'immeuble_id' => 'nullable|exists:immeubles,id',
            'appartement_id' => [
                'nullable',
                'exists:appartements,id',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $appartement = Appartement::find($value);
                        if ($appartement && $appartement->user_id !== null) {
                            $fail('Cet appartement est déjà affecté à un autre utilisateur.');
                        }
                        if ($appartement && $appartement->status !== 'disponible') {
                            $fail('Cet appartement n\'est pas disponible.');
                        }
                    }
                },
            ],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'projet_id' => $request->projet_id,
            'secteur_id' => $request->secteur_id,
            'immeuble_id' => $request->immeuble_id,
            'appartement_id' => $request->appartement_id,
            'registration_completed' => $request->filled('appartement_id'),
        ]);

        // Mettre à jour l'appartement avec le user_id pour le bloquer
        if ($request->appartement_id) {
            Appartement::where('id', $request->appartement_id)
                ->update(['user_id' => $user->id]);
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
