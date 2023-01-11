// Definições
const { webHook_id, webHook_token } = require("./config.json");
const { greenBright, red, grey, yellowBright } = require("chalk");
const ora = require("ora");
const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout });

// Módulos
const { WebhookClient } = require("discord.js");

// Webhook
const webhookCli = new WebhookClient(webHook_id, webHook_token);

readline.question(grey("[?] Deseja postar esses links? (Y/N) "), (answr) => {
    if (answr === "Y" || answr === "y" || answr === "Yes" || answr === "yes" || answr === "YES") return Post()
    if (answr === "N" || answr === "n" || answr === "No" || answr === "no" || answr === "NO") return process.exit(1);
});

/**
 * Publica links para um canal especificado
 */
function Post() {
    const spinner = ora("Preparando para postar").start();
    const fetchLinks = require("./links.json")
    fetchLinks.forEach((link, index) => {
        webhookCli.send(link).then((msg) => { spinner.succeed(greenBright(`[${index}] Link Postado: ${yellowBright(msg.content)}`))}).catch((err) => { spinner.fail(red(`[${index}] Link não postado | ${err}`))})
    });
}