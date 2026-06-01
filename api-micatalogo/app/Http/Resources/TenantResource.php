<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TenantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'domain' => $this->domain,
            'whatsapp_number' => $this->whatsapp_number,
            'store_description' => $this->store_description,
            'store_logo' => $this->store_logo,
        ];
    }
}
