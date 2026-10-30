<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPayment;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class SubscriptionController extends Controller
{
    public function show(Request $request)
    {
        $tenant = $request->user()->tenant;
        abort_unless($tenant, 404, 'No hay una tienda asociada.');

        return response()->json([
            'subscription' => $tenant->subscriptionSummary(),
            'payments' => $tenant->subscriptionPayments()->latest()->limit(50)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $tenant = $request->user()->tenant;
        abort_unless($tenant, 404);
        $data = $request->validate([
            'reference' => ['required', 'string', 'max:150', Rule::unique('subscription_payments')->where('tenant_id', $tenant->id)],
            'notes' => 'nullable|string|max:1000',
        ]);

        $payment = DB::transaction(function () use ($tenant, $data) {
            $locked = Tenant::whereKey($tenant->id)->lockForUpdate()->firstOrFail();
            if ($locked->subscriptionPayments()->where('status', 'pending')->exists()) {
                throw ValidationException::withMessages(['reference' => 'Ya tienes un pago pendiente de revisión.']);
            }
            $plan = config('plans.plans.'.$locked->plan_code);

            return $locked->subscriptionPayments()->create([
                ...$data,
                'amount' => $plan['monthly_price'],
                'currency' => $plan['currency'],
                'plan_code' => $locked->plan_code,
                'status' => 'pending',
            ]);
        });

        return response()->json($payment, 201);
    }

    public function index()
    {
        return response()->json(SubscriptionPayment::with('tenant:id,name,domain')->latest()->limit(100)->get());
    }

    public function review(Request $request, SubscriptionPayment $payment)
    {
        $data = $request->validate(['status' => ['required', Rule::in(['approved', 'rejected'])]]);
        $result = DB::transaction(function () use ($request, $payment, $data) {
            $tenant = Tenant::whereKey($payment->tenant_id)->lockForUpdate()->firstOrFail();
            $locked = SubscriptionPayment::whereKey($payment->id)->lockForUpdate()->firstOrFail();
            if ($locked->status !== 'pending') {
                abort_unless($locked->status === $data['status'], 422, 'El pago ya fue revisado.');

                return $locked;
            }

            if ($data['status'] === 'approved') {
                $start = now();
                foreach ([$tenant->trial_ends_at, $tenant->subscribed_until] as $end) {
                    if ($end && $end->greaterThan($start)) {
                        $start = $end->copy();
                    }
                }
                $end = $start->copy()->addMonthNoOverflow();
                $tenant->subscribed_until = $end;
                $tenant->save();
                $locked->period_starts_at = $start;
                $locked->period_ends_at = $end;
            }
            $locked->status = $data['status'];
            $locked->reviewed_by = $request->user()->id;
            $locked->reviewed_at = now();
            $locked->save();

            return $locked;
        });

        return response()->json($result);
    }
}
