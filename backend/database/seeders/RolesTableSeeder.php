<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('roles')->insert([
            ['libelle' => 'admin',      'created_at' => now(), 'updated_at' => now()],
            ['libelle' => 'supervisor', 'created_at' => now(), 'updated_at' => now()],
            ['libelle' => 'trainer',    'created_at' => now(), 'updated_at' => now()],
            ['libelle' => 'learner',    'created_at' => now(), 'updated_at' => now()],
            ['libelle' => 'parent',     'created_at' => now(), 'updated_at' => now()],
            ['libelle' => 'cashier',    'created_at' => now(), 'updated_at' => now()],
            ['libelle' => 'auditor',    'created_at' => now(), 'updated_at' => now()],
        ]);
        
    }
}
