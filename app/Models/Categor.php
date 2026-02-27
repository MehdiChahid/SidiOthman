<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categor extends Model
{
    /** @use HasFactory<\Database\Factories\CategorFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function reserves()
    {
        return $this->hasMany(Reserve::class);
    }
}
