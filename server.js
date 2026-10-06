import { JSONFile } from "lowdb/node";
import { Low } from "lowdb";
import { createApp } from "json-server/lib/app.js";
import { randomId } from "json-server/lib/random-id.js";
import { watch } from "node:fs";

class NormalizedAdapterSemSchema {
    #adapter;

    constructor(adapter) {
        this.#adapter = adapter;
    }

    async read() {
        const data = await this.#adapter.read();

        if (data === null) {
            return null;
        }

        delete data["$schema"];

        for (const value of Object.values(data)) {
            if (Array.isArray(value)) {
                for (const item of value) {
                    if (typeof item["id"] === "number") {
                        item["id"] = item["id"].toString();
                    }

                    if (item["id"] === undefined) {
                        item["id"] = randomId();
                    }
                }
            }
        }

        return data;
    }

    async write(data) {
        await this.#adapter.write(data);
    }
}

const arquivo = "db.json";

const adapterArquivo = new JSONFile(arquivo);
const adapter = new NormalizedAdapterSemSchema(adapterArquivo);

const db = new Low(adapter, {});

await db.read();

if (db.data === null) {
    db.data = {};
}

const app = createApp(db);

const PORTA = 3000;

app.listen(PORTA, () => {
    console.log(`JSON Server rodando em http://localhost:${PORTA}`);
});

watch(arquivo, async () => {
    try {
        await db.read();
    } catch (erro) {
        console.error("Erro ao atualizar o banco de dados:", erro);
    }
});