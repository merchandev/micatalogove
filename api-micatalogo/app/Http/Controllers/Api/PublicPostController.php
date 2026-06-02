<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PublicPostController extends Controller
{
    public function index()
    {
        // Only return published posts
        $posts = Post::with('user:id,name')
            ->where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->get();
            
        return response()->json($posts);
    }

    public function show($slug)
    {
        $post = Post::with('user:id,name')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();
            
        return response()->json($post);
    }
}
