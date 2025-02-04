<?php

namespace App\Http\Controllers;

use App\Http\Controllers\ResponseController;
use App\Models\User;
use App\Models\VerifyUser;
use App\Notifications\VerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;


class AuthController extends ResponseController
{
    public function authenticated(Request $req) {
        $logged_in = Auth::check();

        if ($logged_in) {
            return $this->sendResponse(['authenticated' => true], 'dashboard.response.user.authenticated.success');
        } else {
            return $this->sendError('dashboard.errors.unauthorized', ['error' => 'dashboard.errors.unauthenticated'], 401);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => 'fix errors', 'errors' => $validator->errors()], 422);
        }

        $remember_me = $request->has('remember') ? true : false;

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password], $remember_me)) {
            // $user = auth()->user();
            $user = User::where('email', $request->email)->first(); // prevent editor error "createToken"

            if (!$user->email_verified_at) {
                return $this->sendError('dashboard.errors.unauthorized', ['error' => 'dashboard.errors.validate_email'], 401);
            }

            if (!$user->authorized) {
                return $this->sendError('dashboard.errors.unauthorized', ['error' => 'dashboard.errors.admin_validation'], 401);
            }

            $name = $user->firstname . (($user->lastname) ? " " . $user->lastname : "");

            $success['token'] = $user->createToken('UserLoginToken')->plainTextToken;
            $success['name'] = $name;
            $success['email'] = $user->email;
            $success['is_admin'] = $user->is_admin;
            $success['authorized'] = $user->authorized;
            $success['verified'] = $user->email_verified_at ? true : false;

            return $this->sendResponse($success, 'dashboard.response.user.login.success');

        } else {
            return $this->sendError('dashboard.errors.unauthorized', ['error' => 'dashboard.response.user.login.error'], 401);
        }
    }

    public function logout(Request $request)
    {
        // token base api for third party
        $user = (auth()->user()) ? auth()->user() : $request->user();
        if ($user) $user->tokens()->delete();

        // web csrf
        auth('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['status' => true, 'message' => 'dashboard.response.user.logout.success']);
    }

    public function me()
    {
        $user = auth()->user();

        return response()->json([
            'status' => true,
            'user' => $user,
            'message' => 'dashboard.response.user.retrieve.success'
        ]);
    }

    /**
     * Register api
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->sendError('dashboard.errors.validation', $validator->errors(), 422);
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);

        $user = User::create($input);
        $token = Str::random(64);
        $name = $user->firstname . (($user->lastname) ? " " . $user->lastname : "");

        if ($user && $token) {
            VerifyUser::create([
                'user_id' => $user->id,
                'token' => $token
            ]);

            $user->notify(new VerifyEmail($token, $name));
        }

        $name = $user->firstname . (($user->lastname) ? " " . $user->lastname : "");
        // $success['token'] = $user->createToken('UserLoginToken')->plainTextToken;
        $success['name'] = $name;
        $success['email'] = $user->email;
        $success['is_admin'] = $user->is_admin;

        return $this->sendResponse($success, 'dashboard.response.user.register.success');
    }

    /**
     * Write code on Method
     *
     * @return \Illuminate\Http\Response
     */
    public function verifyAccount(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('dashboard.errors.validation', $validator->errors(), 422);
        }

        $verifyUser = VerifyUser::where('token', $request->get('token'))->first();

        $message = 'dashboard.response.user.verify.error';

        if (!is_null($verifyUser)) {
            $user = $verifyUser->user;

            if (!$user->email_verified_at) {
                $verifyUser->user->email_verified_at = time();
                $verifyUser->user->save();
                $message = "dashboard.response.user.verify.success";
            } else {
                $message = "dashboard.response.user.verify.already_verified";
            }
        }

        return $this->sendResponse(["success" => true], $message);
    }
}
