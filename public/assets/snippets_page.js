function loadMain() {
    chrome.storage.sync.get(["snippets"], async ({ snippets }) => {
        const main = document.querySelector("main");
        if (snippets && snippets.length) {
            const fragment = document.createDocumentFragment();
            snippets.forEach((item) => {
                const div = document.createElement("div");
                const h3 = document.createElement("h3");
                h3.textContent = item.href;
                const p = document.createElement("p");
                p.textContent = item.text;
                const button = document.createElement("button");
                button.textContent = "Delete";
                button.addEventListener("click", (e) => deleteItem(item.id));
                div.append(h3, p, button);
                fragment.appendChild(div);
            });
            main.innerHTML = "";
            main.appendChild(fragment);
        } else {
            main.innerHTML = "<h2>You have no saved snippets</h2>";
        }
    });
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    const [key] = Object.keys(changes);
    if (key === "snippets") {
        loadMain();
    }
});

function deleteItem(id) {
    chrome.storage.sync.get(["snippets"], async ({ snippets }) => {
        snippets = snippets.filter((item) => item.id !== id);
        await chrome.storage.sync.set({ snippets });
        loadMain();
    });
}

loadMain();
