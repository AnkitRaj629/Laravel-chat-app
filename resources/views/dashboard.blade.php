<x-app-layout>

    <div class="container mt-4">

        <div class="row">
            @if (count($users)>0)
                <div class="col-md-3">
                    <ul class="list-group">
                        @foreach ($users as $user)
                            <li class="list-group-item list-group-item-dark user-list" data-id="{{$user->id}}">
                                {{$user->name}}
                                <b><sup id="{{$user->id}}-status" class="offline-status">offline</sup></b>
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



  <!-- Modal -->
  <div class="modal fade" id="deleteChatModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Delete Chat</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form action="" id="delete-chat-form">

            <div class="modal-body">
                <input type="hidden" name="id" id="delete-chat-id">
                <p>Are you sure you want to delete message?</p>
                <p><b id="delete-message"></b></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-danger">Delete</button>
            </div>
        </form>
      </div>
    </div>
  </div>
  
  
  
</x-app-layout>
