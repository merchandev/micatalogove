<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AccountPasswordController extends Controller
{
    public function __invoke(Request $request)
    {
        $data = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:12|max:128|confirmed|different:current_password',
        ]);
        if (! Hash::check($data['current_password'], $request->user()->password)) {
            throw ValidationException::withMessages(['current_password' => 'La contraseña actual no es correcta.']);
        }
        $request->user()->update(['password' => Hash::make($data['password'])]);
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Contraseña actualizada. Inicia sesión de nuevo.']);
    }
}
