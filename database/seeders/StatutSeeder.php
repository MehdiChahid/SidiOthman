<?php

namespace Database\Seeders;

use App\Models\Statut;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatutSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuts=[
            ['name' => 'attente',],
            ['name' => 'validee',],
            ['name' => 'rejetee',],
            ['name' => 'affectee',],
            ['name' => 'en_cours',],
            ['name' => 'en_pause',],
            ['name' => 'corrigee',],
            ['name' => 'non_corrigee',],
            ['name' => 'cloturee',],
        ];

        Statut::insert($statuts);
    }
}
