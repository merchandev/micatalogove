<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Support\BlogHtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with('user')->orderBy('created_at', 'desc')->get();
        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $this->validatePost($request);

        $slug = Str::slug($request->title);
        // Ensure unique slug
        $count = Post::where('slug', 'LIKE', "{$slug}%")->count();
        if ($count > 0) {
            $slug = $slug . '-' . ($count + 1);
        }

        $post = Post::create([
            'title' => $request->title,
            'slug' => $slug,
            'excerpt' => $request->excerpt,
            'content' => $request->content,
            'featured_image' => $request->featured_image,
            'status' => $request->status ?? 'draft',
            'user_id' => $request->user()->id,
            'published_at' => $request->status === 'published' ? now() : null,
        ]);

        return response()->json($post, 201);
    }

    public function show($id)
    {
        $post = Post::findOrFail($id);
        return response()->json($post);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $this->validatePost($request);

        $data = $request->only(['title', 'excerpt', 'content', 'featured_image', 'status']);
        
        if ($request->title !== $post->title) {
            $slug = Str::slug($request->title);
            $count = Post::where('slug', 'LIKE', "{$slug}%")->where('id', '!=', $post->id)->count();
            if ($count > 0) {
                $slug = $slug . '-' . ($count + 1);
            }
            $data['slug'] = $slug;
        }

        if ($request->status === 'published' && $post->status !== 'published') {
            $data['published_at'] = now();
        }

        $post->update($data);

        return response()->json($post);
    }

    private function validatePost(Request $request): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:1000',
            'content' => 'required|string|max:'.BlogHtmlSanitizer::MAX_LENGTH,
            'featured_image' => 'nullable|url:http,https|max:2048',
            'status' => 'nullable|in:draft,published',
        ], [
            'featured_image.url' => 'La imagen destacada debe ser una URL http o https.',
            'content.max' => 'El contenido es demasiado largo.',
        ]);
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();
        return response()->json(['message' => 'Post deleted successfully']);
    }
}
