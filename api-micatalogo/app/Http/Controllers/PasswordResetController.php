<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;

class PasswordResetController extends Controller
{
    public function forgot(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ], [
            'email.required' => 'Indica tu correo electronico.',
            'email.email' => 'El correo electronico no es valido.',
        ]);

        $status = Password::sendResetLink($validated);

        if ($status === Password::RESET_THROTTLED) {
            return response()->json([
                'message' => 'Ya solicitaste un enlace recientemente. Intenta nuevamente en un minuto.',
            ], 429);
        }

        return response()->json([
            'message' => 'Si el correo existe en el sistema, recibiras un enlace para recuperar tu contrasena.',
        ]);
    }

    public function reset(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ], [
            'token.required' => 'El enlace de recuperacion no es valido.',
            'email.required' => 'Indica tu correo electronico.',
            'email.email' => 'El correo electronico no es valido.',
            'password.required' => 'Indica una nueva contrasena.',
            'password.confirmed' => 'La confirmacion no coincide con la contrasena.',
            'password.min' => 'La contrasena debe tener al menos 8 caracteres.',
        ]);

        $status = Password::reset(
            $validated,
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => $status === Password::INVALID_TOKEN
                    ? 'El enlace expiro o ya fue usado. Solicita uno nuevo.'
                    : 'No pudimos actualizar la contrasena con esos datos.',
            ], 422);
        }

        return response()->json([
            'message' => 'Contrasena actualizada correctamente. Ya puedes iniciar sesion.',
        ]);
    }
}
