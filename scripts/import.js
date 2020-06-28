Hooks.on("renderJournalDirectory", async (app, html, data) => {
    if (game.user.isGM) {
        const button = $("<button class='import-lk'>LegendKeeper Import</button>");
        let footer = html.find(".directory-footer");
        if (footer.length === 0) {
            footer = $(`<footer class="directory-footer"></footer>`);
            html.append(footer);
        }
        footer.append(button);

        button.click(function() {
            new Dialog({
                title : "LegendKeeper Import",
                content : 
                `<div>
                <div class="form-group import"><div class="import-options">JSON</div><textarea id="lk-jsonText" name="lk-jsonText"></textarea></div>
                </div>
                `,
                buttons :{
                import : {
                    label : "Import",
                    callback : async (html) => {
                        function compress(node) {
                            let content = node.data
                            if ('children' in node) {
                                for (let i = 0; i < node.children.length; i++) {
                                    content += `<br></br><h1>${node.children[i].name}</h1>${compress(node.children[i])}`
                                }
                            }
                            return content
                        }

                        async function create(node, parent, level) {
                            console.log("Creating " + node.name)
                            if (parent != null) {
                                console.log("Under " + parent.name)
                            }

                            if (level > 3) {
                                let content = compress(node)
                                let entry = JournalEntry.create({name: node.name, content: content, folder: parent})
                            } else {
                                if ('children' in node) {
                                    let folder = await Folder.create({name: node.name, parent: parent, type: 'JournalEntry'})
                                    let entry = JournalEntry.create({name: node.name, content: node.data, folder: folder})

                                    console.log("Node has " + node.children.length + " children")
                                    console.log(node.children)

                                    for (let i = 0; i < node.children.length; i++) {
                                        await create(node.children[i], folder, level + 1)
                                    }
                                } else {
                                    let entry = JournalEntry.create({name: node.name, content: node.data, folder: parent})
                                }
                            }
                        }

                        let text = await html.find('textarea[name="lk-jsonText"]').val()
                        let content = JSON.parse(text)
                        //root = game.folders.entities.find(f => (f.data.type === "JournalEntry") && (f.name === "WIKI"));
                        let folder = await Folder.create({name: "Wiki", parent: null, type: 'JournalEntry'})

                        for (let i = 0; i < content.children.length; i++) {
                            console.log("ROOT: ")
                            console.log(content.children[i])
                            await create(content.children[i], folder, 2)
                        }
                    }
                },
                cancel: {
                    label : "Cancel"
                }
                },
                default: "import"
            }).render(true);
        })
    }
})