// Funksjon for å forhåndsvise bilde
function imagePreview(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function(e){
            $('#imageView').attr('src', e.target.result);
            $('#imageButton').css('visibility', 'visible');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// Kaller på forhåndsvisning når endring av bilde skjer
$("#imageInput").change(function() {
    imagePreview(this);
});

// Kaller API'et for å laste opp og konvertere bilde. Returnerer URL til nytt bilde
$('#imageButton').click(function(e){
    e.preventDefault();
    var form = $('#uploadForm')[0];
    var image = new FormData(form);
    $.ajax({
        type: 'POST',
        enctype: "multipart/form-data",
        url: '/image/upload',
        data: image,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response){
            $('#imageView').attr('src', response);
            $('#imageButton').css('visibility', 'hidden');
        }
    });
}); 
