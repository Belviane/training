<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $table = 'roles';

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function apprenants(): HasMany
    {
        return $this->hasMany(Apprenant::class);
    }

    
}
