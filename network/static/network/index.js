function all_posts() {
    var aut_user = ''
    fetch('/a_user')
    .then(response => response.json())
    .then(au_user => {
      
        aut_user = au_user.au_user
    })
    fetch('/d_posts')
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
    })
      })
    }
  
  document.addEventListener('DOMContentLoaded', function() {
    
      
  all_posts()
  document.querySelector('#post-form').onsubmit = new_post;
      
  })
  
  
  function new_post() {
      tx = document.querySelector('#post-body');
      fetch('/posts', {
          method: 'POST',
          body: JSON.stringify({
              text: tx.value
          })
        })
        .then(response => response.json())
        .then(result => {
          if (result.message) {
  
            document.querySelector('#success').style.display = 'block';
            document.querySelector('#success').innerHTML = result.message
            console.log(result.message);
            return false
          }
          else if (result.error) {
            document.querySelector('#warning').style.display = 'block';
            document.querySelector('#warning').innerHTML = result.error
            console.log(result.error);
            return false
          }
  
  
        });
       
  
        
        /*setTimeout(() => {
          return false
        }, 5000)
        */
  }