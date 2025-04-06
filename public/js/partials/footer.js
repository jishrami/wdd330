export function footer() {
    const footerEl = document.getElementById("main-footer");

    const footerContent = `
    <p>&copy; Josh Ramirez ${new Date().getFullYear()}</p>
    `;

    footerEl.innerHTML = footerContent;
}

// TODO: add visitor count, maybe #StretchGoal
// function visitors() {
//     return localStorage.getItem("visitors") || 0;
// }