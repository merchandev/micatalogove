<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportSession;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;

class SupportController extends Controller
{
    public function start(Request $request, Tenant $tenant)
    {
        $actor = $request->user();
        $token = $actor->currentAccessToken();
        abort_unless($actor->isSuperAdmin() && $token instanceof PersonalAccessToken, 403);
        $owner = $tenant->user;
        abort_unless($owner?->isClient(), 422, 'La tienda no tiene un cliente asociado.');
        abort_unless($owner->isActive(), 422, 'Reactiva al cliente desde el panel global antes de iniciar la asistencia.');
        $session = SupportSession::create([
            'actor_id' => $actor->id, 'client_id' => $owner->id,
            'tenant_id' => $tenant->id, 'token_id' => $token->id,
            'expires_at' => now()->addMinutes(30),
        ]);
        Log::info('support.started', ['session_id' => $session->id, 'actor_id' => $actor->id, 'tenant_id' => $tenant->id]);

        return response()->json(['support_session' => $session->context()], 201);
    }

    public function stop(Request $request)
    {
        abort_unless($request->user()->isSuperAdmin(), 403);
        $data = $request->validate(['session_id' => 'required|uuid']);
        $session = SupportSession::findOrFail($data['session_id']);
        abort_unless($session->actor_id === $request->user()->id && $session->token_id === $request->user()->currentAccessToken()?->id, 403);
        if (! $session->ended_at) {
            $session->update(['ended_at' => now()]);
            Log::info('support.ended', ['session_id' => $session->id, 'actor_id' => $session->actor_id, 'tenant_id' => $session->tenant_id]);
        }

        return response()->json(['message' => 'Asistencia finalizada.']);
    }
}
