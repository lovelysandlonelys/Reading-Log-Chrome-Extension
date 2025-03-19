/* To implement:
    -Make entirety of notes section typable lol
    -Add dropdown for rating
    -Move Form and Genre dropdowns to below the labels like the other ones

*/

document.getElementById("submitButton").addEventListener("click", function() {
    let titleInput = document.getElementById("title").value;
    console.log(titleInput);  /* For debugging */

    let authorInput = document.getElementById("author").value;
    console.log(authorInput); /* For debugging */

    let formInput = document.getElementById("form").value;
    console.log(formInput); /* For debugging */

    let genreInput = document.getElementById("author").value;
    console.log(genreInput); /* For debugging */

    let ratingInput = document.getElementById("rating").value;
    console.log(ratingInput); /* For debugging */

    let wordsReadInput = document.getElementById("wordsRead").value;
    console.log(wordsReadInput); /* For debugging */

    let notesInput = document.getElementById("notes").value;
    console.log(notesInput); /* For debugging */
});
