<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'status', 'approved_at', 'approved_by'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    protected $appends = ['email_activation'];

    public function emailVerificationDeadline()
    {
        return $this->created_at?->copy()->addHours(config('auth.email_verification_grace_hours', 24));
    }

    public function canPublishBeforeEmailVerification(): bool
    {
        return $this->hasVerifiedEmail() || ($this->emailVerificationDeadline()?->isFuture() ?? false);
    }

    public function getEmailActivationAttribute(): ?array
    {
        if (! $this->isClient()) {
            return null;
        }

        return [
            'verified' => $this->hasVerifiedEmail(),
            'deadline_at' => $this->emailVerificationDeadline()?->toIso8601String(),
            'grace_hours' => config('auth.email_verification_grace_hours', 24),
            'can_publish' => $this->canPublishBeforeEmailVerification(),
        ];
    }

    public const ROLE_SUPERADMIN = 'superadmin';

    public const ROLE_ADMIN = 'admin';

    public const ROLE_CLIENT = 'client';

    public const STATUS_PENDING = 'pending';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_SUSPENDED = 'suspended';

    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'approved_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        // Existing tokens must not survive a suspension, reactivation, role, email or password change.
        static::updated(function (User $user) {
            if ($user->wasChanged(['status', 'role', 'email', 'password'])) {
                $user->tokens()->delete();
            }
        });
        static::deleting(fn (User $user) => $user->tokens()->delete());
    }

    public function tenant()
    {
        return $this->hasOne(Tenant::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function approvedUsers()
    {
        return $this->hasMany(User::class, 'approved_by');
    }

    public function hasRole(string|array $roles): bool
    {
        return in_array($this->role, (array) $roles, true);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPERADMIN;
    }

    public function isPlatformAdmin(): bool
    {
        return $this->hasRole([self::ROLE_SUPERADMIN, self::ROLE_ADMIN]);
    }

    public function isClient(): bool
    {
        return $this->role === self::ROLE_CLIENT;
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }
}
