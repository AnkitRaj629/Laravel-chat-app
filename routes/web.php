<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', [UserController::class,'loadDashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::post('/save-chat',[UserController::class,'saveChat']);
Route::post('/load-chats',[UserController::class,'loadChats']);

Route::post('/delete-chat',[UserController::class,'deleteChat']);

//groups route
Route::get('/groups', [UserController::class,'loadGroup'])->middleware(['auth', 'verified'])->name('groups');
Route::post('/create-group', [UserController::class,'createGroup'])->middleware(['auth', 'verified'])->name('createGroup');
Route::post('/get-member', [UserController::class,'getMembers'])->middleware(['auth', 'verified'])->name('getMembers');
Route::post('/add-member', [UserController::class,'addMembers'])->middleware(['auth', 'verified'])->name('addMembers');
Route::post('/delete-group', [UserController::class,'deleteGroup'])->middleware(['auth', 'verified'])->name('deleteGroup');
Route::post('/update-group', [UserController::class,'updateGroup'])->middleware(['auth', 'verified'])->name('updateGroup');

Route::get('/groupChats', [UserController::class,'groupChats'])->middleware(['auth', 'verified'])->name('groupChats');

Route::post('/save-group-chat',[UserController::class,'saveGroupChat']);

Route::post('/load-group-chats',[UserController::class,'loadGroupChats']);










