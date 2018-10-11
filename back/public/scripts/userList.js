$.ajax({
    method: "GET",
    url: '/api/users',
    success: appendUsers

})

//this function appends a list of clickable links that have the name of all the usernames in the database
function appendUsers(e) {
    console.log(e)
    e.forEach (function(user) {
        $('.userList').append(`<a class="user" href="#" data-id="${user.userName}">${user.userName}</a>`)
    })
}


//when a certain username is clicked this function runs which loads all that users favorites to the page
$('.userList').on('click', '.user', function(user) {
    $('.userList').empty();
    let userId = $(this).attr('data-id')
    $.ajax({
        method: 'GET',
        url: `/favlist/${userId}`,
        success: function onSuccess(res) {
            res.forEach(function(show){
                let media = show._flix;
                console.log('TITLE IS',media.name)
                console.log('picture path', media.poster_path);
                console.log('backdrop is', media.backdrop_path)
                $('body').css('background-color',  '#e0e3e7')
                    $('.userList').append(`
                        <section class="listing" style='background-image:url("https://image.tmdb.org/t/p/original${media.backdrop_path}")'>
                        <article class="movieCover">
            
                        <img class="image" src = "https://image.tmdb.org/t/p/w300/${media.poster_path}">
                    
                        </article>
                        <article class="movieInfo" '>
                    
                        <h2 class="title"> ${media.name}</h2>
                        

                        <article class="symbols">
                        <a href="#" data-id=${media.id} class=like><i class="far fa-heart"></i></a>
                        <a href="#" class="info" data-id=${media.id}><i class="fas fa-info-circle"></i></a>
                        </article>
                        

                
                        <h3 class="description">Description:</h3><p class="paragraph">\n ${media.overview}</p>
                        <h3 class="genre">Genre:</h3>\n<p class="paragraph"></p>
                        

                        </article>
                        </section>`)

            })
        },
        error: function onError(err){
            console.log(err);
        }
    })
})







