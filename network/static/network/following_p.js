function pagination() {
  fetch("/f_posts?q=count")
    .then((response) => response.json())
    .then((count) => {
      if (count.count <= 10) {
        q = "/f_posts?q=all";
        all_posts(q);
      } else {
        all_posts("/f_posts?q=1");
        const li_f = document.createElement("li");
        const a_f = document.createElement("a");
        const li_l = document.createElement("li");
        const a_l = document.createElement("a");
        var last_p = 1;
        var p_count = 0;
        var r = count.count % 10;
        if (r == 0) {
          p_count = count.count / 10;
        } else {
          p_count = 1 + (count.count - r) / 10;
        }
        document.querySelector(
          "#pg"
        ).innerHTML = `Current page: ${last_p} / ${p_count}`;

        li_f.className = "page-item disabled";

        a_f.className = "page-link";
        a_f.innerHTML = "Previous";
        a_f.addEventListener("click", function () {

          last_p--;
          document.querySelector(
            "#pg"
          ).innerHTML = `Current page: ${last_p} / ${p_count}`;
          document.querySelector("#d_post").innerHTML = "";
          q = `/f_posts?q=${last_p}`;

          if (last_p != 1) {
            li_f.className = "page-item";
          } else {
            li_f.className = "page-item disabled";
          }
          if (last_p == p_count) {
            li_l.className = "page-item disabled";
          } else {
            li_l.className = "page-item";
          }
          all_posts(q);
        });
        li_f.append(a_f);
        document.querySelector("#pagination").append(li_f);

        li_l.className = "page-item";
        a_l.className = "page-link";
        a_l.innerHTML = "Next";
        a_l.addEventListener("click", function () {

          last_p++;
          document.querySelector(
            "#pg"
          ).innerHTML = `Current page: ${last_p} / ${p_count}`;

          document.querySelector("#d_post").innerHTML = "";
          q = `/f_posts?q=${last_p}`;

          if (last_p != 1) {
            li_f.className = "page-item";
          } else {
            li_f.className = "page-item disabled";
          }
          if (last_p == p_count) {
            li_l.className = "page-item disabled";
          } else {
            li_l.className = "page-item";
          }
          all_posts(q);
        });
        li_l.append(a_l);

        document.querySelector("#pagination").append(li_l);
      }
    });
}

function all_posts(q) {
  var delay = 0;

  fetch("/a_user")
    .then((response) => response.json())
    .then((au_user) => {
      fetch(q)
        .then((response) => response.json())
        .then((posts) => {
          posts.forEach((element) => {
            setTimeout(() => {
              const div = document.createElement("div");
              const a2 = document.createElement("a");
              const h4 = document.createElement("h4");
              const p = document.createElement("p");
              const p2 = document.createElement("p");
              const i = document.createElement("i");
              const span2 = document.createElement("span");
              a2.setAttribute("href", `/profile/${element.user}`);
              a2.style.color = "black";
              h4.innerHTML = element.user;
              a2.append(h4);
              div.append(a2);
              p.setAttribute("class", "form-control");
              p.innerHTML = element.post;
              div.append(p);

              p2.setAttribute("class", "text-muted");
              p2.innerHTML = element.timestamp;
              div.append(p2);

              i.setAttribute("class", "bi bi-heart-fill");

              if (au_user != "not_aut") {
                fetch(`/like?q=${element.id}`)
                  .then((response) => response.json())
                  .then((stat) => {
                    if (stat.stat == "liked") {
                      i.style.color = "red";
                    } else {
                      i.style.color = "gray";
                    }

                    i.style.cursor = "pointer";
                    i.addEventListener("click", function () {

                      fetch("/like", {
                        method: "PUT",
                        body: JSON.stringify({
                          post_id: element.id,
                        }),
                      });
                      setTimeout(() => {
                        fetch(`/like?q=${element.id}`)
                          .then((response) => response.json())
                          .then((stat) => {
                            if (stat.stat == "liked") {
                              i.style.color = "red";
                            } else {
                              i.style.color = "gray";
                            }
                            span2.innerHTML = stat.l_co;
                          })
                      }, 100);
                    });
                  });
              }
              div.append(i);
              span2.innerHTML = element.like;
              span2.style.padding = "5px";
              div.append(span2);
              div.setAttribute("class", "form-control");
              document.querySelector("#d_post").append(div);
            }, 250 + delay);
            delay += 250
          });

        });
    });
}

document.addEventListener("DOMContentLoaded", function () {

  fetch("/a_user")
    .then((response) => response.json())
    .then((au_user) => {
      if (au_user.au_user != "not_aut") {

        document.querySelector('#u_profile').setAttribute("href", `/profile/${au_user.au_user}`);

      }
    });
  pagination();
});
