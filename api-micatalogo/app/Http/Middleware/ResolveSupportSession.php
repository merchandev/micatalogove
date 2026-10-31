<?php

namespace App\Http\Middleware;

use App\Models\SupportSession;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class ResolveSupportSession
{
    public function handle(Request $request, Closure $next): Response
    {
        $id = $request->header('X-Support-Session');
        if (! $id || $request->is('api/support/stop')) {
            return $next($request);
        }
        $actor = $request->user();
        $session = Str::isUuid($id) ? SupportSession::with(['client', 'tenant'])->find($id) : null;
        if (! $actor?->isSuperAdmin() || ! $session || $session->actor_id !== $actor->id
            || ! $session->token_id || $session->token_id !== $actor->currentAccessToken()?->id
            || $session->ended_at || ! $session->expires_at->isFuture()
            || ! $session->client?->isClient() || ! $session->client->isActive()
            || ! $session->tenant || $session->tenant->user_id !== $session->client_id) {
            return response()->json(['message' => 'La asistencia terminó o ya no está disponible.', 'code' => 'support_session_ended'], 409);
        }

        // Keep the original admin token; all controllers and role checks see only the selected client.
        $client = $session->client->setRelation('tenant', $session->tenant);
        $request->setUserResolver(fn ($guard = null) => $client);
        $request->attributes->set('support_session', $session);
        if ($request->is('api/account/*', 'api/logout', 'api/email/*', 'api/admin/subscription/payments')) {
            return response()->json(['message' => 'Finaliza la asistencia para gestionar contraseñas, sesiones o pagos desde el panel global.'], 403);
        }
        try {
            $response = $next($request);
            $this->audit($request, $session, $response->getStatusCode());

            return $response;
        } catch (\Throwable $exception) {
            $status = $exception instanceof ValidationException ? 422 : ($exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : 500);
            $this->audit($request, $session, $status);
            throw $exception;
        }
    }

    private function audit(Request $request, SupportSession $session, int $status): void
    {
        if (! $request->isMethodSafe()) {
            DB::table('support_actions')->insert([
                'support_session_id' => $session->id, 'method' => $request->method(),
                'path' => Str::limit($request->path(), 255, ''), 'status_code' => $status, 'performed_at' => now(),
            ]);
        }
    }
}
