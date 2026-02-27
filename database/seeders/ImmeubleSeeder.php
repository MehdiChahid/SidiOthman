<?php

namespace Database\Seeders;

use App\Models\Appartement;
use App\Models\Immeuble;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImmeubleSeeder extends Seeder
{

    public function run(): void
    {


        for ($i = 1; $i <= 33; $i++) {
            $NomImmeuble = sprintf('%02d', $i);
            $Immeuble = Immeuble::create([
                'name' => 'I' . $NomImmeuble,
                'secteur_id' => 1,
            ]);

            for ($x = 1; $x <= 25; $x++) {
                $NomAppartement = sprintf('%02d', $x);
                // Il y a 5 appartements par étage, le reste c'est étage RDC
                $etage = ($x <= 5) ? 'RDC' : intval(ceil($x / 5)) - 1;
                Appartement::create([
                    'numero' => $NomAppartement,
                    'immeuble_id' => $Immeuble->id,
                    'etage' => $etage,
                ]);
            }
        }

    }
}
