<?php

use App\Support\BlogHtmlSanitizer;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /** Posts saved before sanitization was enforced may contain scripts or event handlers. */
    public function up(): void
    {
        DB::table('posts')->orderBy('id')->select(['id', 'content'])->each(function ($post) {
            $clean = BlogHtmlSanitizer::clean($post->content);
            if ($clean !== $post->content) {
                DB::table('posts')->where('id', $post->id)->update(['content' => $clean]);
            }
        });

        DB::table('posts')->whereNotNull('featured_image')
            ->where('featured_image', 'not like', 'http://%')
            ->where('featured_image', 'not like', 'https://%')
            ->update(['featured_image' => null]);
    }

    public function down(): void
    {
        // Removed markup cannot be restored.
    }
};
