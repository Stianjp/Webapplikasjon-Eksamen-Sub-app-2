// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

/* To make the sidebar green for active site */
document.addEventListener("DOMContentLoaded", function () {
    var currentUrl = window.location.pathname;
    var navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(function (link) {
        if (link.getAttribute("href") === currentUrl) {
            link.classList.add("active");
            link.style.backgroundColor = 'var(--primary-green)'; // Using the css variabels and custom styles.
            link.style.color = 'var(--text-black)'; // Using the css variabels and custom styles.
        }
    });
});


/* Search functionality */
/* Possible to do server-side without JS, but yeah just not a good idea other than for SEO and to drop JS necessity */

document.getElementById('searchInput').addEventListener('keyup', function () {
    var filter = this.value.toUpperCase();
    var table = document.querySelector('table');
    var trs = table.getElementsByTagName('tr');

    for (var i = 1; i < trs.length; i++) { // Start from 1 to skip header row
        var tds = trs[i].getElementsByTagName('td');
            var found = false;
                for (var j = 0; j < tds.length; j++) {
                    if (tds[j]) {
                        var txtValue = tds[j].textContent || tds[j].innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            found = true;
                            break;
                        }
                    }
                }
                trs[i].style.display = found ? '' : 'none';
            }
 });
   