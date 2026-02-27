<?php

namespace Database\Seeders;

use App\Models\Projet;
use App\Models\Secteur;
use App\Models\Immeuble;
use App\Models\Appartement;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CompleteTestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un rôle admin si n'existe pas
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['description' => 'Administrateur']
        );

        $clientRole = Role::firstOrCreate(
            ['name' => 'client'],
            ['description' => 'Client']
        );

        // Créer un utilisateur admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin Test',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
                'registration_completed' => true,
            ]
        );

        // Créer un projet de test
        $projet1 = Projet::create([
            'name' => 'Résidence Al Majd',
            'description' => 'Projet résidentiel moderne avec tous les conforts',
            'location' => 'Sidi Othman, Casablanca',
            'start_date' => '2024-01-01',
            'end_date' => '2026-12-31',
            'status' => 'en_cours',
            'user_id' => $admin->id,
        ]);

        $projet2 = Projet::create([
            'name' => 'Les Jardins de Sidi Othman',
            'description' => 'Espaces verts et appartements familiaux',
            'location' => 'Sidi Othman, Casablanca',
            'start_date' => '2024-06-01',
            'end_date' => '2027-06-30',
            'status' => 'en_cours',
            'user_id' => $admin->id,
        ]);

        // Créer des secteurs pour le projet 1
        $secteur1A = Secteur::create([
            'projet_id' => $projet1->id,
            'name' => 'Secteur A',
            'description' => 'Zone nord du projet',
        ]);

        $secteur1B = Secteur::create([
            'projet_id' => $projet1->id,
            'name' => 'Secteur B',
            'description' => 'Zone sud du projet',
        ]);

        // Créer des secteurs pour le projet 2
        $secteur2A = Secteur::create([
            'projet_id' => $projet2->id,
            'name' => 'Secteur Est',
            'description' => 'Zone est avec vue sur le jardin',
        ]);

        $secteur2B = Secteur::create([
            'projet_id' => $projet2->id,
            'name' => 'Secteur Ouest',
            'description' => 'Zone ouest proche des commodités',
        ]);

        // Créer des immeubles pour secteur 1A
        $immeuble1A1 = Immeuble::create([
            'secteur_id' => $secteur1A->id,
            'name' => 'Immeuble A1',
        ]);

        $immeuble1A2 = Immeuble::create([
            'secteur_id' => $secteur1A->id,
            'name' => 'Immeuble A2',
        ]);

        $immeuble1A3 = Immeuble::create([
            'secteur_id' => $secteur1A->id,
            'name' => 'Immeuble A3',
        ]);

        // Créer des immeubles pour secteur 1B
        $immeuble1B1 = Immeuble::create([
            'secteur_id' => $secteur1B->id,
            'name' => 'Immeuble B1',
        ]);

        $immeuble1B2 = Immeuble::create([
            'secteur_id' => $secteur1B->id,
            'name' => 'Immeuble B2',
        ]);

        // Créer des immeubles pour secteur 2A
        $immeuble2A1 = Immeuble::create([
            'secteur_id' => $secteur2A->id,
            'name' => 'Immeuble Est 1',
        ]);

        $immeuble2A2 = Immeuble::create([
            'secteur_id' => $secteur2A->id,
            'name' => 'Immeuble Est 2',
        ]);

        // Créer des immeubles pour secteur 2B
        $immeuble2B1 = Immeuble::create([
            'secteur_id' => $secteur2B->id,
            'name' => 'Immeuble Ouest 1',
        ]);

        // Créer des appartements pour immeuble A1 (4 étages, 4 appartements par étage)
        $immeubles = [$immeuble1A1, $immeuble1A2, $immeuble1A3, $immeuble1B1, $immeuble1B2, $immeuble2A1, $immeuble2A2, $immeuble2B1];
        
        foreach ($immeubles as $immeuble) {
            for ($etage = 0; $etage <= 4; $etage++) {
                for ($num = 1; $num <= 4; $num++) {
                    $numero = ($etage * 10) + $num;
                    Appartement::create([
                        'immeuble_id' => $immeuble->id,
                        'numero' => (string) $numero,
                        'etage' => (string) $etage,
                        'status' => 'disponible',
                    ]);
                }
            }
        }

        // Créer des catégories de réserves
        $categories = [
            ['name' => 'Plomberie', 'description' => 'Problèmes de plomberie, fuites, robinetterie'],
            ['name' => 'Électricité', 'description' => 'Problèmes électriques, prises, éclairage'],
            ['name' => 'Peinture', 'description' => 'Défauts de peinture, fissures'],
            ['name' => 'Menuiserie', 'description' => 'Portes, fenêtres, placards'],
            ['name' => 'Carrelage', 'description' => 'Carrelage cassé ou mal posé'],
            ['name' => 'Autre', 'description' => 'Autres types de problèmes'],
        ];

        foreach ($categories as $cat) {
            \App\Models\Categor::firstOrCreate(
                ['name' => $cat['name']],
                ['description' => $cat['description']]
            );
        }

        // Créer des statuts
        $statuts = [
            'En attente',
            'En cours de traitement',
            'En cours de réparation',
            'Résolue',
            'Rejetée',
            'Annulée',
        ];

        foreach ($statuts as $statutName) {
            \App\Models\Statut::firstOrCreate(['name' => $statutName]);
        }

        $this->command->info('Données de test créées avec succès !');
        $this->command->info('');
        $this->command->info('Projets créés : ' . Projet::count());
        $this->command->info('Secteurs créés : ' . Secteur::count());
        $this->command->info('Immeubles créés : ' . Immeuble::count());
        $this->command->info('Appartements créés : ' . Appartement::count());
        $this->command->info('Catégories créées : ' . \App\Models\Categor::count());
        $this->command->info('Statuts créés : ' . \App\Models\Statut::count());
        $this->command->info('');
        $this->command->info('Compte admin : admin@test.com / password');
    }
}
