<?php

namespace App\Http\Controllers;

use App\Http\Requests\IpAddressFormRequest;
use App\Http\Resources\IpAddressResource;
use App\Models\IpAddress;
use Illuminate\Http\Request;

class IpAddressController extends Controller
{
    public function index(Request $request)
    {
        return IpAddressResource::collection(
            IpAddress::filter($request->only(['ip_address', 'label']))
            ->paginate(10)
        );
    }

    public function store(IpAddressFormRequest $request)
    {
        $ipAddress = IpAddress::create([
            'ip_address' => $request->ip_address,
            'label' => $request->label,
            'comment' => $request->comment,
            'created_by' => $request->header('x-user-id')
        ]);

        return response()->json([
            'message' => 'IP Address successfully created',
            'data' => new IpAddressResource($ipAddress)
        ], 201);
    }

    public function update(Request $request, IpAddress $ipAddress)
    {
        $userId = $request->header('x-user-id');
        $role = $request->header('x-user-role');

        if ($role != 'admin' && $ipAddress->created_by != $userId) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $request->validate(['label' => 'required|string']);

        $data = [
            'label' => $request->label
        ];

        if ($request->comment) {
            $data['comment'] = $request->comment;
        }

        $ipAddress->update($data);

        return response()->json([
            'message' => 'IP Address successfully updated',
            'data' => new IpAddressResource($ipAddress)
        ]);
    }

    public function destroy(Request $request, IpAddress $ipAddress)
    {
        if ($request->header('x-user-role') !== 'admin') {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $ipAddress->delete();

        return response()->json(['message' => 'IP Adresses successfully deleted.']);
    }
}
