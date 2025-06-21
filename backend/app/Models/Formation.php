<?php


namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Inscription;

class Formation extends Model
{
   use HasFactory;

    protected $table = 'formations';
    protected $fillable = [
        'nom_formation',
        'libelle_formation',
        'date_debutf',
        'date_finf',
        'nombre_seancef',
    ];

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function apprenants() {
        return $this->belongsToMany(Apprenant::class, 'inscriptions')
               ->withPivot(['formateur_id', 'date_inscription', 'statut'])
               ->withTimestamps();
    }
}
