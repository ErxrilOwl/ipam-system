<?php

namespace Tests\Unit;

use App\Http\Controllers\AuthController;
use App\Http\Resources\UserResource;
use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Mockery;
use PHPUnit\Framework\TestCase;

class AuthControllerTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_login_returns_400_when_validation_fails(): void
    {
        Validator::shouldReceive('make')
            ->once()
            ->andReturn(
                Mockery::mock()
                    ->shouldReceive('fails')->andReturn(true)
                    ->getMock()
            );

        $controller = new AuthController();
        $request = Request::create('/login', 'POST', []);

        $response = $controller->login($request);

        $this->assertEquals(400, $response->status());
        $this->assertSame(
            'Missing required fields',
            $response->getData(true)['message']
        );
    }

    public function test_login_returns_401_for_invalid_credentials(): void
    {
        $validator = Mockery::mock();
        $validator->shouldReceive('fails')->andReturn(false);
        $validator->shouldReceive('validated')->andReturn([
            'email' => 'test@example.com',
            'password' => 'wrong',
        ]);

        Validator::shouldReceive('make')->once()->andReturn($validator);

        Auth::shouldReceive('claims')->once()->andReturnSelf();
        Auth::shouldReceive('attempt')->once()->andReturn(false);

        $controller = new AuthController();
        $request = Request::create('/login', 'POST');

        $response = $controller->login($request);

        $this->assertEquals(401, $response->status());
        $this->assertSame(
            'Invalid credentials',
            $response->getData(true)['message']
        );
    }

    public function test_login_returns_tokens_on_success(): void
    {
        $user = Mockery::mock(User::class);
        $user->id = 1;

        $validator = Mockery::mock();
        $validator->shouldReceive('fails')->andReturn(false);
        $validator->shouldReceive('validated')->andReturn([
            'email' => 'test@example.com',
            'password' => 'secret',
        ]);

        Validator::shouldReceive('make')->once()->andReturn($validator);

        Auth::shouldReceive('claims')->once()->andReturnSelf();
        Auth::shouldReceive('attempt')->once()->andReturn('jwt-token');
        Auth::shouldReceive('user')->once()->andReturn($user);
        Auth::shouldReceive('factory->getTTL')->once()->andReturn(60);

        Mockery::mock('alias:' . RefreshToken::class)
            ->shouldReceive('create')
            ->once()
            ->with(Mockery::subset(['user_id' => 1]));

        $controller = new AuthController();
        $request = Request::create('/login', 'POST');

        $response = $controller->login($request);
        $json = $response->getData(true);

        $this->assertEquals(200, $response->status());
        $this->assertArrayHasKey('access_token', $json);
        $this->assertArrayHasKey('refresh_token', $json);
        $this->assertArrayHasKey('session_id', $json);
        $this->assertSame('bearer', $json['auth_type']);
    }

    public function test_refresh_returns_401_for_invalid_token(): void
    {
        Mockery::mock('alias:' . RefreshToken::class)
            ->shouldReceive('where->where->first')
            ->once()
            ->andReturn(null);

        $controller = new AuthController();
        $request = Request::create('/refresh', 'POST', [
            'refresh_token' => 'invalid',
        ]);

        $response = $controller->refresh($request);

        $this->assertEquals(401, $response->status());
        $this->assertSame(
            'Invalid refresh token',
            $response->getData(true)['error']
        );
    }

    public function test_refresh_returns_new_access_token(): void
    {
        $user = Mockery::mock(User::class);

        Mockery::mock('alias:' . RefreshToken::class)
            ->shouldReceive('where->where->first')
            ->once()
            ->andReturn(Mockery::mock());

        Auth::shouldReceive('refresh')->once()->andReturn('new-jwt');
        Auth::shouldReceive('user')->once()->andReturn($user);
        Auth::shouldReceive('factory->getTTL')->once()->andReturn(60);

        $controller = new AuthController();
        $request = Request::create('/refresh', 'POST', [
            'refresh_token' => 'valid',
        ]);

        $response = $controller->refresh($request);

        $this->assertEquals(200, $response->status());
        $this->assertArrayHasKey(
            'access_token',
            $response->getData(true)
        );
    }

    public function test_logout_deletes_refresh_tokens_and_logs_out(): void
    {
        $user = Mockery::mock(User::class);
        $user->id = 1;

        Auth::shouldReceive('user')->once()->andReturn($user);
        Auth::shouldReceive('logout')->once();

        Mockery::mock('alias:' . RefreshToken::class)
            ->shouldReceive('where->delete')
            ->once();

        $controller = new AuthController();
        $request = Request::create('/logout', 'POST');

        $response = $controller->logout($request);

        $this->assertEquals(200, $response->status());
        $this->assertSame(
            'Successfully logged out!',
            $response->getData(true)['message']
        );
    }

    public function test_me_returns_user_resource(): void
    {
        $user = Mockery::mock(User::class);

        Auth::shouldReceive('user')->once()->andReturn($user);

        $controller = new AuthController();
        $response = $controller->me();

        $this->assertInstanceOf(
            UserResource::class,
            $response->getData()
        );
    }
}
