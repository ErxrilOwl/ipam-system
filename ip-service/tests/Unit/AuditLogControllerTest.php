<?php

namespace Tests\Unit;

use App\Http\Controllers\AuditLogController;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Tests\TestCase;

class AuditLogControllerTest extends TestCase
{
    /**
     * Test getting all audit logs
     */
    public function test_get_all_audit_logs(): void
    {
        $auditLog = new AuditLog([
            'id' => 1,
            'action' => 'test_action',
            'resource_type' => 'User'
        ]);

        $controller = new AuditLogController();
        $response = $controller->get($auditLog);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('test_action', $response->getData(true)['action']);
    }

    /**
     * Test storign audit logs
     */
    public function test_store_audit_log(): void
    {
        $mock = \Mockery::mock('alias:App\Services\AuditLogger');
        $mock->shouldReceive('log')->andReturn(new AuditLog(['action' => 'created']));

        $request = Request::create('/api/audit-logs', 'POST', [
            'action' => 'created',
            'resource_type' => 'User',
            'resource_id' => 1
        ]);

        $controller = new AuditLogController();
        $response = $controller->store($request);
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertArrayHasKey('message', $response->getData(true));

        \Mockery::close();
    }
}
