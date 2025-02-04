<?php
namespace App\Http\Controllers;
use App\Http\Controllers\ResponseController;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Notifications\PasswordResetRequest;
use App\Notifications\PasswordResetSuccess;
use App\Models\User;
use App\Models\PasswordReset;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;


class ResetPasswordController extends ResponseController
{
    /**
     * Create token password reset
     *
     * @param string email
     * @return string message
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
        ]);

        if ($validator->fails()) {
            return $this->sendError('dashboard.errors.validation', $validator->errors(), 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return $this->sendError('dashboard.errors.not_found', 'dashboard.errors.user_not_found', 404);
        }

        $passwordReset = PasswordReset::firstOrNew(['email' => $user->email]);
        $passwordReset->token = Str::random(60);
        $passwordReset->created_at = now();
        $passwordReset->save();

        if ($user && $passwordReset) {
            $user->notify(new PasswordResetRequest($passwordReset->token, $user->firstname));
        }

        return $this->sendResponse([], 'dashboard.response.user.password.forgot.success');
    }

    /**
     * Reset password
     *
     * @param string email
     * @param string password
     * @param string password_confirmation
     * @param string token
     * @return string message
     * @return json user object
     */
    public function resetPassword(Request $request, string $token)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->sendError('dashboard.errors.validation', $validator->errors(), 422);
        }

        $passwordReset = PasswordReset::where([['token', $token], ['email', $request->email]])->first();

        if (!$passwordReset)
            return $this->sendError('dashboard.errors.not_found', 'dashboard.errors.token_not_found', 404);

        $user = User::where('email', $passwordReset->email)->first();

        if (!$user)
            return $this->sendError('dashboard.errors.not_found', 'dashboard.errors.user_not_found', 404);

        $user->password = bcrypt($request->password);
        $user->save();

        $passwordReset->delete();

        $user->notify(new PasswordResetSuccess($passwordReset, $user->firstname));

        return $this->sendResponse($user, 'dashboard.response.user.password.modify.success');
    }
}
