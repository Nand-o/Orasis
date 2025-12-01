<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Showcase extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'url_website',
        'image_url',
        'logo_url',
        'category_id',
        'status',
        'views_count',
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Showcase punya banyak Tag (many-to-many)
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'showcase_tag');
    }

    // Showcase bisa dimasukkan ke banyak Collection (many-to-many)
    public function collections()
    {
        return $this->belongsToMany(Collection::class, 'collection_showcase');
    }
}
