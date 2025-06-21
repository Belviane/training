<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Presence extends Model
{
     use HasFactory;

    protected $table = 'presences';


    protected $fillable = [
        'apprenant_id',
        'seance_id',
        'est_present',
        'justificatif',
        'remarque'  
    ];

    public function apprenant()
    {
        return $this->belongsTo(Apprenant::class);
    }

    public function seance()
    {
        return $this->belongsTo(Seance::class);
    }
}
