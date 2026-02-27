<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReserveExample extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'categor_id',
        'priority',
        'photo_path',
        'is_active',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function categor()
    {
        return $this->belongsTo(Categor::class);
    }
}
