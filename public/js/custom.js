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
                    <div class="current-user-chat">
                    <h4>`+chat+`</h4>
                    </div>
                    `;
                    $('#chat-container').append(html);
                }
                else{
                    alert(res.msg);
                }

            }

        })
    });
});