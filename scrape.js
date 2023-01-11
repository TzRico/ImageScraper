/* * * * * * * * * * * * * * * *
 *                             *
 *       Image Scraper         *
 *       Author: Tz            *
 *    Discord: Tz#0001         *
 *                             *
 * * * * * * * * * * * * * * * */

// Definições
const { token, fetchChanel_id } = require("./config.json");

// Módulos
const { greenBright } = require("chalk");
const ora = require("ora");
const fs = require("fs");
const fetch = require("node-fetch");


// Começar
Main();

/**
 * Solicitar mensagens
 */
async function request(before) {
    const options = {
        method: "GET",
        headers: { authorization: token }
    };
    const spinner = ora("Enviando Pedido(s) 'GET'").start();
    setTimeout(() => {
        spinner.stop();
    }, 1000);
    const request = await fetch(
        `https://discord.com/api/channels/${fetchChanel_id}/messages?limit=100&${before ? "before=" + before : ""}`,
        options
    );
    return await request.json();
}

let result;

async function go() {
    let page = await request();
    result = page;

    while (page.length >= 100) {
        page = await request(page[page.length - 1].id);
        result = result.concat(page);
    }
    const spinner = ora("Buscando...").start();
    setTimeout(() => {
        let linkArr = [];
        spinner.succeed(greenBright(`Obtido ${result.length} mensagens`));
        const content = JSON.stringify(result, null, 2);
        fs.writeFileSync("links.json", content);
        const links = require("./links.json");
        const scraped = links.map((attach) => attach.attachments.map(url => url.proxy_url)).map((u) => u).map(u => u).map((getlink) => getlink.toString()).filter(e => e);
        // Matriz original (filtrada sem várias imagens)
        const orgArr = scraped.filter((link) => link.includes(",") === false);
        // Nova matriz (filtrada com várias imagens)
        const fil = scraped.filter((link) => link.includes(","));
        const newArr = fil.map(l =>  l.split(',') ).flat();
        const finalArr = linkArr.concat(orgArr, newArr);
        const content2 = JSON.stringify(finalArr, null, 2);
        spinner.succeed(greenBright(`Extraído ${finalArr.length} imagens | Verificar "links.json"`));
        fs.writeFileSync("links.json", content2);
        process.exit(1);
    }, 2000);
}

function Main() {
    request().then(() => { go(); });
}
