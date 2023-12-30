document.addEventListener('DOMContentLoaded', function() {
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
        document.querySelector('#success').style.display = 'block';
        document.querySelector('#success').innerHTML = result.message
        console.log(result.message);
      });
      return false
      /*setTimeout(() => {
        return false
      }, 5000)
      */
}