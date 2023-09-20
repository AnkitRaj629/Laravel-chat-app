<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Chat;


class UserController extends Controller
{
    //
    public function loadDashboard(){
        $users = User::whereNotIn('id',[auth()->user()->id])->get();
        return view('dashboard',compact('users'));
    }

    public function saveChat(Request $request)
    {
        try{
           $chat = Chat::create([
                'sender_id' => $request->sender_id,
                'receiver_id' => $request->receiver_id,
                'message' => $request->message
            ]);

            return response()->json([ 'success' => true,'data' =>$chat]);

        }
        catch(\Exception $e){

            return response()->json([ 'success' => false, 'msg' => $e->getMessage()]);
        }
    }
}
