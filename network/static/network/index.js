function pagination() {
  
  fetch('/d_posts?q=count')
  .then(response => response.json())
  .then(count => {
     //console.log(count.count)
     if (count.count <= 10) {
      q = '/d_posts?q=all'
      all_posts(q)
     }
     else {
      all_posts('/d_posts?q=1')
      const a_f = document.createElement('a');
      const a_l = document.createElement('a');
      var last_p = 1
        var p_count = 0
      var r = count.count % 10;
      if (r == 0) {p_count = count.count / 10;}
      else {p_count = 1 + ((count.count - r)/ 10);}
      document.querySelector('#pg').innerHTML = `Current page: ${last_p} / ${p_count}`
      document.querySelector('#prev').className = 'page-item disabled'
      document.querySelector('#next').className = 'page-item'
      a_f.className = 'page-link'
      a_f.innerHTML = 'Previous'
      a_f.addEventListener('click', function() {
          

          last_p--
          document.querySelector('#pg').innerHTML = `Current page: ${last_p} / ${p_count}`
         document.querySelector('#d_post').innerHTML = ""
         q = `/d_posts?q=${last_p}`

         if (last_p != 1) {
          document.querySelector('#prev').className = 'page-item' 
              }
          else {
            document.querySelector('#prev').className = 'page-item disabled'
          }
          if (last_p == p_count) {
            document.querySelector('#next').className = 'page-item disabled' 
      }
  else {
    document.querySelector('#next').className = 'page-item'
  }
          all_posts(q)
      })  
      document.querySelector('#prev').append(a_f)


      

    
      a_l.className = 'page-link'
      a_l.innerHTML = 'Next'
      a_l.addEventListener('click', function() {
          

          last_p++
          document.querySelector('#pg').innerHTML = `Current page: ${last_p} / ${p_count}`
         
         document.querySelector('#d_post').innerHTML = ""
         q = `/d_posts?q=${last_p}`

         if (last_p != 1) {
          document.querySelector('#prev').className = 'page-item' 
              }
          else {
            document.querySelector('#prev').className = 'page-item disabled'
          }
          if (last_p == p_count) {
            document.querySelector('#next').className = 'page-item disabled' 
      }
  else {
    document.querySelector('#next').className = 'page-item'
  }
          all_posts(q)
      })  
      document.querySelector('#next').append(a_l)




    
     }
  }) 
}

function all_posts(q) {
    var aut_user = ''
    fetch('/a_user')
    .then(response => response.json())
    .then(au_user => {
      
        aut_user = au_user.au_user
    })
    fetch(q)
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
    
      
    pagination()
    fetch('/a_user')
    .then(response => response.json())
    .then(au_user => {
      if (au_user.au_user != 'not_aut') {
      document.querySelector('#post-form').onsubmit = function(){
    new_post()
    return false
  };
}
    })
  
      
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
      document.querySelector('#d_post').innerHTML = ""
      tx.value = "";
      setTimeout(() => {
        document.querySelector('#prev').innerHTML = ""
        document.querySelector('#next').innerHTML = ""
        pagination();
      }, 50)
     
}