<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Superviseur extends Model
{
    use HasFactory;

    protected $fillable = [
        'matriculeSU',
        'utilisateur_id',
        'date_derniere_action'
    ];
    protected $table = 'superviseurs';






    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}
