<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['namespace' => 'Auth', 'middleware' => 'api', 'prefix' => 'password'], function () {
    Route::post('create', 'PasswordResetController@create');
    Route::get('find/{token}', 'PasswordResetController@find');
    Route::post('reset', 'PasswordResetController@reset');
});
Route::post('login', 'AuthController@login');
Route::post('signup', 'AuthController@register');
Route::group(['middleware' => 'auth:api'], function () {
    Route::resource('comment', 'CommentController')->only(['store','destroy']);
    Route::post('logout', 'AuthController@logout');
    Route::post('like', 'LikeController@store');
    Route::get('user/community', 'CommunityController@user');
    Route::apiResource('event','EventController');
    Route::resource('community','CommunityController');
    Route::post('community/user','CommunityUserController@store');
    Route::delete('community/user/{id}','CommunityUserController@destroy');
});

