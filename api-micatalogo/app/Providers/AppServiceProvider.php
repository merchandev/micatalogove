<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token): string {
            $frontendUrl = rtrim(config('app.frontend_url'), '/');
            $email = urlencode($notifiable->getEmailForPasswordReset());

            return "{$frontendUrl}/reset-password?token={$token}&email={$email}";
        });

        // The SPA receives the signed path pieces and calls the API from the same origin.
        VerifyEmail::createUrlUsing(function (object $notifiable): string {
            $signed = URL::temporarySignedRoute('verification.verify', now()->addDay(), [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ], absolute: false);
            parse_str((string) parse_url($signed, PHP_URL_QUERY), $query);

            return rtrim(config('app.frontend_url'), '/').'/verify-email?'.http_build_query([
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ] + $query);
        });

        VerifyEmail::toMailUsing(fn (object $notifiable, string $url) => (new MailMessage)
            ->subject('Confirma tu correo en MiCatálogo')
            ->greeting('¡Hola!')
            ->line('Tu tienda ya está disponible. Confirma tu correo durante las primeras 24 horas desde el registro para mantenerla activa. Puedes gestionar la activación desde tu panel.')
            ->action('Confirmar correo', $url)
            ->line('El enlace vence en 24 horas. Si no creaste esta cuenta, ignora este mensaje.'));

        $this->configureRateLimiting();
    }

    private function configureRateLimiting(): void
    {
        $tooMany = fn (string $message) => fn (Request $request, array $headers) => response()->json(
            ['message' => $message, 'code' => 'too_many_requests'], 429, $headers
        );
        $wait = 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.';

        RateLimiter::for('login', fn (Request $request) => [
            Limit::perMinute(5)->by('login:'.Str::lower((string) $request->input('email')).'|'.$request->ip())
                ->response($tooMany('Demasiados intentos de inicio de sesión. Espera un minuto e inténtalo de nuevo.')),
            Limit::perMinute(30)->by('login-ip:'.$request->ip())->response($tooMany($wait)),
        ]);

        RateLimiter::for('register', fn (Request $request) => [
            Limit::perMinute(3)->by('register-minute:'.$request->ip())->response($tooMany($wait)),
            Limit::perHour(10)->by('register-hour:'.$request->ip())
                ->response($tooMany('Se crearon demasiadas cuentas desde esta conexión. Inténtalo más tarde.')),
        ]);

        RateLimiter::for('password', fn (Request $request) => Limit::perMinute(5)
            ->by('password:'.$request->ip())->response($tooMany($wait)));

        RateLimiter::for('verification', fn (Request $request) => Limit::perMinute(6)
            ->by('verification:'.$request->ip())->response($tooMany($wait)));

        RateLimiter::for('verification-notice', fn (Request $request) => Limit::perMinutes(10, 3)
            ->by('verification-notice:'.($request->user()?->id ?: $request->ip()))
            ->response($tooMany('Ya enviamos varios correos de confirmación. Revisa tu bandeja o inténtalo en unos minutos.')));

        RateLimiter::for('public', fn (Request $request) => Limit::perMinute(180)
            ->by('public:'.$request->ip())->response($tooMany($wait)));

        RateLimiter::for('carts', fn (Request $request) => Limit::perMinute(60)
            ->by('carts:'.$request->ip())->response($tooMany($wait)));

        RateLimiter::for('checkout', fn (Request $request) => Limit::perMinute(10)
            ->by('checkout:'.$request->ip())->response($tooMany('Recibimos demasiados pedidos desde esta conexión. Espera un minuto.')));

        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(300)
            ->by('api:'.($request->user()?->id ?: $request->ip()))->response($tooMany($wait)));
    }
}
