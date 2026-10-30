<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ScopesTenantAccess;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ConversationController extends Controller
{
    use ScopesTenantAccess;

    public function index(Request $request)
    {
        $query = Conversation::with(['tenant:id,name,domain', 'messages' => fn ($messages) => $messages->latest()->limit(1)]);
        $query = $this->applyTenantScope($query, $request->user());

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return response()->json($query->latest('last_contact_at')->latest()->get());
    }

    public function show(Request $request, Conversation $conversation)
    {
        $this->applyTenantScope(Conversation::whereKey($conversation->id), $request->user())->firstOrFail();

        return response()->json($conversation->load(['tenant:id,name,domain', 'messages.user:id,name']));
    }

    public function update(Request $request, Conversation $conversation)
    {
        $this->applyTenantScope(Conversation::whereKey($conversation->id), $request->user())->firstOrFail();

        $validated = $request->validate([
            'status' => ['required', Rule::in(['new', 'in_progress', 'resolved', 'archived'])],
        ]);

        $conversation->update($validated);

        return response()->json($conversation->fresh(['tenant:id,name,domain', 'messages']));
    }

    public function storeMessage(Request $request, Conversation $conversation)
    {
        $this->applyTenantScope(Conversation::whereKey($conversation->id), $request->user())->firstOrFail();

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $message = $conversation->messages()->create([
            'user_id' => $request->user()->id,
            'direction' => 'outbound',
            'sender_name' => $request->user()->name,
            'message' => $validated['message'],
        ]);

        $conversation->update([
            'status' => 'in_progress',
            'last_contact_at' => now(),
        ]);

        return response()->json($message, 201);
    }
}
