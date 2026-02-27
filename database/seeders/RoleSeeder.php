<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles=[
            ['name' => 'super_admin'],
            ['name' => 'admin'],
            ['name' => 'manager'],
            ['name' => 'agent'],
            ['name' => 'client'],
            ['name' => 'syndic'],
        ];
        Role::insert($roles);
        
        $users=[
            ['name' => 'super_admin', 'email' => 'super_admin@gmail.com', 'password' => Hash::make('123456789'), 'role_id' => 1],
            ['name' => 'admin', 'email' => 'admin@gmail.com', 'password' => Hash::make('123456789'), 'role_id' => 2],
            ['name' => 'manager', 'email' => 'manager@gmail.com', 'password' => Hash::make('123456789'), 'role_id' => 3],
            ['name' => 'agent', 'email' => 'agent@gmail.com', 'password' => Hash::make('123456789'), 'role_id' => 4],
            ['name' => 'client', 'email' => 'client@gmail.com', 'password' => Hash::make('123456789'), 'role_id' => 5],
            ['name' => 'syndic', 'email' => 'syndic@gmail.com', 'password' => Hash::make('123456789'), 'role_id' => 6],

        ];
        User::insert($users);

        
    }
}
