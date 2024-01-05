function pagination() {
  fetch("/d_posts?q=count")
    .then((response) => response.json())
    .then((count) => {
      if (count.count <= 10) {
        q = "/d_posts?q=all";
        all_posts(q);
      } else {
        all_posts("/d_posts?q=1");
        const a_f = document.createElement("a");
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
        document.querySelector("#prev").className = "page-item disabled";
        document.querySelector("#next").className = "page-item";
        a_f.className = "page-link";
        a_f.innerHTML = "Previous";
        a_f.addEventListener("click", function () {
          localStorage.setItem("pos", 0);
          last_p--;
          document.querySelector(
            "#pg"
          ).innerHTML = `Current page: ${last_p} / ${p_count}`;
          document.querySelector("#d_post").innerHTML = "";
          q = `/d_posts?q=${last_p}`;

          if (last_p != 1) {
            document.querySelector("#prev").className = "page-item";
          } else {
            document.querySelector("#prev").className = "page-item disabled";
          }
          if (last_p == p_count) {
            document.querySelector("#next").className = "page-item disabled";
          } else {
            document.querySelector("#next").className = "page-item";
          }
          all_posts(q);
        });
        document.querySelector("#prev").append(a_f);

        a_l.className = "page-link";
        a_l.innerHTML = "Next";
        a_l.addEventListener("click", function () {
          localStorage.setItem("pos", 0);
          last_p++;
          document.querySelector(
            "#pg"
          ).innerHTML = `Current page: ${last_p} / ${p_count}`;

          document.querySelector("#d_post").innerHTML = "";
          q = `/d_posts?q=${last_p}`;

          if (last_p != 1) {
            document.querySelector("#prev").className = "page-item";
          } else {
            document.querySelector("#prev").className = "page-item disabled";
          }
          if (last_p == p_count) {
            document.querySelector("#next").className = "page-item disabled";
          } else {
            document.querySelector("#next").className = "page-item";
          }
          all_posts(q);
        });
        document.querySelector("#next").append(a_l);
      }
    });
}

function all_posts(q) {
  if (!localStorage.getItem("pos")) {
    localStorage.setItem("pos", 0);
  }
  var aut_user = "";
  var is_textarea = false;
  var hist = {};
  fetch("/a_user")
    .then((response) => response.json())
    .then((au_user) => {
      aut_user = au_user.au_user;
    });
  fetch(q)
    .then((response) => response.json())
    .then((posts) => {
      posts.forEach((element) => {
        const div = document.createElement("div");
        const a2 = document.createElement("a");
        const h4 = document.createElement("h4");
        const p = document.createElement("p");
        const p2 = document.createElement("p");
        const span = document.createElement("span");
        const span2 = document.createElement("span");
        a2.setAttribute("href", `/profile/${element.user}`);
        a2.style.color = "black";
        h4.innerHTML = element.user;
        a2.append(h4);
        div.append(a2);
        if (aut_user == element.user) {
          const a = document.createElement("a");
          a.setAttribute("href", "");
          a.setAttribute("class", "link-primary");
          a.style.fontWeight = "bold";
          a.innerHTML = "Edit";

          a.addEventListener("click", function (event) {
            if (is_textarea == true) {
              document.getElementById(`a${hist["id"]}`).style.display = "block";
              document.getElementById("ta").remove();
              document.getElementById(`${hist["id"]}`).innerHTML = hist["in"];
            }
            s_id = element.id;

            const texedit = document.createElement("form");
            const tex = document.createElement("textarea");
            const tex_in = document.createElement("input");
            const c_a = document.createElement("a");
            c_a.setAttribute("href", "");
            c_a.setAttribute("class", "link-primary");
            c_a.style.fontWeight = "bold";
            c_a.innerHTML = "Cancel";
            c_a.addEventListener("click", function (event) {
              document.getElementById(`a${hist["id"]}`).style.display = "block";
              document.getElementById("ta").remove();
              document.getElementById(`${hist["id"]}`).innerHTML = hist["in"];
              is_textarea = false;
              event.preventDefault();
            });
            texedit.append(c_a);
            texedit.setAttribute("id", "ta");
            tex.setAttribute("class", "form-control");
            tex.innerHTML = element.post;
            texedit.append(tex);
            tex_in.setAttribute("type", "submit");
            tex_in.setAttribute("class", "btn btn-primary");
            tex_in.setAttribute("value", "Save");
            texedit.append(tex_in);
            console.log(tex.innerHTML);
            texedit.onsubmit = function () {
              localStorage.setItem("pos", document.documentElement.scrollTop);
              e_txt = tex.value;

              fetch("/e_post", {
                method: "POST",
                body: JSON.stringify({
                  text: e_txt,
                  id: element.id,
                }),
              });
              setTimeout(() => {
                document.querySelector("#d_post").innerHTML = "";
                all_posts(q);
              }, 50);
              return false;
            };

            a.setAttribute("id", `a${s_id}`);
            a.style.display = "none";
            p.setAttribute("id", `${s_id}`);
            hist["id"] = s_id;
            hist["in"] = p.innerHTML;
            is_textarea = true;
            p.innerHTML = "";

            p.append(texedit);
            event.preventDefault();
          });
          div.append(a);
        }
        p.setAttribute("class", "form-control");
        p.innerHTML = element.post;
        div.append(p);

        p2.setAttribute("class", "text-muted");
        p2.style.marginTop = "30px";
        p2.innerHTML = element.timestamp;
        div.append(p2);

        span.innerHTML = "thumb_up";

        span.setAttribute("class", "material-symbols-outlined");

        if (aut_user != "not_aut") {
          fetch(`/like?q=${element.id}`)
            .then((response) => response.json())
            .then((stat) => {
              if (stat.stat == "liked") {
                span.style.color = "#3B71CA";
              } else {
                span.style.color = "gray";
              }

              span.style.cursor = "pointer";
              span.addEventListener("click", function () {
                localStorage.setItem("pos", document.documentElement.scrollTop);
                fetch("/like", {
                  method: "PUT",
                  body: JSON.stringify({
                    post_id: element.id,
                  }),
                });
                setTimeout(() => {
                  document.querySelector("#d_post").innerHTML = "";
                  all_posts(q);
                }, 100);
              });
            });
        }

        div.append(span);
        span2.innerHTML = element.like;
        span2.style.padding = "5px";
        div.append(span2);
        div.setAttribute("class", "form-control");
        document.querySelector("#d_post").append(div);
      });
      window.scrollTo(0, localStorage.getItem("pos"));
    });
}

document.addEventListener("DOMContentLoaded", function () {
  localStorage.setItem("pos", 0);

  pagination();
  fetch("/a_user")
    .then((response) => response.json())
    .then((au_user) => {
      if (au_user.au_user != "not_aut") {
        document.querySelector("#post-form").onsubmit = function () {
          localStorage.setItem("pos", document.documentElement.scrollTop);
          new_post();
          return false;
        };
      }
    });
});

function new_post() {
  tx = document.querySelector("#post-body");
  fetch("/posts", {
    method: "POST",
    body: JSON.stringify({
      text: tx.value,
    }),
  }).then((response) => response.json());
  document.querySelector("#d_post").innerHTML = "";
  tx.value = "";
  setTimeout(() => {
    document.querySelector("#prev").innerHTML = "";
    document.querySelector("#next").innerHTML = "";
    pagination();
  }, 50);
}
