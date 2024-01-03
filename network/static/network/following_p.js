function pagination() {
    fetch('/f_posts?q=count')
    .then(response => response.json())
    .then(count => {
       //console.log(count.count)
       if (count.count <= 10) {
        q = '/f_posts?q=all'
        all_posts(q)
       }
       else {
        all_posts('/f_posts?q=1')
        const li_f = document.createElement('li');
        const a_f = document.createElement('a');
        const li_l = document.createElement('li');
        const a_l = document.createElement('a');
        var last_p = 1
          var p_count = 0
        var r = count.count % 10;
        if (r == 0) {p_count = count.count / 10;}
        else {p_count = 1 + ((count.count - r)/ 10);}
        document.querySelector('#pg').innerHTML = `Current page: ${last_p} / ${p_count}`
        
        li_f.className = 'page-item disabled'
       
        a_f.className = 'page-link'
        a_f.innerHTML = 'Previous'
        a_f.addEventListener('click', function() {
            

            last_p--
            document.querySelector('#pg').innerHTML = `Current page: ${last_p} / ${p_count}`
           document.querySelector('#d_post').innerHTML = ""
           q = `/f_posts?q=${last_p}`

           if (last_p != 1) {
                li_f.className = 'page-item' 
                }
            else {
                li_f.className = 'page-item disabled'
            }
            if (last_p == p_count) {
        li_l.className = 'page-item disabled' 
        }
    else {
        li_l.className = 'page-item'
    }
            all_posts(q)
        })  
        li_f.append(a_f)
        document.querySelector('#pagination').append(li_f);


        

      
        li_l.className = 'page-item'
        a_l.className = 'page-link'
        a_l.innerHTML = 'Next'
        a_l.addEventListener('click', function() {
            

            last_p++
            document.querySelector('#pg').innerHTML = `Current page: ${last_p} / ${p_count}`
           
           document.querySelector('#d_post').innerHTML = ""
           q = `/f_posts?q=${last_p}`

           if (last_p != 1) {
                li_f.className = 'page-item' 
                }
            else {
                li_f.className = 'page-item disabled'
            }
            if (last_p == p_count) {
        li_l.className = 'page-item disabled' 
        }
    else {
        li_l.className = 'page-item'
    }
            all_posts(q)
        })  
        li_l.append(a_l)




        document.querySelector('#pagination').append(li_l);
      
       }
    }) 
}


function all_posts(q) {

    
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

   //console.log(element);
   }
)
   })  
     

 }

document.addEventListener('DOMContentLoaded', function() {
pagination()
  
})
