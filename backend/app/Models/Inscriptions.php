<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inscriptions extends Model
{
    use HasFactory;

    protected $fillable = ['apprenant_id', 'formation_id', 'date_inscription'];

    public function apprenant()
    {
        return $this->belongsTo(Utilisateur::class, 'apprenant_id');
    }

    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }
}
