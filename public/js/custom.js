
$.ajaxSetup({
    headers:{
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function(){
    $('.user-list').click(function(){

        $('#chat-container').empty(); // Clear the chat container


        var getUserId = $(this).attr('data-id')

        receiver_id = getUserId;

        $('.start-head').hide();
        $('.chat-section').show();

        loadOldChat();

    })
    //chat form work

    $('#chat-form').submit(function(e){
        e.preventDefault();

        var message = $('#message').val();
        $.ajax({
            url:"/save-chat",
            type:"POST",
            data: { 
                sender_id:sender_id, 
                receiver_id:receiver_id, 
                message:message 
            },
            success:function(res){

                if(res.success){

                    $('#message').val('');
                    let chat = res.data.message;
                    let html = `
                    <div class="current-user-chat" id='`+res.data.id+`-chat'>
                    <p>
                       <span>`+chat+`</span>
                       <i class="fa fa-trash" aria-hidden="true" data-id='`+res.data.id+`' data-bs-toggle="modal" data-bs-target="#deleteChatModal"></i>

                    </p>
                    </div>
                    `;
                    $('#chat-container').append(html);
                    scrollChat();

                }
                else{
                    alert(res.msg);
                }

            }

        })
    });
    $(document).on('click','.fa-trash',function(){
        var id=$(this).attr('data-id');
        $('#delete-chat-id').val(id);
        $('#delete-message').text($(this).parent().text());
    });

    $('#delete-chat-form').submit(function(e){
        e.preventDefault();

        var id=$('#delete-chat-id').val();
        
        $.ajax({
            url:"/delete-chat",
            type:"POST",
            data:{ id:id},
            success:function(res){
                alert(res.msg);
                if(res.success){
                    $('#'+id+'-chat').remove();
                    $('#deleteChatModal').modal('hide');
                }
            }
        });

    });

});

//loadOldChat

function loadOldChat(){
    $.ajax({
        url:"/load-chats",
        type:"POST",
        data:{ sender_id: sender_id,receiver_id: receiver_id},
        success:function(res){
            if(res.success){
                let chats=res.data;
              
                let html = '';
                for(let i=0;i < chats.length; i++){
                    let addclass = '';
                    if(chats[i].sender_id== sender_id){
                        addclass = 'current-user-chat';
                    }
                    else{
                        addclass = 'distance-user-chat';
    
                    }
                     html += `
                    <div class="`+addclass+`" id='`+chats[i].id+`-chat'>
                    <p><span>`+chats[i].message+`</span>`;
                    if(chats[i].sender_id== sender_id){
                        html +=`<i class="fa fa-trash" aria-hidden="true" data-id='`+chats[i].id+`' data-bs-toggle="modal" data-bs-target="#deleteChatModal"></i>`;
                    }
                    html +=`
                    </p>
                    </div>
                    `;
                }
                $('#chat-container').append(html);
                scrollChat();

            }
            else{
                alert(res.msg);
            }
        }
    })
}

//scroll div

function scrollChat(){
    $('#chat-container').animate({
        scrollTop: $('#chat-container').offset().top + $('#chat-container')[0].scrollHeight
    },0);
}

// Echo.join('status-update')
// .here((user)=>{
//     console.log(user);
// })
// .joining(()=>{

// })
// .leaving(()=>{

// })
// .listen('UserStatusEvent',(e)=>{
//     console.log(e);
// })

//save chat work
Echo.private('broadcast-message')
.listen('.getChatMessage',(data) => {
    
if(sender_id== data.chat.receiver_id && receiver_id == data.chat.sender_id)
{
    let html =`<div class="distance-user-chat" id='`+data.chat.id+`-chat'>
    <p>`+data.chat.message+`</p>
    </div>`;

    $('#chat-container').append(html);
    scrollChat();

}
});

//delete chat-message listen

Echo.private('message-deleted')
.listen('MessageDeletedEvent' ,(data)=>{
 $('#'+data.id+'-chat').remove();
});
