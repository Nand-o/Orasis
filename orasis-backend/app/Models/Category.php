<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    // Category memiliki banyak Showcases
    public function showcases()
    {
        return $this->hasMany(Showcase::class);
    }
}
