<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RoleSeeder::class,
            StatutSeeder::class,
            CategorSeeder::class,
            
            ProjetSeeder::class,
            SecteurSeeder::class,
            ImmeubleSeeder::class,
            AppartementSeeder::class,
            ReserveExampleSeeder::class,
        ]);

   }
}
