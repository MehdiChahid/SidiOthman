<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statut extends Model
{
    /** @use HasFactory<\Database\Factories\StatutFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function suivis()
    {
        return $this->hasMany(Suivi::class);
    }

    public function fichierdetails()
    {
        return $this->hasMany(Fichierdetail::class);
    }
}
