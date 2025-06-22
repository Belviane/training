<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Classe extends Model
{
    use HasFactory;

    
    
    protected $table = 'classes';

    use HasFactory;

    protected $fillable = [
        'nom',
        'capacite',
        'localisation',
        'description',
        'formation_id'
    ];

    // Une classe appartient à une formation
    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    // Une classe a plusieurs séances
    public function seances()
    {
        return $this->hasMany(Seance::class);
    }
}
