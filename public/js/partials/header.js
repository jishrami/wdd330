import { Nav } from "../externalServices.mjs";

export async function header() {
    const headerEl = document.getElementById("main-header");

    const headerContent = `
    <h1>WDD330 Final Project</h1>
    `;
    headerEl.innerHTML = headerContent;

    const nav = await Nav();
    headerEl.appendChild(nav);
};