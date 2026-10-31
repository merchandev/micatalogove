<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tenant extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_SUSPENDED = 'suspended';

    public const RESERVED_DOMAINS = [
        'admin',
        'api',
        'assets',
        'aviso-legal',
        'blog',
        'boutique-demo',
        'contacto',
        'cookies',
        'demos',
        'favicon',
        'favicon-ico',
        'favicon-svg',
        'forgot-password',
        'funcionalidades',
        'login',
        'logout',
        'minimal-demo',
        'planes',
        'postres-demo',
        'public',
        'register',
        'reset-password',
        'restaurant-demo',
        'robots-txt',
        'storage',
        'tech-demo',
        'terminos',
        'tienda',
        'up',
        'verify-email',
    ];

    protected $fillable = [
        'user_id',
        'name',
        'domain',
        'whatsapp_number',
        'store_description',
        'store_logo',
        'theme',
        'status',
    ];

    protected function casts(): array
    {
        return ['trial_ends_at' => 'datetime', 'subscribed_until' => 'datetime'];
    }

    protected static function booted(): void
    {
        static::creating(function (Tenant $tenant) {
            $tenant->plan_code ??= config('plans.default');
            $tenant->trial_ends_at ??= now()->addDays(config('plans.trial_days'));
        });
    }

    public function hasSubscriptionAccess(): bool
    {
        return ($this->trial_ends_at?->isFuture() ?? false)
            || ($this->subscribed_until?->isFuture() ?? false);
    }

    public function subscriptionSummary(): array
    {
        $paid = $this->subscribed_until?->isFuture() ?? false;
        $trial = $this->trial_ends_at?->isFuture() ?? false;

        return [
            'status' => $paid ? 'active' : ($trial ? 'trial' : 'expired'),
            'has_access' => $this->hasSubscriptionAccess(),
            'trial_ends_at' => $this->trial_ends_at?->toIso8601String(),
            'subscribed_until' => $this->subscribed_until?->toIso8601String(),
            'trial_days_remaining' => $trial ? (int) ceil(now()->diffInDays($this->trial_ends_at)) : 0,
            'plan' => config('plans.plans.'.$this->plan_code),
        ];
    }

    public function subscriptionPayments()
    {
        return $this->hasMany(SubscriptionPayment::class);
    }

    public static function normalizeDomain(?string $domain, ?string $fallbackName = null): string
    {
        $source = trim((string) $domain) !== '' ? (string) $domain : (string) $fallbackName;

        return trim(Str::slug(Str::lower($source), '-'), '-');
    }

    public static function isReservedDomain(string $domain): bool
    {
        return in_array(self::normalizeDomain($domain), self::RESERVED_DOMAINS, true);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function conversations()
    {
        return $this->hasMany(Conversation::class);
    }

    public function abandonedCarts()
    {
        return $this->hasMany(AbandonedCart::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
