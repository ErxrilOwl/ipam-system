<?php

namespace App\Http\Controllers;

use App\Http\Requests\IpAddressFormRequest;
use App\Http\Resources\IpAddressResource;
use App\Models\IpAddress;
use App\Services\AuditLogger;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IpAddressController extends Controller
{
    public function index(Request $request)
    {
        $params = $request->all();
        $sort = $params['sort'] ?? 'created_at';
        $order = $params['order'] ?? 'DESC';
        $limit = $params['limit'] ?? 10;

        return IpAddressResource::collection(
            IpAddress::filter($params)
            ->orderBy($sort, $order)
            ->paginate($limit));
    }

    public function get(IpAddress $ipAddress)
    {
        return response()->json(new IpAddressResource($ipAddress));
    }

    public function store(IpAddressFormRequest $request)
    {
        DB::beginTransaction();

        try {
            $ipAddress = IpAddress::create([
                'ip_address' => $request->ip_address,
                'label' => $request->label,
                'comment' => $request->comment,
                'created_by' => $request->header('x-user-id'),
                'user_name' => $request->header('x-user-name')
            ]);

            AuditLogger::log(
                $request,
                'CREATED_IP',
                'ip_address',
                $ipAddress->id,
                null,
                $ipAddress->toArray()
            );

            DB::commit();

            return response()->json([
                'message' => 'IP Address successfully created',
                'data' => new IpAddressResource($ipAddress)
            ], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Something went wrong.'], 500);
        }
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

        DB::beginTransaction();

        try {
            $before = $ipAddress->toArray();
            $ipAddress->update($data);

            AuditLogger::log(
                $request,
                'UPDATED_IP',
                'ip_address',
                $ipAddress->id,
                json_encode($before),
                json_encode($ipAddress->toArray())
            );

            DB::commit();

            return response()->json([
                'message' => 'IP Address successfully updated',
                'data' => new IpAddressResource($ipAddress)
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Something went wrong.'], 500);
        }
    }

    public function destroy(Request $request, $ipAddress)
    {
        DB::beginTransaction();

        try {
            $ipAddress = IpAddress::find($ipAddress);

            if (!$ipAddress) {
                return response()->json(['message' => 'IP address not found!'], 404);
            }

            if ($request->header('x-user-role') !== 'admin') {
                return response()->json(['error' => 'Forbidden'], 403);
            }

            $ipAddress->delete();

            AuditLogger::log(
                $request,
                'DELETED_IP',
                'ip_address',
                $ipAddress->id,
                $ipAddress->toArray(),
                null
            );

            DB::commit();

            return response()->json(['message' => 'IP Adresses successfully deleted.']);
        } catch (Exception $e) {
            return response()->json(['message' => 'Something went wrong.'], 500);
        }
    }
}
