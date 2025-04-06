export function header() {
    const headerEl = document.getElementById("main-header");

    const headerContent = `
    <h1><a href="/">WDD330 Final Project</a></h1>
    `;

    headerEl.innerHTML = headerContent;
};