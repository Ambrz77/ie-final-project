<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Route;
use Morilog\Jalali\Jalalian;

//Auth::routes();

//Route::get('/home', 'HomeController@index')->name('home');


Route::view('/{path?}', 'index');
Route::view('/password/email', 'index');
Route::view('/password/reset/{token}', 'index');
Route::view('/community/{path?}/{title?}', 'index');
Route::view('/event/{path?}', 'index');
Route::view('/comment/create/{path?}', 'index');
Route::view('/editEvent/{event}', 'index');
Route::view('/editCommunity/{community}', 'index');
//Route::view('/event/{event}/edit', 'index');
