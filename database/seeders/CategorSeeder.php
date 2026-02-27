<?php

namespace Database\Seeders;

use App\Models\Categor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            $catigories=[
                ['name' => 'Electricité','description' => 'Electricité', ],
                ['name' => 'Plomberie','description' => 'Plomberie', ],
                ['name' => 'gros_oeuvre','description' => 'gros_oeuvre', ],
                ['name' => 'Menuiserie','description' => 'Menuiserie', ],
                ['name' => 'Peinture','description' => 'Peinture', ],
                ['name' => 'carrelage','description' => 'carrelage', ],
                ['name' => 'etancheite','description' => 'etancheite', ],
                ['name' => 'platrerie','description' => 'platrerie', ],
            ];

            Categor ::insert($catigories);
    }
}
