<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BlogSanitizationTest extends TestCase
{
    use RefreshDatabase;

    private const PAYLOAD = '<script>alert(1)</script><p onclick="steal()" style="position:fixed" class="fixed inset-0">Hola '
        .'<a href="javascript:alert(1)">x</a> <a href="https://example.test" target="_blank">ok</a>'
        .'<img src="https://img.test/a.png" onerror="alert(1)" alt="a"><img src="data:image/svg+xml;base64,PHN2Zz4=">'
        .'</p><iframe src="https://evil.test"></iframe><svg onload="alert(1)"><p>s</p></svg><style>body{display:none}</style>'
        .'<h2>Titulo</h2><ul><li>uno</li></ul>';

    public function test_admin_created_and_updated_posts_store_only_allow_listed_html(): void
    {
        Sanctum::actingAs($this->admin());

        $id = $this->postJson('/api/admin/posts', [
            'title' => 'Seguridad', 'content' => self::PAYLOAD, 'status' => 'published',
        ])->assertCreated()->json('id');
        $this->assertSafe(Post::findOrFail($id)->content);

        $this->putJson("/api/admin/posts/{$id}", [
            'title' => 'Seguridad', 'content' => '<p>Editado<img src=x onerror=alert(2)></p><script>alert(3)</script>',
        ])->assertOk();
        $content = Post::findOrFail($id)->content;
        $this->assertStringNotContainsString('onerror', $content);
        $this->assertStringNotContainsString('<script', $content);
        $this->assertStringContainsString('<p>Editado', $content);
    }

    public function test_public_post_returns_sanitized_html_even_for_direct_model_writes(): void
    {
        $post = Post::create([
            'title' => 'Directo', 'slug' => 'directo', 'content' => self::PAYLOAD,
            'status' => 'published', 'published_at' => now(), 'user_id' => $this->admin()->id,
        ]);

        $this->assertSafe($this->getJson("/api/posts/{$post->slug}")->assertOk()->json('content'));
    }

    public function test_featured_image_must_be_http_or_https_and_content_has_a_length_limit(): void
    {
        Sanctum::actingAs($this->admin());

        foreach (['javascript:alert(1)', 'data:image/png;base64,AAA', 'notaurl'] as $image) {
            $this->postJson('/api/admin/posts', ['title' => 'T', 'content' => '<p>x</p>', 'featured_image' => $image])
                ->assertUnprocessable()->assertJsonValidationErrors('featured_image');
        }
        $this->postJson('/api/admin/posts', ['title' => 'T', 'content' => str_repeat('a', 200001)])
            ->assertUnprocessable()->assertJsonValidationErrors('content');
        $this->assertDatabaseCount('posts', 0);
    }

    public function test_clients_cannot_write_blog_posts(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_CLIENT, 'status' => User::STATUS_ACTIVE]));
        $this->postJson('/api/admin/posts', ['title' => 'T', 'content' => '<p>x</p>'])->assertForbidden();
    }

    private function assertSafe(string $content): void
    {
        foreach (['<script', 'alert(1)', 'onclick', 'onerror', 'onload', 'javascript:', 'iframe', '<svg', 'style', 'class=', 'data:', 'display:none'] as $unsafe) {
            $this->assertStringNotContainsStringIgnoringCase($unsafe, $content);
        }
        foreach (['<p>Hola', 'href="https://example.test"', 'rel="noopener noreferrer"', 'src="https://img.test/a.png"', '<h2>Titulo</h2>', '<ul><li>uno</li></ul>'] as $kept) {
            $this->assertStringContainsString($kept, $content);
        }
    }

    private function admin(): User
    {
        return User::factory()->create(['role' => User::ROLE_ADMIN, 'status' => User::STATUS_ACTIVE]);
    }
}
