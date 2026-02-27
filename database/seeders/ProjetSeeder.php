<?php

namespace Database\Seeders;

use App\Models\Projet;
use Illuminate\Database\Seeder;

class ProjetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
       Projet::create([
            'user_id' => 1,
            'name' => 'DYAR SIDI OTHMAN',
            'description' => 'DYAR SIDI OTHMAN est un projet de construction POUR DOUAR BOUIH',
        ]);

    }
}
