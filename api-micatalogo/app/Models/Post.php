<?php

namespace App\Models;

use App\Support\BlogHtmlSanitizer;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'status',
        'published_at',
        'user_id'
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    /** Every write path stores allow-listed HTML only. */
    protected function content(): Attribute
    {
        return Attribute::make(set: fn (?string $value) => BlogHtmlSanitizer::clean($value));
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
