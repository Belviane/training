<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
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
                'mdp' => '$2y$12$XaXZ68g510DRzQHCCQv.bOi0iBqnEQIprNpY6MZyNOFWEYVup6ZuK',
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
                'mdp' => '$2y$12$b/IPQFAnX/pVOvPkIVXRyOU0I9kCLmGwUwjmCqBJmh7i3OFc9UTQK',
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
                'mdp' => '$2y$12$psOlB1YmVRZuusDw1dIAFe4CPDs.66J7Ai6mvFh8Xoz5fTclQ3pUS',
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
                'mdp' => '$2y$12$dZr4zZur.YzqABTzdA0CR.bS6kAqrzje29XU8ooEOo1DMgvRmyseW',
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
                'mdp' => '$2y$12$Inc7pj/Px492T6N64KG.IO8DFwOkugtSdqeh4DH4WPpxfJU8nyNJa',
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
                'mdp' => '$2y$12$GH9UDVLofqo5xIcqZ6mrFub357v8HfgZWLXFn2qDG72bAeGl69qK2',
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
                'mdp' => '$2y$12$LQChW.vnlVPPeespSIgrcOC6Xa/ofb2UQ4.5HXdC8EWTZc253F1U6',
                'created_at' => now(),
                'updated_at' => now(),
                'is_active' => 1,
                'role_id' => 1,
            ],
        ]);
    }
}
