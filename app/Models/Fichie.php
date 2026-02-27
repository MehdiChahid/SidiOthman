<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fichie extends Model
{
    /** @use HasFactory<\Database\Factories\FichieFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function fichierdetails()
    {
        return $this->hasMany(Fichierdetail::class);
    }

    public function reserves()
    {
        return $this->hasMany(Reserve::class);
    }

    public function suivis()
    {
        return $this->hasMany(Suivi::class);
    }
}
