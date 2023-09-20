<x-app-layout>

    <div class="container mt-4">

        <div class="row">
            @if (count($users)>0)
                <div class="col-md-3">
                    <ul class="list-group">
                        @foreach ($users as $user)
                            <li class="list-group-item list-group-item-dark user-list" data-id="{{$user->id}}">
                                {{$user->name}}
                            </li>
                        @endforeach
                    </ul>
                </div>
                <div class="col-md-9">
                    <h4 class="start-head">Click to start the chat</h4>

                    <div class="chat-section">

                        <div id="chat-container">
                            
                            {{-- <div class="distance-user-chat">
                                <h4>Hello from ankit</h4>
                            </div> --}}
                        </div>

                                <form action="" id="chat-form">
                                    <input type="text" name="message" placeholder="Enter Message" id="message" class="border" required>
                                    <input type="submit" value="Send Message" class="btn btn-primary">
                                </form>
                            </div>
                        </div>
                            
            @else

            <div class="col-md-12">
                <h6>User not Found!</h6>
            </div>
                
            @endif
        </div>

    </div>

</x-app-layout>
