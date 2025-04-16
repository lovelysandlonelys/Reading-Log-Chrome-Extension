/* To implement:
    -Add functionality for rating dropdown
    -Fix popup window bottom being too long
*/

document.getElementById("submitButton").addEventListener("click", function() {
    let titleInput = document.getElementById("title").value;
    if (titleInput != "")
        console.log(titleInput);  /* For debugging */

    let authorInput = document.getElementById("author").value;
    if (authorInput != "")
        console.log(authorInput); /* For debugging */

    let formInput = document.getElementById("form").value;
    if (formInput != "")
        console.log(formInput); /* For debugging */

    let genreInput = document.getElementById("genre").value;
    if (genreInput != "")
        console.log(genreInput); /* For debugging */

    // I don't think this works properly btw. This is before I converted it to the star system that doesn't work yet.
    let ratingInput = document.getElementById("rating").value;
    if (ratingInput != "")
        console.log(ratingInput); /* For debugging */

    let wordsReadInput = document.getElementById("wordsRead").value;
    if (wordsReadInput != "")
        console.log(wordsReadInput); /* For debugging */

    let notesInput = document.getElementById("notes").value;
    if (notesInput != "")
        console.log(notesInput); /* For debugging */
});
