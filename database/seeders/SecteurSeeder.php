<?php

namespace Database\Seeders;

use App\Models\Secteur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SecteurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $secteurs=[
            [
                'name' => 'GH8B',
                'description' => 'GH8B est un secteur de construction pour DOUAR BOUIH',
                'projet_id' => 1,
            ],
            [
                'name' => 'Nassim 2B-1',
                'description' => 'Nassim 2B-1 est un secteur de construction pour DOUAR BOUIH',
                'projet_id' => 1,
            ],
        ];

        Secteur::insert($secteurs);
    }
}
