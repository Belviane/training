<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UtilisateursTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('utilisateurs')->insert([
            [
                'nom' => 'Auditeur',
                'prenom' => 'Emilie',
                'genre' => 'Féminin',
                'date_naissance' => '1988-11-15',
                'login' => 'auditeur@gmail.com',
                'mdp' => Hash::make('auditeur123'),
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => 1,
                'role_id' => 7,
            ],
            [
                'nom' => 'Caissier',
                'prenom' => 'David',
                'genre' => 'Masculin',
                'date_naissance' => '1982-08-05',
                'login' => 'caissier@gmail.com',
                'mdp' => Hash::make('caissier123'),
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => 1,
                'role_id' => 6,
            ],
            [
                'nom' => 'Parent',
                'prenom' => 'Sophie',
                'genre' => 'Féminin',
                'date_naissance' => '1970-02-25',
                'login' => 'parent@gmail.com',
                'mdp' => Hash::make('parent123'),
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => 1,
                'role_id' => 5,
            ],
            [
                'nom' => 'Apprenant',
                'prenom' => 'Marie',
                'genre' => 'Féminin',
                'date_naissance' => '1995-09-10',
                'login' => 'apprenant@gmail.com',
                'mdp' => Hash::make('apprenant123'),
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => 1,
                'role_id' => 4,
            ],
            [
                'nom' => 'Formateur',
                'prenom' => 'Pierre',
                'genre' => 'Masculin',
                'date_naissance' => '1980-03-20',
                'login' => 'formateur@gmail.com',
                'mdp' => Hash::make('formateur123'),
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => 1,
                'role_id' => 3,
            ],
            [
                'nom' => 'Superviseur',
                'prenom' => 'Jean',
                'genre' => 'Masculin',
                'date_naissance' => '1985-06-15',
                'login' => 'superviseur@gmail.com',
                'mdp' => Hash::make('superviseur123'),
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => 1,
                'role_id' => 2,
            ],
            [
                'nom' => 'Admin',
                'prenom' => 'Super',
                'genre' => 'Masculin',
                'date_naissance' => '1990-01-01',
                'login' => 'admin@gmail.com',
                'mdp' => Hash::make('admin123'),
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => 1,
                'role_id' => 1,
            ],
        ]);
    }
}
