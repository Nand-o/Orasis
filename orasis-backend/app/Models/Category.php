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

    /**
     * Category Model
     *
     * Menyimpan daftar kategori yang digunakan oleh Showcase. Relasi satu-ke-banyak
     * ke Showcase.
     *
     * @package App\Models
     */

    // Relasi: Category memiliki banyak Showcases
    public function showcases()
    {
        return $this->hasMany(Showcase::class);
    }
}
