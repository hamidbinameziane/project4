globalThis.flw = window.location.href.split("/").pop()

function all_posts() {
  var aut_user = ''
  fetch(`/is_following/${flw}`)
  .then(response => response.json())
  .then(stat => {
    document.querySelector('#follow').innerHTML = stat.stat
    if (stat.stat == 'Following') {
      document.querySelector('#follow').style.display = 'none';
      document.querySelector('#following').style.display = 'block';
      
      document.querySelector('#following').addEventListener('mouseover', () => {
      document.querySelector('#following').setAttribute('class', 'btn btn-danger');
      document.querySelector('#following').innerHTML = 'Unfollow'

      });
      document.querySelector('#following').addEventListener('mouseout', () => {
        document.querySelector('#following').setAttribute('class', 'btn btn-secondary');
        document.querySelector('#following').innerHTML = stat.stat
      });
    }
    
    else{
        document.querySelector('#following').style.display = 'none';
      document.querySelector('#follow').style.display = 'block';
        document.querySelector('#follow').innerHTML = stat.stat

    }
    document.querySelector('#fg_c').innerHTML = stat.following_c 
    
    document.querySelector('#fr_c').innerHTML = stat.follower_c
  })
  
  fetch('/a_user')
  .then(response => response.json())
  .then(au_user => {
    
      aut_user = au_user.au_user
  })
  fetch('/d_posts')
  .then(response => response.json())
  .then(posts => {
  posts.forEach(element => {
    if (element.user == flw){

      const div = document.createElement('div');
    const a2 = document.createElement('a');
    const h4 = document.createElement('h4');
    const p = document.createElement('p');
    const p2 = document.createElement('p');
    const span = document.createElement('span');
    const span2 = document.createElement('span');
    a2.setAttribute('href', `/profile/${element.user}`);
    a2.style.color = "black"
    h4.innerHTML = element.user
    a2.append(h4)
    div.append(a2)
    if (aut_user == element.user) {

    const a = document.createElement('a');
    a.setAttribute('href', '');
    a.innerHTML = 'Edit'
    a.addEventListener('click', function() {
      console.log('i was clicked');
    })
    div.append(a)

    }
    p.setAttribute('class', 'form-control');
    p.innerHTML = element.post
    div.append(p)
     
    p2.setAttribute('class', 'text-muted');
    p2.innerHTML = element.timestamp
    div.append(p2)
    span.innerHTML = "&#10084;"
    div.append(span)
    span2.innerHTML = element.like
    span2.style.padding = "5px"
    div.append(span2)
    div.setAttribute('class', 'form-control');
    document.querySelector('#d_post').append(div)
    console.log(element);
  }
    }
)
    })
  }

function p_follow() {
  console.log(flw)
  fetch(`/p_follow`, {
    method: 'PUT',
    body: JSON.stringify({
      followed: flw
    })
  })
  setTimeout(() => {
    document.querySelector('#d_post').innerHTML = ""
    
    all_posts()
  }, 50)
  
}

document.addEventListener('DOMContentLoaded', function() {
all_posts()
document.querySelector('#following').addEventListener('click', () => p_follow());
document.querySelector('#follow').addEventListener('click', () => p_follow());


    
})
