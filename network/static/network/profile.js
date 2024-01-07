globalThis.flw = window.location.href.split("/").pop();

function pagination() {
  fetch(`/d_posts?q=count_p&n=${flw}`)
    .then((response) => response.json())
    .then((count) => {
      if (count.count <= 10) {
        q = `/d_posts?q=all_p&n=${flw}&p=p`;
        all_posts(q);
      } else {
        all_posts(`/d_posts?q=1&n=${flw}&p=p`);
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
          last_p--;
          document.querySelector(
            "#pg"
          ).innerHTML = `Current page: ${last_p} / ${p_count}`;
          document.querySelector("#d_post").innerHTML = "";
          q = `/d_posts?q=${last_p}&n=${flw}&p=p`;

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
          last_p++;
          document.querySelector(
            "#pg"
          ).innerHTML = `Current page: ${last_p} / ${p_count}`;

          document.querySelector("#d_post").innerHTML = "";
          q = `/d_posts?q=${last_p}&n=${flw}&p=p`;

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

  fetch("/a_user")
    .then((response) => response.json())
    .then((au_user) => {
      var is_textarea = false;
      var hist = {};
      var delay = 0;
      if (au_user.au_user != "not_aut" && au_user.au_user != flw) {
        fetch(`/is_following/${flw}`)
          .then((response) => response.json())
          .then((stat) => {
            document.querySelector("#follow").innerHTML = stat.stat;
            if (stat.stat == "Following") {
              document.querySelector("#follow").style.display = "none";
              document.querySelector("#following").style.display = "block";

              document
                .querySelector("#following")
                .addEventListener("mouseover", () => {
                  document
                    .querySelector("#following")
                    .setAttribute("class", "btn btn-danger");
                  document.querySelector("#following").innerHTML = "Unfollow";
                });
              document
                .querySelector("#following")
                .addEventListener("mouseout", () => {
                  document
                    .querySelector("#following")
                    .setAttribute("class", "btn btn-secondary");
                  document.querySelector("#following").innerHTML = stat.stat;
                });
            } else {
              document.querySelector("#following").style.display = "none";
              document.querySelector("#follow").style.display = "block";
              document.querySelector("#follow").innerHTML = stat.stat;
            }
            document.querySelector("#fg_c").innerHTML = stat.following_c;

            document.querySelector("#fr_c").innerHTML = stat.follower_c;
          });
      }

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
              if (au_user.au_user == element.user) {
                const a = document.createElement("a");
                a.setAttribute("href", "");
                a.innerHTML = "Edit";
                a.addEventListener("click", function (event) {
                  if (is_textarea == true) {
                    document.getElementById(`a${hist["id"]}`).style.display =
                      "block";
                    document.getElementById("ta").remove();
                    document.getElementById(`${hist["id"]}`).innerHTML =
                      hist["in"];
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
                    document.getElementById(`a${hist["id"]}`).style.display =
                      "block";
                    document.getElementById("ta").remove();
                    document.getElementById(`${hist["id"]}`).innerHTML =
                      hist["in"];
                    is_textarea = false;
                    event.preventDefault();
                  });

                  hist["id"] = s_id;
                  hist["in"] = p.innerHTML;

                  texedit.append(c_a);
                  texedit.setAttribute("id", "ta");
                  tex.setAttribute("class", "form-control");

                  if (hist["in"]) {
                    tex.innerHTML = hist["in"];
                  }
                  else {
                    tex.innerHTML = element.post
                  }
                  texedit.append(tex);
                  tex_in.setAttribute("type", "submit");
                  tex_in.setAttribute("class", "btn btn-primary");
                  tex_in.setAttribute("value", "Save");
                  texedit.append(tex_in);
                  texedit.onsubmit = function () {
                    e_txt = tex.value;

                    fetch("/e_post", {
                      method: "POST",
                      body: JSON.stringify({
                        text: e_txt,
                        id: element.id,
                      }),
                    });
                    setTimeout(() => {
                      fetch(`/e_post?q=${element.id}`)
                        .then((response) => response.json())
                        .then((text) => {
                          a.style.display = "block";
                          document.getElementById("ta").remove();
                          p.innerHTML = text.text
                          tex.innerHTML = ""
                          hist["id"] = s_id;
                          hist["in"] = p.innerHTML;
                          is_textarea = false;
                        })
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
              p2.innerHTML = element.timestamp;
              div.append(p2);

              i.setAttribute("class", "bi bi-heart-fill");

              if (au_user.au_user != "not_aut") {
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

function p_follow() {
  fetch(`/p_follow`, {
    method: "PUT",
    body: JSON.stringify({
      followed: flw,
    }),
  });
  setTimeout(() => {
    fetch(`/is_following/${flw}`)
      .then((response) => response.json())
      .then((stat) => {
        document.querySelector("#follow").innerHTML = stat.stat;
        if (stat.stat == "Following") {
          document.querySelector("#follow").style.display = "none";
          document.querySelector("#following").style.display = "block";

          document
            .querySelector("#following")
            .addEventListener("mouseover", () => {
              document
                .querySelector("#following")
                .setAttribute("class", "btn btn-danger");
              document.querySelector("#following").innerHTML = "Unfollow";
            });
          document
            .querySelector("#following")
            .addEventListener("mouseout", () => {
              document
                .querySelector("#following")
                .setAttribute("class", "btn btn-secondary");
              document.querySelector("#following").innerHTML = stat.stat;
            });
        } else {
          document.querySelector("#following").style.display = "none";
          document.querySelector("#follow").style.display = "block";
          document.querySelector("#follow").innerHTML = stat.stat;
        }
        document.querySelector("#fg_c").innerHTML = stat.following_c;

        document.querySelector("#fr_c").innerHTML = stat.follower_c;
      });
  }, 50);
}

document.addEventListener("DOMContentLoaded", function () {

  fetch("/a_user")
    .then((response) => response.json())
    .then((au_user) => {
      if (au_user.au_user != "not_aut" && au_user.au_user != flw) {
        document
          .querySelector("#following")
          .addEventListener("click", () => p_follow());
        document
          .querySelector("#follow")
          .addEventListener("click", () => p_follow());
      }
      if (au_user.au_user != "not_aut") {

        document.querySelector('#u_profile').setAttribute("href", `/profile/${au_user.au_user}`);
      }
    });
  document.querySelector("#prev").innerHTML = "";
  document.querySelector("#next").innerHTML = "";

  pagination();
});
