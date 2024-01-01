
function all_posts() {
  
    
     fetch('f_posts')
  .then(response => response.json())
  .then(posts => {
  posts.forEach(element => {

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
)
    })  
      

  }

document.addEventListener('DOMContentLoaded', function() {
all_posts()
   
})
